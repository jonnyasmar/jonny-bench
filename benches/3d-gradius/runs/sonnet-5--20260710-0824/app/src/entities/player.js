import * as THREE from 'three';

export const POWER_SLOTS = ['SPEED', 'MISSILE', 'DOUBLE', 'LASER', 'OPTION', 'SHIELD'];

const BASE_SPEED = 17;
const SPEED_STEP = 3.4;
const MAX_SPEED_LEVEL = 4;
const OPTION_DELAY = 0.32; // seconds between each option's position sample

function buildShipMesh() {
  const group = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xd8e6ff, metalness: 0.65, roughness: 0.28, emissive: 0x11213f, emissiveIntensity: 0.4 });
  const finMat = new THREE.MeshStandardMaterial({ color: 0xff4de0, metalness: 0.4, roughness: 0.35, emissive: 0xff2fae, emissiveIntensity: 0.9 });
  const canopyMat = new THREE.MeshStandardMaterial({ color: 0x4dfcff, metalness: 0.2, roughness: 0.1, emissive: 0x1fb8c4, emissiveIntensity: 1.1, transparent: true, opacity: 0.92 });
  const engineMat = new THREE.MeshBasicMaterial({ color: 0x4dfcff });

  // Fuselage: elongated octahedron-ish hull via a scaled cone + box
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.8, 6), bodyMat);
  nose.rotation.z = -Math.PI / 2;
  nose.position.set(0.95, 0, 0);
  group.add(nose);

  const hull = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.35, 1.9, 6), bodyMat);
  hull.rotation.z = Math.PI / 2;
  hull.position.set(-0.55, 0, 0);
  group.add(hull);

  const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 6, 0, Math.PI * 2, 0, Math.PI / 1.6), canopyMat);
  canopy.rotation.x = Math.PI;
  canopy.position.set(0.35, 0.28, 0);
  canopy.scale.set(1.3, 1, 0.8);
  group.add(canopy);

  // Delta wings (fins)
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0);
  wingShape.lineTo(-1.3, 0.15);
  wingShape.lineTo(-1.5, 1.35);
  wingShape.lineTo(-0.3, 0.35);
  wingShape.closePath();
  const wingGeo = new THREE.ExtrudeGeometry(wingShape, { depth: 0.08, bevelEnabled: false });
  wingGeo.translate(0, 0, -0.04);

  const wingR = new THREE.Mesh(wingGeo, finMat);
  wingR.position.set(0.1, -0.1, 0.55);
  wingR.rotation.y = -0.15;
  group.add(wingR);

  const wingL = wingR.clone();
  wingL.position.set(0.1, -0.1, -0.55);
  wingL.rotation.y = 0.15;
  wingL.scale.z = -1;
  group.add(wingL);

  // Engine nacelles at the rear
  const engineGeo = new THREE.CylinderGeometry(0.16, 0.2, 0.5, 8);
  engineGeo.rotateZ(Math.PI / 2);
  const eR = new THREE.Mesh(engineGeo, engineMat);
  eR.position.set(-1.35, -0.05, 0.32);
  group.add(eR);
  const eL = eR.clone();
  eL.position.set(-1.35, -0.05, -0.32);
  group.add(eL);

  group.rotation.y = -Math.PI / 2 + Math.PI; // orient nose toward +X (screen right-facing default)
  group.rotation.y = 0;
  group.scale.setScalar(0.9);

  const shieldGeo = new THREE.IcosahedronGeometry(1.5, 1);
  const shieldMat = new THREE.MeshBasicMaterial({ color: 0x4dfcff, transparent: true, opacity: 0.22, wireframe: true });
  const shield = new THREE.Mesh(shieldGeo, shieldMat);
  shield.visible = false;
  group.add(shield);

  return { group, shield, engines: [eR, eL] };
}

function buildOptionMesh() {
  const geo = new THREE.OctahedronGeometry(0.32, 0);
  const mat = new THREE.MeshStandardMaterial({ color: 0xffb84d, emissive: 0xff8a1f, emissiveIntensity: 1.2, metalness: 0.5, roughness: 0.3 });
  const mesh = new THREE.Mesh(geo, mat);
  return mesh;
}

