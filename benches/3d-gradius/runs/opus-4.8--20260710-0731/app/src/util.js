export const TAU = Math.PI * 2;

export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const invLerp = (a, b, v) => (v - a) / (b - a);

/** Frame-rate independent exponential smoothing. */
export const damp = (a, b, lambda, dt) => lerp(a, b, 1 - Math.exp(-lambda * dt));

export const rand = (min = 0, max = 1) => min + Math.random() * (max - min);
export const randInt = (min, max) => Math.floor(min + Math.random() * (max - min + 1));
export const pick = (arr) => arr[(Math.random() * arr.length) | 0];
export const chance = (p) => Math.random() < p;

/** Random point on a unit circle, returned into `out` {x,y}. */
export function randDir(out = { x: 0, y: 0 }) {
  const a = Math.random() * TAU;
  out.x = Math.cos(a);
  out.y = Math.sin(a);
  return out;
}

/** Smooth 0..1 ease. */
export const smoothstep = (t) => {
  t = clamp(t, 0, 1);
  return t * t * (3 - 2 * t);
};
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
export const easeInCubic = (t) => t * t * t;
export const easeOutBack = (t) => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/**
 * Fixed-capacity object pool. Objects carry an `alive` flag; iterate with
 * `for (const o of pool.items) if (o.alive)`.
 */
export class Pool {
  constructor(factory, size) {
    this.items = [];
    this.free = [];
    for (let i = 0; i < size; i++) {
      const o = factory(i);
      o.alive = false;
      this.items.push(o);
      this.free.push(o);
    }
  }
  /** @returns {object|null} null when exhausted — callers must handle it. */
  obtain() {
    const o = this.free.pop();
    if (!o) return null;
    o.alive = true;
    return o;
  }
  release(o) {
    if (!o.alive) return;
    o.alive = false;
    this.free.push(o);
  }
  releaseAll() {
    for (const o of this.items) if (o.alive) this.release(o);
  }
  get activeCount() {
    return this.items.length - this.free.length;
  }
}

/**
 * Squared distance from point P to segment AB. Used for swept bullet collision:
 * at 30fps a fast bullet moves further than its own radius, so a point-in-circle
 * test would let it tunnel straight through a target.
 */
export function segDistSq(px, py, ax, ay, bx, by) {
  const abx = bx - ax, aby = by - ay;
  const apx = px - ax, apy = py - ay;
  const len2 = abx * abx + aby * aby;
  let t = len2 > 0 ? (apx * abx + apy * aby) / len2 : 0;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const dx = apx - abx * t, dy = apy - aby * t;
  return dx * dx + dy * dy;
}

/** Swap-remove: O(1) removal that doesn't preserve order. */
export function swapRemove(arr, i) {
  const last = arr.length - 1;
  if (i !== last) arr[i] = arr[last];
  arr.pop();
}

export const fmt = (n) => n.toLocaleString('en-US');
