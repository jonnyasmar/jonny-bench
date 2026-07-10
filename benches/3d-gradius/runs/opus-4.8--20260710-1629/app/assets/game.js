// NEON VANGUARD — a 3D arcade shooter built with Three.js
// Original neon-vector styling. Single-file game engine.

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

/* ============================================================
 * 0. Small utilities
 * ========================================================== */
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (a, b) => a + Math.random() * (b - a);
const randi = (a, b) => Math.floor(rand(a, b + 1));
const pick = (arr) => arr[(Math.random() * arr.length) | 0];
const TAU = Math.PI * 2;

const COL = {
  cyan: 0x38f7ff, magenta: 0xff3ea5, amber: 0xffc234,
  violet: 0xb07bff, green: 0x5dffb0, red: 0xff5a5a,
  white: 0xffffff, blue: 0x4d7bff,
};

/* ============================================================
 * 1. Audio — synthesized SFX + a light music bed (WebAudio)
 * ========================================================== */
const Audio = (() => {
  let ctx = null, master = null, musicGain = null, sfxGain = null;
  let noiseBuf = null;
  let enabled = true;
  let musicTimer = null, step = 0, tempo = 132;

  function init() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { enabled = false; return; }
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
    musicGain = ctx.createGain(); musicGain.gain.value = 0.34; musicGain.connect(master);
    sfxGain = ctx.createGain(); sfxGain.gain.value = 0.75; sfxGain.connect(master);
    // noise buffer for explosions
    const len = ctx.sampleRate * 1.0;
    noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }
  function resume() { if (ctx && ctx.state === 'suspended') ctx.resume(); }
  function now() { return ctx ? ctx.currentTime : 0; }

  function tone(freq, t0, dur, type, peak, dest) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(dest || sfxGain);
    o.start(t0); o.stop(t0 + dur + 0.02);
    return o;
  }
  function noise(t0, dur, peak, filtFreq, filtType) {
    const src = ctx.createBufferSource(); src.buffer = noiseBuf;
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter(); f.type = filtType || 'lowpass'; f.frequency.value = filtFreq || 900;
    g.gain.setValueAtTime(peak, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f); f.connect(g); g.connect(sfxGain);
    src.start(t0); src.stop(t0 + dur + 0.02);
    return { f };
  }

  const S = {
    shoot() {
      if (!ctx || !enabled) return; const t = now();
      const o = tone(880, t, 0.11, 'square', 0.16);
      o.frequency.exponentialRampToValueAtTime(340, t + 0.1);
    },
    laser() {
      if (!ctx || !enabled) return; const t = now();
      const o = tone(1200, t, 0.16, 'sawtooth', 0.14);
      o.frequency.exponentialRampToValueAtTime(500, t + 0.15);
    },
    missile() {
      if (!ctx || !enabled) return; const t = now();
      const o = tone(300, t, 0.2, 'triangle', 0.14);
      o.frequency.exponentialRampToValueAtTime(700, t + 0.18);
    },
    hit() {
      if (!ctx || !enabled) return; const t = now();
      noise(t, 0.08, 0.18, 2600, 'bandpass');
    },
    explode(big) {
      if (!ctx || !enabled) return; const t = now();
      const n = noise(t, big ? 0.6 : 0.28, big ? 0.5 : 0.32, big ? 1400 : 1800, 'lowpass');
      n.f.frequency.setValueAtTime(big ? 1400 : 1800, t);
      n.f.frequency.exponentialRampToValueAtTime(120, t + (big ? 0.55 : 0.26));
      const o = tone(big ? 90 : 160, t, big ? 0.5 : 0.25, 'sine', big ? 0.4 : 0.24);
      o.frequency.exponentialRampToValueAtTime(40, t + 0.3);
    },
    power() {
      if (!ctx || !enabled) return; const t = now();
      tone(660, t, 0.12, 'square', 0.16);
      tone(990, t + 0.06, 0.14, 'square', 0.15);
    },
    arm() {
      if (!ctx || !enabled) return; const t = now();
      tone(523, t, 0.1, 'square', 0.16);
      tone(784, t + 0.05, 0.1, 'square', 0.16);
      tone(1046, t + 0.1, 0.16, 'square', 0.17);
    },
    playerHit() {
      if (!ctx || !enabled) return; const t = now();
      const o = tone(220, t, 0.5, 'sawtooth', 0.3);
      o.frequency.exponentialRampToValueAtTime(50, t + 0.45);
      noise(t, 0.5, 0.4, 900, 'lowpass');
    },
    shield() {
      if (!ctx || !enabled) return; const t = now();
      tone(400, t, 0.14, 'sine', 0.2);
      tone(600, t + 0.02, 0.14, 'sine', 0.14);
    },
    boss() {
      if (!ctx || !enabled) return; const t = now();
      const o = tone(120, t, 1.2, 'sawtooth', 0.28);
      o.frequency.exponentialRampToValueAtTime(300, t + 1.1);
    },
    warp() {
      if (!ctx || !enabled) return; const t = now();
      const o = tone(200, t, 0.6, 'sine', 0.25);
      o.frequency.exponentialRampToValueAtTime(1600, t + 0.55);
    },
  };

  // --- light music: minor pentatonic bass + arp ---
  const SCALE = [0, 3, 5, 7, 10]; // minor pentatonic
  const ROOT = 55; // A1
  function noteFreq(semi) { return ROOT * Math.pow(2, semi / 12); }
  function schedule() {
    if (!ctx || !enabled) return;
    const t = now() + 0.02;
    const beat = 60 / tempo / 2; // eighth notes
    const s = step % 16;
    // bass on downbeats
    if (s % 4 === 0) {
      const deg = SCALE[(Math.floor(step / 4)) % SCALE.length];
      const o = tone(noteFreq(deg), t, beat * 3.4, 'triangle', 0.5, musicGain);
      o.frequency.setValueAtTime(noteFreq(deg), t);
    }
    // arp sparkle
    if (s % 2 === 0 && (step % 32 < 24)) {
      const deg = SCALE[(step * 3) % SCALE.length] + 24;
      tone(noteFreq(deg), t, beat * 0.9, 'square', 0.09, musicGain);
    }
    // hat
    noise(t, 0.03, s % 2 === 0 ? 0.05 : 0.025, 8000, 'highpass');
    step++;
    musicTimer = setTimeout(schedule, beat * 1000);
  }
  return {
    init, resume,
    sfx(name, arg) { if (S[name]) S[name](arg); },
    startMusic(t) { if (!ctx || !enabled) return; tempo = t || 132; if (!musicTimer) { step = 0; schedule(); } },
    stopMusic() { if (musicTimer) { clearTimeout(musicTimer); musicTimer = null; } },
    setTempo(t) { tempo = t; },
    toggle() { enabled = !enabled; if (master) master.gain.value = enabled ? 0.9 : 0; return enabled; },
    get ready() { return !!ctx; },
  };
})();

/* ============================================================
 * 2. Renderer / scene / camera / post-processing
 * ========================================================== */
const app = document.getElementById('app');
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x05060f, 0.0075);

const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 400);
const CAM_BASE = new THREE.Vector3(0, -2.5, 46);
camera.position.copy(CAM_BASE);
camera.lookAt(0, 1.5, 0);

// lights
scene.add(new THREE.AmbientLight(0x334466, 0.9));
const keyLight = new THREE.DirectionalLight(0x9fd0ff, 0.9); keyLight.position.set(-6, 8, 20); scene.add(keyLight);
const rimLight = new THREE.DirectionalLight(0xff5aa0, 0.5); rimLight.position.set(10, -6, 8); scene.add(rimLight);
const playerLight = new THREE.PointLight(0x38f7ff, 1.4, 40, 2); scene.add(playerLight);

// post-processing bloom
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.9, 0.72, 0.18);
composer.addPass(bloom);

// playfield bounds (computed on resize)
const bounds = { minX: -30, maxX: 30, minY: -16, maxY: 16 };
function computeBounds() {
  const dist = 46;
  const halfH = Math.tan((camera.fov * Math.PI / 180) / 2) * dist;
  const halfW = halfH * camera.aspect;
  bounds.minX = -halfW + 3; bounds.maxX = halfW - 3;
  bounds.minY = -halfH + 2.5; bounds.maxY = halfH - 2.5;
}
computeBounds();

function onResize() {
  const w = window.innerWidth, h = window.innerHeight;
  camera.aspect = w / h; camera.updateProjectionMatrix();
  renderer.setSize(w, h); composer.setSize(w, h);
  bloom.resolution.set(w, h);
  computeBounds();
}
window.addEventListener('resize', onResize);

/* ============================================================
 * 3. Background — starfields, nebula band, speed lines, grid
 * ========================================================== */
