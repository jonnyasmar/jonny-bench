import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

import { PAL, TUNE, SURGE_SLOTS } from './config.js';
import { hit, rand } from './util.js';
import { AudioEngine } from './audio.js';
import { Input } from './input.js';
import { Particles, Shockwaves, Shake } from './fx.js';
import { World } from './world.js';
import { HUD } from './hud.js';
import { Director } from './director.js';
import { Player, damageEnemy, killEnemy } from './entities.js';

// ---------------------------------------------------------------------------
// Renderer / scene / post

const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const CAM_DIST = 17;
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 120);
camera.position.set(0, 0, CAM_DIST);

const target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
  samples: renderer.capabilities.isWebGL2 ? 4 : 0,
});
const composer = new EffectComposer(renderer, target);
composer.addPass(new RenderPass(scene, camera));
const BLOOM_BASE = 0.85;
const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), BLOOM_BASE, 0.65, 0.22);
composer.addPass(bloom);
composer.addPass(new OutputPass());

// ---------------------------------------------------------------------------
// Game context

const audio = new AudioEngine();
const input = new Input(() => audio.unlock());
const hud = new HUD();

const G = {
  scene, camera, renderer,
  time: 0,
  state: 'title', // title | playing | paused | over
  score: 0, hi: 0, lives: TUNE.startLives,
  combo: 0, comboT: 0, mult: 1,
  chain: 0,
  enemies: [], pbullets: [], ebullets: [], pickups: [],
  chains: new Map(), nextChainId: 1,
  boss: null,
  bounds: { x0: -16, x1: 16, y0: -8, y1: 8 },
  worldPerPx: 0.02,
  input, audio, hud,
  hitstopT: 0, hitstopScale: 1,
  bloomPulseV: 0,
};

G.hitstop = (dur, scale) => { G.hitstopT = dur; G.hitstopScale = scale; };
G.bloomPulse = (v) => { G.bloomPulseV = Math.max(G.bloomPulseV, v); };

G.w2s = (() => {
  const v = new THREE.Vector3();
  return (x, y, z = 0) => {
    v.set(x, y, z).project(camera);
    return { x: (v.x * 0.5 + 0.5) * window.innerWidth, y: (-v.y * 0.5 + 0.5) * window.innerHeight };
  };
})();

G.addScore = (pts, x, y, label) => {
  const total = pts * G.mult;
  G.score += total;
  hud.setScore(G.score);
  if (G.score > G.hi) { G.hi = G.score; hud.setHi(G.hi); }
  if (x !== undefined) {
    const s = G.w2s(x, y);
    hud.popup(s.x, s.y, `${label || '+'}${total.toLocaleString('en-US')}`, label ? 'popup-big' : '');
  }
};

G.onKill = () => {
  G.combo++;
  G.comboT = 0;
  const m = Math.min(9, 1 + Math.floor(G.combo / 8));
  if (m !== G.mult) {
    G.mult = m;
    hud.setMult(m);
    if (m > 1) {
      const s = G.w2s(G.player.x, G.player.y - 1.2);
      hud.popup(s.x, s.y, `COMBO ×${m}`, 'popup-mult');
    }
  }
};

G.onPlayerDeath = () => {
  G.lives--;
  G.combo = 0; G.mult = 1;
  hud.setMult(1);
  hud.setLives(Math.max(0, G.lives));
  if (G.lives < 0) gameOver();
};

G.onBossDead = () => {
  G.boss = null;
  G.director.onBossDead(G);
};

const world = new World(scene);
G.particles = new Particles(scene);
G.shocks = new Shockwaves(scene);
G.shake = new Shake();
G.director = new Director();
G.player = new Player(G);

try { G.hi = parseInt(localStorage.getItem('voidsurge_hi') || '0', 10) || 0; } catch (e) { /* private mode */ }
hud.setHi(G.hi);
hud.setLives(G.lives);
hud.setChain(0, false);

window.__VS = G; // debug hook

// ---------------------------------------------------------------------------
// Resize / bounds

function computeBounds() {
  const halfH = Math.tan((camera.fov * Math.PI) / 360) * CAM_DIST;
  const halfW = halfH * camera.aspect;
  G.bounds = {
    x0: -Math.min(17, halfW - 0.3),
    x1: Math.min(17, halfW - 0.3),
    y0: -Math.min(7.9, halfH - 1.9),
    y1: Math.min(7.9, halfH - 1.9),
  };
  G.worldPerPx = (halfH * 2) / window.innerHeight;
}
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  bloom.setSize(window.innerWidth, window.innerHeight);
  computeBounds();
}
window.addEventListener('resize', onResize);
computeBounds();

// ---------------------------------------------------------------------------
// Surge chain (the Gradius-style redeem meter)

