// Dev-only screenshot capture. Not part of the shipped site.
import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--use-gl=angle', '--use-angle=metal', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-gpu'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1400, height: 800, deviceScaleFactor: 1 });
page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
await page.goto('http://localhost:8099/', { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 1000));

const frames = (n) => page.evaluate((k) => new Promise((res) => {
  let i = 0; const t = () => (++i >= k ? res() : requestAnimationFrame(t)); requestAnimationFrame(t);
}), n);

await page.screenshot({ path: 'shot-1-title.png' });
console.log('shot-1-title.png');

await page.keyboard.press('Space');
await frames(30);
await page.evaluate(() => { window.__imm = setInterval(() => { window.__game.player.invuln = 5; }, 40); });

// A representative combat frame: full arsenal, mixed enemies, live fire.
await page.evaluate(() => {
  const g = window.__game, p = g.player;
  const buy = (s) => { p.cursor = s; p.activate(); };
  buy(1); buy(1); buy(2); buy(5); buy(5); buy(5); buy(6);
  p.levels.double = 1;
  g.player.pos.set(-8, 1.2, 0);
  const B = g.bounds;
  g.spawnEnemy('drone', B.halfW * 0.2, 4.2, { canFire: true });
  g.spawnEnemy('drone', B.halfW * 0.45, 5.4, { canFire: true });
  g.spawnEnemy('waver', B.halfW * 0.1, -1.5, {});
  g.spawnEnemy('waver', B.halfW * 0.3, -2.6, {});
  g.spawnEnemy('waver', B.halfW * 0.5, -3.4, {});
  g.spawnEnemy('spinner', B.halfW * 0.62, 2.4, {});
  g.spawnEnemy('turret', B.halfW * 0.75, -5.2, {});
  g.spawnEnemy('hunter', B.halfW * 0.55, -0.4, {});
  g.spawnEnemy('mine', B.halfW * 0.35, 6.6, {});
  const e = g.spawnEnemy('drone', -2, 3, {});
  e.die(true); // an explosion in frame
});
// Fly for a moment so the Options trail out behind the ship instead of stacking.
await page.keyboard.down('KeyW');
await frames(26);
await page.keyboard.up('KeyW');
await page.keyboard.down('KeyS');
await frames(20);
await page.keyboard.up('KeyS');
await frames(24);
await page.evaluate(() => {
  const g = window.__game;
  const e = g.spawnEnemy('drone', 2, -4, {});
  e.die(true);
  g.spawnEnemy('carrier', g.bounds.halfW * 0.8, 0, {});
});
await frames(14);
await page.screenshot({ path: 'shot-2-combat.png' });
console.log('shot-2-combat.png');

// Laser + options streaming
await page.evaluate(() => {
  const g = window.__game, p = g.player;
  p.levels.double = 0; p.levels.laser = 1;
  p.cursor = 3;
});
await frames(24);
await page.screenshot({ path: 'shot-3-laser.png' });
console.log('shot-3-laser.png');

// Boss
await page.evaluate(() => {
  const g = window.__game;
  g.enemies.forEach((e) => e.die(false)); g.enemies.length = 0;
  g.waves.time = g.waves.bossAt - 0.05;
});
await frames(20);
await page.evaluate(() => new Promise((res) => { const t = () => (window.__game.boss?.entered ? res() : requestAnimationFrame(t)); requestAnimationFrame(t); }));
await page.evaluate(() => { const g = window.__game; g.boss.attack = 'podRings'; g.boss.atkPhase = 0; g.boss.shots = 3; g.boss.atkT = 0; });
await frames(40);
await page.screenshot({ path: 'shot-4-boss.png' });
console.log('shot-4-boss.png');

// Later sector palette
await page.evaluate(() => {
  const g = window.__game;
  g.stage = 4;
  g.fx.setPalette(window.__PAL ?? g.fx.pal);
});
await page.evaluate(async () => {
  const g = window.__game;
  const mod = await import('./src/fx.js');
  g.fx.setPalette(mod.PALETTES[3]);
  if (g.boss) { g.boss.destroy(); g.boss = null; }
  const B = g.bounds;
  for (let i = 0; i < 5; i++) g.spawnEnemy('waver', B.halfW * (0.2 + i * 0.12), -2 + i * 1.4, {});
  g.spawnEnemy('spinner', B.halfW * 0.5, 3, {});
  g.spawnEnemy('turret', B.halfW * 0.7, -4, {});
});
await frames(40);
await page.screenshot({ path: 'shot-5-sector4.png' });
console.log('shot-5-sector4.png');

await browser.close();
