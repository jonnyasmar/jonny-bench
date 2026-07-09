---
name: jonny-bench
description: Use when Jonny says "bench <goal> on <model>", "run the bench", "add <model> to the bench", "new bench goal", "re-run bench", or "regen bench manifest".
---

# jonny-bench

Repo: `~/dev/jonny-bench`.

Runner:

```bash
node bin/jonny-bench.mjs run <goal> --model <slug>
node bin/jonny-bench.mjs run --all --model <slug>
node bin/jonny-bench.mjs run <goal> --model <slug> --dry-run
node bin/jonny-bench.mjs run <goal> --model <slug> --no-push
node bin/jonny-bench.mjs list
node bin/jonny-bench.mjs regen
```

**Cost guard: real runs spend real tokens/quota. Only run exactly what Jonny asked for; never fan out across models unprompted.**

Adding a model is one `models.json` entry:

```json
{
  "opus-4.8": {
    "displayName": "Opus 4.8",
    "vendor": "Anthropic",
    "cli": "claude-code",
    "modelArg": "claude-opus-4-8"
  }
}
```

Adding a new CLI means adding a `cli-recipes.json` entry with its binary, version argv, credentials files, clean-room env, argv template, transcript glob, pre-created dirs, and usage extraction notes.

Goal prompts are Jonny-curated editorial content. Draft goals on request, but never invent and run one.

Publishing is automatic: the runner commits and pushes, results live on GitHub Pages, and `getatrium.dev/bench` picks them up without deploys. Allow about 5 minutes for Pages/viewer freshness.

Never delete or overwrite existing runs. Results are append-only.
