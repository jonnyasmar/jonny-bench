import * as THREE from 'three';
import { rand, clamp, damp, TAU, chance } from './util.js';

/** Geometry is shared across every instance of a kind; materials are per-instance
 *  so each enemy can flash white independently when hit. */
const geoCache = new Map();
const getGeo = (key, make) => {
  let g = geoCache.get(key);
  if (!g) { g = make(); geoCache.set(key, g); }
  return g;
};
const getEdges = (key, geo) => getGeo(key + ':edges', () => new THREE.EdgesGeometry(geo, 22));

const bulletSpeed = (d) => Math.min(23, 12.5 + d * 0.62);

/**
 * kind = { hp, r, score, drop, scale?, build(), spawn?(e,g), update(e,dt,g) }
 * `e.t` is age in seconds. `e.fireT` counts down to the next attack.
 */
export const KINDS = {
  // ---- popcorn: straight line, occasional pot-shot
  drone: {
    hp: 1, r: 0.55, score: 120, drop: 0.03,
    geo: () => getGeo('drone', () => new THREE.OctahedronGeometry(0.52, 0)),
    spawn(e) {
      e.vx = -(8.2 + e.d * 0.42);
      e.fireT = rand(0.8, 2.2);
      e.canFire = e.opts.canFire ?? chance(0.45);
      e.amp = rand(0, 0.7);
      e.freq = rand(1.2, 2.2);
      e.y0 = e.pos.y;
    },
    update(e, dt, g) {
      e.pos.x += e.vx * dt;
      e.pos.y = e.y0 + Math.sin(e.t * e.freq) * e.amp;
      e.mesh.rotation.x += dt * 1.6;
      e.mesh.rotation.y += dt * 2.1;
      if (!e.canFire || !e.onScreen(g)) return;
      e.fireT -= dt;
      if (e.fireT <= 0 && g.player.alive) {
        e.fireT = rand(1.5, 2.7) / (1 + e.d * 0.05);
        g.bullets.aimed(e.pos.x, e.pos.y, g.player.pos.x, g.player.pos.y, bulletSpeed(e.d));
        g.fx.muzzle(e.pos.x - 0.4, e.pos.y, 0, 0xff2d55, 0.7);
      }
    },
  },

  // ---- sine-wave squads; harmless alone, deadly in a swarm
  waver: {
    hp: 1, r: 0.5, score: 90, drop: 0,
    geo: () => getGeo('waver', () => new THREE.TetrahedronGeometry(0.6, 0)),
    spawn(e) {
      e.vx = -(11.5 + e.d * 0.5);
      e.amp = e.opts.amp ?? 2.6;
      e.freq = e.opts.freq ?? 2.4;
      e.phase = e.opts.phase ?? 0;
      e.y0 = e.pos.y;
    },
    update(e, dt) {
      e.pos.x += e.vx * dt;
      e.pos.y = e.y0 + Math.sin(e.t * e.freq + e.phase) * e.amp;
      e.mesh.rotation.z -= dt * 5;
      e.mesh.rotation.y += dt * 3;
    },
  },

  // ---- tracks your altitude, then commits to a dive
  hunter: {
    hp: 2, r: 0.55, score: 260, drop: 0.1,
    geo: () => getGeo('hunter', () => {
      const g = new THREE.ConeGeometry(0.44, 1.25, 3);
      g.rotateZ(Math.PI / 2); // nose toward -X
      return g;
    }),
    spawn(e) { e.state = 'track'; e.vx = -8; e.vy = 0; },
    update(e, dt, g) {
      if (e.state === 'track') {
        e.vy = damp(e.vy, clamp((g.player.pos.y - e.pos.y) * 2.4, -9, 9), 4, dt);
        if (e.pos.x < g.player.pos.x + 7 || e.t > 3.4) {
          e.state = 'dive';
          const dx = g.player.pos.x - e.pos.x, dy = g.player.pos.y - e.pos.y;
          const d = Math.hypot(dx, dy) || 1;
          const sp = 20 + e.d * 0.8;
          e.vx = (dx / d) * sp;
          e.vy = (dy / d) * sp;
          g.fx.burst(e.pos.x, e.pos.y, 0, { count: 5, color: 0xff2d55, speed: 4, size: 0.35, life: 0.25 });
        }
      }
      e.pos.x += e.vx * dt;
      e.pos.y += e.vy * dt;
      e.mesh.rotation.x += dt * 6;
      e.group.rotation.z = Math.atan2(e.vy, e.vx) + Math.PI;
    },
  },

  // ---- parks itself and lays down aimed bursts
  turret: {
    hp: 5, r: 0.7, score: 420, drop: 0.35,
    geo: () => getGeo('turret', () => new THREE.DodecahedronGeometry(0.68, 0)),
    spawn(e, g) {
      e.stopX = g.bounds.halfW * rand(0.05, 0.5);
      e.vx = -13;
      e.fireT = 1.1;
      e.burst = 0;
      e.bursts = 0;
      e.state = 'enter';
    },
    update(e, dt, g) {
      if (e.state === 'enter') {
        e.pos.x += e.vx * dt;
        if (e.pos.x <= e.stopX) { e.pos.x = e.stopX; e.state = 'hold'; }
      } else if (e.state === 'hold') {
        e.pos.y += Math.sin(e.t * 1.4) * dt * 1.2;
        e.fireT -= dt;
        if (e.fireT <= 0 && g.player.alive) {
          if (e.burst > 0) {
            e.burst--;
            e.fireT = 0.14;
            g.bullets.aimed(e.pos.x, e.pos.y, g.player.pos.x, g.player.pos.y, bulletSpeed(e.d) + 2);
            g.fx.muzzle(e.pos.x - 0.5, e.pos.y, 0, 0xff2d55, 0.9);
            if (e.burst === 0) {
              e.bursts++;
              e.fireT = 1.9 / (1 + e.d * 0.06);
              if (e.bursts >= 3) e.state = 'leave';
            }
          } else {
            e.burst = 3;
            e.fireT = 0.05;
          }
        }
      } else {
        e.pos.x -= (16 + e.d) * dt;
      }
      e.mesh.rotation.y += dt * 1.1;
      e.mesh.rotation.z += dt * 0.7;
    },
  },

  // ---- advances while spraying radial bursts
  spinner: {
    hp: 3, r: 0.62, score: 380, drop: 0.3,
    geo: () => getGeo('spinner', () => new THREE.TorusGeometry(0.48, 0.17, 6, 14)),
    spawn(e) {
      e.vx = -(6.4 + e.d * 0.28);
      e.fireT = 1.6;
      e.y0 = e.pos.y;
    },
    update(e, dt, g) {
      e.pos.x += e.vx * dt;
      e.pos.y = e.y0 + Math.sin(e.t * 1.6) * 1.6;
      e.mesh.rotation.z += dt * 4.5;
      if (!e.onScreen(g)) return;
      e.fireT -= dt;
      if (e.fireT <= 0) {
        e.fireT = 2.5 / (1 + e.d * 0.05);
        const n = 8;
        const sp = bulletSpeed(e.d) * 0.72;
        const off = rand(0, TAU);
        for (let i = 0; i < n; i++) {
          const a = off + (i / n) * TAU;
          g.bullets.spawnEnemyShot(e.pos.x, e.pos.y, Math.cos(a) * sp, Math.sin(a) * sp, { size: 0.9 });
        }
        g.fx.ring(e.pos.x, e.pos.y, 0, 0xff2d55, 2.2, 0.3);
      }
    },
  },

  // ---- drifts slowly; scatters shrapnel when killed
  mine: {
    hp: 1, r: 0.5, score: 160, drop: 0.08,
    geo: () => getGeo('mine', () => new THREE.IcosahedronGeometry(0.5, 0)),
    spawn(e) { e.vx = -(4.4 + e.d * 0.2); e.y0 = e.pos.y; },
    update(e, dt) {
      e.pos.x += e.vx * dt;
      e.pos.y = e.y0 + Math.sin(e.t * 1.1) * 0.9;
      e.mesh.rotation.x += dt * 0.8;
      e.mesh.rotation.y -= dt * 1.3;
      // Pulse warns that this one bites back.
      e.baseEmissive = 0.25 + Math.abs(Math.sin(e.t * 4)) * 0.85;
    },
    onDeath(e, g) {
      const n = 5;
      const sp = bulletSpeed(e.d) * 0.62;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU + rand(0, 0.4);
        g.bullets.spawnEnemyShot(e.pos.x, e.pos.y, Math.cos(a) * sp, Math.sin(a) * sp, { size: 0.85 });
      }
    },
  },

  // ---- mid-boss: hovers, births drones, guaranteed capsule
  carrier: {
    hp: 18, r: 1.45, score: 1500, drop: 1,
    scale: 1,
    geo: () => getGeo('carrier', () => {
      const g = new THREE.BoxGeometry(2.6, 1.5, 1.2);
      // pinch the nose for a wedge silhouette
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) {
        if (p.getX(i) < 0) { p.setY(i, p.getY(i) * 0.45); p.setZ(i, p.getZ(i) * 0.45); }
      }
      g.computeVertexNormals();
      return g;
    }),
    spawn(e, g) {
      e.stopX = g.bounds.halfW * 0.5;
      e.vx = -6;
      e.spawnT = 1.4;
      e.spawned = 0;
      e.state = 'enter';
      e.y0 = e.pos.y;
    },
    update(e, dt, g) {
      if (e.state === 'enter') {
        e.pos.x += e.vx * dt;
        if (e.pos.x <= e.stopX) { e.pos.x = e.stopX; e.state = 'hold'; }
      } else if (e.state === 'hold') {
        e.pos.y = e.y0 + Math.sin(e.t * 0.9) * 2.4;
        e.spawnT -= dt;
        if (e.spawnT <= 0) {
          e.spawnT = 1.5;
          e.spawned++;
          for (const sy of [-1, 1]) {
            const d = g.spawnEnemy('drone', e.pos.x - 0.6, e.pos.y + sy * 0.7, { canFire: true });
            if (d) { d.vx = -10; d.y0 = d.pos.y; }
          }
          g.fx.burst(e.pos.x - 1, e.pos.y, 0, { count: 6, color: 0xff2d55, speed: 5, size: 0.4, life: 0.3 });
          if (e.spawned >= 4) e.state = 'leave';
        }
      } else {
        e.pos.x -= 9 * dt;
      }
      e.mesh.rotation.x = Math.sin(e.t) * 0.1;
      e.group.rotation.z = Math.sin(e.t * 0.7) * 0.06;
    },
  },
};