const Background = (() => {
  const group = new THREE.Group(); scene.add(group);
  const layers = [];
  const SPAN_X = 160, SPAN_Y = 90;

  function makeStars(count, size, colorA, colorB, z, speed) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const cA = new THREE.Color(colorA), cB = new THREE.Color(colorB), c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      pos[i * 3] = rand(-SPAN_X / 2, SPAN_X / 2);
      pos[i * 3 + 1] = rand(-SPAN_Y / 2, SPAN_Y / 2);
      pos[i * 3 + 2] = z + rand(-4, 4);
      c.copy(cA).lerp(cB, Math.random());
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({ size, vertexColors: true, transparent: true,
      opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
    const pts = new THREE.Points(geo, mat);
    group.add(pts);
    layers.push({ pts, pos, count, speed });
  }

  makeStars(320, 0.35, 0x5566aa, 0x8899cc, -40, 6);
  makeStars(220, 0.6, 0x88aaff, 0xffffff, -22, 12);
  makeStars(120, 1.0, 0x9fe8ff, 0xffd0f0, -8, 22);

  // nebula band (soft additive sprites)
  const neb = new THREE.Group(); group.add(neb);
  const nebMat = () => new THREE.SpriteMaterial({
    map: softTexture(), transparent: true, opacity: 0.12,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const nebs = [];
  for (let i = 0; i < 7; i++) {
    const s = new THREE.Sprite(nebMat());
    s.material.color.set(pick([0x2a3a8a, 0x6a2a7a, 0x1a5a7a, 0x7a2a5a]));
    s.position.set(rand(-70, 70), rand(-30, 30), rand(-46, -30));
    const sc = rand(40, 80); s.scale.set(sc, sc, 1);
    neb.add(s); nebs.push(s);
  }

  // grid floor + ceiling for speed sensation
  function makeGrid(y, color) {
    const g = new THREE.Group();
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.16 });
    const geo = new THREE.BufferGeometry();
    const pts = [];
    const depth = 220, wide = 120, stepZ = 6, stepX = 8;
    for (let z = 0; z >= -depth; z -= stepZ) { pts.push(-wide, y, z, wide, y, z); }
    for (let x = -wide; x <= wide; x += stepX) { pts.push(x, y, 0, x, y, -depth); }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const lines = new THREE.LineSegments(geo, mat);
    g.add(lines); scene.add(g);
    return { g, mat, offset: 0, stepZ };
  }
  const gridFloor = makeGrid(-19, 0x2a4a8a);
  const gridCeil = makeGrid(19, 0x5a2a6a);

  let hue = 0;
  function update(dt, speedMul) {
    for (const L of layers) {
      const dx = L.speed * speedMul * dt;
      for (let i = 0; i < L.count; i++) {
        L.pos[i * 3] -= dx;
        if (L.pos[i * 3] < -SPAN_X / 2) L.pos[i * 3] += SPAN_X;
      }
      L.pts.geometry.attributes.position.needsUpdate = true;
    }
    for (const s of nebs) {
      s.position.x -= 2.2 * speedMul * dt;
      if (s.position.x < -80) s.position.x += 150;
    }
    // scroll grids (move along z toward camera by offsetting)
    for (const G of [gridFloor, gridCeil]) {
      G.offset = (G.offset + 30 * speedMul * dt) % G.stepZ;
      G.g.position.z = G.offset;
    }
    hue = (hue + dt * 0.02) % 1;
  }
  function setSectorTint(color) {
    gridFloor.mat.color.setHex(color);
    for (let i = 0; i < nebs.length; i++) if (i % 2) nebs[i].material.color.setHex(color);
  }
  return { update, setSectorTint };
})();

// soft radial texture for sprites / glows
// NOTE: var (not let) so the hoisted binding is usable by the Background IIFE above.
var _softTex = null;
function softTexture() {
  if (_softTex) return _softTex;
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.3, 'rgba(255,255,255,0.55)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad; g.fillRect(0, 0, 128, 128);
  _softTex = new THREE.CanvasTexture(c);
  return _softTex;
}
// ring texture for shockwaves
var _ringTex = null;
function ringTexture() {
  if (_ringTex) return _ringTex;
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  g.strokeStyle = 'rgba(255,255,255,1)'; g.lineWidth = 10;
  g.beginPath(); g.arc(64, 64, 48, 0, TAU); g.stroke();
  _ringTex = new THREE.CanvasTexture(c);
  return _ringTex;
}

/* ============================================================
 * 4. Shared materials & mesh factory (neon vector look)
 * ========================================================== */
function neonMat(color, emissiveI = 1.4, opacity = 1) {
  return new THREE.MeshStandardMaterial({
    color, emissive: color, emissiveIntensity: emissiveI,
    metalness: 0.3, roughness: 0.35, transparent: opacity < 1, opacity,
  });
}
function glowSprite(color, size, opacity = 0.9) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({
    map: softTexture(), color, transparent: true, opacity,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  s.scale.set(size, size, 1);
  return s;
}

/* ============================================================
 * 5. Particle & effects system (pooled)
 * ========================================================== */
const FX = (() => {
  const group = new THREE.Group(); scene.add(group);

  // point-based debris pool
  const MAX = 900;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(MAX * 3);
  const col = new Float32Array(MAX * 3);       // live (faded) color written each frame
  const base = new Float32Array(MAX * 3);      // base color at spawn
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({ size: 0.7, vertexColors: true, transparent: true,
    opacity: 1, depthWrite: false, blending: THREE.AdditiveBlending });
  const points = new THREE.Points(geo, mat); points.frustumCulled = false; group.add(points);
  const parts = [];
  for (let i = 0; i < MAX; i++) parts.push({ life: 0, max: 1, vx: 0, vy: 0, vz: 0, active: false });
  let head = 0;

  function spawnParticle(x, y, z, vx, vy, vz, life, color) {
    const p = parts[head], h = head;
    p.active = true; p.life = life; p.max = life;
    p.vx = vx; p.vy = vy; p.vz = vz;
    pos[h * 3] = x; pos[h * 3 + 1] = y; pos[h * 3 + 2] = z;
    base[h * 3] = color.r; base[h * 3 + 1] = color.g; base[h * 3 + 2] = color.b;
    col[h * 3] = color.r; col[h * 3 + 1] = color.g; col[h * 3 + 2] = color.b;
    head = (head + 1) % MAX;
  }

  const _c = new THREE.Color();
  function burst(x, y, z, hexColor, n, power) {
    _c.setHex(hexColor);
    for (let i = 0; i < n; i++) {
      const a = rand(0, TAU), b = rand(-0.6, 0.6);
      const sp = rand(6, 20) * power;
      spawnParticle(x, y, z,
        Math.cos(a) * sp, Math.sin(a) * sp, Math.sin(b) * sp * 0.6,
        rand(0.4, 0.9), _c);
    }
  }
  function spark(x, y, z, hexColor, n) {
    _c.setHex(hexColor);
    for (let i = 0; i < n; i++) {
      const a = rand(0, TAU);
      const sp = rand(3, 9);
      spawnParticle(x, y, z, Math.cos(a) * sp, Math.sin(a) * sp, rand(-2, 2), rand(0.2, 0.4), _c);
    }
  }

  // shockwave rings (pooled sprites)
  const rings = [];
  for (let i = 0; i < 24; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ringTexture(), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    s.visible = false; group.add(s); rings.push({ s, life: 0, max: 1, from: 1, to: 6 });
  }
  function ring(x, y, z, color, to, dur) {
    const r = rings.find((r) => r.life <= 0); if (!r) return;
    r.s.visible = true; r.s.material.color.setHex(color);
    r.s.position.set(x, y, z); r.from = 1; r.to = to || 8; r.life = dur || 0.5; r.max = r.life;
  }

  // flash sprites (big soft glow)
  const flashes = [];
  for (let i = 0; i < 16; i++) {
    const s = glowSprite(0xffffff, 6, 0); s.visible = false; group.add(s);
    flashes.push({ s, life: 0, max: 1, size: 6 });
  }
  function flash(x, y, z, color, size, dur) {
    const f = flashes.find((f) => f.life <= 0); if (!f) return;
    f.s.visible = true; f.s.material.color.setHex(color);
    f.s.position.set(x, y, z); f.size = size || 6; f.life = dur || 0.28; f.max = f.life;
  }

  function update(dt) {
    // particles
    for (let i = 0; i < MAX; i++) {
      const p = parts[i];
      if (!p.active) { continue; }
      p.life -= dt;
      if (p.life <= 0) {
        p.active = false; col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = 0; continue;
      }
      pos[i * 3] += p.vx * dt; pos[i * 3 + 1] += p.vy * dt; pos[i * 3 + 2] += p.vz * dt;
      const damp = 1 - 1.6 * dt;
      p.vx *= damp; p.vy *= damp; p.vz *= damp;
      const k = p.life / p.max;                 // 1 → 0 fade
      col[i * 3] = base[i * 3] * k;
      col[i * 3 + 1] = base[i * 3 + 1] * k;
      col[i * 3 + 2] = base[i * 3 + 2] * k;
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;

    for (const r of rings) {
      if (r.life <= 0) continue;
      r.life -= dt; const k = clamp(r.life / r.max, 0, 1);
      const sc = lerp(r.to, r.from, k);
      r.s.scale.set(sc, sc, 1);
      r.s.material.opacity = k * 0.8;
      if (r.life <= 0) r.s.visible = false;
    }
    for (const f of flashes) {
      if (f.life <= 0) continue;
      f.life -= dt; const k = clamp(f.life / f.max, 0, 1);
      f.s.scale.setScalar(lerp(f.size * 1.4, f.size * 0.3, 1 - k));
      f.s.material.opacity = k;
      if (f.life <= 0) f.s.visible = false;
    }
  }
  return { burst, spark, ring, flash, update };
})();

/* ============================================================
 * 6. Global game state
 * ========================================================== */
const G = {
  state: 'loading',      // loading | title | playing | paused | dead | over | win | between
  score: 0, best: Number(localStorage.getItem('nv_best') || 0),
  sector: 1, maxSector: 5,
  lives: 3,
  combo: 0, comboTimer: 0, comboMul: 1,
  time: 0, timeScale: 1,
  shake: 0, shakeMag: 0,
  hitStop: 0,
};

// pooled arrays
const playerBullets = [];
const enemyBullets = [];
const enemies = [];
const capsules = [];
const missiles = [];

/* ============================================================
 * 7. Projectile pools
 * ========================================================== */
const bulletGeo = new THREE.BoxGeometry(1.5, 0.32, 0.32);
const laserGeo = new THREE.BoxGeometry(7, 0.34, 0.34);
const eBulletGeo = new THREE.SphereGeometry(0.42, 10, 10);
const missileGeo = new THREE.ConeGeometry(0.28, 1.1, 6);

// player bullet pool
const pbPool = { free: [] };
function getPB(kind) {
  let o = pbPool.free.pop();
  if (!o) {
    const mesh = new THREE.Mesh(kind === 'laser' ? laserGeo : bulletGeo, neonMat(COL.cyan, 2.6));
    o = { mesh, kind };
    o.glow = glowSprite(COL.cyan, 2.2, 0.6); mesh.add(o.glow);
    scene.add(mesh);
  }
  o.mesh.geometry = kind === 'laser' ? laserGeo : bulletGeo;
  o.mesh.visible = true; o.kind = kind;
  return o;
}
function freePB(o) { o.mesh.visible = false; pbPool.free.push(o); }

const ebPool = { free: [] };
function getEB() {
  let o = ebPool.free.pop();
  if (!o) {
    const mesh = new THREE.Mesh(eBulletGeo, neonMat(COL.magenta, 2.2));
    o = { mesh };
    o.glow = glowSprite(COL.magenta, 1.8, 0.7); mesh.add(o.glow);
    scene.add(mesh);
  }
  o.mesh.visible = true; return o;
}
function freeEB(o) { o.mesh.visible = false; ebPool.free.push(o); }

/* ============================================================
 * 8. Player ship + weapons + options
 * ========================================================== */
function buildShip(scale, accent) {
  const g = new THREE.Group();
  // fuselage — stretched octahedron nose
  const body = new THREE.Mesh(new THREE.OctahedronGeometry(1.0, 0), neonMat(0xeafcff, 0.6));
  body.scale.set(2.4, 0.7, 0.7); g.add(body);
  // cockpit
  const cock = new THREE.Mesh(new THREE.SphereGeometry(0.42, 12, 12), neonMat(accent, 1.8));
  cock.position.set(0.35, 0.18, 0); g.add(cock);
  // wings
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0); wingShape.lineTo(-2.2, 1.6); wingShape.lineTo(-2.2, 0.2); wingShape.lineTo(-0.2, -0.2);
  const wingGeo = new THREE.ExtrudeGeometry(wingShape, { depth: 0.14, bevelEnabled: false });
  const wMat = neonMat(COL.cyan, 1.0);
  const wTop = new THREE.Mesh(wingGeo, wMat); wTop.position.set(0.3, 0.1, -0.07); g.add(wTop);
  const wBot = new THREE.Mesh(wingGeo, wMat); wBot.position.set(0.3, -0.1, -0.07); wBot.scale.y = -1; g.add(wBot);
  // tail fin
  const fin = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.2, 4), neonMat(accent, 1.2));
  fin.position.set(-1.4, 0.5, 0); fin.rotation.z = -0.5; g.add(fin);
  // engine glow
  const eng = glowSprite(COL.amber, 2.4, 0.9); eng.position.set(-1.9, 0, 0); g.add(eng);
  g.userData.engine = eng;
  g.scale.setScalar(scale || 1);
  g.rotation.y = Math.PI * 0.02;
  return g;
}

