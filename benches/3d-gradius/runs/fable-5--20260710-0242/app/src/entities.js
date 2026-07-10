import * as THREE from 'three';
import { PAL, TUNE } from './config.js';
import { glowTexture } from './fx.js';
import { rand, TAU, clamp, damp, hit, pick } from './util.js';

// ---------------------------------------------------------------------------
// Shared builders

export function makeGlowSprite(color, sx = 1, sy = sx, opacity = 1) {
  const mat = new THREE.SpriteMaterial({
    map: glowTexture(), color, transparent: true, opacity,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const s = new THREE.Sprite(mat);
  s.scale.set(sx, sy, 1);
  return s;
}

export function explode(G, x, y, { size = 1, color = 0xffaa66, ring = true } = {}) {
  G.particles.burst(x, y, 0.2, {
    count: Math.round(16 * size + 8), color: 0xffffff,
    speed: 7 * size, size: 0.5 * size, life: 0.35, drag: 4,
  });
  G.particles.burst(x, y, 0.2, {
    count: Math.round(26 * size + 10), color,
    speed: 9 * size, size: 0.42 * size, life: 0.8, drag: 2.5,
  });
  G.particles.burst(x, y, 0.2, {
    count: Math.round(10 * size), color: 0xff5533,
    speed: 4 * size, size: 0.6 * size, life: 1.0, drag: 1.5, grav: 2,
  });
  if (ring) G.shocks.spawn(x, y, 0.3, color, 1.6 + size * 1.8, 0.4 + size * 0.12);
  G.shake.add(0.1 + size * 0.12);
  G.audio.boom(size);
}

// ---------------------------------------------------------------------------
// Player bullets

const shotGeo = new THREE.BoxGeometry(0.6, 0.13, 0.13);
const shotMat = new THREE.MeshBasicMaterial({ color: PAL.pbullet });
const pulseCoreGeo = new THREE.BoxGeometry(1.35, 0.34, 0.1);
const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

export function spawnPlayerBullet(G, x, y, kind, ang = 0, dmgScale = 1) {
  let mesh, spd, r, dmg, pierce = false;
  if (kind === 'pulse') {
    mesh = new THREE.Mesh(pulseCoreGeo, pulseMat);
    mesh.add(makeGlowSprite(PAL.pulse, 2.6, 1.3, 0.9));
    spd = 22; r = 0.5; dmg = 2.4 * dmgScale; pierce = true;
  } else {
    mesh = new THREE.Mesh(shotGeo, shotMat);
    mesh.add(makeGlowSprite(PAL.pbullet, 1.0, 0.55, 0.85));
    spd = 30; r = 0.24; dmg = 1 * dmgScale;
  }
  mesh.position.set(x, y, 0.1);
  mesh.rotation.z = ang;
  G.scene.add(mesh);
  G.pbullets.push({
    mesh, x, y, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
    r, dmg, pierce, hitSet: pierce ? new Set() : null, dead: false,
  });
}

// ---------------------------------------------------------------------------
// Enemy bullets

export function spawnEnemyBullet(G, x, y, vx, vy, hot = false) {
  if (G.ebullets.length > 220) return;
  const s = makeGlowSprite(hot ? PAL.ebulletHot : PAL.ebullet, hot ? 0.85 : 0.7);
  const core = makeGlowSprite(0xffffff, 0.26);
  s.add(core);
  s.position.set(x, y, 0.15);
  G.scene.add(s);
  G.ebullets.push({ mesh: s, x, y, vx, vy, r: 0.16, life: 9, dead: false });
}

export function aimAtPlayer(G, x, y, speed, spread = 0) {
  const p = G.player;
  const a = Math.atan2(p.y - y, p.x - x) + spread;
  return { vx: Math.cos(a) * speed, vy: Math.sin(a) * speed };
}

// ---------------------------------------------------------------------------
// Shards (power pickups)

const shardGeo = new THREE.OctahedronGeometry(0.26, 0);
const shardMat = new THREE.MeshStandardMaterial({
  color: PAL.shard, emissive: PAL.shard, emissiveIntensity: 0.9,
  roughness: 0.2, metalness: 0.5, flatShading: true,
});

export function spawnShard(G, x, y) {
  const mesh = new THREE.Mesh(shardGeo, shardMat);
  mesh.add(makeGlowSprite(PAL.shard, 1.5, 1.5, 0.55));
  mesh.position.set(x, y, 0.1);
  G.scene.add(mesh);
  G.pickups.push({ mesh, x, y, vx: -1.4, t: rand(TAU), dead: false });
}

// ---------------------------------------------------------------------------
// Player

function buildShip() {
  const g = new THREE.Group();
  const hullMat = new THREE.MeshStandardMaterial({
    color: PAL.hull, roughness: 0.32, metalness: 0.45, flatShading: true,
  });
  const darkMat = new THREE.MeshStandardMaterial({
    color: PAL.hullDark, roughness: 0.4, metalness: 0.6, flatShading: true,
  });

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.32, 1.9, 5), hullMat);
  nose.geometry.rotateZ(-Math.PI / 2);
  nose.position.x = 0.25;
  g.add(nose);

  const tailBlock = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.3, 0.55, 5), darkMat);
  tailBlock.geometry.rotateZ(-Math.PI / 2);
  tailBlock.position.x = -0.85;
  g.add(tailBlock);

  const canopy = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 8, 6),
    new THREE.MeshStandardMaterial({
      color: PAL.canopy, emissive: PAL.canopy, emissiveIntensity: 1.6, roughness: 0.1,
    })
  );
  canopy.scale.set(2.0, 1, 1);
  canopy.position.set(0.3, 0.2, 0);
  g.add(canopy);

  // Delta wings (lie in the XZ plane).
  const ws = new THREE.Shape();
  ws.moveTo(1.15, 0);
  ws.lineTo(-0.55, 1.05);
  ws.lineTo(-0.85, 0.5);
  ws.lineTo(-0.55, 0.1);
  ws.lineTo(-0.55, -0.1);
  ws.lineTo(-0.85, -0.5);
  ws.lineTo(-0.55, -1.05);
  ws.closePath();
  const wingGeo = new THREE.ExtrudeGeometry(ws, { depth: 0.1, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.04, bevelSegments: 1 });
  wingGeo.rotateX(Math.PI / 2);
  const wings = new THREE.Mesh(wingGeo, darkMat);
  wings.position.set(-0.3, -0.02, 0);
  g.add(wings);

  // Wingtip lights
  for (const zs of [-1, 1]) {
    const tip = makeGlowSprite(PAL.engine, 0.4, 0.4, 0.9);
    tip.position.set(-0.82, 0.02, zs * 1.0);
    g.add(tip);
  }

  // Tail fin (vertical, XY plane)
  const fs = new THREE.Shape();
  fs.moveTo(-0.25, 0.12);
  fs.lineTo(-1.0, 0.85);
  fs.lineTo(-1.05, 0.12);
  fs.closePath();
  const finGeo = new THREE.ExtrudeGeometry(fs, { depth: 0.06, bevelEnabled: false });
  const fin = new THREE.Mesh(finGeo, hullMat);
  fin.position.z = -0.03;
  g.add(fin);

  const stripe = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.06, 0.36),
    new THREE.MeshStandardMaterial({ color: PAL.engine, emissive: PAL.engine, emissiveIntensity: 1.4 })
  );
  stripe.position.set(-0.15, -0.14, 0);
  g.add(stripe);

  const engine = makeGlowSprite(PAL.engine, 1.3, 0.8, 0.95);
  engine.position.set(-1.35, 0, 0);
  g.add(engine);

  const light = new THREE.PointLight(PAL.engine, 3, 7);
  light.position.set(-1.2, 0, 0.6);
  g.add(light);

  return { group: g, engine, light };
}

