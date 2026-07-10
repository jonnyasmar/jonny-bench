import * as THREE from 'three';
import { COLORS, CONFIG, bounds } from './config.js';
import { rand, clamp, TAU } from './utils.js';
import { buildEnemy, buildBoss } from './models.js';
import { Audio } from './audio.js';

const STATS = {
  drone:   { hp: 1,  r: 1.0, pts: 100, speed: 10 },
  sine:    { hp: 1,  r: 1.0, pts: 120, speed: 9 },
  diver:   { hp: 1,  r: 0.9, pts: 160, speed: 11 },
  shooter: { hp: 3,  r: 1.1, pts: 250, speed: 5 },
  popcorn: { hp: 1,  r: 0.7, pts: 80,  speed: 13 },
  tank:    { hp: 14, r: 1.5, pts: 900, speed: 3.5 },
};

export class EnemyManager {
  constructor(scene, particles, enemyBullets) {
    this.scene = scene;
    this.particles = particles;
    this.ebul = enemyBullets;
    this.active = [];
    this.pools = {};
    this.player = null;
    this.diff = 1;
    this.formationDeaths = {};  // id -> {remaining, x, y}
    this.onScore = null;        // (points, x, y) => void
    this.onCapsule = null;      // (x, y) => void
    this.boss = null;
  }

  _get(type) {
    const pool = (this.pools[type] ||= []);
    let e = pool.pop();
    if (!e) e = { mesh: buildEnemy(type), type };
    e.mesh.visible = true;
    if (!e.mesh.parent) this.scene.add(e.mesh);
    return e;
  }

  spawn(type, x, y, opts = {}) {
    const s = STATS[type];
    const e = this._get(type);
    e.type = type;
    e.x = x; e.y = y;
    e.baseY = y;
    e.t = 0;
    e.phase = opts.phase ?? rand(0, TAU);
    e.amp = opts.amp ?? rand(2, 4.5);
    e.freq = opts.freq ?? rand(1.4, 2.4);
    e.speed = (opts.speed ?? s.speed) * (0.9 + 0.25 * this.diff);
    e.hp = Math.ceil(s.hp * (type === 'tank' ? this.diff : 1));
    e.maxHp = e.hp;
    e.radius = s.r;
    e.points = s.pts;
    e.alive = true;
    e.flash = 0;
    e.fireCd = rand(0.6, 1.6);
    e.dropsCapsule = !!opts.dropsCapsule;
    e.formationId = opts.formationId ?? null;
    e.dove = false;
    e.mesh.position.set(x, y, 0);
    e.mesh.scale.setScalar(1);
    this._setColor(e, e.mesh.userData.baseColor);
    if (e.formationId != null) {
      const f = (this.formationDeaths[e.formationId] ||= { remaining: 0, x, y });
      f.remaining++;
    }
    this.active.push(e);
    return e;
  }

  _setColor(e, col) {
    const ed = e.mesh.userData.edge;
    if (ed && col) ed.material.color.copy(col);
  }

  spawnBoss(stage) {
    const mesh = buildBoss();
    this.scene.add(mesh);
    const hp = 200 + stage * 90;
    this.boss = {
      isBoss: true, mesh, type: 'boss',
      x: bounds.right + 8, y: 0, targetX: bounds.right - 9,
      hp, maxHp: hp, radius: 4.2, coreR: 2.0,
      alive: true, t: 0, state: 'enter', fireCd: 1.2, patternT: 0, pattern: 0,
      flash: 0, points: 20000 + stage * 5000, stage,
    };
    Audio.warn();
    return this.boss;
  }

  setPlayer(p) { this.player = p; }

