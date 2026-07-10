import * as THREE from 'three';
import { getGlowTexture } from './utils.js';

const MAX_PARTICLES = 900;

// A single GPU-friendly THREE.Points cloud shared by all bursts/trails.
// Particle attributes are updated on the CPU each frame (cheap at this scale)
// and pushed into the BufferGeometry attributes.
export class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.capacity = MAX_PARTICLES;
    this.particles = [];
    for (let i = 0; i < this.capacity; i++) {
      this.particles.push({
        active: false,
        x: 0, y: 0, z: 0,
        vx: 0, vy: 0, vz: 0,
        life: 0, maxLife: 1,
        size: 1, r: 1, g: 1, b: 1,
        drag: 0.98, gravity: 0,
      });
    }

    const geo = new THREE.BufferGeometry();
    this.positions = new Float32Array(this.capacity * 3);
    this.colors = new Float32Array(this.capacity * 3);
    this.sizes = new Float32Array(this.capacity);
    geo.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));
    geo.setDrawRange(0, 0);

    this.geometry = geo;
    this.material = this._buildCustomMaterial();
    this.points = new THREE.Points(geo, this.material);
    this.points.frustumCulled = false;
    scene.add(this.points);

    this.count = 0;
  }

  _buildCustomMaterial() {
    const tex = getGlowTexture(THREE, '#ffffff');
    const material = new THREE.ShaderMaterial({
      uniforms: { map: { value: tex } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        void main(){
          vColor = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        varying vec3 vColor;
        void main(){
          vec4 tex = texture2D(map, gl_PointCoord);
          gl_FragColor = vec4(vColor, 1.0) * tex;
        }
      `,
    });
    return material;
  }

  _obtain() {
    for (let i = 0; i < this.capacity; i++) {
      if (!this.particles[i].active) return this.particles[i];
    }
    return null;
  }

  spawn(opts) {
    const p = this._obtain();
    if (!p) return;
    p.active = true;
    p.x = opts.x; p.y = opts.y; p.z = opts.z;
    p.vx = opts.vx || 0; p.vy = opts.vy || 0; p.vz = opts.vz || 0;
    p.life = opts.life || 0.6;
    p.maxLife = p.life;
    p.size = opts.size || 1.2;
    p.r = opts.r !== undefined ? opts.r : 1;
    p.g = opts.g !== undefined ? opts.g : 1;
    p.b = opts.b !== undefined ? opts.b : 1;
    p.drag = opts.drag !== undefined ? opts.drag : 0.96;
    p.gravity = opts.gravity || 0;
    p.shrink = opts.shrink !== undefined ? opts.shrink : true;
  }

  burst(x, y, z, color, count = 24, opts = {}) {
    const speed = opts.speed || 9;
    const life = opts.life || 0.7;
    const size = opts.size || 1.4;
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const s = speed * (0.35 + Math.random() * 0.9);
      const vx = Math.sin(phi) * Math.cos(theta) * s;
      const vy = Math.sin(phi) * Math.sin(theta) * s;
      const vz = Math.cos(phi) * s * 0.6;
      this.spawn({
        x, y, z, vx, vy, vz,
        life: life * (0.6 + Math.random() * 0.7),
        size: size * (0.6 + Math.random() * 0.8),
        r: color.r, g: color.g, b: color.b,
        drag: 0.92,
        gravity: opts.gravity || 0,
      });
    }
  }

  spark(x, y, z, dirx, diry, dirz, color, opts = {}) {
    this.spawn({
      x, y, z,
      vx: dirx + (Math.random() - 0.5) * 2,
      vy: diry + (Math.random() - 0.5) * 2,
      vz: dirz + (Math.random() - 0.5) * 2,
      life: opts.life || 0.25,
      size: opts.size || 0.8,
      r: color.r, g: color.g, b: color.b,
      drag: 0.9,
    });
  }

  update(dt) {
    let idx = 0;
    for (let i = 0; i < this.capacity; i++) {
      const p = this.particles[i];
      if (!p.active) continue;
      p.life -= dt;
      if (p.life <= 0) {
        p.active = false;
        continue;
      }
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.vz *= p.drag;
      p.vy -= p.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;

      const t = p.life / p.maxLife;
      const sizeMul = p.shrink === false ? 1 : t;
      const o = idx * 3;
      this.positions[o] = p.x;
      this.positions[o + 1] = p.y;
      this.positions[o + 2] = p.z;
      this.colors[o] = p.r * t;
      this.colors[o + 1] = p.g * t;
      this.colors[o + 2] = p.b * t;
      this.sizes[idx] = p.size * (0.4 + 0.6 * sizeMul);
      idx++;
    }
    this.count = idx;
    this.geometry.setDrawRange(0, this.count);
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    this.geometry.attributes.size.needsUpdate = true;
  }
}
