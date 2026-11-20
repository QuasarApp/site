'use strict';

// QuasarApp site - contact form endpoint (issue #83, TZ 5.4).
//
// Dependency-free Node.js HTTP service (no frameworks, no Python):
//   GET  /api/health   - liveness probe (used by the container healthcheck)
//   POST /api/contact  - validates and rate-limits a contact form submission
//
// Accepted submissions are appended as JSON lines to
// $DATA_DIR/messages.jsonl and logged to stdout, so a mail transport can be
// attached later without changing the API contract (see README.md,
// "Deployment (runbook)").

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_NAME_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_BODY_BYTES = 32 * 1024;

/**
 * Sliding-window per-IP rate limiter (in-memory, single process).
 * hit(ip) returns true when the request is allowed, false when the client
 * has already sent `max` requests inside `windowMs`.
 */
function createRateLimiter({ max, windowMs }) {
    const hits = new Map(); // ip -> [timestamps]
    const sweeper = setInterval(() => {
        const cutoff = Date.now() - windowMs;
        for (const [ip, stamps] of hits) {
            const kept = stamps.filter((t) => t > cutoff);
            if (kept.length > 0) hits.set(ip, kept);
            else hits.delete(ip);
        }
    }, Math.max(1000, windowMs / 2));
    sweeper.unref();
    return {
        hit(ip) {
            const now = Date.now();
            const cutoff = now - windowMs;
            const stamps = (hits.get(ip) || []).filter((t) => t > cutoff);
            if (stamps.length >= max) {
                hits.set(ip, stamps);
                return false;
            }
            stamps.push(now);
            hits.set(ip, stamps);
            return true;
        },
    };
}

/** Client IP: first X-Forwarded-For entry (behind Caddy) or socket peer. */
function clientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.length > 0) {
        return forwarded.split(',')[0].trim();
    }
    return req.socket.remoteAddress || 'unknown';
}

function sendJson(res, status, payload) {
    const body = JSON.stringify(payload);
    res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(body),
        'Cache-Control': 'no-store',
    });
    res.end(body);
}

function readBody(req) {
    return new Promise((resolve, reject) => {
        let size = 0;
        let tooLarge = false;
        const chunks = [];
        req.on('data', (chunk) => {
            size += chunk.length;
            if (size > MAX_BODY_BYTES) {
                // Stop storing; drain the rest so the connection can answer
                // with 413 instead of being reset mid-request.
                tooLarge = true;
                req.resume();
                return;
            }
            chunks.push(chunk);
        });
        req.on('end', () => {
            if (tooLarge) {
                const err = new Error('payload too large');
                err.status = 413;
                reject(err);
            } else {
                resolve(Buffer.concat(chunks));
            }
        });
        req.on('error', reject);
    });
}

/**
 * Build the form API. config overrides (used by the tests):
 *   port, dataDir, rateMax, rateWindowMinutes
 * Falls back to the PORT / DATA_DIR / RATE_LIMIT_MAX /
 * RATE_LIMIT_WINDOW_MINUTES environment variables.
 */
function createServer(config = {}) {
    const rateMax = Number(config.rateMax ?? process.env.RATE_LIMIT_MAX ?? 5);
    const rateWindowMs =
        Number(config.rateWindowMinutes ?? process.env.RATE_LIMIT_WINDOW_MINUTES ?? 10) * 60 * 1000;
    const dataDir = config.dataDir ?? process.env.DATA_DIR ?? path.join(__dirname, 'data');
    const messagesFile = path.join(dataDir, 'messages.jsonl');
    const limiter = createRateLimiter({ max: rateMax, windowMs: rateWindowMs });

    const server = http.createServer((req, res) => {
        const url = (req.url || '').split('?')[0];
        if (req.method === 'GET' && url === '/api/health') {
            sendJson(res, 200, { ok: true, service: 'form-api' });
            return;
        }
        if (req.method === 'POST' && url === '/api/contact') {
            handleContact(req, res);
            return;
        }
        sendJson(res, 404, { ok: false, error: 'not found' });
    });

    async function handleContact(req, res) {
        let payload;
        try {
            const raw = await readBody(req);
            payload = JSON.parse(raw.toString('utf8'));
        } catch (err) {
            if (err && err.status === 413) {
                sendJson(res, 413, { ok: false, error: 'payload too large' });
            } else {
                sendJson(res, 400, { ok: false, error: 'invalid JSON body' });
            }
            return;
        }
        if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
            sendJson(res, 400, { ok: false, error: 'invalid JSON body' });
            return;
        }

        const name = typeof payload.name === 'string' ? payload.name.trim() : '';
        const email = typeof payload.email === 'string' ? payload.email.trim() : '';
        const message = typeof payload.message === 'string' ? payload.message.trim() : '';
        const honeypot = typeof payload.website === 'string' ? payload.website : '';

        // Honeypot: bots fill the hidden "website" field - accept silently
        // without persisting and without consuming rate-limit budget.
        if (honeypot.length > 0) {
            sendJson(res, 200, { ok: true });
            return;
        }

        if (name.length === 0 || name.length > MAX_NAME_LENGTH) {
            sendJson(res, 400, { ok: false, error: 'invalid name' });
            return;
        }
        if (!EMAIL_RE.test(email)) {
            sendJson(res, 400, { ok: false, error: 'invalid email' });
            return;
        }
        if (message.length === 0 || message.length > MAX_MESSAGE_LENGTH) {
            sendJson(res, 400, { ok: false, error: 'invalid message' });
            return;
        }

        const ip = clientIp(req);
        if (!limiter.hit(ip)) {
            sendJson(res, 429, { ok: false, error: 'rate limited, please retry later' });
            return;
        }

        const entry = { receivedAt: new Date().toISOString(), ip, name, email, message };
        try {
            fs.mkdirSync(dataDir, { recursive: true });
            fs.appendFileSync(messagesFile, JSON.stringify(entry) + '\n');
        } catch (err) {
            console.error('form-api: failed to persist the message:', err.message);
        }
        console.log(JSON.stringify({ level: 'info', msg: 'contact form submission received', email }));
        sendJson(res, 200, { ok: true });
    }

    return {
        server,
        listen(port = Number(config.port ?? process.env.PORT ?? 3000)) {
            return new Promise((resolve, reject) => {
                server.once('error', reject);
                server.listen(port, () => resolve(server.address().port));
            });
        },
        close() {
            return new Promise((resolve) => {
                if (typeof server.closeAllConnections === 'function') {
                    server.closeAllConnections();
                }
                server.close(() => resolve());
            });
        },
    };
}

module.exports = { createServer, createRateLimiter };

if (require.main === module) {
    const app = createServer();
    const port = Number(process.env.PORT ?? 3000);
    app.listen(port)
        .then((actual) => console.log(`form-api listening on :${actual}`))
        .catch((err) => {
            console.error('form-api failed to start:', err.message);
            process.exit(1);
        });
    const shutdown = () => {
        app.close().then(() => process.exit(0));
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
}

