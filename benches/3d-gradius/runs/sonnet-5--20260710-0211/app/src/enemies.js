import * as THREE from 'three';
import { clamp, randRange, choice, weightedChoice, getGlowTexture } from './utils.js';
import { BOUNDS, SPAWN_Z, DESPAWN_Z } from './world.js';

let entId = 1;

const MATS = {};
function mat(color, emissiveIntensity = 0.8) {
  const key = color + ':' + emissiveIntensity;
  if (!MATS[key]) {
    MATS[key] = new THREE.MeshStandardMaterial({
      color: 0x10131f,
      emissive: color,
      emissiveIntensity,
      metalness: 0.4,
      roughness: 0.4,
    });
  }
  return MATS[key];
}

const GEO = {
  drone: new THREE.TetrahedronGeometry(0.6, 0),
  weaver: new THREE.OctahedronGeometry(0.55, 0),
  turretBase: new THREE.CylinderGeometry(0.5, 0.7, 0.5, 6),
  turretGun: new THREE.BoxGeometry(0.18, 0.18, 0.9),
  shieldCore: new THREE.IcosahedronGeometry(0.55, 0),
  shieldShell: new THREE.IcosahedronGeometry(0.85, 1),
  elite: new THREE.ConeGeometry(0.45, 1.3, 5),
  obstacle: new THREE.DodecahedronGeometry(1, 0),
  bullet: new THREE.SphereGeometry(0.16, 6, 6),
  prism: new THREE.OctahedronGeometry(0.4, 0),
};

function addGlowSprite(mesh, colorHex, scale = 2.2) {
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({
    map: getGlowTexture(THREE, colorHex),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    opacity: 0.65,
  }));
  spr.scale.setScalar(scale);
  mesh.add(spr);
  return spr;
}

// ---------------------------------------------------------------- factories

function baseEnemy(type, overrides) {
  return Object.assign({
    id: entId++,
    type,
    alive: true,
    x: 0, y: 0, z: SPAWN_Z,
    vx: 0, vy: 0,
    approachSpeed: 30,
    hp: 1, maxHp: 1,
    shieldHp: 0,
    radius: 0.7,
    contactDamage: 1,
    scoreValue: 100,
    damageable: true,
    dropChance: 0.35,
    fireTimer: randRange(0.5, 2),
    age: 0,
    mesh: null,
  }, overrides);
}

export function createDrone(scene, x, y) {
  const mesh = new THREE.Mesh(GEO.drone, mat(0x4dfaff, 0.9));
  mesh.rotation.set(Math.random(), Math.random(), Math.random());
  addGlowSprite(mesh, '#4dfaff', 1.6);
  scene.add(mesh);
  const e = baseEnemy('drone', {
    x, y, hp: 1, maxHp: 1, radius: 0.55, scoreValue: 100,
    approachSpeed: randRange(28, 34), mesh,
    wobblePhase: randRange(0, Math.PI * 2),
  });
  return e;
}

export function createWeaver(scene, x, y) {
  const mesh = new THREE.Mesh(GEO.weaver, mat(0xff3df0, 0.9));
  addGlowSprite(mesh, '#ff3df0', 1.8);
  scene.add(mesh);
  const e = baseEnemy('weaver', {
    x, y, hp: 2, maxHp: 2, radius: 0.6, scoreValue: 180,
    approachSpeed: randRange(24, 30), mesh,
    wavePhase: randRange(0, Math.PI * 2),
    waveAmp: randRange(3.4, 5.5),
    waveFreq: randRange(0.7, 1.1),
    baseX: x,
    dropChance: 0.55,
  });
  return e;
}

export function createTurret(scene, x, y) {
  const group = new THREE.Group();
  const base = new THREE.Mesh(GEO.turretBase, mat(0xffb347, 0.7));
  group.add(base);
  const gun = new THREE.Mesh(GEO.turretGun, mat(0xffb347, 1.1));
  gun.position.z = 0.4;
  group.add(gun);
  addGlowSprite(group, '#ffb347', 2.2);
  scene.add(group);
  const e = baseEnemy('turret', {
    x, y, hp: 3, maxHp: 3, radius: 0.7, scoreValue: 260,
    approachSpeed: randRange(16, 20), mesh: group,
    gun, fireTimer: randRange(1, 2.2), dropChance: 0.7,
  });
  return e;
}

