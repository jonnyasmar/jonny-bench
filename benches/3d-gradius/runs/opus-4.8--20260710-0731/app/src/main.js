import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { clamp, damp, chance, swapRemove, segDistSq, fmt } from './util.js';
import { FX, PALETTES } from './fx.js';
import { Input } from './input.js';
import { AudioEngine } from './audio.js';
import { Bullets } from './bullets.js';
import { Player } from './player.js';
import { spawnEnemy as spawnEnemyImpl } from './enemies.js';
import { spawnCapsule } from './capsule.js';
import { Boss } from './boss.js';
import { Waves } from './waves.js';
import { HUD } from './hud.js';

const BEST_KEY = 'prisma.best';
const FIRST_EXTRA = 60000;
const EXTRA_STEP = 150000;

const NULL_INPUT = { moveX: 0, moveY: 0, usingKeys: false, pointer: { active: false } };

// ---------------------------------------------------------------- renderer

const container = document.getElementById('app');
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', stencil: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.95;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x04050c);
// Linear fog tuned to start well behind the gameplay plane (z=0) so it only
// ever touches the parallax background.
scene.fog = new THREE.Fog(0x04050c, 44, 200);

const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 400);
let camZ = 26;

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
// Restrained bloom: the scene is almost entirely additive sprites and emissive
// edges, so a high strength / low threshold turns every firefight into a white
// wash and hides the ship. Glow should flatter the vectors, not eat them.
const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.48, 0.4, 0.3);
composer.addPass(bloom);
composer.addPass(new OutputPass());

scene.add(new THREE.AmbientLight(0x2a3a55, 1.1));
const key = new THREE.DirectionalLight(0xffffff, 1.5);
key.position.set(4, 6, 9);
scene.add(key);
const rim = new THREE.DirectionalLight(0xff4fd8, 0.8);
rim.position.set(-6, -4, 3);
scene.add(rim);

// ---------------------------------------------------------------- game state

const game = {
  scene, camera, renderer, composer,
  time: 0,
  state: 'title',
  stateT: 0,
  score: 0,
  best: Number(localStorage.getItem(BEST_KEY) || 0),
  lives: 3,
  stage: 1,
  combo: 0,
  multiplier: 1,
  bestChain: 1,
  nextLife: FIRST_EXTRA,
  difficulty: 0,
  timeScale: 1,
  slowT: 0,
  slowScale: 1,
  hitstop: 0,
  bounds: { halfW: 16, halfH: 10.6 },
  enemies: [],
  capsules: [],
  boss: null,
};

game.input = new Input();
game.audio = new AudioEngine();
game.fx = new FX(game);
game.bullets = new Bullets(game);
game.player = new Player(game);
game.waves = new Waves(game);
game.hud = new HUD(game);

game.input.bind(renderer.domElement);
document.getElementById('powerbtn').addEventListener('pointerdown', (e) => {
  e.preventDefault();
  game.input.pointer.tapPower = true;
});

// ---------------------------------------------------------------- helpers

game.spawnEnemy = (kind, x, y, opts) => spawnEnemyImpl(game, kind, x, y, opts);
game.newFormation = (n) => ({ remaining: n, broken: false });
game.breakFormation = (f) => { f.broken = true; };

game.slowmo = (dur, scale) => { game.slowT = dur; game.slowScale = scale; };
game.punch = (amount) => { game.hitstop = Math.max(game.hitstop, amount); };

game.addScore = (n, x = null, y = null, color = '#fff') => {
  game.score += n;
  if (x !== null && n >= 200) game.hud.popup(`+${fmt(n)}`, x, y, color);
  while (game.score >= game.nextLife) {
    game.nextLife += EXTRA_STEP;
    game.lives++;
    game.audio.extraLife();
    game.fx.flash('#ffd166', 0.3);
    game.hud.popup('EXTRA SHIP', game.player.pos.x, game.player.pos.y + 1.6, '#ffd166');
  }
};