export class Player {
  constructor(G) {
    this.G = G;
    const { group, engine, light } = buildShip();
    this.mesh = group;
    this.engine = engine;
    this.light = light;
    G.scene.add(group);

    const shieldMat = new THREE.MeshBasicMaterial({
      color: PAL.shieldCol, transparent: true, opacity: 0.22,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    });
    this.shieldMesh = new THREE.Mesh(new THREE.SphereGeometry(1.25, 20, 14), shieldMat);
    this.shieldMesh.visible = false;
    G.scene.add(this.shieldMesh);

    this.drones = [];
    this.hist = [];
    this.reset();
  }

  reset() {
    this.x = -10; this.y = 0; this.vx = 0; this.vy = 0;
    this.alive = true;
    this.inv = TUNE.respawnInvuln;
    this.respawnT = 0;
    this.fireCd = 0;
    this.speedLvl = 0;
    this.weapon = 'basic';
    this.shieldHp = 0;
    this.hist.length = 0;
    for (const d of this.drones) this.G.scene.remove(d.mesh);
    this.drones = [];
    this.mesh.visible = true;
    this.mesh.position.set(this.x, this.y, 0);
  }

  addDrone() {
    const mesh = new THREE.Mesh(
      new THREE.TetrahedronGeometry(0.32, 0),
      new THREE.MeshStandardMaterial({
        color: PAL.droneCol, emissive: PAL.droneCol, emissiveIntensity: 1.1,
        roughness: 0.2, metalness: 0.4, flatShading: true,
      })
    );
    mesh.add(makeGlowSprite(PAL.droneCol, 1.1, 1.1, 0.5));
    mesh.position.set(this.x - 1.5, this.y, 0);
    this.G.scene.add(mesh);
    this.drones.push({ mesh, x: this.x - 1.5, y: this.y });
  }

