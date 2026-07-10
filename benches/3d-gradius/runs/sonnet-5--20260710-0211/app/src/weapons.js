import * as THREE from 'three';
import { clamp, getGlowTexture } from './utils.js';
import { DESPAWN_Z, SPAWN_Z, BOUNDS } from './world.js';
import { buildShipMesh } from './player.js';

export const WEAPON_ITEMS = [
  { key: 'SPEED', label: 'SPD' },
  { key: 'TWIN', label: 'TWN' },
  { key: 'MISSILE', label: 'MSL' },
  { key: 'LASER', label: 'LSR' },
  { key: 'OPTION', label: 'OPT' },
  { key: 'SHIELD', label: 'SHD' },
];

const BULLET_SPEED = 92;
const MISSILE_SPEED = 62;
const OPTION_HISTORY_DELAY = 9; // samples of trailing history per option slot

let bulletId = 1;

function bulletGeometry() {
  return new THREE.CapsuleGeometry(0.09, 0.6, 2, 4);
}
function missileGeometry() {
  return new THREE.ConeGeometry(0.14, 0.55, 6);
}

export class WeaponSystem {
  constructor(scene, particles, audio, player, state) {
    this.scene = scene;
    this.particles = particles;
    this.audio = audio;
    this.player = player;
    this.state = state; // shared state.playerBullets / enemyBullets arrays from game.js

    this.cursorIndex = -1;
    this.primaryMode = 'single'; // single | twin | triple | laser
    this.laserTier = 0;
    this.missileTier = 0;
    this.options = [];
    this.shieldHits = 0;
    this.shieldMax = 0;

    this._fireCooldown = 0;
    this._missileCooldown = 0;
    this._history = [];
    this._historyTick = 0;

    this._bulletGeo = bulletGeometry();
    this._missileGeo = missileGeometry();

    this._buildShieldMesh();
  }