game.onEnemyKilled = (e) => {
  game.combo++;
  game.multiplier = clamp(1 + Math.floor(game.combo / 5), 1, 8);
  game.bestChain = Math.max(game.bestChain, game.multiplier);

  const pts = e.kind.score * game.multiplier;
  game.addScore(pts, e.pos.x, e.pos.y, game.multiplier > 1 ? '#ffd166' : '#dce8ff');

  // Hitstop scaled by target size — popcorn shouldn't stutter the frame.
  game.punch(e.r > 1 ? 0.09 : e.r > 0.6 ? 0.03 : 0.012);

  let drop = e.forceDrop || chance(e.kind.drop);
  if (e.formation) {
    e.formation.remaining--;
    if (e.formation.remaining <= 0 && !e.formation.broken) drop = true;
  }
  if (drop) spawnCapsule(game, e.pos.x, e.pos.y);
};

game.onBossWarning = () => {
  game.hud.banner('Warning', 'Massive signature inbound', true);
  game.audio.alarm();
  game.audio.setIntensity(2, game.stage);
  game.fx.flash('#ff3b6b', 0.18);
};

game.spawnBoss = () => {
  game.boss = new Boss(game, game.stage);
  game.hud.showBoss(game.boss.name);
};

function clearEntities({ keepCapsules = false } = {}) {
  for (const e of game.enemies) if (e.alive) e.die(false);
  game.enemies.length = 0;
  if (!keepCapsules) {
    for (const c of game.capsules) c.destroy();
    game.capsules.length = 0;
  }
  game.bullets.reset();
  if (game.boss) { game.boss.destroy(); game.boss = null; }
  game.hud.hideBoss();
}

// ---------------------------------------------------------------- layout

function layout() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h);
  composer.setSize(w, h);
  bloom.setSize(w, h);
  camera.aspect = w / h;

  // Keep a guaranteed playfield regardless of aspect: pull the camera back until
  // both the wanted height and width fit. Capped, because a tall portrait window
  // would otherwise dolly out far enough to make the ship a speck.
  const t = Math.tan((camera.fov * Math.PI) / 360);
  const WANT_H = 10.6, WANT_W = 15.8;
  const zH = WANT_H / t;
  camZ = clamp(WANT_W / (t * camera.aspect), zH, zH * 1.7);
  camera.updateProjectionMatrix();

  game.bounds.halfH = t * camZ;
  game.bounds.halfW = game.bounds.halfH * camera.aspect;
}
addEventListener('resize', layout);
layout();

// ---------------------------------------------------------------- states

function startGame() {
  game.score = 0;
  game.lives = 3;
  game.stage = 1;
  game.combo = 0;
  game.multiplier = 1;
  game.bestChain = 1;
  game.nextLife = FIRST_EXTRA;
  game.difficulty = 0;
  game.timeScale = 1;
  game.hitstop = 0;

  clearEntities();
  game.fx.reset();
  game.fx.setPalette(PALETTES[0]);
  game.player.firingEnabled = true;
  game.player.reset(true);
  game.waves.reset(1);
  game.hud.clearPopups();
  game.hud.setHud(true);
  game.hud.screen(null);
  game.hud.banner('Sector 1', PALETTES[0].name);

  game.audio.init();
  game.audio.startMusic();
  game.audio.setIntensity(1, 1);

  game.state = 'playing';
  game.stateT = 0;
}

function toTitle() {
  clearEntities();
  game.fx.reset();
  game.hud.setHud(false);
  game.hud.screen('title');
  game.player.firingEnabled = false;
  game.player.reset(true);
  game.player.invuln = 0;
  game.state = 'title';
  game.stateT = 0;
  game.audio.setIntensity(0, 1);
}

function playerDied() {
  game.state = 'dying';
  game.stateT = 0;
  game.combo = 0;
  game.multiplier = 1;
  game.slowmo(0.9, 0.35);
}