function collectShard() {
  audio.pickup();
  hud.pulseChain();
  if (G.chain >= SURGE_SLOTS.length) {
    G.addScore(500, G.player.x, G.player.y - 1);
    return;
  }
  G.chain++;
  hud.setChain(G.chain, G.chain === SURGE_SLOTS.length);
}

function redeemSurge() {
  if (G.chain <= 0 || !G.player.alive) return;
  const idx = G.chain - 1;
  const p = G.player;
  const name = SURGE_SLOTS[idx].key;
  let msg = name;

  switch (idx) {
    case 0: // THRUST
      if (p.speedLvl < TUNE.playerSpeedMax) p.speedLvl++;
      else { G.addScore(1000, p.x, p.y); msg = 'MAX THRUST +1000'; }
      break;
    case 1: // TWIN
      if (p.weapon !== 'twin') p.weapon = 'twin';
      else { G.addScore(1000, p.x, p.y); msg = 'TWIN +1000'; }
      break;
    case 2: // PULSE
      if (p.weapon !== 'pulse') p.weapon = 'pulse';
      else { G.addScore(1000, p.x, p.y); msg = 'PULSE +1000'; }
      break;
    case 3: // ECHO
      if (p.drones.length < 2) p.addDrone();
      else { G.addScore(2000, p.x, p.y); msg = 'ECHO +2000'; }
      break;
    case 4: // WARD
      p.shieldHp = 3;
      break;
    case 5: // NOVA
      fireNova();
      break;
  }

  G.chain = 0;
  hud.setChain(0, false);
  audio.powerup();
  hud.flash('rgba(120,246,255,0.28)', 0.28);
  G.bloomPulse(0.8);
  const s = G.w2s(p.x, p.y - 1.4);
  hud.popup(s.x, s.y, `◈ ${msg}`, 'popup-surge');
  G.particles.burst(p.x, p.y, 0, { count: 30, color: PAL.shard, speed: 7, size: 0.4, life: 0.7, drag: 3 });
  G.shocks.spawn(p.x, p.y, 0.2, PAL.shard, 3, 0.5);
}

function fireNova() {
  const p = G.player;
  audio.nova();
  G.shake.add(0.6);
  hud.flash('rgba(255,255,255,0.85)', 0.85);
  G.bloomPulse(2.5);
  G.shocks.spawn(p.x, p.y, 0.3, 0xffffff, 20, 1.0);
  G.shocks.spawn(p.x, p.y, 0.3, PAL.pulse, 14, 0.8);
  G.hitstop(0.35, 0.12);
  for (const e of [...G.enemies]) killEnemy(G, e, { scoreMul: 1 });
  for (const b of G.ebullets) {
    b.dead = true;
    G.particles.spawn(b.x, b.y, 0, rand(-3, 3), rand(-3, 3), 0, 0xffffff, 0.4, 0.4, 3, 0);
  }
  if (G.boss && G.boss.state === 'fight') G.boss.takeHit(G, 50);
}

// ---------------------------------------------------------------------------
// State transitions

function clearField() {
  for (const e of G.enemies) scene.remove(e.mesh);
  for (const b of G.pbullets) scene.remove(b.mesh);
  for (const b of G.ebullets) scene.remove(b.mesh);
  for (const s of G.pickups) scene.remove(s.mesh);
  G.enemies = []; G.pbullets = []; G.ebullets = []; G.pickups = [];
  G.chains.clear();
  if (G.boss) { G.boss.dispose(G); G.boss = null; }
  hud.showBoss(null);
}

function startGame() {
  clearField();
  G.score = 0; G.lives = TUNE.startLives;
  G.combo = 0; G.mult = 1; G.chain = 0;
  G.director.reset();
  G.player.reset();
  audio.intensity = 0;
  hud.setScore(0);
  hud.setLives(G.lives);
  hud.setMult(1);
  hud.setChain(0, false);
  hud.showTitle(false);
  hud.hideGameOver();
  hud.message('SECTOR 1<br><span class="msg-sub">good hunting, pilot</span>', 'good', 2.5);
  audio.uiStart();
  G.state = 'playing';
}

function gameOver() {
  G.state = 'over';
  audio.intensity = 0;
  let record = false;
  try {
    const prev = parseInt(localStorage.getItem('voidsurge_hi') || '0', 10) || 0;
    record = G.score > prev;
    if (record) localStorage.setItem('voidsurge_hi', String(G.score));
  } catch (e) { /* ignore */ }
  setTimeout(() => { if (G.state === 'over') hud.showGameOver(G.score, G.hi, record); }, 900);
}

// ---------------------------------------------------------------------------
// Collisions