  _buildShieldMesh() {
    const geo = new THREE.SphereGeometry(1.05, 16, 12);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x59ff9c,
      transparent: true,
      opacity: 0.22,
      wireframe: true,
    });
    this.shieldMesh = new THREE.Mesh(geo, mat);
    this.shieldMesh.visible = false;
    this.player.mesh.add(this.shieldMesh);
  }

  collectPrism() {
    this.cursorIndex = this.cursorIndex < 0 ? 0 : (this.cursorIndex + 1) % WEAPON_ITEMS.length;
    this.audio.pickup();
  }

  tryActivate() {
    if (this.cursorIndex < 0) return false;
    const item = WEAPON_ITEMS[this.cursorIndex].key;
    this._applyItem(item);
    this.cursorIndex = -1;
    this.audio.powerActivate();
    return true;
  }

  _applyItem(item) {
    switch (item) {
      case 'SPEED':
        this.player.speedTier = clamp(this.player.speedTier + 1, 0, 3);
        break;
      case 'TWIN':
        if (this.primaryMode === 'laser') {
          this.primaryMode = 'twin';
        } else if (this.primaryMode === 'single') {
          this.primaryMode = 'twin';
        } else if (this.primaryMode === 'twin') {
          this.primaryMode = 'triple';
        }
        break;
      case 'MISSILE':
        this.missileTier = clamp(this.missileTier + 1, 0, 2);
        break;
      case 'LASER':
        this.primaryMode = 'laser';
        this.laserTier = clamp(this.laserTier + 1, 0, 2);
        break;
      case 'OPTION':
        if (this.options.length < 2) this._addOption();
        break;
      case 'SHIELD':
        this.shieldHits = this.shieldMax = 3;
        this.shieldMesh.visible = true;
        break;
    }
  }

  _addOption() {
    const mesh = buildShipMesh(0xffb347, 0.5);
    this.scene.add(mesh);
    this.options.push({ mesh, delay: OPTION_HISTORY_DELAY * (this.options.length + 1) });
  }

  // Called on death: strip back one tier of firepower rather than a full wipe.
  onPlayerDeath() {
    if (this.options.length > 0) this.options.pop().mesh.removeFromParent();
    if (this.primaryMode === 'triple') this.primaryMode = 'twin';
    else if (this.primaryMode === 'twin' || this.primaryMode === 'laser') {
      this.primaryMode = 'single';
      this.laserTier = 0;
    }
    this.missileTier = Math.max(0, this.missileTier - 1);
    this.player.speedTier = Math.max(0, this.player.speedTier - 1);
    this.shieldHits = 0;
    this.shieldMax = 0;
    this.shieldMesh.visible = false;
    this.cursorIndex = -1;
  }

  absorbHit() {
    if (this.shieldHits > 0) {
      this.shieldHits -= 1;
      if (this.shieldHits <= 0) {
        this.shieldMesh.visible = false;
        this.audio.shieldBreak();
      } else {
        this.audio.hit();
      }
      return true;
    }
    return false;
  }

  _spawnBullet(x, y, z, opts) {
    const geo = opts.missile ? this._missileGeo : this._bulletGeo;
    const mat = new THREE.MeshBasicMaterial({
      color: opts.color || 0x9df9ff,
      transparent: true,
      opacity: 0.95,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.rotation.x = Math.PI / 2;
    this.scene.add(mesh);

    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: getGlowTexture(THREE, opts.glow || '#9df9ff'),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.8,
    }));
    glow.scale.setScalar(opts.glowScale || 1.1);
    mesh.add(glow);

    const bullet = {
      id: bulletId++,
      mesh,
      x, y, z,
      vx: opts.vx || 0,
      vy: opts.vy || 0,
      vz: opts.vz !== undefined ? opts.vz : -BULLET_SPEED,
      damage: opts.damage || 1,
      piercing: !!opts.piercing,
      homing: !!opts.homing,
      radius: opts.radius || 0.35,
      life: opts.life || 4,
      hitSet: opts.piercing ? new Set() : null,
      owner: 'player',
    };
    this.state.playerBullets.push(bullet);
    return bullet;
  }

  _firePrimaryFrom(x, y, z) {
    const laser = this.primaryMode === 'laser';
    const color = laser ? 0xff3df0 : 0x9df9ff;
    const glow = laser ? '#ff3df0' : '#9df9ff';
    const damage = laser ? 1 + this.laserTier : 1;

    if (this.primaryMode === 'single' || laser) {
      this._spawnBullet(x, y, z - 0.6, {
        vz: -BULLET_SPEED * (laser ? 1.35 : 1),
        color, glow, damage,
        piercing: laser,
        radius: laser ? 0.4 : 0.32,
        glowScale: laser ? 1.6 : 1.1,
      });
    } else if (this.primaryMode === 'twin') {
      this._spawnBullet(x - 0.42, y, z - 0.6, { vz: -BULLET_SPEED, color, glow, damage });
      this._spawnBullet(x + 0.42, y, z - 0.6, { vz: -BULLET_SPEED, color, glow, damage });
    } else if (this.primaryMode === 'triple') {
      this._spawnBullet(x - 0.5, y, z - 0.6, { vz: -BULLET_SPEED, vx: -3.2, color, glow, damage });
      this._spawnBullet(x, y, z - 0.6, { vz: -BULLET_SPEED, color, glow, damage });
      this._spawnBullet(x + 0.5, y, z - 0.6, { vz: -BULLET_SPEED, vx: 3.2, color, glow, damage });
    }
  }

  _fireMissileFrom(x, y, z, enemies) {
    const count = this.missileTier;
    for (let i = 0; i < count; i++) {
      const spread = count > 1 ? (i === 0 ? -1.1 : 1.1) : 0;
      this._spawnBullet(x + spread, y - 0.3, z - 0.6, {
        missile: true,
        vz: -MISSILE_SPEED,
        vx: spread * 2,
        vy: -1,
        color: 0xffb347,
        glow: '#ffb347',
        damage: 2,
        homing: true,
        radius: 0.4,
        life: 5,
        glowScale: 1.3,
      });
    }
  }

  update(dt, input, enemies) {
    // Sample player position history for the trailing "options" drones.
    this._historyTick += dt;
    if (this._historyTick >= 0.02) {
      this._historyTick = 0;
      this._history.unshift({ x: this.player.x, y: this.player.y });
      if (this._history.length > 400) this._history.length = 400;
    }
    for (const opt of this.options) {
      const sample = this._history[opt.delay] || this._history[this._history.length - 1] || { x: 0, y: 0 };
      opt.mesh.position.x += (sample.x - opt.mesh.position.x) * clamp(dt * 10, 0, 1);
      opt.mesh.position.y += (sample.y - opt.mesh.position.y) * clamp(dt * 10, 0, 1);
      opt.mesh.position.z = this.player.mesh.position.z;
      opt.mesh.rotation.z = this.player.mesh.rotation.z;
    }

    // Firing.
    this._fireCooldown -= dt;
    this._missileCooldown -= dt;
    if (this.player.alive && input.fireHeld) {
      const rate = this.primaryMode === 'laser' ? 0.09 : 0.16;
      if (this._fireCooldown <= 0) {
        this._fireCooldown = rate;
        const p = this.player.mesh.position;
        this._firePrimaryFrom(p.x, p.y, p.z);
        this.audio[this.primaryMode === 'laser' ? 'laserBeam' : 'laser'](this.laserTier);
        for (const opt of this.options) {
          this._spawnBullet(opt.mesh.position.x, opt.mesh.position.y, opt.mesh.position.z - 0.4, {
            vz: -BULLET_SPEED, color: 0xffb347, glow: '#ffb347', damage: 1,
          });
        }
      }
      if (this.missileTier > 0 && this._missileCooldown <= 0) {
        this._missileCooldown = 0.75;
        const p = this.player.mesh.position;
        this._fireMissileFrom(p.x, p.y, p.z, enemies);
        this.audio.missile();
      }
    }

    this._updateProjectiles(dt, enemies);
  }

  _updateProjectiles(dt, enemies) {
    const bullets = this.state.playerBullets;
    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      if (b.homing) {
        const target = this._nearestEnemy(b, enemies);
        if (target) {
          const dx = target.x - b.x, dy = target.y - b.y, dz = target.z - b.z;
          const d = Math.hypot(dx, dy, dz) || 1;
          const turn = 6.5 * dt;
          b.vx += (dx / d) * MISSILE_SPEED * turn;
          b.vy += (dy / d) * MISSILE_SPEED * turn;
          b.vz += (dz / d) * MISSILE_SPEED * turn;
          const speed = Math.hypot(b.vx, b.vy, b.vz) || 1;
          const cap = MISSILE_SPEED * 1.4;
          if (speed > cap) {
            b.vx = (b.vx / speed) * cap;
            b.vy = (b.vy / speed) * cap;
            b.vz = (b.vz / speed) * cap;
          }
        }
      }
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.z += b.vz * dt;
      b.life -= dt;
      b.mesh.position.set(b.x, b.y, b.z);
      if (b.homing) {
        const dir = new THREE.Vector3(b.vx, b.vy, b.vz).normalize();
        b.mesh.lookAt(b.x + dir.x, b.y + dir.y, b.z + dir.z);
        b.mesh.rotateX(Math.PI / 2);
      }

      if (b.z < SPAWN_Z - 20 || b.z > DESPAWN_Z + 20 || b.life <= 0 ||
          b.x < BOUNDS.xMin - 8 || b.x > BOUNDS.xMax + 8) {
        this.scene.remove(b.mesh);
        bullets.splice(i, 1);
      }
    }
  }

  _nearestEnemy(bullet, enemies) {
    let best = null, bestD = Infinity;
    for (const e of enemies) {
      if (!e.alive || e.z > bullet.z + 4) continue;
      const d = Math.hypot(e.x - bullet.x, e.y - bullet.y, e.z - bullet.z);
      if (d < bestD) { bestD = d; best = e; }
    }
    return best;
  }

  removeBullet(bullet) {
    const arr = this.state.playerBullets;
    const idx = arr.indexOf(bullet);
    if (idx >= 0) {
      this.scene.remove(bullet.mesh);
      arr.splice(idx, 1);
    }
  }

  reset() {
    for (const b of this.state.playerBullets) this.scene.remove(b.mesh);
    this.state.playerBullets.length = 0;
    for (const opt of this.options) this.scene.remove(opt.mesh);
    this.options.length = 0;
    this.primaryMode = 'single';
    this.laserTier = 0;
    this.missileTier = 0;
    this.shieldHits = 0;
    this.shieldMax = 0;
    this.shieldMesh.visible = false;
    this.cursorIndex = -1;
    this._history.length = 0;
  }
}
