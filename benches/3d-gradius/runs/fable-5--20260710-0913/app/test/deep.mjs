// Deep systems test: powers, death/respawn, boss fight lifecycle.
// Headless GPU is slow and game dt is capped, so game time < wall time:
// all waits are condition-based (waitForFunction), not wall-clock.
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const url = 'file://' + path.join(root, 'index.html');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 640, height: 360 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

await page.goto(url);
await page.waitForFunction(() => window.__IT);
await page.keyboard.press('Enter'); // start
await page.waitForFunction(() => window.__IT.world.mode === 'playing');

const fails = [];
const check = (name, cond) => { console.log((cond ? 'PASS ' : 'FAIL ') + name); if (!cond) fails.push(name); };
const W = (fn, t = 90000) => page.waitForFunction(fn, null, { timeout: t });

// --- power chain: collect 6 capsules -> cursor at FORCE, activate ---
let r = await page.evaluate(() => {
  const T = window.__IT;
  for (let i = 0; i < 6; i++) T.collectCapsule();
  const selIsForce = document.getElementById('p5').classList.contains('sel');
  T.activatePower();
  return { selIsForce, shield: T.player.shield };
});
check('power cursor reaches FORCE after 6 capsules', r.selIsForce);
check('FORCE grants shield 4', r.shield === 4);

// --- speed + laser via chain ---
r = await page.evaluate(() => {
  const T = window.__IT;
  T.collectCapsule(); T.activatePower(); // SPEED
  for (let i = 0; i < 4; i++) T.collectCapsule(); T.activatePower(); // LASER
  return { speed: T.player.speedLvl, laser: T.player.laserLvl };
});
check('SPEED level 1', r.speed === 1);
check('LASER level 1', r.laser === 1);

// laser actually fires and kills
await page.evaluate(() => {
  window.__IT.spawnEnemy('drone', { x: 8, y: window.__IT.player.y, amp: 0, freq: 0 });
});
await page.keyboard.down('Space');
await W(() => window.__IT.enemies.length === 0);
await page.keyboard.up('Space');
check('laser fire kills spawned drone', true);
const scoreAfterKill = await page.evaluate(() => document.getElementById('score').textContent);
check('score increased', parseInt(scoreAfterKill, 10) > 0);

// --- death & respawn ---
r = await page.evaluate(() => {
  const T = window.__IT;
  T.player.shield = 0;
  T.player.invulnT = 0;
  T.hitPlayer();
  return { dead: T.player.dead, lives: T.player.lives };
});
check('player dies with no shield', r.dead === true);
check('life deducted', r.lives === 2);
await W(() => window.__IT.player.dead === false);
r = await page.evaluate(() => {
  const T = window.__IT;
  return { invuln: T.player.invulnT > 0, laser: T.player.laserLvl, caps: T.capsules.length };
});
check('player respawned', true);
check('respawn invulnerability active', r.invuln);
check('powers reset on respawn', r.laser === 0);
check('pity capsules spawned', r.caps >= 2);

// --- boss lifecycle ---
await page.evaluate(() => {
  const T = window.__IT;
  T.enemies.length = 0;
  T.world.events = [];
  T.world.state = 'intermission';
  T.world.stateT = 0.01;
  T.world.wave = 4; // next wave = 5 => boss
});
await W(() => window.__IT.world.state === 'bosswarn');
check('wave 5 triggers boss warning', true);
await W(() => !!window.__IT.getBoss());
check('boss spawned after warning', true);
await W(() => window.__IT.getBoss() && window.__IT.getBoss().x < 20);
await page.screenshot({ path: 'test/shot-boss.png' });
r = await page.evaluate(() => {
  const T = window.__IT;
  T.bossDamage(T.getBoss().shellMax + 5);
  return T.getBoss().phase;
});
check('shell break -> phase 2', r === 2);
await page.waitForTimeout(600);
await page.screenshot({ path: 'test/shot-boss-core.png' });
await page.evaluate(() => {
  const T = window.__IT;
  T.bossDamage(T.getBoss().coreMax + 5);
});
await W(() => !window.__IT.getBoss());
check('boss dies and clears', true);
r = await page.evaluate(() => window.__IT.world.state);
check('returns to intermission after boss', r === 'intermission');
await W(() => window.__IT.world.wave === 6);
check('advances to sector 6', true);

// --- game over flow ---
r = await page.evaluate(() => {
  const T = window.__IT;
  T.player.lives = 0;
  T.player.invulnT = 0; T.player.shield = 0; T.player.dead = false;
  T.hitPlayer();
  return { mode: T.world.mode };
});
check('game over when lives exhausted', r.mode === 'gameover');
await W(() => document.getElementById('gameover').style.display === 'flex');
check('game over screen shown', true);
await page.screenshot({ path: 'test/shot-gameover.png' });
await page.keyboard.press('Enter');
await W(() => window.__IT.world.mode === 'playing');
check('enter restarts game', true);

console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'NO PAGE ERRORS');
console.log(fails.length ? 'FAILED: ' + fails.join(', ') : 'ALL CHECKS PASSED');
await browser.close();
process.exit(fails.length + errors.length ? 1 : 0);