function collide() {
  const p = G.player;

  // player bullets → boss, enemies
  for (const b of G.pbullets) {
    if (b.dead) continue;

    if (G.boss && (G.boss.state === 'fight' || G.boss.state === 'enter')) {
      let blocked = false;
      for (const c of G.boss.getColliders()) {
        if (!hit(b.x, b.y, b.r, c.x, c.y, c.r)) continue;
        if (c.kind === 'plate') {
          b.dead = true;
          blocked = true;
          audio.deflect();
          G.particles.burst(b.x, b.y, 0, { count: 5, color: PAL.bossShell, speed: 5, size: 0.3, life: 0.3, drag: 3 });
        } else {
          if (b.pierce) {
            if (!b.hitSet.has(G.boss)) { b.hitSet.add(G.boss); G.boss.takeHit(G, b.dmg); }
          } else {
            b.dead = true;
            G.boss.takeHit(G, b.dmg);
          }
          G.particles.burst(b.x, b.y, 0, { count: 6, color: PAL.bossCore, speed: 6, size: 0.35, life: 0.35, drag: 3 });
        }
        break;
      }
      if (blocked) continue;
      if (b.dead) continue;
    }

    for (const e of G.enemies) {
      if (e.dead) continue;
      if (!hit(b.x, b.y, b.r, e.x, e.y, e.r)) continue;
      if (b.pierce) {
        if (b.hitSet.has(e)) continue;
        b.hitSet.add(e);
        damageEnemy(G, e, b.dmg);
      } else {
        b.dead = true;
        damageEnemy(G, e, b.dmg);
        G.particles.burst(b.x, b.y, 0, { count: 4, color: PAL.pbullet, speed: 4, size: 0.25, life: 0.25, drag: 3 });
        break;
      }
    }
  }

  if (!p.alive) return;

  // enemies / enemy bullets / boss body → player
  if (p.inv <= 0) {
    for (const e of G.enemies) {
      if (!e.dead && hit(p.x, p.y, TUNE.playerRadius + 0.15, e.x, e.y, e.r)) {
        killEnemy(G, e, { scoreMul: 0.5 });
        p.hurt(G);
        break;
      }
    }
    for (const b of G.ebullets) {
      if (!b.dead && hit(p.x, p.y, TUNE.playerRadius, b.x, b.y, b.r)) {
        b.dead = true;
        p.hurt(G);
        break;
      }
    }
    if (G.boss && G.boss.state !== 'dead') {
      for (const c of G.boss.getColliders()) {
        if (hit(p.x, p.y, TUNE.playerRadius + 0.1, c.x, c.y, c.r)) { p.hurt(G); break; }
      }
    }
  }

  // shards → player (with magnet pull handled in update)
  for (const s of G.pickups) {
    if (!s.dead && hit(p.x, p.y, 0.9, s.x, s.y, 0.3)) {
      s.dead = true;
      collectShard();
      G.particles.burst(s.x, s.y, 0, { count: 12, color: PAL.shard, speed: 4, size: 0.3, life: 0.4, drag: 3 });
    }
  }
}

// ---------------------------------------------------------------------------
// Per-frame updates for simple pools

function updatePools(dt) {
  const b = G.bounds;

  for (const bl of G.pbullets) {
    bl.x += bl.vx * dt; bl.y += bl.vy * dt;
    bl.mesh.position.set(bl.x, bl.y, 0.1);
    if (bl.x > b.x1 + 3 || bl.x < b.x0 - 3 || bl.y > b.y1 + 4 || bl.y < b.y0 - 4) bl.dead = true;
  }
  G.pbullets = G.pbullets.filter((bl) => (bl.dead ? (scene.remove(bl.mesh), false) : true));

  for (const bl of G.ebullets) {
    bl.x += bl.vx * dt; bl.y += bl.vy * dt;
    bl.life -= dt;
    bl.mesh.position.set(bl.x, bl.y, 0.15);
    const pulse = 0.62 + Math.sin(G.time * 14 + bl.x) * 0.1;
    bl.mesh.scale.set(pulse, pulse, 1);
    if (bl.life <= 0 || bl.x > b.x1 + 4 || bl.x < b.x0 - 3 || bl.y > b.y1 + 4 || bl.y < b.y0 - 4) bl.dead = true;
  }
  G.ebullets = G.ebullets.filter((bl) => (bl.dead ? (scene.remove(bl.mesh), false) : true));

  const p = G.player;
  for (const s of G.pickups) {
    s.t += dt;
    // magnet
    if (p.alive) {
      const dx = p.x - s.x, dy = p.y - s.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 12) {
        const d = Math.sqrt(d2) || 1;
        s.x += (dx / d) * 9 * dt;
        s.y += (dy / d) * 9 * dt;
      }
    }
    s.x += s.vx * dt;
    s.y += Math.sin(s.t * 2.4) * 0.5 * dt;
    s.mesh.position.set(s.x, s.y, 0.1);
    s.mesh.rotation.y += dt * 4;
    s.mesh.rotation.x += dt * 2;
    if (Math.random() < 0.25) G.particles.spawn(s.x, s.y, 0, rand(-0.5, 0.5), rand(-0.5, 0.5), 0, PAL.shard, 0.22, 0.5, 1, 0);
    if (s.x < b.x0 - 2) s.dead = true;
  }
  G.pickups = G.pickups.filter((s) => (s.dead ? (scene.remove(s.mesh), false) : true));

  for (const e of G.enemies) {
    if (!e.dead) e.update(dt, G);
    if (e.x < b.x0 - 4 || e.x > b.x1 + 12) {
      e.dead = true;
      if (e.chainId !== undefined) {
        const c = G.chains.get(e.chainId);
        if (c) c.broken = true;
      }
    }
  }
  G.enemies = G.enemies.filter((e) => (e.dead ? (scene.remove(e.mesh), false) : true));
}

