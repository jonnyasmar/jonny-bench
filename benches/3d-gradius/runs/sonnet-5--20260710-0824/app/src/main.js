import * as THREE from 'three';
import { createSceneRig, visibleBoundsAtZ } from './engine/scene.js';
import { createBackground } from './engine/background.js';
import { input } from './engine/input.js';
import { audio } from './engine/audio.js';
import { ParticleSystem } from './entities/particles.js';
import { BulletSystem } from './entities/bullets.js';
import { PowerupSystem } from './entities/powerups.js';
import { Player, POWER_SLOTS } from './entities/player.js';
import { TerrainSystem } from './entities/terrain.js';
import { EnemySystem } from './entities/enemy.js';
import { Boss } from './entities/boss.js';
import { WaveDirector, sectorScaling } from './data/waves.js';

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

const canvas = document.getElementById('scene');
const rig = createSceneRig(canvas);
const { renderer, scene, camera, camRig, composer } = rig;

const background = createBackground(scene);
const particles = new ParticleSystem(scene);
const bullets = new BulletSystem(scene, particles);
const powerups = new PowerupSystem(scene);
const player = new Player(scene, particles, audio);
const terrain = new TerrainSystem(scene);
const enemies = new EnemySystem(scene, particles, bullets, audio);
const boss = new Boss(scene, particles, bullets, audio, enemies);

function getBounds() {
  const { halfWidth, halfHeight } = visibleBoundsAtZ(camera, 0);
  return { left: -halfWidth, right: halfWidth, top: halfHeight, bottom: -halfHeight };
}

const waveDirector = new WaveDirector(enemies, getBounds);

// ---------------------------------------------------------------------------
// DOM / HUD
// ---------------------------------------------------------------------------

const el = {
  hud: document.getElementById('hud'),
  score: document.getElementById('score'),
  sector: document.getElementById('sector'),
  lives: document.getElementById('lives'),
  bossHealthWrap: document.getElementById('boss-health'),
  bossBar: document.getElementById('boss-bar'),
  bossName: document.getElementById('boss-name'),
  powerSlots: Array.from(document.querySelectorAll('.power-slot')),
  waveBanner: document.getElementById('wave-banner'),
  startScreen: document.getElementById('start-screen'),
  pauseScreen: document.getElementById('pause-screen'),
  gameoverScreen: document.getElementById('gameover-screen'),
  loadingScreen: document.getElementById('loading-screen'),
  finalScore: document.getElementById('final-score'),
  finalSector: document.getElementById('final-sector'),
  startBtn: document.getElementById('start-btn'),
  resumeBtn: document.getElementById('resume-btn'),
  restartBtn: document.getElementById('restart-btn'),
  soundToggle: document.getElementById('sound-toggle'),
};

let soundOn = true;
el.soundToggle.addEventListener('click', () => {
  soundOn = !soundOn;
  audio.setMuted(!soundOn);
  el.soundToggle.textContent = `SOUND: ${soundOn ? 'ON' : 'OFF'}`;
});

// ---------------------------------------------------------------------------
// Game state
// ---------------------------------------------------------------------------

const STATE = { LOADING: 'loading', START: 'start', PLAYING: 'playing', PAUSED: 'paused', GAMEOVER: 'gameover' };
let state = STATE.LOADING;

let score = 0;
let lives = 3;
let sector = 1;
let nextLifeScore = 20000;
let gameTime = 0;
let respawnTimer = 0;
let bossActive = false;
let shakeTime = 0;
let shakeMag = 0;
let hitStop = 0;

function setState(next) {
  state = next;
  el.startScreen.classList.toggle('hidden', next !== STATE.START);
  el.pauseScreen.classList.toggle('hidden', next !== STATE.PAUSED);
  el.gameoverScreen.classList.toggle('hidden', next !== STATE.GAMEOVER);
  el.loadingScreen.classList.toggle('hidden', next !== STATE.LOADING);
  el.hud.classList.toggle('hidden', next !== STATE.PLAYING && next !== STATE.PAUSED);
}

function formatScore(s) {
  return String(Math.floor(s)).padStart(6, '0');
}

function addScore(amount) {
  score += amount;
  while (score >= nextLifeScore) {
    lives = Math.min(9, lives + 1);
    nextLifeScore += 30000;
    audio.extraLife();
    popup('EXTRA SHIP');
  }
}

