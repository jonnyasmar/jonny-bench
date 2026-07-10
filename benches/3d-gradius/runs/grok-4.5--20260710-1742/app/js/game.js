/**
 * VOID DRIFT — original 3D side-scrolling shooter
 * Three.js · pure client-side
 */
import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Constants & helpers
// ---------------------------------------------------------------------------
const PLAY = { xMin: -11, xMax: 11, yMin: -6.2, yMax: 6.2 };
const SCROLL = 4.2;
const HI_KEY = 'voiddrift_hi';

const $ = (id) => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (a, b) => a + Math.random() * (b - a);
const chance = (p) => Math.random() < p;
const pick = (arr) => arr[(Math.random() * arr.length) | 0];

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------
const keys = Object.create(null);
const input = {
  x: 0,
  y: 0,
  fire: false,
  firePressed: false,
  pausePressed: false,
  mutePressed: false,
};

window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
    e.preventDefault();
  }
  if (e.code === 'KeyP') input.pausePressed = true;
  if (e.code === 'KeyM') input.mutePressed = true;
  if (e.code === 'Space' || e.code === 'KeyZ') input.firePressed = true;
});
window.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

function pollInput() {
  let x = 0, y = 0;
  if (keys['KeyA'] || keys['ArrowLeft']) x -= 1;
  if (keys['KeyD'] || keys['ArrowRight']) x += 1;
  if (keys['KeyW'] || keys['ArrowUp']) y += 1;
  if (keys['KeyS'] || keys['ArrowDown']) y -= 1;
  if (x && y) {
    const inv = 1 / Math.SQRT2;
    x *= inv;
    y *= inv;
  }
  input.x = x;
  input.y = y;
  input.fire = !!(keys['Space'] || keys['KeyZ']);
}

// ---------------------------------------------------------------------------
// Procedural audio (Web Audio API)
// ---------------------------------------------------------------------------
const AudioFX = (() => {
  let ctx = null;
  let muted = false;
  let master = null;
  let musicNodes = null;
  let musicStep = 0;
  let musicTimer = 0;

  function ensure() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.35;
    master.connect(ctx.destination);
  }

  function resume() {
    ensure();
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  function beep(freq, dur, type = 'square', vol = 0.12, slide = 0) {
    if (muted || !ctx) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g);
    g.connect(master);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  function noise(dur, vol = 0.08) {
    if (muted || !ctx) return;
    const n = Math.max(1, (ctx.sampleRate * dur) | 0);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.value = vol;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 900;
    src.connect(f);
    f.connect(g);
    g.connect(master);
    src.start();
  }

  return {
    resume,
    toggleMute() {
      muted = !muted;
      if (master) master.gain.value = muted ? 0 : 0.35;
      return muted;
    },
    isMuted: () => muted,
    shoot() {
      beep(880, 0.05, 'square', 0.05, -400);
    },
    hit() {
      beep(180, 0.08, 'sawtooth', 0.08, -80);
      noise(0.06, 0.05);
    },
    explode() {
      noise(0.22, 0.12);
      beep(120, 0.25, 'sawtooth', 0.1, -90);
    },
    power() {
      beep(440, 0.08, 'triangle', 0.08);
      setTimeout(() => beep(660, 0.1, 'triangle', 0.08), 60);
      setTimeout(() => beep(880, 0.12, 'triangle', 0.07), 120);
    },
    hurt() {
      beep(90, 0.2, 'sawtooth', 0.12, -40);
      noise(0.15, 0.1);
    },
    wave() {
      beep(330, 0.1, 'triangle', 0.07);
      setTimeout(() => beep(495, 0.14, 'triangle', 0.07), 90);
    },
    boss() {
      beep(55, 0.4, 'sawtooth', 0.12);
      setTimeout(() => beep(70, 0.5, 'sawtooth', 0.1), 200);
    },
    ui() {
      beep(520, 0.06, 'square', 0.05);
    },
    updateMusic(dt, intensity = 1) {
      if (muted || !ctx) return;
      musicTimer -= dt;
      if (musicTimer > 0) return;
      const bpm = 96 + intensity * 18;
      musicTimer = 60 / bpm / 2;
      const scale = [55, 65.41, 73.42, 82.41, 98, 110, 130.81];
      const note = scale[musicStep % scale.length];
      musicStep++;
      if (musicStep % 4 === 0) beep(note * 2, 0.12, 'triangle', 0.025);
      if (musicStep % 8 === 0) beep(note, 0.18, 'sine', 0.03);
      if (musicStep % 2 === 0) {
        // soft kick
        beep(70, 0.08, 'sine', 0.04, -40);
      }
    },
  };
})();

// ---------------------------------------------------------------------------
// Particles
// ---------------------------------------------------------------------------
class ParticleSystem {
  constructor(scene, max = 500) {
    this.max = max;
    this.alive = [];
    this.pool = [];
    const geo = new THREE.SphereGeometry(0.12, 6, 6);
    this.geo = geo;
    this.scene = scene;
    for (let i = 0; i < max; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 1,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const m = new THREE.Mesh(geo, mat);
      m.visible = false;
      scene.add(m);
      this.pool.push({ mesh: m, vel: new THREE.Vector3(), life: 0, maxLife: 1, drag: 0.98, grow: 0 });
    }
  }

  emit(x, y, z, opts = {}) {
    const n = opts.count ?? 8;
    for (let i = 0; i < n; i++) {
      const p = this.pool.pop();
      if (!p) break;
      p.mesh.visible = true;
      p.mesh.position.set(x, y, z);
      const s = opts.size ?? rand(0.08, 0.22);
      p.mesh.scale.setScalar(s);
      p.mesh.material.color.set(opts.color ?? 0x3de7ff);
      p.mesh.material.opacity = opts.opacity ?? 1;
      const spread = opts.spread ?? 1.2;
      const speed = opts.speed ?? 4;
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * speed;
      p.vel.set(
        Math.cos(a) * r * (opts.dirX ?? 1) + (opts.biasX ?? 0),
        Math.sin(a) * r * spread * 0.6 + (opts.biasY ?? 0),
        (Math.random() - 0.5) * speed * 0.3
      );
      if (opts.cone) {
        p.vel.x = -Math.abs(p.vel.x) - speed * 0.4;
      }
      p.life = opts.life ?? rand(0.25, 0.7);
      p.maxLife = p.life;
      p.drag = opts.drag ?? 0.96;
      p.grow = opts.grow ?? -0.5;
      this.alive.push(p);
    }
  }