  currentSpeed() {
    return TUNE.playerSpeedBase + this.speedLvl * TUNE.playerSpeedStep;
  }

  update(dt, G) {
    if (!this.alive) {
      this.respawnT -= dt;
      if (this.respawnT <= 0 && G.lives >= 0) this._respawn(G);
      return;
    }

    // --- steering
    const inp = G.input;
    let dx = (inp.down('right') ? 1 : 0) - (inp.down('left') ? 1 : 0);
    let dy = (inp.down('up') ? 1 : 0) - (inp.down('down') ? 1 : 0);
    const len = Math.hypot(dx, dy) || 1;
    const sp = this.currentSpeed();
    this.vx = damp(this.vx, (dx / len) * sp, 11, dt);
    this.vy = damp(this.vy, (dy / len) * sp, 11, dt);
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if (inp.touch.active) {
      this.x += inp.touch.dx * G.worldPerPx;
      this.y -= inp.touch.dy * G.worldPerPx;
    }

    const b = G.bounds;
    this.x = clamp(this.x, b.x0 + 1.0, b.x1 - 1.6);
    this.y = clamp(this.y, b.y0 + 0.7, b.y1 - 0.7);

    this.mesh.position.set(this.x, this.y, 0);
    this.mesh.rotation.x = damp(this.mesh.rotation.x, -this.vy * 0.055, 10, dt);
    this.mesh.rotation.z = damp(this.mesh.rotation.z, this.vy * 0.022, 10, dt);

    // --- invulnerability blink
    if (this.inv > 0) {
      this.inv -= dt;
      this.mesh.visible = Math.sin(G.time * 30) > -0.4;
      if (this.inv <= 0) this.mesh.visible = true;
    }

    // --- engine flame
    const thrust = 1 + Math.abs(this.vx) * 0.03;
    this.engine.scale.set((1.1 + rand(0.5)) * thrust, 0.7 + rand(0.25), 1);
    this.light.intensity = 2.4 + rand(1.4);
    if (Math.random() < 0.8) {
      G.particles.spawn(
        this.x - 1.4, this.y + rand(-0.1, 0.1), 0,
        -8 + rand(-2, 2), rand(-0.8, 0.8), 0,
        PAL.engine, 0.34, 0.35, 3, 0
      );
    }

    // --- position history for drones
    this.hist.push({ t: G.time, x: this.x, y: this.y });
    while (this.hist.length > 200) this.hist.shift();
    this.drones.forEach((d, i) => {
      const target = this._sampleHist(G.time - 0.33 * (i + 1));
      d.x = damp(d.x, target.x - 1.2, 14, dt);
      d.y = damp(d.y, target.y, 14, dt);
      d.mesh.position.set(d.x, d.y, 0);
      d.mesh.rotation.x += dt * 5;
      d.mesh.rotation.y += dt * 7;
    });

    // --- shield visuals
    this.shieldMesh.visible = this.shieldHp > 0;
    if (this.shieldHp > 0) {
      this.shieldMesh.position.set(this.x, this.y, 0);
      const k = 0.75 + this.shieldHp * 0.12 + Math.sin(G.time * 6) * 0.04;
      this.shieldMesh.scale.set(k, k, k);
      this.shieldMesh.material.opacity = 0.1 + this.shieldHp * 0.06 + Math.sin(G.time * 6) * 0.03;
    }

    // --- firing
    this.fireCd -= dt;
    if (inp.down('fire') && this.fireCd <= 0) {
      this._shoot(G);
      this.fireCd = this.weapon === 'pulse' ? 0.24 : TUNE.fireInterval;
    }
  }

  _sampleHist(t) {
    const h = this.hist;
    for (let i = 0; i < h.length; i++) if (h[i].t >= t) return h[i];
    return h.length ? h[h.length - 1] : { x: this.x, y: this.y };
  }

