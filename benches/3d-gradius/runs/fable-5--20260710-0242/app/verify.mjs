// Headless smoke test: loads index.html from file://, plays for a while,
// checks for console errors and that core game state advances.
import { chromium } from 'playwright';
import { resolve } from 'node:path';

const errors = [];
const browser = await chromium.launch({
  args: ['--enable-unsafe-swiftshader', '--use-gl=swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(String(e)));

await page.goto('file://' + resolve('index.html'));
await page.waitForTimeout(1800);
await page.screenshot({ path: 'shots/title.png' });

const stTitle = await page.evaluate(() => window.__VS && window.__VS.state);
console.log('state after load:', stTitle);

// Start the game.
await page.keyboard.press('Enter');
await page.waitForTimeout(500);
console.log('state after Enter:', await page.evaluate(() => window.__VS.state));

// Hold fire, wiggle around, let waves spawn.
await page.keyboard.down('Space');
for (let i = 0; i < 14; i++) {
  const key = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'][i % 4];
  await page.keyboard.down(key);
  await page.waitForTimeout(450);
  await page.keyboard.up(key);
}
await page.screenshot({ path: 'shots/gameplay.png' });

const snap1 = await page.evaluate(() => {
  const G = window.__VS;
  return {
    state: G.state, score: G.score, enemies: G.enemies.length,
    pbullets: G.pbullets.length, ebullets: G.ebullets.length,
    chain: G.chain, lives: G.lives, time: G.time, diff: G.director.diff,
  };
});
console.log('after ~7s of play:', JSON.stringify(snap1));

// Force-test surge mechanics: grant chain and redeem each slot.
await page.evaluate(() => {
  const G = window.__VS;
  G.chain = 6;
  G.hud.setChain(6, true);
});
await page.keyboard.press('KeyX'); // NOVA
await page.waitForTimeout(600);
await page.screenshot({ path: 'shots/nova.png' });

// Force boss for verification.
await page.evaluate(() => {
  const G = window.__VS;
  G.director.sinceBoss = 1e9;
});
await page.waitForTimeout(3500); // warning plays
await page.waitForTimeout(3000); // boss enters
const bossSnap = await page.evaluate(() => {
  const G = window.__VS;
  return { boss: !!G.boss, state: G.boss && G.boss.state, hp: G.boss && G.boss.hp };
});
console.log('boss:', JSON.stringify(bossSnap));
await page.screenshot({ path: 'shots/boss.png' });

// Kill the boss to test finale + sector loop.
await page.evaluate(() => { const G = window.__VS; if (G.boss) G.boss.takeHit(G, 1e9); });
await page.waitForTimeout(3500);
const postBoss = await page.evaluate(() => {
  const G = window.__VS;
  return { boss: !!G.boss, sector: G.director.sector, score: G.score, state: G.state };
});
console.log('post-boss:', JSON.stringify(postBoss));

// Test player death → game over flow.
await page.keyboard.up('Space');
await page.evaluate(() => {
  const G = window.__VS;
  G.lives = 0;
  G.player.inv = 0;
  G.player.shieldHp = 0;
  G.player.hurt(G);
});
await page.waitForTimeout(1500);
console.log('after death:', await page.evaluate(() => {
  const G = window.__VS;
  return JSON.stringify({ state: G.state, lives: G.lives, alive: G.player.alive });
}));
await page.waitForTimeout(1000);
await page.screenshot({ path: 'shots/gameover.png' });

// Restart.
await page.keyboard.press('KeyR');
await page.waitForTimeout(400);
console.log('after restart:', await page.evaluate(() => window.__VS.state));

console.log('console errors:', errors.length ? errors : 'none');
await browser.close();
process.exit(errors.length ? 1 : 0);
