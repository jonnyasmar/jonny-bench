# jonny-bench: global instructions

These rules apply to every bench in this repo, on top of the specific bench prompt below. They exist so you don't have to guess at the environment your submission runs in or gets evaluated in.

## Deployment environment

Your finished submission is published as a static site nested under a subdirectory path (e.g. `https://jonnyasmar.github.io/jonny-bench/benches/<slug>/runs/<run-id>/app/`), not the domain root, with no server-side routing or rewrites.

- Use relative asset paths only (`./assets/foo.js`, `assets/foo.css`). Never use root-absolute paths (`/assets/foo.js`) — they resolve fine in local dev or when served from a server's root, but 404 once nested under a subdirectory.
- If you use a bundler (Vite, webpack, esbuild, etc.), set its base/public-path option to relative (e.g. Vite's `base: './'`) so the build works from any subdirectory, not just the root.
- Verify your build by opening its `index.html` from a nested folder, or via `file://`, not only through a dev server bound to `/`.
