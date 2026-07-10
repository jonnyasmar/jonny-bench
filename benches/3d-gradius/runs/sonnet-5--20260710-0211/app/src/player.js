import * as THREE from 'three';
import { clamp, damp } from './utils.js';
import { BOUNDS, PLAYER_Z } from './world.js';

const BASE_SPEED = 15.5;
const SPEED_PER_TIER = 4.2;
const HIT_RADIUS = 0.62;

export function buildShipMesh(color = 0x4dfaff, scale = 1) {
  const group = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x1a2436,
    emissive: color,
    emissiveIntensity: 0.35,
    metalness: 0.6,
    roughness: 0.35,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.9,
    metalness: 0.3,
    roughness: 0.2,
  });

  const fuselage = new THREE.Mesh(new THREE.ConeGeometry(0.42, 2.1, 6), bodyMat);
  fuselage.rotation.x = Math.PI / 2;
  group.add(fuselage);

  const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.26, 8, 6), accentMat);
  canopy.position.set(0, 0.18, 0.35);
  canopy.scale.set(1, 0.8, 1.4);
  group.add(canopy);

  const wingGeo = new THREE.BoxGeometry(1.5, 0.06, 0.6);
  const wingL = new THREE.Mesh(wingGeo, bodyMat);
  wingL.position.set(-0.85, -0.05, -0.15);
  wingL.rotation.z = 0.12;
  group.add(wingL);
  const wingR = wingL.clone();
  wingR.position.x = 0.85;
  wingR.rotation.z = -0.12;
  group.add(wingR);

  const finGeo = new THREE.ConeGeometry(0.08, 0.5, 4);
  const finL = new THREE.Mesh(finGeo, accentMat);
  finL.position.set(-0.85, 0.02, -0.15);
  finL.rotation.x = Math.PI / 2;
  group.add(finL);
  const finR = finL.clone();
  finR.position.x = 0.85;
  group.add(finR);

  const engineGeo = new THREE.CylinderGeometry(0.14, 0.18, 0.4, 8);
  const engineL = new THREE.Mesh(engineGeo, accentMat);
  engineL.rotation.x = Math.PI / 2;
  engineL.position.set(-0.32, -0.05, -0.95);
  group.add(engineL);
  const engineR = engineL.clone();
  engineR.position.x = 0.32;
  group.add(engineR);

  group.scale.setScalar(scale);
  group.userData.engines = [engineL, engineR];
  group.userData.accentMat = accentMat;
  return group;
}

export class Player {
  constructor(scene, particles, audio) {
    this.scene = scene;
    this.particles = particles;
    this.audio = audio;

    this.mesh = buildShipMesh(0x4dfaff);
    this.mesh.position.set(0, 0, PLAYER_Z);
    scene.add(this.mesh);

    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.speedTier = 0;
    this.alive = true;
    this.invulnTimer = 2.0;
    this.hitRadius = HIT_RADIUS;
    this._trailTimer = 0;
    this._flickerTimer = 0;
  }

  get speed() {
    return BASE_SPEED + this.speedTier * SPEED_PER_TIER;
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.mesh.position.set(0, 0, PLAYER_Z);
    this.mesh.rotation.set(0, 0, 0);
    this.mesh.visible = true;
    this.alive = true;
    this.invulnTimer = 2.0;
  }

  respawn() {
    this.x = 0;
    this.y = 0;
    this.invulnTimer = 2.5;
    this.alive = true;
    this.mesh.visible = true;
  }

  update(dt, input) {
    if (!this.alive) return;

    const targetVX = input.axisX * this.speed;
    const targetVY = input.axisY * this.speed;
    this.vx = damp(this.vx, targetVX, 10, dt);
    this.vy = damp(this.vy, targetVY, 10, dt);

    this.x = clamp(this.x + this.vx * dt, BOUNDS.xMin, BOUNDS.xMax);
    this.y = clamp(this.y + this.vy * dt, BOUNDS.yMin, BOUNDS.yMax);

    this.mesh.position.x = this.x;
    this.mesh.position.y = this.y;

    // Banking / pitch juice.
    const targetRoll = clamp(-this.vx * 0.045, -0.65, 0.65);
    const targetPitch = clamp(this.vy * 0.03, -0.4, 0.4);
    const targetYaw = clamp(-this.vx * 0.012, -0.2, 0.2);
    this.mesh.rotation.z = damp(this.mesh.rotation.z, targetRoll, 8, dt);
    this.mesh.rotation.x = damp(this.mesh.rotation.x, targetPitch, 8, dt);
    this.mesh.rotation.y = damp(this.mesh.rotation.y, targetYaw, 8, dt);

    // Engine trail.
    this._trailTimer -= dt;
    if (this._trailTimer <= 0) {
      this._trailTimer = 0.02;
      for (const eng of this.mesh.userData.engines) {
        const wp = new THREE.Vector3();
        eng.getWorldPosition(wp);
        this.particles.spawn({
          x: wp.x, y: wp.y, z: wp.z,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          vz: 6 + Math.random() * 2,
          life: 0.35,
          size: 0.9,
          r: 0.4, g: 0.9, b: 1,
          drag: 0.9,
        });
      }
    }

    // Invulnerability flicker after spawn/hit.
    if (this.invulnTimer > 0) {
      this.invulnTimer -= dt;
      this._flickerTimer += dt;
      this.mesh.visible = Math.floor(this._flickerTimer * 14) % 2 === 0;
    } else {
      this.mesh.visible = true;
    }
  }

  get invulnerable() {
    return this.invulnTimer > 0;
  }

  explode() {
    this.alive = false;
    this.mesh.visible = false;
    const c = { r: 1, g: 0.7, b: 0.3 };
    this.particles.burst(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z, c, 60, { speed: 14, life: 1.0, size: 2 });
    this.audio.explosion(1.4);
  }
}
