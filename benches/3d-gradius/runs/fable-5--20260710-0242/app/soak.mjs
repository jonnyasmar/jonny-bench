// Long-run soak: autoplay ~70s with all upgrades cycled, measure FPS and
// entity counts, ensure no errors and difficulty ramps sanely.
import { chromium } from 'playwright';
import { resolve } from 'node:path';

const errors = [];
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-gl=swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(String(e)));

await page.goto('file://' + resolve('index.html'));
await page.waitForTimeout(800);
await page.keyboard.press('Enter');
await page.keyboard.down('Space');

// FPS probe
await page.evaluate(() => {
  window.__frames = 0;
  const count = () => { window.__frames++; requestAnimationFrame(count); };
  requestAnimationFrame(count);
});

// Cycle upgrades: thrust, twin, echo, echo, ward, then pulse later.
const grant = async (n) => {
  await page.evaluate((k) => { const G = window.__VS; G.chain = k; G.hud.setChain(k, k === 6); }, n);
  await page.keyboard.press('KeyX');
};
await grant(1); await grant(2); await grant(4); await grant(4); await grant(5);

const start = Date.now();
let maxE = 0, maxB = 0, deaths0 = await page.evaluate(() => window.__VS.lives);
while (Date.now() - start < 70000) {
  // crude dodge AI: keep player near vertical center of fewest bullets, stay invuln-free
  await page.evaluate(() => {
    const G = window.__VS;
    const p = G.player;
    if (!p.alive) return;
    // steer toward nearest shard, else center
    let ty = 0, tx = -9;
    let best = 1e9;
    for (const s of G.pickups) {
      const d = (s.x - p.x) ** 2 + (s.y - p.y) ** 2;
      if (d < best) { best = d; ty = s.y; tx = Math.min(s.x, 2); }
    }
    p.y += Math.sign(ty - p.y) * 0.25;
    p.x += Math.sign(tx - p.x) * 0.15;
  });
  await page.waitForTimeout(120);
  const s = await page.evaluate(() => {
    const G = window.__VS;
    return { e: G.enemies.length, eb: G.ebullets.length, pb: G.pbullets.length, state: G.state };
  });
  maxE = Math.max(maxE, s.e); maxB = Math.max(maxB, s.eb);
  if (s.state === 'over') {
    console.log('game over mid-soak (ok, restarting)');
    await page.keyboard.press('KeyR');
  }
}

const result = await page.evaluate(() => {
  const G = window.__VS;
  return {
    state: G.state, score: G.score, lives: G.lives, time: Math.round(G.time),
    diff: +G.director.diff.toFixed(2), sector: G.director.sector,
    boss: !!G.boss, frames: window.__frames,
    weapon: G.player.weapon, drones: G.player.drones.length, shield: G.player.shieldHp,
  };
});
console.log('soak result:', JSON.stringify(result));
console.log('fps ≈', Math.round(result.frames / 70));
console.log('max enemies:', maxE, 'max ebullets:', maxB);
console.log('errors:', errors.length ? errors : 'none');
await page.screenshot({ path: 'shots/soak.png' });
await browser.close();
process.exit(errors.length ? 1 : 0);
