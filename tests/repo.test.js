'use strict';

// Repository-level auto tests (issue #69):
// - no leftover git merge conflict markers
// - the site stays dependency-free (no package manager files)
// - the pull request CI workflow exists
// Run with: node --test tests/*.test.js

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');

const TEXT_EXTENSIONS = new Set(['.html', '.css', '.js', '.md', '.yml', '.yaml', '.json', '.txt', '.xml']);

function walkTextFiles(dir, out = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name === '.git') continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walkTextFiles(full, out);
        } else if (TEXT_EXTENSIONS.has(path.extname(entry.name).toLowerCase()) || entry.name === 'CNAME') {
            out.push(full);
        }
    }
    return out;
}

test('no git merge conflict markers left in text files', () => {
    const files = walkTextFiles(ROOT);
    assert.ok(files.length > 0, 'no text files found - repository looks empty');
    const markers = [
        /^<{7}( .+)?$/m, // <<<<<<< Updated upstream
        /^>{7}( .+)?$/m, // >>>>>>> Stashed changes
    ];
    const offenders = files.filter((file) =>
        markers.some((re) => re.test(fs.readFileSync(file, 'utf8')))
    );
    assert.deepEqual(
        offenders.map((f) => path.relative(ROOT, f)),
        [],
        `merge conflict markers found in: ${offenders.map((f) => path.relative(ROOT, f)).join(', ')}`
    );
});

test('site stays dependency-free (no package manager files)', () => {
    for (const banned of [
        'package.json',
        'package-lock.json',
        'yarn.lock',
        'bun.lockb',
        'Pipfile',
        'requirements.txt',
    ]) {
        assert.ok(
            !fs.existsSync(path.join(ROOT, banned)),
            `'${banned}' must not be committed - the site is dependency-free`
        );
    }
});

test('pull request CI workflow is configured', () => {
    const workflow = path.join(ROOT, '.github', 'workflows', 'auto-tests.yml');
    assert.ok(fs.existsSync(workflow), '.github/workflows/auto-tests.yml is missing');
    const yaml = fs.readFileSync(workflow, 'utf8');
    assert.match(yaml, /^on:/m, 'workflow has no trigger block');
    assert.match(yaml, /pull_request:/, 'workflow does not run on pull_request');
    assert.match(yaml, /jobs:/, 'workflow has no jobs');
    assert.match(yaml, /runs-on:\s*ubuntu-latest/m, 'workflow does not pin ubuntu-latest');
    assert.match(yaml, /node --test/, 'workflow does not run the node test suite');
});
