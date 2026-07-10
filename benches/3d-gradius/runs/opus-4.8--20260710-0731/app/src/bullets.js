import * as THREE from 'three';
import { Pool, TAU, rand } from './util.js';
import { ENEMY_BULLET } from './fx.js';

const spriteMat = (map, color) =>
  new THREE.SpriteMaterial({ map, color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });

export class Bullets {
  constructor(game) {
    this.game = game;
    const { scene } = game;
    const tex = game.fx.tex;

    // Player shots + lasers share one sprite pool; `kind` swaps the texture.
    this.player = new Pool(() => {
      const s = new THREE.Sprite(spriteMat(tex.core, 0xffffff));
      s.visible = false;
      s.renderOrder = 5;
      scene.add(s);
      return { sprite: s, vx: 0, vy: 0, r: 0.3, dmg: 1, pierce: false, hits: new Set(), life: 0, kind: 'shot' };
    }, 110);

    const mGeo = new THREE.ConeGeometry(0.11, 0.52, 6);
    mGeo.rotateZ(-Math.PI / 2); // nose along +X
    this.missiles = new Pool(() => {
      const m = new THREE.Mesh(mGeo, new THREE.MeshBasicMaterial({ color: 0xffd166 }));
      const halo = new THREE.Sprite(spriteMat(tex.glow, 0xffa64d));
      halo.scale.setScalar(1.1);
      m.add(halo);
      m.visible = false;
      scene.add(m);
      return { mesh: m, vx: 0, vy: 0, r: 0.34, dmg: 2, life: 0, target: null, trail: 0 };
    }, 22);

    this.enemy = new Pool(() => {
      const s = new THREE.Sprite(spriteMat(tex.core, ENEMY_BULLET));
      s.visible = false;
      s.renderOrder = 6;
      scene.add(s);
      return { sprite: s, vx: 0, vy: 0, r: 0.24, life: 0, size: 1, spin: 0 };
    }, 260);
  }

  // ------------------------------------------------------------ spawning

  spawnPlayerShot(x, y, { angle = 0, speed = 46, dmg = 1, color = 0x7fdcff, len = 1.0, w = 0.3 } = {}) {
    const b = this.player.obtain();
    if (!b) return null;
    b.kind = 'shot';
    b.vx = Math.cos(angle) * speed;
    b.vy = Math.sin(angle) * speed;
    b.r = 0.3; b.dmg = dmg; b.pierce = false; b.life = 2.4;
    b.hits.clear();
    const s = b.sprite;
    s.material.map = this.game.fx.tex.core;
    s.material.color.setHex(color);
    s.material.rotation = angle;
    s.material.opacity = 1;
    s.scale.set(len, w, 1);
    s.position.set(x, y, 0);
    s.visible = true;
    return b;
  }

  spawnLaser(x, y, { dmg = 1.5, speed = 68, len = 7.5, color = 0x9fe8ff } = {}) {
    const b = this.player.obtain();
    if (!b) return null;
    b.kind = 'laser';
    b.vx = speed; b.vy = 0;
    b.r = 0.42; b.dmg = dmg; b.pierce = true; b.life = 1.1;
    b.hits.clear();
    const s = b.sprite;
    s.material.map = this.game.fx.tex.streak;
    s.material.color.setHex(color);
    s.material.rotation = 0;
    s.material.opacity = 1;
    // Spawns "growing" out of the muzzle — set full length immediately, the
    // sprite is centred so nudge it forward by half.
    s.scale.set(len, 0.44, 1);
    s.position.set(x + len * 0.5, y, 0);
    s.visible = true;
    return b;
  }

  spawnMissile(x, y, { vx = 16, vy = -6, dmg = 2.4 } = {}) {
    const b = this.missiles.obtain();
    if (!b) return null;
    b.vx = vx; b.vy = vy; b.dmg = dmg; b.r = 0.36; b.life = 2.6;
    b.target = null; b.trail = 0;
    b.mesh.position.set(x, y, 0);
    b.mesh.visible = true;
    return b;
  }

  spawnEnemyShot(x, y, vx, vy, { r = 0.24, size = 1, color = ENEMY_BULLET, life = 6 } = {}) {
    const b = this.enemy.obtain();
    if (!b) return null;
    b.vx = vx; b.vy = vy; b.r = r * size; b.life = life; b.size = size;
    b.spin = rand(0, TAU);
    const s = b.sprite;
    s.material.color.setHex(color);
    s.material.opacity = 1;
    s.scale.setScalar(0.85 * size);
    s.position.set(x, y, 0);
    s.visible = true;
    return b;
  }

  /** Aimed shot helper: fires from (x,y) toward (tx,ty) at `speed`. */
  aimed(x, y, tx, ty, speed, opts) {
    const dx = tx - x, dy = ty - y;
    const d = Math.hypot(dx, dy) || 1;
    return this.spawnEnemyShot(x, y, (dx / d) * speed, (dy / d) * speed, opts);
  }