function popup(text) {
  const p = document.getElementById('combo-popup');
  p.textContent = text;
  p.classList.remove('hidden');
  p.style.animation = 'none';
  // eslint-disable-next-line no-unused-expressions
  p.offsetHeight;
  p.style.animation = 'banner-fade 1.6s ease forwards';
}

function showBanner(text) {
  el.waveBanner.textContent = text;
  el.waveBanner.classList.remove('hidden');
  el.waveBanner.style.animation = 'none';
  // eslint-disable-next-line no-unused-expressions
  el.waveBanner.offsetHeight;
  el.waveBanner.style.animation = 'banner-fade 2.4s ease forwards';
}

function shake(mag, time) {
  shakeMag = Math.max(shakeMag, mag);
  shakeTime = Math.max(shakeTime, time);
}

function triggerHitStop(t) {
  hitStop = Math.max(hitStop, t);
}

// ---------------------------------------------------------------------------
// Game lifecycle
// ---------------------------------------------------------------------------

function startGame() {
  score = 0;
  lives = 3;
  sector = 1;
  nextLifeScore = 20000;
  gameTime = 0;
  respawnTimer = 0;
  bossActive = false;
  boss.remove();

  const bounds = getBounds();
  waveDirector.startSector(1);
  applyScaling(waveDirector.scaling);
  terrain.reset(bounds);
  player.reset(bounds);
  bullets.clear();
  powerups.clear();
  enemies.clear();
  el.bossHealthWrap.classList.add('hidden');

  setState(STATE.PLAYING);
  showBanner('SECTOR 1');
  updateHud();
}

function applyScaling(sc) {
  terrain.setDifficulty(sc.terrainAmp, sc.terrainGap);
}

function endGame() {
  setState(STATE.GAMEOVER);
  el.finalScore.textContent = formatScore(score);
  el.finalSector.textContent = `REACHED SECTOR ${sector}`;
}

enemies.onDeath = (enemy) => {
  addScore(enemy.score);
  if (Math.random() < enemy.dropChance) {
    powerups.spawn({
      position: enemy.mesh.position,
      velocity: new THREE.Vector3(-4, 0, 0),
      kind: Math.random() < 0.05 ? 'life' : 'capsule',
    });
  }
  shake(0.12, 0.12);
};

player.deathCallbacks.push(() => {
  shake(0.5, 0.5);
  triggerHitStop(0.12);
  lives -= 1;
  updateHud();
  respawnTimer = 1.6;
});

// ---------------------------------------------------------------------------
// Input wiring for screens
// ---------------------------------------------------------------------------

el.startBtn.addEventListener('click', () => {
  audio.init();
  audio.resume();
  startGame();
});
el.resumeBtn.addEventListener('click', () => resumeGame());
el.restartBtn.addEventListener('click', () => startGame());

function pauseGame() {
  if (state !== STATE.PLAYING) return;
  setState(STATE.PAUSED);
}
function resumeGame() {
  if (state !== STATE.PAUSED) return;
  setState(STATE.PLAYING);
}

// ---------------------------------------------------------------------------
// HUD sync
// ---------------------------------------------------------------------------

function updateHud() {
  el.score.textContent = formatScore(score);
  el.sector.textContent = String(sector);
  el.lives.innerHTML = Array.from({ length: Math.max(0, lives) }).map(() => '<span>&#9650;</span>').join(' ');

  const highlight = player.highlightIndex;
  el.powerSlots.forEach((slotEl, i) => {
    const name = POWER_SLOTS[i];
    slotEl.classList.toggle('filled', player.meterCount > 0 && i <= highlight);
    slotEl.classList.toggle('selected', i === highlight);
    let owned = false;
    if (name === 'SPEED') owned = player.speedLevel > 1;
    if (name === 'MISSILE') owned = player.missile;
    if (name === 'DOUBLE') owned = player.weaponMode === 'double';
    if (name === 'LASER') owned = player.weaponMode === 'laser';
    if (name === 'OPTION') owned = player.optionCount > 0;
    if (name === 'SHIELD') owned = player.shieldHits > 0;
    slotEl.style.borderColor = owned ? 'rgba(255,184,77,0.8)' : '';
  });

  if (bossActive) {
    el.bossHealthWrap.classList.remove('hidden');
    el.bossBar.style.width = `${Math.max(0, (boss.hp / boss.maxHp) * 100)}%`;
    el.bossName.textContent = boss.name;
  } else {
    el.bossHealthWrap.classList.add('hidden');
  }
}

// ---------------------------------------------------------------------------
// Weapons
// ---------------------------------------------------------------------------