function respawnOrEnd() {
  game.lives--;
  if (game.lives <= 0) {
    const isRecord = game.score > game.best;
    if (isRecord) {
      game.best = game.score;
      try { localStorage.setItem(BEST_KEY, String(game.best)); } catch {}
    }
    game.audio.stopMusic();
    // Tidy the field so the game-over panel isn't sitting on frozen bullets.
    clearEntities();
    game.state = 'gameover';
    game.stateT = 0;
    game.hud.gameOver(game, isRecord);
    return;
  }
  game.bullets.clearEnemyShots();
  game.player.respawn();
  // A small consolation drop so the arsenal rebuild isn't hopeless.
  spawnCapsule(game, game.player.pos.x + 3.2, game.player.pos.y + 1.4);
  spawnCapsule(game, game.player.pos.x + 4.4, game.player.pos.y - 1.4);
  game.state = 'playing';
}

function stageClear() {
  game.state = 'stageclear';
  game.stateT = 0;
  game.slowmo(1.4, 0.4);
  game.hud.hideBoss();
  game.audio.setIntensity(1, game.stage);
  game.audio.fanfare();

  const bonus = 5000 * game.stage + game.lives * 2000;
  game.addScore(bonus);
  game.hud.banner('Sector Clear', `Bonus ${fmt(bonus)}`);
}

function nextStage() {
  game.stage++;
  const pal = PALETTES[(game.stage - 1) % PALETTES.length];
  clearEntities();
  game.fx.setPalette(pal);
  game.waves.reset(game.stage);
  game.audio.setIntensity(1, game.stage);
  game.hud.banner(`Sector ${game.stage}`, pal.name);
  game.fx.flash('#ffffff', 0.35);
  game.state = 'playing';
  game.stateT = 0;
}

// ---------------------------------------------------------------- collisions

const hits = (ax, ay, ar, bx, by, br) => {
  const dx = ax - bx, dy = ay - by, r = ar + br;
  return dx * dx + dy * dy <= r * r;
};

/** Swept circle-vs-circle along the mover's travel this frame. */
const swept = (b, tx, ty, tr) => {
  const r = b.r + tr;
  return segDistSq(tx, ty, b.px, b.py, b.cx, b.cy) <= r * r;
};

/**
 * Player-bullet hit test. A laser is a beam, not a point, so it tests the whole
 * segment it occupies; everything else sweeps along its travel.
 */
const bulletHits = (b, laser, tx, ty, tr) => {
  if (!laser) return swept(b, tx, ty, tr);
  const half = b.sprite.scale.x * 0.5;
  const cx = b.sprite.position.x;
  return tx + tr >= cx - half && tx - tr <= cx + half && Math.abs(ty - b.sprite.position.y) <= b.r + tr;
};

