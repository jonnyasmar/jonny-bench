import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { extractUsage } from '../bin/jonny-bench.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const runner = path.join(repoRoot, 'bin', 'jonny-bench.mjs');
const validator = path.join(repoRoot, 'scripts', 'validate-manifest.mjs');
const fakeCli = path.join(repoRoot, 'test', 'fixtures', 'fake-cli.mjs');

async function makeRepo({ mode = 'normal', capMinutes = 1, modelSlug = 'fake-model' } = {}) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'jonny-bench-test-'));
  const home = path.join(root, 'real-home');
  await mkdir(path.join(home, '.fake'), { recursive: true });
  await writeFile(path.join(home, '.fake', 'cred.json'), '{"token":"secret"}\n', { mode: 0o600 });
  await mkdir(path.join(root, 'goals', 'tiny'), { recursive: true });
  await writeFile(path.join(root, 'package.json'), '{"type":"module","private":true}\n');
  await writeFile(path.join(root, 'models.json'), JSON.stringify({
    [modelSlug]: { displayName: modelSlug, vendor: 'Test', cli: 'fake', modelArg: 'fake-model-arg' },
    'fable-5': { displayName: 'Fable 5', vendor: 'Test', cli: 'fake', modelArg: 'fable-model-arg' }
  }, null, 2));
  await writeFile(path.join(root, 'cli-recipes.json'), JSON.stringify({
    fake: {
      bin: process.execPath,
      versionArgv: ['--version'],
      credsFiles: ['.fake/cred.json'],
      env: {
        HOME: '$RUN_HOME',
        FAKE_RECORD: '$RUN_DIR/fake-record.json',
        FAKE_MODE: mode,
        CUSTOM_ENV: 'model=$MODEL_ARG session=$SESSION_ID',
        PROMPT_COPY: '$PROMPT'
      },
      argv: [fakeCli, '--model', '$MODEL_ARG', '--session', '$SESSION_ID', '--prompt', '$PROMPT'],
      transcriptGlob: '$RUN_HOME/transcripts/$SESSION_ID.jsonl',
      preCreateDirs: ['$RUN_HOME/.fake']
    }
  }, null, 2));
  await writeFile(path.join(root, 'goals', 'tiny', 'goal.md'), `---
slug: tiny
title: Tiny App
capMinutes: ${capMinutes}
suggestedBy: null
created: 2026-07-09
---
Build a tiny app.
Keep this prompt as one argv element.
`);

  execFileSync('git', ['init'], { cwd: root });
  execFileSync('git', ['config', 'user.email', 'bench@example.test'], { cwd: root });
  execFileSync('git', ['config', 'user.name', 'Bench Test'], { cwd: root });
  execFileSync('git', ['add', '.'], { cwd: root });
  execFileSync('git', ['commit', '-m', 'initial'], { cwd: root });

  const env = {
    PATH: process.env.PATH || '',
    TERM: 'xterm-256color',
    LANG: 'C.UTF-8',
    LC_ALL: 'C',
    HOME: home,
    SECRET_LEAK: 'do-not-leak',
    ATRIUM_TOKEN: 'do-not-leak'
  };
  return { root, home, env };
}

function runBench(root, env, args) {
  return spawnSync(process.execPath, [runner, ...args], {
    cwd: root,
    env,
    encoding: 'utf8',
    timeout: 20_000
  });
}

async function findRunDir(root, goal = 'tiny') {
  const runsRoot = path.join(root, 'goals', goal, 'runs');
  const entries = await readdir(runsRoot, { withFileTypes: true });
  assert.equal(entries.length, 1);
  return path.join(runsRoot, entries[0].name);
}

async function listFiles(root) {
  const files = [];
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (entry.name === '.git') continue;
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(file);
      else files.push(path.relative(root, file).replaceAll(path.sep, '/'));
    }
  }
  await walk(root);
  return files.sort();
}

