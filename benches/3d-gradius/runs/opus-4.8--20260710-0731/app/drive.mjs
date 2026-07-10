// Dev-only end-to-end harness. Not part of the shipped site.
import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--use-gl=angle', '--use-angle=metal', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-gpu'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });

const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + (e.stack || e.message).split('\n').slice(0, 3).join(' | ')));
page.on('requestfailed', (r) => errors.push('REQFAIL: ' + r.url()));

await page.goto('http://localhost:8099/', { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 800));

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const frames = (n) => page.evaluate((k) => new Promise((res) => {
  let i = 0; const t = () => (++i >= k ? res() : requestAnimationFrame(t)); requestAnimationFrame(t);
}), n);

const results = [];
const check = (name, pass, info = '') => {
  results.push({ name, pass });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${info ? '  — ' + info : ''}`);
};

// ---------- boot
const boot = await page.evaluate(() => ({
  canvas: !!document.querySelector('canvas'),
  fatal: getComputedStyle(document.getElementById('fatal')).display,
  title: document.getElementById('title').classList.contains('on'),
  game: !!window.__game,
}));
check('boots with WebGL + title screen', boot.canvas && boot.fatal === 'none' && boot.title && boot.game, JSON.stringify(boot));

// ---------- start
await page.keyboard.press('Space');
await frames(10);
check('start -> playing + HUD', await page.evaluate(() => window.__game.state === 'playing' && document.getElementById('hud').classList.contains('on')));

// keep the pilot alive for the systems tests
await page.evaluate(() => { window.__immortal = setInterval(() => { const g = window.__game; if (g.player) g.player.invuln = 5; }, 50); });

// ---------- power-up ladder
const powers = await page.evaluate(() => {
  const p = window.__game.player;
  const out = {};
  const buy = (slot) => { p.cursor = slot; return p.activate(); };
  out.speed0 = p.maxSpeed;
  buy(1); out.speed1 = p.maxSpeed;
  buy(2); out.missile = p.levels.missile;
  buy(3); out.weaponDouble = p.weapon;
  buy(4); out.weaponLaser = p.weapon;
  out.doubleOff = p.levels.double;
  buy(5); buy(5); out.options = p.levels.option;
  buy(6); out.shield = p.shieldHP;
  out.cursorAfter = p.cursor;
  p.levels.speed = 5; p.cursor = 1;
  out.speedMaxDenied = buy(1).ok === false && p.cursor === 1;
  p.cursor = 0;
  return out;
});
check('SPEED raises max speed', powers.speed1 > powers.speed0, `${powers.speed0.toFixed(1)} -> ${powers.speed1.toFixed(1)}`);
check('MISSILE equips', powers.missile === 1);
check('DOUBLE sets weapon', powers.weaponDouble === 'double');
check('LASER replaces DOUBLE (mutually exclusive)', powers.weaponLaser === 'laser' && powers.doubleOff === 0);
check('OPTION stacks to 2', powers.options === 2);
check('SHIELD grants 3 pips', powers.shield === 3);
check('activation resets cursor', powers.cursorAfter === 0);
check('maxed SPEED denied, cursor preserved', powers.speedMaxDenied);

// ---------- options + firing
await frames(40);
const opt = await page.evaluate(() => {
  const g = window.__game, p = g.player;
  const o0 = p.options[0].group.position, o1 = p.options[1].group.position;
  let live = 0; for (const b of g.bullets.player.items) if (b.alive) live++;
  return { visible: p.options[0].group.visible && p.options[1].group.visible, gap: Math.hypot(o0.x - o1.x, o0.y - o1.y), live };
});
check('Options visible', opt.visible, `gap=${opt.gap.toFixed(2)}`);
check('weapons firing', opt.live > 0, `${opt.live} bullets live`);

// ---------- laser pierces
const pierce = await page.evaluate(async () => {
  const g = window.__game;
  g.enemies.forEach((e) => e.die(false)); g.enemies.length = 0;
  const es = [0, 1, 2].map((i) => g.spawnEnemy('drone', g.player.pos.x + 6 + i * 1.6, g.player.pos.y, {}));
  es.forEach((e) => { e.vx = 0; e.hp = 1; });
  await new Promise((r) => { let n = 0; const t = () => (++n >= 45 ? r() : requestAnimationFrame(t)); requestAnimationFrame(t); });
  return es.filter((e) => !e.alive).length;
});
check('laser pierces multiple targets', pierce >= 2, `${pierce}/3 drones destroyed`);

// ---------- formation drop rules
const drop = await page.evaluate(() => {
  const g = window.__game;
  g.capsules.forEach((c) => c.destroy()); g.capsules.length = 0;
  const f = g.newFormation(3);
  [0, 1, 2].map((i) => g.spawnEnemy('drone', g.player.pos.x + 8, g.player.pos.y + (i - 1) * 2, { formation: f, canFire: false }))
    .forEach((e) => e.die(true));
  return g.capsules.length;
});
check('wiping a full formation drops a capsule', drop === 1, `${drop} capsule(s)`);

const nodrop = await page.evaluate(() => {
  const g = window.__game;
  g.capsules.forEach((c) => c.destroy()); g.capsules.length = 0;
  g.enemies.length = 0;
  const f = g.newFormation(3);
  const es = [0, 1, 2].map((i) => g.spawnEnemy('drone', g.player.pos.x + 8, g.player.pos.y + (i - 1) * 2, { formation: f, canFire: false }));
  es[0].die(false);
  es[1].die(true); es[2].die(true);
  return g.capsules.length;
});
check('an escapee breaks the formation bonus', nodrop === 0, `${nodrop} capsule(s)`);

// ---------- capsule pickup advances cursor
const cur = await page.evaluate(async () => {
  const g = window.__game;
  g.player.cursor = 0;
  g.capsules.forEach((c) => c.destroy()); g.capsules.length = 0;
  g.enemies.forEach((e) => e.die(false)); g.enemies.length = 0;
  const e = g.spawnEnemy('drone', g.player.pos.x + 1, g.player.pos.y, { forceDrop: true, canFire: false });
  e.die(true);
  await new Promise((r) => { let n = 0; const t = () => (++n >= 40 ? r() : requestAnimationFrame(t)); requestAnimationFrame(t); });
  return g.player.cursor;
});
check('collecting a capsule advances the power cursor', cur === 1, `cursor=${cur}`);

// ---------- boss
await page.evaluate(() => {
  const g = window.__game;
  g.waves.time = g.waves.bossAt - 0.05;
  g.enemies.forEach((e) => e.die(false)); g.enemies.length = 0;
});
await frames(30);
const bossUp = await page.evaluate(() => ({
  exists: !!window.__game.boss,
  bar: document.getElementById('bossbar').classList.contains('on'),
  name: window.__game.boss?.name,
}));
check('boss spawns + HP bar shows', bossUp.exists && bossUp.bar, bossUp.name);

await page.evaluate(() => new Promise((res) => { const t = () => (window.__game.boss?.entered ? res() : requestAnimationFrame(t)); requestAnimationFrame(t); }));
const armour = await page.evaluate(() => {
  const b = window.__game.boss;
  const before = b.core.hp;
  b.damagePart(b.core, 100);
  const armored = before - b.core.hp;
  b.pods.forEach((p) => b.damagePart(p, 99999));
  const mid = b.core.hp;
  b.damagePart(b.core, 100);
  return { armored, exposed: mid - b.core.hp, podsAlive: b.podsAlive };
});
check('core armoured while pods live', armour.armored > 0 && armour.armored < 30, `${armour.armored.toFixed(0)} dmg from 100`);
check('core takes full damage once pods die', Math.abs(armour.exposed - 100) < 1, `${armour.exposed.toFixed(0)} dmg from 100`);
check('pods destroyed', armour.podsAlive === false);

const stageBefore = await page.evaluate(() => window.__game.stage);
await page.evaluate(() => { const b = window.__game.boss; b.damagePart(b.core, 99999); });
await page.evaluate(() => new Promise((res) => {
  const t = () => (window.__game.state === 'stageclear' ? res() : requestAnimationFrame(t)); requestAnimationFrame(t);
}));
check('killing the core enters stage-clear', true);

await wait(4300);
const after = await page.evaluate(() => ({ stage: window.__game.stage, state: window.__game.state, pal: window.__game.fx.pal.name }));
check('advances to next sector', after.stage === stageBefore + 1 && after.state === 'playing', `sector ${after.stage} · ${after.pal}`);

// ---------- scene hygiene
const leak = await page.evaluate(async () => {
  const g = window.__game;
  const base = g.scene.children.length;
  for (let i = 0; i < 3; i++) {
    g.waves.time = g.waves.bossAt - 0.05;
    await new Promise((r) => { let n = 0; const t = () => (++n >= 25 ? r() : requestAnimationFrame(t)); requestAnimationFrame(t); });
    if (g.boss) {
      g.boss.pods.forEach((p) => g.boss.damagePart(p, 1e9));
      g.boss.damagePart(g.boss.core, 1e9);
    }
    await new Promise((r) => setTimeout(r, 2700));
    await new Promise((r) => setTimeout(r, 4300));
  }
  return { base, now: g.scene.children.length, stage: g.stage };
});
check('no scene-graph leak across 3 boss cycles', Math.abs(leak.now - leak.base) <= 4, `${leak.base} -> ${leak.now} children (sector ${leak.stage})`);

// ---------- death / game over / retry
await page.evaluate(() => clearInterval(window.__immortal));
const over = await page.evaluate(async () => {
  const g = window.__game;
  g.lives = 1;
  g.player.invuln = 0; g.player.shieldHP = 0; g.player.levels.shield = 0;
  g.player.takeHit();
  g.state = 'dying'; g.stateT = 0;
  await new Promise((r) => setTimeout(r, 2500));
  return { state: g.state, panel: document.getElementById('over').classList.contains('on'), best: g.best };
});
check('final death -> game-over panel', over.state === 'gameover' && over.panel);
check('high score persisted', over.best > 0, `best=${over.best}`);

await wait(1200);
await page.keyboard.press('Space');
await frames(10);
const retry = await page.evaluate(() => ({ s: window.__game.state, st: window.__game.stage, l: window.__game.lives }));
check('retry restarts at sector 1', retry.s === 'playing' && retry.st === 1 && retry.l === 3, JSON.stringify(retry));

// ---------- perf
const fps = await page.evaluate(() => new Promise((res) => {
  let n = 0; const s = performance.now();
  const tick = () => { n++; if (performance.now() - s < 2500) requestAnimationFrame(tick); else res(Math.round(n / ((performance.now() - s) / 1000))); };
  requestAnimationFrame(tick);
}));
console.log(`\nFPS (headless): ${fps}`);

console.log(`\n--- runtime errors: ${errors.length} ---`);
errors.slice(0, 20).forEach((e) => console.log(e));

const failed = results.filter((r) => !r.pass).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
await browser.close();
process.exit(failed || errors.length ? 1 : 0);
