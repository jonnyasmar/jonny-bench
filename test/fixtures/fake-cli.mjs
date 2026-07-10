#!/usr/bin/env node
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
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
  const auth = await readObservedFile(process.env.AUTH_FILE);
  const seed = await readObservedFile(process.env.SEED_FILE);

  await mkdir(path.dirname(recordPath), { recursive: true });
  await writeFile(recordPath, JSON.stringify({
    argv,
    cwd: process.cwd(),
    env: process.env,
    cred,
    auth,
    seed
  }, null, 2));

  if (mode === 'cap-with-app') {
    process.stdout.write(`${JSON.stringify({ type: 'assistant', message: { usage: { input_tokens: 100, output_tokens: 50 } } })}\n`);
    process.stdout.write(`${JSON.stringify({ type: 'assistant', message: { usage: { input_tokens: 20, output_tokens: 10 } } })}\n`);
    await mkdir(path.join(process.cwd(), 'dist'), { recursive: true });
    await writeFile(
      path.join(process.cwd(), 'dist', 'index.html'),
      '<!doctype html><title>fake bench app</title><h1>fake</h1>'
    );
    await sleep(60_000);
    return;
  }

  process.stdout.write(`${JSON.stringify({ type: 'assistant', usage: { input_tokens: 2, output_tokens: 3 } })}\n`);
  process.stdout.write(`${JSON.stringify({ type: 'result', total_cost_usd: 0.12, usage: { input_tokens: 5, output_tokens: 7 } })}\n`);
  if (mode === 'grok-usage-log') {
    const logDir = path.join(home, '.grok', 'logs');
    await mkdir(logDir, { recursive: true });
    await writeFile(path.join(logDir, 'unified.jsonl'), [
      JSON.stringify({
        msg: 'shell.turn.inference_done',
        ctx: {
          prompt_tokens: 100,
          cached_prompt_tokens: 40,
          completion_tokens: 20,
          reasoning_tokens: 5
        }
      }),
      JSON.stringify({
        msg: 'shell.turn.inference_done',
        ctx: {
          prompt_tokens: 30,
          cached_prompt_tokens: 10,
          completion_tokens: 4,
          reasoning_tokens: 1
        }
      })
    ].join('\n') + '\n');
  }
  if (process.env.FAKE_STREAM_LEAK) process.stdout.write(`${process.env.FAKE_STREAM_LEAK}\n`);
  if (process.env.FAKE_ARTIFACT_LEAK) {
    const artifactPath = argv[argv.indexOf('--artifact') + 1];
    await writeFile(artifactPath, `${process.env.FAKE_ARTIFACT_LEAK}\n`);
  }

  if (mode === 'sleep') {
    await sleep(60_000);
    return;
  }

  await mkdir(path.join(process.cwd(), 'dist'), { recursive: true });
  await writeFile(
    path.join(process.cwd(), 'dist', 'index.html'),
    `<!doctype html><title>fake bench app</title><h1>fake</h1>${process.env.FAKE_APP_PATH || ''}`
  );

  const sessionArg = argv[argv.indexOf('--session') + 1] || 'missing-session';
  const transcriptDir = path.join(home, 'transcripts');
  await mkdir(transcriptDir, { recursive: true });
  await writeFile(path.join(transcriptDir, `${sessionArg}.jsonl`), [
    JSON.stringify({ type: 'assistant', usage: { input_tokens: 11, output_tokens: 13 } }),
    JSON.stringify({ type: 'result', total_cost_usd: 0.34, usage: { input_tokens: 17, output_tokens: 19 } })
  ].join('\n') + '\n');
}

async function readObservedFile(file) {
  if (!file) return null;
  try {
    const info = await stat(file);
    return {
      path: file,
      mode: info.mode & 0o777,
      text: await readFile(file, 'utf8')
    };
  } catch {
    return null;
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