function collide() {
  const p = game.player;
  const B = game.bullets;
  const boss = game.boss;
  const bossLive = boss && boss.alive && !boss.dying;
  const parts = bossLive ? boss.targets() : null;

  // --- player shots -> enemies / boss
  for (const b of B.player.items) {
    if (!b.alive) continue;
    const bp = b.sprite.position;
    const laser = b.kind === 'laser';
    b.cx = bp.x; b.cy = bp.y;

    let consumed = false;
    for (const e of game.enemies) {
      if (!e.alive || !bulletHits(b, laser, e.pos.x, e.pos.y, e.r)) continue;
      if (b.pierce) {
        if (b.hits.has(e.id)) continue;
        b.hits.add(e.id);
        e.damage(b.dmg, game);
      } else {
        e.damage(b.dmg, game);
        game.fx.burst(bp.x, bp.y, 0, { count: 3, color: 0xffffff, speed: 6, size: 0.3, life: 0.16 });
        B.killPlayerBullet(b);
        consumed = true;
        break;
      }
    }
    if (consumed || !bossLive) continue;

    for (const part of parts) {
      if (!bulletHits(b, laser, part.pos.x, part.pos.y, part.r)) continue;
      if (b.pierce) {
        if (b.hits.has(part)) continue;
        b.hits.add(part);
        boss.damagePart(part, b.dmg);
      } else {
        boss.damagePart(part, b.dmg);
        game.fx.burst(bp.x, bp.y, 0, { count: 3, color: 0xffffff, speed: 6, size: 0.3, life: 0.16 });
        B.killPlayerBullet(b);
        break;
      }
    }
  }

  // --- missiles -> enemies / boss
  for (const m of B.missiles.items) {
    if (!m.alive) continue;
    const mp = m.mesh.position;
    m.cx = mp.x; m.cy = mp.y;
    let done = false;
    for (const e of game.enemies) {
      if (!e.alive || !swept(m, e.pos.x, e.pos.y, e.r)) continue;
      e.damage(m.dmg, game);
      done = true;
      break;
    }
    if (!done && bossLive) {
      for (const part of parts) {
        if (!swept(m, part.pos.x, part.pos.y, part.r)) continue;
        boss.damagePart(part, m.dmg);
        done = true;
        break;
      }
    }
    if (done) {
      game.fx.burst(mp.x, mp.y, 0, { count: 9, color: 0xffa64d, speed: 8, size: 0.45, life: 0.3 });
      game.fx.ring(mp.x, mp.y, 0, 0xffd166, 1.8, 0.25);
      B.killMissile(m);
    }
  }

  if (!p.alive || p.dead) return;

  // --- capsules -> player
  for (const c of game.capsules) {
    if (!c.alive) continue;
    if (hits(p.pos.x, p.pos.y, p.radius + 0.45, c.pos.x, c.pos.y, c.r)) {
      c.collect();
      p.addCapsule();
    }
  }

  if (p.invuln > 0) return;

  // --- hostile fire -> player
  for (const b of B.enemy.items) {
    if (!b.alive) continue;
    b.cx = b.sprite.position.x; b.cy = b.sprite.position.y;
    if (!swept(b, p.pos.x, p.pos.y, p.radius)) continue;
    B.killEnemyBullet(b);
    if (p.takeHit()) playerDied();
    return; // one hit per frame is plenty
  }

  // --- bodies -> player
  for (const e of game.enemies) {
    if (!e.alive) continue;
    if (!hits(p.pos.x, p.pos.y, p.radius, e.pos.x, e.pos.y, e.r * 0.85)) continue;
    const hadShield = p.shieldHP > 0;
    if (p.takeHit()) { playerDied(); return; }
    if (hadShield) e.damage(6, game); // shield shears through small fry
    return;
  }

  if (bossLive) {
    for (const part of parts) {
      if (!hits(p.pos.x, p.pos.y, p.radius, part.pos.x, part.pos.y, part.r * 0.9)) continue;
      if (p.takeHit()) playerDied();
      return;
    }
  }
}

// ---------------------------------------------------------------- update

function pruneList(list) {
  for (let i = list.length - 1; i >= 0; i--) if (!list[i].alive) swapRemove(list, i);
}

// The title / game-over panels swallow pointer events before they reach the
// canvas, so listen at the document level for "any tap to continue".
let uiTap = false;
addEventListener('pointerdown', () => { uiTap = true; }, { capture: true });

function startPressed() {
  if (uiTap || game.input.pointer.active) return true;
  for (const c of game.input.justDown) if (c !== 'KeyM' && c !== 'KeyP') return true;
  return false;
}

