import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new', args: ['--use-gl=angle','--use-angle=metal','--enable-webgl','--ignore-gpu-blocklist','--enable-gpu'],
});
const page = await browser.newPage();
await page.setViewport({ width: 900, height: 620 });
page.on('pageerror', e => console.log('ERR', e.message));
await page.goto('http://localhost:8099/', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 900));
const frames = (n) => page.evaluate((k)=>new Promise(res=>{let i=0;const t=()=>(++i>=k?res():requestAnimationFrame(t));requestAnimationFrame(t);}), n);

await page.keyboard.press('Space');
await frames(20);

// 'paused' is the only state whose update() returns before the camera rig runs,
// so it's the only place we can pin the camera for a close-up.
const setup = (rot) => page.evaluate((r) => {
  const g = window.__game;
  const p = g.player;
  p.invuln = 5; p.firingEnabled = false;
  p.shieldHP = 0; p.levels.option = 0; p.levels.missile = 0; p.syncOptions();
  g.enemies.forEach(e => e.die(false)); g.enemies.length = 0;
  g.bullets.reset();
  g.fx.bg.visible = false;
  g.fx.reset();
  document.getElementById('hud').style.display = 'none';
  document.getElementById('grain').style.display = 'none';
  document.getElementById('pause').style.display = 'none';
  document.getElementById('banner').style.display = 'none';
  p.pos.set(0, 0, 0);
  p.group.rotation.set(r[0], r[1], r[2]);
  p.light.position.set(0, 0, 3);
  g.camera.position.set(0, 0, 5.2);
  g.camera.rotation.set(0, 0, 0);
  g.state = 'paused';
}, rot);

await setup([0, 0, 0]);
await frames(4);
await page.screenshot({ path: 'ship-front.png' });
console.log('ship-front.png');

await setup([0.32, 0.75, 0.08]);
await frames(4);
await page.screenshot({ path: 'ship-3q.png' });
console.log('ship-3q.png');
await browser.close();
