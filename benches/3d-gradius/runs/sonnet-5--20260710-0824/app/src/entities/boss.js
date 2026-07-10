import * as THREE from 'three';

const BOSS_DEFS = [
  {
    name: 'SENTINEL CORE',
    baseHp: 46,
    coreColor: 0x4dfcff,
    accentColor: 0x1560ff,
    scoreValue: 4000,
  },
  {
    name: 'HIVE MOTHER',
    baseHp: 60,
    coreColor: 0xff4de0,
    accentColor: 0x9a1fbb,
    scoreValue: 5200,
  },
  {
    name: 'LEVIATHAN PROW',
    baseHp: 78,
    coreColor: 0xffb84d,
    accentColor: 0xff3d3d,
    scoreValue: 7000,
  },
];

function buildBossMesh(def) {
  const group = new THREE.Group();
  const coreMat = new THREE.MeshStandardMaterial({
    color: def.coreColor, emissive: def.coreColor, emissiveIntensity: 0.8,
    metalness: 0.6, roughness: 0.25, flatShading: true,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: def.accentColor, emissive: def.accentColor, emissiveIntensity: 0.9,
    metalness: 0.5, roughness: 0.3, flatShading: true,
  });

  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(2.6, 1), coreMat);
  group.add(core);

  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.22, 8, 24), accentMat);
  ring1.rotation.x = Math.PI / 2.4;
  group.add(ring1);
  const ring2 = ring1.clone();
  ring2.rotation.x = -Math.PI / 2.4;
  ring2.rotation.y = Math.PI / 3;
  group.add(ring2);

  const spikes = [];
  for (let i = 0; i < 6; i++) {
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.55, 2.1, 5), accentMat);
    const ang = (i / 6) * Math.PI * 2;
    spike.position.set(Math.cos(ang) * 3.1, Math.sin(ang) * 3.1, 0);
    spike.rotation.z = ang - Math.PI / 2;
    group.add(spike);
    spikes.push(spike);
  }

  return { group, core, rings: [ring1, ring2], spikes };
}

export class Boss {
  constructor(scene, particles, bullets, audio, enemySystem) {
    this.scene = scene;
    this.particles = particles;
    this.bullets = bullets;
    this.audio = audio;
    this.enemySystem = enemySystem;
    this.alive = false;
    this.mesh = null;
  }

  spawn(index, bounds, hpMul = 1) {
    const def = BOSS_DEFS[index % BOSS_DEFS.length];
    this.def = def;
    this.defIndex = index % BOSS_DEFS.length;
    this.name = def.name;
    if (this.mesh) this.scene.remove(this.mesh);
    const built = buildBossMesh(def);
    this.mesh = built.group;
    this.parts = built;
    this.scene.add(this.mesh);

    this.maxHp = Math.round(def.baseHp * hpMul);
    this.hp = this.maxHp;
    this.radius = 2.9;
    this.holdX = bounds.right * 0.42;
    this.mesh.position.set(bounds.right + 10, 0, 0);
    this.state = 'entering';
    this.age = 0;
    this.attackTimer = 1.2;
    this.attackIndex = 0;
    this.telegraph = 0;
    this.laserActive = 0;
    this.laserY = 0;
    this.phaseBaseY = 0;
    this.alive = true;
    this.deathTriggered = false;
    this.hitFlash = 0;
    return this;
  }

  takeDamage(dmg) {
    if (!this.alive || this.state === 'entering') return false;
    this.hp -= dmg;
    this.hitFlash = 0.06;
    if (this.hp <= 0 && !this.deathTriggered) {
      this.deathTriggered = true;
      this.state = 'dying';
      this.age = 0;
      return true;
    }
    return false;
  }

