import * as THREE from "three";

/**
 * Particle pool + screen juice helpers.
 */
export class ParticleSystem {
  constructor(scene, max = 400) {
    this.scene = scene;
    this.pool = [];
    this.active = [];
    const geo = new THREE.SphereGeometry(0.08, 4, 4);
    for (let i = 0; i < max; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const m = new THREE.Mesh(geo, mat);
      m.visible = false;
      scene.add(m);
      this.pool.push({
        mesh: m,
        vel: new THREE.Vector3(),
        life: 0,
        maxLife: 1,
        drag: 0.96,
        gravity: 0,
        grow: 0,
      });
    }
  }

  burst(pos, color, count = 12, speed = 4, life = 0.5, size = 0.12) {
    for (let i = 0; i < count; i++) {
      const p = this.pool.pop();
      if (!p) break;
      p.mesh.visible = true;
      p.mesh.position.copy(pos);
      p.mesh.scale.setScalar(size * (0.6 + Math.random() * 0.8));
      p.mesh.material.color.set(color);
      p.mesh.material.opacity = 1;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.random() * Math.PI;
      const s = speed * (0.4 + Math.random() * 0.8);
      p.vel.set(
        Math.sin(ph) * Math.cos(th) * s,
        Math.sin(ph) * Math.sin(th) * s,
        Math.cos(ph) * s * 0.4
      );
      p.life = life * (0.7 + Math.random() * 0.5);
      p.maxLife = p.life;
      p.drag = 0.94 + Math.random() * 0.04;
      p.gravity = -1 + Math.random() * 2;
      p.grow = -0.4;
      this.active.push(p);
    }
  }

  streak(pos, dir, color, count = 6) {
    for (let i = 0; i < count; i++) {
      const p = this.pool.pop();
      if (!p) break;
      p.mesh.visible = true;
      p.mesh.position.copy(pos);
      p.mesh.scale.set(0.06, 0.06, 0.25);
      p.mesh.material.color.set(color);
      p.mesh.material.opacity = 1;
      p.vel.copy(dir).multiplyScalar(6 + Math.random() * 6);
      p.vel.x += (Math.random() - 0.5) * 2;
      p.vel.y += (Math.random() - 0.5) * 2;
      p.life = 0.2 + Math.random() * 0.15;
      p.maxLife = p.life;
      p.drag = 0.9;
      p.gravity = 0;
      p.grow = -1;
      this.active.push(p);
    }
  }

  update(dt) {
    for (let i = this.active.length - 1; i >= 0; i--) {
      const p = this.active[i];
      p.life -= dt;
      if (p.life <= 0) {
        p.mesh.visible = false;
        this.active.splice(i, 1);
        this.pool.push(p);
        continue;
      }
      p.vel.y += p.gravity * dt;
      p.vel.multiplyScalar(p.drag);
      p.mesh.position.addScaledVector(p.vel, dt);
      const t = p.life / p.maxLife;
      p.mesh.material.opacity = t;
      const s = p.mesh.scale.x + p.grow * dt;
      p.mesh.scale.setScalar(Math.max(0.01, s));
    }
  }
}

export class ScreenShake {
  constructor() {
    this.trauma = 0;
  }

  add(amount) {
    this.trauma = Math.min(1, this.trauma + amount);
  }

  update(dt, camera, basePos) {
    this.trauma = Math.max(0, this.trauma - dt * 1.8);
    const s = this.trauma * this.trauma;
    if (s < 0.001) {
      camera.position.x = basePos.x;
      camera.position.y = basePos.y;
      return;
    }
    camera.position.x = basePos.x + (Math.random() - 0.5) * 2 * s * 0.35;
    camera.position.y = basePos.y + (Math.random() - 0.5) * 2 * s * 0.25;
  }
}