const player = {
  mesh: buildShip(1, COL.magenta),
  x: 0, y: 0, z: 0, r: 0.85,
  speedLevel: 1, base: 22,
  double: false, laser: false, missiles: false,
  optionCount: 0, options: [],
  force: 0, forceMesh: null,
  fireT: 0, missileT: 0,
  capsules: 0,               // banked capsules → power meter position
  invuln: 0, alive: true,
  vy: 0, vx: 0, bank: 0,
  trail: [],                 // ring buffer of {x,y}
};
scene.add(player.mesh);

// force-field bubble
player.forceMesh = new THREE.Mesh(
  new THREE.SphereGeometry(2.1, 20, 16),
  new THREE.MeshStandardMaterial({ color: COL.cyan, emissive: COL.cyan, emissiveIntensity: 0.8,
    transparent: true, opacity: 0.18, metalness: 0.2, roughness: 0.4, side: THREE.DoubleSide }));
player.forceMesh.visible = false; player.mesh.add(player.forceMesh);

// options
function addOption() {
  if (player.optionCount >= 4) return false;
  const m = new THREE.Mesh(new THREE.OctahedronGeometry(0.6, 0), neonMat(COL.cyan, 2.2));
  const glow = glowSprite(COL.cyan, 1.8, 0.7); m.add(glow);
  scene.add(m);
  player.options.push({ mesh: m, delay: (player.optionCount + 1) * 9 });
  player.optionCount++;
  return true;
}
function clearOptions() {
  for (const o of player.options) scene.remove(o.mesh);
  player.options.length = 0; player.optionCount = 0;
}

const SPEED_LEVELS = [16, 22, 27, 32, 37];
function playerSpeed() { return SPEED_LEVELS[clamp(player.speedLevel, 0, 4)]; }

// power meter slots
const POWER_SLOTS = [
  { key: 'SPEED', name: 'Speed' },
  { key: 'MISSILE', name: 'Missile' },
  { key: 'DOUBLE', name: 'Double' },
  { key: 'LASER', name: 'Laser' },
  { key: 'OPTION', name: 'Option' },
  { key: 'FORCE', name: 'Force' },
];

function armPower() {
  if (player.capsules <= 0) return;
  const idx = Math.min(player.capsules, 6) - 1;
  const slot = POWER_SLOTS[idx];
  let ok = true;
  switch (slot.key) {
    case 'SPEED':
      if (player.speedLevel < 4) player.speedLevel++; else ok = false; break;
    case 'MISSILE': player.missiles = true; break;
    case 'DOUBLE': player.double = true; player.laser = false; break;
    case 'LASER': player.laser = true; player.double = false; break;
    case 'OPTION': ok = addOption(); break;
    case 'FORCE':
      player.force = 3; player.forceMesh.visible = true; break;
  }
  if (ok) {
    player.capsules = 0;
    Audio.sfx('arm');
    FX.flash(player.x, player.y, 0, COL.amber, 5, 0.3);
    FX.ring(player.x, player.y, 0, COL.amber, 7, 0.5);
    updatePowerHUD();
  }
}

// firing
function firePrimary() {
  const interval = player.laser ? 0.2 : 0.13;
  if (player.fireT > 0) return;
  player.fireT = interval;

  const origins = [{ x: player.x + 1.6, y: player.y }];
  for (const o of player.options) origins.push({ x: o.mesh.position.x + 1.4, y: o.mesh.position.y });

  for (const o of origins) {
    if (player.laser) {
      spawnPB(o.x + 3, o.y, 70, 0, 'laser', 2, true);
    } else {
      spawnPB(o.x, o.y, 60, 0, 'bullet', 1, false);
      if (player.double) spawnPB(o.x, o.y, 46, 30, 'bullet', 1, false);
    }
  }
  // muzzle flash on the ship
  FX.flash(player.x + 1.8, player.y, 0.5, COL.cyan, 1.6, 0.1);
  Audio.sfx(player.laser ? 'laser' : 'shoot');

  // missiles gated separately
  if (player.missiles && player.missileT <= 0) {
    player.missileT = 0.42;
    spawnMissile(player.x + 0.5, player.y - 0.3);
    for (const o of player.options) if (Math.random() < 0.6) spawnMissile(o.mesh.position.x, o.mesh.position.y - 0.3);
    Audio.sfx('missile');
  }
}

function spawnPB(x, y, speed, angDeg, kind, dmg, pierce) {
  const o = getPB(kind);
  const a = angDeg * Math.PI / 180;
  o.mesh.position.set(x, y, 0);
  o.mesh.rotation.z = a;
  o.vx = Math.cos(a) * speed; o.vy = Math.sin(a) * speed;
  o.r = kind === 'laser' ? 3.5 : 0.9;
  o.dmg = dmg; o.pierce = pierce; o.alive = true; o.life = kind === 'laser' ? 0.9 : 2.2;
  o.hitSet = pierce ? new Set() : null;
  playerBullets.push(o);
}