const BOLT_SPEED = 34;
const LASER_SPEED = 40;
const MISSILE_SPEED = 20;

function fireWeapons() {
  if (!player.alive || !player.canFire()) return;
  const pos = player.position;
  const noseOffset = 1.2;
  const firePos = new THREE.Vector3(pos.x + noseOffset, pos.y, 0);

  if (player.weaponMode === 'laser') {
    bullets.spawn({
      position: firePos,
      velocity: new THREE.Vector3(LASER_SPEED, 0, 0),
      owner: 'player', damage: 2, radius: 0.5, life: 1.1, type: 'laser', pierce: 99,
    });
    player.fireCooldown = 0.24;
    audio.shoot('laser');
  } else {
    bullets.spawn({
      position: firePos,
      velocity: new THREE.Vector3(BOLT_SPEED, 0, 0),
      owner: 'player', damage: 1, radius: 0.28, life: 1.6, type: 'blaster',
    });
    if (player.weaponMode === 'double') {
      bullets.spawn({
        position: firePos,
        velocity: new THREE.Vector3(0, BOLT_SPEED, 0),
        owner: 'player', damage: 1, radius: 0.28, life: 1.0, type: 'blaster',
      });
    }
    player.fireCooldown = 0.15;
    audio.shoot('blaster');
  }

  for (const optMesh of player.optionMeshes) {
    bullets.spawn({
      position: optMesh.position,
      velocity: new THREE.Vector3(player.weaponMode === 'laser' ? LASER_SPEED : BOLT_SPEED, 0, 0),
      owner: 'player', damage: player.weaponMode === 'laser' ? 2 : 1, radius: 0.28, life: 1.2,
      type: player.weaponMode === 'laser' ? 'laser' : 'blaster', pierce: player.weaponMode === 'laser' ? 99 : 0,
    });
  }

  if (player.missile && player.missileCooldown <= 0) {
    bullets.spawn({
      position: firePos,
      velocity: new THREE.Vector3(MISSILE_SPEED * 0.85, -4, 0),
      owner: 'player', damage: 2, radius: 0.4, life: 2.2, type: 'missile',
    });
    player.missileCooldown = 0.55;
    audio.shoot('missile');
  }
}

// ---------------------------------------------------------------------------
// Collisions
// ---------------------------------------------------------------------------

