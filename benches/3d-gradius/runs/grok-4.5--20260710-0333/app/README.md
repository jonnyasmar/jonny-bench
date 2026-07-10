# AETHER WING

A polished 3D side-scrolling shooter inspired by classic horizontal shmups — original **void-runner** visual identity (cyan / violet crystal craft, nebula starfield). Built with **Three.js**, pure client-side static site.

## Play

Serve the repo root over HTTP (ES modules require a local server):

```bash
npx --yes serve .
# or: python3 -m http.server 8080
```

Open the URL shown, then click **ENGAGE**.

## Controls

| Action | Keys |
|--------|------|
| Move | `WASD` / Arrow keys |
| Fire | `Space` / `Z` |
| Activate power | `Shift` / `X` |
| Pause | `P` / `Esc` |
| Mute | `M` |

## Power system

Destroy enemies to drop gold **capsules**. Each capsule advances the power bar:

**SPD → MSL → DBL → LAS → OPT → SHD**

Press **Shift** to activate the highlighted slot (Gradius-style).

## Stack

- `index.html` — shell + HUD
- `css/style.css` — menus & chrome
- `js/main.js` — bootstrap
- `js/game.js` — gameplay, entities, difficulty
- `js/effects.js` — particles, starfield, shake
- `js/audio.js` — Web Audio synth SFX

No build step. Three.js is loaded from CDN via import map.