function spawnMissile(x, y) {
  const mesh = new THREE.Mesh(missileGeo, neonMat(COL.amber, 2.2));
  mesh.rotation.z = -Math.PI / 2;
  const glow = glowSprite(COL.amber, 1.4, 0.7); mesh.add(glow);
  mesh.position.set(x, y, 0); scene.add(mesh);
  missiles.push({ mesh, x, y, vx: 20, vy: -14, r: 0.7, life: 2.4, target: null, dmg: 2 });
}

// player damage
function playerHit(cause) {
  if (player.invuln > 0 || !player.alive) return;
  if (player.force > 0) {
    player.force--;
    Audio.sfx('shield');
    FX.ring(player.x, player.y, 0, COL.cyan, 6, 0.4);
    FX.flash(player.x, player.y, 0, COL.cyan, 3, 0.2);
    if (player.force <= 0) player.forceMesh.visible = false;
    player.invuln = 0.6; // brief mercy after a shield pop
    shake(0.3, 0.5);
    return;
  }
  // destroyed
  player.alive = false;
  G.lives--;
  Audio.sfx('playerHit');
  bigExplosion(player.x, player.y, COL.cyan, 1.3);
  shake(0.9, 1.4);
  G.hitStop = 0.12;
  player.mesh.visible = false;
  // lose power-ups (classic)
  player.double = false; player.laser = false; player.missiles = false;
  player.force = 0; player.forceMesh.visible = false;
  player.speedLevel = Math.min(player.speedLevel, 2);
  clearOptions();
  resetCombo();
  updatePowerHUD();
  updateLivesHUD();
  if (G.lives <= 0) {
    setTimeout(() => endGame(false), 900);
  } else {
    setTimeout(respawn, 1100);
  }
}
function respawn() {
  if (G.state !== 'playing') return;
  player.x = bounds.minX + 8; player.y = 0;
  player.mesh.position.set(player.x, player.y, 0);
  player.mesh.visible = true; player.alive = true;
  player.invuln = 2.4;
  Audio.sfx('warp');
  FX.ring(player.x, player.y, 0, COL.cyan, 8, 0.6);
}

/* ============================================================
 * 9. Capsules (power-up pickups)
 * ========================================================== */
function spawnCapsule(x, y) {
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 0), neonMat(COL.amber, 2.4));
  const glow = glowSprite(COL.amber, 3.0, 0.8); core.add(glow);
  scene.add(core);
  capsules.push({ mesh: core, x, y, vx: -6, vy: 0, r: 1.2, life: 12, spin: rand(2, 5) });
}
function collectCapsule(c) {
  player.capsules = Math.min(player.capsules + 1, 6);
  G.score += 60;
  Audio.sfx('power');
  FX.flash(c.x, c.y, 0, COL.amber, 2.5, 0.25);
  updatePowerHUD();
}


/* ============================================================
 * 10. Shared effect helpers
 * ========================================================== */
function shake(mag, dur) { G.shakeMag = Math.max(G.shakeMag, mag); G.shake = Math.max(G.shake, dur); }
function bigExplosion(x, y, color, power) {
  FX.burst(x, y, 0, color, Math.floor(26 * power), power);
  FX.burst(x, y, 0, COL.white, Math.floor(10 * power), power * 0.7);
  FX.ring(x, y, 0, color, 6 * power, 0.5);
  FX.flash(x, y, 0, COL.white, 4 * power, 0.28);
  Audio.sfx('explode', power > 1.1);
}
function addScore(n) {
  G.score += Math.floor(n * G.comboMul);
}
function bumpCombo() {
  G.combo++; G.comboTimer = 2.4;
  G.comboMul = 1 + Math.min(G.combo, 30) * 0.1;
}
function resetCombo() { G.combo = 0; G.comboMul = 1; G.comboTimer = 0; }

/* ============================================================
 * 11. Enemies
 * ========================================================== */
function baseEnemy(mesh, x, y, hp, r, score) {
  const e = { mesh, x, y, z: 0, hp, maxHp: hp, r, score,
    vx: -8, vy: 0, t: rand(0, 10), alive: true, fireT: rand(0.5, 2),
    carrier: false, squad: null, behavior: null, shoots: false, flash: 0, type: 'enemy',
    _baseEmis: mesh.material ? mesh.material.emissiveIntensity : 1.6 };
  mesh.position.set(x, y, 0); scene.add(mesh); enemies.push(e);
  return e;
}

const ENEMY = {
  drifter(x, y) {
    const m = new THREE.Mesh(new THREE.OctahedronGeometry(1.0, 0), neonMat(COL.red, 1.6));
    m.scale.set(1.3, 1, 1);
    const e = baseEnemy(m, x, y, 2, 1.1, 100);
    e.vx = -13;
    e.behavior = (e, dt) => { e.mesh.rotation.x += dt * 2; e.mesh.rotation.z += dt * 1.2; };
    return e;
  },
  waver(x, y) {
    const m = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.28, 8, 16), neonMat(COL.violet, 1.8));
    const e = baseEnemy(m, x, y, 2, 1.0, 130);
    e.vx = -10; e.baseY = y; e.amp = rand(3, 6); e.freq = rand(1.4, 2.2);
    e.behavior = (e, dt) => {
      e.y = e.baseY + Math.sin(e.t * e.freq) * e.amp;
      e.mesh.rotation.z += dt * 3; e.mesh.rotation.x = Math.PI / 2;
    };
    return e;
  },
  diver(x, y) {
    const m = new THREE.Mesh(new THREE.ConeGeometry(0.7, 2.0, 5), neonMat(COL.amber, 1.8));
    m.rotation.z = Math.PI / 2;
    const e = baseEnemy(m, x, y, 2, 1.0, 150);
    e.vx = -16; e.state = 0; e.locked = false;
    e.behavior = (e, dt) => {
      if (!e.locked && e.x < bounds.maxX - 6) { e.locked = true; e.targetY = player.y; }
      if (e.locked) e.vy = clamp((e.targetY - e.y) * 3, -18, 18);
      e.vy *= 0.96;
      e.mesh.rotation.x += dt * 6;
    };
    return e;
  },
  turret(x, y) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), neonMat(COL.green, 1.5));
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.2, 8), neonMat(COL.green, 1.8));
    barrel.rotation.z = Math.PI / 2; barrel.position.x = -0.8; m.add(barrel);
    const e = baseEnemy(m, x, y, 4, 1.2, 220);
    e.vx = -6; e.shoots = true; e.fireInt = rand(1.4, 2.2);
    e.behavior = (e, dt) => { e.mesh.rotation.y += dt * 1.5; };
    return e;
  },
  mine(x, y) {
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.9, 0), neonMat(COL.magenta, 1.7));
    const spikes = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2, 0), new THREE.MeshBasicMaterial({ color: COL.magenta, wireframe: true, transparent: true, opacity: 0.6 }));
    m.add(spikes);
    const e = baseEnemy(m, x, y, 1, 1.1, 90);
    e.vx = rand(-7, -4); e.vy = rand(-2, 2);
    e.behavior = (e, dt) => {
      e.mesh.rotation.x += dt * 1.5; e.mesh.rotation.y += dt * 1.1;
      if (e.y < bounds.minY + 1 || e.y > bounds.maxY - 1) e.vy *= -1;
    };
    return e;
  },
  seeker(x, y) {
    const m = new THREE.Mesh(new THREE.TetrahedronGeometry(1.1, 0), neonMat(COL.blue, 1.8));
    const e = baseEnemy(m, x, y, 3, 1.1, 200);
    e.vx = -9; e.shoots = true; e.fireInt = rand(2, 3);
    e.behavior = (e, dt) => {
      e.vy = clamp((player.y - e.y) * 1.6, -8, 8);
      e.mesh.rotation.x += dt * 4; e.mesh.rotation.y += dt * 3;
    };
    return e;
  },
};

function enemyShoot(e, spread) {
  const dx = player.x - e.x, dy = player.y - e.y;
  const d = Math.hypot(dx, dy) || 1;
  const speed = 22;
  const shots = spread || 1;
  for (let i = 0; i < shots; i++) {
    const ang = Math.atan2(dy, dx) + (i - (shots - 1) / 2) * 0.22;
    const b = getEB();
    b.mesh.position.set(e.x - 1, e.y, 0);
    b.x = e.x - 1; b.y = e.y; b.vx = Math.cos(ang) * speed; b.vy = Math.sin(ang) * speed;
    b.r = 0.5; b.life = 4;
    enemyBullets.push(b);
  }
  Audio.sfx('hit');
}