export function createShieldDrone(scene, x, y) {
  const group = new THREE.Group();
  const core = new THREE.Mesh(GEO.shieldCore, mat(0x59ff9c, 1.0));
  group.add(core);
  const shell = new THREE.Mesh(GEO.shieldShell, new THREE.MeshBasicMaterial({
    color: 0x59ff9c, wireframe: true, transparent: true, opacity: 0.55,
  }));
  group.add(shell);
  addGlowSprite(group, '#59ff9c', 2.4);
  scene.add(group);
  const e = baseEnemy('shieldDrone', {
    x, y, hp: 2, maxHp: 2, shieldHp: 3, radius: 0.8, scoreValue: 320,
    approachSpeed: randRange(20, 24), mesh: group, shell,
    wobblePhase: randRange(0, Math.PI * 2), dropChance: 0.85,
  });
  return e;
}

export function createElite(scene, x, y) {
  const mesh = new THREE.Mesh(GEO.elite, mat(0xff4d5e, 1.0));
  mesh.rotation.x = Math.PI / 2;
  addGlowSprite(mesh, '#ff4d5e', 2.0);
  scene.add(mesh);
  const e = baseEnemy('elite', {
    x, y, hp: 3, maxHp: 3, radius: 0.6, scoreValue: 420,
    approachSpeed: randRange(34, 40), mesh,
    fireTimer: randRange(0.8, 1.6), dropChance: 0.9,
  });
  return e;
}

export function createObstacle(scene, x, y, scale = 1) {
  const mesh = new THREE.Mesh(GEO.obstacle, new THREE.MeshStandardMaterial({
    color: 0x2a2f45, emissive: 0x8891ff, emissiveIntensity: 0.25, metalness: 0.5, roughness: 0.6,
  }));
  mesh.scale.setScalar(scale);
  mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
  const edges = new THREE.EdgesGeometry(GEO.obstacle);
  mesh.add(new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xaeb4ff, transparent: true, opacity: 0.4 })));
  scene.add(mesh);
  const e = baseEnemy('obstacle', {
    x, y, hp: 999, maxHp: 999, radius: 1.05 * scale, scoreValue: 0,
    approachSpeed: 26, mesh, damageable: false, contactDamage: 1, dropChance: 0,
    spin: randRange(-0.6, 0.6),
  });
  return e;
}

export function spawnEnemyBullet(scene, state, from, target, opts = {}) {
  const mesh = new THREE.Mesh(GEO.bullet, new THREE.MeshBasicMaterial({
    color: opts.color || 0xff4d5e, transparent: true, opacity: 0.95,
  }));
  mesh.position.set(from.x, from.y, from.z);
  addGlowSprite(mesh, opts.glow || '#ff4d5e', 1.4);
  scene.add(mesh);

  const dx = target.x - from.x, dy = target.y - from.y, dz = target.z - from.z;
  const d = Math.hypot(dx, dy, dz) || 1;
  const speed = opts.speed || 42;
  const bullet = {
    mesh,
    x: from.x, y: from.y, z: from.z,
    vx: (dx / d) * speed, vy: (dy / d) * speed, vz: (dz / d) * speed,
    radius: opts.radius || 0.32,
    damage: opts.damage || 1,
    life: opts.life || 6,
  };
  state.enemyBullets.push(bullet);
  return bullet;
}

// ---------------------------------------------------------------- update

