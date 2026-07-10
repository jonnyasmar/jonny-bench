import * as THREE from 'three';
import { Pool, rand, TAU, clamp, easeOutCubic } from './util.js';

/**
 * Three colours are reserved and never appear in a palette, so the player never
 * has to re-learn the screen: the ship is cyan/white, hostile fire is hot red,
 * capsules are gold. Enemy hulls take the remaining hues.
 */
export const PALETTES = [
  { name: 'AZURE DRIFT',  bg: 0x04050c, accent: 0x5cf6ff, accent2: 0xff4fd8, enemy: 0xa8ff5c, grid: 0x1d5c8f, star: 0xbfe4ff, neb: [0x1b3a6b, 0x4a1650] },
  { name: 'EMBER REACH',  bg: 0x0a0406, accent: 0xffb055, accent2: 0xff3d7f, enemy: 0xc48bff, grid: 0x8f3a24, star: 0xffd9c0, neb: [0x6b2415, 0x50153a] },
  { name: 'VERDANT MAW',  bg: 0x03080a, accent: 0x7dff9e, accent2: 0x35d6ff, enemy: 0xffab4d, grid: 0x1a7a58, star: 0xcaffe0, neb: [0x115040, 0x0d2c58] },
  { name: 'VIOLET CHOIR', bg: 0x07040e, accent: 0xc08bff, accent2: 0x50e3ff, enemy: 0x66ffd0, grid: 0x543394, star: 0xe0ccff, neb: [0x3a1a6b, 0x0f3a63] },
  { name: 'HOLLOW SUN',   bg: 0x0b0903, accent: 0xffe066, accent2: 0xff6b35, enemy: 0xa8ff5c, grid: 0x8f741d, star: 0xfff0c0, neb: [0x6b5215, 0x5c2410] },
];
export const ENEMY_BULLET = 0xff2d55;

