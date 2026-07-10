import * as THREE from 'three';
import { Pool } from '../engine/pool.js';

const geoCapsule = new THREE.OctahedronGeometry(0.62, 0);
const geoLife = new THREE.TetrahedronGeometry(0.6, 0);

const matCapsule = new THREE.MeshStandardMaterial({
  color: 0x4dfcff,
  emissive: 0x2ad8dd,
  emissiveIntensity: 1.1,
  roughness: 0.25,
  metalness: 0.4,
});
const matLife = new THREE.MeshStandardMaterial({
  color: 0xffd24d,
  emissive: 0xffb020,
  emissiveIntensity: 1.2,
  roughness: 0.2,
  metalness: 0.3,
});

export class PowerupSystem {
  constructor(scene) {
    this.group = new THREE.Group();
    scene.add(this.group);
    this.pool = new Pool(
      () => {
        const mesh = new THREE.Mesh(geoCapsule, matCapsule);
        mesh.visible = false;
        this.group.add(mesh);
        return { mesh, vel: new THREE.Vector3(), alive: false };
      },
      (obj, opts) => this._reset(obj, opts)
    );
  }

  _reset(obj, { position, velocity, kind = 'capsule' }) {
    obj.mesh.position.copy(position);
    obj.vel.copy(velocity);
    obj.kind = kind;
    obj.mesh.geometry = kind === 'life' ? geoLife : geoCapsule;
    obj.mesh.material = kind === 'life' ? matLife : matCapsule;
    obj.mesh.visible = true;
    obj.mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    obj.spin = 1.4 + Math.random() * 0.8;
    obj.bobPhase = Math.random() * Math.PI * 2;
    obj.baseY = position.y;
    obj.age = 0;
    obj.radius = 0.9;
  }

  spawn(opts) {
    return this.pool.spawn(opts);
  }

  update(dt, bounds) {
    this.pool.update(dt, (p) => {
      p.age += dt;
      p.mesh.position.x += p.vel.x * dt;
      p.baseY += p.vel.y * dt;
      p.mesh.position.y = p.baseY + Math.sin(p.age * 2.2 + p.bobPhase) * 0.35;
      p.mesh.rotation.x += p.spin * dt;
      p.mesh.rotation.y += p.spin * 0.7 * dt;
      const out = p.mesh.position.x < bounds.left - 4 || p.age > 14;
      if (out) {
        p.mesh.visible = false;
        return false;
      }
      return true;
    });
  }

  kill(p) {
    p.alive = false;
    p.mesh.visible = false;
  }

  get active() {
    return this.pool.active;
  }

  clear() {
    this.pool.killAll();
  }
}
