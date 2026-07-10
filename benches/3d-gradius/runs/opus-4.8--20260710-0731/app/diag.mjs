import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new', args: ['--use-gl=angle','--use-angle=metal','--enable-webgl','--ignore-gpu-blocklist'],
});
const page = await browser.newPage();
page.on('pageerror', e => console.log('ERR', e.message));
await page.goto('http://localhost:8099/', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 700));

const info = await page.evaluate(async () => {
  const THREE = await import('three');
  const g = window.__game;
  const p = g.player;
  const hull = p.body.geometry;
  hull.computeBoundingBox();
  const bb = hull.boundingBox;
  const pos = hull.attributes.position.array;
  let nan = 0;
  for (let i = 0; i < pos.length; i++) if (!Number.isFinite(pos[i])) nan++;

  // signed area of the source outline
  const pts = [
    [1.30,0],[0.36,0.30],[-0.28,0.34],[-0.52,0.72],[-0.94,0.66],
    [-0.76,0.22],[-1.06,0.16],[-1.06,-0.16],[-0.76,-0.22],
    [-0.94,-0.66],[-0.52,-0.72],[-0.28,-0.34],[0.36,-0.30],
  ];
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i+1)%pts.length];
    area += a[0]*b[1] - b[0]*a[1];
  }
  area /= 2;

  return {
    hullVerts: hull.attributes.position.count,
    hullIndexed: !!hull.index,
    nanCount: nan,
    bbox: [bb.min.toArray().map(v=>+v.toFixed(2)), bb.max.toArray().map(v=>+v.toFixed(2))],
    edgeVerts: p.edges.geometry.attributes.position.count,
    bodyVisible: p.body.visible,
    bodySide: p.body.material.side,   // 0=Front 1=Back 2=Double
    frontSideConst: THREE.FrontSide,
    doubleSideConst: THREE.DoubleSide,
    groupScale: p.group.scale.toArray(),
    signedArea: +area.toFixed(3),
    winding: area > 0 ? 'CCW' : 'CW',
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
