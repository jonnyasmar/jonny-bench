import * as THREE from 'three';
import { COLORS } from './config.js';
import { rand, TAU, clamp } from './utils.js';

// A soft round sprite so points read as glowing dots, not squares.
let _dotTex = null;
function dotTexture() {
  if (_dotTex) return _dotTex;
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.35, 'rgba(255,255,255,0.85)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  _dotTex = new THREE.CanvasTexture(c);
  return _dotTex;
}

// ---------------------------------------------------------------------------
// Scrolling starfield — three parallax layers of glowing points.
// ---------------------------------------------------------------------------
export class Starfield {
  constructor(scene, bounds) {
    this.bounds = bounds;
    this.layers = [];
    const tex = dotTexture();
    const specs = [
      { count: 80, z: -45, size: 0.5, speed: 5, color: 0x35507f, op: 0.55 },
      { count: 60, z: -26, size: 0.8, speed: 11, color: 0x6f8fd0, op: 0.7 },
      { count: 42, z: -10, size: 1.25, speed: 20, color: COLORS.star, op: 0.9 },
    ];
    for (const s of specs) {
      const g = new THREE.BufferGeometry();
      const pos = new Float32Array(s.count * 3);
      for (let i = 0; i < s.count; i++) {
        pos[i * 3] = rand(-60, 60);
        pos[i * 3 + 1] = rand(-30, 30);
        pos[i * 3 + 2] = s.z + rand(-3, 3);
      }
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const m = new THREE.PointsMaterial({
        color: s.color, size: s.size, map: tex, sizeAttenuation: true,
        transparent: true, opacity: s.op, blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const pts = new THREE.Points(g, m);
      pts.frustumCulled = false;
      scene.add(pts);
      this.layers.push({ pts, speed: s.speed, count: s.count });
    }
  }
  update(dt, speedMul = 1) {
    for (const L of this.layers) {
      const p = L.pts.geometry.attributes.position;
      const arr = p.array;
      for (let i = 0; i < L.count; i++) {
        arr[i * 3] -= L.speed * speedMul * dt;
        if (arr[i * 3] < -62) { arr[i * 3] = 62; arr[i * 3 + 1] = rand(-30, 30); }
      }
      p.needsUpdate = true;
    }
  }
}

// ---------------------------------------------------------------------------
// Synthwave grid — floor + ceiling planes with a scrolling neon grid shader,
// receding to a horizon for a sense of speed and depth.
// ---------------------------------------------------------------------------
export class GridTunnel {
  constructor(scene) {
    this.time = 0;
    this.mats = [];
    const mk = (isFloor) => {
      const geo = new THREE.PlaneGeometry(320, 160, 1, 1);
      const mat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uColorA: { value: new THREE.Color(COLORS.gridB) },
          uColorB: { value: new THREE.Color(COLORS.gridA) },
        },
        vertexShader: `
          varying vec2 vUv;
          void main(){
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }`,
        fragmentShader: `
          precision highp float;
          varying vec2 vUv;
          uniform float uTime, uScroll;
          uniform vec3 uColorA, uColorB;
          // 1 at grid line, 0 between
          float gline(float c, float w){ float f = fract(c); float d = min(f, 1.0-f); return smoothstep(w, 0.0, d); }
          void main(){
            // perspective-ish: rows compress toward the horizon (vUv.y -> 1)
            float persp = 1.0 / max(0.04, (1.0 - vUv.y));
            float gx = (vUv.x - 0.5) * 46.0;
            float gy = (persp * 2.2) + uScroll;
            float lw = 0.03;
            float g = clamp(gline(gx, lw) + gline(gy, lw*persp*0.28), 0.0, 1.0);
            // fade at horizon (top) and near edge (bottom), and screen sides
            float fade = smoothstep(0.0, 0.16, vUv.y) * (1.0 - smoothstep(0.5, 0.82, vUv.y));
            float sideFade = 1.0 - smoothstep(0.34, 0.5, abs(vUv.x-0.5));
            vec3 col = mix(uColorB, uColorA, clamp(vUv.y*1.4,0.0,1.0));
            float pulse = 0.82 + 0.18*sin(uTime*1.6);
            float a = g * fade * sideFade * 0.4 * pulse;
            gl_FragColor = vec4(col * (0.55 + a), a);
          }`,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = isFloor ? -Math.PI / 2.9 : Math.PI / 2.9;
      mesh.position.y = isFloor ? -19 : 19;
      mesh.position.z = -55;
      mesh.frustumCulled = false;
      scene.add(mesh);
      this.mats.push(mat);
      return mesh;
    };
    this.floor = mk(true);
    this.ceil = mk(false);
  }
  update(dt, speedMul = 1) {
    this.time += dt;
    for (const m of this.mats) {
      m.uniforms.uTime.value = this.time;
      m.uniforms.uScroll.value += dt * 10 * speedMul;
    }
  }
}

// ---------------------------------------------------------------------------
// GPU-friendly CPU particle system — one additive Points cloud, pooled.
// ---------------------------------------------------------------------------
export class Particles {
  constructor(scene, max = 2600) {
    this.max = max;
    this.pos = new Float32Array(max * 3);
    this.col = new Float32Array(max * 3);
    this.vel = new Float32Array(max * 3);
    this.life = new Float32Array(max);
    this.ttl = new Float32Array(max);
    this.size = new Float32Array(max);
    this.drag = new Float32Array(max);
    this.head = 0;
    this.count = 0;

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('color', new THREE.BufferAttribute(this.col, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('psize', new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));
    g.setDrawRange(0, 0);
    this.geo = g;

    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: {},
      vertexShader: `
        attribute float psize; attribute vec3 color; varying vec3 vColor;
        void main(){
          vColor = color;
          vec4 mv = modelViewMatrix * vec4(position,1.0);
          gl_PointSize = psize * (300.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        varying vec3 vColor;
        void main(){
          vec2 d = gl_PointCoord - 0.5;
          float r = dot(d,d);
          if(r>0.25) discard;
          float a = smoothstep(0.25, 0.0, r);
          gl_FragColor = vec4(vColor, a);
        }`,
    });
    this.points = new THREE.Points(g, mat);
    this.points.frustumCulled = false;
    scene.add(this.points);
    this._c = new THREE.Color();
  }

