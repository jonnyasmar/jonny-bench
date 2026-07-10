import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { createMemoryStorage, installStorageShim, isValidAppPath } from '../embed/harness-lib.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('embed app path validation accepts only repo app directories', () => {
  const valid = [
    'benches/flappy/runs/sonnet-5--20260709-1910/app/',
    'benches/flappy/runs/gpt-5.5--20260709-1835/app/',
    'benches/synth/runs/model.A-123/app/'
  ];
  for (const value of valid) assert.equal(isValidAppPath(value), true, value);

  const invalid = [
    '',
    '../secrets',
    'https://evil.com/x',
    '/benches/flappy/runs/run/app/',
    'benches/Flappy/runs/run/app/',
    'benches/flappy/runs/run_id/app/',
    'benches/flappy/runs/run/app',
    'benches/flappy/runs/run/app/../../'
  ];
  for (const value of invalid) assert.equal(isValidAppPath(value), false, value);
});

test('memory storage shim is ephemeral and only replaces throwing native access', () => {
  const memory = createMemoryStorage();
  assert.equal(memory.length, 0);
  assert.equal(memory.getItem('score'), null);
  memory.setItem('score', 12);
  memory.setItem('mode', 'hard');
  assert.equal(memory.length, 2);
  assert.equal(memory.getItem('score'), '12');
  assert.equal(memory.key(0), 'score');
  assert.equal(memory.key(2), null);
  memory.removeItem('score');
  assert.equal(memory.getItem('score'), null);
  memory.clear();
  assert.equal(memory.length, 0);

  const native = createMemoryStorage();
  native.setItem('existing', 'native');
  const passThrough = { sessionStorage: native };
  assert.equal(installStorageShim(passThrough, 'sessionStorage'), false);
  assert.equal(passThrough.sessionStorage, native);
  assert.equal(passThrough.sessionStorage.getItem('existing'), 'native');

  const blocked = {};
  Object.defineProperty(blocked, 'localStorage', {
    configurable: true,
    get() {
      throw new Error('SecurityError');
    }
  });
  assert.equal(installStorageShim(blocked, 'localStorage'), true);
  blocked.localStorage.setItem('best', 42);
  assert.equal(blocked.localStorage.getItem('best'), '42');
});

test('served embed harness is self-contained and mirrors the app loader pieces', async () => {
  const html = await readFile(path.join(repoRoot, 'embed', 'index.html'), 'utf8');
  assert.ok(html.includes('const APP_PATH_RE = /^benches\\/[a-z0-9-]+\\/runs\\/[A-Za-z0-9.\\-]+\\/app\\/$/;'));
  assert.match(html, /Object\.defineProperty\(window, name/);
  assert.match(html, /document\.write\(withBase/);
  assert.doesNotMatch(html, /<script[^>]+src=/i);
  assert.doesNotMatch(html, /type=["']module["']/i);
});