test('dry-run appends run ids and validates the manifest', async () => {
  const { root, env } = await makeRepo();
  const first = runBench(root, env, ['run', 'tiny', '--model', 'fable-5', '--dry-run']);
  assert.equal(first.status, 0, first.stderr);
  const second = runBench(root, env, ['run', 'tiny', '--model', 'fable-5', '--dry-run']);
  assert.equal(second.status, 0, second.stderr);

  const runs = await readdir(path.join(root, 'goals', 'tiny', 'runs'));
  assert.equal(runs.length, 2);
  assert.notEqual(runs[0], runs[1]);
  assert.ok(runs.every((run) => run.startsWith('fable-5--')));

  const validate = spawnSync(process.execPath, [validator], { cwd: root, env, encoding: 'utf8' });
  assert.equal(validate.status, 0, validate.stderr);
  const manifest = JSON.parse(await readFile(path.join(root, 'manifest.json'), 'utf8'));
  assert.equal(manifest.goals[0].runs.length, 0);
  assert.equal(manifest.goals[0].runs.some((run) => run.dryRun === true), false);
});

test('fake CLI receives exact env, substituted argv, copied creds, and publishes artifact metadata', async () => {
  const { root, env } = await makeRepo();
  const result = runBench(root, env, ['run', 'tiny', '--model', 'fake-model', '--no-push', '--no-screenshot']);
  assert.equal(result.status, 0, result.stderr);

  const runDir = await findRunDir(root);
  const record = JSON.parse(await readFile(path.join(runDir, 'fake-record.json'), 'utf8'));
  const normalizedEnvKeys = Object.keys(record.env).filter((key) => key !== '__CF_USER_TEXT_ENCODING').sort();
  assert.deepEqual(normalizedEnvKeys, [
    'CUSTOM_ENV',
    'FAKE_MODE',
    'FAKE_RECORD',
    'HOME',
    'LANG',
    'LC_ALL',
    'PATH',
    'PROMPT_COPY',
    'TERM'
  ].sort());
  assert.equal(record.env.SECRET_LEAK, undefined);
  assert.equal(record.env.ATRIUM_TOKEN, undefined);
  assert.equal(record.argv[0], '--model');
  assert.equal(record.argv[1], 'fake-model-arg');
  assert.equal(record.argv[2], '--session');
  assert.match(record.argv[3], /^[0-9a-f-]{36}$/);
  assert.equal(record.argv[4], '--prompt');
  assert.equal(record.argv[5], 'Build a tiny app.\nKeep this prompt as one argv element.\n');
  assert.equal(record.env.PROMPT_COPY, record.argv[5]);
  assert.equal(record.env.CUSTOM_ENV, `model=fake-model-arg session=${record.argv[3]}`);

  assert.ok(record.cred.path.startsWith(record.env.HOME));
  assert.equal(record.cred.mode, 0o600);
  assert.equal(existsSync(record.env.HOME), false, 'RUN_HOME should be removed after the run');
  assert.equal((await listFiles(path.join(root, 'goals'))).some((file) => path.basename(file) === 'cred.json'), false);

  assert.ok(existsSync(path.join(runDir, 'app', 'index.html')));
  const meta = JSON.parse(await readFile(path.join(runDir, 'meta.json'), 'utf8'));
  assert.equal(meta.status, 'ok');
  assert.equal(meta.exitReason, 'completed');
  assert.equal(meta.goal, 'tiny');
  assert.equal(meta.model, 'fake-model');
  assert.equal(meta.cli, 'fake');
  assert.equal(meta.totalTokens, null);
  assert.equal(meta.totalCostUsd, null);

  const manifest = JSON.parse(await readFile(path.join(root, 'manifest.json'), 'utf8'));
  assert.equal(manifest.goals[0].runs[0].appPath.endsWith('/app/index.html'), true);
  assert.equal(manifest.goals[0].runs[0].transcriptPath.endsWith('/transcript.jsonl'), true);
  assert.equal(manifest.goals[0].runs[0].displayName, 'fake-model');
  assert.equal(manifest.goals[0].runs[0].vendor, 'Test');
});