function damageEnemy(e, dmg, hx, hy) {
  e.hp -= dmg; e.flash = 0.08;
  FX.spark(hx, hy, 0, COL.white, 4);
  if (e.hp <= 0) killEnemy(e);
  else Audio.sfx('hit');
}
function killEnemy(e) {
  if (!e.alive) return;
  e.alive = false;
  const col = e.mesh.material.emissive ? e.mesh.material.emissive.getHex() : COL.red;
  bigExplosion(e.x, e.y, col, e.boss ? 1.6 : 0.85);
  bumpCombo();
  addScore(e.score);
  // capsule drop
  if (e.carrier) spawnCapsule(e.x, e.y);
  else if (e.squad) {
    e.squad.alive--;
    if (e.squad.alive <= 0 && !e.squad.dropped) { e.squad.dropped = true; spawnCapsule(e.x, e.y); }
  }
  scene.remove(e.mesh);
}

/* ============================================================
 * 12. Boss
 * ========================================================== */
let boss = null;
function spawnBoss(sector) {
  const g = new THREE.Group();
  // core
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(2.0, 1),
    neonMat(COL.magenta, 2.2));
  g.add(core);
  // rotating armor ring
  const ring = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.6, 10, 28), neonMat(COL.violet, 1.4));
  ring.rotation.x = Math.PI / 2; g.add(ring);
  // armor plates
  const plates = [];
  for (let i = 0; i < 6; i++) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(1.4, 3.4, 1.2), neonMat(COL.cyan, 1.2));
    const a = (i / 6) * TAU;
    p.position.set(Math.cos(a) * 3.4, Math.sin(a) * 3.4, 0);
    p.rotation.z = a; g.add(p); plates.push(p);
  }
  // cannons
  const cannons = [];
  for (let i = 0; i < 3; i++) {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 2.4, 8), neonMat(COL.amber, 1.6));
    c.rotation.z = Math.PI / 2; c.position.set(-2.4, (i - 1) * 3.0, 0); g.add(c); cannons.push(c);
  }
  const hp = 120 + sector * 60;
  g.position.set(bounds.maxX + 12, 0, 0);
  scene.add(g);
  boss = {
    mesh: g, core, ring, plates, cannons,
    x: bounds.maxX + 12, y: 0, z: 0, r: 4.6,
    hp, maxHp: hp, alive: true, entering: true,
    t: 0, fireT: 1.5, pattern: 0, patternT: 0, flash: 0, sector,
    boss: true, score: 3000 + sector * 1500,
  };
  Audio.sfx('boss');
  showBanner('WARNING', 'SECTOR GUARDIAN INBOUND', COL.red);
}

function updateBoss(dt) {
  if (!boss) return;
  const b = boss; b.t += dt;
  b.ring.rotation.z += dt * 0.8;
  b.core.rotation.y += dt * 1.2; b.core.rotation.x += dt * 0.6;
  if (b.flash > 0) { b.flash -= dt; b.core.material.emissiveIntensity = 2.2 + Math.sin(b.t * 40) * 1.5; }
  else b.core.material.emissiveIntensity = 2.2;

  const targetX = bounds.maxX - 9;
  if (b.entering) {
    b.x = lerp(b.x, targetX, 1 - Math.pow(0.02, dt));
    if (b.x < targetX + 0.4) b.entering = false;
  } else {
    // hover pattern
    b.y = Math.sin(b.t * 0.7) * (bounds.maxY - 6);
    b.x = targetX + Math.sin(b.t * 0.4) * 2;
    // fire patterns
    b.fireT -= dt;
    if (b.fireT <= 0) {
      const phase = b.hp / b.maxHp;
      b.pattern = (b.pattern + 1) % 3;
      if (b.pattern === 0) {
        // aimed triple from each cannon
        for (const c of b.cannons) bossShoot(b.x - 2, b.y + c.position.y, 3);
        b.fireT = phase < 0.5 ? 1.0 : 1.5;
      } else if (b.pattern === 1) {
        // radial spray
        const n = phase < 0.5 ? 16 : 12;
        for (let i = 0; i < n; i++) bossRadial(b.x - 1, b.y, (i / n) * TAU, 16);
        b.fireT = 1.8;
      } else {
        // fan aimed at player
        for (let i = 0; i < 5; i++) bossShoot(b.x - 2, b.y, 5);
        b.fireT = phase < 0.5 ? 1.3 : 1.8;
      }
    }
  }
  b.mesh.position.set(b.x, b.y, 0);
}
function bossShoot(x, y, spread) {
  const dx = player.x - x, dy = player.y - y;
  const ang0 = Math.atan2(dy, dx);
  for (let i = 0; i < spread; i++) {
    const ang = ang0 + (i - (spread - 1) / 2) * 0.16;
    const bl = getEB(); bl.mesh.position.set(x, y, 0);
    bl.x = x; bl.y = y; bl.vx = Math.cos(ang) * 20; bl.vy = Math.sin(ang) * 20; bl.r = 0.5; bl.life = 5;
    enemyBullets.push(bl);
  }
  Audio.sfx('hit');
}
function bossRadial(x, y, ang, speed) {
  const bl = getEB(); bl.mesh.position.set(x, y, 0);
  bl.x = x; bl.y = y; bl.vx = Math.cos(ang) * speed; bl.vy = Math.sin(ang) * speed; bl.r = 0.5; bl.life = 5;
  enemyBullets.push(bl);
}
function damageBoss(dmg, hx, hy) {
  const b = boss; if (!b || !b.alive || b.entering) return;
  b.hp -= dmg; b.flash = 0.08;
  FX.spark(hx, hy, 0, COL.white, 3);
  updateBossHUD();
  if (b.hp <= 0) killBoss();
}
function killBoss() {
  const b = boss; if (!b.alive) return;
  b.alive = false;
  addScore(b.score);
  // dramatic multi-explosion + hitstop
  G.hitStop = 0.5; shake(1.2, 1.6);
  let n = 0;
  const iv = setInterval(() => {
    bigExplosion(b.x + rand(-4, 4), b.y + rand(-4, 4), pick([COL.magenta, COL.cyan, COL.amber, COL.white]), 1.3);
    if (++n > 10) { clearInterval(iv); scene.remove(b.mesh); boss = null; onSectorClear(); }
  }, 120);
  hideBossHUD();
}


/* ============================================================
 * 13. Director — sector pacing, waves, difficulty curve
 * ========================================================== */
const SECTORS = [
  { name: 'AZURE DRIFT',   sub: 'debris fields',     tint: 0x2a4a8a, tempo: 128, waves: 7 },
  { name: 'CRIMSON BELT',  sub: 'raider patrols',    tint: 0x8a2a4a, tempo: 134, waves: 8 },
  { name: 'VIOLET REACH',  sub: 'ion storm',         tint: 0x5a2a8a, tempo: 140, waves: 9 },
  { name: 'EMBER CORE',    sub: 'foundry defenses',  tint: 0x8a5a2a, tempo: 146, waves: 10 },
  { name: 'NULL HORIZON',  sub: 'the last gate',     tint: 0x2a6a7a, tempo: 152, waves: 11 },
];

