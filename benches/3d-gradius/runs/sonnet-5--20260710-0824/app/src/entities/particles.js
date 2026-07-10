import * as THREE from 'three';

function makeGlowTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.35, 'rgba(255,255,255,0.7)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

const VERT = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aAlpha;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vColor = aColor;
    vAlpha = aAlpha;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (300.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D uTex;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 tex = texture2D(uTex, gl_PointCoord);
    gl_FragColor = vec4(vColor, 1.0) * tex * vAlpha;
  }
`;

export class ParticleSystem {
  constructor(scene, maxParticles = 900) {
    this.max = maxParticles;
    this.positions = new Float32Array(maxParticles * 3);
    this.colors = new Float32Array(maxParticles * 3);
    this.sizes = new Float32Array(maxParticles);
    this.alphas = new Float32Array(maxParticles);
    this.velocities = new Float32Array(maxParticles * 3);
    this.lives = new Float32Array(maxParticles);
    this.maxLives = new Float32Array(maxParticles);
    this.drags = new Float32Array(maxParticles);
    this.active = new Uint8Array(maxParticles);
    this.cursor = 0;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(this.colors, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(this.sizes, 1));
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(this.alphas, 1));
    geo.setDrawRange(0, 0);

    const mat = new THREE.ShaderMaterial({
      uniforms: { uTex: { value: makeGlowTexture() } },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.points = new THREE.Points(geo, mat);
    this.points.frustumCulled = false;
    scene.add(this.points);
    this.geo = geo;
    this.liveCount = 0;
  }

  _spawnOne(px, py, pz, vx, vy, vz, color, size, life, drag) {
    const i = this.cursor;
    this.cursor = (this.cursor + 1) % this.max;
    this.active[i] = 1;
    this.positions[i * 3] = px;
    this.positions[i * 3 + 1] = py;
    this.positions[i * 3 + 2] = pz;
    this.velocities[i * 3] = vx;
    this.velocities[i * 3 + 1] = vy;
    this.velocities[i * 3 + 2] = vz;
    this.colors[i * 3] = color.r;
    this.colors[i * 3 + 1] = color.g;
    this.colors[i * 3 + 2] = color.b;
    this.sizes[i] = size;
    this.alphas[i] = 1;
    this.lives[i] = life;
    this.maxLives[i] = life;
    this.drags[i] = drag;
  }

  burst(position, {
    color = new THREE.Color(0xffffff),
    color2 = null,
    count = 16,
    speed = 6,
    spread = 1,
    size = 1.4,
    life = 0.6,
    drag = 2.2,
    upBias = 0,
  } = {}) {
    for (let n = 0; n < count; n++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const s = speed * (0.4 + Math.random() * 0.9);
      const vx = Math.sin(phi) * Math.cos(theta) * s * spread;
      const vy = Math.sin(phi) * Math.sin(theta) * s * spread + upBias;
      const vz = Math.cos(phi) * s * 0.4;
      const c = color2 && Math.random() < 0.5 ? color2 : color;
      this._spawnOne(
        position.x, position.y, position.z ?? 0,
        vx, vy, vz,
        c,
        size * (0.6 + Math.random() * 0.8),
        life * (0.7 + Math.random() * 0.6),
        drag
      );
    }
  }

  trail(position, color, size = 1, life = 0.35) {
    this._spawnOne(
      position.x + (Math.random() - 0.5) * 0.3,
      position.y + (Math.random() - 0.5) * 0.3,
      (position.z ?? 0) + (Math.random() - 0.5) * 0.3,
      (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6, 1.5 + Math.random(),
      color, size, life, 1.0
    );
  }

  update(dt) {
    let maxIndex = 0;
    let anyActive = false;
    for (let i = 0; i < this.max; i++) {
      if (!this.active[i]) continue;
      this.lives[i] -= dt;
      if (this.lives[i] <= 0) {
        this.active[i] = 0;
        this.alphas[i] = 0;
        continue;
      }
      anyActive = true;
      maxIndex = i;
      const drag = Math.max(0, 1 - this.drags[i] * dt);
      this.velocities[i * 3] *= drag;
      this.velocities[i * 3 + 1] *= drag;
      this.velocities[i * 3 + 2] *= drag;
      this.positions[i * 3] += this.velocities[i * 3] * dt;
      this.positions[i * 3 + 1] += this.velocities[i * 3 + 1] * dt;
      this.positions[i * 3 + 2] += this.velocities[i * 3 + 2] * dt;
      this.alphas[i] = Math.max(0, this.lives[i] / this.maxLives[i]);
    }
    this.geo.setDrawRange(0, anyActive ? this.max : 0);
    this.geo.attributes.position.needsUpdate = true;
    this.geo.attributes.aColor.needsUpdate = true;
    this.geo.attributes.aSize.needsUpdate = true;
    this.geo.attributes.aAlpha.needsUpdate = true;
  }
}