  // ------------------------------------------------------------ lifecycle

  killPlayerBullet(b) { b.sprite.visible = false; this.player.release(b); }
  killMissile(b) { b.mesh.visible = false; this.missiles.release(b); }
  killEnemyBullet(b) { b.sprite.visible = false; this.enemy.release(b); }

  /** Screen-clear: turn every hostile round into confetti. */
  clearEnemyShots() {
    const fx = this.game.fx;
    for (const b of this.enemy.items) {
      if (!b.alive) continue;
      fx.burst(b.sprite.position.x, b.sprite.position.y, 0, {
        count: 3, color: ENEMY_BULLET, speed: 5, size: 0.34, life: 0.3,
      });
      this.killEnemyBullet(b);
    }
  }

  update(dt) {
    const { halfW, halfH } = this.game.bounds;
    const M = 4;
    const fx = this.game.fx;

    for (const b of this.player.items) {
      if (!b.alive) continue;
      const p = b.sprite.position;
      b.px = p.x; b.py = p.y;
      p.x += b.vx * dt;
      p.y += b.vy * dt;
      b.life -= dt;
      if (b.kind === 'laser') {
        // fade the tail out as it expires so it doesn't just vanish
        b.sprite.material.opacity = Math.min(1, b.life * 3);
      }
      if (b.life <= 0 || p.x > halfW + M + 6 || p.x < -halfW - M || Math.abs(p.y) > halfH + M) {
        this.killPlayerBullet(b);
      }
    }

    for (const b of this.missiles.items) {
      if (!b.alive) continue;
      const p = b.mesh.position;
      b.px = p.x; b.py = p.y;

      // Re-acquire whenever the current target dies; seek gently so they arc.
      if (!b.target || !b.target.alive) b.target = this._nearestTarget(p.x, p.y);
      if (b.target && b.target.alive) {
        const t = b.target.pos;
        const dx = t.x - p.x, dy = t.y - p.y;
        const d = Math.hypot(dx, dy) || 1;
        const sp = Math.hypot(b.vx, b.vy) || 1;
        const turn = 9 * dt;
        b.vx += (dx / d) * sp * turn;
        b.vy += (dy / d) * sp * turn;
        const ns = Math.hypot(b.vx, b.vy) || 1;
        const want = Math.min(30, sp + 34 * dt);
        b.vx = (b.vx / ns) * want;
        b.vy = (b.vy / ns) * want;
      } else {
        b.vx += 26 * dt; // no target: just accelerate downrange
      }

      p.x += b.vx * dt;
      p.y += b.vy * dt;
      b.mesh.rotation.z = Math.atan2(b.vy, b.vx);
      b.life -= dt;

      b.trail -= dt;
      if (b.trail <= 0) {
        b.trail = 0.016;
        fx.mote(p.x, p.y, 0, 0xff9a3c, 0.36, 0.26, rand(-2, 2), rand(-2, 2));
      }

      if (b.life <= 0 || p.x > halfW + M || p.x < -halfW - M || Math.abs(p.y) > halfH + M) {
        fx.burst(p.x, p.y, 0, { count: 4, color: 0xffa64d, speed: 5, size: 0.4, life: 0.25 });
        this.killMissile(b);
      }
    }

    for (const b of this.enemy.items) {
      if (!b.alive) continue;
      const p = b.sprite.position;
      b.px = p.x; b.py = p.y;
      p.x += b.vx * dt;
      p.y += b.vy * dt;
      b.life -= dt;
      // subtle twinkle keeps hostile rounds visually distinct from particles
      b.spin += dt * 8;
      b.sprite.scale.setScalar(0.85 * b.size * (1 + Math.sin(b.spin) * 0.09));
      if (b.life <= 0 || p.x < -halfW - M || p.x > halfW + M + 2 || Math.abs(p.y) > halfH + M) {
        this.killEnemyBullet(b);
      }
    }
  }

  /** Any object exposing `{alive, pos}` can be homed onto. */
  _nearestTarget(x, y) {
    let best = null, bd = 1e9;
    const consider = (t) => {
      if (!t.alive || t.pos.x < x) return; // never turn back on a target behind us
      const d = (t.pos.x - x) ** 2 + (t.pos.y - y) ** 2;
      if (d < bd) { bd = d; best = t; }
    };
    for (const e of this.game.enemies) consider(e);
    const boss = this.game.boss;
    if (boss && boss.alive && !boss.dying) for (const part of boss.targets()) consider(part);
    return best;
  }

  reset() {
    for (const b of this.player.items) b.sprite.visible = false;
    for (const b of this.missiles.items) b.mesh.visible = false;
    for (const b of this.enemy.items) b.sprite.visible = false;
    this.player.releaseAll();
    this.missiles.releaseAll();
    this.enemy.releaseAll();
  }
}