const Director = {
  waveIdx: 0, waveTimer: 2, phase: 'waves', // waves | clearing | boss | done
  sectorCfg: null,
  begin(sector) {
    this.sectorCfg = SECTORS[sector - 1];
    this.waveIdx = 0; this.waveTimer = 2.2; this.phase = 'waves';
    Background.setSectorTint(this.sectorCfg.tint);
    Audio.setTempo(this.sectorCfg.tempo);
    showBanner('SECTOR ' + sector, this.sectorCfg.name + ' — ' + this.sectorCfg.sub, COL.magenta);
  },
  update(dt) {
    if (G.state !== 'playing') return;
    const cfg = this.sectorCfg;
    if (this.phase === 'waves') {
      this.waveTimer -= dt;
      if (this.waveTimer <= 0) {
        this.spawnWave(this.waveIdx);
        this.waveIdx++;
        const gap = lerp(3.4, 2.0, G.sector / 5) * rand(0.85, 1.15);
        this.waveTimer = gap;
        if (this.waveIdx >= cfg.waves) this.phase = 'clearing';
      }
    } else if (this.phase === 'clearing') {
      if (enemies.length === 0) {
        this.phase = 'boss';
        // small breather then boss
        this.waveTimer = 1.6;
      }
    } else if (this.phase === 'boss') {
      this.waveTimer -= dt;
      if (this.waveTimer <= 0 && !boss) { spawnBoss(G.sector); this.phase = 'bossfight'; showBossHUD(); }
    }
  },
  spawnWave(i) {
    const s = G.sector;
    const kinds = ['line', 'sine', 'dive', 'turret', 'mine', 'seeker', 'mixed'];
    // weight distribution shifts with sector
    let type;
    if (i === 0) type = 'line';
    else if (s === 1) type = pick(['line', 'sine', 'dive', 'mine']);
    else if (s === 2) type = pick(['line', 'sine', 'dive', 'turret', 'mine']);
    else if (s === 3) type = pick(['sine', 'dive', 'turret', 'seeker', 'mixed']);
    else type = pick(kinds);
    const carrierWave = (i % 2 === 1); // every other wave carries a capsule
    this['wave_' + type](carrierWave, s);
  },

  wave_line(carrier, s) {
    const n = 4 + Math.min(s, 3);
    const y = rand(bounds.minY + 3, bounds.maxY - 3);
    const squad = { alive: n, dropped: false };
    for (let i = 0; i < n; i++) {
      setTimeout(() => {
        if (G.state !== 'playing') return;
        const e = ENEMY.drifter(bounds.maxX + 5, y);
        e.squad = squad;
      }, i * 220);
    }
    if (carrier) this.markCarrier(() => ENEMY.drifter(bounds.maxX + 5, y - 2));
  },
  wave_sine(carrier, s) {
    const n = 4 + Math.min(s, 4);
    const squad = { alive: n, dropped: false };
    for (let i = 0; i < n; i++) {
      setTimeout(() => {
        if (G.state !== 'playing') return;
        const e = ENEMY.waver(bounds.maxX + 5, rand(bounds.minY + 3, bounds.maxY - 3));
        e.t = i * 0.4; e.squad = squad;
      }, i * 260);
    }
    if (carrier) this.markCarrier(() => ENEMY.waver(bounds.maxX + 5, 0));
  },
  wave_dive(carrier, s) {
    const n = 3 + Math.min(s, 3);
    for (let i = 0; i < n; i++) {
      setTimeout(() => {
        if (G.state !== 'playing') return;
        ENEMY.diver(bounds.maxX + 5, rand(bounds.minY + 4, bounds.maxY - 4));
      }, i * 320);
    }
    if (carrier) this.markCarrier(() => ENEMY.diver(bounds.maxX + 5, rand(-6, 6)));
  },
  wave_turret(carrier, s) {
    const n = 2 + Math.min(s - 1, 2);
    for (let i = 0; i < n; i++) {
      const y = (i % 2 === 0) ? bounds.maxY - 3 : bounds.minY + 3;
      setTimeout(() => { if (G.state === 'playing') ENEMY.turret(bounds.maxX + 5, y + rand(-2, 2)); }, i * 500);
    }
    if (carrier) this.markCarrier(() => ENEMY.turret(bounds.maxX + 5, 0));
  },
  wave_mine(carrier, s) {
    const n = 5 + s;
    for (let i = 0; i < n; i++) {
      setTimeout(() => { if (G.state === 'playing') ENEMY.mine(bounds.maxX + 5, rand(bounds.minY + 2, bounds.maxY - 2)); }, i * 180);
    }
    if (carrier) this.markCarrier(() => ENEMY.mine(bounds.maxX + 5, rand(-8, 8)));
  },
  wave_seeker(carrier, s) {
    const n = 2 + Math.min(s - 2, 3);
    for (let i = 0; i < n; i++) {
      setTimeout(() => { if (G.state === 'playing') ENEMY.seeker(bounds.maxX + 5, rand(bounds.minY + 4, bounds.maxY - 4)); }, i * 400);
    }
    if (carrier) this.markCarrier(() => ENEMY.seeker(bounds.maxX + 5, 0));
  },
  wave_mixed(carrier, s) {
    this.wave_sine(false, s);
    setTimeout(() => this.wave_dive(false, s), 700);
    if (carrier) this.markCarrier(() => ENEMY.seeker(bounds.maxX + 5, rand(-5, 5)));
  },
  markCarrier(makeFn) {
    setTimeout(() => {
      if (G.state !== 'playing') return;
      const e = makeFn(); if (!e) return;
      e.carrier = true; e.hp += 2;
      // visual: pulsing white ring marker
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.12, 8, 20),
        new THREE.MeshBasicMaterial({ color: COL.white }));
      ring.userData.marker = true; e.mesh.add(ring); e.markerRing = ring;
    }, 400);
  },
};

function onSectorClear() {
  addScore(1500);
  updateHUD();
  if (G.sector >= G.maxSector) { endGame(true); return; }
  G.state = 'between';
  showBanner('SECTOR CLEAR', 'warp to next sector', COL.amber);
  setTimeout(() => {
    if (G.state !== 'between') return;
    G.sector++;
    updateStageHUD();
    G.state = 'playing';
    Director.begin(G.sector);
  }, 2600);
}

/* ============================================================
 * 14. Collision detection
 * ========================================================== */
function overlap(ax, ay, ar, bx, by, br) {
  const dx = ax - bx, dy = ay - by, rr = ar + br;
  return dx * dx + dy * dy <= rr * rr;
}

function handleCollisions() {
  // player bullets vs enemies + boss
  for (let i = playerBullets.length - 1; i >= 0; i--) {
    const b = playerBullets[i];
    if (!b.alive) continue;
    let consumed = false;
    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      if (!e.alive) continue;
      if (overlap(b.mesh.position.x, b.mesh.position.y, b.r, e.x, e.y, e.r)) {
        if (b.pierce) { if (b.hitSet.has(e)) continue; b.hitSet.add(e); }
        damageEnemy(e, b.dmg, b.mesh.position.x, e.y);
        if (!b.pierce) { consumed = true; break; }
      }
    }
    if (!consumed && boss && boss.alive && !boss.entering) {
      if (overlap(b.mesh.position.x, b.mesh.position.y, b.r, boss.x, boss.y, boss.r)) {
        if (!b.pierce || !b.hitSet.has(boss)) {
          if (b.pierce) b.hitSet.add(boss);
          damageBoss(b.dmg, b.mesh.position.x, b.mesh.position.y);
          if (!b.pierce) consumed = true;
        }
      }
    }
    if (consumed) { freePB(b); playerBullets.splice(i, 1); }
  }
  // missiles vs enemies/boss
  for (let i = missiles.length - 1; i >= 0; i--) {
    const m = missiles[i];
    let hit = false;
    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j]; if (!e.alive) continue;
      if (overlap(m.x, m.y, m.r, e.x, e.y, e.r)) { damageEnemy(e, m.dmg, m.x, m.y); hit = true; break; }
    }
    if (!hit && boss && boss.alive && !boss.entering && overlap(m.x, m.y, m.r, boss.x, boss.y, boss.r)) {
      damageBoss(m.dmg, m.x, m.y); hit = true;
    }
    if (hit) { FX.burst(m.x, m.y, 0, COL.amber, 8, 0.7); scene.remove(m.mesh); missiles.splice(i, 1); }
  }

  if (!player.alive) return;

  // enemy bullets vs player
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const b = enemyBullets[i];
    if (overlap(b.x, b.y, b.r, player.x, player.y, player.r + (player.force > 0 ? 1.2 : 0))) {
      freeEB(b); enemyBullets.splice(i, 1);
      playerHit('bullet');
      if (!player.alive) return;
    }
  }
  // enemies vs player (ramming)
  for (let j = enemies.length - 1; j >= 0; j--) {
    const e = enemies[j]; if (!e.alive) continue;
    if (overlap(e.x, e.y, e.r, player.x, player.y, player.r + (player.force > 0 ? 1.0 : 0))) {
      if (player.invuln <= 0 && player.force <= 0) killEnemy(e);
      playerHit('ram');
      if (!player.alive) return;
    }
  }
  // boss body vs player
  if (boss && boss.alive && !boss.entering && overlap(boss.x, boss.y, boss.r, player.x, player.y, player.r)) {
    playerHit('boss');
  }
  // capsules vs player
  for (let i = capsules.length - 1; i >= 0; i--) {
    const c = capsules[i];
    if (overlap(c.x, c.y, c.r, player.x, player.y, player.r + 1.2)) {
      collectCapsule(c); scene.remove(c.mesh); capsules.splice(i, 1);
    }
  }
}


/* ============================================================
 * 15. Entity update loops
 * ========================================================== */
const input = { up: false, down: false, left: false, right: false, fire: false, arm: false };

function updatePlayer(dt) {
  if (!player.alive) return;
  const sp = playerSpeed();
  let mx = 0, my = 0;
  if (input.left) mx -= 1; if (input.right) mx += 1;
  if (input.down) my -= 1; if (input.up) my += 1;
  if (input.tx !== undefined) { mx = input.tx; my = input.ty; } // touch analog
  const len = Math.hypot(mx, my) || 1;
  if (len > 1) { mx /= len; my /= len; }
  player.x += mx * sp * dt;
  player.y += my * sp * dt;
  player.x = clamp(player.x, bounds.minX, bounds.maxX);
  player.y = clamp(player.y, bounds.minY, bounds.maxY);
  // banking / roll juice
  player.bank = lerp(player.bank, my * 0.5, 1 - Math.pow(0.001, dt));
  player.mesh.rotation.x = -player.bank;
  player.mesh.rotation.z = my * 0.18;
  player.mesh.position.set(player.x, player.y, 0);

  // trail for options
  player.trail.unshift({ x: player.x, y: player.y });
  if (player.trail.length > 80) player.trail.pop();
  for (let i = 0; i < player.options.length; i++) {
    const o = player.options[i];
    const idx = Math.min(o.delay, player.trail.length - 1);
    const t = player.trail[idx];
    o.mesh.position.set(t.x, t.y, 0);
    o.mesh.rotation.x += dt * 4; o.mesh.rotation.y += dt * 3;
  }

  // fire
  player.fireT -= dt; player.missileT -= dt;
  if (input.fire) firePrimary();

  // invuln blink
  if (player.invuln > 0) {
    player.invuln -= dt;
    player.mesh.visible = (Math.floor(G.time * 20) % 2 === 0);
    if (player.invuln <= 0) player.mesh.visible = true;
  }
  // engine pulse
  const eng = player.mesh.userData.engine;
  const pulse = 2.0 + Math.sin(G.time * 30) * 0.5 + (input.fire ? 0.8 : 0);
  eng.scale.setScalar(pulse);
  playerLight.position.set(player.x, player.y, 4);

  // force field shimmer
  if (player.force > 0) {
    player.forceMesh.material.opacity = 0.12 + Math.sin(G.time * 6) * 0.06;
    player.forceMesh.rotation.y += dt * 1.5;
  }
}

