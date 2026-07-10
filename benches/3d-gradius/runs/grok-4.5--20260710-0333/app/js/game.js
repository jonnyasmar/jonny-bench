import * as THREE from "three";
import { AudioBus } from "./audio.js";
import { ParticleSystem, ScreenShake, Starfield, NebulaBackdrop } from "./effects.js";

const POWER_NAMES = ["SPD", "MSL", "DBL", "LAS", "OPT", "SHD"];
const PLAY_BOUNDS = { xMin: -11, xMax: 11, yMin: -6.2, yMax: 6.2 };

// ---------- helpers ----------
function makeGlowMat(color, opacity = 0.9) {
  return new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

function makeHullMat(color) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: 0.7,
    roughness: 0.25,
    emissive: color,
    emissiveIntensity: 0.25,
  });
}

// ---------- Player craft ----------
function createPlayerMesh() {
  const g = new THREE.Group();

  // Core body — arrowhead crystal
  const body = new THREE.Mesh(
    new THREE.ConeGeometry(0.45, 1.6, 5),
    makeHullMat(0x3ef0ff)
  );
  body.rotation.z = -Math.PI / 2;
  body.position.x = 0.15;
  g.add(body);

  // Secondary hull
  const mid = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.35, 0.35),
    makeHullMat(0x1a3a5c)
  );
  mid.position.set(-0.15, 0, 0);
  g.add(mid);

  // Wings
  const wingGeo = new THREE.BufferGeometry();
  const wingVerts = new Float32Array([
    0, 0, 0, -0.6, 0.9, 0, -0.2, 0.15, 0,
    0, 0, 0, -0.6, -0.9, 0, -0.2, -0.15, 0,
  ]);
  wingGeo.setAttribute("position", new THREE.BufferAttribute(wingVerts, 3));
  wingGeo.computeVertexNormals();
  const wings = new THREE.Mesh(wingGeo, makeHullMat(0x9b5cff));
  g.add(wings);

  // Engine glow
  const engine = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 8, 8),
    makeGlowMat(0x3ef0ff, 0.85)
  );
  engine.position.set(-0.75, 0, 0);
  engine.scale.set(1.4, 0.7, 0.7);
  g.add(engine);
  g.userData.engine = engine;

  // Cockpit gem
  const cockpit = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.18),
    makeGlowMat(0xffd166, 0.9)
  );
  cockpit.position.set(0.35, 0.05, 0.15);
  g.add(cockpit);

  // Nose point light-ish
  const tip = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 6, 6),
    makeGlowMat(0xffffff, 1)
  );
  tip.position.set(0.95, 0, 0);
  g.add(tip);

  g.scale.setScalar(0.95);
  return g;
}

function createOptionMesh() {
  const g = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.22),
    makeGlowMat(0x5dff9a, 0.95)
  );
  g.add(core);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.32, 0.04, 6, 16),
    makeGlowMat(0x3ef0ff, 0.7)
  );
  ring.rotation.x = Math.PI / 2;
  g.add(ring);
  g.userData.ring = ring;
  return g;
}

function createShieldMesh() {
  const m = new THREE.Mesh(
    new THREE.SphereGeometry(1.1, 16, 12),
    new THREE.MeshBasicMaterial({
      color: 0x5dff9a,
      transparent: true,
      opacity: 0.22,
      wireframe: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  return m;
}

// ---------- Enemy meshes ----------
function createDroneMesh() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.4, 0),
    makeHullMat(0xff4d6d)
  );
  g.add(body);
  const eye = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 6, 6),
    makeGlowMat(0xffd166)
  );
  eye.position.x = -0.25;
  g.add(eye);
  return g;
}

function createFighterMesh() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.ConeGeometry(0.35, 1.2, 4),
    makeHullMat(0xff3ec8)
  );
  body.rotation.z = Math.PI / 2;
  g.add(body);
  const wing = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 1.1, 0.08),
    makeHullMat(0x9b5cff)
  );
  g.add(wing);
  return g;
}

function createSpinnerMesh() {
  const g = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.TorusGeometry(0.45, 0.12, 6, 12),
    makeHullMat(0xffd166)
  );
  g.add(core);
  const hub = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.25),
    makeGlowMat(0xff4d6d)
  );
  g.add(hub);
  g.userData.spin = core;
  return g;
}

function createTankMesh() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.7, 0.7),
    makeHullMat(0x6688aa)
  );
  g.add(body);
  const turret = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.2, 0.8, 6),
    makeHullMat(0xff4d6d)
  );
  turret.rotation.z = Math.PI / 2;
  turret.position.set(-0.5, 0.15, 0);
  g.add(turret);
  return g;
}

function createBossMesh() {
  const g = new THREE.Group();
  // Central core
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.4, 1),
    makeHullMat(0x9b5cff)
  );
  g.add(core);
  // Outer rings
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2 + i * 0.55, 0.08, 6, 32),
      makeGlowMat(i % 2 ? 0x3ef0ff : 0xff3ec8, 0.7)
    );
    ring.rotation.x = Math.PI / 2 + i * 0.4;
    ring.rotation.y = i * 0.7;
    g.add(ring);
    g.userData[`ring${i}`] = ring;
  }
  // Arms / cannons
  for (let i = 0; i < 4; i++) {
    const ang = (i / 4) * Math.PI * 2;
    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.3, 2.2),
      makeHullMat(0xff4d6d)
    );
    arm.position.set(Math.cos(ang) * 1.8, Math.sin(ang) * 1.8, 0);
    arm.lookAt(0, 0, 0);
    g.add(arm);
  }
  // Eye
  const eye = new THREE.Mesh(
    new THREE.SphereGeometry(0.45, 12, 12),
    makeGlowMat(0xff3ec8, 1)
  );
  eye.position.x = -1.2;
  g.add(eye);
  g.userData.core = core;
  g.userData.eye = eye;
  g.scale.setScalar(1.1);
  return g;
}

// ---------- Bullet mesh factories ----------
function createBulletMesh(color, long = false) {
  const mesh = new THREE.Mesh(
    long
      ? new THREE.CapsuleGeometry(0.08, 0.7, 4, 6)
      : new THREE.SphereGeometry(0.12, 6, 6),
    makeGlowMat(color, 1)
  );
  if (long) mesh.rotation.z = Math.PI / 2;
  return mesh;
}

