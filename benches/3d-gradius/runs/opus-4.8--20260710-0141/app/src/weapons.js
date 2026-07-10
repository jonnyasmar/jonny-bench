import * as THREE from 'three';
import { COLORS, CONFIG, bounds } from './config.js';
import { Audio } from './audio.js';

// Shared geometries/materials (built once).
const G = {};
const M = {};
function shared() {
  if (G.built) return;
  G.built = true;
  G.normal = new THREE.BoxGeometry(1.5, 0.26, 0.26);
  G.laser = new THREE.BoxGeometry(6.5, 0.22, 0.22);
  G.missile = new THREE.ConeGeometry(0.22, 0.7, 6);
  G.missile.rotateZ(-Math.PI / 2);
  G.ebul = new THREE.SphereGeometry(0.28, 8, 8);
  G.ering = new THREE.TorusGeometry(0.4, 0.07, 6, 12);

  M.normal = new THREE.MeshBasicMaterial({ color: COLORS.bullet });
  M.laser = new THREE.MeshBasicMaterial({ color: COLORS.laser, transparent: true, opacity: 0.92, blending: THREE.AdditiveBlending });
  M.missile = new THREE.MeshBasicMaterial({ color: COLORS.missile });
  M.ebul = new THREE.MeshBasicMaterial({ color: COLORS.enemyBul });
}

// Player projectile system: normal / double / laser / missile.
export class ProjectileSystem {
  constructor(scene) {
    shared();
    this.scene = scene;
    this.active = [];
    this.pools = { normal: [], laser: [], missile: [] };
  }

  _get(type) {
    const pool = this.pools[type];
    let p = pool.pop();
    if (!p) {
      const geo = type === 'laser' ? G.laser : type === 'missile' ? G.missile : G.normal;
      const mat = type === 'laser' ? M.laser : type === 'missile' ? M.missile : M.normal;
      p = { mesh: new THREE.Mesh(geo, mat), type, hits: new Set() };
      this.scene.add(p.mesh);
    }
    p.mesh.visible = true;
    p.hits.clear();
    return p;
  }

  fire(type, x, y, opts = {}) {
    const p = this._get(type);
    p.type = type;
    p.x = x; p.y = y;
    p.alive = true;
    p.damage = opts.damage ?? (type === 'laser' ? 2 : type === 'missile' ? 3 : 1);
    p.pierce = type === 'laser';
    p.state = 'fly';
    p.mesh.rotation.set(0, 0, 0);
    p.mesh.scale.set(1, 1, 1);
    if (type === 'missile') {
      p.vx = CONFIG.missileSpeed * 0.7; p.vy = -CONFIG.missileSpeed * 0.7;
    } else if (type === 'laser') {
      p.vx = CONFIG.laserSpeed; p.vy = 0;
    } else {
      p.vx = (opts.vx ?? CONFIG.bulletSpeed);
      p.vy = (opts.vy ?? 0);
      if (p.vy !== 0) { // double diagonal — angle the sprite
        p.mesh.rotation.z = Math.atan2(p.vy, p.vx);
      }
    }
    p.mesh.position.set(x, y, 0);
    this.active.push(p);
    return p;
  }

  update(dt) {
    const a = this.active;
    for (let i = a.length - 1; i >= 0; i--) {
      const p = a[i];
      if (p.type === 'missile') {
        // dive then skim along the floor
        if (p.state === 'fly') {
          p.vy -= 60 * dt;
          if (p.y <= bounds.bottom + 1.2) { p.y = bounds.bottom + 1.2; p.vy = 0; p.vx = CONFIG.missileSpeed; p.state = 'skim'; }
        }
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.mesh.position.set(p.x, p.y, 0);
      if (p.type === 'laser') {
        p.mesh.material.opacity = 0.7 + 0.3 * Math.random();
      }
      if (p.x > bounds.right + 8 || p.x < bounds.left - 8 || p.y > bounds.top + 6 || p.y < bounds.bottom - 6) {
        this._kill(p, i);
      }
    }
  }

  _kill(p, i) {
    p.alive = false;
    p.mesh.visible = false;
    this.active.splice(i, 1);
    this.pools[p.type].push(p);
  }

  killAt(index) { this._kill(this.active[index], index); }
  recycle(p) {
    const idx = this.active.indexOf(p);
    if (idx >= 0) this._kill(p, idx);
  }

  reset() {
    for (const p of this.active) { p.mesh.visible = false; this.pools[p.type].push(p); }
    this.active.length = 0;
  }
}

// Enemy bullets — simple homing-less glowing orbs.
export class EnemyBullets {
  constructor(scene) {
    shared();
    this.scene = scene;
    this.active = [];
    this.pool = [];
  }
  _get() {
    let b = this.pool.pop();
    if (!b) {
      const grp = new THREE.Group();
      const core = new THREE.Mesh(G.ebul, M.ebul);
      grp.add(core);
      this.scene.add(grp);
      b = { mesh: grp };
    }
    b.mesh.visible = true;
    return b;
  }
  spawn(x, y, vx, vy) {
    const b = this._get();
    b.x = x; b.y = y; b.vx = vx; b.vy = vy; b.alive = true;
    b.mesh.position.set(x, y, 0);
    this.active.push(b);
    Audio.enemyShoot();
    return b;
  }
  update(dt) {
    const a = this.active;
    for (let i = a.length - 1; i >= 0; i--) {
      const b = a[i];
      b.x += b.vx * dt; b.y += b.vy * dt;
      b.mesh.position.set(b.x, b.y, 0);
      b.mesh.rotation.z += dt * 6;
      if (b.x < bounds.left - 6 || b.x > bounds.right + 6 || b.y > bounds.top + 6 || b.y < bounds.bottom - 6) {
        this._kill(b, i);
      }
    }
  }
  _kill(b, i) { b.alive = false; b.mesh.visible = false; this.active.splice(i, 1); this.pool.push(b); }
  recycle(b) { const i = this.active.indexOf(b); if (i >= 0) this._kill(b, i); }
  reset() { for (const b of this.active) { b.mesh.visible = false; this.pool.push(b); } this.active.length = 0; }
}