export class Player {
  constructor(scene, particles, audio) {
    this.scene = scene;
    this.particles = particles;
    this.audio = audio;

    const { group, shield, engines } = buildShipMesh();
    this.mesh = group;
    this.shieldMesh = shield;
    this.engines = engines;
    scene.add(this.mesh);

    this.position = new THREE.Vector3(-14, 0, 0);
    this.velocity = new THREE.Vector2(0, 0);
    this.mesh.position.copy(this.position);

    this.radius = 0.85;
    this.alive = true;
    this.invulnTimer = 2.4;
    this.blinkTimer = 0;

    // weapon / power state
    this.speedLevel = 1;
    this.weaponMode = 'single'; // single | double | laser
    this.missile = false;
    this.optionCount = 0;
    this.shieldHits = 0;

    this.meterCount = 0; // capsules collected since last activation

    this.fireCooldown = 0;
    this.missileCooldown = 0;

    this.options = [];
    this.optionMeshes = [];
    this.history = []; // {x,y,t}
    this.historyTime = 0;
    this.maxHistory = 240;

    this.deathCallbacks = [];
  }

  get isInvulnerable() {
    return this.invulnTimer > 0;
  }

  applyCapsule() {
    this.meterCount++;
    this.audio.powerupCollect();
  }

  get highlightIndex() {
    return this.meterCount > 0 ? (this.meterCount - 1) % POWER_SLOTS.length : -1;
  }

  activatePower() {
    if (this.meterCount <= 0) return false;
    const slot = POWER_SLOTS[this.highlightIndex];
    switch (slot) {
      case 'SPEED':
        this.speedLevel = Math.min(MAX_SPEED_LEVEL, this.speedLevel + 1);
        break;
      case 'MISSILE':
        this.missile = true;
        break;
      case 'DOUBLE':
        this.weaponMode = 'double';
        break;
      case 'LASER':
        this.weaponMode = 'laser';
        break;
      case 'OPTION':
        if (this.optionCount < 2) {
          this.optionCount++;
          const mesh = buildOptionMesh();
          this.scene.add(mesh);
          this.optionMeshes.push(mesh);
        }
        break;
      case 'SHIELD':
        this.shieldHits = 3;
        break;
    }
    this.meterCount = 0;
    this.audio.powerActivate();
    return slot;
  }

  get moveSpeed() {
    return BASE_SPEED + (this.speedLevel - 1) * SPEED_STEP;
  }

