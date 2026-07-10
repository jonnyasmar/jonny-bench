import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, readdir, readFile, symlink, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { extractUsage } from '../bin/jonny-bench.mjs';
import { scanText } from '../bin/leak-scan.mjs';
import './embed-harness.test.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const runner = path.join(repoRoot, 'bin', 'jonny-bench.mjs');
const validator = path.join(repoRoot, 'scripts', 'validate-manifest.mjs');
const fakeCli = path.join(repoRoot, 'test', 'fixtures', 'fake-cli.mjs');
const baseChildPath = ['/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/bin', '/opt/homebrew/bin'];

async function makeRepo({
  mode = 'normal',
  capMinutes = 1,
  modelSlug = 'fake-model',
  cliName = 'fake',
  includeAuth = false,
  authWriteTo = '$RUN_HOME/auth/auth.json',
  seedTo = '$RUN_HOME/auth/seed.json',
  invalidSeedJson = false,
  streamLeak = null,
  artifactLeak = null,
  appPathLeak = false,
  usePathResolvedBin = false,
  modelEffort = 'high'
} = {}) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'jonny-bench-test-'));
  const home = path.join(root, 'real-home');
  await mkdir(path.join(home, '.fake'), { recursive: true });
  await writeFile(path.join(home, '.fake', 'cred.json'), '{"token":"secret"}\n', { mode: 0o600 });
  if (includeAuth) {
    await writeFile(path.join(home, 'source.json'), invalidSeedJson
      ? '{"oauthAccount":'
      : JSON.stringify({
          oauthAccount: { accountUuid: 'acct-123' },
          ignored: 'drop me'
        }, null, 2));
  }
  await mkdir(path.join(root, 'benches', 'tiny'), { recursive: true });
  await writeFile(path.join(root, 'package.json'), '{"type":"module","private":true}\n');
  const primaryModel = { displayName: modelSlug, vendor: 'Test', cli: cliName, modelArg: 'fake-model-arg' };
  if (modelEffort !== undefined) primaryModel.effort = modelEffort;
  await writeFile(path.join(root, 'models.json'), JSON.stringify({
    [modelSlug]: primaryModel,
    'no-effort-model': { displayName: 'No Effort Model', vendor: 'Test', cli: cliName, modelArg: 'no-effort-arg' },
    'fable-5': { displayName: 'Fable 5', vendor: 'Test', cli: 'fake', modelArg: 'fable-model-arg', effort: 'high' }
  }, null, 2));
  let recipeBin = process.execPath;
  let customBin = null;
  let parentPath = process.env.PATH || '';
  if (usePathResolvedBin) {
    customBin = path.join(root, 'custom-bin');
    await mkdir(customBin, { recursive: true });
    recipeBin = 'fake-node';
    await symlink(process.execPath, path.join(customBin, recipeBin));
    parentPath = `${customBin}${path.delimiter}${parentPath}`;
  }
  const fakeEnv = {
    HOME: '$RUN_HOME',
    FAKE_RECORD: '$RUN_DIR/fake-record.json',
    FAKE_MODE: mode,
    CUSTOM_ENV: 'model=$MODEL_ARG session=$SESSION_ID',
    PROMPT_COPY: '$PROMPT'
  };
  if (streamLeak) fakeEnv.FAKE_STREAM_LEAK = streamLeak;
  if (artifactLeak) fakeEnv.FAKE_ARTIFACT_LEAK = artifactLeak;
  if (appPathLeak) fakeEnv.FAKE_APP_PATH = '$HOME/private-project';
  const fakeRecipe = {
    bin: recipeBin,
    versionArgv: ['--version'],
    credsFiles: ['.fake/cred.json'],
    env: fakeEnv,
    argv: [fakeCli, '--model', '$MODEL_ARG', '--effort', '$EFFORT', '--config', 'effort=$EFFORT', '--session', '$SESSION_ID', '--prompt', '$PROMPT', '--artifact', '$RUN_DIR/raw-output.txt', '--home-template', '$HOME/profile.json'],
    transcriptGlob: '$RUN_HOME/transcripts/$SESSION_ID.jsonl',
    preCreateDirs: ['$RUN_HOME/.fake']
  };
  if (includeAuth) {
    fakeEnv.AUTH_FILE = '$RUN_HOME/auth/auth.json';
    fakeEnv.SEED_FILE = '$RUN_HOME/auth/seed.json';
    fakeRecipe.authExec = {
      argv: [process.execPath, '-e', 'console.log(JSON.stringify({fake:true}))'],
      writeTo: authWriteTo
    };
    fakeRecipe.seedFiles = [{
      from: '$HOME/source.json',
      pickKeys: ['oauthAccount'],
      extra: { hasCompletedOnboarding: true },
      to: seedTo
    }];
  }
  await writeFile(path.join(root, 'cli-recipes.json'), JSON.stringify({ [cliName]: fakeRecipe, fake: fakeRecipe }, null, 2));
  await writeFile(path.join(root, 'benches', 'tiny', 'bench.md'), `---
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
    PATH: parentPath,
    TERM: 'xterm-256color',
    LANG: 'C.UTF-8',
    LC_ALL: 'C',
    HOME: home,
    USER: 'bench-user',
    SECRET_LEAK: 'do-not-leak',
    ATRIUM_TOKEN: 'do-not-leak'
  };
  return { root, home, env, customBin };
}

function expectedChildPath(...extraDirs) {
  return [...new Set([...baseChildPath, ...extraDirs.filter(Boolean), path.dirname(process.execPath)])].join(path.delimiter);
}

function runBench(root, env, args) {
  return spawnSync(process.execPath, [runner, ...args], {
    cwd: root,
    env,
    encoding: 'utf8',
    timeout: 20_000
  });
}

async function findRunDir(root, bench = 'tiny') {
  const runsRoot = path.join(root, 'benches', bench, 'runs');
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

  const runs = await readdir(path.join(root, 'benches', 'tiny', 'runs'));
  assert.equal(runs.length, 2);
  assert.notEqual(runs[0], runs[1]);
  assert.ok(runs.every((run) => run.startsWith('fable-5--')));
  for (const run of runs) {
    const meta = JSON.parse(await readFile(path.join(root, 'benches', 'tiny', 'runs', run, 'meta.json'), 'utf8'));
    assert.equal(meta.redactions, 0);
  }

  const validate = spawnSync(process.execPath, [validator], { cwd: root, env, encoding: 'utf8' });
  assert.equal(validate.status, 0, validate.stderr);
  const manifest = JSON.parse(await readFile(path.join(root, 'manifest.json'), 'utf8'));
  assert.equal(manifest.benches[0].runs.length, 0);
  assert.equal(manifest.benches[0].runs.some((run) => run.dryRun === true), false);
});

test('leak scanner covers secrets, emails, truncation, and home paths', () => {
  const realHome = '/Users/alice';
  const cases = [
    ['anthropic-api-key', 'sk-ant-abcdefghijklmnopqrstuvwxyz'],
    ['github-token', 'ghp_abcdefghijklmnopqrstuvwx'],
    ['aws-access-key', 'AKIAABCDEFGHIJKLMNOP'],
    ['slack-token', 'xoxb-abcdefghijklmnop'],
    ['private-key', '-----BEGIN PRIVATE KEY-----'],
    ['jwt', 'eyJabcdefghijkl.eyJmnopqrstuvwxyz'],
    ['email', 'person@example.com'],
    ['real-home-path', '/Users/alice/project']
  ];
  for (const [rule, value] of cases) {
    assert.equal(scanText(value, { realHome, user: 'alice' }).some((finding) => finding.rule === rule), true, rule);
  }
  assert.equal(scanText('sk-ant-short ghp_short AKIA123 xoxb-short eyJshort.eyJshort', { realHome }).length, 0);
  assert.equal(scanText('noreply@anthropic.com jonny@asmar.co', { realHome }).length, 0);
  assert.equal(scanText('/var/folders/alice/tmp /tmp/jonny-bench-work', { realHome }).length, 0);
  const truncated = scanText('sk-ant-abcdefghijklmnopqrstuvwxyz', { realHome })[0].match;
  assert.equal(truncated, 'sk-ant-a…');
});

test('fake CLI receives exact env, substituted argv, copied creds, and publishes artifact metadata', async () => {
  const { root, env, home } = await makeRepo();
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
  assert.equal(record.env.PATH, expectedChildPath(path.dirname(process.execPath)));
  assert.equal(record.argv[0], '--model');
  assert.equal(record.argv[1], 'fake-model-arg');
  assert.equal(record.argv[2], '--effort');
  assert.equal(record.argv[3], 'high');
  assert.equal(record.argv[4], '--config');
  assert.equal(record.argv[5], 'effort=high');
  assert.equal(record.argv[6], '--session');
  assert.match(record.argv[7], /^[0-9a-f-]{36}$/);
  assert.equal(record.argv[8], '--prompt');
  assert.equal(record.argv[9], 'Build a tiny app.\nKeep this prompt as one argv element.\n');
  assert.equal(record.argv[10], '--artifact');
  assert.ok(path.isAbsolute(record.argv[11]));
  assert.equal(record.argv[12], '--home-template');
  assert.ok(path.isAbsolute(record.argv[13]));
  assert.equal(record.argv.length, 14);
  assert.equal(record.env.PROMPT_COPY, 'Build a tiny app.\nKeep this prompt as one argv element.\n');
  assert.equal(record.env.CUSTOM_ENV, `model=fake-model-arg session=${record.argv[7]}`);

  assert.ok(record.cred.path.startsWith(record.env.HOME));
  assert.equal(record.cred.mode, 0o600);
  assert.equal(existsSync(record.env.HOME), false, 'RUN_HOME should be removed after the run');
  assert.equal((await listFiles(path.join(root, 'benches'))).some((file) => path.basename(file) === 'cred.json'), false);

  assert.ok(existsSync(path.join(runDir, 'app', 'index.html')));
  const meta = JSON.parse(await readFile(path.join(runDir, 'meta.json'), 'utf8'));
  assert.equal(meta.status, 'ok');
  assert.equal(meta.exitReason, 'completed');
  assert.equal(meta.bench, 'tiny');
  assert.equal(meta.model, 'fake-model');
  assert.equal(meta.effort, 'high');
  assert.equal(meta.cli, 'fake');
  assert.equal(meta.totalTokens, null);
  assert.equal(meta.totalCostUsd, null);
  assert.deepEqual(meta.argv, [fakeCli, '--model', 'fake-model-arg', '--effort', 'high', '--config', 'effort=high', '--session', record.argv[7], '--prompt', '[prompt]', '--artifact', '$RUN_DIR/raw-output.txt', '--home-template', '$HOME/profile.json']);
  assert.equal(path.isAbsolute(meta.argv[11]), false);
  assert.equal(meta.argv[11].includes(root), false);
  assert.equal(path.isAbsolute(meta.argv[13]), false);
  assert.equal(meta.argv[13].includes(home), false);

  const manifest = JSON.parse(await readFile(path.join(root, 'manifest.json'), 'utf8'));
  assert.equal(manifest.benches[0].runs[0].appPath.endsWith('/app/index.html'), true);
  assert.equal(manifest.benches[0].runs[0].transcriptPath.endsWith('/transcript.jsonl'), true);
  assert.equal(manifest.benches[0].runs[0].displayName, 'fake-model');
  assert.equal(manifest.benches[0].runs[0].vendor, 'Test');
  assert.equal(manifest.benches[0].runs[0].effort, 'high');
  assert.deepEqual(manifest.benches[0].runs[0].argv, meta.argv);
});

test('EFFORT substitution records effort and omits flag pairs when effort is null', async () => {
  const { root, env } = await makeRepo();
  const result = runBench(root, env, ['run', 'tiny', '--model', 'no-effort-model', '--no-push', '--no-screenshot']);
  assert.equal(result.status, 0, result.stderr);

  const runDir = await findRunDir(root);
  const record = JSON.parse(await readFile(path.join(runDir, 'fake-record.json'), 'utf8'));
  assert.equal(record.argv.includes('--effort'), false);
  assert.equal(record.argv.includes('--config'), false);
  assert.equal(record.argv.some((arg) => arg.includes('effort=')), false);
  assert.equal(record.argv[0], '--model');
  assert.equal(record.argv[1], 'no-effort-arg');
  assert.equal(record.argv[2], '--session');
  assert.equal(record.argv[4], '--prompt');

  const meta = JSON.parse(await readFile(path.join(runDir, 'meta.json'), 'utf8'));
  assert.equal(meta.effort, null);
  assert.equal(meta.argv.includes('--effort'), false);
  assert.equal(meta.argv.includes('--config'), false);
  assert.equal(meta.argv.some((arg) => arg.includes('effort=')), false);
});

test('child PATH is minimal and recipe bin is resolved before spawn', async () => {
  const { root, env, customBin } = await makeRepo({ usePathResolvedBin: true });
  const result = runBench(root, env, ['run', 'tiny', '--model', 'fake-model', '--no-push', '--no-screenshot']);
  assert.equal(result.status, 0, result.stderr);
  const runDir = await findRunDir(root);
  const record = JSON.parse(await readFile(path.join(runDir, 'fake-record.json'), 'utf8'));
  assert.equal(record.env.PATH, expectedChildPath(customBin));
  assert.equal(record.env.PATH.includes(env.PATH), false);
});

test('leak gate blocks secret streams without committing', async () => {
  const secret = 'sk-ant-abcdefghijklmnopqrstuvwxyz';
  const { root, env } = await makeRepo({ streamLeak: secret });
  const result = runBench(root, env, ['run', 'tiny', '--model', 'fake-model', '--no-push', '--no-screenshot']);
  assert.equal(result.status, 2);
  assert.match(result.stderr, /anthropic-api-key/);
  assert.doesNotMatch(result.stderr, new RegExp(secret));
  const count = execFileSync('git', ['rev-list', '--count', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  assert.equal(count, '1');
});

test('leak gate scans extra text artifacts under the run dir before committing', async () => {
  const secret = 'sk-ant-abcdefghijklmnopqrstuvwxyz';
  const { root, env } = await makeRepo({ artifactLeak: secret });
  const result = runBench(root, env, ['run', 'tiny', '--model', 'fake-model', '--no-push', '--no-screenshot']);
  assert.equal(result.status, 2);
  assert.match(result.stderr, /raw-output\.txt:1 anthropic-api-key/);
  assert.doesNotMatch(result.stderr, new RegExp(secret));
  const count = execFileSync('git', ['rev-list', '--count', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  assert.equal(count, '1');
});

test('leak gate redacts real-home paths and records redaction count', async () => {
  const { root, env, home } = await makeRepo({ appPathLeak: true });
  const result = runBench(root, env, ['run', 'tiny', '--model', 'fake-model', '--no-push', '--no-screenshot']);
  assert.equal(result.status, 0, result.stderr);
  const runDir = await findRunDir(root);
  const app = await readFile(path.join(runDir, 'app', 'index.html'), 'utf8');
  assert.equal(app.includes(home), false);
  assert.equal(app.includes('private-project'), false);
  assert.equal(app.includes('/Users/redacted'), true);
  const meta = JSON.parse(await readFile(path.join(runDir, 'meta.json'), 'utf8'));
  assert.ok(meta.redactions >= 1);
});

test('authExec writes stdout 0600 and seedFiles pick and merge JSON into RUN_HOME', async () => {
  const { root, env } = await makeRepo({ includeAuth: true });
  const result = runBench(root, env, ['run', 'tiny', '--model', 'fake-model', '--no-push', '--no-screenshot']);
  assert.equal(result.status, 0, result.stderr);

  const runDir = await findRunDir(root);
  const record = JSON.parse(await readFile(path.join(runDir, 'fake-record.json'), 'utf8'));
  assert.equal(record.auth.mode, 0o600);
  assert.equal(record.auth.text, '{"fake":true}\n');
  assert.equal(record.seed.mode, 0o600);
  assert.deepEqual(JSON.parse(record.seed.text), {
    oauthAccount: { accountUuid: 'acct-123' },
    hasCompletedOnboarding: true
  });
  assert.ok(record.auth.path.startsWith(record.env.HOME));
  assert.ok(record.seed.path.startsWith(record.env.HOME));
  assert.equal(existsSync(record.env.HOME), false, 'RUN_HOME should be removed after the run');
});

test('claude usage extraction prefers cli-output over transcript', async () => {
  const { root, env } = await makeRepo({ cliName: 'claude-code' });
  const result = runBench(root, env, ['run', 'tiny', '--model', 'fake-model', '--no-push', '--no-screenshot']);
  assert.equal(result.status, 0, result.stderr);

  const runDir = await findRunDir(root);
  const meta = JSON.parse(await readFile(path.join(runDir, 'meta.json'), 'utf8'));
  assert.equal(meta.totalTokens, 12);
  assert.equal(meta.totalCostUsd, 0.12);
});

test('authExec and seedFiles destination paths must stay inside RUN_HOME before run allocation', async () => {
  const authCase = await makeRepo({ includeAuth: true, authWriteTo: '$HOME/outside-auth.json' });
  const authResult = runBench(authCase.root, authCase.env, ['run', 'tiny', '--model', 'fake-model', '--no-push', '--no-screenshot']);
  assert.notEqual(authResult.status, 0);
  assert.match(authResult.stderr, /authExec\.writeTo must resolve inside RUN_HOME/);
  assert.equal(existsSync(path.join(authCase.root, 'benches', 'tiny', 'runs')), false);

  const seedCase = await makeRepo({ includeAuth: true, seedTo: '$HOME/outside-seed.json' });
  const seedResult = runBench(seedCase.root, seedCase.env, ['run', 'tiny', '--model', 'fake-model', '--no-push', '--no-screenshot']);
  assert.notEqual(seedResult.status, 0);
  assert.match(seedResult.stderr, /seedFiles\.to must resolve inside RUN_HOME/);
  assert.equal(existsSync(path.join(seedCase.root, 'benches', 'tiny', 'runs')), false);
});

test('seedFiles invalid JSON aborts with the source path only and no run dir', async () => {
  const { root, env, home } = await makeRepo({ includeAuth: true, invalidSeedJson: true });
  const result = runBench(root, env, ['run', 'tiny', '--model', 'fake-model', '--no-push', '--no-screenshot']);
  assert.notEqual(result.status, 0);
  const source = path.join(home, 'source.json');
  assert.match(result.stderr, new RegExp(source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.doesNotMatch(result.stderr, /oauthAccount/);
  assert.equal(existsSync(path.join(root, 'benches', 'tiny', 'runs')), false);
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
  assert.equal(manifest.benches[0].runs[0].appPath, null);
  assert.equal(manifest.benches[0].runs[0].transcriptPath.endsWith('/cli-output.jsonl'), true);
});

test('wall-clock cap still publishes the app and a best-effort partial usage total', async () => {
  const { root, env } = await makeRepo({ mode: 'cap-with-app', capMinutes: 0.01, cliName: 'claude-code' });
  const result = runBench(root, env, ['run', 'tiny', '--model', 'fake-model', '--no-push', '--no-screenshot']);
  assert.equal(result.status, 0, result.stderr);
  const runDir = await findRunDir(root);
  const meta = JSON.parse(await readFile(path.join(runDir, 'meta.json'), 'utf8'));
  assert.equal(meta.exitReason, 'cap');
  assert.equal(meta.status, 'failed');
  assert.equal(existsSync(path.join(runDir, 'app', 'index.html')), true);
  assert.equal(meta.totalTokens, 180);
  assert.equal(meta.totalCostUsd, null);
  const manifest = JSON.parse(await readFile(path.join(root, 'manifest.json'), 'utf8'));
  assert.equal(manifest.benches[0].runs[0].appPath.endsWith('/app/index.html'), true);
});

test('preflight refuses dirty files outside run dirs and manifest before spawning', async () => {
  const { root, env } = await makeRepo();
  await writeFile(path.join(root, 'stray.txt'), 'dirty\n');
  const result = runBench(root, env, ['run', 'tiny', '--model', 'fake-model', '--no-push', '--no-screenshot']);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Refusing to publish/);
  assert.equal(existsSync(path.join(root, 'benches', 'tiny', 'runs')), false);
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
  assert.ok(names.every((name) => name === 'manifest.json' || /^benches\/tiny\/runs\/fake-model--[^/]+\//.test(name)), names.join('\n'));
  const count = execFileSync('git', ['rev-list', '--count', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  assert.equal(count, '2');
});

test('usage extraction supports claude, codex, and absent usage shapes', () => {
  const claude = [
    JSON.stringify({ type: 'assistant', message: { usage: { input_tokens: 3, output_tokens: 4 } } }),
    JSON.stringify({ type: 'assistant', message: { usage: { input_tokens: 9, output_tokens: 10 } } }),
    JSON.stringify({
      type: 'result',
      total_cost_usd: 1.4622195,
      usage: {
        input_tokens: 3947,
        output_tokens: 30239,
        cache_read_input_tokens: 2314925,
        cache_creation_input_tokens: 50259
      }
    })
  ].join('\n');
  assert.deepEqual(extractUsage('claude-code', claude), { totalTokens: 2399370, totalCostUsd: 1.4622195 });

  const claudeCappedMidTurn = [
    JSON.stringify({ type: 'assistant', message: { usage: { input_tokens: 100, output_tokens: 50 } } }),
    JSON.stringify({ type: 'assistant', message: { usage: { input_tokens: 20, output_tokens: 10 } } })
  ].join('\n');
  assert.deepEqual(extractUsage('claude-code', claudeCappedMidTurn), { totalTokens: 180, totalCostUsd: null });

  const codex = [
    JSON.stringify({
      ts: '2026-07-09T18:35:00.000Z',
      stream: 'stdout',
      text: `${JSON.stringify({ type: 'turn.completed', usage: { input_tokens: 7, cached_input_tokens: 2, output_tokens: 8, reasoning_output_tokens: 3 } })}\n{"type":"turn.`
    }),
    JSON.stringify({
      ts: '2026-07-09T18:35:02.000Z',
      stream: 'stdout',
      text: `completed","usage":{"input_tokens":10,"cached_input_tokens":9,"output_tokens":20,"reasoning_output_tokens":11}}\n`
    }),
    JSON.stringify({ ts: '2026-07-09T18:35:03.000Z', stream: 'stderr', text: 'ignored\n' })
  ].join('\n');
  assert.deepEqual(extractUsage('codex', codex), { totalTokens: 30, totalCostUsd: null });

  const rollout = [
    JSON.stringify({ type: 'event_msg', payload: { type: 'token_count', info: { total_token_usage: { input_tokens: 10, output_tokens: 5, total_tokens: 15 } } } }),
    JSON.stringify({ type: 'event_msg', payload: { type: 'token_count', info: { total_token_usage: { input_tokens: 20, output_tokens: 6, total_tokens: 26 } } } })
  ].join('\n');
  assert.deepEqual(extractUsage('codex', rollout), { totalTokens: 26, totalCostUsd: null });

  const realCodexRolloutExcerpt = [
    JSON.stringify({ type: 'event_msg', payload: { type: 'agent_message', phase: 'final_answer' } }),
    JSON.stringify({
      type: 'event_msg',
      payload: {
        type: 'token_count',
        info: {
          total_token_usage: {
            input_tokens: 419579,
            cached_input_tokens: 395008,
            output_tokens: 13781,
            reasoning_output_tokens: 1877,
            total_tokens: 433360
          }
        }
      }
    }),
    JSON.stringify({ type: 'event_msg', payload: { type: 'task_complete' } })
  ].join('\n');
  assert.equal(extractUsage('codex', realCodexRolloutExcerpt).totalTokens, 433360);
  assert.deepEqual(extractUsage('claude-code', '{"type":"message"}\n'), { totalTokens: null, totalCostUsd: null });
});
