# 🌞 Space Kids!

A talking, game-based solar system explorer for young kids (ages ~4–7). Pure static site — just open `index.html` in any browser. No build step, no dependencies.

## What's inside

- **🪐 Explore Space** — an animated orbit map of the Sun, all 8 planets, and the Moon. Tap any world for big friendly fact cards, read aloud by the browser's speech synthesis.
- **🚀 Grand Tour** — an auto-narrated ride from the Sun all the way out to Neptune.
- **🧩 Planet Parade** — put the planets in order from the Sun (with gentle hints and the "My Very Excellent Mother Just Served Us Noodles" mnemonic as the reward).
- **❓ Space Quiz** — 8 spoken picture questions per round, drawn from a larger pool, with retry-until-right learning and stars for first-try answers.
- **🐘 Big & Small** — every world at true relative scale (the Sun only fits as an edge!), sortable by distance or size.
- **🏆 My Stickers** — 8 collectible badges; earn them all to become a certified Solar System Expert. Progress persists in `localStorage`.

Everything is narrated (Web Speech API) so pre-readers can play independently; sound can be toggled off in the header. All chimes are synthesized with WebAudio — there are no asset files at all.

## Tech

Vanilla HTML/CSS/JS. Planets are drawn with layered CSS gradients, the starfield and confetti with `<canvas>`. All asset paths are relative, so it works from any subdirectory or `file://`.
