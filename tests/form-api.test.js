'use strict';

// Auto tests for the contact form endpoint api/server.js (issue #83).
// Run with: node --test tests/*.test.js

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createServer } = require('../api/server.js');

const VALID = { name: 'Test User', email: 'test@example.com', message: 'Hello from the auto tests.' };

test('form endpoint: health, validation, honeypot and rate limiting', async (t) => {
    const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'quasar-form-api-'));
    const app = createServer({ dataDir, rateMax: 3, rateWindowMinutes: 10 });
    const port = await app.listen(0);
    const base = `http://127.0.0.1:${port}`;

    // The subtests are awaited so they run sequentially against one server
    // instance (subtests run in parallel by default) - the rate-limiting
    // expectations below depend on the exact request order.
    await t.test('GET /api/health answers ok', async () => {
        const res = await fetch(`${base}/api/health`);
        assert.equal(res.status, 200);
        assert.deepEqual(await res.json(), { ok: true, service: 'form-api' });
    });

    await t.test('unknown routes answer 404', async () => {
        const res = await fetch(`${base}/api/nope`);
        assert.equal(res.status, 404);
        assert.equal((await res.json()).ok, false);
    });

    await t.test('rejects an invalid email with 400', async () => {
        const res = await fetch(`${base}/api/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...VALID, email: 'not-an-email' }),
        });
        assert.equal(res.status, 400);
        assert.equal((await res.json()).ok, false);
    });

    await t.test('rejects an empty message with 400', async () => {
        const res = await fetch(`${base}/api/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...VALID, message: '   ' }),
        });
        assert.equal(res.status, 400);
    });

    await t.test('rejects a malformed JSON body with 400', async () => {
        const res = await fetch(`${base}/api/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: '{not json',
        });
        assert.equal(res.status, 400);
    });

    await t.test('rejects an oversized payload with 413', async () => {
        const res = await fetch(`${base}/api/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...VALID, message: 'x'.repeat(64 * 1024) }),
        });
        assert.equal(res.status, 413);
    });

    await t.test('accepts a valid submission', async () => {
        const res = await fetch(`${base}/api/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(VALID),
        });
        assert.equal(res.status, 200);
        assert.deepEqual(await res.json(), { ok: true });
    });

    await t.test('drops a honeypot submission silently (200, not persisted)', async () => {
        const res = await fetch(`${base}/api/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...VALID, website: 'https://spam.example' }),
        });
        assert.equal(res.status, 200);
        assert.deepEqual(await res.json(), { ok: true });
    });

    await t.test('rate limits per IP after rateMax submissions', async () => {
        // Two more valid submissions fill the 3-slot window. The honeypot
        // drop and the 4xx responses above do not consume rate-limit budget.
        for (let i = 0; i < 2; i++) {
            const res = await fetch(`${base}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(VALID),
            });
            assert.equal(res.status, 200);
        }
        const limited = await fetch(`${base}/api/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(VALID),
        });
        assert.equal(limited.status, 429);
        assert.equal((await limited.json()).ok, false);
    });

    await t.test('a different client IP is not rate limited', async () => {
        const res = await fetch(`${base}/api/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '203.0.113.7' },
            body: JSON.stringify(VALID),
        });
        assert.equal(res.status, 200);
        assert.deepEqual(await res.json(), { ok: true });
    });

    await t.test('valid submissions are persisted as JSON lines', async () => {
        const file = path.join(dataDir, 'messages.jsonl');
        assert.ok(fs.existsSync(file), 'messages.jsonl is missing');
        const lines = fs.readFileSync(file, 'utf8').trim().split('\n');
        // 3 valid submissions from 127.0.0.1 + 1 from 203.0.113.7
        assert.equal(lines.length, 4);
        for (const line of lines) {
            const entry = JSON.parse(line);
            assert.equal(typeof entry.receivedAt, 'string');
            assert.equal(entry.email, 'test@example.com');
            assert.equal(entry.name, 'Test User');
        }
    });

    await app.close();
    fs.rmSync(dataDir, { recursive: true, force: true });
});
