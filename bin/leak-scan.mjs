#!/usr/bin/env node
import { createReadStream } from 'node:fs';
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline';

const EMAIL_ALLOWLIST = new Set(['noreply@anthropic.com', 'jonny@asmar.co']);
const REDACTED_HOME = '/Users/redacted';
const TEXT_EXTENSIONS = new Set([
  '.css', '.csv', '.html', '.js', '.json', '.jsonl', '.map', '.md', '.mjs',
  '.svg', '.txt', '.ts', '.tsx', '.xml', '.yaml', '.yml'
]);

const RULES = [
  ['anthropic-api-key', /sk-ant-[a-zA-Z0-9-_]{16,}/g],
  ['github-token', /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}/g],
  ['aws-access-key', /\bAKIA[0-9A-Z]{16}\b/g],
  ['slack-token', /\bxox[bpars]-[A-Za-z0-9-]{10,}/g],
  ['private-key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/g],
  ['jwt', /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}/g],
  ['email', /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g]
];

function defaultContext(options = {}) {
  return {
    realHome: options.realHome || process.env.HOME || os.homedir(),
    user: options.user || process.env.USER || os.userInfo().username
  };
}

function truncateMatch(value) {
  return `${String(value).slice(0, 8)}…`;
}

function pushFinding(findings, rule, match, line) {
  findings.push({ rule, match: truncateMatch(match), line });
}

export function scanText(text, options = {}) {
  const { realHome } = defaultContext(options);
  const findings = [];
  const homePattern = realHome ? new RegExp(`${escapeRegExp(realHome)}(?=/|\\b)`, 'g') : null;
  const lines = String(text).split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    for (const [rule, regex] of RULES) {
      regex.lastIndex = 0;
      for (const match of line.matchAll(regex)) {
        const value = match[0];
        if (rule === 'email' && EMAIL_ALLOWLIST.has(value)) continue;
        pushFinding(findings, rule, value, index + 1);
      }
    }
    if (homePattern) {
      homePattern.lastIndex = 0;
      for (const match of line.matchAll(homePattern)) {
        pushFinding(findings, 'real-home-path', match[0], index + 1);
      }
    }
  }
  return findings;
}

export async function scanFile(file, options = {}) {
  if (path.basename(file) === 'screenshot.png') {
    const text = await readFile(file, 'latin1');
    return scanPemOnly(text);
  }
  if (await isBinaryish(file)) return [];
  const findings = [];
  const stream = createReadStream(file, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
  let lineNo = 0;
  for await (const line of rl) {
    lineNo += 1;
    for (const finding of scanText(line, options)) {
      findings.push({ ...finding, line: lineNo });
    }
  }
  return findings;
}

function scanPemOnly(text) {
  const findings = [];
  const regex = /-----BEGIN [A-Z ]*PRIVATE KEY-----/g;
  for (const match of String(text).matchAll(regex)) {
    pushFinding(findings, 'private-key', match[0], 1);
  }
  return findings;
}

export async function scanPath(target, options = {}) {
  const info = await stat(target);
  if (info.isDirectory()) {
    const findings = [];
    for (const entry of await readdir(target, { withFileTypes: true })) {
      if (entry.name === '.git' || entry.name === 'node_modules') continue;
      const child = path.join(target, entry.name);
      findings.push(...await scanPath(child, options));
    }
    return findings;
  }
  const findings = await scanFile(target, options);
  return findings.map((finding) => ({ ...finding, file: target }));
}

export async function scanPaths(targets, options = {}) {
  const findings = [];
  for (const target of targets) findings.push(...await scanPath(target, options));
  return findings;
}

export async function isBinaryish(file) {
  const buffer = await readFile(file);
  return buffer.subarray(0, 8192).includes(0);
}

export async function isTextFile(file) {
  if (path.basename(file) === 'screenshot.png') return false;
  if (TEXT_EXTENSIONS.has(path.extname(file).toLowerCase())) return !(await isBinaryish(file));
  return !(await isBinaryish(file));
}

export function redactText(text, options = {}) {
  const { realHome, user } = defaultContext(options);
  let output = String(text);
  let redactions = 0;
  for (const value of [realHome, user ? `/home/${user}` : null].filter(Boolean)) {
    const regex = new RegExp(`${escapeRegExp(value)}(?:/[A-Za-z0-9._\\-/]*)?`, 'g');
    output = output.replace(regex, () => {
      redactions += 1;
      return REDACTED_HOME;
    });
  }
  return { text: output, redactions };
}

export async function redactFile(file, options = {}) {
  if (!(await isTextFile(file))) return 0;
  const original = await readFile(file, 'utf8');
  const redacted = redactText(original, options);
  if (redacted.redactions > 0) await writeFile(file, redacted.text);
  return redacted.redactions;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function main(argv) {
  const targets = argv.length ? argv : ['.'];
  const findings = await scanPaths(targets);
  for (const finding of findings) {
    console.error(`${finding.file}:${finding.line} ${finding.rule} ${finding.match}`);
  }
  process.exit(findings.length ? 1 : 0);
}

const thisFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === thisFile) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