test('wall-clock cap kills the child and still publishes a failed run', async () => {
  const { root, env } = await makeRepo({ mode: 'sleep', capMinutes: 0.01 });
  const result = runBench(root, env, ['run', 'tiny', '--model', 'fake-model', '--no-push', '--no-screenshot']);
  assert.equal(result.status, 0, result.stderr);
  const runDir = await findRunDir(root);
  const meta = JSON.parse(await readFile(path.join(runDir, 'meta.json'), 'utf8'));
  assert.equal(meta.exitReason, 'cap');
  assert.equal(meta.status, 'failed');
  assert.equal(existsSync(path.join(runDir, 'app', 'index.html')), false);
  assert.ok(existsSync(path.join(runDir, 'cli-output.jsonl')));
  const manifest = JSON.parse(await readFile(path.join(root, 'manifest.json'), 'utf8'));
  assert.equal(manifest.goals[0].runs[0].appPath, null);
  assert.equal(manifest.goals[0].runs[0].transcriptPath.endsWith('/cli-output.jsonl'), true);
});

test('preflight refuses dirty files outside run dirs and manifest before spawning', async () => {
  const { root, env } = await makeRepo();
  await writeFile(path.join(root, 'stray.txt'), 'dirty\n');
  const result = runBench(root, env, ['run', 'tiny', '--model', 'fake-model', '--no-push', '--no-screenshot']);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Refusing to publish/);
  assert.equal(existsSync(path.join(root, 'goals', 'tiny', 'runs')), false);
});

test('fake CLI run creates one commit touching only the run dir and manifest', async () => {
  const { root, env } = await makeRepo();
  const result = runBench(root, env, ['run', 'tiny', '--model', 'fake-model', '--no-push', '--no-screenshot']);
  assert.equal(result.status, 0, result.stderr);
  const subject = execFileSync('git', ['log', '-1', '--pretty=%s'], { cwd: root, encoding: 'utf8' }).trim();
  assert.match(subject, /^bench: tiny on fake-model \(fake-model--/);
  const names = execFileSync('git', ['show', '--pretty=', '--name-only', '--no-renames', 'HEAD'], { cwd: root, encoding: 'utf8' })
    .split('\n')
    .filter(Boolean);
  assert.ok(names.includes('manifest.json'));
  assert.ok(names.every((name) => name === 'manifest.json' || /^goals\/tiny\/runs\/fake-model--[^/]+\//.test(name)), names.join('\n'));
  const count = execFileSync('git', ['rev-list', '--count', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  assert.equal(count, '2');
});

test('usage extraction supports claude, codex, and absent usage shapes', () => {
  const claude = [
    JSON.stringify({ type: 'assistant', message: { usage: { input_tokens: 3, output_tokens: 4 } } }),
    JSON.stringify({ type: 'assistant', message: { usage: { input_tokens: 9, output_tokens: 10 } } }),
    JSON.stringify({ type: 'result', total_cost_usd: 1.23, usage: { input_tokens: 5, output_tokens: 6, cache_creation_input_tokens: 7 } })
  ].join('\n');
  assert.deepEqual(extractUsage('claude-code', claude), { totalTokens: 18, totalCostUsd: 1.23 });

  const codex = [
    JSON.stringify({ type: 'turn', tokenUsage: { inputTokens: 7, outputTokens: 8 } }),
    JSON.stringify({ type: 'turn', tokenUsage: { inputTokens: 10, outputTokens: 20 } })
  ].join('\n');
  assert.deepEqual(extractUsage('codex', codex), { totalTokens: 30, totalCostUsd: null });
  assert.deepEqual(extractUsage('claude-code', '{"type":"message"}\n'), { totalTokens: null, totalCostUsd: null });
});