function createMissileMesh() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.ConeGeometry(0.1, 0.5, 5),
    makeGlowMat(0xffd166, 1)
  );
  body.rotation.z = -Math.PI / 2;
  g.add(body);
  return g;
}

// ---------- Capsule power-up ----------
function createCapsuleMesh() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.22, 0.35, 4, 8),
    makeGlowMat(0xffd166, 0.95)
  );
  body.rotation.z = Math.PI / 2;
  g.add(body);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.4, 0.03, 4, 16),
    makeGlowMat(0xffffff, 0.6)
  );
  g.add(ring);
  g.userData.ring = ring;
  return g;
}

// ============================================================
// GAME
// ============================================================
export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.audio = new AudioBus();
    this.state = "title"; // title | playing | paused | gameover
    this.clock = new THREE.Clock(false);
    this.elapsed = 0;
    this.keys = new Set();
    this.score = 0;
    this.lives = 3;
    this.wave = 1;
    this.combo = 0;
    this.comboTimer = 0;
    this.kills = 0;
    this.powerIndex = -1; // highlighted slot
    this.powerLevels = { speed: 0, missile: false, double: false, laser: false, options: 0, shield: false };
    this.invuln = 0;
    this.fireCooldown = 0;
    this.missileCooldown = 0;
    this.spawnTimer = 0;
    this.waveTimer = 0;
    this.waveKills = 0;
    this.waveTarget = 12;
    this.boss = null;
    this.bossPhase = 0;
    this.timeScale = 1;
    this.announceTimer = 0;

    this.bullets = [];
    this.enemyBullets = [];
    this.enemies = [];
    this.capsules = [];
    this.options = [];
    this.floatScores = [];

    this._initThree();
    this._initWorld();
    this._bindInput();
    this._bindUI();
    this._updateHUD();
    this.clock.start();
    this._loop();
  }

  _initThree() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x05060f, 1);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x05060f, 0.018);

    this.camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    this.camBase = new THREE.Vector3(0, 0, 14);
    this.camera.position.copy(this.camBase);
    this.camera.lookAt(0, 0, 0);

    const ambient = new THREE.AmbientLight(0x4060a0, 0.55);
    this.scene.add(ambient);
    const key = new THREE.DirectionalLight(0xaaccff, 1.1);
    key.position.set(5, 8, 10);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0xff3ec8, 0.45);
    rim.position.set(-8, -4, 4);
    this.scene.add(rim);
    this.playerLight = new THREE.PointLight(0x3ef0ff, 1.2, 18);
    this.scene.add(this.playerLight);

    window.addEventListener("resize", () => this._onResize());
  }

  _initWorld() {
    this.starfield = new Starfield(this.scene, 700);
    this.nebula = new NebulaBackdrop(this.scene);
    this.particles = new ParticleSystem(this.scene, 450);
    this.shake = new ScreenShake();

    this.player = {
      mesh: createPlayerMesh(),
      x: -6,
      y: 0,
      vx: 0,
      vy: 0,
      alive: true,
      // Tight hitbox — classic shmup feel (visual craft is larger)
      radius: 0.22,
    };
    this.scene.add(this.player.mesh);
    this.player.mesh.visible = false;

    this.shieldMesh = createShieldMesh();
    this.shieldMesh.visible = false;
    this.scene.add(this.shieldMesh);

    // Title idle spin object
    this.titleShip = createPlayerMesh();
    this.titleShip.scale.setScalar(2.2);
    this.titleShip.position.set(0, 0.5, 0);
    this.scene.add(this.titleShip);
  }

  _bindInput() {
    const down = (e) => {
      const k = e.key.toLowerCase();
      this.keys.add(k);
      if ([" ", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k) || e.code === "Space") {
        e.preventDefault();
      }
      if (k === "p" || k === "escape") this._togglePause();
      if (k === "m") {
        this.audio.unlock();
        this.audio.toggleMute();
      }
      if ((k === "shift" || k === "x") && this.state === "playing") this._activatePower();
    };
    const up = (e) => this.keys.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    // Prevent space scroll
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space" && e.target === document.body) e.preventDefault();
    });
  }

  _bindUI() {
    const $ = (id) => document.getElementById(id);
    $("btn-start").addEventListener("click", () => this.startGame());
    $("btn-resume").addEventListener("click", () => this._togglePause(false));
    $("btn-quit").addEventListener("click", () => this._toTitle());
    $("btn-retry").addEventListener("click", () => this.startGame());
    $("btn-menu").addEventListener("click", () => this._toTitle());
  }

  _onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h);
  }

  // ---------- State transitions ----------
  startGame() {
    this.audio.unlock();
    this.audio.resume();
    this.audio.ui();
    this._clearEntities();
    this.score = 0;
    this.lives = 3;
    this.wave = 1;
    this.combo = 0;
    this.comboTimer = 0;
    this.kills = 0;
    this.powerIndex = -1;
    this.powerLevels = { speed: 0, missile: false, double: false, laser: false, options: 0, shield: false };
    this.invuln = 2;
    this.fireCooldown = 0;
    this.missileCooldown = 0;
    this.spawnTimer = 1.5;
    this.waveTimer = 0;
    this.waveKills = 0;
    this.waveTarget = 10;
    this.boss = null;
    this.bossPhase = 0;
    this._bossSpawnedThisWave = false;
    this.timeScale = 1;
    this._bestCombo = 0;

    this.player.x = -6;
    this.player.y = 0;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.alive = true;
    this.player.mesh.visible = true;
    this.player.mesh.position.set(this.player.x, this.player.y, 0);
    this.titleShip.visible = false;

    this._rebuildOptions();
    this._setScreen("playing");
    this._updateHUD();
    this._announce("SECTOR 1");
    this.starfield.scrollMul = 1;
  }

  _toTitle() {
    this._clearEntities();
    this.player.mesh.visible = false;
    this.shieldMesh.visible = false;
    this.titleShip.visible = true;
    this.state = "title";
    this._setScreen("title");
    document.getElementById("hud").classList.add("hidden");
    document.getElementById("boss-hud").classList.add("hidden");
  }

  _togglePause(force) {
    if (this.state === "playing" && force !== false) {
      this.state = "paused";
      document.getElementById("pause-screen").classList.remove("hidden");
      this.audio.ui();
    } else if (this.state === "paused" && force !== true) {
      this.state = "playing";
      document.getElementById("pause-screen").classList.add("hidden");
      this.clock.getDelta(); // discard long pause delta
    }
  }

  _gameOver() {
    this.state = "gameover";
    this.player.mesh.visible = false;
    this.shieldMesh.visible = false;
    for (const o of this.options) o.mesh.visible = false;
    document.getElementById("go-title").textContent =
      this.wave > 8 ? "MISSION COMPLETE?" : "HULL BREACHED";
    document.getElementById("go-score").textContent = this.score.toLocaleString();
    document.getElementById("go-stats").textContent =
      `Sector ${this.wave}  ·  ${this.kills} destroyed  ·  Best combo x${this._bestCombo || this.combo || 1}`;
    document.getElementById("gameover-screen").classList.remove("hidden");
    document.getElementById("hud").classList.add("hidden");
    document.getElementById("boss-hud").classList.add("hidden");
    this.audio.explode(true);
  }

  _setScreen(mode) {
    this.state = mode;
    document.getElementById("title-screen").classList.add("hidden");
    document.getElementById("pause-screen").classList.add("hidden");
    document.getElementById("gameover-screen").classList.add("hidden");
    if (mode === "title") {
      document.getElementById("title-screen").classList.remove("hidden");
      document.getElementById("hud").classList.add("hidden");
    } else if (mode === "playing") {
      document.getElementById("hud").classList.remove("hidden");
    }
  }

  _clearEntities() {
    for (const b of this.bullets) this.scene.remove(b.mesh);
    for (const b of this.enemyBullets) this.scene.remove(b.mesh);
    for (const e of this.enemies) this.scene.remove(e.mesh);
    for (const c of this.capsules) this.scene.remove(c.mesh);
    for (const o of this.options) this.scene.remove(o.mesh);
    this.bullets = [];
    this.enemyBullets = [];
    this.enemies = [];
    this.capsules = [];
    this.options = [];
    if (this.boss) {
      this.scene.remove(this.boss.mesh);
      this.boss = null;
    }
  }

  // ---------- HUD ----------
  _updateHUD() {
    document.getElementById("score").textContent = this.score.toLocaleString();
    document.getElementById("wave").textContent = String(this.wave);
    const livesEl = document.getElementById("lives");
    livesEl.innerHTML = "";
    for (let i = 0; i < 5; i++) {
      const pip = document.createElement("div");
      pip.className = "pip" + (i < this.lives ? "" : " empty");
      livesEl.appendChild(pip);
    }

    const slots = document.querySelectorAll(".power-slot");
    slots.forEach((el, i) => {
      el.classList.remove("lit", "active", "owned");
      if (this.powerIndex === i) el.classList.add("active");
      else if (this.powerIndex > i) el.classList.add("lit");
    });
    // mark owned permanent-ish
    if (this.powerLevels.speed > 0) slots[0]?.classList.add("owned");
    if (this.powerLevels.missile) slots[1]?.classList.add("owned");
    if (this.powerLevels.double) slots[2]?.classList.add("owned");
    if (this.powerLevels.laser) slots[3]?.classList.add("owned");
    if (this.powerLevels.options > 0) slots[4]?.classList.add("owned");
    if (this.powerLevels.shield) slots[5]?.classList.add("owned");

    let wlabel = "PULSE";
    if (this.powerLevels.laser) wlabel = "BEAM";
    else if (this.powerLevels.double) wlabel = "TWIN";
    document.getElementById("weapon-label").textContent = wlabel;

    const sh = document.getElementById("shield-indicator");
    if (this.powerLevels.shield) sh.classList.remove("hidden");
    else sh.classList.add("hidden");

    const comboEl = document.getElementById("combo-display");
    if (this.combo >= 2 && this.comboTimer > 0) {
      comboEl.classList.remove("hidden");
      document.getElementById("combo-count").textContent = `x${this.combo}`;
    } else {
      comboEl.classList.add("hidden");
    }

    if (this.boss) {
      document.getElementById("boss-hud").classList.remove("hidden");
      const pct = Math.max(0, this.boss.hp / this.boss.maxHp) * 100;
      document.getElementById("boss-bar").style.width = pct + "%";
      document.getElementById("boss-name").textContent = this.boss.name;
    } else {
      document.getElementById("boss-hud").classList.add("hidden");
    }
  }

  _announce(text, duration = 1.6) {
    const el = document.getElementById("announcer");
    el.textContent = text;
    el.classList.add("show");
    this.announceTimer = duration;
  }

  _flashDamage() {
    const el = document.getElementById("damage-flash");
    el.classList.add("active");
    setTimeout(() => el.classList.remove("active"), 120);
  }

  // ---------- Power system ----------
  _collectCapsule() {
    this.powerIndex = (this.powerIndex + 1) % 6;
    this.audio.powerCollect();
    this._updateHUD();
  }

  _activatePower() {
    if (this.powerIndex < 0) return;
    const i = this.powerIndex;
    this.powerIndex = -1;
    this.audio.powerActivate();
    this.particles.burst(
      new THREE.Vector3(this.player.x, this.player.y, 0),
      0xffd166,
      20,
      5,
      0.5,
      0.15
    );

    switch (i) {
      case 0: // Speed
        this.powerLevels.speed = Math.min(5, this.powerLevels.speed + 1);
        this._announce("THRUST +");
        break;
      case 1: // Missile
        this.powerLevels.missile = true;
        this._announce("MISSILES");
        break;
      case 2: // Double
        this.powerLevels.double = true;
        this._announce("TWIN PULSE");
        break;
      case 3: // Laser
        this.powerLevels.laser = true;
        this._announce("AETHER BEAM");
        break;
      case 4: // Option
        this.powerLevels.options = Math.min(2, this.powerLevels.options + 1);
        this._rebuildOptions();
        this._announce("ORBITERS");
        break;
      case 5: // Shield
        this.powerLevels.shield = true;
        this.shieldMesh.visible = true;
        this._announce("AEGIS");
        break;
    }
    this._updateHUD();
  }

  _rebuildOptions() {
    for (const o of this.options) this.scene.remove(o.mesh);
    this.options = [];
    for (let i = 0; i < this.powerLevels.options; i++) {
      const mesh = createOptionMesh();
      this.scene.add(mesh);
      this.options.push({
        mesh,
        phase: i * Math.PI,
        radius: 1.4 + i * 0.35,
      });
    }
  }

  _dropPowerOnDeath() {
    // lose most power like classic shmups
    this.powerLevels.speed = Math.max(0, this.powerLevels.speed - 1);
    this.powerLevels.laser = false;
    this.powerLevels.double = false;
    this.powerLevels.missile = false;
    this.powerLevels.options = 0;
    this.powerLevels.shield = false;
    this.powerIndex = -1;
    this.shieldMesh.visible = false;
    this._rebuildOptions();
  }

  // ---------- Spawning ----------
  _difficulty() {
    const w = this.wave;
    return {
      enemySpeed: 3.2 + w * 0.35,
      spawnRate: Math.max(0.35, 1.4 - w * 0.08),
      enemyHpMul: 1 + (w - 1) * 0.18,
      bulletSpeed: 6 + w * 0.4,
      shootChance: Math.min(0.55, 0.12 + w * 0.035),
      patterns: Math.min(5, 1 + Math.floor(w / 2)),
    };
  }

  _spawnEnemy(type, x, y, extra = {}) {
    const d = this._difficulty();
    let mesh, hp, radius, score, ai;
    switch (type) {
      case "drone":
        mesh = createDroneMesh();
        hp = 1 * d.enemyHpMul;
        radius = 0.4;
        score = 100;
        ai = "sine";
        break;
      case "fighter":
        mesh = createFighterMesh();
        hp = 2 * d.enemyHpMul;
        radius = 0.45;
        score = 200;
        ai = "chase";
        break;
      case "spinner":
        mesh = createSpinnerMesh();
        hp = 3 * d.enemyHpMul;
        radius = 0.55;
        score = 300;
        ai = "spin";
        break;
      case "tank":
        mesh = createTankMesh();
        hp = 6 * d.enemyHpMul;
        radius = 0.65;
        score = 500;
        ai = "tank";
        break;
      default:
        mesh = createDroneMesh();
        hp = 1;
        radius = 0.4;
        score = 100;
        ai = "sine";
    }
    mesh.position.set(x, y, 0);
    this.scene.add(mesh);
    this.enemies.push({
      mesh,
      x,
      y,
      vx: extra.vx ?? -d.enemySpeed,
      vy: extra.vy ?? 0,
      hp,
      maxHp: hp,
      radius,
      score,
      ai,
      t: Math.random() * 10,
      shootCd: 0.5 + Math.random(),
      phase: Math.random() * Math.PI * 2,
      ...extra,
    });
  }

  _spawnWavePattern() {
    const d = this._difficulty();
    const roll = Math.random();
    const right = 14;

    // Boss sectors: 5, 10, 15… once per sector when no boss is active
    if (this.wave % 5 === 0 && !this.boss && !this._bossSpawnedThisWave) {
      this._bossSpawnedThisWave = true;
      this._spawnBoss();
      return;
    }
    if (this.boss) return;

    if (roll < 0.28) {
      // line of drones
      const n = 3 + Math.floor(Math.random() * 3);
      const y0 = (Math.random() - 0.5) * 8;
      for (let i = 0; i < n; i++) {
        this._spawnEnemy("drone", right + i * 1.2, y0 + Math.sin(i) * 0.5);
      }
    } else if (roll < 0.5) {
      // V formation fighters
      const cy = (Math.random() - 0.5) * 6;
      for (let i = 0; i < 5; i++) {
        const off = (i - 2) * 0.9;
        this._spawnEnemy("fighter", right + Math.abs(i - 2) * 0.8, cy + off, {
          vx: -d.enemySpeed * 1.15,
        });
      }
    } else if (roll < 0.68) {
      // sine wave drones
      const amp = 2 + Math.random() * 2;
      for (let i = 0; i < 6; i++) {
        this._spawnEnemy("drone", right + i * 1.4, Math.sin(i * 0.8) * amp, {
          ai: "sine",
          amp,
        });
      }
    } else if (roll < 0.82) {
      // spinner pair
      this._spawnEnemy("spinner", right, 3);
      this._spawnEnemy("spinner", right + 2, -3);
    } else if (roll < 0.93) {
      // tank
      this._spawnEnemy("tank", right, (Math.random() - 0.5) * 4, {
        vx: -d.enemySpeed * 0.45,
      });
    } else {
      // mixed rush
      for (let i = 0; i < 4; i++) {
        this._spawnEnemy(
          Math.random() < 0.5 ? "drone" : "fighter",
          right + Math.random() * 3,
          (Math.random() - 0.5) * 10
        );
      }
    }
  }

  _spawnBoss() {
    const mesh = createBossMesh();
    const hp = 80 + this.wave * 25;
    mesh.position.set(16, 0, 0);
    this.scene.add(mesh);
    this.boss = {
      mesh,
      x: 16,
      y: 0,
      vx: -2.5,
      vy: 0,
      hp,
      maxHp: hp,
      radius: 2.2,
      score: 5000 + this.wave * 1000,
      t: 0,
      shootCd: 1,
      phase: 0,
      name: this.wave <= 5 ? "VOID SERAPH" : this.wave <= 10 ? "NEXUS WRAITH" : "AETHER TITAN",
      entered: false,
    };
    this.bossPhase = 0;
    this.audio.bossAppear();
    this._announce(this.boss.name);
    this.shake.add(0.5);
    this.starfield.scrollMul = 0.4;
    this._updateHUD();
  }

  // ---------- Combat ----------
  _tryFire() {
    const isFire = this.keys.has(" ") || this.keys.has("z");
    if (!isFire) return;
    if (this.fireCooldown > 0) return;

    const laser = this.powerLevels.laser;
    this.fireCooldown = laser ? 0.09 : 0.14;
    const dmg = laser ? 1.5 : 1;
    const color = laser ? 0x3ef0ff : 0xaef7ff;
    const speed = laser ? 28 : 22;

    const shots = [{ y: 0 }];
    if (this.powerLevels.double || laser) {
      shots.push({ y: 0.35 }, { y: -0.35 });
    }
    if (laser) shots.push({ y: 0.65 }, { y: -0.65 });

    for (const s of shots) {
      this._spawnBullet(this.player.x + 0.9, this.player.y + s.y, speed, 0, dmg, color, laser, false, laser);
    }

    // Options fire
    for (const o of this.options) {
      this._spawnBullet(
        o.mesh.position.x + 0.4,
        o.mesh.position.y,
        speed * 0.95,
        0,
        dmg * 0.7,
        0x5dff9a,
        laser,
        false,
        laser
      );
    }

    if (laser) this.audio.laser();
    else this.audio.shoot();

    // Missiles
    if (this.powerLevels.missile && this.missileCooldown <= 0) {
      this.missileCooldown = 0.55;
      this._spawnMissile(this.player.x, this.player.y - 0.3, -1);
      this._spawnMissile(this.player.x, this.player.y + 0.3, 1);
      this.audio.missile();
    }
  }

  _spawnBullet(x, y, vx, vy, dmg, color, long, enemy, pierce = false) {
    const mesh = createBulletMesh(color, long);
    mesh.position.set(x, y, 0);
    this.scene.add(mesh);
    const b = {
      mesh,
      x,
      y,
      vx,
      vy,
      dmg,
      radius: long ? 0.28 : 0.15,
      life: 2.5,
      pierce,
      hitSet: pierce ? new WeakSet() : null,
    };
    if (enemy) this.enemyBullets.push(b);
    else this.bullets.push(b);
  }

  _spawnMissile(x, y, dirY) {
    const mesh = createMissileMesh();
    mesh.position.set(x, y, 0);
    this.scene.add(mesh);
    this.bullets.push({
      mesh,
      x,
      y,
      vx: 10,
      vy: dirY * 2,
      dmg: 3,
      radius: 0.2,
      life: 2.5,
      missile: true,
      target: null,
    });
  }

  _spawnEnemyBullet(x, y, tx, ty, speed) {
    const dx = tx - x;
    const dy = ty - y;
    const len = Math.hypot(dx, dy) || 1;
    const mesh = createBulletMesh(0xff4d6d, false);
    mesh.scale.setScalar(1.1);
    mesh.position.set(x, y, 0);
    this.scene.add(mesh);
    this.enemyBullets.push({
      mesh,
      x,
      y,
      vx: (dx / len) * speed,
      vy: (dy / len) * speed,
      dmg: 1,
      radius: 0.18,
      life: 4,
    });
  }

  _spawnCapsule(x, y) {
    const mesh = createCapsuleMesh();
    mesh.position.set(x, y, 0);
    this.scene.add(mesh);
    this.capsules.push({
      mesh,
      x,
      y,
      vx: -2.5,
      vy: (Math.random() - 0.5) * 1.5,
      radius: 0.4,
      life: 12,
    });
  }

  // ---------- Damage / kills ----------
  _damageEnemy(e, dmg, hitPos) {
    e.hp -= dmg;
    this.particles.burst(hitPos, 0xff3ec8, 4, 3, 0.25, 0.08);
    if (e.hp <= 0) this._killEnemy(e);
  }

  _killEnemy(e) {
    const idx = this.enemies.indexOf(e);
    if (idx >= 0) this.enemies.splice(idx, 1);
    this.scene.remove(e.mesh);

    this.combo += 1;
    this.comboTimer = 2.2;
    if (!this._bestCombo || this.combo > this._bestCombo) this._bestCombo = this.combo;
    const mult = Math.min(8, 1 + Math.floor(this.combo / 3));
    const pts = Math.floor(e.score * mult);
    this.score += pts;
    this.kills += 1;
    this.waveKills += 1;

    this.particles.burst(
      new THREE.Vector3(e.x, e.y, 0),
      0x3ef0ff,
      18,
      6,
      0.55,
      0.14
    );
    this.particles.burst(
      new THREE.Vector3(e.x, e.y, 0),
      0xff3ec8,
      10,
      4,
      0.4,
      0.1
    );
    this.audio.explode(e.score >= 400);
    this.shake.add(e.score >= 400 ? 0.25 : 0.08);

    // capsule drop — higher early, still rewarding later
    const dropChance = 0.28 + Math.min(0.1, this.wave * 0.01);
    if (Math.random() < dropChance || e.score >= 400) {
      this._spawnCapsule(e.x, e.y);
    }

    this._updateHUD();
    this._checkWaveClear();
  }

  _damageBoss(dmg, hitPos) {
    if (!this.boss) return;
    this.boss.hp -= dmg;
    this.particles.burst(hitPos, 0xffd166, 6, 4, 0.3, 0.1);
    this.audio.hit();
    this.shake.add(0.06);
    // flash core
    if (this.boss.mesh.userData.core) {
      this.boss.mesh.userData.core.material.emissiveIntensity = 1.5;
    }
    if (this.boss.hp <= this.boss.maxHp * 0.5 && this.bossPhase === 0) {
      this.bossPhase = 1;
      this._announce("PHASE 2");
    }
    if (this.boss.hp <= this.boss.maxHp * 0.2 && this.bossPhase === 1) {
      this.bossPhase = 2;
      this._announce("CRITICAL");
    }
    if (this.boss.hp <= 0) this._killBoss();
    this._updateHUD();
  }

  _killBoss() {
    const b = this.boss;
    if (!b) return;
    this.score += b.score;
    this.kills += 1;
    // Boss victory clears the sector
    this.waveKills = this.waveTarget;
    for (let i = 0; i < 8; i++) {
      const p = new THREE.Vector3(
        b.x + (Math.random() - 0.5) * 4,
        b.y + (Math.random() - 0.5) * 4,
        0
      );
      this.particles.burst(p, 0x9b5cff, 25, 8, 0.8, 0.2);
      this.particles.burst(p, 0x3ef0ff, 15, 6, 0.6, 0.15);
    }
    this.scene.remove(b.mesh);
    this.boss = null;
    this.audio.explode(true);
    this.shake.add(0.85);
    this.timeScale = 0.25;
    setTimeout(() => {
      this.timeScale = 1;
    }, 600);
    this._spawnCapsule(b.x, b.y);
    this._spawnCapsule(b.x, b.y + 1);
    this._spawnCapsule(b.x, b.y - 1);
    this.starfield.scrollMul = 1;
    this._announce("SERAPH DOWN");
    this.audio.waveClear();
    this._updateHUD();
    // Advance after short beat so player can grab capsules
    setTimeout(() => {
      if (this.state === "playing") this._checkWaveClear();
    }, 900);
  }

  _checkWaveClear() {
    if (this.boss) return;
    if (this.waveKills >= this.waveTarget && this.enemies.length === 0) {
      this.wave += 1;
      this.waveKills = 0;
      this.waveTarget = 10 + this.wave * 3;
      this.waveTimer = 0;
      this.spawnTimer = this.wave % 5 === 0 ? 1.2 : 2;
      this._bossSpawnedThisWave = false;
      this.score += this.wave * 500;
      this._announce(`SECTOR ${this.wave}`);
      this.audio.waveClear();
      this._updateHUD();
    }
  }

  _playerHit() {
    if (this.invuln > 0) return;
    if (this.powerLevels.shield) {
      this.powerLevels.shield = false;
      this.shieldMesh.visible = false;
      this.invuln = 1.2;
      this.audio.playerHit();
      this.particles.burst(
        new THREE.Vector3(this.player.x, this.player.y, 0),
        0x5dff9a,
        30,
        7,
        0.5,
        0.15
      );
      this.shake.add(0.4);
      this._announce("AEGIS BROKEN");
      this._updateHUD();
      return;
    }

    this.lives -= 1;
    this.invuln = 2.5;
    this.combo = 0;
    this._dropPowerOnDeath();
    this._flashDamage();
    this.audio.playerHit();
    this.shake.add(0.7);
    this.particles.burst(
      new THREE.Vector3(this.player.x, this.player.y, 0),
      0xff4d6d,
      40,
      9,
      0.7,
      0.18
    );
    this._updateHUD();

    if (this.lives <= 0) {
      this._gameOver();
    } else {
      this._announce("HULL DAMAGE");
      this.player.x = -6;
      this.player.y = 0;
    }
  }

  // ---------- Updates ----------
  _updatePlayer(dt) {
    if (!this.player.alive) return;

    const baseSpeed = 9 + this.powerLevels.speed * 1.6;
    let ix = 0;
    let iy = 0;
    if (this.keys.has("a") || this.keys.has("arrowleft")) ix -= 1;
    if (this.keys.has("d") || this.keys.has("arrowright")) ix += 1;
    if (this.keys.has("w") || this.keys.has("arrowup")) iy += 1;
    if (this.keys.has("s") || this.keys.has("arrowdown")) iy -= 1;
    if (ix && iy) {
      ix *= 0.707;
      iy *= 0.707;
    }

    // smooth accel
    const targetVx = ix * baseSpeed;
    const targetVy = iy * baseSpeed;
    this.player.vx += (targetVx - this.player.vx) * Math.min(1, 12 * dt);
    this.player.vy += (targetVy - this.player.vy) * Math.min(1, 12 * dt);

    this.player.x += this.player.vx * dt;
    this.player.y += this.player.vy * dt;
    this.player.x = Math.max(PLAY_BOUNDS.xMin, Math.min(PLAY_BOUNDS.xMax, this.player.x));
    this.player.y = Math.max(PLAY_BOUNDS.yMin, Math.min(PLAY_BOUNDS.yMax, this.player.y));

    const m = this.player.mesh;
    m.position.set(this.player.x, this.player.y, 0);
    // bank / tilt
    m.rotation.z = THREE.MathUtils.lerp(m.rotation.z, -this.player.vy * 0.04, 1 - Math.pow(0.001, dt));
    m.rotation.x = THREE.MathUtils.lerp(m.rotation.x, this.player.vy * 0.02, 1 - Math.pow(0.001, dt));
    m.rotation.y = THREE.MathUtils.lerp(m.rotation.y, this.player.vx * 0.015, 1 - Math.pow(0.001, dt));

    // engine pulse
    if (m.userData.engine) {
      const pulse = 0.85 + Math.sin(this.elapsed * 18) * 0.15 + Math.abs(this.player.vx) * 0.02;
      m.userData.engine.scale.set(1.4 * pulse, 0.7 * pulse, 0.7 * pulse);
      // thruster particles
      if (Math.random() < 0.5) {
        this.particles.streak(
          new THREE.Vector3(this.player.x - 0.8, this.player.y + (Math.random() - 0.5) * 0.2, 0),
          new THREE.Vector3(-1, 0, 0),
          0x3ef0ff,
          1
        );
      }
    }

    // invuln blink
    if (this.invuln > 0) {
      this.invuln -= dt;
      m.visible = Math.sin(this.elapsed * 30) > 0;
    } else {
      m.visible = true;
    }

    this.playerLight.position.set(this.player.x, this.player.y, 2);

    // shield
    if (this.powerLevels.shield) {
      this.shieldMesh.visible = true;
      this.shieldMesh.position.set(this.player.x, this.player.y, 0);
      this.shieldMesh.rotation.y += dt * 2;
      this.shieldMesh.rotation.x += dt * 1.2;
      this.shieldMesh.material.opacity = 0.18 + Math.sin(this.elapsed * 5) * 0.06;
    }

    // options orbit
    for (const o of this.options) {
      o.phase += dt * 2.8;
      const ox = this.player.x - 0.3 + Math.cos(o.phase) * o.radius * 0.35;
      const oy = this.player.y + Math.sin(o.phase) * o.radius;
      o.mesh.position.set(ox, oy, 0);
      o.mesh.rotation.y += dt * 4;
      if (o.mesh.userData.ring) o.mesh.userData.ring.rotation.z += dt * 3;
    }

    this._tryFire();
    if (this.fireCooldown > 0) this.fireCooldown -= dt;
    if (this.missileCooldown > 0) this.missileCooldown -= dt;
  }

  _updateBullets(dt) {
    // player bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      if (b.missile) {
        // mild home toward nearest enemy
        let best = null;
        let bestD = 12;
        for (const e of this.enemies) {
          const d = Math.hypot(e.x - b.x, e.y - b.y);
          if (d < bestD) {
            bestD = d;
            best = e;
          }
        }
        if (this.boss) {
          const d = Math.hypot(this.boss.x - b.x, this.boss.y - b.y);
          if (d < bestD) {
            best = this.boss;
            bestD = d;
          }
        }
        if (best) {
          const dy = best.y - b.y;
          b.vy += Math.sign(dy) * 18 * dt;
          b.vy = THREE.MathUtils.clamp(b.vy, -8, 8);
        }
        b.vx = Math.min(16, b.vx + 8 * dt);
      }
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= dt;
      b.mesh.position.set(b.x, b.y, 0);
      if (b.missile) b.mesh.rotation.z = Math.atan2(b.vy, b.vx);

      if (b.life <= 0 || b.x > 16 || b.x < -16 || b.y > 10 || b.y < -10) {
        this.scene.remove(b.mesh);
        this.bullets.splice(i, 1);
        continue;
      }

      // hit enemies
      let consumed = false;
      for (const e of this.enemies) {
        if (b.hitSet?.has(e)) continue;
        if (Math.hypot(e.x - b.x, e.y - b.y) < e.radius + b.radius) {
          this._damageEnemy(e, b.dmg, new THREE.Vector3(b.x, b.y, 0));
          this.audio.hit();
          if (b.pierce) {
            b.hitSet.add(e);
            // slight damage falloff after pierce
            b.dmg *= 0.85;
          } else {
            consumed = true;
            break;
          }
        }
      }
      if (!consumed && this.boss) {
        if (!b.hitSet?.has(this.boss) &&
            Math.hypot(this.boss.x - b.x, this.boss.y - b.y) < this.boss.radius + b.radius) {
          this._damageBoss(b.dmg, new THREE.Vector3(b.x, b.y, 0));
          this.audio.hit();
          if (b.pierce) {
            b.hitSet.add(this.boss);
          } else {
            consumed = true;
          }
        }
      }
      if (consumed) {
        this.scene.remove(b.mesh);
        this.bullets.splice(i, 1);
      }
    }

    // enemy bullets
    for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
      const b = this.enemyBullets[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= dt;
      b.mesh.position.set(b.x, b.y, 0);
      if (b.life <= 0 || b.x < -16 || b.x > 16 || Math.abs(b.y) > 10) {
        this.scene.remove(b.mesh);
        this.enemyBullets.splice(i, 1);
        continue;
      }
      if (
        this.player.alive &&
        this.invuln <= 0 &&
        Math.hypot(b.x - this.player.x, b.y - this.player.y) < this.player.radius + b.radius
      ) {
        this.scene.remove(b.mesh);
        this.enemyBullets.splice(i, 1);
        this._playerHit();
      }
    }
  }

  _updateEnemies(dt) {
    const d = this._difficulty();
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.t += dt;

      switch (e.ai) {
        case "sine":
          e.x += e.vx * dt;
          e.y += Math.sin(e.t * 3 + e.phase) * (e.amp || 2.5) * dt * 2.2;
          break;
        case "chase":
          e.x += e.vx * dt;
          e.vy += (this.player.y - e.y) * 1.5 * dt;
          e.vy = THREE.MathUtils.clamp(e.vy, -4, 4);
          e.y += e.vy * dt;
          break;
        case "spin":
          e.x += e.vx * 0.7 * dt;
          e.y += Math.sin(e.t * 2) * 3 * dt;
          if (e.mesh.userData.spin) e.mesh.userData.spin.rotation.x += dt * 5;
          e.mesh.rotation.z += dt * 3;
          break;
        case "tank":
          e.x += e.vx * dt;
          e.y += Math.sin(e.t * 0.8) * 0.5 * dt;
          break;
        default:
          e.x += e.vx * dt;
          e.y += e.vy * dt;
      }

      e.mesh.position.set(e.x, e.y, 0);
      // face left-ish with slight bank
      e.mesh.rotation.y = Math.sin(e.t * 2) * 0.2;

      // shoot
      e.shootCd -= dt;
      if (e.shootCd <= 0 && e.x < 12 && e.x > -10) {
        const rate = e.ai === "tank" ? 0.7 : e.ai === "spinner" ? 0.9 : 1.4;
        e.shootCd = rate / Math.max(0.5, d.shootChance * 3);
        if (Math.random() < d.shootChance + 0.25) {
          this._spawnEnemyBullet(e.x - 0.3, e.y, this.player.x, this.player.y, d.bulletSpeed);
          if (e.ai === "tank" || e.ai === "spinner") {
            this._spawnEnemyBullet(e.x - 0.3, e.y, this.player.x, this.player.y + 1.5, d.bulletSpeed * 0.9);
            this._spawnEnemyBullet(e.x - 0.3, e.y, this.player.x, this.player.y - 1.5, d.bulletSpeed * 0.9);
          }
        }
      }

      // collide player
      if (
        this.player.alive &&
        this.invuln <= 0 &&
        Math.hypot(e.x - this.player.x, e.y - this.player.y) < e.radius + this.player.radius
      ) {
        this._playerHit();
        this._damageEnemy(e, 5, new THREE.Vector3(e.x, e.y, 0));
      }

      if (e.x < -16 || e.y > 12 || e.y < -12) {
        this.scene.remove(e.mesh);
        this.enemies.splice(i, 1);
      }
    }
  }

  _updateBoss(dt) {
    const b = this.boss;
    if (!b) return;
    b.t += dt;

    // enter from right
    if (!b.entered) {
      b.x += b.vx * dt * 2;
      if (b.x <= 6.5) {
        b.x = 6.5;
        b.entered = true;
        b.vx = 0;
      }
    } else {
      // weave
      b.y = Math.sin(b.t * 0.7) * 3.5;
      b.x = 6.5 + Math.sin(b.t * 0.35) * 1.2;
      // spin rings
      for (let i = 0; i < 3; i++) {
        const r = b.mesh.userData[`ring${i}`];
        if (r) {
          r.rotation.x += dt * (0.5 + i * 0.3);
          r.rotation.z += dt * (0.3 - i * 0.1);
        }
      }
      if (b.mesh.userData.core) {
        b.mesh.userData.core.rotation.y += dt * 0.5;
        b.mesh.userData.core.material.emissiveIntensity = THREE.MathUtils.lerp(
          b.mesh.userData.core.material.emissiveIntensity || 0.25,
          0.25,
          1 - Math.pow(0.01, dt)
        );
      }
      if (b.mesh.userData.eye) {
        b.mesh.userData.eye.scale.setScalar(1 + Math.sin(b.t * 6) * 0.1);
      }
    }

    b.mesh.position.set(b.x, b.y, 0);

    // attacks
    b.shootCd -= dt;
    if (b.entered && b.shootCd <= 0) {
      const phase = this.bossPhase;
      const spd = 5 + this.wave * 0.3 + phase * 1.5;
      if (phase === 0) {
        // aimed shots
        for (let i = -1; i <= 1; i++) {
          this._spawnEnemyBullet(b.x - 1.5, b.y, this.player.x, this.player.y + i * 1.2, spd);
        }
        b.shootCd = 0.85;
      } else if (phase === 1) {
        // radial burst
        const n = 10;
        for (let i = 0; i < n; i++) {
          const ang = (i / n) * Math.PI * 2 + b.t;
          const mesh = createBulletMesh(0xff3ec8, false);
          mesh.position.set(b.x, b.y, 0);
          this.scene.add(mesh);
          this.enemyBullets.push({
            mesh,
            x: b.x,
            y: b.y,
            vx: Math.cos(ang) * spd * 0.9,
            vy: Math.sin(ang) * spd * 0.9,
            dmg: 1,
            radius: 0.18,
            life: 4,
          });
        }
        b.shootCd = 1.1;
      } else {
        // spiral + aimed
        for (let i = 0; i < 6; i++) {
          const ang = b.t * 3 + (i / 6) * Math.PI * 2;
          const mesh = createBulletMesh(0xffd166, false);
          mesh.position.set(b.x, b.y, 0);
          this.scene.add(mesh);
          this.enemyBullets.push({
            mesh,
            x: b.x,
            y: b.y,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd,
            dmg: 1,
            radius: 0.18,
            life: 4,
          });
        }
        this._spawnEnemyBullet(b.x - 1.5, b.y, this.player.x, this.player.y, spd * 1.3);
        b.shootCd = 0.55;
      }
    }

    // body collide
    if (
      this.player.alive &&
      this.invuln <= 0 &&
      Math.hypot(b.x - this.player.x, b.y - this.player.y) < b.radius * 0.7 + this.player.radius
    ) {
      this._playerHit();
    }
  }

  _updateCapsules(dt) {
    for (let i = this.capsules.length - 1; i >= 0; i--) {
      const c = this.capsules[i];
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      c.vy += Math.sin(this.elapsed * 3 + i) * dt * 0.5;
      c.life -= dt;
      c.mesh.position.set(c.x, c.y, 0);
      c.mesh.rotation.z += dt * 2;
      if (c.mesh.userData.ring) c.mesh.userData.ring.rotation.x += dt * 3;

      if (c.life <= 0 || c.x < -14) {
        this.scene.remove(c.mesh);
        this.capsules.splice(i, 1);
        continue;
      }

      if (Math.hypot(c.x - this.player.x, c.y - this.player.y) < c.radius + this.player.radius + 0.2) {
        this.scene.remove(c.mesh);
        this.capsules.splice(i, 1);
        this._collectCapsule();
        this.particles.burst(new THREE.Vector3(c.x, c.y, 0), 0xffd166, 12, 4, 0.4, 0.12);
      }
    }
  }

  _updateSpawner(dt) {
    if (this.boss) return;
    this.waveTimer += dt;
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this._spawnWavePattern();
      const d = this._difficulty();
      this.spawnTimer = d.spawnRate * (0.75 + Math.random() * 0.5);
      // accelerate slightly within wave
      if (this.waveKills > this.waveTarget * 0.6) this.spawnTimer *= 0.75;
    }
  }

  _updateTitle(dt) {
    if (this.titleShip) {
      this.titleShip.rotation.y += dt * 0.6;
      this.titleShip.rotation.x = Math.sin(this.elapsed * 0.7) * 0.15;
      this.titleShip.position.y = 0.5 + Math.sin(this.elapsed * 0.9) * 0.35;
      if (this.titleShip.userData.engine) {
        const p = 0.9 + Math.sin(this.elapsed * 12) * 0.2;
        this.titleShip.userData.engine.scale.set(1.4 * p, 0.7 * p, 0.7 * p);
      }
    }
  }

  _update(dt) {
    const raw = dt;
    dt = Math.min(0.05, dt) * this.timeScale;
    this.elapsed += raw;

    this.starfield.update(dt);
    this.nebula.update(dt, this.elapsed);
    this.particles.update(dt);
    this.shake.update(raw, this.camera, this.camBase);

    // subtle camera follow
    if (this.state === "playing") {
      this.camBase.x = this.player.x * 0.04;
      this.camBase.y = this.player.y * 0.06;
    } else {
      this.camBase.x = 0;
      this.camBase.y = 0;
    }

    if (this.announceTimer > 0) {
      this.announceTimer -= raw;
      if (this.announceTimer <= 0) {
        document.getElementById("announcer").classList.remove("show");
      }
    }

    if (this.state === "title") {
      this._updateTitle(dt);
      return;
    }

    if (this.state !== "playing") return;

    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.combo = 0;
        this._updateHUD();
      }
    }

    this._updatePlayer(dt);
    this._updateBullets(dt);
    this._updateEnemies(dt);
    this._updateBoss(dt);
    this._updateCapsules(dt);
    this._updateSpawner(dt);

    // score tick slow passive for survival
    // (none — pure skill score)
  }

  _loop() {
    requestAnimationFrame(() => this._loop());
    const dt = this.clock.getDelta();
    this._update(dt);
    this.renderer.render(this.scene, this.camera);
  }
}
