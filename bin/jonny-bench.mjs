#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { access, chmod, copyFile, cp, mkdir, mkdtemp, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { constants as fsConstants, createWriteStream, existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isTextFile, redactFile, scanPaths } from './leak-scan.mjs';

const BASE_URL = 'https://jonnyasmar.github.io/jonny-bench';
const PAYLOAD_LIMIT_BYTES = 25 * 1024 * 1024;
const ALLOWLIST_ENV = ['PATH', 'TERM', 'LANG', 'LC_ALL'];
const APP_DIR_CANDIDATES = ['dist', 'build', 'out', '.'];
const BASE_CHILD_PATH = ['/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/bin', '/opt/homebrew/bin'];

function usage(exitCode = 1) {
  const text = `Usage:
  jonny-bench run <bench> --model <slug> [--dry-run] [--no-push] [--keep-home] [--no-screenshot] [--allow-leaks]
  jonny-bench run --all --model <slug> [...]
  jonny-bench list
  jonny-bench regen [--no-push] [--no-commit]`;
  console.error(text);
  process.exit(exitCode);
}

function repoPath(...parts) {
  return path.join(process.cwd(), ...parts);
}

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

async function writeJson(file, value) {
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

async function pathExists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

function parseScalar(value) {
  const trimmed = value.trim();
  if (trimmed === 'null') return null;
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  return trimmed.replace(/^["']|["']$/g, '');
}

function parseFrontmatter(source, file) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`${file} is missing YAML frontmatter`);
  const data = {};
  for (const line of match[1].split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const idx = line.indexOf(':');
    if (idx === -1) throw new Error(`${file} has invalid frontmatter line: ${line}`);
    data[line.slice(0, idx).trim()] = parseScalar(line.slice(idx + 1));
  }
  return { data, body: match[2] };
}

export async function loadBench(slug) {
  const file = repoPath('benches', slug, 'bench.md');
  const parsed = parseFrontmatter(await readFile(file, 'utf8'), file);
  for (const key of ['slug', 'title', 'capMinutes']) {
    if (parsed.data[key] === undefined) throw new Error(`${file} missing ${key}`);
  }
  if (parsed.data.slug !== slug) throw new Error(`${file} slug ${parsed.data.slug} does not match ${slug}`);
  const instructions = (await readFile(repoPath('jonny-bench-instructions.md'), 'utf8')).trim();
  const prompt = `${instructions}\n\n---\n\n${parsed.body.trim()}\n`;
  return { ...parsed.data, prompt, file };
}

function formatLocalRunStamp(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}`;
}

async function allocateRun(benchSlug, modelSlug) {
  const base = `${modelSlug}--${formatLocalRunStamp()}`;
  const runsRoot = repoPath('benches', benchSlug, 'runs');
  await mkdir(runsRoot, { recursive: true });
  for (let i = 1; ; i += 1) {
    const runId = i === 1 ? base : `${base}-${i}`;
    const runDir = path.join(runsRoot, runId);
    if (!(await pathExists(runDir))) {
      await mkdir(runDir, { recursive: true });
      return { runId, runDir };
    }
  }
}

function buildVars({ runHome, workdir, runDir, modelArg, prompt, sessionId, effort = null, capMinutes = null }) {
  const home = process.env.HOME || os.homedir();
  const user = process.env.USER || os.userInfo().username;
  return {
    RUN_HOME: runHome,
    WORKDIR: workdir,
    RUN_DIR: runDir,
    MODEL_ARG: modelArg,
    EFFORT: effort,
    // Some CLIs impose their own internal wait timeout (e.g. agy --print-timeout,
    // default 5m) independent of our own wall-clock cap. Give recipes a
    // same-unit value a couple minutes under our own cap so the CLI's own
    // timeout never fires first and silently truncates a run our cap would
    // have allowed to keep going.
    CAP_MINUTES: Number.isFinite(capMinutes) ? `${Math.max(1, Math.floor(capMinutes) - 2)}m` : null,
    PROMPT: prompt,
    SESSION_ID: sessionId,
    HOME: home,
    USER: user
  };
}

function substitute(value, vars) {
  return String(value).replace(/\$([A-Z0-9_]+)/g, (_, key) => {
    if (!(key in vars)) return `$${key}`;
    return vars[key] ?? '';
  });
}

function referencesOptionalArgVar(value) {
  return /\$(?:EFFORT|CAP_MINUTES)\b/.test(String(value));
}

function hasOptionalArgVars(value, vars) {
  const matches = String(value).matchAll(/\$(EFFORT|CAP_MINUTES)\b/g);
  for (const match of matches) {
    const candidate = vars[match[1]];
    if (typeof candidate !== 'string' || candidate.length === 0) return false;
  }
  return true;
}

function shouldDropPreviousFlag(recipeArgv, index) {
  if (index < 1) return false;
  const previous = String(recipeArgv[index - 1]);
  const current = String(recipeArgv[index]);
  return previous.startsWith('-') && !previous.includes('=') && !current.startsWith('-');
}

export function buildSpawnArgvWithMeta(recipeArgv = [], vars) {
  const argv = [];
  const metaArgv = [];
  for (let index = 0; index < recipeArgv.length; index += 1) {
    const template = String(recipeArgv[index]);
    if (referencesOptionalArgVar(template) && !hasOptionalArgVars(template, vars)) {
      if (shouldDropPreviousFlag(recipeArgv, index)) {
        argv.pop();
        metaArgv.pop();
      }
      continue;
    }
    const substituted = substitute(template, vars);
    argv.push(substituted);
    if (template.includes('$PROMPT')) metaArgv.push('[prompt]');
    else if (/\$(?:RUN_DIR|RUN_HOME|WORKDIR|HOME|USER)\b/.test(template)) metaArgv.push(template);
    else metaArgv.push(substituted);
  }
  return { argv, metaArgv };
}

function buildSpawnArgv(recipeArgv = [], vars) {
  return buildSpawnArgvWithMeta(recipeArgv, vars).argv;
}

function redactedSpawnArgv(recipeArgv = [], argv = []) {
  return recipeArgv.map((arg, index) => {
    const template = String(arg);
    if (template.includes('$PROMPT')) return '[prompt]';
    if (/\$(?:RUN_DIR|RUN_HOME|WORKDIR|HOME|USER)\b/.test(template)) return template;
    return String(argv[index]);
  });
}

function minimalChildPath(resolvedBin) {
  const parts = [...BASE_CHILD_PATH, path.dirname(resolvedBin), path.dirname(process.execPath)];
  return [...new Set(parts.filter(Boolean))].join(path.delimiter);
}

function buildChildEnv(recipeEnv, vars, childPath) {
  const env = {};
  for (const key of ALLOWLIST_ENV) {
    if (key !== 'PATH' && process.env[key] !== undefined) env[key] = process.env[key];
  }
  for (const [key, value] of Object.entries(recipeEnv || {})) {
    env[key] = substitute(value, vars);
  }
  env.PATH = childPath;
  return env;
}

async function isExecutable(file) {
  try {
    await access(file, fsConstants.X_OK);
    return true;
  } catch {
    return false;
  }
}

async function resolveBin(bin) {
  if (bin.includes('/')) {
    const resolved = path.resolve(bin);
    return (await isExecutable(resolved)) ? resolved : null;
  }
  for (const dir of (process.env.PATH || '').split(path.delimiter)) {
    if (!dir) continue;
    const candidate = path.join(dir, bin);
    if (await isExecutable(candidate)) return candidate;
  }
  return null;
}

async function preflight(recipe, { dryRun }) {
  if (dryRun) return;
  const resolved = await resolveBin(recipe.bin);
  if (!resolved) throw new Error(`Recipe binary not found or not executable: ${recipe.bin}`);
  const realHome = process.env.HOME || os.homedir();
  for (const rel of recipe.credsFiles || []) {
    const from = path.join(realHome, rel);
    if (!(await pathExists(from))) throw new Error(`Missing credsFile in HOME: ${rel}`);
  }
  await assertCleanForPublish();
  return { binPath: resolved, childPath: minimalChildPath(resolved) };
}

function porcelainPath(line) {
  const raw = line.slice(3);
  if (raw.includes(' -> ')) return raw.split(' -> ').at(-1);
  return raw;
}

function allowedDirtyPath(file) {
  return file === 'manifest.json' || /^benches\/[^/]+\/runs\//.test(file);
}

async function assertCleanForPublish() {
  const result = await runCapture('git', ['status', '--porcelain'], { cwd: process.cwd(), env: process.env, timeoutMs: 15_000 });
  if (result.code !== 0) throw new Error(`git status failed: ${result.stderr.trim()}`);
  const offenders = result.stdout
    .split('\n')
    .filter(Boolean)
    .map(porcelainPath)
    .filter((file) => !allowedDirtyPath(file));
  if (offenders.length) {
    throw new Error(`Refusing to publish with dirty files outside benches/*/runs/ and manifest.json: ${offenders.join(', ')}`);
  }
}

async function copyCreds(runHome, credsFiles) {
  const realHome = process.env.HOME || os.homedir();
  for (const rel of credsFiles || []) {
    const from = path.join(realHome, rel);
    const to = path.join(runHome, rel);
    await mkdir(path.dirname(to), { recursive: true });
    await copyFile(from, to);
    await chmod(to, 0o600);
  }
}

async function initWorkdir(workdir) {
  await mkdir(workdir, { recursive: true });
  const result = await runCapture('git', ['init'], { cwd: workdir, env: process.env, timeoutMs: 15_000 });
  if (result.code !== 0) throw new Error(`git init failed: ${result.stderr.trim()}`);
}

async function runCapture(bin, argv, { cwd, env, timeoutMs }) {
  return new Promise((resolve) => {
    const child = spawn(bin, argv, { cwd, env, shell: false, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    const timer = timeoutMs
      ? setTimeout(() => {
          timedOut = true;
          child.kill('SIGTERM');
          setTimeout(() => child.kill('SIGKILL'), 2_000).unref();
        }, timeoutMs)
      : null;
    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString('utf8');
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString('utf8');
    });
    child.on('error', (error) => {
      if (timer) clearTimeout(timer);
      resolve({ code: null, signal: null, stdout, stderr: `${stderr}${error.message}`, timedOut });
    });
    child.on('close', (code, signal) => {
      if (timer) clearTimeout(timer);
      resolve({ code, signal, stdout, stderr, timedOut });
    });
  });
}

async function runStreaming(bin, argv, { cwd, env, runDir, capMs }) {
  const outputFile = path.join(runDir, 'cli-output.jsonl');
  const output = createWriteStream(outputFile, { flags: 'a', mode: 0o644 });
  let capped = false;
  let spawnError = null;
  const started = Date.now();

  const child = spawn(bin, argv, { cwd, env, shell: false, stdio: ['ignore', 'pipe', 'pipe'] });
  let killTimer = null;
  const termTimer = setTimeout(() => {
    capped = true;
    child.kill('SIGTERM');
    killTimer = setTimeout(() => child.kill('SIGKILL'), 10_000);
    killTimer.unref();
  }, Math.max(1, capMs));

  const writeChunk = (streamName, chunk) => {
    const text = chunk.toString('utf8');
    output.write(`${JSON.stringify({ ts: new Date().toISOString(), stream: streamName, text })}\n`);
  };

  child.stdout.on('data', (chunk) => writeChunk('stdout', chunk));
  child.stderr.on('data', (chunk) => writeChunk('stderr', chunk));
  child.on('error', (error) => {
    spawnError = error;
  });

  const closed = await new Promise((resolve) => {
    child.on('close', (code, signal) => resolve({ code, signal }));
  });
  clearTimeout(termTimer);
  if (killTimer) clearTimeout(killTimer);
  await new Promise((resolve) => output.end(resolve));

  let exitReason = 'completed';
  if (capped) exitReason = 'cap';
  else if (spawnError || closed.code !== 0) exitReason = 'error';

  return {
    ...closed,
    capped,
    spawnError,
    wallSeconds: Math.max(0, Math.ceil((Date.now() - started) / 1000)),
    exitReason,
    outputFile
  };
}

async function newestGlobMatch(pattern) {
  const firstWildcard = pattern.search(/[*?]/);
  const base = firstWildcard === -1
    ? path.dirname(pattern)
    : path.dirname(pattern.slice(0, firstWildcard));
  if (!(await pathExists(base))) return null;
  const regex = globToRegExp(pattern);
  const files = [];
  await walk(base, async (file, dirent) => {
    if (!dirent.isFile()) return;
    if (regex.test(file)) files.push({ file, stat: await stat(file) });
  });
  files.sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs);
  return files[0]?.file || null;
}

function globToRegExp(glob) {
  let out = '^';
  for (let i = 0; i < glob.length; i += 1) {
    const ch = glob[i];
    if (ch === '*') {
      if (glob[i + 1] === '*') {
        out += '.*';
        i += 1;
      } else {
        out += '[^/]*';
      }
    } else if (ch === '?') {
      out += '[^/]';
    } else {
      out += ch.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
    }
  }
  out += '$';
  return new RegExp(out);
}

async function walk(root, visitor) {
  const entries = await readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    const file = path.join(root, entry.name);
    await visitor(file, entry);
    if (entry.isDirectory()) await walk(file, visitor);
  }
}

async function locateAppDir(workdir) {
  for (const candidate of APP_DIR_CANDIDATES) {
    const dir = candidate === '.' ? workdir : path.join(workdir, candidate);
    if (await pathExists(path.join(dir, 'index.html'))) return dir;
  }
  return null;
}

async function hasBuildScript(workdir) {
  const pkg = path.join(workdir, 'package.json');
  if (!(await pathExists(pkg))) return false;
  try {
    const json = await readJson(pkg);
    return typeof json.scripts?.build === 'string';
  } catch {
    return false;
  }
}

async function maybeBuild(workdir, env) {
  const install = await runCapture('npm', ['install'], { cwd: workdir, env, timeoutMs: 10 * 60 * 1000 });
  if (install.code !== 0) return false;
  const build = await runCapture('npm', ['run', 'build'], { cwd: workdir, env, timeoutMs: 10 * 60 * 1000 });
  return build.code === 0;
}

function shouldSkipPayload(name) {
  return name === 'node_modules' || name === '.git' || name.startsWith('.');
}

async function payloadSize(root) {
  async function sizeDir(dir) {
    let total = 0;
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (shouldSkipPayload(entry.name)) continue;
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) total += await sizeDir(file);
      else if (entry.isFile()) total += (await stat(file)).size;
    }
    return total;
  }
  return sizeDir(root);
}

async function copyApp(src, dest) {
  await rm(dest, { recursive: true, force: true });
  await cp(src, dest, {
    recursive: true,
    filter: (from) => {
      if (from === src) return true;
      return !shouldSkipPayload(path.basename(from));
    }
  });
}

const ROOT_ABSOLUTE_ASSET_RE = /(?:src|href)\s*=\s*(["'])\/(?!\/)[^"']*\1/gi;

// Static early-warning for the class of bug that breaks silently on the
// real nested deployment path but not against tryScreenshot's own mount
// (or a bundler's local dev server bound to "/"): root-absolute asset
// references, which 404 once the app is served from a subdirectory.
export async function detectRootAbsoluteAssetPaths(appDir) {
  const findings = [];
  await walk(appDir, async (file, dirent) => {
    if (!dirent.isFile() || !(await isTextFile(file))) return;
    const lines = (await readFile(file, 'utf8')).split(/\r?\n/);
    lines.forEach((line, index) => {
      for (const match of line.match(ROOT_ABSOLUTE_ASSET_RE) || []) {
        findings.push({
          file: path.relative(appDir, file).replaceAll(path.sep, '/'),
          line: index + 1,
          match
        });
      }
    });
  });
  return findings;
}

function parseJsonLines(text) {
  const values = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    try {
      values.push(JSON.parse(line));
    } catch {
      // Ignore non-JSON lines from human-readable streams.
    }
  }
  return values;
}

function codexUsageTotal(usage) {
  if (!usage || typeof usage !== 'object') return 0;
  return (Number.isFinite(usage.input_tokens) ? usage.input_tokens : 0)
    + (Number.isFinite(usage.output_tokens) ? usage.output_tokens : 0);
}

function claudeUsageTotal(usage) {
  if (!usage || typeof usage !== 'object') return 0;
  return (Number.isFinite(usage.input_tokens) ? usage.input_tokens : 0)
    + (Number.isFinite(usage.cache_read_input_tokens) ? usage.cache_read_input_tokens : 0)
    + (Number.isFinite(usage.cache_creation_input_tokens) ? usage.cache_creation_input_tokens : 0)
    + (Number.isFinite(usage.output_tokens) ? usage.output_tokens : 0);
}

function unwrapStreamEvents(events) {
  const unwrapped = [];
  let stdoutText = '';
  const flushStdout = () => {
    if (!stdoutText) return;
    unwrapped.push(...parseJsonLines(stdoutText));
    stdoutText = '';
  };
  for (const event of events) {
    if (event?.stream === 'stdout' && typeof event.text === 'string') {
      stdoutText += event.text;
    } else {
      flushStdout();
      unwrapped.push(event);
    }
  }
  flushStdout();
  return unwrapped;
}

export function extractUsage(cli, text) {
  const events = unwrapStreamEvents(parseJsonLines(text));
  if (!events.length) return { totalTokens: null, totalCostUsd: null };

  if (cli === 'claude-code') {
    const final = events.findLast((event) => event.type === 'result' || Number.isFinite(event.total_cost_usd));
    if (final) {
      const usageTotal = claudeUsageTotal(final.usage ?? final.message?.usage);
      return {
        totalTokens: usageTotal > 0 ? usageTotal : null,
        totalCostUsd: Number.isFinite(final.total_cost_usd) ? final.total_cost_usd : null
      };
    }
    // No final result event (e.g. killed by the wall-clock cap mid-turn): best-effort
    // total from summing each assistant turn's own usage. No total_cost_usd without
    // the final event, so cost stays null.
    const partialTotal = events
      .filter((event) => event.type === 'assistant')
      .reduce((sum, event) => sum + claudeUsageTotal(event.message?.usage), 0);
    return { totalTokens: partialTotal > 0 ? partialTotal : null, totalCostUsd: null };
  }

  if (cli === 'codex') {
    const final = events.findLast((event) => {
      return (event.type === 'turn.completed' && event.usage)
        || (event.payload?.type === 'token_count' && event.payload?.info?.total_token_usage);
    });
    const usageTotal = final?.payload?.type === 'token_count'
      ? final.payload.info.total_token_usage.total_tokens
      : codexUsageTotal(final?.usage);
    return { totalTokens: usageTotal > 0 ? usageTotal : null, totalCostUsd: null };
  }

  return { totalTokens: null, totalCostUsd: null };
}

async function copyTranscript(recipe, vars, runDir) {
  if (!recipe.transcriptGlob) return null;
  const match = await newestGlobMatch(substitute(recipe.transcriptGlob, vars));
  if (!match) return null;
  const dest = path.join(runDir, 'transcript.jsonl');
  await copyFile(match, dest);
  return dest;
}

async function readUsageSource(transcriptPath, outputFile) {
  if (outputFile && await pathExists(outputFile)) return readFile(outputFile, 'utf8');
  if (transcriptPath) return readFile(transcriptPath, 'utf8');
  return '';
}

function assertRunHomeTarget(file, runHome, label) {
  const resolved = path.resolve(file);
  const root = path.resolve(runHome);
  if (!resolved.startsWith(`${root}${path.sep}`)) {
    throw new Error(`${label} must resolve inside RUN_HOME: ${file}`);
  }
}

async function runAuthExec(authExec, vars) {
  if (!authExec) return;
  if (!Array.isArray(authExec.argv) || authExec.argv.length === 0) {
    throw new Error('authExec.argv must be a non-empty argv array');
  }
  if (!authExec.writeTo) throw new Error('authExec.writeTo is required');
  const dest = substitute(authExec.writeTo, vars);
  assertRunHomeTarget(dest, vars.RUN_HOME, 'authExec.writeTo');
  const argv = authExec.argv.map((arg) => substitute(arg, vars));
  const result = await runCapture(argv[0], argv.slice(1), {
    cwd: process.cwd(),
    env: process.env,
    timeoutMs: 30_000
  });
  if (result.code !== 0) {
    throw new Error(`authExec failed for ${dest}: ${result.stderr.trim() || `exit ${result.code}`}`);
  }
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, result.stdout, { mode: 0o600 });
  await chmod(dest, 0o600);
}

function substituteJson(value, vars) {
  if (typeof value === 'string') return substitute(value, vars);
  if (Array.isArray(value)) return value.map((item) => substituteJson(item, vars));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, substituteJson(item, vars)]));
  }
  return value;
}

async function seedRecipeFiles(seedFiles, vars) {
  for (const spec of seedFiles || []) {
    const from = substitute(spec.from, vars);
    const to = substitute(spec.to, vars);
    assertRunHomeTarget(to, vars.RUN_HOME, 'seedFiles.to');
    let sourceText;
    try {
      sourceText = await readFile(from, 'utf8');
    } catch {
      throw new Error(`Unable to read seedFiles source: ${from}`);
    }
    let source;
    try {
      source = JSON.parse(sourceText);
    } catch {
      throw new Error(`seedFiles source is not valid JSON: ${from}`);
    }
    const picked = {};
    for (const key of spec.pickKeys || []) {
      if (Object.hasOwn(source, key)) picked[key] = source[key];
    }
    const merged = { ...picked, ...substituteJson(spec.extra || {}, vars) };
    await mkdir(path.dirname(to), { recursive: true });
    await writeFile(to, `${JSON.stringify(merged, null, 2)}\n`, { mode: 0o600 });
    await chmod(to, 0o600);
  }
}

async function runVersion(recipe, binPath, env, cwd) {
  if (!Array.isArray(recipe.versionArgv)) return null;
  const result = await runCapture(binPath, recipe.versionArgv, { cwd, env, timeoutMs: 15_000 });
  if (result.code !== 0) return null;
  const line = `${result.stdout}${result.stderr}`.trim().split(/\r?\n/)[0]?.trim();
  return line || null;
}

async function writeDryRun(bench, modelSlug, model, runId, runDir, options) {
  await mkdir(path.join(runDir, 'app'), { recursive: true });
  await writeFile(path.join(runDir, 'app', 'index.html'), `<!doctype html>
<meta charset="utf-8">
<title>${escapeHtml(bench.title)} dry run</title>
<h1>${escapeHtml(bench.title)} dry run</h1>
<p>jonny-bench fixture output.</p>
`);
  await writeFile(path.join(runDir, 'transcript.jsonl'), `${JSON.stringify({ type: 'dry-run', model: modelSlug })}\n`);
  const meta = {
    runId,
    bench: bench.slug,
    model: modelSlug,
    effort: model.effort ?? null,
    cli: model.cli,
    cliVersion: null,
    startedAt: new Date().toISOString(),
    wallSeconds: 0,
    totalTokens: 0,
    totalCostUsd: 0,
    status: 'ok',
    exitReason: 'completed',
    argv: [],
    dryRun: true
  };
  await writeMetaAfterLeakGate(runDir, meta, options);
  return meta;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

async function prepareRunHome(bench, modelSlug, model, recipe) {
  const runHome = await mkdtemp(path.join(os.tmpdir(), 'jonny-bench-home-'));
  const sessionId = randomUUID();
  const vars = buildVars({
    runHome,
    workdir: '',
    runDir: '',
    modelArg: model.modelArg || modelSlug,
    prompt: bench.prompt,
    sessionId,
    effort: model.effort ?? null,
    capMinutes: Number(bench.capMinutes)
  });
  try {
    await copyCreds(runHome, recipe.credsFiles);
    await runAuthExec(recipe.authExec, vars);
    await seedRecipeFiles(recipe.seedFiles, vars);
    return { runHome, sessionId };
  } catch (error) {
    await rm(runHome, { recursive: true, force: true });
    throw error;
  }
}

async function runReal(bench, modelSlug, model, recipe, runId, runDir, options, prepared, preflightInfo) {
  const { runHome, sessionId } = prepared;
  const workdir = await mkdtemp(path.join(os.tmpdir(), 'jonny-bench-work-'));
  const vars = buildVars({
    runHome,
    workdir,
    runDir,
    modelArg: model.modelArg || modelSlug,
    prompt: bench.prompt,
    sessionId,
    effort: model.effort ?? null,
    capMinutes: Number(bench.capMinutes)
  });
  let keepHomeNote = null;
  try {
    for (const dir of recipe.preCreateDirs || []) await mkdir(substitute(dir, vars), { recursive: true });
    await initWorkdir(workdir);

    const env = buildChildEnv(recipe.env, vars, preflightInfo.childPath);
    const cliVersion = await runVersion(recipe, preflightInfo.binPath, env, workdir);
    const recipeArgv = recipe.argv || [];
    const { argv, metaArgv } = buildSpawnArgvWithMeta(recipeArgv, vars);
    const startedAt = new Date().toISOString();
    const result = await runStreaming(preflightInfo.binPath, argv, {
      cwd: workdir,
      env,
      runDir,
      capMs: Number(bench.capMinutes) * 60 * 1000
    });

    let appDir = await locateAppDir(workdir);
    if (!appDir && await hasBuildScript(workdir)) {
      await maybeBuild(workdir, env);
      appDir = await locateAppDir(workdir);
    }

    let status = result.exitReason === 'completed' ? 'ok' : 'failed';
    let exitReason = result.exitReason;
    let rootAbsolutePaths = [];
    if (appDir) {
      const size = await payloadSize(appDir);
      if (size > PAYLOAD_LIMIT_BYTES) {
        status = 'failed';
        exitReason = 'oversize';
      } else {
        await copyApp(appDir, path.join(runDir, 'app'));
        rootAbsolutePaths = await detectRootAbsoluteAssetPaths(path.join(runDir, 'app'));
      }
    } else {
      status = 'failed';
      if (exitReason === 'completed') exitReason = 'error';
    }

    const transcriptPath = await copyTranscript(recipe, vars, runDir);
    const usageText = await readUsageSource(transcriptPath, result.outputFile);
    const usage = extractUsage(model.cli, usageText);
    const meta = {
      runId,
      bench: bench.slug,
      model: modelSlug,
      effort: model.effort ?? null,
      cli: model.cli,
      cliVersion,
      startedAt,
      wallSeconds: result.wallSeconds,
      rootAbsolutePaths,
      totalTokens: usage.totalTokens,
      totalCostUsd: usage.totalCostUsd,
      status,
      exitReason,
      argv: metaArgv
    };
    const redactionState = await redactRunArtifacts(runDir);
    if (!options.noScreenshot && await pathExists(path.join(runDir, 'app', 'index.html'))) {
      const mountPath = path.relative(process.cwd(), path.join(runDir, 'app')).replaceAll(path.sep, '/');
      await tryScreenshot(path.join(runDir, 'app'), path.join(runDir, 'screenshot.png'), mountPath);
    }
    await writeMetaAfterLeakGate(runDir, meta, options, redactionState);
    return meta;
  } finally {
    await rm(workdir, { recursive: true, force: true });
    if (options.keepHome) keepHomeNote = runHome;
    else await rm(runHome, { recursive: true, force: true });
    if (keepHomeNote) console.error(`Kept RUN_HOME: ${keepHomeNote}`);
  }
}

// Mount the app at its real published path (benches/<slug>/runs/<runId>/app/),
// not the server root, so a root-absolute asset reference 404s here exactly
// like it will on the live nested deployment -- a screenshot served from the
// root would silently mask that class of bug.
async function tryScreenshot(appDir, screenshotPath, mountPath) {
  let server;
  try {
    const prefix = `/${mountPath}/`.replace(/\/+/g, '/');
    server = createServer(async (req, res) => {
      const urlPath = decodeURIComponent(new URL(req.url || '/', 'http://127.0.0.1').pathname);
      if (!urlPath.startsWith(prefix)) {
        res.writeHead(404).end();
        return;
      }
      const rel = urlPath.slice(prefix.length) || 'index.html';
      const file = path.normalize(path.join(appDir, rel));
      if (!file.startsWith(appDir)) {
        res.writeHead(403).end();
        return;
      }
      if (!(await pathExists(file)) || (await stat(file)).isDirectory()) {
        res.writeHead(404).end();
        return;
      }
      createReadStream(file).pipe(res);
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address();
    await runCapture('npx', ['-y', 'playwright', 'screenshot', `http://127.0.0.1:${port}${prefix}`, screenshotPath], {
      cwd: process.cwd(),
      env: process.env,
      timeoutMs: 60_000
    });
  } catch (error) {
    console.error(`Skipping screenshot: ${error.message}`);
  } finally {
    if (server) await new Promise((resolve) => server.close(resolve));
  }
}

class LeakGateError extends Error {
  constructor(message) {
    super(message);
    this.exitCode = 2;
  }
}

async function collectRunTextArtifacts(runDir) {
  const files = [];
  await walk(runDir, async (file, dirent) => {
    if (dirent.isFile() && await isTextFile(file)) files.push(file);
  });
  return files;
}

async function redactRunArtifacts(runDir) {
  const files = await collectRunTextArtifacts(runDir);
  let redactions = 0;
  for (const file of files) redactions += await redactFile(file);
  return { files, redactions };
}

async function scanRunArtifacts(files, options) {
  const findings = await scanPaths(files);
  if (findings.length) {
    const lines = findings.map((finding) => {
      const rel = path.relative(process.cwd(), finding.file).replaceAll(path.sep, '/');
      return `${rel}:${finding.line} ${finding.rule} ${finding.match}`;
    });
    if (options.allowLeaks) {
      console.error(`WARNING: publishing with leak findings due to --allow-leaks\n${lines.join('\n')}`);
    } else {
      console.error(lines.join('\n'));
      throw new LeakGateError('Leak gate blocked publish; rerun with --allow-leaks to override.');
    }
  }
}

async function writeMetaAfterLeakGate(runDir, meta, options, redactionState = null) {
  const state = redactionState || await redactRunArtifacts(runDir);
  await scanRunArtifacts(state.files, options);
  await writeJson(path.join(runDir, 'meta.json'), { ...meta, redactions: state.redactions });
  return state.redactions;
}

async function gitAddCommitPush(benchSlug, modelSlug, runId, runDir, noPush) {
  const relRunDir = path.relative(process.cwd(), runDir);
  let result = await runCapture('git', ['add', relRunDir, 'manifest.json'], { cwd: process.cwd(), env: process.env, timeoutMs: 30_000 });
  if (result.code !== 0) throw new Error(`git add failed: ${result.stderr.trim()}`);
  result = await runCapture('git', ['commit', '-m', `bench: ${benchSlug} on ${modelSlug} (${runId})`], {
    cwd: process.cwd(),
    env: process.env,
    timeoutMs: 30_000
  });
  if (result.code !== 0) throw new Error(`git commit failed: ${result.stderr.trim()}`);
  if (!noPush) {
    result = await runCapture('git', ['push'], { cwd: process.cwd(), env: process.env, timeoutMs: 120_000 });
    if (result.code !== 0) throw new Error(`git push failed: ${result.stderr.trim()}`);
  }
}

async function runOne(benchSlug, modelSlug, options) {
  const bench = await loadBench(benchSlug);
  const models = await readJson(repoPath('models.json'));
  const recipes = await readJson(repoPath('cli-recipes.json'));
  const model = models[modelSlug];
  if (!model) throw new Error(`Unknown model: ${modelSlug}`);
  const recipe = recipes[model.cli];
  if (!recipe) throw new Error(`Missing CLI recipe: ${model.cli}`);
  const preflightInfo = await preflight(recipe, options);
  let prepared = null;
  let runId;
  let runDir;
  try {
    if (!options.dryRun) prepared = await prepareRunHome(bench, modelSlug, model, recipe);
    ({ runId, runDir } = await allocateRun(bench.slug, modelSlug));
  } catch (error) {
    if (prepared) await rm(prepared.runHome, { recursive: true, force: true });
    throw error;
  }

  if (options.dryRun) await writeDryRun(bench, modelSlug, model, runId, runDir, options);
  else await runReal(bench, modelSlug, model, recipe, runId, runDir, options, prepared, preflightInfo);

  const manifest = await regenerateManifest();
  await validateManifest(manifest);
  if (!options.dryRun) await gitAddCommitPush(bench.slug, modelSlug, runId, runDir, options.noPush);
  console.log(`${bench.slug}/${runId}`);
  return { runId, runDir };
}

async function listBenches() {
  const models = await readJson(repoPath('models.json'));
  const benchDirs = await discoverBenchSlugs();
  for (const slug of benchDirs) {
    const bench = await loadBench(slug);
    for (const modelSlug of Object.keys(models)) {
      const runsDir = repoPath('benches', slug, 'runs');
      let count = 0;
      if (await pathExists(runsDir)) {
        const entries = await readdir(runsDir, { withFileTypes: true });
        count = entries.filter((entry) => entry.isDirectory() && entry.name.startsWith(`${modelSlug}--`)).length;
      }
      console.log(`${bench.slug}\t${modelSlug}\t${count}\t${bench.title}`);
    }
  }
}

async function discoverBenchSlugs() {
  const benchesRoot = repoPath('benches');
  const entries = await readdir(benchesRoot, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && existsSync(path.join(benchesRoot, entry.name, 'bench.md')))
    .map((entry) => entry.name)
    .sort();
}

async function commandRun(args) {
  const options = {
    dryRun: args.includes('--dry-run'),
    noPush: args.includes('--no-push') || args.includes('--dry-run'),
    keepHome: args.includes('--keep-home'),
    noScreenshot: args.includes('--no-screenshot') || args.includes('--dry-run'),
    allowLeaks: args.includes('--allow-leaks')
  };
  const modelIdx = args.indexOf('--model');
  if (modelIdx === -1 || !args[modelIdx + 1]) usage();
  const modelSlug = args[modelIdx + 1];
  if (args.includes('--all')) {
    for (const slug of await discoverBenchSlugs()) await runOne(slug, modelSlug, options);
    return;
  }
  const benchSlug = args.find((arg) => !arg.startsWith('--') && arg !== modelSlug && arg !== 'run');
  if (!benchSlug) usage();
  await runOne(benchSlug, modelSlug, options);
}

async function commandRegen(args) {
  const noPush = args.includes('--no-push');
  const noCommit = args.includes('--no-commit');
  await assertCleanForPublish();
  const manifest = await regenerateManifest();
  await validateManifest(manifest);
  if (noCommit) return;
  let result = await runCapture('git', ['add', 'manifest.json'], { cwd: process.cwd(), env: process.env, timeoutMs: 30_000 });
  if (result.code !== 0) throw new Error(`git add failed: ${result.stderr.trim()}`);
  result = await runCapture('git', ['commit', '-m', 'bench: regenerate manifest'], { cwd: process.cwd(), env: process.env, timeoutMs: 30_000 });
  if (result.code !== 0) throw new Error(`git commit failed: ${result.stderr.trim()}`);
  if (!noPush) {
    result = await runCapture('git', ['push'], { cwd: process.cwd(), env: process.env, timeoutMs: 120_000 });
    if (result.code !== 0) throw new Error(`git push failed: ${result.stderr.trim()}`);
  }
}

export async function regenerateManifest() {
  const models = await readJson(repoPath('models.json'));
  const benches = [];
  for (const slug of await discoverBenchSlugs()) {
    const bench = await loadBench(slug);
    const runs = [];
    const runsDir = repoPath('benches', slug, 'runs');
    if (await pathExists(runsDir)) {
      const entries = await readdir(runsDir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const runDir = path.join(runsDir, entry.name);
        const metaPath = path.join(runDir, 'meta.json');
        if (!(await pathExists(metaPath))) continue;
        const meta = await readJson(metaPath);
        if (meta.dryRun === true) continue;
        const modelInfo = models[meta.model];
        const relRun = path.relative(process.cwd(), runDir).replaceAll(path.sep, '/');
        const appIndex = path.join(runDir, 'app', 'index.html');
        const transcript = await firstExisting([
          path.join(runDir, 'transcript.jsonl'),
          path.join(runDir, 'transcript.txt'),
          path.join(runDir, 'cli-output.jsonl')
        ]);
        const screenshot = path.join(runDir, 'screenshot.png');
        runs.push({
          ...meta,
          ...(modelInfo ? { displayName: modelInfo.displayName, vendor: modelInfo.vendor } : {}),
          appPath: await pathExists(appIndex) ? `${relRun}/app/index.html` : null,
          transcriptPath: transcript ? path.relative(process.cwd(), transcript).replaceAll(path.sep, '/') : null,
          screenshotPath: await pathExists(screenshot) ? `${relRun}/screenshot.png` : null
        });
      }
    }
    runs.sort((a, b) => String(b.startedAt || '').localeCompare(String(a.startedAt || '')));
    benches.push({
      slug: bench.slug,
      title: bench.title,
      prompt: bench.prompt,
      capMinutes: bench.capMinutes,
      suggestedBy: bench.suggestedBy ?? null,
      runs
    });
  }
  const manifest = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    benches
  };
  await writeJson(repoPath('manifest.json'), manifest);
  return manifest;
}

async function firstExisting(files) {
  for (const file of files) {
    if (await pathExists(file)) return file;
  }
  return null;
}

export async function validateManifest(manifest = null) {
  if (manifest === null) manifest = await readJson(repoPath('manifest.json'));
  const errors = [];
  if (!Number.isFinite(Date.parse(manifest.generatedAt))) errors.push('generatedAt must be ISO-8601');
  if (manifest.baseUrl !== BASE_URL) errors.push(`baseUrl must be ${BASE_URL}`);
  if (!Array.isArray(manifest.benches)) errors.push('benches must be an array');
  for (const [benchIdx, bench] of (manifest.benches || []).entries()) {
    const prefix = `benches[${benchIdx}]`;
    if (!bench.slug) errors.push(`${prefix}.slug missing`);
    if (!bench.title) errors.push(`${prefix}.title missing`);
    if (typeof bench.prompt !== 'string') errors.push(`${prefix}.prompt must be string`);
    if (!Number.isFinite(bench.capMinutes)) errors.push(`${prefix}.capMinutes must be number`);
    if (!Array.isArray(bench.runs)) errors.push(`${prefix}.runs must be array`);
    for (const [runIdx, run] of (bench.runs || []).entries()) {
      const runPrefix = `${prefix}.runs[${runIdx}]`;
      for (const key of ['runId', 'bench', 'model', 'cli', 'startedAt', 'wallSeconds', 'status', 'exitReason']) {
        if (run[key] === undefined || run[key] === null || run[key] === '') errors.push(`${runPrefix}.${key} missing`);
      }
      if (run.bench !== bench.slug) errors.push(`${runPrefix}.bench does not match bench slug`);
      if (!['ok', 'failed'].includes(run.status)) errors.push(`${runPrefix}.status invalid`);
      if (!Number.isFinite(Date.parse(run.startedAt))) errors.push(`${runPrefix}.startedAt must be ISO-8601`);
      if (!Number.isFinite(run.wallSeconds)) errors.push(`${runPrefix}.wallSeconds must be number`);
      if (run.totalTokens !== null && !Number.isFinite(run.totalTokens)) errors.push(`${runPrefix}.totalTokens must be number|null`);
      if (run.totalCostUsd !== null && !Number.isFinite(run.totalCostUsd)) errors.push(`${runPrefix}.totalCostUsd must be number|null`);
      if (run.effort !== undefined && run.effort !== null && typeof run.effort !== 'string') {
        errors.push(`${runPrefix}.effort must be an optional string|null`);
      }
      if (run.argv !== undefined && (!Array.isArray(run.argv) || run.argv.some((arg) => typeof arg !== 'string'))) {
        errors.push(`${runPrefix}.argv must be an optional array of strings`);
      }
      if (run.rootAbsolutePaths !== undefined && !Array.isArray(run.rootAbsolutePaths)) {
        errors.push(`${runPrefix}.rootAbsolutePaths must be an optional array`);
      }
      for (const [key, required] of [['appPath', run.status === 'ok'], ['transcriptPath', true], ['screenshotPath', false]]) {
        const value = run[key];
        if (value === null) {
          if (required) errors.push(`${runPrefix}.${key} is required`);
          continue;
        }
        if (typeof value !== 'string') {
          errors.push(`${runPrefix}.${key} must be string|null`);
          continue;
        }
        if (path.isAbsolute(value) || value.includes('..')) errors.push(`${runPrefix}.${key} must be repo-relative`);
        if (!(await pathExists(repoPath(value)))) errors.push(`${runPrefix}.${key} missing on disk: ${value}`);
      }
    }
  }
  if (errors.length) throw new Error(`manifest invalid:\n${errors.join('\n')}`);
  return true;
}

async function main(argv) {
  const [command, ...args] = argv;
  if (command === 'run') await commandRun(args);
  else if (command === 'list') await listBenches();
  else if (command === 'regen') await commandRegen(args);
  else usage(command ? 1 : 0);
}

const thisFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === thisFile) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message);
    process.exit(error.exitCode || 1);
  });
}
