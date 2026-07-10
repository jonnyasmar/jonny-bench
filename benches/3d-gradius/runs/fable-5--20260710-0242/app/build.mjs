// Bundles the game into a single self-contained index.html at the repo root.
// Usage: node build.mjs
import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';

const result = await build({
  entryPoints: ['src/main.js'],
  bundle: true,
  minify: true,
  format: 'iife',
  target: 'es2020',
  write: false,
  legalComments: 'none',
});

// Guard against the bundle terminating the inline <script> block early.
const js = result.outputFiles[0].text.replaceAll('</script', '<\\/script');
const css = readFileSync('src/style.css', 'utf8');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<title>VOIDSURGE</title>
<style>
${css}
</style>
</head>
<body>
<script>
${js}
</script>
</body>
</html>
`;

writeFileSync('index.html', html);
console.log(`index.html written (${(html.length / 1024).toFixed(0)} KB)`);