  _shoot(G) {
    const emitFrom = (x, y, scale) => {
      if (this.weapon === 'twin') {
        spawnPlayerBullet(G, x + 1.1, y + 0.26, 'shot', 0, scale);
        spawnPlayerBullet(G, x + 1.1, y - 0.26, 'shot', 0, scale);
      } else if (this.weapon === 'pulse') {
        spawnPlayerBullet(G, x + 1.2, y, 'pulse', 0, scale);
      } else {
        spawnPlayerBullet(G, x + 1.2, y, 'shot', 0, scale);
      }
    };
    emitFrom(this.x, this.y, 1);
    for (const d of this.drones) emitFrom(d.x, d.y, 0.6);

    G.particles.burst(this.x + 1.3, this.y, 0, {
      count: 3, color: this.weapon === 'pulse' ? PAL.pulse : PAL.pbullet,
      speed: 3, size: 0.3, life: 0.15, drag: 2, dirX: 6,
    });
    if (this.weapon === 'pulse') G.audio.pulseShot(); else G.audio.shoot();
  }

  hurt(G) {
    if (!this.alive || this.inv > 0) return;
    if (this.shieldHp > 0) {
      this.shieldHp--;
      this.inv = 0.9;
      G.audio.deflect();
      G.shake.add(0.25);
      G.hud.flash('rgba(102,200,255,0.6)', 0.25);
      G.particles.burst(this.x, this.y, 0, { count: 24, color: PAL.shieldCol, speed: 9, size: 0.4, life: 0.5, drag: 3 });
      G.shocks.spawn(this.x, this.y, 0.2, PAL.shieldCol, 2.4, 0.35);
      return;
    }
    this._die(G);
  }

  _die(G) {
    this.alive = false;
    this.respawnT = 1.6;
    this.mesh.visible = false;
    this.shieldMesh.visible = false;
    for (const d of this.drones) G.scene.remove(d.mesh);
    this.drones = [];
    this.weapon = 'basic';
    this.shieldHp = 0;
    this.speedLvl = Math.max(0, this.speedLvl - 1);

    explode(G, this.x, this.y, { size: 1.7, color: PAL.engine });
    G.shocks.spawn(this.x, this.y, 0.3, 0xffffff, 5, 0.6);
    G.audio.playerDeath();
    G.shake.add(0.85);
    G.hitstop(0.4, 0.15);
    G.hud.flash('rgba(255,80,120,0.55)', 0.5);
    G.onPlayerDeath();
  }

  _respawn(G) {
    if (G.lives < 0) return;
    this.alive = true;
    this.x = -11; this.y = 0; this.vx = this.vy = 0;
    this.inv = TUNE.respawnInvuln;
    this.mesh.visible = true;
    this.mesh.position.set(this.x, this.y, 0);
    G.shocks.spawn(this.x, this.y, 0.2, PAL.engine, 2.5, 0.5);
  }
}

// ---------------------------------------------------------------------------
// Enemies

function stdMat(color, ei = 0.35) {
  return new THREE.MeshStandardMaterial({
    color, emissive: color, emissiveIntensity: ei,
    roughness: 0.35, metalness: 0.45, flatShading: true,
  });
}

function baseEnemy(G, mesh, x, y, props) {
  mesh.position.set(x, y, 0);
  G.scene.add(mesh);
  const e = {
    mesh, x, y, t: rand(TAU), dead: false,
    flashT: 0, punch: 0, baseScale: 1,
    fireT: rand(0.5, 1.5),
    ...props,
  };
  e.mats = [];
  mesh.traverse((o) => {
    if (o.isMesh && o.material && o.material.emissive) e.mats.push({ m: o.material, base: o.material.emissiveIntensity });
  });
  G.enemies.push(e);
  return e;
}

export function enemyCommon(e, dt) {
  e.t += dt;
  if (e.flashT > 0) {
    e.flashT -= dt;
    const k = Math.max(0, e.flashT) / 0.09;
    for (const { m, base } of e.mats) m.emissiveIntensity = base + k * 5;
  }
  if (e.punch > 0) e.punch = Math.max(0, e.punch - dt * 2.5);
  const s = e.baseScale * (1 + e.punch);
  e.mesh.scale.set(s, s, s);
  e.mesh.position.set(e.x, e.y, 0);
}

