import * as THREE from 'three';
import { Pool } from '../engine/pool.js';

const KIND_DEFS = {
  drifter: { hp: 1, score: 100, radius: 0.65, color: 0x33ffb0, emissive: 0x14aa77, dropChance: 0.12 },
  weaver: { hp: 2, score: 130, radius: 0.6, color: 0xffcc33, emissive: 0xaa7a10, dropChance: 0.16 },
  swarmer: { hp: 1, score: 80, radius: 0.45, color: 0xff2f88, emissive: 0xaa0f55, dropChance: 0.08 },
  mine: { hp: 2, score: 150, radius: 0.75, color: 0xaa22ff, emissive: 0x6a0fbb, dropChance: 0.2 },
  turret: { hp: 3, score: 250, radius: 0.7, color: 0xff5544, emissive: 0xaa1f10, dropChance: 0.35 },
  elite: { hp: 6, score: 500, radius: 0.95, color: 0x2266ff, emissive: 0x1033aa, dropChance: 0.6 },
};

function makeMeshForKind(kind) {
  const def = KIND_DEFS[kind];
  const mat = new THREE.MeshStandardMaterial({
    color: def.color,
    emissive: def.emissive,
    emissiveIntensity: 0.9,
    metalness: 0.5,
    roughness: 0.3,
    flatShading: true,
  });
  let geo;
  switch (kind) {
    case 'drifter': geo = new THREE.IcosahedronGeometry(def.radius, 0); break;
    case 'weaver': geo = new THREE.OctahedronGeometry(def.radius, 0); break;
    case 'swarmer': geo = new THREE.TetrahedronGeometry(def.radius, 0); break;
    case 'mine': geo = new THREE.IcosahedronGeometry(def.radius, 1); break;
    case 'turret': geo = new THREE.DodecahedronGeometry(def.radius, 0); break;
    case 'elite': geo = new THREE.OctahedronGeometry(def.radius, 1); break;
    default: geo = new THREE.IcosahedronGeometry(0.5, 0);
  }
  const mesh = new THREE.Mesh(geo, mat);
  return mesh;
}

export class EnemySystem {
  constructor(scene, particles, bullets, audio) {
    this.scene = scene;
    this.particles = particles;
    this.bullets = bullets;
    this.audio = audio;
    this.group = new THREE.Group();
    scene.add(this.group);

    this.pools = {};
    for (const kind of Object.keys(KIND_DEFS)) {
      this.pools[kind] = new Pool(
        () => {
          const mesh = makeMeshForKind(kind);
          mesh.visible = false;
          this.group.add(mesh);
          return { mesh, vel: new THREE.Vector2(), alive: false, kind };
        },
        (obj, opts) => this._reset(obj, kind, opts)
      );
    }

    this.onDeath = null; // (enemy) => void, set by main.js for score/drops
  }

  _reset(obj, kind, opts) {
    const def = KIND_DEFS[kind];
    obj.kind = kind;
    obj.hp = def.hp * (opts.hpMul || 1);
    obj.maxHp = obj.hp;
    obj.score = Math.round(def.score * (opts.scoreMul || 1));
    obj.radius = def.radius;
    obj.dropChance = def.dropChance;
    obj.mesh.position.set(opts.x, opts.y, opts.z || 0);
    obj.mesh.visible = true;
    obj.mesh.scale.setScalar(1);
    obj.age = 0;
    obj.baseY = opts.y;
    obj.baseX = opts.x;
    obj.speed = opts.speed || 8;
    obj.amp = opts.amp || 0;
    obj.freq = opts.freq || 1;
    obj.phase = opts.phase || Math.random() * Math.PI * 2;
    obj.side = opts.side || null; // for turret wall mount
    obj.fireCooldown = opts.fireDelay ?? (1 + Math.random());
    obj.fireInterval = opts.fireInterval || 2.2;
    obj.aggro = opts.aggro || false;
    obj.hitFlash = 0;
    obj.pattern = opts.pattern || 'drift';
    obj.telegraphed = false;
  }

  spawn(kind, opts) {
    return this.pools[kind].spawn(opts);
  }

  get active() {
    let all = [];
    for (const kind in this.pools) all = all.concat(this.pools[kind].active);
    return all;
  }

  applyDamage(enemy, dmg) {
    enemy.hp -= dmg;
    enemy.hitFlash = 0.08;
    if (enemy.hp <= 0) {
      this._kill(enemy);
      return true;
    }
    this.audio.hit();
    return false;
  }

  _kill(enemy) {
    enemy.alive = false;
    enemy.mesh.visible = false;
    const c1 = new THREE.Color(KIND_DEFS[enemy.kind].color);
    this.particles.burst(enemy.mesh.position, {
      color: c1,
      color2: new THREE.Color(0xffffff),
      count: 22 + Math.round(enemy.maxHp * 4),
      speed: 9,
      size: 1.6,
      life: 0.6,
      drag: 1.8,
    });
    this.audio.explosion(0.7 + Math.min(0.6, enemy.maxHp * 0.08));
    if (this.onDeath) this.onDeath(enemy);
  }

