import * as THREE from 'three';
import { rand, clamp, damp, TAU, pick } from './util.js';

export const BOSS_NAMES = ['SENTINEL', 'CRUCIBLE', 'LEVIATHAN', 'ORACLE', 'APEX'];

const bs = (d) => Math.min(26, 14 + d * 0.6); // bullet speed

/**
 * Parts live in world space (added straight to the scene) so collision code can
 * read `part.pos` without any matrix maths. The decorative rings are the only
 * things parented to a moving group.
 */
class Part {
  constructor(game, { geo, color, hp, r, ox, oy, isCore }) {
    this.game = game;
    this.mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color: 0x140b1c, emissive: color, emissiveIntensity: 0.28,
      metalness: 0.4, roughness: 0.45, flatShading: true,
    }));
    this.edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo, 22),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.95 })
    );
    this.mesh.add(this.edges);
    game.scene.add(this.mesh);

    this.color = color;
    this.hp = this.maxHp = hp;
    this.r = r;
    this.ox = ox; this.oy = oy;
    this.isCore = !!isCore;
    this.alive = true;
    this.flash = 0;
  }
  get pos() { return this.mesh.position; }

  damage(n) {
    if (!this.alive) return false;
    this.hp -= n;
    this.flash = 1;
    if (this.hp <= 0) { this.hp = 0; return true; }
    return false;
  }

  destroy() {
    this.alive = false;
    this.game.scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.edges.material.dispose();
    this.edges.geometry.dispose();
  }

  tick(dt) {
    if (this.flash > 0) {
      this.flash = Math.max(0, this.flash - dt * 8);
      this.mesh.material.emissiveIntensity = 0.28 + this.flash * 1.0;
      this.edges.material.color.setRGB(1, 1 - this.flash * 0.6, 1 - this.flash * 0.6);
    } else {
      this.mesh.material.emissiveIntensity = 0.28;
      this.edges.material.color.setHex(this.color);
    }
  }
}

