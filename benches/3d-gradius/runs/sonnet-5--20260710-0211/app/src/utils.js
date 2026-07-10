// Small shared helpers used across the game's modules.

export function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function damp(current, target, lambda, dt) {
  // Frame-rate independent easing (Lerp toward target, exponential decay).
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}

export function randRange(min, max) {
  return min + Math.random() * (max - min);
}

export function randSign() {
  return Math.random() < 0.5 ? -1 : 1;
}

export function choice(arr) {
  return arr[(Math.random() * arr.length) | 0];
}

export function weightedChoice(entries) {
  // entries: [[value, weight], ...]
  let total = 0;
  for (const [, w] of entries) total += w;
  let r = Math.random() * total;
  for (const [v, w] of entries) {
    r -= w;
    if (r <= 0) return v;
  }
  return entries[entries.length - 1][0];
}

let glowSpriteCache = new Map();
export function getGlowTexture(THREE, hexColor = '#ffffff') {
  if (glowSpriteCache.has(hexColor)) return glowSpriteCache.get(hexColor);
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.25, hexColor);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  glowSpriteCache.set(hexColor, tex);
  return tex;
}

let gridTexCache = null;
export function getGridTexture(THREE) {
  if (gridTexCache) return gridTexCache;
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#050214';
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = 'rgba(120,220,255,0.55)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, size - 1);
  ctx.lineTo(size, size - 1);
  ctx.moveTo(0, 0);
  ctx.lineTo(size, 0);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(120,220,255,0.22)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(size / 2, 0);
  ctx.lineTo(size / 2, size);
  ctx.stroke();
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  gridTexCache = tex;
  return tex;
}

export class Pool {
  constructor(create, reset, size = 0) {
    this.create = create;
    this.reset = reset;
    this.free = [];
    for (let i = 0; i < size; i++) this.free.push(create());
  }
  obtain() {
    return this.free.pop() || this.create();
  }
  release(obj) {
    this.reset(obj);
    this.free.push(obj);
  }
}

export const TWO_PI = Math.PI * 2;
