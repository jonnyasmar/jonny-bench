import * as THREE from 'three';
import { COLORS, CONFIG, bounds } from './config.js';
import { clamp, damp, lerp } from './utils.js';
import { buildPlayer, buildFlame, buildOption } from './models.js';
import { Audio } from './audio.js';

export class Player {
  constructor(scene, projectiles, particles) {
    this.scene = scene;
    this.proj = projectiles;
    this.particles = particles;

    this.group = new THREE.Group();
    this.ship = buildPlayer();
    this.flame = buildFlame();
    this.ship.add(this.flame);
    this.group.add(this.ship);

    // shield bubble
    this.shieldMesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.9, 1),
      new THREE.MeshBasicMaterial({ color: COLORS.shield, wireframe: true, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    this.group.add(this.shieldMesh);
    scene.add(this.group);

    this.options = [];
    this.history = [];
    this.reset(true);
  }

  reset(full) {
    this.x = bounds.left + 6;
    this.y = 0;
    this.vx = 0; this.vy = 0;
    this.alive = true;
    this.invuln = CONFIG.invulnTime;
    this.fireCd = 0;
    this.missileCd = 0;
    this.blink = 0;
    this.history.length = 0;
    if (full) {
      this.speedLevel = 0;
      this.hasDouble = false;
      this.hasLaser = false;
      this.hasMissile = false;
      this.shieldHits = 0;
      this._setOptions(0);
    } else {
      // death penalty: keep speed & weapon, lose options + shield
      this.shieldHits = 0;
      this._setOptions(0);
      this.speedLevel = Math.max(0, this.speedLevel - 1);
    }
    this.group.position.set(this.x, this.y, 0);
    this.group.visible = true;
  }

  get speed() { return CONFIG.baseSpeed + this.speedLevel * CONFIG.speedStep; }

  _setOptions(n) {
    n = clamp(n, 0, CONFIG.maxOptions);
    while (this.options.length < n) {
      const o = buildOption();
      this.scene.add(o);
      this.options.push(o);
    }
    while (this.options.length > n) {
      const o = this.options.pop();
      this.scene.remove(o);
    }
  }

  addOption() { if (this.options.length < CONFIG.maxOptions) { this._setOptions(this.options.length + 1); return true; } return false; }

  update(dt, input, aimPointer) {
    if (!this.alive) return;

    // --- movement ---
    let ax = input.axis.x, ay = input.axis.y;
    if (input.usingPointer && aimPointer && aimPointer.active) {
      // steer toward pointer target in world space
      const dx = aimPointer.wx - this.x, dy = aimPointer.wy - this.y;
      const d = Math.hypot(dx, dy);
      if (d > 0.4) { ax = clamp(dx / 4, -1, 1); ay = clamp(dy / 4, -1, 1); }
      else { ax = 0; ay = 0; }
    }
    const tvx = ax * this.speed;
    const tvy = ay * this.speed;
    this.vx = damp(this.vx, tvx, 18, dt);
    this.vy = damp(this.vy, tvy, 18, dt);
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.x = clamp(this.x, bounds.left + CONFIG.playMarginX, bounds.right - CONFIG.playMarginX);
    this.y = clamp(this.y, bounds.bottom + CONFIG.playMarginBottom, bounds.top - CONFIG.playMarginTop);
    this.group.position.set(this.x, this.y, 0);

    // --- banking / juice ---
    const vyN = clamp(this.vy / this.speed, -1, 1);
    const vxN = clamp(this.vx / this.speed, -1, 1);
    this.ship.rotation.x = lerp(this.ship.rotation.x, -vyN * 0.6, 0.2);
    this.ship.rotation.z = lerp(this.ship.rotation.z, vyN * 0.35, 0.2);
    this.ship.rotation.y = lerp(this.ship.rotation.y, -vxN * 0.18, 0.2);

    // engine flame flicker + engine trail particles
    const fl = 0.7 + Math.random() * 0.6 + Math.max(0, vxN) * 0.4;
    this.flame.scale.set(fl, 1, 1);
    this.flame.material.opacity = 0.6 + Math.random() * 0.35;
    if (Math.random() < 0.7) {
      this.particles.emit(this.x - 1.9, this.y, 0, {
        color: COLORS.engine, speed: 5, vx: -8, ttl: 0.28, size: 3, drag: 3, angle: Math.PI,
      });
    }

    // --- history for options ---
    this.history.unshift({ x: this.x, y: this.y });
    if (this.history.length > 260) this.history.pop();
    this.options.forEach((o, i) => {
      const h = this.history[Math.min(this.history.length - 1, (i + 1) * CONFIG.optionTrailGap)];
      if (h) o.position.set(h.x, h.y, 0);
      o.rotation.y += dt * 3; o.rotation.x += dt * 2;
      if (o.userData.shell) o.userData.shell.rotation.z += dt * 4;
    });

    // --- shield visual ---
    if (this.shieldHits > 0) {
      this.shieldMesh.material.opacity = lerp(this.shieldMesh.material.opacity, 0.18 + 0.12 * this.shieldHits, 0.2);
      this.shieldMesh.rotation.y += dt * 1.6;
      this.shieldMesh.rotation.x += dt * 0.9;
      const p = 1 + Math.sin(performance.now() * 0.008) * 0.05;
      this.shieldMesh.scale.setScalar(p);
    } else {
      this.shieldMesh.material.opacity = lerp(this.shieldMesh.material.opacity, 0, 0.3);
    }

    // --- invulnerability blink ---
    if (this.invuln > 0) {
      this.invuln -= dt;
      this.blink += dt * 22;
      this.ship.visible = Math.sin(this.blink) > -0.3;
    } else {
      this.ship.visible = true;
    }

    // --- firing ---
    this.fireCd -= dt;
    this.missileCd -= dt;
    if (input.fire && this.fireCd <= 0) {
      this._fireVolley();
      this.fireCd = this.hasLaser ? 0.2 : CONFIG.fireRate;
    }
    if (input.fire && this.hasMissile && this.missileCd <= 0) {
      this._fireMissiles();
      this.missileCd = 0.6;
    }
  }

  _origins() {
    const list = [{ x: this.x + 1.5, y: this.y }];
    for (const o of this.options) list.push({ x: o.position.x + 1.2, y: o.position.y });
    return list;
  }

  _fireVolley() {
    const origins = this._origins();
    for (const o of origins) {
      if (this.hasLaser) {
        this.proj.fire('laser', o.x + 2, o.y);
      } else {
        this.proj.fire('normal', o.x, o.y);
        if (this.hasDouble) this.proj.fire('normal', o.x, o.y, { vx: CONFIG.bulletSpeed * 0.86, vy: CONFIG.bulletSpeed * 0.6 });
      }
    }
    // muzzle flash
    this.particles.emit(this.x + 1.7, this.y, 0, { color: COLORS.bullet, speed: 3, ttl: 0.12, size: 4, vx: 10 });
    if (this.hasLaser) Audio.laser(); else Audio.shoot();
  }

  _fireMissiles() {
    const origins = this._origins();
    for (const o of origins) this.proj.fire('missile', o.x - 1.2, o.y - 0.4);
    Audio.missile();
  }

  // Returns 'dead' | 'shield' | 'safe'
  hit() {
    if (!this.alive || this.invuln > 0) return 'safe';
    if (this.shieldHits > 0) {
      this.shieldHits--;
      Audio.shieldHit();
      this.particles.burst(this.x, this.y, 0, 14, { color: COLORS.shield, speed: 12, ttl: 0.4, size: 4 });
      return 'shield';
    }
    return 'dead';
  }

  explode() {
    this.alive = false;
    this.group.visible = false;
    this._setOptions(0);
    Audio.playerDie();
    for (let i = 0; i < 3; i++) {
      this.particles.burst(this.x, this.y, 0, 24, { color: i === 0 ? COLORS.player : COLORS.engine, speed: 18 - i * 4, ttl: 0.9, size: 6 - i, drag: 1.6 });
    }
  }

  // Apply a power-up selection. Returns a label to flash, or null if maxed.
  applyPower(slot) {
    switch (slot) {
      case 'SPEED':
        if (this.speedLevel >= CONFIG.maxSpeedLevels) return null;
        this.speedLevel++; return 'SPEED UP';
      case 'MISSILE':
        if (this.hasMissile) return null;
        this.hasMissile = true; return 'MISSILE';
      case 'DOUBLE':
        if (this.hasDouble && !this.hasLaser) return null;
        this.hasDouble = true; this.hasLaser = false; return 'DOUBLE';
      case 'LASER':
        if (this.hasLaser && !this.hasDouble) return null;
        this.hasLaser = true; this.hasDouble = false; return 'LASER';
      case 'OPTION':
        return this.addOption() ? 'OPTION' : null;
      case 'SHIELD':
        if (this.shieldHits >= 4) return null;
        this.shieldHits = Math.min(4, this.shieldHits + 3); return 'FORCE FIELD';
    }
    return null;
  }

  // which slots are currently "owned/maxed" for meter highlighting
  owned() {
    return [
      this.speedLevel >= CONFIG.maxSpeedLevels,
      this.hasMissile,
      this.hasDouble,
      this.hasLaser,
      this.options.length >= CONFIG.maxOptions,
      this.shieldHits > 0,
    ];
  }

  get radius() { return 0.9; }
}