  emit(x, y, z, opts = {}) {
    const i = this.head;
    this.head = (this.head + 1) % this.max;
    if (this.count < this.max) this.count++;
    this.pos[i * 3] = x; this.pos[i * 3 + 1] = y; this.pos[i * 3 + 2] = z || 0;
    const sp = opts.speed ?? 8;
    const ang = opts.angle ?? rand(0, TAU);
    const spd = sp * (0.4 + Math.random() * 0.8);
    this.vel[i * 3] = Math.cos(ang) * spd + (opts.vx || 0);
    this.vel[i * 3 + 1] = Math.sin(ang) * spd + (opts.vy || 0);
    this.vel[i * 3 + 2] = (opts.vz || 0) + rand(-2, 2);
    this._c.set(opts.color ?? 0xffffff);
    if (opts.jitter) this._c.offsetHSL(rand(-0.05, 0.05), 0, rand(-0.1, 0.1));
    this.col[i * 3] = this._c.r; this.col[i * 3 + 1] = this._c.g; this.col[i * 3 + 2] = this._c.b;
    this.ttl[i] = opts.ttl ?? rand(0.4, 0.9);
    this.life[i] = this.ttl[i];
    this.size[i] = opts.size ?? rand(2, 5);
    this.drag[i] = opts.drag ?? 2.2;
  }

  burst(x, y, z, n, opts = {}) {
    for (let k = 0; k < n; k++) this.emit(x, y, z, opts);
  }

  update(dt) {
    const n = this.count;
    for (let i = 0; i < n; i++) {
      if (this.life[i] <= 0) continue;
      this.life[i] -= dt;
      const f = Math.exp(-this.drag[i] * dt);
      this.vel[i * 3] *= f; this.vel[i * 3 + 1] *= f; this.vel[i * 3 + 2] *= f;
      this.pos[i * 3] += this.vel[i * 3] * dt;
      this.pos[i * 3 + 1] += this.vel[i * 3 + 1] * dt;
      this.pos[i * 3 + 2] += this.vel[i * 3 + 2] * dt;
      const t = clamp(this.life[i] / this.ttl[i], 0, 1);
      const s = this.size[i] * t;
      this.geo.attributes.psize.array[i] = s;
      // dim color as it dies
      const c3 = i * 3;
      const base = this.col;
      // store faded into position buffer's color attr directly
      this.geo.attributes.color.array[c3] = base[c3] * (0.3 + 0.7 * t);
      this.geo.attributes.color.array[c3 + 1] = base[c3 + 1] * (0.3 + 0.7 * t);
      this.geo.attributes.color.array[c3 + 2] = base[c3 + 2] * (0.3 + 0.7 * t);
      if (this.life[i] <= 0) this.geo.attributes.psize.array[i] = 0;
    }
    this.geo.setDrawRange(0, this.count);
    this.geo.attributes.position.needsUpdate = true;
    this.geo.attributes.color.needsUpdate = true;
    this.geo.attributes.psize.needsUpdate = true;
  }
}

// ---------------------------------------------------------------------------
// Screen shake via camera trauma (quadratic falloff).
// ---------------------------------------------------------------------------
export class ScreenShake {
  constructor(camera) { this.camera = camera; this.trauma = 0; this.t = 0; this.baseZ = camera.position.z; }
  add(amount) { this.trauma = clamp(this.trauma + amount, 0, 1); }
  update(dt) {
    this.t += dt * 30;
    const s = this.trauma * this.trauma;
    const mag = 1.2 * s;
    this.camera.position.x = Math.sin(this.t * 1.7) * mag;
    this.camera.position.y = Math.cos(this.t * 2.3) * mag;
    this.camera.rotation.z = Math.sin(this.t * 1.1) * 0.02 * s;
    this.trauma = Math.max(0, this.trauma - dt * 1.6);
  }
}
