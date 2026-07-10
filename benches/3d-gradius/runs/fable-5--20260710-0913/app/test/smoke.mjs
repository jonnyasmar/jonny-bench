// Headless smoke test: loads the game over file://, drives it, screenshots, reports errors.
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const url = 'file://' + path.join(root, 'index.html');

const browser = await chromium.launch({ args: ['--use-gl=angle', '--enable-webgl'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

await page.goto(url);
await page.waitForTimeout(2500);
await page.screenshot({ path: 'test/shot-title.png' });

// start the game
await page.keyboard.press('Enter');
await page.waitForTimeout(3500);
await page.screenshot({ path: 'test/shot-wave1.png' });

// fly + shoot for a while
await page.keyboard.down('Space');
for (let i = 0; i < 10; i++) {
  const key = ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'][i % 4];
  await page.keyboard.down(key);
  await page.waitForTimeout(450);
  await page.keyboard.up(key);
}
await page.screenshot({ path: 'test/shot-combat.png' });

// grab some state from the page
const state = await page.evaluate(() => ({
  score: document.getElementById('score').textContent,
  wave: document.getElementById('wave').textContent,
  lives: document.getElementById('lives').children.length,
  hudVisible: document.getElementById('hud-play').style.display,
}));
console.log('STATE', JSON.stringify(state));

await page.keyboard.up('Space');
await page.waitForTimeout(500);
await page.screenshot({ path: 'test/shot-late.png' });

console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'NO PAGE ERRORS');
await browser.close();
process.exit(errors.length ? 1 : 0);