  burst(x, y, z, color, count = 18) {
    this.emit(x, y, z, { count, color, speed: 7, spread: 0.16, life: 0.55 });
    this.emit(x, y, z, { count: count >> 1, color: 0xffffff, speed: 3, size: 0.1, life: 0.3 });
  }

  update(dt) {
    for (let i = this.alive.length - 1; i >= 0; i--) {
      const p = this.alive[i];
      p.life -= dt;
      if (p.life <= 0) {
        p.mesh.visible = false;
        this.alive.splice(i, 1);
        this.pool.push(p);
        continue;
      }
      p.vel.multiplyScalar(p.drag);
      p.mesh.position.x += p.vel.x * dt;
      p.mesh.position.y += p.vel.y * dt;
      p.mesh.position.z += p.vel.z * dt;
      const t = p.life / p.maxLife;
      p.mesh.material.opacity = t;
      const sc = p.mesh.scale.x + p.grow * dt;
      p.mesh.scale.setScalar(Math.max(0.01, sc));
    }
  }
}

// ---------------------------------------------------------------------------
// Starfield / environment
// ---------------------------------------------------------------------------
function createStarfield(scene) {
  const layers = [];
  const configs = [
    { n: 400, size: 0.035, speed: 0.4, color: 0x6a7a99, spread: 80 },
    { n: 220, size: 0.06, speed: 1.1, color: 0xa8c4ff, spread: 55 },
    { n: 80, size: 0.1, speed: 2.4, color: 0x3de7ff, spread: 40 },
  ];
  for (const cfg of configs) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(cfg.n * 3);
    for (let i = 0; i < cfg.n; i++) {
      pos[i * 3] = rand(-cfg.spread, cfg.spread);
      pos[i * 3 + 1] = rand(-cfg.spread * 0.55, cfg.spread * 0.55);
      pos[i * 3 + 2] = rand(-18, 6);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: cfg.color,
      size: cfg.size,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);
    layers.push({ pts, speed: cfg.speed, spread: cfg.spread });
  }

  // Distant nebula planes
  const nebMats = [];
  for (let i = 0; i < 3; i++) {
    const c = [0x1a1040, 0x0a2038, 0x2a0a28][i];
    const g = new THREE.PlaneGeometry(60, 30);
    const m = new THREE.MeshBasicMaterial({
      color: c,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set(i * 8 - 8, (i - 1) * 3, -12 - i * 2);
    mesh.rotation.z = i * 0.3;
    scene.add(mesh);
    nebMats.push({ mesh, speed: 0.15 + i * 0.08, baseX: mesh.position.x });
  }

  // Floor grid suggestion
  const gridHelper = new THREE.GridHelper(80, 40, 0x1a3048, 0x0c1828);
  gridHelper.position.set(0, -7.5, -4);
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.35;
  scene.add(gridHelper);

  return {
    update(dt, scrollMul = 1) {
      for (const L of layers) {
        const attr = L.pts.geometry.attributes.position;
        const arr = attr.array;
        for (let i = 0; i < arr.length; i += 3) {
          arr[i] -= L.speed * scrollMul * dt * SCROLL * 1.4;
          if (arr[i] < -L.spread) {
            arr[i] = L.spread;
            arr[i + 1] = rand(-L.spread * 0.55, L.spread * 0.55);
          }
        }
        attr.needsUpdate = true;
      }
      for (const n of nebMats) {
        n.mesh.position.x -= n.speed * scrollMul * dt * SCROLL;
        if (n.mesh.position.x < -40) n.mesh.position.x = 40;
      }
      gridHelper.position.x -= 2.2 * scrollMul * dt;
      if (gridHelper.position.x < -2) gridHelper.position.x += 2;
    },
  };
}

// ---------------------------------------------------------------------------
// Geometry factories — original shapes
// ---------------------------------------------------------------------------
function makePlayerMesh() {
  const g = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x0e1a28,
    metalness: 0.7,
    roughness: 0.28,
    emissive: 0x0a3040,
    emissiveIntensity: 0.4,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: 0x3de7ff,
    metalness: 0.2,
    roughness: 0.35,
    emissive: 0x3de7ff,
    emissiveIntensity: 0.9,
  });
  const wingMat = new THREE.MeshStandardMaterial({
    color: 0x1a2840,
    metalness: 0.6,
    roughness: 0.35,
    emissive: 0x102030,
    emissiveIntensity: 0.3,
  });

  // Core hull
  const hull = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.35, 5), bodyMat);
  hull.rotation.z = -Math.PI / 2;
  hull.scale.set(1, 1.1, 0.55);
  g.add(hull);

  // Cockpit crystal
  const cock = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), accentMat);
  cock.position.set(0.15, 0.08, 0.12);
  cock.scale.set(1.2, 0.7, 0.6);
  g.add(cock);

  // Wings
  const wingGeo = new THREE.BoxGeometry(0.55, 0.08, 1.1);
  const w1 = new THREE.Mesh(wingGeo, wingMat);
  w1.position.set(-0.15, 0, 0.45);
  w1.rotation.x = 0.15;
  g.add(w1);
  const w2 = w1.clone();
  w2.position.z = -0.45;
  w2.rotation.x = -0.15;
  g.add(w2);

  // Twin thrusters
  const thrMat = new THREE.MeshBasicMaterial({
    color: 0xff6a3d,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
  });
  for (const z of [-0.22, 0.22]) {
    const thr = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.35, 6), thrMat);
    thr.rotation.z = Math.PI / 2;
    thr.position.set(-0.55, 0, z);
    thr.name = 'thruster';
    g.add(thr);
  }

  // Nose spike
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.4, 4), accentMat);
  nose.rotation.z = -Math.PI / 2;
  nose.position.set(0.75, 0, 0);
  g.add(nose);

  g.traverse((c) => {
    if (c.isMesh) {
      c.castShadow = false;
      c.receiveShadow = false;
    }
  });
  return g;
}