export class Starfield {
  constructor(scene, count = 600) {
    this.group = new THREE.Group();
    scene.add(this.group);
    this.stars = [];
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c1 = new THREE.Color(0x3ef0ff);
    const c2 = new THREE.Color(0x9b5cff);
    const c3 = new THREE.Color(0xffffff);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 80;
      const y = (Math.random() - 0.5) * 50;
      const z = -Math.random() * 100 - 5;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      const c = Math.random() < 0.5 ? c1 : Math.random() < 0.5 ? c2 : c3;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      this.stars.push({
        baseZ: z,
        speed: 8 + Math.random() * 40,
        twinkle: Math.random() * Math.PI * 2,
      });
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    this.points = new THREE.Points(geo, mat);
    this.group.add(this.points);
    this.scrollMul = 1;
  }

  update(dt) {
    const pos = this.points.geometry.attributes.position;
    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      let z = pos.getZ(i) + s.speed * this.scrollMul * dt;
      if (z > 10) {
        z = -100 - Math.random() * 20;
        pos.setX(i, (Math.random() - 0.5) * 80);
        pos.setY(i, (Math.random() - 0.5) * 50);
      }
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
  }
}

export class NebulaBackdrop {
  constructor(scene) {
    this.meshes = [];
    const layers = [
      { z: -40, color: 0x1a0840, scale: 60, opacity: 0.35 },
      { z: -28, color: 0x0a2040, scale: 45, opacity: 0.25 },
      { z: -18, color: 0x200830, scale: 35, opacity: 0.2 },
    ];
    for (const L of layers) {
      const geo = new THREE.PlaneGeometry(L.scale * 1.6, L.scale, 1, 1);
      const mat = new THREE.MeshBasicMaterial({
        color: L.color,
        transparent: true,
        opacity: L.opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const m = new THREE.Mesh(geo, mat);
      m.position.z = L.z;
      scene.add(m);
      this.meshes.push({ mesh: m, baseZ: L.z, phase: Math.random() * 10 });
    }

    // Corridor rails — sell side-scroller depth
    this.rails = [];
    for (const side of [-1, 1]) {
      for (let i = 0; i < 8; i++) {
        const geo = new THREE.BoxGeometry(6, 0.06, 0.06);
        const mat = new THREE.MeshBasicMaterial({
          color: side > 0 ? 0x3ef0ff : 0x9b5cff,
          transparent: true,
          opacity: 0.18,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const m = new THREE.Mesh(geo, mat);
        m.position.set(i * 8 - 20, side * 7.2, -2);
        scene.add(m);
        this.rails.push({ mesh: m, speed: 12 });
      }
    }

    // Distant geometric structures (parallax columns)
    this.pillars = [];
    for (let i = 0; i < 12; i++) {
      const h = 4 + Math.random() * 12;
      const geo = new THREE.BoxGeometry(0.4 + Math.random() * 0.8, h, 0.4);
      const mat = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? 0x3ef0ff : 0x9b5cff,
        transparent: true,
        opacity: 0.08 + Math.random() * 0.08,
        wireframe: true,
      });
      const m = new THREE.Mesh(geo, mat);
      m.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 20,
        -30 - Math.random() * 40
      );
      scene.add(m);
      this.pillars.push({
        mesh: m,
        speed: 3 + Math.random() * 6,
        rot: (Math.random() - 0.5) * 0.4,
      });
    }
  }

  update(dt, t) {
    for (const L of this.meshes) {
      L.mesh.position.y = Math.sin(t * 0.15 + L.phase) * 1.5;
      L.mesh.material.opacity = 0.15 + Math.sin(t * 0.3 + L.phase) * 0.08;
    }
    for (const r of this.rails) {
      r.mesh.position.x -= r.speed * dt;
      if (r.mesh.position.x < -28) r.mesh.position.x += 64;
      r.mesh.material.opacity = 0.12 + Math.sin(t * 2 + r.mesh.position.x) * 0.05;
    }
    for (const p of this.pillars) {
      p.mesh.position.x -= p.speed * dt;
      p.mesh.rotation.y += p.rot * dt;
      if (p.mesh.position.x < -30) {
        p.mesh.position.x = 30;
        p.mesh.position.y = (Math.random() - 0.5) * 20;
        p.mesh.position.z = -30 - Math.random() * 40;
      }
    }
  }
}