const glowCanvas = (draw, size = 128) => {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  draw(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

function makeTextures() {
  // Soft radial falloff — general purpose glow.
  const glow = glowCanvas((g, s) => {
    const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.18, 'rgba(255,255,255,0.85)');
    grd.addColorStop(0.45, 'rgba(255,255,255,0.22)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, s, s);
  });

  // Hot white core + tight halo — reads clearly as a projectile. The saturated
  // plateau is kept narrow: overlapping additive shots would otherwise smear
  // into one continuous bar under bloom.
  const core = glowCanvas((g, s) => {
    const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.12, 'rgba(255,255,255,0.92)');
    grd.addColorStop(0.28, 'rgba(255,255,255,0.42)');
    grd.addColorStop(0.55, 'rgba(255,255,255,0.08)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, s, s);
  });

  // Horizontal streak for lasers / fast shots.
  const streak = glowCanvas((g, s) => {
    const grd = g.createLinearGradient(0, 0, s, 0);
    grd.addColorStop(0, 'rgba(255,255,255,0)');
    grd.addColorStop(0.25, 'rgba(255,255,255,0.5)');
    grd.addColorStop(0.5, 'rgba(255,255,255,1)');
    grd.addColorStop(0.75, 'rgba(255,255,255,0.5)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, s, s);
    // vertical falloff
    const v = g.createLinearGradient(0, 0, 0, s);
    v.addColorStop(0, 'rgba(0,0,0,1)');
    v.addColorStop(0.5, 'rgba(0,0,0,0)');
    v.addColorStop(1, 'rgba(0,0,0,1)');
    g.globalCompositeOperation = 'destination-out';
    g.fillStyle = v;
    g.fillRect(0, 0, s, s);
  });

  // Tight core + faint halo. A soft gradient here reads as bokeh, not starlight.
  const star = glowCanvas((g, s) => {
    const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.12, 'rgba(255,255,255,0.95)');
    grd.addColorStop(0.24, 'rgba(255,255,255,0.28)');
    grd.addColorStop(0.5, 'rgba(255,255,255,0.05)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, s, s);
  }, 64);

  return { glow, core, streak, star };
}

const additive = (map, color) =>
  new THREE.SpriteMaterial({
    map, color, transparent: true, blending: THREE.AdditiveBlending,
    depthWrite: false, depthTest: true, opacity: 1,
  });

export class FX {
  constructor(game) {
    this.game = game;
    this.tex = makeTextures();
    this.pal = PALETTES[0];
    this.trauma = 0;
    this.scroll = 0;
    this.flashEl = document.getElementById('flash');
    this._flash = 0;
    this._flashColor = '#fff';
    this._tmp = new THREE.Vector3();

    this._buildParticles();
    this._buildShards();
    this._buildRings();
    this._buildBackground();
  }

  // ------------------------------------------------------------- particles

  _buildParticles() {
    const g = this.game;
    this.particles = new Pool(() => {
      const s = new THREE.Sprite(additive(this.tex.glow, 0xffffff));
      s.visible = false;
      s.renderOrder = 3;
      g.scene.add(s);
      return { sprite: s, vx: 0, vy: 0, vz: 0, life: 0, max: 1, size: 1, drag: 2, grow: 0 };
    }, 520);
  }

  _buildShards() {
    const g = this.game;
    const geo = new THREE.TetrahedronGeometry(0.16);
    this.shards = new Pool(() => {
      const m = new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      m.visible = false;
      m.renderOrder = 3;
      g.scene.add(m);
      return { mesh: m, vx: 0, vy: 0, vz: 0, rx: 0, ry: 0, life: 0, max: 1, size: 1 };
    }, 130);
  }

  _buildRings() {
    const g = this.game;
    // Near-unit inner radius: the ring is scaled up, so a thick band here would
    // grow into an opaque donut instead of a shockwave.
    const geo = new THREE.RingGeometry(0.94, 1.0, 64);
    this.rings = new Pool(() => {
      const m = new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
      );
      m.visible = false;
      m.renderOrder = 4;
      g.scene.add(m);
      return { mesh: m, life: 0, max: 1, r0: 0, r1: 1, tilt: 0 };
    }, 26);
  }

  /** Omnidirectional spray of glowing motes. */
  burst(x, y, z, opts = {}) {
    const {
      count = 14, color = 0xffffff, speed = 8, spread = 1, size = 0.5,
      life = 0.5, drag = 3.2, vx = 0, vy = 0, zSpread = 0.6, grow = 0,
    } = opts;
    for (let i = 0; i < count; i++) {
      const p = this.particles.obtain();
      if (!p) return;
      const a = rand(0, TAU);
      const el = rand(-1, 1);
      const sp = speed * rand(0.35, 1) * spread;
      p.vx = Math.cos(a) * sp + vx;
      p.vy = Math.sin(a) * sp + vy;
      p.vz = el * sp * zSpread;
      p.max = p.life = life * rand(0.6, 1.25);
      p.size = size * rand(0.6, 1.35);
      p.drag = drag;
      p.grow = grow;
      const s = p.sprite;
      s.position.set(x, y, z);
      s.material.color.setHex(color);
      s.material.opacity = 1;
      s.scale.setScalar(p.size);
      s.visible = true;
    }
  }

  /** Directional, low-cost trail mote. */
  mote(x, y, z, color, size = 0.35, life = 0.3, vx = 0, vy = 0) {
    const p = this.particles.obtain();
    if (!p) return;
    p.vx = vx; p.vy = vy; p.vz = 0;
    p.max = p.life = life;
    p.size = size; p.drag = 4; p.grow = 0;
    const s = p.sprite;
    s.position.set(x, y, z);
    s.material.color.setHex(color);
    s.material.opacity = 1;
    s.scale.setScalar(size);
    s.visible = true;
  }

  shards_(x, y, z, color, count = 8, speed = 7) {
    for (let i = 0; i < count; i++) {
      const s = this.shards.obtain();
      if (!s) return;
      const a = rand(0, TAU);
      const sp = speed * rand(0.4, 1);
      s.vx = Math.cos(a) * sp;
      s.vy = Math.sin(a) * sp;
      s.vz = rand(-3, 3);
      s.rx = rand(-9, 9);
      s.ry = rand(-9, 9);
      s.max = s.life = rand(0.45, 0.9);
      s.size = rand(0.6, 1.5);
      s.mesh.position.set(x, y, z);
      s.mesh.material.color.setHex(color);
      s.mesh.material.opacity = 1;
      s.mesh.scale.setScalar(s.size);
      s.mesh.visible = true;
    }
  }

  ring(x, y, z, color, r1 = 6, dur = 0.45, r0 = 0.2, tilt = 0) {
    const r = this.rings.obtain();
    if (!r) return;
    r.max = r.life = dur;
    r.r0 = r0; r.r1 = r1; r.tilt = tilt;
    r.mesh.position.set(x, y, z);
    r.mesh.rotation.set(tilt, 0, rand(0, TAU));
    r.mesh.material.color.setHex(color);
    r.mesh.material.opacity = 1;
    r.mesh.scale.setScalar(r0);
    r.mesh.visible = true;
  }

  /**
   * Composite "something died" effect, scaled by importance.
   * Shockwave rings are reserved for meaningful kills — a ring on every piece of
   * popcorn just litters the screen with hard circles.
   */
  explode(x, y, z, color, scale = 1) {
    this.burst(x, y, z, {
      count: Math.round(9 + 18 * scale), color, speed: 7 + 10 * scale,
      size: 0.32 + 0.4 * scale, life: 0.35 + 0.45 * scale, drag: 3,
    });
    this.burst(x, y, z, { count: Math.round(3 + 5 * scale), color: 0xffffff, speed: 4 + 8 * scale, size: 0.36 + 0.4 * scale, life: 0.16 + 0.16 * scale, drag: 5 });
    this.shards_(x, y, z, color, Math.round(4 + 9 * scale), 6 + 7 * scale);
    if (scale > 0.58) this.ring(x, y, z, color, 0.7 + 2.4 * scale, 0.3 + 0.25 * scale);
    if (scale > 0.9) this.ring(x, y, z, 0xffffff, 0.6 + 1.4 * scale, 0.22 + 0.16 * scale);
    this.shake(0.12 + 0.4 * scale);
  }

  muzzle(x, y, z, color, s = 1) {
    this.burst(x, y, z, { count: 3, color, speed: 3.5 * s, size: 0.4 * s, life: 0.11, drag: 8, vx: 6 });
  }

  // ------------------------------------------------------------- screen

  shake(amount) { this.trauma = clamp(this.trauma + amount, 0, 1); }

  flash(color = '#ffffff', amount = 0.5) {
    if (amount <= this._flash) return;
    this._flash = amount;
    this._flashColor = color;
    this.flashEl.style.background = color;
  }

  // ------------------------------------------------------------- background

  _buildBackground() {
    const g = this.game;
    const bg = new THREE.Group();
    g.scene.add(bg);
    this.bg = bg;

    // --- starfield: three parallax layers packed into one Points cloud
    const N = 900;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const spd = new Float32Array(N);
    this.starSpeed = spd;
    const c = new THREE.Color();
    for (let i = 0; i < N; i++) {
      const layer = i % 3;
      pos[i * 3] = rand(-90, 90);
      pos[i * 3 + 1] = rand(-42, 42);
      // Keep them well behind the lane; a star at z=-8 fills half the screen.
      pos[i * 3 + 2] = rand(-110, -22) - layer * 12;
      spd[i] = (layer === 0 ? 26 : layer === 1 ? 14 : 6) * rand(0.8, 1.2);
      const b = layer === 0 ? 1 : layer === 1 ? 0.62 : 0.34;
      c.setHex(0xbfe4ff).multiplyScalar(b);
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    sg.setAttribute('color', new THREE.BufferAttribute(col, 3));
    this.stars = new THREE.Points(sg, new THREE.PointsMaterial({
      size: 0.72, map: this.tex.star, vertexColors: true, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true, fog: false,
    }));
    bg.add(this.stars);

    // --- twin synthwave grids, above and below the lane
    const mkGrid = (y, sign) => {
      const size = 260, div = 52;
      const gh = new THREE.GridHelper(size, div, 0x1d5c8f, 0x1d5c8f);
      gh.material.transparent = true;
      gh.material.opacity = 0.5;
      gh.material.blending = THREE.AdditiveBlending;
      gh.material.depthWrite = false;
      gh.position.set(0, y, -46);
      gh.scale.z = 0.9;
      gh.userData.sign = sign;
      bg.add(gh);
      return gh;
    };
    this.gridCell = 260 / 52;
    this.grids = [mkGrid(-13, 1), mkGrid(13, -1)];

    // --- distant crystal monoliths. Kept small, dim and far back: at close z
    // they read as enemies and clutter the lane the player must scan.
    const shapes = [new THREE.OctahedronGeometry(1, 0), new THREE.IcosahedronGeometry(1, 0), new THREE.TetrahedronGeometry(1.3, 0)];
    this.monoliths = [];
    for (let i = 0; i < 11; i++) {
      const geo = shapes[i % shapes.length];
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
        color: 0x1b3a6b, wireframe: true, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      m.position.set(rand(-100, 100), rand(-26, 26), rand(-115, -45));
      const s = rand(1.2, 4.2);
      m.scale.set(s, s * rand(1, 2.2), s);
      m.userData = { spin: rand(-0.25, 0.25), speed: rand(2.5, 7), baseY: m.position.y, bob: rand(0, TAU) };
      bg.add(m);
      this.monoliths.push(m);
    }

    // --- nebula wash
    this.nebulae = [];
    for (let i = 0; i < 3; i++) {
      const s = new THREE.Sprite(additive(this.tex.glow, 0x1b3a6b));
      s.material.opacity = 0.30;
      s.position.set(rand(-40, 40), rand(-16, 16), -70 - i * 16);
      s.scale.setScalar(rand(60, 110));
      s.userData = { speed: rand(0.6, 1.8) };
      bg.add(s);
      this.nebulae.push(s);
    }

    this.setPalette(PALETTES[0]);
  }

  setPalette(pal) {
    this.pal = pal;
    const g = this.game;
    g.scene.background = new THREE.Color(pal.bg);
    if (g.scene.fog) g.scene.fog.color.setHex(pal.bg);

    const c = new THREE.Color(pal.star);
    const col = this.stars.geometry.attributes.color;
    for (let i = 0; i < col.count; i++) {
      const b = i % 3 === 0 ? 1 : i % 3 === 1 ? 0.62 : 0.34;
      col.setXYZ(i, c.r * b, c.g * b, c.b * b);
    }
    col.needsUpdate = true;

    for (const gr of this.grids) gr.material.color.setHex(pal.grid);
    this.monoliths.forEach((m, i) => m.material.color.setHex(i % 2 ? pal.neb[0] : pal.grid));
    this.nebulae.forEach((n, i) => n.material.color.setHex(pal.neb[i % pal.neb.length]));
  }

  // ------------------------------------------------------------- update

  /** `dt` is real time; `speed` scales world scroll (slows during hitstop/slow-mo). */
  update(dt, speed = 1) {
    const t = this.game.time;
    this.scroll += dt * speed;

    // stars
    const p = this.stars.geometry.attributes.position;
    const arr = p.array;
    for (let i = 0; i < this.starSpeed.length; i++) {
      arr[i * 3] -= this.starSpeed[i] * dt * speed;
      if (arr[i * 3] < -95) { arr[i * 3] = 95; arr[i * 3 + 1] = rand(-42, 42); }
    }
    p.needsUpdate = true;

    // grids scroll and wrap on the cell size so the motion is seamless
    for (const gr of this.grids) {
      gr.position.x -= 16 * dt * speed;
      if (gr.position.x <= -this.gridCell) gr.position.x += this.gridCell;
      gr.material.opacity = 0.42 + Math.sin(t * 0.7 + gr.userData.sign) * 0.1;
    }

    for (const m of this.monoliths) {
      m.position.x -= m.userData.speed * dt * speed;
      m.rotation.y += m.userData.spin * dt;
      m.rotation.x += m.userData.spin * 0.4 * dt;
      m.position.y = m.userData.baseY + Math.sin(t * 0.3 + m.userData.bob) * 1.2;
      if (m.position.x < -110) {
        m.position.x = 110;
        m.userData.baseY = rand(-26, 26);
        m.position.z = rand(-115, -45);
      }
    }

    for (const n of this.nebulae) {
      n.position.x -= n.userData.speed * dt * speed;
      if (n.position.x < -90) n.position.x = 90;
    }

    // particles
    for (const o of this.particles.items) {
      if (!o.alive) continue;
      o.life -= dt;
      if (o.life <= 0) { o.sprite.visible = false; this.particles.release(o); continue; }
      const d = Math.exp(-o.drag * dt);
      o.vx *= d; o.vy *= d; o.vz *= d;
      o.sprite.position.x += o.vx * dt;
      o.sprite.position.y += o.vy * dt;
      o.sprite.position.z += o.vz * dt;
      const k = o.life / o.max;
      const sc = o.size * (o.grow ? 1 + (1 - k) * o.grow : 0.25 + k * 0.75);
      o.sprite.scale.setScalar(sc);
      o.sprite.material.opacity = k * k;
    }

    // shards
    for (const o of this.shards.items) {
      if (!o.alive) continue;
      o.life -= dt;
      if (o.life <= 0) { o.mesh.visible = false; this.shards.release(o); continue; }
      o.vy -= 5 * dt; // a touch of gravity sells the debris
      o.mesh.position.x += o.vx * dt;
      o.mesh.position.y += o.vy * dt;
      o.mesh.position.z += o.vz * dt;
      o.mesh.rotation.x += o.rx * dt;
      o.mesh.rotation.y += o.ry * dt;
      const k = o.life / o.max;
      o.mesh.material.opacity = k;
      o.mesh.scale.setScalar(o.size * (0.3 + k * 0.7));
    }

    // shockwave rings
    for (const o of this.rings.items) {
      if (!o.alive) continue;
      o.life -= dt;
      if (o.life <= 0) { o.mesh.visible = false; this.rings.release(o); continue; }
      const k = 1 - o.life / o.max;
      o.mesh.scale.setScalar(o.r0 + (o.r1 - o.r0) * easeOutCubic(k));
      o.mesh.material.opacity = (1 - k) * (1 - k) * 0.6;
    }

    // screen flash decay
    if (this._flash > 0) {
      this._flash = Math.max(0, this._flash - dt * 3.4);
      this.flashEl.style.opacity = String(this._flash);
    }

    // trauma decay (quadratic response feels punchier than linear)
    this.trauma = Math.max(0, this.trauma - dt * 1.6);
  }

  /** Applied by the camera rig after it has positioned itself. */
  applyShake(camera, dt) {
    const s = this.trauma * this.trauma;
    if (s <= 0.0001) return;
    const t = this.game.time * 34;
    camera.position.x += Math.sin(t * 1.7) * s * 0.9 * rand(0.6, 1);
    camera.position.y += Math.sin(t * 2.3 + 1.7) * s * 0.9 * rand(0.6, 1);
    camera.rotation.z += Math.sin(t * 1.1) * s * 0.035;
  }

  reset() {
    this.particles.items.forEach((o) => { o.sprite.visible = false; });
    this.shards.items.forEach((o) => { o.mesh.visible = false; });
    this.rings.items.forEach((o) => { o.mesh.visible = false; });
    this.particles.releaseAll();
    this.shards.releaseAll();
    this.rings.releaseAll();
    this.trauma = 0;
    this._flash = 0;
    this.flashEl.style.opacity = '0';
  }
}
