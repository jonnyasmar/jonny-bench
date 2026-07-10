// Visual scenario: turret aim, cruiser, pulsar, missiles + options in flight.
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const url = 'file://' + path.join(root, 'index.html');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('pageerror', (e) => console.log('pageerror:', e.message));

await page.goto(url);
await page.waitForFunction(() => window.__IT);
await page.screenshot({ path: 'test/shot-title.png' });
await page.keyboard.press('Enter');
await page.waitForFunction(() => window.__IT.world.mode === 'playing');

await page.evaluate(() => {
  const T = window.__IT;
  // freeze the wave director so only our actors are on stage
  T.world.state = 'spawning';
  T.world.events = [{ t: 99999, fn: () => {} }];
  T.world.waveT = 0;
  // gear up: missiles x2 + 2 options
  T.player.missileLvl = 2;
  for (let i = 0; i < 2; i++) { for (let j = 0; j < 5; j++) T.collectCapsule(); T.activatePower(); }
  T.spawnEnemy('turret', { x: 10, top: false });
  T.spawnEnemy('turret', { x: 16, top: true });
  T.spawnEnemy('cruiser', { x: 20, y: 4 });
  T.spawnEnemy('pulsar', { x: 14, y: -4 });
  T.spawnEnemy('carrier', { x: 24, y: 7 });
});
// let turrets/cruiser fire, then hold fire ourselves
await page.waitForFunction(() => window.__IT.ebullets.length > 0, null, { timeout: 60000 });
await page.keyboard.down('Space');
await page.waitForTimeout(1200);
await page.screenshot({ path: 'test/shot-scenario.png' });
await page.waitForTimeout(1200);
await page.screenshot({ path: 'test/shot-scenario2.png' });
await page.keyboard.up('Space');
console.log(await page.evaluate(() => ({
  enemies: window.__IT.enemies.length,
  ebullets: window.__IT.ebullets.length,
})));
await browser.close();