const moteGeo = new THREE.TetrahedronGeometry(0.46, 0);
export function spawnMoteChain(G, diff) {
  const y0 = rand(G.bounds.y0 + 2, G.bounds.y1 - 2);
  const phase = rand(TAU);
  const amp = rand(1.4, 2.6);
  const freq = rand(1.6, 2.4);
  const chainId = G.nextChainId++;
  G.chains.set(chainId, { total: 5, killed: 0, broken: false });
  for (let i = 0; i < 5; i++) {
    const e = baseEnemy(G, new THREE.Mesh(moteGeo, stdMat(PAL.moteCol, 0.5)), G.bounds.x1 + 2 + i * 1.7, y0, {
      type: 'mote', hp: 1, r: 0.52, score: 100, chainId,
      vx: -(4.6 + diff * 1.1), y0, phase, amp, freq,
    });
    e.mesh.rotation.set(rand(TAU), rand(TAU), 0);
    e.update = (dt, g) => {
      e.x += e.vx * dt;
      e.y = e.y0 + Math.sin(e.x * 0.55 * e.freq + e.phase) * e.amp;
      e.mesh.rotation.x += dt * 3;
      e.mesh.rotation.y += dt * 4;
      enemyCommon(e, dt);
    };
  }
}

const dartGeo = new THREE.ConeGeometry(0.3, 1.25, 4);
dartGeo.rotateZ(Math.PI / 2);
export function spawnDart(G, diff, yOverride) {
  const y = yOverride !== undefined ? yOverride : rand(G.bounds.y0 + 1.2, G.bounds.y1 - 1.2);
  const x = G.bounds.x1 + 2;
  const spd = 10.5 + diff * 2.2;
  const dyTo = clamp(G.player.y - y, -6, 6);
  const e = baseEnemy(G, new THREE.Mesh(dartGeo, stdMat(PAL.dartCol, 0.6)), x, y, {
    type: 'dart', hp: 1, r: 0.45, score: 150,
    vx: -spd, vy: dyTo * 0.35,
  });
  e.update = (dt, g) => {
    e.x += e.vx * dt;
    e.y += e.vy * dt;
    e.mesh.rotation.x += dt * 9;
    if (Math.random() < 0.5) {
      g.particles.spawn(e.x + 0.7, e.y, 0, 4, rand(-0.5, 0.5), 0, PAL.dartCol, 0.24, 0.3, 3, 0);
    }
    enemyCommon(e, dt);
  };
}

const spinnerGeo = new THREE.OctahedronGeometry(0.72, 0);
export function spawnSpinner(G, diff, yOverride) {
  const y = yOverride !== undefined ? yOverride : rand(G.bounds.y0 + 1.5, G.bounds.y1 - 1.5);
  const e = baseEnemy(G, new THREE.Mesh(spinnerGeo, stdMat(PAL.spinnerCol, 0.5)), G.bounds.x1 + 2, y, {
    type: 'spinner', hp: 3 + Math.floor(diff), r: 0.85, score: 300,
    vx: -(2.1 + diff * 0.4), y0: y,
    fireInt: Math.max(1.35, 2.5 - diff * 0.3),
  });
  e.update = (dt, g) => {
    e.x += e.vx * dt;
    e.y = e.y0 + Math.sin(e.t * 1.3) * 0.9;
    e.mesh.rotation.z += dt * 2.4;
    e.mesh.rotation.x += dt * 1.1;
    e.fireT -= dt;
    if (e.fireT <= 0 && e.x < g.bounds.x1 - 1 && g.player.alive) {
      e.fireT = e.fireInt;
      const spd = 6.5 + diff * 1.1;
      for (const s of [-0.28, 0, 0.28]) {
        const v = aimAtPlayer(g, e.x, e.y, spd, s);
        spawnEnemyBullet(g, e.x, e.y, v.vx, v.vy);
      }
      g.particles.burst(e.x, e.y, 0, { count: 6, color: PAL.ebullet, speed: 3, size: 0.3, life: 0.3, drag: 3 });
    }
    enemyCommon(e, dt);
  };
}

const chargerGeo = new THREE.DodecahedronGeometry(1.0, 0);
export function spawnCharger(G, diff) {
  const y = rand(G.bounds.y0 + 2, G.bounds.y1 - 2);
  const e = baseEnemy(G, new THREE.Mesh(chargerGeo, stdMat(PAL.chargerCol, 0.4)), G.bounds.x1 + 2.5, y, {
    type: 'charger', hp: 9 + Math.floor(diff * 3), r: 1.15, score: 600,
    vx: -1.55, fireInt: Math.max(1.1, 1.9 - diff * 0.22),
  });
  e.baseScale = 1;
  e.update = (dt, g) => {
    e.x += e.vx * dt;
    e.y += Math.sin(e.t * 0.8) * 0.35 * dt * 4;
    e.mesh.rotation.z += dt * 0.6;
    e.mesh.rotation.y += dt * 0.4;
    for (const { m, base } of e.mats) if (e.flashT <= 0) m.emissiveIntensity = base + Math.sin(e.t * 4) * 0.2 + 0.2;
    e.fireT -= dt;
    if (e.fireT <= 0 && e.x < g.bounds.x1 - 1 && g.player.alive) {
      e.fireT = e.fireInt;
      const v = aimAtPlayer(g, e.x, e.y, 8 + diff * 1.4);
      spawnEnemyBullet(g, e.x, e.y, v.vx, v.vy, true);
      g.audio.hit();
    }
    enemyCommon(e, dt);
  };
}

