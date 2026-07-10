import puppeteer from 'puppeteer';

const URL = process.env.URL || 'http://localhost:8099/';
const errors = [];
const logs = [];

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--no-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });

page.on('console', (m) => {
  const t = m.type();
  logs.push(`[${t}] ${m.text()}`);
  if (t === 'error') errors.push('console.error: ' + m.text());
});
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('requestfailed', (r) => errors.push('reqfail: ' + r.url() + ' ' + (r.failure()?.errorText || '')));

await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise((r) => setTimeout(r, 800));

// Verify WebGL + game object
const boot = await page.evaluate(() => {
  const g = window.__game;
  return {
    hasGame: !!g,
    bloom: g ? g.postfx.enabled : null,
    state: g ? g.state : null,
    bounds: g ? { l: g && window.__game ? undefined : undefined } : null,
  };
});
console.log('BOOT:', JSON.stringify(boot));
await page.screenshot({ path: 'test/shot-title.png' });

// Start game
await page.keyboard.press('Enter');
await new Promise((r) => setTimeout(r, 400));

// Simulate play: hold fire + move around, tap power occasionally.
async function playTick(ms, keys) {
  for (const k of keys) await page.keyboard.down(k);
  await new Promise((r) => setTimeout(r, ms));
  for (const k of keys) await page.keyboard.up(k);
}
// hold space (fire) throughout via keydown, move in a pattern
await page.keyboard.down('Space');
await playTick(700, ['ArrowRight']);
await playTick(700, ['ArrowUp']);
await page.keyboard.press('KeyC'); // spend power (if any)
await playTick(700, ['ArrowDown']);
await playTick(700, ['ArrowLeft']);
await page.keyboard.press('KeyC');
await playTick(800, ['ArrowRight', 'ArrowUp']);
await page.keyboard.press('KeyC');
await new Promise((r) => setTimeout(r, 1500));
await page.keyboard.up('Space');

const snap = await page.evaluate(() => {
  const g = window.__game;
  return {
    state: g.state,
    phase: g.phase,
    score: g.score,
    lives: g.lives,
    stage: g.stage,
    enemies: g.enemies.active.length,
    playerProjectiles: g.proj.active.length,
    enemyBullets: g.ebul.active.length,
    capsules: g.capsules.length,
    speedLevel: g.player.speedLevel,
    options: g.player.options.length,
    hasDouble: g.player.hasDouble,
    hasLaser: g.player.hasLaser,
    playerAlive: g.player.alive,
    particleCount: g.particles.count,
  };
});
console.log('PLAY SNAPSHOT:', JSON.stringify(snap, null, 2));

// --- Verify the power-up system end to end ---
const power = await page.evaluate(() => {
  const g = window.__game;
  const seq = ['SPEED', 'MISSILE', 'DOUBLE', 'LASER', 'OPTION', 'OPTION', 'SHIELD'];
  const out = [];
  for (const slot of seq) {
    g.hasSel = true;
    g.meterSel = window.__game.constructor ? g.meterSel : 0;
    // set selection to the desired slot directly, then spend
    const idx = ['SPEED','MISSILE','DOUBLE','LASER','OPTION','SHIELD'].indexOf(slot);
    g.meterSel = idx; g.hasSel = true;
    g.spendPower();
    out.push(slot);
  }
  return {
    applied: out,
    speedLevel: g.player.speedLevel,
    hasMissile: g.player.hasMissile,
    hasDouble: g.player.hasDouble,
    hasLaser: g.player.hasLaser,   // laser should override double
    options: g.player.options.length,
    shieldHits: g.player.shieldHits,
  };
});
console.log('POWERUPS:', JSON.stringify(power));

// fire laser volley and confirm laser projectiles spawn
await page.keyboard.down('Space');
await new Promise((r) => setTimeout(r, 500));
await page.keyboard.up('Space');
const laserCheck = await page.evaluate(() => {
  const g = window.__game;
  const types = g.proj.active.map((p) => p.type);
  return { types: [...new Set(types)], count: g.proj.active.length };
});
console.log('LASER FIRE:', JSON.stringify(laserCheck));

await page.screenshot({ path: 'test/shot-play.png' });

// Fast-forward: force boss to test that path (advance waves quickly)
await page.evaluate(() => {
  const g = window.__game;
  if (g.state === 'playing') { g.waves.wavesLeft = 0; g.waves.done = true; g.enemies.clearAll(); }
});
await new Promise((r) => setTimeout(r, 3200)); // warning + boss spawn
const bossSnap = await page.evaluate(() => {
  const g = window.__game;
  return { phase: g.phase, hasBoss: !!g.enemies.boss, bossHp: g.enemies.boss?.hp, bossState: g.enemies.boss?.state };
});
console.log('BOSS SNAPSHOT:', JSON.stringify(bossSnap));
await page.screenshot({ path: 'test/shot-boss.png' });

// Kill boss to test clear path
await page.evaluate(() => {
  const g = window.__game;
  if (g.enemies.boss) { g.enemies.boss.state = 'fight'; g.enemies.damageBoss(99999); }
});
await new Promise((r) => setTimeout(r, 2600));
const afterBoss = await page.evaluate(() => ({ phase: window.__game.phase, stage: window.__game.stage }));
console.log('AFTER BOSS:', JSON.stringify(afterBoss));

// --- Death / game-over path ---
const death = await page.evaluate(async () => {
  const g = window.__game;
  const results = [];
  for (let i = 0; i < 6; i++) {
    if (g.player.alive) { g.player.invuln = 0; g.player.shieldHits = 0; g._playerHit(); }
    // fast-forward respawn timer
    g.respawnTimer = 0.001;
    await new Promise((r) => setTimeout(r, 60));
    results.push({ lives: g.lives, state: g.state });
    if (g.state === 'gameover') break;
  }
  return { finalState: g.state, lives: g.lives, hi: g.hi, log: results };
});
console.log('DEATH PATH:', JSON.stringify(death));

console.log('\n=== ERRORS (' + errors.length + ') ===');
errors.slice(0, 40).forEach((e) => console.log(e));

await browser.close();
process.exit(errors.length ? 1 : 0);