  killInstant(enemy, { silent = false } = {}) {
    if (!enemy.alive) return;
    if (!silent) this._kill(enemy);
    else {
      enemy.alive = false;
      enemy.mesh.visible = false;
    }
  }

  update(dt, ctx) {
    const { player, bounds, terrain, scrollSpeed, gameTime } = ctx;
    for (const kind in this.pools) {
      this.pools[kind].update(dt, (e) => {
        e.age += dt;
        this._updateMovement(e, dt, kind, ctx);

        if (e.hitFlash > 0) {
          e.hitFlash -= dt;
          e.mesh.material.emissiveIntensity = 2.2;
        } else {
          e.mesh.material.emissiveIntensity = 0.9;
        }
        e.mesh.rotation.x += dt * 0.6;
        e.mesh.rotation.y += dt * 0.8;

        // firing
        if ((kind === 'turret' || kind === 'elite' || kind === 'weaver') && player && player.alive) {
          e.fireCooldown -= dt;
          if (e.fireCooldown <= 0 && e.mesh.position.x < bounds.right - 2 && e.mesh.position.x > bounds.left) {
            this._fire(e, kind, player);
            e.fireCooldown = e.fireInterval * (0.85 + Math.random() * 0.3);
          }
        }

        // player collision handled centrally in main.js; here just cull off-screen
        const out = e.mesh.position.x < bounds.left - 6 || e.age > 60;
        if (out) {
          e.mesh.visible = false;
          return false;
        }
        return true;
      });
    }
  }

  _fire(e, kind, player) {
    const dx = player.position.x - e.mesh.position.x;
    const dy = player.position.y - e.mesh.position.y;
    const d = Math.hypot(dx, dy) || 1;
    const speed = kind === 'elite' ? 15 : 12;
    if (kind === 'elite') {
      // 3-shot spread
      const baseAngle = Math.atan2(dy, dx);
      for (const off of [-0.24, 0, 0.24]) {
        const a = baseAngle + off;
        this.bullets.spawn({
          position: e.mesh.position,
          velocity: new THREE.Vector3(Math.cos(a) * speed, Math.sin(a) * speed, 0),
          owner: 'enemy', damage: 1, radius: 0.35, life: 5, type: 'enemyOrb',
        });
      }
    } else {
      this.bullets.spawn({
        position: e.mesh.position,
        velocity: new THREE.Vector3((dx / d) * speed, (dy / d) * speed, 0),
        owner: 'enemy', damage: 1, radius: 0.35, life: 5, type: kind === 'turret' ? 'enemyBig' : 'enemyOrb',
      });
    }
    this.audio.shoot('enemy');
  }

  _updateMovement(e, dt, kind, ctx) {
    const { terrain, scrollSpeed, player } = ctx;
    switch (kind) {
      case 'drifter':
        e.mesh.position.x -= e.speed * dt;
        e.baseY += 0;
        e.mesh.position.y = e.baseY + Math.sin(e.age * e.freq + e.phase) * e.amp;
        break;
      case 'weaver':
        e.mesh.position.x -= e.speed * dt;
        e.mesh.position.y = e.baseY + Math.sin(e.age * e.freq + e.phase) * e.amp;
        break;
      case 'swarmer': {
        e.mesh.position.x -= e.speed * dt;
        let targetY = e.baseY + Math.sin(e.age * e.freq + e.phase) * e.amp;
        if (player && player.alive && e.mesh.position.x < player.position.x + 22) {
          targetY = THREE.MathUtils.lerp(e.mesh.position.y, player.position.y, Math.min(1, dt * 1.4));
        }
        e.mesh.position.y = targetY;
        break;
      }
      case 'mine':
        e.mesh.position.x -= e.speed * dt;
        e.mesh.position.y = e.baseY + Math.sin(e.age * 0.7 + e.phase) * e.amp;
        e.mesh.rotation.z += dt * 0.5;
        break;
      case 'turret': {
        const vx = -scrollSpeed;
        e.mesh.position.x += vx * dt;
        if (terrain) {
          const y = e.side === 'top' ? terrain.topAt(e.mesh.position.x) - e.radius - 0.15 : terrain.bottomAt(e.mesh.position.x) + e.radius + 0.15;
          e.mesh.position.y = y;
        }
        break;
      }
      case 'elite':
        e.mesh.position.x -= e.speed * dt;
        if (e.mesh.position.x < ctx.bounds.right * 0.6) {
          e.baseY = THREE.MathUtils.lerp(e.baseY, player && player.alive ? player.position.y * 0.6 : 0, dt * 0.3);
        }
        e.mesh.position.y = e.baseY + Math.sin(e.age * e.freq + e.phase) * e.amp;
        break;
    }
  }

  clear() {
    for (const kind in this.pools) this.pools[kind].killAll();
  }
}

export { KIND_DEFS };
