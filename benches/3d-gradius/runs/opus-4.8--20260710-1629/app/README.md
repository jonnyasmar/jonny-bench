# NEON VANGUARD

A polished, playable **3D side-scrolling shooter** in the spirit of *Gradius*, built with
[Three.js](https://threejs.org/) and rendered with an original neon-vector visual style
(emissive geometry + Unreal bloom, parallax starfields, scrolling grids).

Pure client-side static site — no build step, no server code. Open `index.html`.

## Play

- **Move** — `WASD` / Arrow keys
- **Fire** — `Space` / `J` (hold)
- **Arm capsule** — `K` / `Enter`
- **Pause** — `P` · **Mute** — `M`
- **Touch** — on-screen stick + fire button (double-tap fire = arm capsule)

## The weapon gauge (Gradius-style)

Destroy the marked carrier enemies (and full squadrons) to drop glowing **capsules**.
Each capsule collected advances a highlight along the gauge:

`SPEED → MISSILE → DOUBLE → LASER → OPTION → FORCE`

Press **arm** to activate whatever is currently highlighted (this spends your banked
capsules). Collect one capsule and arm for Speed; bank six and arm for the Force field.

- **Speed** — faster ship (stacks)
- **Missile** — homing missiles
- **Double** — adds an upward-angled shot
- **Laser** — piercing beam (replaces Double)
- **Option** — a trailing pod that mirrors your fire (up to 4)
- **Force** — a shield bubble that absorbs 3 hits

## Structure

- `index.html` — shell, HUD, overlays, import map (all relative paths)
- `assets/game.js` — the entire game engine (audio, rendering, entities, director, loop)
- `assets/three/` — vendored Three.js r160 + postprocessing addons (no CDN dependency)

Five sectors, each ending in a multi-phase guardian boss with escalating patterns.
Runs fully offline once loaded.
