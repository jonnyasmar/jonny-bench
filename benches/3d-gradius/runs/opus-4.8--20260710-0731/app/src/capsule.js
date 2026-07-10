import * as THREE from 'three';
import { rand, TAU } from './util.js';

const GOLD = 0xffd166;
let shell = null, coreGeo = null;

export class Capsule {
  constructor(game, x, y) {
    this.game = game;
    if (!shell) {
      shell = new THREE.OctahedronGeometry(0.46, 0);
      coreGeo = new THREE.OctahedronGeometry(0.2, 0);
    }
    this.group = new THREE.Group();
    this.mesh = new THREE.Mesh(shell, new THREE.MeshBasicMaterial({ color: GOLD, wireframe: true }));
    this.core = new THREE.Mesh(coreGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    this.glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: game.fx.tex.glow, color: GOLD, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    this.glow.scale.setScalar(2.1);
    this.group.add(this.mesh, this.core, this.glow);
    this.group.position.set(x, y, 0);
    game.scene.add(this.group);

    this.vx = rand(-3.4, -2.2);
    this.vy = rand(-1.2, 1.2);
    this.t = rand(0, TAU);
    this.alive = true;
    this.r = 0.62;
    this.life = 14;
  }

  get pos() { return this.group.position; }

  update(dt, g) {
    this.t += dt;
    this.life -= dt;

    // Magnetise into the ship so a near-miss still reads as a pickup.
    const p = g.player;
    if (p.alive) {
      const dx = p.pos.x - this.pos.x, dy = p.pos.y - this.pos.y;
      const d = Math.hypot(dx, dy);
      if (d < 4.2) {
        const pull = (1 - d / 4.2) * 46 * dt;
        this.vx += (dx / (d || 1)) * pull;
        this.vy += (dy / (d || 1)) * pull;
      }
    }
    const drag = Math.exp(-1.2 * dt);
    this.vx *= drag; this.vy *= drag;
    if (this.vx > -1.6 && this.vx < 0) this.vx = -1.6;

    this.pos.x += this.vx * dt;
    this.pos.y += (this.vy + Math.sin(this.t * 2.4) * 0.8) * dt;

    this.mesh.rotation.y += dt * 2.4;
    this.mesh.rotation.x += dt * 1.3;
    this.core.rotation.y -= dt * 3.6;
    const pulse = 1 + Math.sin(this.t * 7) * 0.12;
    this.group.scale.setScalar(pulse);
    this.glow.material.opacity = 0.55 + Math.sin(this.t * 7) * 0.25;

    // Blink out its last couple of seconds instead of vanishing silently.
    if (this.life < 2.5) this.group.visible = Math.sin(this.life * 18) > -0.35;

    const b = g.bounds;
    if (this.life <= 0 || this.pos.x < -b.halfW - 2 || Math.abs(this.pos.y) > b.halfH + 2) this.destroy();
  }

  collect() {
    const g = this.game;
    g.fx.burst(this.pos.x, this.pos.y, 0, { count: 14, color: GOLD, speed: 9, size: 0.42, life: 0.42 });
    g.fx.ring(this.pos.x, this.pos.y, 0, GOLD, 2.3, 0.32);
    g.audio.capsule();
    this.destroy();
  }

  destroy() {
    if (!this.alive) return;
    this.alive = false;
    this.game.scene.remove(this.group);
    this.mesh.material.dispose();
    this.core.material.dispose();
    this.glow.material.dispose();
  }
}

export function spawnCapsule(game, x, y) {
  const c = new Capsule(game, x, y);
  game.capsules.push(c);
  return c;
}