const weaverGeo = new THREE.IcosahedronGeometry(0.58, 0);
export function spawnWeaver(G, diff, dir = 1) {
  const y = dir > 0 ? rand(G.bounds.y0 + 1.5, -1) : rand(1, G.bounds.y1 - 1.5);
  const e = baseEnemy(G, new THREE.Mesh(weaverGeo, stdMat(PAL.weaverCol, 0.55)), G.bounds.x1 + 2, y, {
    type: 'weaver', hp: 2 + Math.floor(diff * 0.5), r: 0.7, score: 250,
    vx: -(3.2 + diff * 0.6), y0: y, dir,
    fireInt: Math.max(1.5, 2.4 - diff * 0.25),
  });
  e.update = (dt, g) => {
    e.x += e.vx * dt;
    e.y = e.y0 + Math.sin(e.t * 2.9) * 2.7 * e.dir;
    e.mesh.rotation.x += dt * 3;
    e.mesh.rotation.z += dt * 2;
    e.fireT -= dt;
    if (e.fireT <= 0 && e.x < g.bounds.x1 - 1 && e.x > g.bounds.x0 + 3 && g.player.alive) {
      e.fireT = e.fireInt;
      const spd = 5.5 + diff;
      spawnEnemyBullet(g, e.x, e.y, 0, spd);
      spawnEnemyBullet(g, e.x, e.y, 0, -spd);
    }
    enemyCommon(e, dt);
  };
}

export function spawnPattern(G, diff) {
  const opts = ['motes'];
  if (diff > 1.12) opts.push('darts');
  if (diff > 1.3) opts.push('weavers', 'motes');
  if (diff > 1.55) opts.push('spinner', 'darts');
  if (diff > 1.95) opts.push('charger', 'spinner');
  if (diff > 2.4) opts.push('mixed');
  const kind = pick(opts);
  switch (kind) {
    case 'motes': spawnMoteChain(G, diff); break;
    case 'darts': {
      const n = 2 + Math.floor(diff);
      for (let i = 0; i < n; i++) spawnDart(G, diff);
      break;
    }
    case 'weavers':
      spawnWeaver(G, diff, 1);
      if (diff > 1.7) spawnWeaver(G, diff, -1);
      break;
    case 'spinner':
      spawnSpinner(G, diff);
      if (diff > 2.2) spawnSpinner(G, diff);
      break;
    case 'charger': spawnCharger(G, diff); break;
    case 'mixed':
      spawnMoteChain(G, diff);
      spawnSpinner(G, diff);
      spawnDart(G, diff);
      break;
  }
}

// ---------------------------------------------------------------------------
// Damage / kill

export function damageEnemy(G, e, dmg, silent = false) {
  if (e.dead) return;
  e.hp -= dmg;
  e.flashT = 0.09;
  e.punch = Math.min(0.35, e.punch + 0.18);
  if (e.hp <= 0) killEnemy(G, e);
  else if (!silent) G.audio.hit();
}

export function killEnemy(G, e, { scoreMul = 1 } = {}) {
  if (e.dead) return;
  e.dead = true;
  const size = e.r > 1 ? 1.5 : e.r > 0.7 ? 1.0 : 0.65;
  const col = e.mats.length ? e.mats[0].m.color.getHex() : 0xffaa66;
  explode(G, e.x, e.y, { size, color: col });
  G.addScore(Math.round(e.score * scoreMul), e.x, e.y);
  G.onKill();
  if (e.r > 1) G.hitstop(0.09, 0.2);

  // chain bookkeeping
  if (e.chainId !== undefined) {
    const c = G.chains.get(e.chainId);
    if (c) {
      c.killed++;
      if (!c.broken && c.killed === c.total) {
        spawnShard(G, e.x, e.y);
        G.addScore(500, e.x, e.y - 0.8, 'CHAIN +');
        G.chains.delete(e.chainId);
      }
    }
  }
  // guaranteed / random drops
  if (e.type === 'charger') spawnShard(G, e.x, e.y);
  else if (e.type === 'spinner' && Math.random() < 0.45) spawnShard(G, e.x, e.y);
  else if (e.type !== 'mote' && Math.random() < 0.08) spawnShard(G, e.x, e.y);
}