function dist2D(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function resolveCollisions() {
  const activeEnemies = enemies.active;
  const activeBullets = bullets.active;

  for (const b of activeBullets) {
    if (!b.alive) continue;
    if (b.owner === 'player') {
      for (const e of activeEnemies) {
        if (!e.alive) continue;
        if (b.type === 'laser' && b.hitSet.has(e)) continue;
        if (dist2D(b.mesh.position, e.mesh.position) < b.radius + e.radius) {
          if (b.type === 'laser') b.hitSet.add(e);
          enemies.applyDamage(e, b.damage);
          particles.burst(b.mesh.position, { color: new THREE.Color(0xffffff), count: 4, speed: 4, size: 0.9, life: 0.2, drag: 3 });
          if (b.type !== 'laser') {
            bullets.kill(b);
            break;
          }
        }
      }
      if (b.alive && bossActive && boss.alive && boss.state === 'fighting' && !(b.type === 'laser' && b.hitSet.has(boss))) {
        if (dist2D(b.mesh.position, boss.mesh.position) < b.radius + boss.radius) {
          if (b.type === 'laser') b.hitSet.add(boss);
          const died = boss.takeDamage(b.damage);
          triggerHitStop(0.02);
          particles.burst(b.mesh.position, { color: new THREE.Color(0xffffff), count: 5, speed: 5, size: 1, life: 0.2, drag: 3 });
          if (died) {
            addScore(boss.scoreValue);
            shake(0.7, 0.6);
            triggerHitStop(0.15);
            audio.explosion(2);
          }
          if (b.type !== 'laser') bullets.kill(b);
        }
      }
    } else if (b.owner === 'enemy') {
      if (player.alive && dist2D(b.mesh.position, player.position) < b.radius + player.radius) {
        const result = player.hit(b.damage);
        bullets.kill(b);
        if (!result.died) audio.hit();
        if (result.died) shake(0.5, 0.5);
      }
    }
  }

  // player vs enemies (contact)
  if (player.alive) {
    for (const e of activeEnemies) {
      if (!e.alive) continue;
      if (dist2D(player.position, e.mesh.position) < player.radius + e.radius) {
        enemies.applyDamage(e, 99);
        const result = player.hit(1);
        if (result.died) shake(0.5, 0.5);
      }
    }
    if (bossActive && boss.alive && boss.state === 'fighting') {
      if (dist2D(player.position, boss.mesh.position) < player.radius + boss.radius * 0.75) {
        player.hit(1);
      }
    }
    // terrain
    if (terrain.collides(player.position.x, player.position.y, player.radius * 0.8)) {
      const result = player.hit(1);
      if (!result.died) {
        const top = terrain.topAt(player.position.x) - player.radius - 0.1;
        const bottom = terrain.bottomAt(player.position.x) + player.radius + 0.1;
        player.position.y = THREE.MathUtils.clamp(player.position.y, bottom, top);
      } else {
        shake(0.5, 0.5);
      }
    }
  }

  // player vs powerups
  if (player.alive) {
    for (const p of powerups.active) {
      if (!p.alive) continue;
      if (dist2D(player.position, p.mesh.position) < player.radius + p.radius) {
        if (p.kind === 'life') {
          lives = Math.min(9, lives + 1);
          audio.extraLife();
          popup('EXTRA SHIP');
        } else {
          player.applyCapsule();
        }
        powerups.kill(p);
        particles.burst(p.mesh.position, { color: new THREE.Color(0x4dfcff), count: 14, speed: 6, size: 1.2, life: 0.4, drag: 2 });
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Main loop
// ---------------------------------------------------------------------------

let lastTime = performance.now();

function tick(now) {
  requestAnimationFrame(tick);
  let dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;

  if (hitStop > 0) {
    hitStop -= dt;
    dt *= 0.15;
  }

  const bounds = getBounds();

  if (state === STATE.PLAYING) {
    gameTime += dt;

    if (input.wasPressed('pause')) {
      pauseGame();
    } else {
      updatePlaying(dt, bounds);
    }
  } else if (state === STATE.PAUSED) {
    if (input.wasPressed('pause')) resumeGame();
  }

  // camera shake decay (applies in all states so it settles even if paused)
  if (shakeTime > 0) {
    shakeTime -= dt;
    const m = shakeMag * Math.max(0, shakeTime);
    camRig.position.set((Math.random() - 0.5) * m, (Math.random() - 0.5) * m, 0);
  } else {
    camRig.position.set(0, 0, 0);
  }

  background.update(dt, currentScrollSpeed);
  particles.update(dt);

  composer.render();
}

let currentScrollSpeed = 10;

function updatePlaying(dt, bounds) {
  currentScrollSpeed = 10 + (sector - 1) * 1.15;
  currentScrollSpeed = Math.min(currentScrollSpeed, 22);

  if (player.alive) {
    player.update(dt, input, bounds, gameTime);
    player.tickCooldowns(dt);

    if (input.isDown('fire')) fireWeapons();
    if (input.wasPressed('power')) {
      const activated = player.activatePower();
      if (activated) popup(activated);
    }

    // subtle camera parallax follow
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, player.position.x * 0.06, dt * 2);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, player.position.y * 0.08, dt * 2);
    camera.lookAt(player.position.x * 0.06, player.position.y * 0.08, 0);
  } else if (respawnTimer > 0) {
    respawnTimer -= dt;
    if (respawnTimer <= 0) {
      if (lives <= 0) {
        endGame();
        return;
      }
      player.respawn(bounds);
    }
  }

  terrain.update(dt, currentScrollSpeed);

  bullets.update(dt, bounds, () => {});
  powerups.update(dt, bounds);

  const enemyCtx = { player, bounds, terrain, scrollSpeed: currentScrollSpeed, gameTime };
  enemies.update(dt, enemyCtx);

  if (!bossActive) {
    waveDirector.update(dt);
    if (waveDirector.bossReady) {
      bossActive = true;
      const scaling = sectorScaling(sector);
      boss.spawn(sector - 1, bounds, scaling.bossHpMul);
      terrain.setDifficulty(0, 64); // clear the tunnel walls out of frame for the boss arena
      audio.bossAlarm();
      showBanner(`WARNING`);
    }
  } else if (boss.alive) {
    boss.update(dt, { bounds, player, scaling: sectorScaling(sector) });
  } else {
    // boss just died
    bossActive = false;
    sector += 1;
    waveDirector.startSector(sector);
    applyScaling(waveDirector.scaling);
    showBanner(`SECTOR ${sector}`);
  }

  resolveCollisions();
  updateHud();
}

// kick off
setState(STATE.START);
requestAnimationFrame(tick);