function makeEnemyMesh(type) {
  const g = new THREE.Group();
  const palette = {
    drone: { body: 0x2a1030, glow: 0xff3d9a },
    dart: { body: 0x102818, glow: 0x7dff9a },
    tank: { body: 0x281810, glow: 0xffc14d },
    spinner: { body: 0x101828, glow: 0x9b7bff },
    turret: { body: 0x1a1020, glow: 0xff5a7a },
    boss: { body: 0x180818, glow: 0xff3d9a },
  };
  const pal = palette[type] || palette.drone;

  const bodyMat = new THREE.MeshStandardMaterial({
    color: pal.body,
    metalness: 0.55,
    roughness: 0.4,
    emissive: pal.glow,
    emissiveIntensity: 0.25,
  });
  const glowMat = new THREE.MeshStandardMaterial({
    color: pal.glow,
    emissive: pal.glow,
    emissiveIntensity: 1.1,
    metalness: 0.2,
    roughness: 0.3,
  });

  if (type === 'drone') {
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.38, 0), bodyMat);
    g.add(core);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.05, 6, 16), glowMat);
    ring.rotation.x = Math.PI / 2;
    g.add(ring);
  } else if (type === 'dart') {
    const body = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.0, 4), bodyMat);
    body.rotation.z = Math.PI / 2;
    g.add(body);
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.06, 0.55), glowMat);
    fin.position.set(0.1, 0, 0);
    g.add(fin);
  } else if (type === 'tank') {
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 0.7), bodyMat);
    g.add(body);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 6), glowMat);
    dome.position.set(-0.1, 0.25, 0);
    g.add(dome);
  } else if (type === 'spinner') {
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.35, 0), bodyMat);
    g.add(core);
    for (let i = 0; i < 3; i++) {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.1, 0.12), glowMat);
      arm.rotation.z = (i / 3) * Math.PI * 2;
      arm.name = 'spinarm';
      g.add(arm);
    }
  } else if (type === 'turret') {
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 0.35, 6), bodyMat);
    g.add(base);
    const gun = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.14, 0.14), glowMat);
    gun.position.set(-0.25, 0.2, 0);
    gun.name = 'gun';
    g.add(gun);
  } else if (type === 'boss') {
    const core = new THREE.Mesh(new THREE.DodecahedronGeometry(1.4, 0), bodyMat);
    g.add(core);
    const halo = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.08, 6, 32), glowMat);
    halo.rotation.x = Math.PI / 2;
    halo.name = 'halo';
    g.add(halo);
    for (let i = 0; i < 4; i++) {
      const pod = new THREE.Mesh(new THREE.OctahedronGeometry(0.4, 0), glowMat);
      const a = (i / 4) * Math.PI * 2;
      pod.position.set(Math.cos(a) * 1.6, Math.sin(a) * 1.1, 0);
      pod.name = 'pod';
      g.add(pod);
    }
  }

  return g;
}

function makeBulletMesh(friendly, heavy = false) {
  const color = friendly ? (heavy ? 0xffc14d : 0x3de7ff) : 0xff3d9a;
  const mat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  let mesh;
  if (heavy) {
    mesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.55, 4, 6), mat);
    mesh.rotation.z = Math.PI / 2;
  } else if (friendly) {
    mesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.35, 3, 6), mat);
    mesh.rotation.z = Math.PI / 2;
  } else {
    mesh = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), mat);
  }
  // glow shell
  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(friendly ? 0.18 : 0.2, 6, 6),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  const g = new THREE.Group();
  g.add(mesh);
  g.add(glow);
  return g;
}