  update(dt) {
    const px = this.player ? this.player.x : 0;
    const py = this.player ? this.player.y : 0;
    const a = this.active;
    for (let i = a.length - 1; i >= 0; i--) {
      const e = a[i];
      e.t += dt;
      // behavior
      switch (e.type) {
        case 'drone':
          e.x -= e.speed * dt; break;
        case 'popcorn':
          e.x -= e.speed * dt; e.y = e.baseY + Math.sin(e.t * e.freq * 1.6 + e.phase) * (e.amp * 0.5); break;
        case 'sine':
          e.x -= e.speed * dt; e.y = e.baseY + Math.sin(e.t * e.freq + e.phase) * e.amp; break;
        case 'diver': {
          e.x -= e.speed * dt;
          if (!e.dove && e.x < bounds.right - 6) { e.dove = true; e.diveY = clamp(py, bounds.bottom + 2, bounds.top - 2); e.diveT = 0; }
          if (e.dove) { e.diveT += dt; const k = clamp(e.diveT * 1.4, 0, 1); e.y += (e.diveY - e.y) * (1.6 * dt) * (1 + k); e.speed += 6 * dt; }
          e.mesh.rotation.z = Math.atan2((e.diveY ?? e.y) - e.y, -1) * 0.3;
          break;
        }
        case 'shooter':
          if (e.x > bounds.right - 8) e.x -= e.speed * dt;
          else { e.y = e.baseY + Math.sin(e.t * 1.1) * 2.2; e.x -= e.speed * 0.25 * dt; }
          e.fireCd -= dt;
          if (e.fireCd <= 0 && e.x < bounds.right - 3 && e.x > bounds.left + 4) {
            this._aimShot(e, px, py, 1); e.fireCd = clamp(2.0 - this.diff * 0.15, 0.7, 2.0);
          }
          break;
        case 'tank': {
          e.x -= e.speed * dt; e.y = e.baseY + Math.sin(e.t * 0.7) * 1.4;
          if (e.mesh.userData.core) e.mesh.userData.core.scale.setScalar(1 + Math.sin(e.t * 6) * 0.12);
          e.fireCd -= dt;
          if (e.fireCd <= 0 && e.x < bounds.right - 3) { this._spread(e, px, py, 3, 0.4); e.fireCd = clamp(1.8 - this.diff * 0.1, 0.8, 1.8); }
          break;
        }
      }

      // spin & flash
      const sp = e.mesh.userData.spin;
      if (sp) { e.mesh.rotation.x += sp.x * dt; e.mesh.rotation.y += sp.y * dt; e.mesh.rotation.z += sp.z * dt; }
      if (e.flash > 0) {
        e.flash -= dt;
        const ed = e.mesh.userData.edge;
        if (ed) ed.material.color.lerpColors(new THREE.Color(0xffffff), e.mesh.userData.baseColor, 1 - clamp(e.flash / 0.12, 0, 1));
      }
      e.mesh.position.set(e.x, e.y, 0);

      // cull when off left
      if (e.x < bounds.left - 6) this._despawn(e, i, false);
    }

    if (this.boss && this.boss.alive) this._updateBoss(dt, px, py);
  }

  _aimShot(e, px, py, mul) {
    const dx = px - e.x, dy = py - e.y;
    const d = Math.hypot(dx, dy) || 1;
    const sp = CONFIG.enemyBulletSpeed * (0.9 + this.diff * 0.06) * mul;
    this.ebul.spawn(e.x - 0.8, e.y, (dx / d) * sp, (dy / d) * sp);
  }
  _spread(e, px, py, n, sprd) {
    const dx = px - e.x, dy = py - e.y; const base = Math.atan2(dy, dx);
    const sp = CONFIG.enemyBulletSpeed * (0.85 + this.diff * 0.05);
    for (let k = 0; k < n; k++) {
      const a = base + (k - (n - 1) / 2) * sprd;
      this.ebul.spawn(e.x, e.y, Math.cos(a) * sp, Math.sin(a) * sp);
    }
  }

  // damage a normal enemy. returns true if killed.
  damage(e, dmg) {
    if (!e.alive) return false;
    e.hp -= dmg;
    e.flash = 0.12;
    Audio.hitSmall();
    if (e.hp <= 0) { this._killEnemy(e); return true; }
    return false;
  }

  _killEnemy(e) {
    const idx = this.active.indexOf(e);
    const col = e.mesh.userData.baseColor?.getHex?.() ?? COLORS.eMagenta;
    this.particles.burst(e.x, e.y, 0, e.type === 'tank' ? 30 : 14, { color: col, speed: e.type === 'tank' ? 20 : 13, ttl: 0.7, size: e.type === 'tank' ? 6 : 4, jitter: true });
    this.particles.burst(e.x, e.y, 0, 8, { color: 0xffffff, speed: 8, ttl: 0.4, size: 3 });
    Audio.explode(e.type === 'tank');
    if (this.onScore) this.onScore(e.points, e.x, e.y);

    // capsule drops
    let drop = e.dropsCapsule;
    if (e.formationId != null) {
      const f = this.formationDeaths[e.formationId];
      if (f) { f.remaining--; if (f.remaining <= 0) drop = true; }
    }
    if (drop && this.onCapsule) this.onCapsule(e.x, e.y);

    if (idx >= 0) this._despawn(e, idx, true);
  }

  _despawn(e, idx, killed) {
    e.alive = false;
    e.mesh.visible = false;
    this.active[idx] = this.active[this.active.length - 1];
    this.active.pop();
    (this.pools[e.type] ||= []).push(e);
    // reset formation bookkeeping if fled (not killed)
    if (!killed && e.formationId != null) {
      const f = this.formationDeaths[e.formationId];
      if (f) f.remaining--;
    }
  }

