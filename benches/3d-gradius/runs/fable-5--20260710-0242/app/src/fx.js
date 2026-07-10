import * as THREE from 'three';
import { rand, TAU, clamp } from './util.js';

// Shared soft-glow texture (radial gradient), used by sprites everywhere.
let _glowTex = null;
export function glowTexture() {
  if (_glowTex) return _glowTex;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.25, 'rgba(255,255,255,0.85)');
  grad.addColorStop(0.6, 'rgba(255,255,255,0.22)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  _glowTex = new THREE.CanvasTexture(c);
  return _glowTex;
}

// ---------------------------------------------------------------------------
// Particles: single Points cloud, CPU-simmed, additive, per-particle size/color.

export class Particles {
  constructor(scene, max = 3500) {
    this.max = max;
    this.pos = new Float32Array(max * 3);
    this.vel = new Float32Array(max * 3);
    this.col = new Float32Array(max * 3);
    this.alpha = new Float32Array(max);
    this.size = new Float32Array(max);
    this.life = new Float32Array(max);
    this.maxLife = new Float32Array(max);
    this.drag = new Float32Array(max);
    this.grav = new Float32Array(max);
    this.head = 0;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(this.col, 3));
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(this.alpha, 1));
    geo.setAttribute('aSize', new THREE.BufferAttribute(this.size, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e5);

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute vec3 aColor; attribute float aAlpha; attribute float aSize;
        varying vec3 vC; varying float vA;
        void main() {
          vC = aColor; vA = aAlpha;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (160.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        varying vec3 vC; varying float vA;
        void main() {
          float r = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.05, r) * vA;
          gl_FragColor = vec4(vC * a, a);
        }`,
    });
    this.points = new THREE.Points(geo, mat);
    this.points.frustumCulled = false;
    scene.add(this.points);
  }

  spawn(x, y, z, vx, vy, vz, color, size, life, drag = 0, grav = 0) {
    const i = this.head;
    this.head = (this.head + 1) % this.max;
    const i3 = i * 3;
    this.pos[i3] = x; this.pos[i3 + 1] = y; this.pos[i3 + 2] = z;
    this.vel[i3] = vx; this.vel[i3 + 1] = vy; this.vel[i3 + 2] = vz;
    this.col[i3] = ((color >> 16) & 255) / 255;
    this.col[i3 + 1] = ((color >> 8) & 255) / 255;
    this.col[i3 + 2] = (color & 255) / 255;
    this.size[i] = size;
    this.life[i] = life;
    this.maxLife[i] = life;
    this.alpha[i] = 1;
    this.drag[i] = drag;
    this.grav[i] = grav;
  }

  burst(x, y, z, { count = 20, color = 0xffffff, speed = 8, size = 0.5, life = 0.7, spread = 1, drag = 3, grav = 0, dirX = 0, dirY = 0 } = {}) {
    for (let i = 0; i < count; i++) {
      const a = rand(TAU);
      const s = speed * (0.25 + Math.random() * 0.75);
      this.spawn(
        x + rand(-spread, spread) * 0.3, y + rand(-spread, spread) * 0.3, z,
        Math.cos(a) * s + dirX, Math.sin(a) * s + dirY, rand(-s, s) * 0.35,
        color, size * (0.6 + Math.random() * 0.8), life * (0.5 + Math.random() * 0.9),
        drag, grav
      );
    }
  }

  update(dt) {
    const { pos, vel, life, maxLife, alpha, size, drag, grav, max } = this;
    for (let i = 0; i < max; i++) {
      if (life[i] <= 0) continue;
      life[i] -= dt;
      const i3 = i * 3;
      if (life[i] <= 0) { alpha[i] = 0; size[i] = 0; continue; }
      const d = 1 / (1 + drag[i] * dt);
      vel[i3] *= d; vel[i3 + 1] *= d; vel[i3 + 2] *= d;
      vel[i3 + 1] -= grav[i] * dt;
      pos[i3] += vel[i3] * dt;
      pos[i3 + 1] += vel[i3 + 1] * dt;
      pos[i3 + 2] += vel[i3 + 2] * dt;
      const t = life[i] / maxLife[i];
      alpha[i] = t * t;
    }
    const g = this.points.geometry;
    g.attributes.position.needsUpdate = true;
    g.attributes.aAlpha.needsUpdate = true;
    g.attributes.aSize.needsUpdate = true;
    g.attributes.aColor.needsUpdate = true;
  }
}

// ---------------------------------------------------------------------------
// Shockwaves: pooled expanding rings.

export class Shockwaves {
  constructor(scene) {
    this.pool = [];
    for (let i = 0; i < 10; i++) {
      const geo = new THREE.RingGeometry(0.86, 1, 48);
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff, transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
      });
      const m = new THREE.Mesh(geo, mat);
      m.visible = false;
      scene.add(m);
      this.pool.push({ mesh: m, t: 0, dur: 1, maxR: 1 });
    }
  }

  spawn(x, y, z, color = 0xffffff, maxR = 4, dur = 0.45) {
    const s = this.pool.find((p) => !p.mesh.visible) || this.pool[0];
    s.mesh.visible = true;
    s.mesh.position.set(x, y, z);
    s.mesh.material.color.setHex(color);
    s.t = 0; s.dur = dur; s.maxR = maxR;
  }

  update(dt) {
    for (const s of this.pool) {
      if (!s.mesh.visible) continue;
      s.t += dt;
      const k = s.t / s.dur;
      if (k >= 1) { s.mesh.visible = false; continue; }
      const e = 1 - Math.pow(1 - k, 3);
      const r = 0.2 + e * s.maxR;
      s.mesh.scale.set(r, r, r);
      s.mesh.material.opacity = (1 - k) * 0.9;
    }
  }
}

// ---------------------------------------------------------------------------
// Screen shake: trauma-based, decays, sampled with cheap value noise.

export class Shake {
  constructor() { this.trauma = 0; this.t = 0; }
  add(amount) { this.trauma = clamp(this.trauma + amount, 0, 1); }
  update(dt) {
    this.trauma = Math.max(0, this.trauma - dt * 1.5);
    this.t += dt * 34;
  }
  get x() { return this._n(this.t, 13.7) * this.trauma * this.trauma * 0.8; }
  get y() { return this._n(this.t, 71.3) * this.trauma * this.trauma * 0.8; }
  get roll() { return this._n(this.t, 37.9) * this.trauma * this.trauma * 0.06; }
  _n(t, seed) {
    return Math.sin(t + seed) * 0.6 + Math.sin(t * 2.13 + seed * 1.7) * 0.4;
  }
}