function makePowerupMesh(kind) {
  const colors = {
    multi: 0x3de7ff,
    speed: 0x7dff9a,
    shield: 0x5a9bff,
    beam: 0xffc14d,
    heal: 0xff7ab0,
  };
  const c = colors[kind] || 0xffffff;
  const g = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.32, 0),
    new THREE.MeshStandardMaterial({
      color: c,
      emissive: c,
      emissiveIntensity: 0.85,
      metalness: 0.3,
      roughness: 0.25,
      transparent: true,
      opacity: 0.95,
    })
  );
  g.add(core);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.04, 6, 20),
    new THREE.MeshBasicMaterial({
      color: c,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  ring.rotation.x = Math.PI / 2;
  g.add(ring);
  g.userData.kind = kind;
  return g;
}

// ---------------------------------------------------------------------------
// Game
// ---------------------------------------------------------------------------
class Game {
  constructor() {
    this.canvas = $('c');
    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch (err) {
      document.body.innerHTML =
        '<div style="color:#e8f4ff;font-family:system-ui;padding:40px;text-align:center">' +
        '<h1>VOID DRIFT</h1><p>WebGL is required to play. Please enable hardware acceleration.</p></div>';
      throw err;
    }
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x05060c, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x05060c, 0.028);

    this.camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 120);
    this.camera.position.set(-1.5, 1.2, 14.5);
    this.camera.lookAt(0.5, 0, 0);

    // Lights
    const amb = new THREE.AmbientLight(0x405070, 0.55);
    this.scene.add(amb);
    const key = new THREE.DirectionalLight(0xc8e8ff, 1.1);
    key.position.set(-4, 8, 10);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0xff3d9a, 0.35);
    rim.position.set(6, -2, -4);
    this.scene.add(rim);
    const fill = new THREE.PointLight(0x3de7ff, 0.6, 40);
    fill.position.set(-6, 2, 4);
    this.scene.add(fill);
    this.fillLight = fill;

    this.stars = createStarfield(this.scene);
    this.particles = new ParticleSystem(this.scene, 520);

    // Player
    this.player = {
      mesh: makePlayerMesh(),
      x: -7,
      y: 0,
      vx: 0,
      vy: 0,
      hp: 5,
      maxHp: 5,
      shield: 0,
      maxShield: 3,
      lives: 2,
      invuln: 0,
      fireCd: 0,
      multi: 0,
      beam: 0,
      speedBoost: 0,
      dead: false,
      thrusterPhase: 0,
    };
    this.scene.add(this.player.mesh);

    // Shield bubble
    this.shieldMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.85, 16, 12),
      new THREE.MeshBasicMaterial({
        color: 0x3de7ff,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        wireframe: true,
      })
    );
    this.shieldMesh.visible = false;
    this.scene.add(this.shieldMesh);

    this.bullets = [];
    this.enemies = [];
    this.powerups = [];
    this.enemyBullets = [];

    this.state = 'title'; // title | play | pause | gameover
    this.score = 0;
    this.hi = Number(localStorage.getItem(HI_KEY) || 0);
    this.wave = 0;
    this.waveTimer = 0;
    this.spawnQueue = [];
    this.elapsed = 0;
    this.shake = 0;
    this.timeScale = 1;
    this.boss = null;
    this.toastTimer = 0;
    this.scrollMul = 1;
    this.bgPulse = 0;

    this._bindUI();
    window.addEventListener('resize', () => this.onResize());
    this.last = performance.now();
    requestAnimationFrame((t) => this.loop(t));
    this.updateHUD();
  }

  _bindUI() {
    $('btn-start').addEventListener('click', () => {
      AudioFX.resume();
      AudioFX.ui();
      this.startGame();
    });
    $('btn-resume').addEventListener('click', () => {
      AudioFX.ui();
      this.setState('play');
    });
    $('btn-quit').addEventListener('click', () => {
      AudioFX.ui();
      this.setState('title');
    });
    $('btn-retry').addEventListener('click', () => {
      AudioFX.resume();
      AudioFX.ui();
      this.startGame();
    });
    $('btn-menu').addEventListener('click', () => {
      AudioFX.ui();
      this.setState('title');
    });
  }

  onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  setState(s) {
    this.state = s;
    $('title-screen').classList.toggle('hidden', s !== 'title');
    $('pause-screen').classList.toggle('hidden', s !== 'pause');
    $('gameover-screen').classList.toggle('hidden', s !== 'gameover');
    $('hud').classList.toggle('hidden', s !== 'play' && s !== 'pause');
  }

  startGame() {
    // Clear entities
    for (const b of this.bullets) this.scene.remove(b.mesh);
    for (const b of this.enemyBullets) this.scene.remove(b.mesh);
    for (const e of this.enemies) this.scene.remove(e.mesh);
    for (const p of this.powerups) this.scene.remove(p.mesh);
    this.bullets.length = 0;
    this.enemyBullets.length = 0;
    this.enemies.length = 0;
    this.powerups.length = 0;
    this.boss = null;
    this.spawnQueue.length = 0;

    const p = this.player;
    p.x = -7;
    p.y = 0;
    p.vx = 0;
    p.vy = 0;
    p.hp = p.maxHp;
    p.shield = 0;
    p.lives = 2;
    p.invuln = 1.5;
    p.fireCd = 0;
    p.multi = 0;
    p.beam = 0;
    p.speedBoost = 0;
    p.dead = false;
    p.mesh.visible = true;
    p.mesh.position.set(p.x, p.y, 0);

    this.score = 0;
    this.wave = 0;
    this.elapsed = 0;
    this.shake = 0;
    this.scrollMul = 1;
    this.timeScale = 1;
    this._waveClearTimer = null;
    this.nextWave();
    this.setState('play');
    this.updateHUD();
    this.showToast('WAVE 1');
  }

  nextWave() {
    this.wave++;
    this.waveTimer = 0;
    AudioFX.wave();
    if (this.wave > 1) this.showToast(`WAVE ${this.wave}`);

    const w = this.wave;
    const q = this.spawnQueue;
    q.length = 0;

    // Progressive difficulty
    const dens = 1 + w * 0.2;
    const hpScale = 1 + (w - 1) * 0.14;

    // Boss every 5 waves
    if (w % 5 === 0) {
      // Warmup trash before the core
      for (let j = 0; j < 4; j++) {
        q.push({ t: 0.5 + j * 0.25, type: 'dart', y: Math.sin(j) * 3, hpMul: hpScale, path: 'sine' });
      }
      q.push({ t: 2.2, type: 'boss', y: 0, hpMul: hpScale });
      this.showToast(w >= 10 ? 'APEX ENTITY' : 'CORE ENTITY');
      AudioFX.boss();
    } else {
      let t = 0.55;
      const patterns = w < 3 ? ['line', 'sine', 'v'] : ['line', 'sine', 'v', 'swarm', 'dive', 'pincer'];
      const count = 5 + Math.floor(w * 1.5);
      for (let i = 0; i < count; i++) {
        const pat = pick(patterns);
        if (pat === 'line') {
          const n = 3 + ((w / 2) | 0);
          const y0 = rand(-4, 4);
          for (let j = 0; j < n; j++) {
            q.push({ t: t + j * 0.26, type: 'drone', y: y0, hpMul: hpScale });
          }
          t += n * 0.26 + 0.45 / dens;
        } else if (pat === 'sine') {
          const n = 5 + (w > 4 ? 2 : 0);
          for (let j = 0; j < n; j++) {
            q.push({
              t: t + j * 0.2,
              type: chance(0.45) ? 'dart' : 'drone',
              y: Math.sin(j * 0.9) * 3.5,
              hpMul: hpScale,
              path: 'sine',
            });
          }
          t += n * 0.2 + 0.35 / dens;
        } else if (pat === 'v') {
          for (let j = -2; j <= 2; j++) {
            q.push({ t: t + Math.abs(j) * 0.12, type: 'dart', y: j * 1.1, hpMul: hpScale });
          }
          t += 0.95 / dens;
        } else if (pat === 'swarm') {
          for (let j = 0; j < 6 + (w > 6 ? 2 : 0); j++) {
            q.push({
              t: t + j * 0.09,
              type: 'spinner',
              y: rand(-5, 5),
              hpMul: hpScale,
            });
          }
          t += 1.1 / dens;
        } else if (pat === 'dive') {
          q.push({ t, type: 'tank', y: rand(-3, 3), hpMul: hpScale * 1.4, path: 'dive' });
          t += 0.75 / dens;
        } else if (pat === 'pincer') {
          for (let j = 0; j < 3; j++) {
            q.push({ t: t + j * 0.15, type: 'dart', y: 4.2 - j * 0.3, hpMul: hpScale });
            q.push({ t: t + j * 0.15, type: 'dart', y: -4.2 + j * 0.3, hpMul: hpScale });
          }
          t += 1.0 / dens;
        }
      }

      // Turrets mid-late
      if (w >= 3) {
        const turrets = 1 + ((w / 4) | 0);
        for (let i = 0; i < turrets; i++) {
          q.push({
            t: rand(1.5, Math.max(2.5, t * 0.65)),
            type: 'turret',
            y: pick([-4.5, -2.5, 2.5, 4.5]),
            hpMul: hpScale * 1.2,
            path: 'hold',
          });
        }
      }

      q.sort((a, b) => a.t - b.t);
    }

    // Powerups during wave
    this.powerDropTimer = 4 + rand(0, 3);
  }

  showToast(msg) {
    const el = $('toast');
    el.textContent = msg;
    el.classList.remove('hidden');
    this.toastTimer = 1.8;
  }

  spawnEnemy(spec) {
    const type = spec.type;
    const mesh = makeEnemyMesh(type);
    const baseHp = {
      drone: 2,
      dart: 1,
      tank: 8,
      spinner: 4,
      turret: 6,
      boss: 80 + this.wave * 12,
    }[type] || 2;

    const e = {
      mesh,
      type,
      x: 13 + rand(0, 1.5),
      y: clamp(spec.y ?? 0, PLAY.yMin + 0.5, PLAY.yMax - 0.5),
      z: 0,
      hp: Math.ceil(baseHp * (spec.hpMul || 1)),
      maxHp: Math.ceil(baseHp * (spec.hpMul || 1)),
      path: spec.path || 'straight',
      t: 0,
      fireCd: rand(0.4, 1.2),
      score: { drone: 100, dart: 150, tank: 400, spinner: 250, turret: 350, boss: 5000 }[type] || 100,
      radius: type === 'boss' ? 1.6 : type === 'tank' ? 0.55 : 0.4,
      speed: type === 'dart' ? 5.5 : type === 'drone' ? 3.2 : type === 'spinner' ? 2.6 : type === 'boss' ? 1.4 : 2.4,
      dead: false,
    };
    mesh.position.set(e.x, e.y, 0);
    this.scene.add(mesh);
    this.enemies.push(e);
    if (type === 'boss') {
      this.boss = e;
      $('boss-bar-wrap').classList.remove('hidden');
      $('boss-name').textContent = this.wave >= 10 ? 'APEX CORE' : 'VOID CORE';
      this.updateBossBar();
    }
  }

  spawnBullet(friendly, x, y, vx, vy, heavy = false, dmg = 1) {
    const mesh = makeBulletMesh(friendly, heavy);
    mesh.position.set(x, y, 0);
    this.scene.add(mesh);
    const b = { mesh, x, y, vx, vy, life: 2.2, friendly, heavy, dmg, radius: heavy ? 0.22 : 0.12 };
    if (friendly) this.bullets.push(b);
    else this.enemyBullets.push(b);
  }

  spawnPowerup(x, y, kind) {
    if (!kind) {
      const pool = ['multi', 'speed', 'shield', 'beam', 'heal'];
      // Weight by need
      if (this.player.hp < 3) pool.push('heal', 'heal');
      if (this.player.shield < 1) pool.push('shield');
      kind = pick(pool);
    }
    const mesh = makePowerupMesh(kind);
    mesh.position.set(x, y, 0);
    this.scene.add(mesh);
    this.powerups.push({ mesh, x, y, kind, t: 0, life: 12, radius: 0.45 });
  }

  playerFire() {
    const p = this.player;
    if (p.fireCd > 0 || p.dead) return;
    const beam = p.beam > 0;
    p.fireCd = beam ? 0.07 : 0.14 - Math.min(0.05, p.multi * 0.012);

    const dmg = beam ? 2 : 1;
    const speed = beam ? 22 : 18;
    this.spawnBullet(true, p.x + 0.7, p.y, speed, 0, beam, dmg);

    if (p.multi >= 1) {
      this.spawnBullet(true, p.x + 0.5, p.y + 0.25, speed, 1.8, beam, dmg);
      this.spawnBullet(true, p.x + 0.5, p.y - 0.25, speed, -1.8, beam, dmg);
    }
    if (p.multi >= 3) {
      this.spawnBullet(true, p.x + 0.3, p.y + 0.45, speed * 0.95, 3.5, false, 1);
      this.spawnBullet(true, p.x + 0.3, p.y - 0.45, speed * 0.95, -3.5, false, 1);
    }

    this.particles.emit(p.x + 0.8, p.y, 0, {
      count: 3,
      color: beam ? 0xffc14d : 0x3de7ff,
      speed: 2,
      life: 0.12,
      biasX: 3,
      size: 0.08,
    });
    AudioFX.shoot();
  }

  damagePlayer(amount) {
    const p = this.player;
    if (p.invuln > 0 || p.dead) return;
    if (p.shield > 0) {
      p.shield = Math.max(0, p.shield - amount);
      p.invuln = 0.6;
      this.shake = Math.max(this.shake, 0.25);
      AudioFX.hit();
      this.particles.emit(p.x, p.y, 0, { count: 10, color: 0x5a9bff, speed: 5 });
      this.updateHUD();
      return;
    }
    p.hp -= amount;
    p.invuln = 1.2;
    this.shake = Math.max(this.shake, 0.45);
    this.timeScale = 0.35;
    AudioFX.hurt();
    this.particles.burst(p.x, p.y, 0, 0xff4d6d, 20);
    if (p.hp <= 0) {
      // lives = remaining extra ships (current hull already spent)
      if (p.lives > 0) {
        p.lives--;
        p.hp = p.maxHp;
        p.invuln = 2.5;
        p.multi = Math.max(0, p.multi - 1);
        p.beam = 0;
        this.showToast('HULL RESTORED');
      } else {
        this.killPlayer();
      }
    }
    this.updateHUD();
  }

  killPlayer() {
    const p = this.player;
    p.dead = true;
    p.mesh.visible = false;
    this.particles.burst(p.x, p.y, 0, 0x3de7ff, 40);
    this.particles.burst(p.x, p.y, 0, 0xff3d9a, 25);
    AudioFX.explode();
    this.shake = 0.8;
    if (this.score > this.hi) {
      this.hi = this.score;
      localStorage.setItem(HI_KEY, String(this.hi));
    }
    $('go-score').textContent = String(this.score);
    $('go-wave').textContent = String(this.wave);
    $('go-title').textContent = 'SHIP LOST';
    setTimeout(() => this.setState('gameover'), 900);
    this.updateHUD();
  }

  killEnemy(e, drop = true) {
    if (e.dead) return;
    e.dead = true;
    this.score += e.score;
    this.particles.burst(e.x, e.y, 0, e.type === 'boss' ? 0xff3d9a : 0xffc14d, e.type === 'boss' ? 50 : 16);
    AudioFX.explode();
    this.shake = Math.max(this.shake, e.type === 'boss' ? 0.7 : 0.15);
    this.scene.remove(e.mesh);

    if (e === this.boss) {
      this.boss = null;
      $('boss-bar-wrap').classList.add('hidden');
      this.score += 2000;
      // Boss drops several powerups
      this.spawnPowerup(e.x, e.y, 'multi');
      this.spawnPowerup(e.x + 0.8, e.y + 0.6, 'shield');
      this.spawnPowerup(e.x - 0.5, e.y - 0.5, 'beam');
      this.showToast('CORE DESTROYED');
    } else if (drop && chance(0.14 + Math.min(0.1, this.wave * 0.01))) {
      this.spawnPowerup(e.x, e.y);
    }

    this.updateHUD();
  }

  applyPowerup(kind) {
    const p = this.player;
    AudioFX.power();
    this.particles.emit(p.x, p.y, 0, { count: 16, color: 0xffffff, speed: 4, life: 0.4 });
    if (kind === 'multi') {
      p.multi = Math.min(4, p.multi + 1);
      this.showToast(p.multi >= 3 ? 'SPREAD MAX' : 'SPREAD +');
    } else if (kind === 'speed') {
      p.speedBoost = Math.min(3, p.speedBoost + 1);
      this.showToast('DRIFT BOOST');
    } else if (kind === 'shield') {
      p.shield = Math.min(p.maxShield, p.shield + 1);
      this.showToast('SHIELD UP');
    } else if (kind === 'beam') {
      p.beam = Math.min(3, p.beam + 1);
      this.showToast('BEAM CHARGE');
    } else if (kind === 'heal') {
      p.hp = Math.min(p.maxHp, p.hp + 2);
      this.showToast('NANITES');
    }
    this.updateHUD();
  }

  updateHUD() {
    const p = this.player;
    $('score').textContent = String(this.score);
    $('hiscore').textContent = String(Math.max(this.hi, this.score));
    $('wave').textContent = String(this.wave);
    $('hp-bar').style.transform = `scaleX(${clamp(p.hp / p.maxHp, 0, 1)})`;
    $('hp-text').textContent = String(Math.max(0, p.hp));
    $('shield-bar').style.transform = `scaleX(${clamp(p.shield / p.maxShield, 0, 1)})`;
    $('shield-text').textContent = String(p.shield);

    const lives = $('lives');
    lives.innerHTML = '';
    // Show current ship + extras as 3 pips total at full stock
    const totalPips = 3;
    const filled = Math.min(totalPips, p.lives + (p.dead ? 0 : 1));
    for (let i = 0; i < totalPips; i++) {
      const d = document.createElement('div');
      d.className = 'life-pip' + (i < filled ? '' : ' empty');
      lives.appendChild(d);
    }

    const pips = $('power-pips');
    pips.innerHTML = '';
    if (p.multi > 0) {
      const el = document.createElement('span');
      el.className = 'pip';
      el.textContent = `SPREAD x${p.multi}`;
      pips.appendChild(el);
    }
    if (p.beam > 0) {
      const el = document.createElement('span');
      el.className = 'pip amber';
      el.textContent = `BEAM x${p.beam}`;
      pips.appendChild(el);
    }
    if (p.speedBoost > 0) {
      const el = document.createElement('span');
      el.className = 'pip';
      el.textContent = `SPEED x${p.speedBoost}`;
      el.style.color = '#7dff9a';
      el.style.borderColor = 'rgba(125,255,154,0.45)';
      pips.appendChild(el);
    }
  }

  updateBossBar() {
    if (!this.boss) return;
    const t = clamp(this.boss.hp / this.boss.maxHp, 0, 1);
    $('boss-bar').style.transform = `scaleX(${t})`;
  }

  // -------------------------------------------------------------------------
  // Update systems
  // -------------------------------------------------------------------------
  updatePlayer(dt) {
    const p = this.player;
    if (p.dead) return;

    const baseSpeed = 9.5 + p.speedBoost * 1.6;
    const ax = input.x * baseSpeed;
    const ay = input.y * baseSpeed;
    // Smooth acceleration
    p.vx = lerp(p.vx, ax, 1 - Math.exp(-14 * dt));
    p.vy = lerp(p.vy, ay, 1 - Math.exp(-14 * dt));
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.x = clamp(p.x, PLAY.xMin, PLAY.xMax - 2);
    p.y = clamp(p.y, PLAY.yMin, PLAY.yMax);

    p.mesh.position.set(p.x, p.y, 0);
    // Bank & pitch
    p.mesh.rotation.z = lerp(p.mesh.rotation.z, -p.vy * 0.04, 1 - Math.exp(-10 * dt));
    p.mesh.rotation.x = lerp(p.mesh.rotation.x, p.vy * 0.03, 1 - Math.exp(-10 * dt));
    p.mesh.rotation.y = lerp(p.mesh.rotation.y, p.vx * 0.02, 1 - Math.exp(-8 * dt));

    // Thruster pulse
    p.thrusterPhase += dt * 18;
    p.mesh.traverse((c) => {
      if (c.name === 'thruster') {
        const pulse = 0.7 + Math.sin(p.thrusterPhase + c.position.z * 4) * 0.3;
        c.scale.set(pulse, 1 + Math.abs(p.vx) * 0.05 + 0.3, pulse);
        c.material.opacity = 0.7 + pulse * 0.3;
      }
    });

    // Engine trail
    if (Math.random() < 0.6) {
      this.particles.emit(p.x - 0.55, p.y + rand(-0.08, 0.08), rand(-0.1, 0.1), {
        count: 1,
        color: Math.random() > 0.5 ? 0xff6a3d : 0x3de7ff,
        speed: 1.5,
        life: 0.2,
        biasX: -3 - Math.abs(p.vx) * 0.2,
        size: 0.1,
        grow: -1,
      });
    }

    if (p.invuln > 0) {
      p.invuln -= dt;
      p.mesh.visible = Math.floor(p.invuln * 12) % 2 === 0;
    } else {
      p.mesh.visible = true;
    }

    if (p.fireCd > 0) p.fireCd -= dt;
    if (input.fire) this.playerFire();

    // Shield visual
    this.shieldMesh.visible = p.shield > 0;
    if (p.shield > 0) {
      this.shieldMesh.position.set(p.x, p.y, 0);
      this.shieldMesh.rotation.y += dt * 2;
      this.shieldMesh.rotation.x += dt * 1.2;
      this.shieldMesh.material.opacity = 0.12 + Math.sin(this.elapsed * 6) * 0.05;
      this.shieldMesh.scale.setScalar(0.95 + p.shield * 0.08);
    }
  }

  updateSpawns(dt) {
    this.waveTimer += dt;
    // Drain spawn queue
    while (this.spawnQueue.length && this.spawnQueue[0].t <= this.waveTimer) {
      this.spawnEnemy(this.spawnQueue.shift());
    }

    // Wave clear → breather → next (scripted waves only; no endless ambient)
    const waveDone =
      !this.spawnQueue.length &&
      this.enemies.length === 0 &&
      this.waveTimer > 1.5;
    if (waveDone) {
      if (this._waveClearTimer == null) {
        this._waveClearTimer = this.boss || this.wave % 5 === 0 ? 2.2 : 1.4;
      }
      this._waveClearTimer -= dt;
      if (this._waveClearTimer <= 0) {
        this._waveClearTimer = null;
        this.nextWave();
      }
    } else {
      this._waveClearTimer = null;
    }

    // Occasional free powerup mid-fight
    this.powerDropTimer -= dt;
    if (this.powerDropTimer <= 0 && this.state === 'play' && this.enemies.length > 0) {
      this.powerDropTimer = 9 + rand(0, 5);
      this.spawnPowerup(12, rand(-4, 4));
    }
  }

  updateEnemies(dt) {
    const p = this.player;
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      if (e.dead) {
        this.enemies.splice(i, 1);
        continue;
      }
      e.t += dt;

      if (e.type === 'boss') {
        // Hover left side of right half, weave
        const targetX = 5.5 + Math.sin(e.t * 0.6) * 1.2;
        e.x = lerp(e.x, targetX, 1 - Math.exp(-1.5 * dt));
        e.y = Math.sin(e.t * 0.9) * 3.5 + Math.sin(e.t * 0.3) * 1.2;
        e.mesh.rotation.y += dt * 0.6;
        e.mesh.rotation.z = Math.sin(e.t) * 0.1;
        e.mesh.traverse((c) => {
          if (c.name === 'halo') c.rotation.z += dt * 1.5;
          if (c.name === 'pod') c.rotation.y += dt * 2;
        });
        // Attack patterns
        e.fireCd -= dt;
        if (e.fireCd <= 0 && !p.dead) {
          const phase = Math.floor(e.t / 3) % 3;
          if (phase === 0) {
            // Aimed volley
            for (let k = -2; k <= 2; k++) {
              const ang = Math.atan2(p.y - e.y, p.x - e.x) + k * 0.15;
              this.spawnBullet(false, e.x - 1, e.y, Math.cos(ang) * 7, Math.sin(ang) * 7);
            }
            e.fireCd = 0.9;
          } else if (phase === 1) {
            // Ring burst
            for (let k = 0; k < 10; k++) {
              const a = (k / 10) * Math.PI * 2 + e.t;
              this.spawnBullet(false, e.x, e.y, Math.cos(a) * 5.5, Math.sin(a) * 5.5);
            }
            e.fireCd = 1.3;
          } else {
            // Stream toward player
            const ang = Math.atan2(p.y - e.y, p.x - e.x);
            this.spawnBullet(false, e.x - 1.2, e.y, Math.cos(ang) * 9, Math.sin(ang) * 9);
            e.fireCd = 0.18;
          }
        }
        this.updateBossBar();
      } else if (e.path === 'sine') {
        e.x -= e.speed * dt;
        e.y += Math.sin(e.t * 3.5) * 3.5 * dt;
      } else if (e.path === 'dive') {
        e.x -= e.speed * 0.7 * dt;
        if (e.t > 0.5 && e.t < 2.5) {
          e.y = lerp(e.y, p.y, 1 - Math.exp(-2 * dt));
          e.x -= e.speed * 0.8 * dt;
        } else {
          e.x -= e.speed * dt;
        }
      } else if (e.path === 'hold') {
        if (e.x > 8) e.x -= e.speed * dt;
        else {
          e.x = 8 + Math.sin(e.t * 2) * 0.3;
          e.y += Math.sin(e.t * 1.2) * 0.4 * dt;
        }
      } else {
        // straight / slight aim
        e.x -= e.speed * dt;
        if (e.type === 'dart' && e.t < 1.5) {
          e.y = lerp(e.y, p.y, 1 - Math.exp(-1.2 * dt));
        }
      }

      e.y = clamp(e.y, PLAY.yMin, PLAY.yMax);
      e.mesh.position.set(e.x, e.y, 0);

      if (e.type === 'spinner') {
        e.mesh.rotation.z += dt * 4;
      }
      if (e.type === 'drone') {
        e.mesh.rotation.y += dt * 2;
        e.mesh.rotation.x += dt * 1.2;
      }

      // Enemy shooting
      if (e.type !== 'boss') {
        e.fireCd -= dt;
        const canShoot = e.type === 'turret' || e.type === 'tank' || (e.type === 'spinner' && this.wave >= 2);
        if (canShoot && e.fireCd <= 0 && e.x < 12 && !p.dead) {
          const ang = Math.atan2(p.y - e.y, p.x - e.x);
          const spd = e.type === 'turret' ? 8 : 6.5;
          this.spawnBullet(false, e.x - 0.3, e.y, Math.cos(ang) * spd, Math.sin(ang) * spd);
          if (e.type === 'tank') {
            this.spawnBullet(false, e.x - 0.3, e.y, Math.cos(ang + 0.2) * spd, Math.sin(ang + 0.2) * spd);
            this.spawnBullet(false, e.x - 0.3, e.y, Math.cos(ang - 0.2) * spd, Math.sin(ang - 0.2) * spd);
          }
          e.fireCd = e.type === 'turret' ? 1.1 : e.type === 'tank' ? 1.6 : 1.8;
          e.fireCd *= Math.max(0.55, 1 - this.wave * 0.03);
        }
      }

      // Off screen
      if (e.x < -14 && e.type !== 'boss') {
        e.dead = true;
        this.scene.remove(e.mesh);
        this.enemies.splice(i, 1);
        continue;
      }

      // Collide with player
      if (!p.dead) {
        const dx = e.x - p.x;
        const dy = e.y - p.y;
        const r = e.radius + 0.35;
        if (dx * dx + dy * dy < r * r) {
          this.damagePlayer(e.type === 'boss' ? 2 : 1);
          if (e.type !== 'boss') {
            this.killEnemy(e, false);
            this.enemies.splice(i, 1);
          }
        }
      }
    }
  }

  updateBullets(dt) {
    const p = this.player;

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= dt;
      b.mesh.position.set(b.x, b.y, 0);
      if (b.life <= 0 || b.x > 14 || b.y > 9 || b.y < -9) {
        this.scene.remove(b.mesh);
        this.bullets.splice(i, 1);
        continue;
      }
      // vs enemies
      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const e = this.enemies[j];
        if (e.dead) continue;
        const dx = e.x - b.x;
        const dy = e.y - b.y;
        const r = e.radius + b.radius;
        if (dx * dx + dy * dy < r * r) {
          e.hp -= b.dmg;
          this.particles.emit(b.x, b.y, 0, {
            count: 4,
            color: b.heavy ? 0xffc14d : 0x3de7ff,
            speed: 3,
            life: 0.2,
          });
          AudioFX.hit();
          this.scene.remove(b.mesh);
          this.bullets.splice(i, 1);
          if (e.hp <= 0) {
            this.killEnemy(e);
            // don't splice enemies here — updateEnemies cleans dead, but we already remove mesh in killEnemy
            // mark only
          } else if (e === this.boss) {
            this.updateBossBar();
          }
          break;
        }
      }
    }

    for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
      const b = this.enemyBullets[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= dt;
      b.mesh.position.set(b.x, b.y, 0);
      if (b.life <= 0 || b.x < -14 || b.x > 16 || b.y > 9 || b.y < -9) {
        this.scene.remove(b.mesh);
        this.enemyBullets.splice(i, 1);
        continue;
      }
      if (!p.dead) {
        const dx = b.x - p.x;
        const dy = b.y - p.y;
        if (dx * dx + dy * dy < (0.4 + b.radius) ** 2) {
          this.scene.remove(b.mesh);
          this.enemyBullets.splice(i, 1);
          this.damagePlayer(1);
        }
      }
    }
  }

  updatePowerups(dt) {
    const p = this.player;
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const u = this.powerups[i];
      u.t += dt;
      u.life -= dt;
      u.x -= SCROLL * 0.55 * dt;
      u.y += Math.sin(u.t * 3) * 0.4 * dt;
      u.mesh.position.set(u.x, u.y, 0);
      u.mesh.rotation.y += dt * 2.5;
      u.mesh.rotation.x += dt * 1.2;
      u.mesh.scale.setScalar(1 + Math.sin(u.t * 5) * 0.08);

      if (u.life <= 0 || u.x < -14) {
        this.scene.remove(u.mesh);
        this.powerups.splice(i, 1);
        continue;
      }
      if (!p.dead) {
        const dx = u.x - p.x;
        const dy = u.y - p.y;
        if (dx * dx + dy * dy < (u.radius + 0.45) ** 2) {
          this.scene.remove(u.mesh);
          this.powerups.splice(i, 1);
          this.applyPowerup(u.kind);
        }
      }
    }
  }

  updateCamera(dt) {
    const p = this.player;
    // Subtle follow + shake
    let sx = 0, sy = 0;
    if (this.shake > 0) {
      this.shake = Math.max(0, this.shake - dt * 1.8);
      sx = (Math.random() - 0.5) * this.shake * 0.55;
      sy = (Math.random() - 0.5) * this.shake * 0.55;
    }
    const tx = -1.5 + p.x * 0.04 + sx;
    const ty = 1.2 + p.y * 0.08 + sy;
    this.camera.position.x = lerp(this.camera.position.x, tx, 1 - Math.exp(-6 * dt));
    this.camera.position.y = lerp(this.camera.position.y, ty, 1 - Math.exp(-6 * dt));
    this.camera.lookAt(0.5 + p.x * 0.02, p.y * 0.05, 0);

    // Recover time scale (hit-stop)
    if (this.timeScale < 1) {
      this.timeScale = Math.min(1, this.timeScale + dt * 2.5);
    }
  }

  updateTitle(dt) {
    // Idle showcase: spin a ghost ship
    this.elapsed += dt;
    this.stars.update(dt, 0.35);
    this.player.mesh.visible = true;
    this.player.mesh.position.set(-2.5, Math.sin(this.elapsed * 0.8) * 0.6, 0);
    this.player.mesh.rotation.y = Math.sin(this.elapsed * 0.5) * 0.3;
    this.player.mesh.rotation.z = Math.sin(this.elapsed * 0.7) * 0.1;
    this.camera.position.set(-1.5, 1.2, 14.5);
    this.camera.lookAt(0.5, 0, 0);
  }

  loop(now) {
    const rawDt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    pollInput();

    if (input.pausePressed) {
      input.pausePressed = false;
      if (this.state === 'play') this.setState('pause');
      else if (this.state === 'pause') this.setState('play');
    }
    if (input.mutePressed) {
      input.mutePressed = false;
      AudioFX.resume();
      const m = AudioFX.toggleMute();
      this.showToast(m ? 'MUTED' : 'AUDIO ON');
    }
    input.firePressed = false;

    if (this.state === 'title') {
      this.updateTitle(rawDt);
    } else if (this.state === 'play') {
      const dt = rawDt * this.timeScale;
      this.elapsed += dt;
      this.scrollMul = 1 + Math.min(0.5, this.wave * 0.03);
      this.stars.update(dt, this.scrollMul);
      this.updatePlayer(dt);
      this.updateSpawns(dt);
      this.updateEnemies(dt);
      this.updateBullets(dt);
      this.updatePowerups(dt);
      this.particles.update(dt);
      this.updateCamera(dt);
      AudioFX.updateMusic(dt, Math.min(2, 0.6 + this.wave * 0.08));

      if (this.toastTimer > 0) {
        this.toastTimer -= dt;
        if (this.toastTimer <= 0) $('toast').classList.add('hidden');
      }

      // Ambient fill light pulse
      this.fillLight.intensity = 0.5 + Math.sin(this.elapsed * 2) * 0.15;
    } else if (this.state === 'pause') {
      // frozen
    } else if (this.state === 'gameover') {
      this.stars.update(rawDt, 0.2);
      this.particles.update(rawDt);
    }

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame((t) => this.loop(t));
  }
}

// Boot
$('hiscore').textContent = String(Number(localStorage.getItem(HI_KEY) || 0));
new Game();