  update(dt, input, bounds, gameTime) {
    if (!this.alive) return;

    this.invulnTimer = Math.max(0, this.invulnTimer - dt);
    this.blinkTimer += dt;

    // acceleration-based movement for weight/feel
    const accel = this.moveSpeed * 6.2;
    const damping = 9;
    let ax = 0, ay = 0;
    if (input.isDown('left')) ax -= 1;
    if (input.isDown('right')) ax += 1;
    if (input.isDown('up')) ay += 1;
    if (input.isDown('down')) ay -= 1;
    const len = Math.hypot(ax, ay) || 1;
    ax = (ax / len) * accel;
    ay = (ay / len) * accel;

    this.velocity.x += ax * dt;
    this.velocity.y += ay * dt;
    this.velocity.x -= this.velocity.x * Math.min(1, damping * dt);
    this.velocity.y -= this.velocity.y * Math.min(1, damping * dt);

    const speed = Math.hypot(this.velocity.x, this.velocity.y);
    if (speed > this.moveSpeed) {
      this.velocity.x = (this.velocity.x / speed) * this.moveSpeed;
      this.velocity.y = (this.velocity.y / speed) * this.moveSpeed;
    }

    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;

    const margin = 1.2;
    this.position.x = THREE.MathUtils.clamp(this.position.x, bounds.left + margin, bounds.right * 0.55);
    this.position.y = THREE.MathUtils.clamp(this.position.y, bounds.bottom + margin, bounds.top - margin);

    this.mesh.position.set(this.position.x, this.position.y, 0);
    this.mesh.rotation.z = THREE.MathUtils.clamp(-this.velocity.y * 0.035, -0.5, 0.5);
    this.mesh.rotation.y = THREE.MathUtils.clamp(this.velocity.x * 0.02, -0.3, 0.3);

    // invulnerability blink
    this.mesh.visible = !(this.isInvulnerable && Math.floor(this.blinkTimer * 14) % 2 === 0);

    // shield visuals
    this.shieldMesh.visible = this.shieldHits > 0;
    if (this.shieldHits > 0) {
      this.shieldMesh.rotation.y += dt * 1.4;
      this.shieldMesh.rotation.x += dt * 0.7;
    }

    // engine trail particles
    for (const e of this.engines) {
      const wp = new THREE.Vector3();
      e.getWorldPosition(wp);
      if (Math.random() < 0.9) {
        this.particles.trail(wp, { r: 0.4, g: 0.95, b: 1 }, 1.1, 0.28);
      }
    }

    // position history for options
    this.historyTime += dt;
    this.history.push({ x: this.position.x, y: this.position.y, t: gameTime });
    if (this.history.length > this.maxHistory) this.history.shift();

    for (let i = 0; i < this.optionMeshes.length; i++) {
      const delay = OPTION_DELAY * (i + 1);
      const sample = this._sampleHistory(gameTime - delay);
      const m = this.optionMeshes[i];
      m.position.set(sample.x, sample.y, 0);
      m.rotation.y += dt * 3;
      m.rotation.x += dt * 2;
    }
  }

  _sampleHistory(t) {
    if (this.history.length === 0) return { x: this.position.x, y: this.position.y };
    if (t <= this.history[0].t) return this.history[0];
    for (let i = this.history.length - 1; i >= 0; i--) {
      if (this.history[i].t <= t) {
        const a = this.history[i];
        const b = this.history[Math.min(i + 1, this.history.length - 1)];
        const span = b.t - a.t || 1;
        const f = THREE.MathUtils.clamp((t - a.t) / span, 0, 1);
        return { x: THREE.MathUtils.lerp(a.x, b.x, f), y: THREE.MathUtils.lerp(a.y, b.y, f) };
      }
    }
    return this.history[this.history.length - 1];
  }

  canFire() {
    return this.fireCooldown <= 0;
  }

  tickCooldowns(dt) {
    this.fireCooldown = Math.max(0, this.fireCooldown - dt);
    this.missileCooldown = Math.max(0, this.missileCooldown - dt);
  }

  hit(damage = 1) {
    if (this.isInvulnerable || !this.alive) return { absorbed: true, died: false };
    if (this.shieldHits > 0) {
      this.shieldHits -= damage;
      this.audio.shieldHit();
      this.invulnTimer = 0.4;
      if (this.shieldHits < 0) this.shieldHits = 0;
      return { absorbed: true, died: false };
    }
    this.die();
    return { absorbed: false, died: true };
  }

  die() {
    if (!this.alive) return;
    this.alive = false;
    this.audio.playerDeath();
    this.particles.burst(this.position, {
      color: new THREE.Color(0x9dfcff),
      color2: new THREE.Color(0xff4de0),
      count: 60,
      speed: 12,
      size: 2.2,
      life: 0.9,
      drag: 1.4,
    });
    this.mesh.visible = false;
    for (const cb of this.deathCallbacks) cb();
  }

  respawn(bounds) {
    this.alive = true;
    this.position.set(bounds.left + 8, 0, 0);
    this.velocity.set(0, 0);
    this.mesh.position.copy(this.position);
    this.mesh.visible = true;
    this.invulnTimer = 2.4;
    this.weaponMode = 'single';
    this.missile = false;
    this.shieldHits = 0;
    this.meterCount = 0;
    for (const m of this.optionMeshes) this.scene.remove(m);
    this.optionMeshes.length = 0;
    this.optionCount = 0;
  }

  reset(bounds) {
    this.speedLevel = 1;
    this.respawn(bounds);
  }
}
