#!/usr/bin/env node
import { mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

async function main() {
  const argv = process.argv.slice(2);
  const recordPath = process.env.FAKE_RECORD;
  const mode = process.env.FAKE_MODE || 'normal';
  const home = process.env.HOME;
  const credPath = path.join(home, '.fake', 'cred.json');
  let cred = null;
  try {
    const info = await stat(credPath);
    cred = { path: credPath, mode: info.mode & 0o777 };
  } catch {
    cred = null;
  }

  await mkdir(path.dirname(recordPath), { recursive: true });
  await writeFile(recordPath, JSON.stringify({
    argv,
    cwd: process.cwd(),
    env: process.env,
    cred
  }, null, 2));

  process.stdout.write(`${JSON.stringify({ type: 'assistant', usage: { input_tokens: 2, output_tokens: 3 } })}\n`);
  process.stdout.write(`${JSON.stringify({ type: 'result', total_cost_usd: 0.12, usage: { input_tokens: 5, output_tokens: 7 } })}\n`);

  if (mode === 'sleep') {
    await sleep(60_000);
    return;
  }

  await mkdir(path.join(process.cwd(), 'dist'), { recursive: true });
  await writeFile(path.join(process.cwd(), 'dist', 'index.html'), '<!doctype html><title>fake bench app</title><h1>fake</h1>');

  const sessionArg = argv[argv.indexOf('--session') + 1] || 'missing-session';
  const transcriptDir = path.join(home, 'transcripts');
  await mkdir(transcriptDir, { recursive: true });
  await writeFile(path.join(transcriptDir, `${sessionArg}.jsonl`), [
    JSON.stringify({ type: 'assistant', usage: { input_tokens: 11, output_tokens: 13 } }),
    JSON.stringify({ type: 'result', total_cost_usd: 0.34, usage: { input_tokens: 17, output_tokens: 19 } })
  ].join('\n') + '\n');
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
