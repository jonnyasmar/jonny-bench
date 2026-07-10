// Small math / helper utilities.

export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const rand = (a = 1, b) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));
export const randInt = (a, b) => Math.floor(rand(a, b + 1));
export const pick = (arr) => arr[(Math.random() * arr.length) | 0];
export const TAU = Math.PI * 2;

// Exponential smoothing that is framerate independent.
export const damp = (a, b, lambda, dt) => lerp(a, b, 1 - Math.exp(-lambda * dt));

export function approach(cur, target, delta) {
  if (cur < target) return Math.min(cur + delta, target);
  if (cur > target) return Math.max(cur - delta, target);
  return cur;
}

// A tiny fixed-size pool for reusing objects (bullets, particles, enemies).
export class Pool {
  constructor(factory, size) {
    this.factory = factory;
    this.free = [];
    this.active = [];
    for (let i = 0; i < size; i++) this.free.push(factory());
  }
  spawn() {
    const obj = this.free.pop() || this.factory();
    obj.alive = true;
    this.active.push(obj);
    return obj;
  }
  // Sweep active list, recycling anything whose .alive went false.
  sweep(onRecycle) {
    const a = this.active;
    for (let i = a.length - 1; i >= 0; i--) {
      if (!a[i].alive) {
        const obj = a[i];
        a[i] = a[a.length - 1];
        a.pop();
        if (onRecycle) onRecycle(obj);
        this.free.push(obj);
      }
    }
  }
}
