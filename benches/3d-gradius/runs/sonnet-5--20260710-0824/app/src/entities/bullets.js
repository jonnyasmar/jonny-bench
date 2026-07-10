import * as THREE from 'three';
import { Pool } from '../engine/pool.js';

const geoBolt = new THREE.CapsuleGeometry(0.14, 0.5, 2, 6);
geoBolt.rotateZ(Math.PI / 2);
const geoOrb = new THREE.IcosahedronGeometry(0.22, 0);
const geoMissile = new THREE.ConeGeometry(0.16, 0.7, 6);
geoMissile.rotateZ(-Math.PI / 2);
const geoLaser = new THREE.BoxGeometry(3.4, 0.16, 0.16);

const matPlayerBolt = new THREE.MeshBasicMaterial({ color: 0x9dfcff });
const matPlayerLaser = new THREE.MeshBasicMaterial({ color: 0xff5ef0 });
const matMissile = new THREE.MeshBasicMaterial({ color: 0xffb84d });
const matEnemyOrb = new THREE.MeshBasicMaterial({ color: 0xff3355 });
const matEnemyBig = new THREE.MeshBasicMaterial({ color: 0xff9933 });

export class BulletSystem {
  constructor(scene, particles) {
    this.scene = scene;
    this.particles = particles;
    this.group = new THREE.Group();
    scene.add(this.group);

    this.pool = new Pool(
      () => {
        const mesh = new THREE.Mesh(geoBolt, matPlayerBolt);
        mesh.visible = false;
        this.group.add(mesh);
        return { mesh, vel: new THREE.Vector3(), alive: false };
      },
      (obj, opts) => this._reset(obj, opts)
    );
  }

  _reset(obj, opts) {
    const { position, velocity, owner, damage, radius, life, type, pierce = 0 } = opts;
    obj.mesh.position.copy(position);
    obj.vel.copy(velocity);
    obj.owner = owner;
    obj.damage = damage;
    obj.radius = radius;
    obj.life = life;
    obj.type = type;
    obj.pierce = pierce;
    obj.hitSet = obj.hitSet || new Set();
    obj.hitSet.clear();
    obj.mesh.visible = true;

    let geo, mat, scale = 1;
    switch (type) {
      case 'laser': geo = geoLaser; mat = matPlayerLaser; scale = 1; break;
      case 'missile': geo = geoMissile; mat = matMissile; scale = 1; break;
      case 'enemyOrb': geo = geoOrb; mat = matEnemyOrb; scale = 0.9; break;
      case 'enemyBig': geo = geoOrb; mat = matEnemyBig; scale = 1.6; break;
      default: geo = geoBolt; mat = matPlayerBolt; scale = 1; break;
    }
    if (obj.mesh.geometry !== geo) obj.mesh.geometry = geo;
    if (obj.mesh.material !== mat) obj.mesh.material = mat;
    obj.mesh.scale.setScalar(scale);
    obj.mesh.rotation.z = 0;
    if (velocity.x !== 0 || velocity.y !== 0) {
      obj.mesh.rotation.z = Math.atan2(velocity.y, velocity.x);
    }
  }

  spawn(opts) {
    return this.pool.spawn(opts);
  }

  update(dt, bounds, onExpire) {
    this.pool.update(dt, (b) => {
      if (b.type === 'missile') {
        b.vel.y -= 9 * dt; // gentle gravity arc toward the terrain
        b.mesh.rotation.z = Math.atan2(b.vel.y, b.vel.x);
      }
      b.mesh.position.x += b.vel.x * dt;
      b.mesh.position.y += b.vel.y * dt;
      b.mesh.position.z += b.vel.z * dt;
      b.life -= dt;

      if (this.particles && (b.type === 'missile' || b.type === 'laser')) {
        this.particles.trail(b.mesh.position, b.type === 'laser' ? { r: 1, g: 0.4, b: 0.94 } : { r: 1, g: 0.7, b: 0.3 }, 0.8, 0.2);
      }

      const out =
        b.life <= 0 ||
        b.mesh.position.x < bounds.left - 4 ||
        b.mesh.position.x > bounds.right + 4 ||
        b.mesh.position.y < bounds.bottom - 4 ||
        b.mesh.position.y > bounds.top + 4;

      if (out) {
        b.mesh.visible = false;
        if (onExpire) onExpire(b);
        return false;
      }
      return true;
    });
  }

  kill(b) {
    b.alive = false;
    b.mesh.visible = false;
  }

  get active() {
    return this.pool.active;
  }

  clear() {
    this.pool.killAll();
  }
}