  // ---- Boss ----
  _updateBoss(dt, px, py) {
    const b = this.boss; b.t += dt;
    const m = b.mesh;
    // parts animation
    if (m.userData.core) { const s = 1 + Math.sin(b.t * 5) * 0.1; m.userData.core.scale.setScalar(s); }
    if (m.userData.ring) m.userData.ring.rotation.x += dt * 1.2;
    if (m.userData.cage) m.userData.cage.rotation.x -= dt * 1.6;

    if (b.state === 'enter') {
      b.x += (b.targetX - b.x) * 1.4 * dt;
      if (b.x <= b.targetX + 0.3) { b.state = 'fight'; }
    } else if (b.state === 'fight') {
      b.y = Math.sin(b.t * 0.6) * 6.5;
      b.fireCd -= dt;
      if (b.fireCd <= 0) {
        this._bossFire(b, px, py);
        b.pattern = (b.pattern + 1) % 3;
        b.fireCd = clamp(1.6 - b.stage * 0.08, 0.7, 1.6);
      }
    }
    if (b.flash > 0) { b.flash -= dt; const c = m.userData.core; if (c) c.material.color.setHex(b.flash > 0.05 ? 0xffffff : COLORS.bossCore); }
    m.position.set(b.x, b.y, 0);
  }

  _bossFire(b, px, py) {
    const cx = b.x - 2, cy = b.y;
    if (b.pattern === 0) {
      // radial burst
      const n = 10 + b.stage * 2;
      for (let k = 0; k < n; k++) {
        const a = (k / n) * TAU + b.t;
        const sp = 11;
        this.ebul.spawn(cx, cy, Math.cos(a) * sp, Math.sin(a) * sp);
      }
    } else if (b.pattern === 1) {
      // aimed 5-spread from turrets
      for (const ty of [-2.6, 2.6]) {
        const dx = px - cx, dy = py - (cy + ty); const base = Math.atan2(dy, dx);
        for (let k = -2; k <= 2; k++) {
          const a = base + k * 0.18; const sp = 14;
          this.ebul.spawn(cx, cy + ty, Math.cos(a) * sp, Math.sin(a) * sp);
        }
      }
    } else {
      // sweeping wall with a gap
      const gap = clamp(py, bounds.bottom + 3, bounds.top - 3);
      for (let yy = bounds.bottom + 1; yy <= bounds.top - 1; yy += 2.4) {
        if (Math.abs(yy - gap) < 2.6) continue;
        this.ebul.spawn(cx, cy, -14, (yy - cy) * 0.0);
        this.ebul.spawn(cx, yy, -13, 0);
      }
    }
    Audio.enemyShoot();
  }

  damageBoss(dmg) {
    const b = this.boss; if (!b || !b.alive || b.state === 'enter') return false;
    b.hp -= dmg; b.flash = 0.12;
    Audio.hitSmall();
    this.particles.emit(b.x - 2 + rand(-1, 1), b.y + rand(-1, 1), 0, { color: COLORS.bossCore, speed: 6, ttl: 0.3, size: 3 });
    if (b.hp <= 0) { this._killBoss(); return true; }
    return false;
  }

  _killBoss() {
    const b = this.boss; b.alive = false;
    if (this.onScore) this.onScore(b.points, b.x, b.y);
    Audio.bossExplode();
    b._dyingT = 0; b._dying = true;
    this._bossDeathTimer = 1.6;
  }

  updateBossDeath(dt) {
    if (!this.boss || !this._bossDeathTimer) return false;
    const b = this.boss;
    this._bossDeathTimer -= dt;
    b._dyingT = (b._dyingT || 0) + dt;
    if (Math.random() < 0.7) {
      this.particles.burst(b.x + rand(-4, 4), b.y + rand(-4, 4), 0, 16,
        { color: rand() < 0.5 ? COLORS.bossCore : COLORS.eOrange, speed: 22, ttl: 0.9, size: 6, jitter: true });
    }
    b.mesh.rotation.z += dt * 2;
    b.mesh.scale.multiplyScalar(1 - dt * 0.35);
    if (this._bossDeathTimer <= 0) {
      this.scene.remove(b.mesh);
      this.particles.burst(b.x, b.y, 0, 60, { color: 0xffffff, speed: 30, ttl: 1.0, size: 8, jitter: true });
      this._bossDeathTimer = 0;
      const dead = this.boss;
      this.boss = null;
      return true; // signals boss fully gone
    }
    return false;
  }

  clearAll() {
    for (const e of this.active) { e.mesh.visible = false; e.alive = false; (this.pools[e.type] ||= []).push(e); }
    this.active.length = 0;
    this.formationDeaths = {};
    if (this.boss) { this.scene.remove(this.boss.mesh); this.boss = null; }
    this._bossDeathTimer = 0;
  }
}