// ---------------------------------------------------------------------------
// Combo decay

function updateCombo(dt) {
  if (G.combo <= 0) return;
  G.comboT += dt;
  if (G.comboT > TUNE.comboDecay) {
    G.comboT = 0;
    G.combo = 0;
    if (G.mult !== 1) { G.mult = 1; hud.setMult(1); }
  }
}

// ---------------------------------------------------------------------------
// Main loop

let last = performance.now();
let titleT = 0;

function frame(now) {
  requestAnimationFrame(frame);
  const rawDt = Math.min((now - last) / 1000, 1 / 30);
  last = now;

  // global keys
  if (input.pressed('mute')) hud.showMuted(audio.toggleMute());
  if (input.pressed('pause') && (G.state === 'playing' || G.state === 'paused')) {
    G.state = G.state === 'playing' ? 'paused' : 'playing';
    hud.showPause(G.state === 'paused');
  }

  let timescale = 1;
  if (G.hitstopT > 0) {
    G.hitstopT -= rawDt;
    timescale = G.hitstopScale;
  }
  const dt = rawDt * timescale;

  if (G.state === 'title') {
    G.time += dt;
    titleT += dt;
    world.update(dt, TUNE.scroll * 1.4, G.time);
    G.particles.update(dt);
    G.shocks.update(dt);
    // idle ship drift
    const p = G.player;
    p.x = -8 + Math.sin(titleT * 0.6) * 0.8;
    p.y = Math.sin(titleT * 0.9) * 1.2;
    p.mesh.position.set(p.x, p.y, 0);
    p.mesh.rotation.x = Math.sin(titleT * 0.9) * -0.12;
    p.engine.scale.set(1.1 + rand(0.4), 0.7 + rand(0.2), 1);
    if (Math.random() < 0.6) G.particles.spawn(p.x - 1.4, p.y, 0, -7, rand(-0.6, 0.6), 0, PAL.engine, 0.3, 0.35, 3, 0);
    if (input.pressed('start') || input.pressed('fire')) startGame();
  } else if (G.state === 'playing') {
    G.time += dt;
    world.update(dt, TUNE.scroll * (1 + G.director.diff * 0.25), G.time);
    G.director.update(dt, G);
    G.player.update(dt, G);
    if (G.boss) G.boss.update(dt, G);
    updatePools(dt);
    collide();
    updateCombo(dt);
    G.particles.update(dt);
    G.shocks.update(dt);
    if (input.pressed('redeem')) redeemSurge();
  } else if (G.state === 'over') {
    G.time += dt;
    world.update(dt, TUNE.scroll, G.time);
    if (G.boss) G.boss.update(dt, G);
    updatePools(dt);
    G.particles.update(dt);
    G.shocks.update(dt);
    if (input.pressed('restart') || input.pressed('start')) startGame();
  }

  // camera follow + shake
  G.shake.update(rawDt);
  const px = G.player ? G.player.x : 0;
  const py = G.player ? G.player.y : 0;
  camera.position.x = px * 0.1 + G.shake.x + Math.sin(G.time * 0.4) * 0.12;
  camera.position.y = py * 0.14 + G.shake.y + Math.cos(G.time * 0.3) * 0.08;
  camera.lookAt(px * 0.04, py * 0.06, 0);
  camera.rotation.z += G.shake.roll;

  // bloom pulse decay
  if (G.bloomPulseV > 0) G.bloomPulseV = Math.max(0, G.bloomPulseV - rawDt * 3);
  bloom.strength = BLOOM_BASE + G.bloomPulseV;

  hud.update(rawDt);
  input.endFrame();
  composer.render();
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden && G.state === 'playing') {
    G.state = 'paused';
    hud.showPause(true);
  }
  last = performance.now();
});

requestAnimationFrame(frame);