// ---------------------------------------------------------------------------
// Boss: PRISM WARDEN — orbiting shield plates around an exposed core.

export class Boss {
  constructor(G, tier = 0) {
    this.G = G;
    this.tier = tier;
    this.group = new THREE.Group();
    G.scene.add(this.group);

    this.x = G.bounds.x1 + 7;
    this.y = 0;
    this.t = 0;
    this.state = 'enter';
    this.hpMax = Math.round(230 * (1 + tier * 0.55));
    this.hp = this.hpMax;
    this.ringRot = 0;
    this.plateR = 3.0;
    this.fireT = 2;
    this.fireT2 = 3;
    this.queue = [];
    this.dieT = 0;
    this.coreFlash = 0;

    this.coreMat = new THREE.MeshStandardMaterial({
      color: PAL.bossCore, emissive: PAL.bossCore, emissiveIntensity: 1.1,
      roughness: 0.15, metalness: 0.3, flatShading: true,
    });
    this.core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.3, 0), this.coreMat);
    this.core.add(makeGlowSprite(PAL.bossCore, 4.5, 4.5, 0.45));
    this.group.add(this.core);

    const inner = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.7, 0),
      new THREE.MeshBasicMaterial({ color: PAL.bossShell, wireframe: true, transparent: true, opacity: 0.35 })
    );
    this.group.add(inner);
    this.cage = inner;

    this.ring = new THREE.Group();
    this.group.add(this.ring);
    this.plates = [];
    const plateGeo = new THREE.OctahedronGeometry(0.95, 0);
    for (let i = 0; i < 6; i++) {
      const m = new THREE.Mesh(plateGeo, stdMat(PAL.bossShell, 0.5));
      m.scale.set(0.55, 1.35, 0.55);
      this.ring.add(m);
      this.plates.push(m);
    }
    this._layoutPlates();

    this.light = new THREE.PointLight(PAL.bossCore, 4, 18);
    this.group.add(this.light);
  }

  _layoutPlates() {
    this.plates.forEach((m, i) => {
      const a = (i / 6) * TAU;
      m.position.set(Math.cos(a) * this.plateR, Math.sin(a) * this.plateR, 0);
      m.rotation.z = a;
    });
  }

  get phase() {
    const f = this.hp / this.hpMax;
    return f > 0.62 ? 0 : f > 0.3 ? 1 : 2;
  }

  getColliders() {
    const cols = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU + this.ringRot;
      cols.push({ x: this.x + Math.cos(a) * this.plateR, y: this.y + Math.sin(a) * this.plateR, r: 0.95, kind: 'plate' });
    }
    cols.push({ x: this.x, y: this.y, r: 1.25, kind: 'core' });
    return cols;
  }

  takeHit(G, dmg) {
    if (this.state !== 'fight') return;
    this.hp -= dmg;
    this.coreFlash = 0.1;
    G.audio.hit();
    if (this.hp <= 0) {
      this.hp = 0;
      this.state = 'dying';
      this.dieT = 2.3;
      G.audio.boom(1.4);
      G.hitstop(0.3, 0.12);
    }
  }

  update(dt, G) {
    this.t += dt;
    const diff = G.director.diff;

    if (this.state === 'enter') {
      this.x = damp(this.x, G.bounds.x1 - 5.2, 1.6, dt);
      if (Math.abs(this.x - (G.bounds.x1 - 5.2)) < 0.3) {
        this.state = 'fight';
        G.hud.message('PRISM WARDEN', 'warning', 2);
      }
    } else if (this.state === 'fight') {
      const yr = Math.min(4.2, G.bounds.y1 - 3);
      this.y = damp(this.y, Math.sin(this.t * 0.55) * yr, 2.5, dt);
      this.x = (G.bounds.x1 - 5.2) + Math.sin(this.t * 0.9) * 0.7;
      this._attack(dt, G, diff);
    } else if (this.state === 'dying') {
      this.dieT -= dt;
      this.ringRot += dt * 3;
      if (Math.random() < 0.35) {
        const a = rand(TAU), r = rand(0.5, 2.8);
        explode(G, this.x + Math.cos(a) * r, this.y + Math.sin(a) * r, { size: rand(0.5, 1.1), color: pick([PAL.bossShell, PAL.bossCore, 0xffffff]), ring: false });
      }
      if (this.dieT <= 0) { this._finale(G); return; }
    }

    // ring motion
    const spinBase = [0.55, 0.95, 1.6][this.phase];
    this.ringRot += dt * spinBase * (1 + this.tier * 0.15);
    this.ring.rotation.z = this.ringRot;
    const targetR = this.phase === 2 ? 3.9 : this.phase === 1 ? 3.0 + Math.sin(this.t * 1.4) * 0.5 : 3.0;
    this.plateR = damp(this.plateR, targetR, 3, dt);
    this._layoutPlates();

    this.core.rotation.x += dt * 0.8;
    this.core.rotation.y += dt * 1.2;
    this.cage.rotation.z -= dt * 0.4;
    this.cage.rotation.x += dt * 0.25;

    if (this.coreFlash > 0) {
      this.coreFlash -= dt;
      this.coreMat.emissiveIntensity = 1.1 + (this.coreFlash / 0.1) * 4;
    } else {
      this.coreMat.emissiveIntensity = 1.0 + Math.sin(this.t * 3) * 0.25 + this.phase * 0.3;
    }
    this.light.intensity = 3 + Math.sin(this.t * 3) + this.phase * 1.5;

    this.group.position.set(this.x, this.y, 0);

    // scheduled volleys
    for (let i = this.queue.length - 1; i >= 0; i--) {
      this.queue[i].t -= dt;
      if (this.queue[i].t <= 0) {
        this.queue[i].fn();
        this.queue.splice(i, 1);
      }
    }

    if (this.state !== 'dying') G.hud.showBoss(this.hp / this.hpMax);
  }

  _attack(dt, G, diff) {
    if (!G.player.alive) return;
    const ph = this.phase;
    this.fireT -= dt;
    this.fireT2 -= dt;

    if (ph === 0) {
      if (this.fireT <= 0) {
        this.fireT = 1.6;
        for (let i = 0; i < 3; i++) {
          this.queue.push({ t: i * 0.14, fn: () => {
            if (this.state !== 'fight') return;
            const v = aimAtPlayer(G, this.x, this.y, 8.5 + diff, rand(-0.05, 0.05));
            spawnEnemyBullet(G, this.x, this.y, v.vx, v.vy);
          }});
        }
      }
    } else if (ph === 1) {
      if (this.fireT <= 0) {
        this.fireT = 2.3;
        const n = 14;
        const off = rand(TAU);
        for (let i = 0; i < n; i++) {
          const a = (i / n) * TAU + off;
          spawnEnemyBullet(G, this.x, this.y, Math.cos(a) * 6.2, Math.sin(a) * 6.2);
        }
        G.audio.boom(0.5);
        G.shocks.spawn(this.x, this.y, 0.2, PAL.ebullet, 3, 0.4);
      }
      if (this.fireT2 <= 0) {
        this.fireT2 = 2.9;
        for (let i = 0; i < 4; i++) {
          this.queue.push({ t: i * 0.12, fn: () => {
            if (this.state !== 'fight') return;
            const v = aimAtPlayer(G, this.x, this.y - 2, 9.5 + diff, rand(-0.04, 0.04));
            spawnEnemyBullet(G, this.x, this.y - 2, v.vx, v.vy, true);
          }});
        }
      }
    } else {
      if (this.fireT <= 0) {
        this.fireT = 1.15;
        // twin sweeping arcs
        const base = Math.atan2(G.player.y - this.y, G.player.x - this.x);
        for (let i = -3; i <= 3; i++) {
          const a = base + i * 0.16;
          spawnEnemyBullet(G, this.x, this.y, Math.cos(a) * 8, Math.sin(a) * 8, i === 0);
        }
        G.audio.hit();
      }
      if (this.fireT2 <= 0) {
        this.fireT2 = 3.4;
        spawnDart(G, diff, rand(G.bounds.y0 + 1.5, G.bounds.y1 - 1.5));
        spawnDart(G, diff, rand(G.bounds.y0 + 1.5, G.bounds.y1 - 1.5));
      }
    }
  }

  _finale(G) {
    this.state = 'dead';
    explode(G, this.x, this.y, { size: 2.6, color: PAL.bossCore });
    G.shocks.spawn(this.x, this.y, 0.3, 0xffffff, 12, 0.9);
    G.shocks.spawn(this.x, this.y, 0.3, PAL.bossShell, 8, 0.7);
    G.shake.add(1);
    G.hitstop(0.55, 0.1);
    G.hud.flash('rgba(255,255,255,0.8)', 0.7);
    G.bloomPulse(2.2);
    for (let i = 0; i < 3; i++) spawnShard(G, this.x - 2 + i * 1.2, this.y + rand(-1.5, 1.5));
    G.addScore(5000 * (this.tier + 1), this.x, this.y);
    G.scene.remove(this.group);
    G.hud.showBoss(null);
    G.onBossDead();
  }

  dispose(G) {
    G.scene.remove(this.group);
  }
}