function updateEnemies(dt) {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    if (!e.alive) { enemies.splice(i, 1); continue; }
    e.t += dt;
    if (e.behavior) e.behavior(e, dt);
    e.x += e.vx * dt; e.y += e.vy * dt;
    e.y = clamp(e.y, bounds.minY - 2, bounds.maxY + 2);
    e.mesh.position.set(e.x, e.y, 0);
    // flash on hit
    if (e.flash > 0) { e.flash -= dt; e.mesh.material.emissiveIntensity = 4; }
    else if (e.mesh.material.emissive) e.mesh.material.emissiveIntensity = e._baseEmis || 1.6;
    // marker ring pulse
    if (e.markerRing) { const s = 1 + Math.sin(G.time * 6) * 0.15; e.markerRing.scale.setScalar(s); e.markerRing.rotation.z += dt * 2; }
    // shooting
    if (e.shoots && e.x < bounds.maxX - 2) {
      e.fireT -= dt;
      if (e.fireT <= 0) { e.fireT = e.fireInt; enemyShoot(e, G.sector >= 3 ? 2 : 1); }
    }
    // offscreen cleanup
    if (e.x < bounds.minX - 10) { scene.remove(e.mesh); enemies.splice(i, 1); }
  }
}

function updateBullets(dt) {
  for (let i = playerBullets.length - 1; i >= 0; i--) {
    const b = playerBullets[i];
    b.mesh.position.x += b.vx * dt; b.mesh.position.y += b.vy * dt;
    b.life -= dt;
    if (b.life <= 0 || b.mesh.position.x > bounds.maxX + 12 || b.mesh.position.y > bounds.maxY + 6 || b.mesh.position.y < bounds.minY - 6) {
      freePB(b); playerBullets.splice(i, 1);
    }
  }
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const b = enemyBullets[i];
    b.x += b.vx * dt; b.y += b.vy * dt; b.mesh.position.set(b.x, b.y, 0); b.life -= dt;
    if (b.life <= 0 || b.x < bounds.minX - 8 || b.x > bounds.maxX + 8 || b.y < bounds.minY - 8 || b.y > bounds.maxY + 8) {
      freeEB(b); enemyBullets.splice(i, 1);
    }
  }
  // missiles homing
  for (let i = missiles.length - 1; i >= 0; i--) {
    const m = missiles[i];
    // acquire target
    if (!m.target || !m.target.alive) {
      let best = null, bd = 1e9;
      for (const e of enemies) { if (!e.alive) continue; const d = (e.x - m.x) ** 2 + (e.y - m.y) ** 2; if (d < bd) { bd = d; best = e; } }
      if (boss && boss.alive && !boss.entering) { const d = (boss.x - m.x) ** 2 + (boss.y - m.y) ** 2; if (d < bd) best = boss; }
      m.target = best;
    }
    if (m.target) {
      const tx = m.target.x, ty = m.target.y;
      const desired = Math.atan2(ty - m.y, tx - m.x);
      const cur = Math.atan2(m.vy, m.vx);
      let da = desired - cur; while (da > Math.PI) da -= TAU; while (da < -Math.PI) da += TAU;
      const turn = clamp(da, -4 * dt, 4 * dt);
      const spd = 28, na = cur + turn;
      m.vx = Math.cos(na) * spd; m.vy = Math.sin(na) * spd;
    } else { m.vy += -14 * dt; }
    m.x += m.vx * dt; m.y += m.vy * dt; m.mesh.position.set(m.x, m.y, 0);
    m.mesh.rotation.z = Math.atan2(m.vy, m.vx) - Math.PI / 2;
    if (G.time % 0.03 < dt) FX.spark(m.x, m.y, 0, COL.amber, 1);
    m.life -= dt;
    if (m.life <= 0 || m.x > bounds.maxX + 12 || m.x < bounds.minX - 8 || m.y > bounds.maxY + 8 || m.y < bounds.minY - 8) {
      scene.remove(m.mesh); missiles.splice(i, 1);
    }
  }
}

function updateCapsules(dt) {
  for (let i = capsules.length - 1; i >= 0; i--) {
    const c = capsules[i];
    c.x += c.vx * dt; c.y += Math.sin(G.time * 3 + i) * 4 * dt;
    c.mesh.position.set(c.x, c.y, 0);
    c.mesh.rotation.x += dt * c.spin; c.mesh.rotation.y += dt * c.spin * 0.8;
    c.life -= dt;
    // blink when about to expire
    if (c.life < 3) c.mesh.visible = Math.floor(G.time * 8) % 2 === 0;
    if (c.life <= 0 || c.x < bounds.minX - 6) { scene.remove(c.mesh); capsules.splice(i, 1); }
  }
}

function updateCombo(dt) {
  if (G.comboTimer > 0) { G.comboTimer -= dt; if (G.comboTimer <= 0) resetCombo(); }
}

/* ============================================================
 * 16. HUD
 * ========================================================== */
const el = (id) => document.getElementById(id);
const hudEl = el('hud');
const scoreEl = el('score').querySelector('.hud-value');
const hiEl = el('hi').querySelector('.hud-value');
const stageEl = el('stageInfo').querySelector('.hud-value');
const livesEl = el('lives').querySelector('.hud-value');
const powerbarEl = el('powerbar');

let powerSlotEls = [];
function buildPowerHUD() {
  powerbarEl.innerHTML = '';
  powerSlotEls = POWER_SLOTS.map((s) => {
    const d = document.createElement('div'); d.className = 'pw';
    d.innerHTML = `<div class="pw-name">${s.name}</div><div class="pw-dot"></div>`;
    powerbarEl.appendChild(d); return d;
  });
}
function updatePowerHUD() {
  const active = player.capsules > 0 ? Math.min(player.capsules, 6) - 1 : -1;
  powerSlotEls.forEach((d, i) => {
    d.classList.toggle('active', i === active);
    let owned = false;
    const k = POWER_SLOTS[i].key;
    if (k === 'SPEED') owned = player.speedLevel > 1;
    else if (k === 'MISSILE') owned = player.missiles;
    else if (k === 'DOUBLE') owned = player.double;
    else if (k === 'LASER') owned = player.laser;
    else if (k === 'OPTION') owned = player.optionCount > 0;
    else if (k === 'FORCE') owned = player.force > 0;
    d.classList.toggle('owned', owned);
  });
}
function updateHUD() {
  scoreEl.textContent = G.score.toLocaleString();
  hiEl.textContent = G.best.toLocaleString();
}
function updateStageHUD() { stageEl.textContent = G.sector; }
function updateLivesHUD() { livesEl.textContent = G.lives > 0 ? '▲'.repeat(G.lives) : '—'; }

// boss HP bar (created dynamically)
const bossBar = document.createElement('div');
bossBar.style.cssText = 'position:fixed;top:74px;left:50%;transform:translateX(-50%);width:min(70vw,560px);height:12px;border:1px solid rgba(255,90,90,0.6);border-radius:6px;background:rgba(10,10,20,0.5);z-index:7;opacity:0;transition:opacity .3s;pointer-events:none;box-shadow:0 0 16px rgba(255,90,90,0.35)';
const bossFill = document.createElement('div');
bossFill.style.cssText = 'height:100%;width:100%;border-radius:5px;background:linear-gradient(90deg,#ff3ea5,#ff5a5a,#ffc234);transition:width .1s';
const bossLabel = document.createElement('div');
bossLabel.textContent = 'SECTOR GUARDIAN';
bossLabel.style.cssText = 'position:absolute;top:-18px;left:0;font-size:10px;letter-spacing:3px;color:#ff8fae';
bossBar.appendChild(bossFill); bossBar.appendChild(bossLabel); document.body.appendChild(bossBar);
function showBossHUD() { bossBar.style.opacity = '1'; updateBossHUD(); }
function hideBossHUD() { bossBar.style.opacity = '0'; }
function updateBossHUD() { if (boss) bossFill.style.width = clamp(boss.hp / boss.maxHp, 0, 1) * 100 + '%'; }

// stage banner
const bannerEl = el('stageBanner');
let bannerT = 0;
function showBanner(main, sub, color) {
  bannerEl.querySelector('.sb-main').textContent = main;
  bannerEl.querySelector('.sb-sub').textContent = sub;
  bannerEl.querySelector('.sb-main').style.filter = `drop-shadow(0 0 20px #${(color || COL.magenta).toString(16).padStart(6, '0')})`;
  bannerT = 2.4;
}
function updateBanner(dt) {
  if (bannerT > 0) {
    bannerT -= dt;
    const k = bannerT > 2.0 ? (2.4 - bannerT) / 0.4 : Math.min(1, bannerT / 0.5);
    bannerEl.style.opacity = clamp(k, 0, 1);
  } else bannerEl.style.opacity = 0;
}