export class Boss {
  constructor(game, stage) {
    this.game = game;
    this.stage = stage;
    this.name = BOSS_NAMES[(stage - 1) % BOSS_NAMES.length];
    this.d = game.difficulty;
    const pal = game.fx.pal;

    const coreHp = 190 + stage * 95;
    const podHp = 44 + stage * 17;

    this.core = new Part(game, {
      geo: new THREE.OctahedronGeometry(1.7, 0),
      color: 0xff2d55, hp: coreHp, r: 1.6, ox: 0.2, oy: 0, isCore: true,
    });
    this.pods = [-1, 1].map((s) => new Part(game, {
      geo: new THREE.DodecahedronGeometry(1.05, 0),
      color: pal.accent2, hp: podHp, r: 1.05, ox: -0.5, oy: s * 3.5,
    }));
    this.parts = [this.core, ...this.pods];
    this.liveParts = this.parts.slice(); // cached; rebuilt only when a part dies

    // Decorative armature — spins, never collides.
    this.root = new THREE.Group();
    game.scene.add(this.root);
    this.rings = [];
    for (let i = 0; i < 3; i++) {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(2.5 + i * 0.9, 0.07, 5, 40),
        new THREE.MeshBasicMaterial({ color: pal.accent, transparent: true, opacity: 0.34, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      m.rotation.set(rand(0, TAU), rand(0, TAU), 0);
      this.root.add(m);
      this.rings.push(m);
    }
    const spine = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 7.6, 1.1),
      new THREE.MeshStandardMaterial({ color: 0x0e0a16, emissive: pal.accent, emissiveIntensity: 0.14, metalness: 0.9, roughness: 0.4, flatShading: true })
    );
    spine.position.x = -0.5;
    this.root.add(spine);
    this.root.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(spine.geometry),
      new THREE.LineBasicMaterial({ color: pal.accent, transparent: true, opacity: 0.6 })
    ).translateX(-0.5));

    this.x = game.bounds.halfW + 10;
    this.y = 0;
    this.homeX = game.bounds.halfW * 0.52;
    this.t = 0;
    this.alive = true;
    this.dying = false;
    this.dead = false;
    this.dyingT = 0;
    this.entered = false;
    this.state = 'enter';
    this.atkT = 2.2;
    this.attack = null;
    this.atkPhase = 0;
    this.sweepA = 0;
    this.score = 4000 + stage * 1600;
    this._syncParts(0);
  }

  get maxHp() { return this.core.maxHp + this.pods.reduce((a, p) => a + p.maxHp, 0); }
  get hp() { return this.core.hp + this.pods.reduce((a, p) => a + (p.alive ? p.hp : 0), 0); }
  get hpFrac() { return clamp(this.hp / this.maxHp, 0, 1); }
  get podsAlive() { return this.pods.some((p) => p.alive); }
  get phase() {
    const f = this.core.hp / this.core.maxHp;
    return f > 0.6 ? 1 : f > 0.28 ? 2 : 3;
  }

  /** Hot path (once per bullet) — never allocate here. */
  targets() { return this.liveParts; }

  /** Core is armoured until both pods are gone — the classic "kill the shield" beat. */
  damagePart(part, n) {
    const g = this.game;
    if (this.dying) return;
    const mult = part.isCore && this.podsAlive ? 0.22 : 1;
    const killed = part.damage(n * mult);
    if (mult < 1) {
      g.fx.burst(part.pos.x - 1, part.pos.y, 0, { count: 1, color: 0x8899aa, speed: 3, size: 0.3, life: 0.12 });
    }
    if (!killed) { g.audio.hit(); return; }

    if (part.isCore) {
      this._beginDeath();
    } else {
      part.destroy();
      this.liveParts = this.parts.filter((p) => p.alive);
      g.fx.explode(part.pos.x, part.pos.y, 0, part.color, 0.9);
      g.audio.explode(0.7);
      g.addScore(1200, part.pos.x, part.pos.y);
      if (!this.podsAlive) {
        // Core exposed: big tell.
        g.fx.ring(this.core.pos.x, this.core.pos.y, 0, 0xff2d55, 9, 0.7);
        g.fx.flash('#ff2d55', 0.3);
        g.fx.shake(0.6);
        g.audio.alarm();
      }
    }
  }

  _beginDeath() {
    this.dying = true;
    this.dyingT = 0;
    this.game.bullets.clearEnemyShots();
    this.game.audio.explode(0.6);
  }

  _syncParts(wob) {
    for (const p of this.parts) {
      if (!p.alive) continue;
      p.mesh.position.set(this.x + p.ox, this.y + p.oy + wob * (p.isCore ? 0.3 : 1), 0);
    }
    this.root.position.set(this.x - 0.2, this.y, -0.6);
  }

  // ------------------------------------------------------------- attacks

  _pickAttack() {
    const ph = this.phase;
    const opts = ph === 1
      ? ['spread', 'podRings', 'minions']
      : ph === 2
        ? ['spread', 'sweep', 'podRings', 'minions', 'sweep']
        : ['barrage', 'sweep', 'spread', 'barrage'];
    this.attack = pick(opts);
    this.atkPhase = 0;
    this.sweepA = rand(-0.5, 0.5) + Math.PI;

    switch (this.attack) {
      case 'spread': this.atkT = 0.15; this.shots = 3; break;
      case 'podRings': this.atkT = 0.2; this.shots = this.podsAlive ? 2 : 3; break;
      case 'sweep': this.atkT = 0.4; this.shots = 26; break;
      case 'minions': this.atkT = 0.3; this.shots = 2; break;
      case 'barrage': this.atkT = 0.25; this.shots = 5; break;
    }
  }

  _runAttack(dt, g) {
    if (!g.player.alive) return;
    this.atkT -= dt;
    if (this.atkT > 0) return;

    const p = g.player.pos;
    const speed = bs(this.d) * (this.phase === 3 ? 1.12 : 1);
    const cx = this.core.pos.x - 1.4, cy = this.core.pos.y;

    switch (this.attack) {
      case 'spread': {
        const base = Math.atan2(p.y - cy, p.x - cx);
        for (let i = -2; i <= 2; i++) {
          const a = base + i * 0.19;
          g.bullets.spawnEnemyShot(cx, cy, Math.cos(a) * speed, Math.sin(a) * speed, { size: 1.05 });
        }
        g.fx.muzzle(cx, cy, 0, 0xff2d55, 1.4);
        this.atkT = 0.5;
        break;
      }
      case 'podRings': {
        const srcs = this.podsAlive ? this.pods.filter((x) => x.alive) : [this.core];
        for (const s of srcs) {
          const n = 12;
          const off = rand(0, TAU);
          for (let i = 0; i < n; i++) {
            const a = off + (i / n) * TAU;
            g.bullets.spawnEnemyShot(s.pos.x, s.pos.y, Math.cos(a) * speed * 0.68, Math.sin(a) * speed * 0.68, { size: 0.95 });
          }
          g.fx.ring(s.pos.x, s.pos.y, 0, 0xff2d55, 3, 0.32);
        }
        this.atkT = 0.85;
        break;
      }
      case 'sweep': {
        // A rotating fan the player must outrun / thread.
        this.sweepA += 0.085;
        const a = this.sweepA + Math.sin(this.atkPhase * 0.32) * 0.75;
        g.bullets.spawnEnemyShot(cx, cy, Math.cos(a) * speed * 1.05, Math.sin(a) * speed * 1.05, { size: 0.9 });
        g.bullets.spawnEnemyShot(cx, cy, Math.cos(a + Math.PI * 0.12) * speed * 1.05, Math.sin(a + Math.PI * 0.12) * speed * 1.05, { size: 0.9 });
        this.atkT = 0.045;
        break;
      }
      case 'minions': {
        g.spawnEnemy(this.phase >= 2 ? 'hunter' : 'drone', this.x - 2, this.y + rand(-3, 3), { canFire: true });
        g.fx.burst(this.x - 2, this.y, 0, { count: 6, color: 0xff2d55, speed: 6, size: 0.4, life: 0.3 });
        this.atkT = 0.5;
        break;
      }
      case 'barrage': {
        const base = Math.atan2(p.y - cy, p.x - cx) + rand(-0.1, 0.1);
        for (let i = -1; i <= 1; i++) {
          const a = base + i * 0.3;
          g.bullets.spawnEnemyShot(cx, cy, Math.cos(a) * speed * 1.15, Math.sin(a) * speed * 1.15, { size: 1 });
        }
        if (this.atkPhase % 2 === 1) {
          const n = 10, off = rand(0, TAU);
          for (let i = 0; i < n; i++) {
            const a = off + (i / n) * TAU;
            g.bullets.spawnEnemyShot(cx, cy, Math.cos(a) * speed * 0.55, Math.sin(a) * speed * 0.55, { size: 0.85 });
          }
        }
        g.fx.muzzle(cx, cy, 0, 0xff2d55, 1.6);
        this.atkT = 0.3;
        break;
      }
    }

    if (++this.atkPhase >= this.shots) {
      this.attack = null;
      // Rest between patterns shrinks as the fight escalates.
      this.atkT = (this.phase === 3 ? 0.85 : this.phase === 2 ? 1.15 : 1.5) / (1 + this.d * 0.02);
    }
  }

  // ------------------------------------------------------------- update

  update(dt, g) {
    this.t += dt;

    if (this.dying) {
      this.dyingT += dt;
      // Cascade of detonations across the hull, then the finale.
      if (Math.random() < dt * 14) {
        const p = pick(this.parts);
        g.fx.explode(this.x + rand(-2.5, 2.5), this.y + rand(-4, 4), 0, pick([0xff2d55, 0xffffff, g.fx.pal.accent]), rand(0.35, 0.8));
        g.audio.explode(0.35);
      }
      this.root.rotation.z += dt * 0.8;
      this.root.scale.setScalar(1 + Math.sin(this.dyingT * 20) * 0.02);
      this.x -= dt * 1.2;
      this._syncParts(0);
      for (const p of this.liveParts) p.tick(dt);

      if (this.dyingT > 2.1) this._finalBlast(g);
      return;
    }

    const wob = Math.sin(this.t * 1.1) * 0.35;

    if (this.state === 'enter') {
      this.x = damp(this.x, this.homeX, 1.5, dt);
      if (this.x - this.homeX < 0.4) { this.state = 'fight'; this.entered = true; }
    } else {
      // Vertical patrol; tightens up in phase 3.
      const sp = this.phase === 3 ? 0.85 : this.phase === 2 ? 0.62 : 0.45;
      const amp = g.bounds.halfH - 4.6;
      this.y = Math.sin(this.t * sp) * amp;
      this.x = this.homeX + Math.sin(this.t * 0.37) * 1.6;

      if (!this.attack) {
        this.atkT -= dt;
        if (this.atkT <= 0) this._pickAttack();
      } else {
        this._runAttack(dt, g);
      }
    }

    this._syncParts(wob);

    const spin = this.phase === 3 ? 2 : 1;
    this.core.mesh.rotation.x += dt * 0.7 * spin;
    this.core.mesh.rotation.y += dt * 0.9 * spin;
    for (const p of this.pods) {
      if (!p.alive) continue;
      p.mesh.rotation.y += dt * 1.4;
      p.mesh.rotation.z += dt * 0.8;
    }
    this.rings.forEach((r, i) => {
      r.rotation.x += dt * (0.3 + i * 0.15) * spin;
      r.rotation.y += dt * (0.22 + i * 0.1) * spin;
      r.material.opacity = 0.3 + Math.sin(this.t * 2 + i) * 0.15;
    });
    for (const p of this.liveParts) p.tick(dt);

    // Angrier glow as the core weakens.
    const heat = 1 - this.core.hp / this.core.maxHp;
    this.core.mesh.material.emissiveIntensity = Math.max(this.core.mesh.material.emissiveIntensity, 0.3 + heat * 0.9 + Math.sin(this.t * 9) * heat * 0.35);
  }

  _finalBlast(g) {
    for (let i = 0; i < 5; i++) {
      g.fx.explode(this.x + rand(-3, 3), this.y + rand(-4.5, 4.5), 0, i % 2 ? 0xffffff : 0xff2d55, 1.4);
    }
    g.fx.ring(this.x, this.y, 0, 0xffffff, 24, 1.1);
    g.fx.ring(this.x, this.y, 0, 0xff2d55, 17, 0.85);
    g.fx.flash('#ffffff', 0.85);
    g.fx.shake(1);
    g.audio.explode(1);
    this.destroy();
    this.dead = true;
    this.alive = false;
  }

  destroy() {
    for (const p of this.parts) if (p.alive) p.destroy();
    this.root.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) o.material.dispose();
    });
    this.game.scene.remove(this.root);
  }
}