let nextId = 1;

export class Enemy {
  constructor(game, kindKey, x, y, opts = {}) {
    this.game = game;
    this.id = nextId++;
    this.key = kindKey;
    this.kind = KINDS[kindKey];
    this.opts = opts;
    this.d = game.difficulty;

    const color = opts.color ?? game.fx.pal.enemy;
    this.color = color;
    const geo = this.kind.geo();

    this.group = new THREE.Group();
    // Dark faceted body, bright wireframe edges: the neon comes from the outline,
    // not the surface. A hot emissive fill just blooms into a featureless blob.
    this.mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color: 0x0e1a2a, emissive: color, emissiveIntensity: 0.18,
      metalness: 0.35, roughness: 0.5, flatShading: true,
    }));
    this.edges = new THREE.LineSegments(
      getEdges(kindKey, geo),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: 1 })
    );
    this.mesh.add(this.edges);
    this.group.add(this.mesh);
    this.group.position.set(x, y, 0);
    game.scene.add(this.group);

    // Tanky kinds gain HP with difficulty; popcorn never does (it'd just drag).
    const hpScale = this.kind.hp > 2 ? 1 + this.d * 0.055 : 1;
    this.maxHp = Math.max(1, Math.round(this.kind.hp * hpScale));
    this.hp = this.maxHp;
    this.r = this.kind.r;
    this.alive = true;
    this.t = 0;
    this.flash = 0;
    this.baseEmissive = 0.18;
    this.vx = 0; this.vy = 0;
    this.formation = opts.formation ?? null;
    this.forceDrop = opts.forceDrop ?? false;

    this.kind.spawn?.(this, game);
  }

  get pos() { return this.group.position; }

  onScreen(g) { return this.pos.x < g.bounds.halfW - 0.6; }

  damage(n, g = this.game) {
    if (!this.alive) return false;
    this.hp -= n;
    this.flash = 1;
    if (this.hp <= 0) { this.die(true); return true; }
    g.fx.burst(this.pos.x, this.pos.y, 0, { count: 2, color: 0xffffff, speed: 4, size: 0.3, life: 0.14 });
    g.audio.hit();
    return false;
  }

  /** @param killed true when the player destroyed it (vs. flying off-screen). */
  die(killed) {
    if (!this.alive) return;
    this.alive = false;
    const g = this.game;

    if (killed) {
      // Size the blast by physical bulk *and* toughness, so a turret dying feels
      // heavier than a drone rather than nearly identical.
      const scale = clamp(0.25 + this.r * 0.45 + this.maxHp * 0.02, 0.3, 1.2);
      g.fx.explode(this.pos.x, this.pos.y, 0, this.color, scale);
      g.audio.explode(scale * 0.75);
      this.kind.onDeath?.(this, g);
      g.onEnemyKilled(this);
    } else if (this.formation) {
      // An escapee breaks the formation bonus.
      g.breakFormation(this.formation);
    }

    g.scene.remove(this.group);
    this.mesh.material.dispose();
    this.edges.material.dispose();
  }

  update(dt, g) {
    this.t += dt;
    this.baseEmissive = 0.18;
    this.kind.update(this, dt, g);

    // Bounded, fast-decaying flash. A large bump would pin a continuously-shot
    // target at full white — under sustained fire it never gets to decay.
    if (this.flash > 0) {
      this.flash = Math.max(0, this.flash - dt * 9);
      this.mesh.material.emissiveIntensity = this.baseEmissive + this.flash * 0.9;
      this.edges.material.color.setRGB(1, 1 - this.flash * 0.55, 1 - this.flash * 0.55);
    } else {
      this.mesh.material.emissiveIntensity = this.baseEmissive;
      this.edges.material.color.setHex(this.color);
    }

    const b = g.bounds;
    const p = this.pos;
    if (p.x < -b.halfW - 4 || p.x > b.halfW + 12 || Math.abs(p.y) > b.halfH + 8) this.die(false);
  }
}

export function spawnEnemy(game, kind, x, y, opts) {
  if (!KINDS[kind]) return null;
  const e = new Enemy(game, kind, x, y, opts);
  game.enemies.push(e);
  return e;
}