/* ============================================================
 * 17. Input — keyboard + touch
 * ========================================================== */
const keyMap = {
  ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down',
  ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
  Space: 'fire', KeyJ: 'fire',
};
window.addEventListener('keydown', (e) => {
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault();
  const m = keyMap[e.code];
  if (m) input[m] = true;
  if (e.code === 'KeyK' || e.code === 'Enter') { if (G.state === 'playing') armPower(); }
  if (e.code === 'KeyP') togglePause();
  if (e.code === 'KeyM') Audio.toggle();
  // any key advances title
  if (G.state === 'title' && (e.code === 'Space' || e.code === 'Enter')) startGame();
});
window.addEventListener('keyup', (e) => { const m = keyMap[e.code]; if (m) input[m] = false; });
window.addEventListener('blur', () => { input.up = input.down = input.left = input.right = input.fire = false; });

// touch
const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
const touchWrap = el('touch');
const stick = el('stick'), stickNub = el('stickNub'), fireBtn = el('fireBtn');
if (isTouch) touchWrap.classList.add('on');
let stickId = null, stickCX = 0, stickCY = 0;
function stickStart(e) {
  const t = e.changedTouches ? e.changedTouches[0] : e;
  const r = stick.getBoundingClientRect();
  stickCX = r.left + r.width / 2; stickCY = r.top + r.height / 2;
  stickId = t.identifier ?? 'mouse';
  stickMove(e); e.preventDefault();
}
function stickMove(e) {
  const list = e.changedTouches || [e];
  for (const t of list) {
    if ((t.identifier ?? 'mouse') !== stickId) continue;
    let dx = t.clientX - stickCX, dy = t.clientY - stickCY;
    const max = 52; const d = Math.hypot(dx, dy);
    if (d > max) { dx *= max / d; dy *= max / d; }
    stickNub.style.transform = `translate(${dx}px,${dy}px)`;
    input.tx = clamp(dx / max, -1, 1);
    input.ty = clamp(-dy / max, -1, 1);
  }
  e.preventDefault();
}
function stickEnd(e) {
  const list = e.changedTouches || [e];
  for (const t of list) if ((t.identifier ?? 'mouse') === stickId) {
    stickId = null; input.tx = 0; input.ty = 0; delete input.tx; delete input.ty;
    stickNub.style.transform = 'translate(0,0)';
  }
}
stick.addEventListener('touchstart', stickStart, { passive: false });
stick.addEventListener('touchmove', stickMove, { passive: false });
stick.addEventListener('touchend', stickEnd);
stick.addEventListener('touchcancel', stickEnd);
fireBtn.addEventListener('touchstart', (e) => { input.fire = true; e.preventDefault(); }, { passive: false });
fireBtn.addEventListener('touchend', (e) => { input.fire = false; e.preventDefault(); });
// double-tap fire button = arm power
let lastTap = 0;
fireBtn.addEventListener('touchstart', () => {
  const now = performance.now();
  if (now - lastTap < 300 && G.state === 'playing') armPower();
  lastTap = now;
});

/* ============================================================
 * 18. Game state control
 * ========================================================== */
function clearField() {
  for (const b of playerBullets) scene.remove(b.mesh); playerBullets.length = 0;
  for (const b of enemyBullets) scene.remove(b.mesh); enemyBullets.length = 0;
  for (const e of enemies) scene.remove(e.mesh); enemies.length = 0;
  for (const c of capsules) scene.remove(c.mesh); capsules.length = 0;
  for (const m of missiles) scene.remove(m.mesh); missiles.length = 0;
  if (boss) { scene.remove(boss.mesh); boss = null; }
  hideBossHUD();
}

function initGame() {
  clearField();
  G.score = 0; G.sector = 1; G.lives = 3; G.time = 0;
  resetCombo();
  player.x = bounds.minX + 8; player.y = 0;
  player.mesh.position.set(player.x, player.y, 0);
  player.mesh.visible = true; player.alive = true; player.invuln = 1.4;
  player.speedLevel = 1; player.double = false; player.laser = false; player.missiles = false;
  player.force = 0; player.forceMesh.visible = false; player.capsules = 0;
  player.fireT = 0; player.missileT = 0; player.trail.length = 0;
  clearOptions();
  updateHUD(); updateStageHUD(); updateLivesHUD(); updatePowerHUD();
}

function startGame() {
  Audio.init(); Audio.resume();
  hideAllOverlays();
  initGame();
  G.state = 'playing';
  hudEl.classList.add('on');
  Director.begin(1);
  Audio.startMusic(SECTORS[0].tempo);
}

function endGame(win) {
  if (G.state === 'over' || G.state === 'win') return;
  G.state = win ? 'win' : 'over';
  Audio.stopMusic();
  if (G.score > G.best) { G.best = G.score; localStorage.setItem('nv_best', G.best); }
  hudEl.classList.remove('on');
  if (win) {
    el('winScore').textContent = G.score.toLocaleString();
    el('winBest').textContent = G.best.toLocaleString();
    show('winOverlay');
    FX.flash(0, 0, 0, COL.amber, 12, 1.2);
  } else {
    el('overScore').textContent = G.score.toLocaleString();
    el('overStage').textContent = G.sector;
    el('overBest').textContent = G.best.toLocaleString();
    show('overOverlay');
  }
}

let prevState = 'playing';
function togglePause() {
  if (G.state === 'playing' || G.state === 'between') { prevState = G.state; G.state = 'paused'; show('pauseOverlay'); Audio.stopMusic(); }
  else if (G.state === 'paused') { hide('pauseOverlay'); G.state = prevState; Audio.startMusic(SECTORS[G.sector - 1].tempo); }
}

// overlay helpers
function show(id) { el(id).classList.remove('hidden'); }
function hide(id) { el(id).classList.add('hidden'); }
function hideAllOverlays() {
  ['loadingOverlay','titleOverlay','pauseOverlay','overOverlay','winOverlay'].forEach(hide);
}

el('startBtn').addEventListener('click', startGame);
el('retryBtn').addEventListener('click', () => { hide('overOverlay'); startGame(); });
el('winBtn').addEventListener('click', () => { hide('winOverlay'); startGame(); });
el('resumeBtn').addEventListener('click', togglePause);

/* ============================================================
 * 19. Main loop
 * ========================================================== */
const fpsEl = el('fps');
let last = performance.now(), fpsAcc = 0, fpsCount = 0, fpsShown = 0;

function frame(nowMs) {
  requestAnimationFrame(frame);
  let dt = (nowMs - last) / 1000; last = nowMs;
  if (dt > 0.05) dt = 0.05; if (dt < 0) dt = 0;

  // fps meter
  fpsAcc += dt; fpsCount++;
  if (fpsAcc >= 0.5) { fpsShown = Math.round(fpsCount / fpsAcc); fpsAcc = 0; fpsCount = 0; fpsEl.textContent = fpsShown + ' fps'; }

  // hit-stop slow motion
  let simDt = dt;
  if (G.hitStop > 0) { G.hitStop -= dt; simDt = dt * 0.2; }

  const simulate = (G.state === 'playing' || G.state === 'between');
  G.time += simDt;

  Background.update(simulate ? simDt : dt * 0.15, simulate ? 1 : 0.3);
  FX.update(simDt);
  updateBanner(dt);

  if (simulate) {
    updatePlayer(simDt);
    updateEnemies(simDt);
    updateBullets(simDt);
    updateCapsules(simDt);
    Director.update(simDt);
    if (boss) updateBoss(simDt);
    updateCombo(simDt);
    handleCollisions();
    updateHUD();
  }

  // camera shake + subtle parallax follow
  if (G.shake > 0) { G.shake -= dt; G.shakeMag = lerp(G.shakeMag, 0, 1 - Math.pow(0.001, dt)); }
  const sm = G.shake > 0 ? G.shakeMag : 0;
  camera.position.set(
    CAM_BASE.x + player.x * 0.04 + rand(-sm, sm),
    CAM_BASE.y + player.y * 0.03 + rand(-sm, sm),
    CAM_BASE.z + rand(-sm, sm) * 0.5,
  );
  camera.lookAt(player.x * 0.06, 1.5 + player.y * 0.04, 0);

  composer.render();
}

/* ============================================================
 * 20. Boot
 * ========================================================== */
// lightweight debug/inspection hook (also handy for automated testing)
window.__NV = { G, player, enemies, capsules, playerBullets, enemyBullets, missiles,
  get boss() { return boss; }, startGame, armPower, Director };

buildPowerHUD();
updateLivesHUD();
// warm one render then reveal title
composer.render();
requestAnimationFrame(() => {
  hide('loadingOverlay');
  show('titleOverlay');
  G.state = 'title';
  requestAnimationFrame(frame);
});
