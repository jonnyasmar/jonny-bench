import * as THREE from 'three';
import { clamp, randRange, getGlowTexture } from './utils.js';
import { BOUNDS, SPAWN_Z } from './world.js';
import { spawnEnemyBullet, createDrone } from './enemies.js';

const ENGAGE_Z = -46;
const NODE_COUNT = 4;
const NODE_HP = 9;
const CORE_HP = 42;
const NODE_RADIUS_ORBIT = 3.6;

function addGlow(mesh, colorHex, scale) {
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({
    map: getGlowTexture(THREE, colorHex),
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.7,
  }));
  spr.scale.setScalar(scale);
  mesh.add(spr);
  return spr;
}

export class Boss {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.position.set(0, 0, SPAWN_Z);
    scene.add(this.group);

    this.coreMat = new THREE.MeshStandardMaterial({
      color: 0x1a0a26, emissive: 0xff3df0, emissiveIntensity: 0.5, metalness: 0.7, roughness: 0.3,
    });
    this.coreMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(2.1, 1), this.coreMat);
    this.group.add(this.coreMesh);
    addGlow(this.coreMesh, '#ff3df0', 6);

    this.shellMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(2.6, 0), new THREE.MeshBasicMaterial({
      color: 0xff3df0, wireframe: true, transparent: true, opacity: 0.25,
    }));
    this.group.add(this.shellMesh);

    this.core = { hp: CORE_HP, maxHp: CORE_HP, alive: true, radius: 2.2, damageable: false, contactDamage: 2 };

    this.nodes = [];
    const nodeGeo = new THREE.OctahedronGeometry(0.75, 0);
    for (let i = 0; i < NODE_COUNT; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0x101018, emissive: 0x4dfaff, emissiveIntensity: 0.9, metalness: 0.5, roughness: 0.3,
      });
      const mesh = new THREE.Mesh(nodeGeo, mat);
      addGlow(mesh, '#4dfaff', 2.4);
      this.group.add(mesh);
      this.nodes.push({
        mesh, hp: NODE_HP, maxHp: NODE_HP, alive: true, radius: 0.85, damageable: true, contactDamage: 1,
        angle: (i / NODE_COUNT) * Math.PI * 2, x: 0, y: 0, z: 0,
      });
    }

    this.x = 0;
    this.y = 0;
    this.z = SPAWN_Z;
    this.arrived = false;
    this.defeated = false;
    this.phase = 1;
    this.age = 0;
    this.orbitAngle = 0;
    this._burstTimer = 2.2;
    this._nodeFireTimer = 1.4;
    this._spiralTimer = 0;
    this._spiralAngle = 0;
    this._minionTimer = 6;
    this._deathTimer = 0;
    this._hitFlash = 0;
    this.maxHp = CORE_HP + NODE_COUNT * NODE_HP;
  }

  get x_() { return this.x; }

  healthFraction() {
    const remain = this.core.hp + this.nodes.reduce((s, n) => s + Math.max(0, n.hp), 0);
    return clamp(remain / this.maxHp, 0, 1);
  }

  isDefeated() {
    return this.defeated;
  }

  // Flattened list the collision system can treat like regular enemies.
  damageableParts() {
    const parts = this.nodes.filter((n) => n.alive);
    if (this.core.damageable && this.core.alive) parts.push(this.core);
    return parts;
  }

  contactParts() {
    const parts = this.nodes.filter((n) => n.alive);
    if (this.core.alive) parts.push(this.core);
    return parts;
  }

  damagePart(part, dmg, particles, audio) {
    part.hp -= dmg;
    this._hitFlash = 0.08;
    if (part === this.core) {
      this.coreMat.emissiveIntensity = 1.6;
    }
    if (part.hp <= 0 && part.alive) {
      part.alive = false;
      if (part !== this.core) {
        part.mesh.visible = false;
        particles.burst(part.x, part.y, part.z, { r: 0.4, g: 1, b: 1 }, 30, { speed: 10, life: 0.8 });
        audio.explosion(0.7);
      } else {
        this._onCoreDestroyed(particles, audio);
      }
    }
  }

  _onCoreDestroyed(particles, audio) {
    this.defeated = true;
    this._deathTimer = 1.6;
    audio.explosion(2.2);
  }

  update(dt, player, scene, state, particles, audio) {
    this.age += dt;
    if (this._hitFlash > 0) {
      this._hitFlash -= dt;
      if (this._hitFlash <= 0) this.coreMat.emissiveIntensity = this.phase === 2 ? 0.9 : 0.5;
    }

    if (this.defeated) {
      this._deathTimer -= dt;
      this.group.scale.multiplyScalar(1 + dt * 0.6);
      this.coreMat.opacity = clamp(this._deathTimer / 1.6, 0, 1);
      if (Math.random() < 0.6) {
        particles.burst(
          this.x + randRange(-2, 2), this.y + randRange(-2, 2), this.z + randRange(-2, 2),
          { r: 1, g: 0.6 + Math.random() * 0.4, b: 0.3 }, 6, { speed: 8, life: 0.6 }
        );
      }
      return;
    }

    if (!this.arrived) {
      this.z += 22 * dt;
      if (this.z >= ENGAGE_Z) {
        this.z = ENGAGE_Z;
        this.arrived = true;
      }
    } else {
      this.phase = this.nodes.some((n) => n.alive) ? 1 : 2;
      this.core.damageable = this.phase === 2;
      this.shellMesh.visible = this.phase === 1;

      const driftSpeed = this.phase === 1 ? 0.5 : 0.9;
      this.x = Math.sin(this.age * driftSpeed) * 4.6;
      this.y = Math.cos(this.age * driftSpeed * 0.7) * 2.0;

      this._burstTimer -= dt;
      const burstInterval = this.phase === 1 ? 2.6 : 1.7;
      if (this._burstTimer <= 0) {
        this._burstTimer = burstInterval;
        this._radialBurst(scene, state, this.phase === 1 ? 10 : 16);
        audio.hit();
      }

      if (this.phase === 2) {
        this._spiralTimer -= dt;
        if (this._spiralTimer <= 0) {
          this._spiralTimer = 0.14;
          this._spiralAngle += 0.5;
          this._spiralShot(scene, state);
        }
        this._minionTimer -= dt;
        if (this._minionTimer <= 0) {
          this._minionTimer = randRange(5, 7.5);
          this._spawnMinions(scene, state);
        }
      } else {
        this._nodeFireTimer -= dt;
        if (this._nodeFireTimer <= 0 && player.alive) {
          this._nodeFireTimer = randRange(1.1, 1.8);
          const live = this.nodes.filter((n) => n.alive);
          if (live.length) {
            const n = live[(Math.random() * live.length) | 0];
            spawnEnemyBullet(scene, state, { x: n.x, y: n.y, z: n.z }, { x: player.x, y: player.y, z: player.mesh.position.z }, { speed: 44, color: 0x4dfaff, glow: '#4dfaff', damage: 1 });
          }
        }
      }
    }

    this.group.position.set(this.x, this.y, this.z);
    this.coreMesh.rotation.x += dt * 0.4;
    this.coreMesh.rotation.y += dt * 0.3;
    this.shellMesh.rotation.y -= dt * 0.5;

    this.orbitAngle += dt * (this.phase === 1 ? 0.6 : 1.1);
    for (const n of this.nodes) {
      if (!n.alive) continue;
      const a = n.angle + this.orbitAngle;
      const lx = Math.cos(a) * NODE_RADIUS_ORBIT;
      const ly = Math.sin(a) * NODE_RADIUS_ORBIT * 0.6;
      n.mesh.position.set(lx, ly, 0);
      n.mesh.rotation.x += dt;
      n.mesh.rotation.y += dt * 0.7;
      n.x = this.x + lx;
      n.y = this.y + ly;
      n.z = this.z;
    }
    this.core.x = this.x;
    this.core.y = this.y;
    this.core.z = this.z;
  }

  _radialBurst(scene, state, count) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const dx = Math.cos(angle), dy = Math.sin(angle) * 0.6;
      const dz = 0.75;
      const len = Math.hypot(dx, dy, dz);
      const target = { x: this.x + (dx / len) * 40, y: this.y + (dy / len) * 40, z: this.z + (dz / len) * 40 };
      spawnEnemyBullet(scene, state, { x: this.x, y: this.y, z: this.z + 1 }, target, { speed: 30, color: 0xff3df0, glow: '#ff3df0', damage: 1 });
    }
  }

  _spiralShot(scene, state) {
    for (let k = 0; k < 3; k++) {
      const angle = this._spiralAngle + (k * Math.PI * 2) / 3;
      const dx = Math.cos(angle), dy = Math.sin(angle) * 0.6, dz = 0.8;
      const len = Math.hypot(dx, dy, dz);
      const target = { x: this.x + (dx / len) * 40, y: this.y + (dy / len) * 40, z: this.z + (dz / len) * 40 };
      spawnEnemyBullet(scene, state, { x: this.x, y: this.y, z: this.z + 1 }, target, { speed: 34, color: 0xff4d5e, glow: '#ff4d5e', damage: 1 });
    }
  }

  _spawnMinions(scene, state) {
    const count = 1 + (Math.random() < 0.5 ? 1 : 0);
    for (let i = 0; i < count; i++) {
      const x = clamp(this.x + randRange(-4, 4), BOUNDS.xMin + 1, BOUNDS.xMax - 1);
      const y = clamp(this.y + randRange(-2, 2), BOUNDS.yMin + 1, BOUNDS.yMax - 1);
      const d = createDrone(scene, x, y);
      d.z = this.z - 6;
      d.approachSpeed = randRange(30, 36);
      state.enemies.push(d);
    }
  }

  dispose(scene) {
    scene.remove(this.group);
  }
}