export function updateEnemy(e, dt, player, world, scene, state) {
  e.age += dt;
  const closing = e.approachSpeed + world.scrollSpeed * 0.15;

  switch (e.type) {
    case 'drone': {
      e.z += closing * dt;
      e.x += Math.sin(e.age * 1.4 + e.wobblePhase) * 0.6 * dt;
      break;
    }
    case 'weaver': {
      e.z += closing * dt;
      e.x = e.baseX + Math.sin(e.age * e.waveFreq * Math.PI + e.wavePhase) * e.waveAmp;
      e.x = clamp(e.x, BOUNDS.xMin + 1, BOUNDS.xMax - 1);
      break;
    }
    case 'turret': {
      e.z += closing * dt * 0.5;
      e.fireTimer -= dt;
      if (e.fireTimer <= 0 && e.z > SPAWN_Z + 20 && e.z < 2 && player.alive) {
        e.fireTimer = randRange(1.4, 2.4);
        spawnEnemyBullet(scene, state, { x: e.x, y: e.y, z: e.z }, { x: player.x, y: player.y, z: player.mesh.position.z }, { speed: 46, color: 0xffb347, glow: '#ffb347', damage: 1 });
      }
      if (e.gun) e.gun.lookAt(player.x, player.y, player.mesh.position.z);
      break;
    }
    case 'shieldDrone': {
      e.z += closing * dt;
      e.y += Math.sin(e.age * 1.1 + e.wobblePhase) * 0.5 * dt;
      if (e.shell) e.shell.rotation.y += dt * 0.8;
      break;
    }
    case 'elite': {
      e.z += closing * dt;
      const dx = player.x - e.x;
      e.x += clamp(dx, -1, 1) * Math.min(Math.abs(dx), 18) * dt * 0.9;
      e.fireTimer -= dt;
      if (e.fireTimer <= 0 && e.z > SPAWN_Z + 30 && e.z < -4 && player.alive) {
        e.fireTimer = randRange(1.0, 1.8);
        spawnEnemyBullet(scene, state, { x: e.x, y: e.y, z: e.z }, { x: player.x, y: player.y, z: player.mesh.position.z }, { speed: 50, color: 0xff4d5e, glow: '#ff4d5e', damage: 1 });
      }
      break;
    }
    case 'obstacle': {
      e.z += closing * dt;
      e.mesh.rotation.x += e.spin * dt;
      e.mesh.rotation.y += e.spin * 0.7 * dt;
      break;
    }
  }

  e.mesh.position.set(e.x, e.y, e.z);
  if (e.type !== 'obstacle' && e.type !== 'turret') {
    e.mesh.rotation.y += dt * 1.2;
  }
}

export function updateEnemyBullets(dt, state, scene) {
  const arr = state.enemyBullets;
  for (let i = arr.length - 1; i >= 0; i--) {
    const b = arr[i];
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.z += b.vz * dt;
    b.life -= dt;
    b.mesh.position.set(b.x, b.y, b.z);
    if (b.life <= 0 || b.z > DESPAWN_Z + 10 || b.z < SPAWN_Z - 10) {
      scene.remove(b.mesh);
      arr.splice(i, 1);
    }
  }
}

export function createPrism(scene, x, y, z) {
  const mesh = new THREE.Mesh(GEO.prism, new THREE.MeshBasicMaterial({ color: 0xffe27a }));
  addGlowSprite(mesh, '#ffe27a', 2.0);
  scene.add(mesh);
  return { mesh, x, y, z, radius: 0.75, age: 0, vz: 0 };
}

export function updatePrisms(dt, state, player, world, scene) {
  const arr = state.pickups;
  for (let i = arr.length - 1; i >= 0; i--) {
    const p = arr[i];
    p.age += dt;
    p.z += (world.scrollSpeed * 0.55) * dt;
    p.mesh.rotation.y += dt * 3;
    p.mesh.rotation.x += dt * 1.4;

    // Gentle magnetism toward the player once close.
    const dx = player.x - p.x, dy = player.y - p.y, dz = player.mesh.position.z - p.z;
    const dist = Math.hypot(dx, dy, dz);
    if (dist < 6 && player.alive) {
      const pull = 18 * dt;
      p.x += (dx / dist) * pull;
      p.y += (dy / dist) * pull;
      p.z += (dz / dist) * pull;
    }
    p.mesh.position.set(p.x, p.y, p.z);
    if (p.z > DESPAWN_Z) {
      scene.remove(p.mesh);
      arr.splice(i, 1);
    }
  }
}

// ---------------------------------------------------------------- director

const FACTORY = {
  drone: createDrone,
  weaver: createWeaver,
  turret: createTurret,
  shieldDrone: createShieldDrone,
  elite: createElite,
};

export class SpawnDirector {
  constructor(scene, state) {
    this.scene = scene;
    this.state = state;
    this.timer = 1.5;
    this.elapsed = 0;
    this.bossTriggerTime = 245;
    this.bossTriggered = false;
  }