  update(dt, ctx) {
    if (!this.alive) return;
    this.age += dt;
    const { bounds, player } = ctx;

    if (this.hitFlash > 0) {
      this.hitFlash -= dt;
      this.parts.core.material.emissiveIntensity = 2.4;
    } else {
      this.parts.core.material.emissiveIntensity = 0.8;
    }

    this.mesh.rotation.y += dt * 0.25;
    for (const r of this.parts.rings) r.rotation.z += dt * 0.6;
    for (const s of this.parts.spikes) s.rotation.x += dt * 1.2;

    if (this.state === 'entering') {
      this.mesh.position.x -= dt * 14;
      if (this.mesh.position.x <= this.holdX) {
        this.mesh.position.x = this.holdX;
        this.state = 'fighting';
      }
      return;
    }

    if (this.state === 'dying') {
      this._updateDeathSequence(dt);
      return;
    }

    // fighting: bob + drift toward player's Y slowly, run attack patterns
    this.phaseBaseY = THREE.MathUtils.lerp(this.phaseBaseY, player && player.alive ? THREE.MathUtils.clamp(player.position.y, -8, 8) * 0.5 : 0, dt * 0.25);
    this.mesh.position.y = this.phaseBaseY + Math.sin(this.age * 0.7) * 3;
    this.mesh.position.x = this.holdX + Math.sin(this.age * 0.35) * 1.5;

    this._runAttacks(dt, ctx);
  }

  _runAttacks(dt, ctx) {
    const { player } = ctx;
    this.attackTimer -= dt;
    if (this.laserActive > 0) {
      this.laserActive -= dt;
      if (player && player.alive && Math.abs(player.position.y - this.laserY) < 1.1 &&
          player.position.x < this.mesh.position.x) {
        player.hit(1);
      }
    }

    if (this.attackTimer <= 0) {
      const pattern = this.defIndex;
      if (pattern === 0) this._attackRadialBurst(ctx);
      else if (pattern === 1) this._attackSwarmSpawn(ctx);
      else this._attackLaserSweep(ctx);
      this.attackTimer = 2.1 - Math.min(0.9, this.age * 0.01);
    }
  }

  _attackRadialBurst(ctx) {
    const n = 10;
    const pos = this.mesh.position;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      this.bullets.spawn({
        position: pos,
        velocity: new THREE.Vector3(Math.cos(a) * 10, Math.sin(a) * 10, 0),
        owner: 'enemy', damage: 1, radius: 0.4, life: 6, type: 'enemyOrb',
      });
    }
    this.audio.shoot('enemy');
  }

  _attackSwarmSpawn(ctx) {
    const pos = this.mesh.position;
    const count = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      this.enemySystem.spawn('swarmer', {
        x: pos.x - 1, y: pos.y + (i - count / 2) * 1.6, speed: 11,
        amp: 2.5, freq: 2.2, fireDelay: 99,
        hpMul: ctx.scaling?.hpMul, scoreMul: ctx.scaling?.scoreMul,
      });
    }
    // also fire a spread toward player
    if (ctx.player && ctx.player.alive) {
      const dx = ctx.player.position.x - pos.x;
      const dy = ctx.player.position.y - pos.y;
      const base = Math.atan2(dy, dx);
      for (const off of [-0.3, 0, 0.3]) {
        const a = base + off;
        this.bullets.spawn({
          position: pos,
          velocity: new THREE.Vector3(Math.cos(a) * 13, Math.sin(a) * 13, 0),
          owner: 'enemy', damage: 1, radius: 0.35, life: 6, type: 'enemyOrb',
        });
      }
    }
    this.audio.shoot('enemy');
  }

  _attackLaserSweep(ctx) {
    if (ctx.player && ctx.player.alive) {
      this.laserY = ctx.player.position.y;
    }
    this.laserActive = 0.9;
    this.audio.bossAlarm();
  }

  _updateDeathSequence(dt) {
    if (this.age > 2.2) {
      this.alive = false;
      this.mesh.visible = false;
      return;
    }
    if (Math.random() < 0.55) {
      const p = this.mesh.position.clone();
      p.x += (Math.random() - 0.5) * 4;
      p.y += (Math.random() - 0.5) * 4;
      this.particles.burst(p, {
        color: new THREE.Color(this.def.coreColor),
        color2: new THREE.Color(0xffffff),
        count: 14, speed: 8, size: 2, life: 0.7, drag: 1.6,
      });
      this.audio.explosion(1.2);
    }
    this.mesh.rotation.z += dt * 2;
    this.mesh.scale.multiplyScalar(1 - dt * 0.15);
  }

  get scoreValue() {
    return this.def ? this.def.scoreValue : 1000;
  }

  remove() {
    if (this.mesh) this.mesh.visible = false;
    this.alive = false;
  }
}

export { BOSS_DEFS };