function update(dt) {
  const input = game.input;
  game.time += dt;
  game.stateT += dt;

  if (input.pressed('KeyM')) {
    game.audio.init();
    game.audio.toggleMute();
  }

  // ---- state-level input
  if (game.state === 'title') {
    if (startPressed()) { game.audio.init(); startGame(); }
  } else if (game.state === 'gameover') {
    if (game.stateT > 1.1 && startPressed()) startGame();
  } else if (game.state === 'playing' || game.state === 'paused') {
    if (input.pressed('KeyP', 'Escape')) {
      const paused = game.state === 'paused';
      game.state = paused ? 'playing' : 'paused';
      game.hud.screen(paused ? null : 'pause');
      if (paused) game.audio.ctx?.resume(); else game.audio.ctx?.suspend();
    }
  }

  if (game.state === 'paused') { game.fx.update(0, 0); game.hud.update(game); return; }

  // ---- time dilation
  if (game.slowT > 0) {
    game.slowT -= dt;
    game.timeScale = damp(game.timeScale, game.slowScale, 9, dt);
  } else {
    game.timeScale = damp(game.timeScale, 1, 4, dt);
  }
  let sdt = dt * game.timeScale;
  if (game.hitstop > 0) { game.hitstop -= dt; sdt = 0; }

  // ---- simulation
  if (game.state === 'title') {
    game.player.update(sdt, NULL_INPUT);
    // Park the hero ship in the empty left margin, clear of the logo and the
    // key legend, and scale it up so it actually reads.
    game.player.pos.set(-game.bounds.halfW * 0.66, 1.6 + Math.sin(game.time * 1.05) * 0.7, 0);
    game.player.group.rotation.z = Math.sin(game.time * 1.05 + 0.6) * 0.09;
    game.player.group.rotation.y = 0.25 + Math.sin(game.time * 0.5) * 0.12;
    game.player.group.scale.setScalar(1.5);
  } else if (game.state !== 'gameover') {
    game.difficulty = game.waves.difficulty;

    if (game.state === 'playing') {
      game.waves.update(sdt);
      if (game.player.cursor > 0 && input.powerPressed) {
        const r = game.player.activate();
        if (r.ok) {
          game.audio.select();
          game.hud.cellFire(r.key);
          game.fx.ring(game.player.pos.x, game.player.pos.y, 0, 0xffd166, 5, 0.45);
          game.fx.flash('#ffd166', 0.14);
        } else {
          game.audio.deny();
        }
      } else if (input.powerPressed) {
        game.audio.deny();
      }
    }

    if (game.player.alive) game.player.update(sdt, input);

    for (const e of game.enemies) if (e.alive) e.update(sdt, game);
    for (const c of game.capsules) if (c.alive) c.update(sdt, game);

    if (game.boss) {
      game.boss.update(sdt, game);
      if (game.boss.dead) {
        game.addScore(game.boss.score, game.boss.x, game.boss.y, '#ffd166');
        game.boss = null;
        stageClear();
      }
    }

    game.bullets.update(sdt);
    if (game.state === 'playing') collide();

    pruneList(game.enemies);
    pruneList(game.capsules);

    // ---- state timers
    if (game.state === 'dying' && game.stateT > 1.7) respawnOrEnd();
    if (game.state === 'stageclear' && game.stateT > 3.6) nextStage();
  }

  game.fx.update(sdt, game.state === 'title' ? 0.55 : 1);
  game.hud.update(game);

  // ---- camera rig
  const p = game.player.pos;
  const bossPull = game.boss && game.boss.entered ? 1.07 : 1;
  const z = damp(camera.position.z, camZ * bossPull, 3, dt);
  camera.position.set(p.x * 0.055, p.y * 0.045, z);
  camera.rotation.set(0, p.x * 0.0035, 0);
  game.fx.applyShake(camera, dt);
}

// ---------------------------------------------------------------- loop

let last = performance.now();
let running = true;

function frame(now) {
  requestAnimationFrame(frame);
  if (!running) { last = now; return; }
  const dt = Math.min((now - last) / 1000, 1 / 30);
  last = now;
  update(dt);
  // Edge-triggered input must be cleared exactly once per frame, on every code
  // path — clearing inside update() would strand keys behind its early returns.
  game.input.endFrame();
  uiTap = false;
  composer.render();
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden && game.state === 'playing') {
    game.state = 'paused';
    game.hud.screen('pause');
    game.audio.ctx?.suspend();
  }
});

renderer.domElement.addEventListener('webglcontextlost', (e) => { e.preventDefault(); running = false; });
renderer.domElement.addEventListener('webglcontextrestored', () => { running = true; last = performance.now(); });

// ---------------------------------------------------------------- boot

window.__game = game; // handy for debugging from the console

toTitle();
document.getElementById('best').textContent = fmt(game.best);

// Warm up shader compilation before the first frame so the title doesn't hitch.
composer.render();
requestAnimationFrame((t) => { last = t; frame(t); });
document.getElementById('loading').classList.add('gone');