  reset() {
    this.timer = 1.5;
    this.elapsed = 0;
    this.bossTriggered = false;
  }

  tier() {
    const t = this.elapsed;
    if (t < 45) return 0;
    if (t < 100) return 1;
    if (t < 165) return 2;
    return 3;
  }

  update(dt) {
    this.elapsed += dt;
    this.timer -= dt;
    if (this.timer > 0) return null;

    const tier = this.tier();
    this.timer = randRange(2.6, 4.2) - tier * 0.35;
    this._spawnWave(tier);

    if (!this.bossTriggered && this.elapsed >= this.bossTriggerTime) {
      this.bossTriggered = true;
      return 'boss';
    }
    return null;
  }

  _spawnWave(tier) {
    const pattern = weightedChoice(this._patternsForTier(tier));
    pattern(this);
  }

  _patternsForTier(tier) {
    const p = [
      [(d) => d._line('drone', 3 + tier), 5],
      [(d) => d._vFormation('drone', 5), tier >= 0 ? 3 : 0],
      [(d) => d._single('weaver'), tier >= 1 ? 4 : 0],
      [(d) => d._pair('weaver'), tier >= 1 ? 2 : 0],
      [(d) => d._single('turret'), tier >= 1 ? 3 : 0],
      [(d) => d._single('shieldDrone'), tier >= 2 ? 3 : 0],
      [(d) => d._single('elite'), tier >= 2 ? 3 : 0],
      [(d) => d._eliteSquad(), tier >= 3 ? 3 : 0],
      [(d) => d._obstacleField(), tier >= 1 ? 3 : 0],
      [(d) => d._mixedAssault(), tier >= 3 ? 3 : 0],
    ];
    return p.filter(([, w]) => w > 0);
  }

  _spawnOne(type, x, y) {
    const e = FACTORY[type](this.scene, x, y);
    this.state.enemies.push(e);
    return e;
  }

  _line(type, count) {
    const y = randRange(BOUNDS.yMin + 1, BOUNDS.yMax - 1);
    const spacing = 2.4;
    const startX = randRange(-4, 4);
    for (let i = 0; i < count; i++) {
      this._spawnOne(type, clamp(startX + (i - count / 2) * spacing, BOUNDS.xMin + 1, BOUNDS.xMax - 1), y);
    }
  }

  _vFormation(type, count) {
    const centerX = randRange(-3, 3);
    const topY = BOUNDS.yMax - 1;
    for (let i = 0; i < count; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const rank = Math.floor(i / 2) + 1;
      this._spawnOne(type, clamp(centerX + side * rank * 1.8, BOUNDS.xMin + 1, BOUNDS.xMax - 1), topY - rank * 1.4);
    }
  }

  _single(type) {
    this._spawnOne(type, randRange(BOUNDS.xMin + 1.5, BOUNDS.xMax - 1.5), randRange(BOUNDS.yMin + 1.5, BOUNDS.yMax - 1.5));
  }

  _pair(type) {
    const y = randRange(BOUNDS.yMin + 1.5, BOUNDS.yMax - 1.5);
    this._spawnOne(type, BOUNDS.xMin + 2, y);
    this._spawnOne(type, BOUNDS.xMax - 2, y);
  }

  _eliteSquad() {
    for (let i = 0; i < 3; i++) {
      this._spawnOne('elite', randRange(BOUNDS.xMin + 1, BOUNDS.xMax - 1), randRange(BOUNDS.yMin + 1, BOUNDS.yMax - 1));
    }
  }

  _obstacleField() {
    const count = 3 + ((Math.random() * 3) | 0);
    for (let i = 0; i < count; i++) {
      const x = randRange(BOUNDS.xMin + 1, BOUNDS.xMax - 1);
      const y = randRange(BOUNDS.yMin + 1, BOUNDS.yMax - 1);
      const e = createObstacle(this.scene, x, y, randRange(0.7, 1.5));
      e.z = SPAWN_Z - i * 6;
      this.state.enemies.push(e);
    }
  }

  _mixedAssault() {
    this._line('drone', 3);
    this._single('turret');
    this._single('weaver');
  }
}
