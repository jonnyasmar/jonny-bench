# jonny-bench

One prompt, every model, no steroids.

jonny-bench is a founder-curated vibe bench for agent CLIs. Each goal prompt is run headless in a clean room, the resulting static app is published, and the transcript stays attached so you can judge the work instead of trusting a score.

Results viewer: https://getatrium.dev/bench

## Clean-room contract

- No repo hooks, MCPs, `AGENTS.md`, or preloaded skills.
- The CLI is run as shipped, through the recipe in `cli-recipes.json`.
- One prompt, zero follow-ups.
- Claude Code runs launch through its built-in `/goal` command so the agent loops until it judges the goal met; Codex has no equivalent and runs as a single-shot `exec`.
- Each run records the exact harness argv in `meta.json`, with the prompt-bearing element elided as `[prompt]`.
- Auto-approve is enabled where the CLI supports it.
- Network is on.
- Each run has a wall-clock cap from the goal spec.

## Trust model & leak gate

Bench runs execute as your normal OS user. The runner strips agent env/config and uses a temp home, but it is not an OS sandbox: files readable by your user may still be readable to a prompted CLI.

Before publishing, jonny-bench mechanically redacts real home paths in text artifacts to `/Users/redacted`, then scans the run output for common secrets, private keys, JWTs, non-allowlisted emails, and remaining real-home paths. A finding blocks publish before `git add`; `--allow-leaks` exists for intentional overrides and prints a warning.

Published submissions stay unmodified. The `/embed/` harness is only a viewer wrapper for sandboxed iframes: it validates a repo-local `goals/<slug>/runs/<runId>/app/` target, loads that app in-place, and provides per-load in-memory `localStorage`/`sessionStorage` only when the browser blocks native storage for an opaque origin.

The roadmap answer for stronger isolation is a separate OS user or container. The current leak gate is a pre-publish safety net, not a filesystem security boundary.

## Results

Runs are append-only. A run is never deleted or overwritten by the runner; re-runs create a new `runId`.

```text
goals/<slug>/runs/<runId>/
  app/
  transcript.jsonl
  meta.json
  screenshot.png
```

`manifest.json` is regenerated from the tree so the viewer can pick up new runs without a www redeploy. GitHub Pages serves this repo, and `getatrium.dev/bench` reads the published manifest.

## Models

Contestants are models via CLI, not abstract model names. For example, `Opus 4.8 via Claude Code v2.1.205` is the contestant, because the CLI, flags, permissions, and transcript format are part of the run.

Add models in `models.json`. CLI invocation details live in `cli-recipes.json`.

## Goals

Goals are curated prompts under `goals/<slug>/goal.md`. To suggest a new goal, ping X `@jonnyasmar`.

This is a vibe bench, n=1 per run. Read the transcripts.
