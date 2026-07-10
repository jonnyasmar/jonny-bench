// ION TEMPEST — a neon 3D side-scrolling shooter (Gradius-style power chain)
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { AudioSys } from './audio.js';

// ---------- constants ----------
const X_MIN = -19, X_MAX = 19;       // player travel
const Y_MIN = -11, Y_MAX = 11;
const SPAWN_X = 26, KILL_X = -26;
const SCROLL = 6;                    // world scroll speed (turrets, grid)
const FOV = 44;

const audio = new AudioSys();

// ---------- renderer / scene ----------
const canvas = document.getElementById('game');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
} catch (e) {
  document.getElementById('nogl').style.display = 'flex';
  throw e;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x070216);
scene.fog = new THREE.FogExp2(0x140533, 0.0075);

const camera = new THREE.PerspectiveCamera(FOV, 16 / 9, 0.1, 400);
const CAM_BASE = new THREE.Vector3(0, 1.2, 30);

scene.add(new THREE.AmbientLight(0x334466, 1.6));
const keyLight = new THREE.DirectionalLight(0xaaccff, 1.4);
keyLight.position.set(-4, 8, 10);
scene.add(keyLight);
const shipLight = new THREE.PointLight(0x55eeff, 60, 26, 2);
scene.add(shipLight);
const flashLight = new THREE.PointLight(0xffaa66, 0, 40, 2);
scene.add(flashLight);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(960, 540), 0.85, 0.5, 0.22);
composer.addPass(bloom);
composer.addPass(new OutputPass());

function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h);
  composer.setSize(w, h);
  camera.aspect = w / h;
  // pull the camera back far enough that the whole playfield fits at any aspect
  const tanH = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
  CAM_BASE.z = Math.max(12.6 / tanH, 21.5 / (tanH * camera.aspect));
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

// ---------- helpers ----------
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = THREE.MathUtils.clamp;

let glowTex = null;
function makeGlowTexture() {
  if (glowTex) return glowTex;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.35, 'rgba(255,255,255,0.5)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  glowTex = new THREE.CanvasTexture(c);
  return glowTex;
}
function makeGlowSprite(color, scale) {
  const m = new THREE.SpriteMaterial({
    map: makeGlowTexture(), color, transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const s = new THREE.Sprite(m);
  s.scale.setScalar(scale);
  return s;
}

// ---------- background ----------
function buildStars(count, depth, size, color) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = rand(-140, 140);
    pos[i * 3 + 1] = rand(-40, 50);
    pos[i * 3 + 2] = depth + rand(-8, 8);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color, size, transparent: true, opacity: 0.9,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  });
  const pts = new THREE.Points(geo, mat);
  pts.userData.speed = 60 / -depth; // nearer layers scroll faster
  scene.add(pts);
  return pts;
}
const starLayers = [
  buildStars(220, -90, 0.9, 0xffffff),
  buildStars(160, -60, 0.7, 0x88ccff),
  buildStars(120, -35, 0.5, 0xff9aff),
];
function updateStars(dt) {
  for (const l of starLayers) {
    const p = l.geometry.attributes.position;
    for (let i = 0; i < p.count; i++) {
      let x = p.getX(i) - l.userData.speed * 8 * dt;
      if (x < -140) x += 280;
      p.setX(i, x);
    }
    p.needsUpdate = true;
  }
}

const gridUniforms = { uTime: { value: 0 } };
function buildGrid(y, color, opacity) {
  const geo = new THREE.PlaneGeometry(420, 90);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: gridUniforms.uTime,
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
    },
    vertexShader: `
      varying vec3 vW;
      void main(){
        vec4 w = modelMatrix * vec4(position,1.0);
        vW = w.xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: `
      uniform float uTime; uniform vec3 uColor; uniform float uOpacity;
      varying vec3 vW;
      void main(){
        vec2 p = vec2(vW.x + uTime * ${SCROLL.toFixed(1)}, vW.z);
        float sp = 4.0;
        float dx = abs(fract(p.x/sp + 0.5) - 0.5) * sp;
        float dz = abs(fract(p.y/sp + 0.5) - 0.5) * sp;
        float line = max(smoothstep(0.14, 0.0, dx), smoothstep(0.14, 0.0, dz));
        float fade = smoothstep(-62.0, -20.0, vW.z) * smoothstep(150.0, 90.0, abs(vW.x));
        fade *= smoothstep(24.0, 4.0, vW.z);
        gl_FragColor = vec4(uColor * line, line * fade * uOpacity);
      }`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(0, y, -19);
  scene.add(mesh);
  return mesh;
}
buildGrid(-12.2, 0x28e6ff, 0.85);
buildGrid(12.8, 0xff2fd6, 0.4);

function buildRidge(z, y, color, opacity, seed) {
  const W = 260, SEG = 90;
  const geo = new THREE.PlaneGeometry(W, 22, SEG, 5);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), yy = pos.getY(i);
    const t = (yy + 11) / 22; // 0 at bottom edge, 1 at top
    const n = Math.sin(x * 0.11 + seed) * 0.5 + Math.sin(x * 0.31 + seed * 2.7) * 0.35 + Math.sin(x * 0.73 + seed * 1.3) * 0.15;
    pos.setZ(i, Math.max(0, n) * 10 * t * t);
  }
  geo.computeVertexNormals();
  const mat = new THREE.MeshBasicMaterial({
    color, wireframe: true, transparent: true, opacity,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const group = new THREE.Group();
  for (let k = 0; k < 2; k++) {
    const m = new THREE.Mesh(geo, mat);
    m.rotation.x = -Math.PI / 2;
    m.position.set(k * W, y, z);
    group.add(m);
  }
  group.userData = { W };
  scene.add(group);
  return group;
}
const ridges = [
  buildRidge(-42, -11.5, 0xb14bff, 0.33, 1.7),
  buildRidge(-58, -11.0, 0xff2fd6, 0.18, 4.2),
];
function updateRidges(dt) {
  for (const g of ridges) {
    for (const m of g.children) {
      m.position.x -= SCROLL * 0.55 * dt;
      if (m.position.x < -g.userData.W) m.position.x += g.userData.W * 2;
    }
  }
}

// synthwave sun
{
  const geo = new THREE.CircleGeometry(30, 48);
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: gridUniforms.uTime },
    vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader: `
      uniform float uTime; varying vec2 vUv;
      void main(){
        vec2 c = vUv*2.0-1.0; float r = length(c);
        if (r > 1.0) discard;
        vec3 col = mix(vec3(0.85,0.13,0.42), vec3(0.95,0.72,0.3), vUv.y);
        float band = fract(vUv.y*13.0 - uTime*0.22);
        float gap = mix(0.5, 0.0, smoothstep(0.05, 0.7, vUv.y));
        float a = smoothstep(gap, gap+0.03, band);
        float edge = smoothstep(1.0, 0.86, r);
        gl_FragColor = vec4(col*0.62, a*edge*0.9);
      }`,
    transparent: true, depthWrite: false,
  });
  const sun = new THREE.Mesh(geo, mat);
  sun.position.set(52, -2, -120);
  sun.scale.setScalar(0.8);
  scene.add(sun);
}

// ---------- particles ----------
const PMAX = 1500;
const pData = {
  x: new Float32Array(PMAX), y: new Float32Array(PMAX), z: new Float32Array(PMAX),
  vx: new Float32Array(PMAX), vy: new Float32Array(PMAX), vz: new Float32Array(PMAX),
  life: new Float32Array(PMAX), maxLife: new Float32Array(PMAX),
  size: new Float32Array(PMAX), drag: new Float32Array(PMAX),
  r: new Float32Array(PMAX), g: new Float32Array(PMAX), b: new Float32Array(PMAX),
};
let pCursor = 0;
const pGeo = new THREE.BufferGeometry();
{
  const pos = new Float32Array(PMAX * 3);
  for (let i = 0; i < PMAX; i++) pos[i * 3 + 2] = -999;
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  pGeo.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array(PMAX * 3), 3));
  pGeo.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(PMAX), 1));
  pGeo.setAttribute('aAlpha', new THREE.BufferAttribute(new Float32Array(PMAX), 1));
}
const pMat = new THREE.ShaderMaterial({
  vertexShader: `
    attribute float aSize; attribute vec3 aColor; attribute float aAlpha;
    varying vec3 vC; varying float vA;
    void main(){
      vC = aColor; vA = aAlpha;
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = aSize * (170.0 / -mv.z);
      gl_Position = projectionMatrix * mv;
    }`,
  fragmentShader: `
    varying vec3 vC; varying float vA;
    void main(){
      float d = length(gl_PointCoord - 0.5);
      float a = smoothstep(0.5, 0.0, d) * vA;
      gl_FragColor = vec4(vC * a, a);
    }`,
  transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
});
scene.add(new THREE.Points(pGeo, pMat));

function spawnParticle(x, y, z, vx, vy, vz, life, size, color, drag) {
  const i = pCursor;
  pCursor = (pCursor + 1) % PMAX;
  pData.x[i] = x; pData.y[i] = y; pData.z[i] = z;
  pData.vx[i] = vx; pData.vy[i] = vy; pData.vz[i] = vz;
  pData.life[i] = life; pData.maxLife[i] = life;
  pData.size[i] = size; pData.drag[i] = drag;
  pData.r[i] = ((color >> 16) & 255) / 255;
  pData.g[i] = ((color >> 8) & 255) / 255;
  pData.b[i] = (color & 255) / 255;
}
function burst(x, y, z, count, speed, life, size, colors, drag = 2.2) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const el = rand(-0.9, 0.9);
    const sp = speed * rand(0.25, 1);
    spawnParticle(x, y, z,
      Math.cos(a) * sp, Math.sin(a) * sp, el * sp * 0.6,
      life * rand(0.5, 1.15), size * rand(0.6, 1.4),
      colors[(Math.random() * colors.length) | 0], drag);
  }
}
function updateParticles(dt) {
  const pos = pGeo.attributes.position, col = pGeo.attributes.aColor;
  const siz = pGeo.attributes.aSize, alp = pGeo.attributes.aAlpha;
  for (let i = 0; i < PMAX; i++) {
    if (pData.life[i] <= 0) { if (alp.array[i] !== 0) alp.array[i] = 0; continue; }
    pData.life[i] -= dt;
    const dr = Math.max(0, 1 - pData.drag[i] * dt);
    pData.vx[i] *= dr; pData.vy[i] *= dr; pData.vz[i] *= dr;
    pData.x[i] += pData.vx[i] * dt;
    pData.y[i] += pData.vy[i] * dt;
    pData.z[i] += pData.vz[i] * dt;
    const t = Math.max(0, pData.life[i] / pData.maxLife[i]);
    pos.array[i * 3] = pData.x[i];
    pos.array[i * 3 + 1] = pData.y[i];
    pos.array[i * 3 + 2] = pData.z[i];
    col.array[i * 3] = pData.r[i];
    col.array[i * 3 + 1] = pData.g[i];
    col.array[i * 3 + 2] = pData.b[i];
    siz.array[i] = pData.size[i] * (0.5 + 0.5 * t);
    alp.array[i] = t;
  }
  pos.needsUpdate = col.needsUpdate = siz.needsUpdate = alp.needsUpdate = true;
}

// ---------- shockwave rings ----------
const rings = [];
const ringPool = [];
function shockwave(x, y, z, maxR, life, color) {
  let r = ringPool.pop();
  if (!r) {
    const geo = new THREE.RingGeometry(0.86, 1, 48);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending,
      depthWrite: false, side: THREE.DoubleSide,
    });
    r = { mesh: new THREE.Mesh(geo, mat) };
  }
  r.mesh.material.color.setHex(color);
  r.mesh.position.set(x, y, z);
  r.t = 0; r.life = life; r.maxR = maxR;
  scene.add(r.mesh);
  rings.push(r);
}
function updateRings(dt) {
  for (let i = rings.length - 1; i >= 0; i--) {
    const r = rings[i];
    r.t += dt;
    const k = r.t / r.life;
    if (k >= 1) {
      scene.remove(r.mesh);
      ringPool.push(r);
      rings.splice(i, 1);
      continue;
    }
    const e = 1 - Math.pow(1 - k, 3);
    r.mesh.scale.setScalar(0.2 + e * r.maxR);
    r.mesh.material.opacity = 0.9 * (1 - k);
  }
}

// ---------- camera shake / flash ----------
let trauma = 0;
function addShake(a) { trauma = Math.min(1, trauma + a); }
let flashT = 0;
function bigFlash(x, y, intensity) {
  flashLight.position.set(x, y, 4);
  flashLight.intensity = intensity;
  flashT = 1;
}

// ---------- explosions ----------
function explosion(x, y, big, palette) {
  const colors = palette || [0xffd08a, 0xff7a3c, 0xff2fa0, 0xfff6d8];
  if (big) {
    burst(x, y, 0, 46, 22, 0.9, 3.2, colors, 2.4);
    burst(x, y, 0, 18, 8, 1.3, 4.5, [0xfff3c8, 0xffffff], 1.6);
    shockwave(x, y, 0, 9, 0.5, 0xffc46b);
    addShake(0.5);
    bigFlash(x, y, 320);
    audio.explBig();
  } else {
    burst(x, y, 0, 20, 15, 0.6, 2.4, colors, 2.6);
    shockwave(x, y, 0, 4, 0.32, 0xff9a5c);
    addShake(0.16);
    audio.explSmall();
  }
}

// ---------- player ship ----------
const shipMatBody = new THREE.MeshStandardMaterial({
  color: 0x9adfff, emissive: 0x1899cc, emissiveIntensity: 0.55,
  metalness: 0.4, roughness: 0.3, flatShading: true,
});
const shipMatDark = new THREE.MeshStandardMaterial({
  color: 0x27415e, emissive: 0x0a2a44, emissiveIntensity: 0.4,
  metalness: 0.5, roughness: 0.4, flatShading: true,
});
function buildShip() {
  const g = new THREE.Group();
  const hull = new THREE.Mesh(new THREE.ConeGeometry(0.85, 3.4, 6), shipMatBody);
  hull.rotation.z = -Math.PI / 2;
  g.add(hull);
  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.5, 1.6, 6), shipMatDark);
  tail.rotation.z = -Math.PI / 2;
  tail.position.x = -1.7 + 0.9 - 1.6;
  g.add(tail);
  const wingGeo = new THREE.BoxGeometry(1.9, 0.14, 2.4);
  for (const s of [-1, 1]) {
    const w = new THREE.Mesh(wingGeo, shipMatDark);
    w.position.set(-1.0, 0, s * 1.2);
    w.rotation.y = s * 0.5;
    g.add(w);
    const tip = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.1, 0.32),
      new THREE.MeshBasicMaterial({ color: 0x64f6ff }));
    tip.position.set(-1.15, 0, s * 2.15);
    tip.rotation.y = s * 0.5;
    g.add(tip);
  }
  const fin = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.3, 0.12), shipMatDark);
  fin.position.set(-1.9, 0.55, 0);
  fin.rotation.z = 0.5;
  g.add(fin);
  const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.42, 8, 6),
    new THREE.MeshBasicMaterial({ color: 0xbdfaff }));
  canopy.position.set(0.35, 0.3, 0);
  canopy.scale.set(1.6, 0.8, 0.8);
  g.add(canopy);
  const engine = makeGlowSprite(0x55eeff, 2.2);
  engine.position.set(-2.7, 0, 0);
  g.add(engine);
  g.userData.engine = engine;
  const bubble = new THREE.Mesh(new THREE.SphereGeometry(2.15, 20, 14),
    new THREE.MeshBasicMaterial({
      color: 0x7fdcff, transparent: true, opacity: 0.22,
      blending: THREE.AdditiveBlending, depthWrite: false, wireframe: true,
    }));
  bubble.visible = false;
  g.add(bubble);
  g.userData.bubble = bubble;
  return g;
}
const ship = buildShip();
scene.add(ship);

const player = {
  x: -14, y: 0, r: 0.62,
  dead: false, invulnT: 0, respawnT: 0,
  fireT: 0, missileT: 0,
  speedLvl: 0, missileLvl: 0, laserLvl: 0, double: false,
  shield: 0, lives: 3,
};
function playerSpeed() { return 14 + player.speedLvl * 2.5; }

// options (trailing drones)
const options = [];
const trail = [];
function buildOption() {
  const g = new THREE.Group();
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.42, 10, 8),
    new THREE.MeshBasicMaterial({ color: 0xffd45c }));
  g.add(orb);
  g.add(makeGlowSprite(0xffb32a, 1.9));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.06, 8, 24),
    new THREE.MeshBasicMaterial({ color: 0xffe9a8, transparent: true, opacity: 0.8 }));
  g.add(ring);
  g.userData.ring = ring;
  return g;
}
function addOption() {
  const m = buildOption();
  scene.add(m);
  options.push({ mesh: m, x: player.x, y: player.y });
}
function clearOptions() {
  for (const o of options) scene.remove(o.mesh);
  options.length = 0;
}

// ---------- bullets ----------
const pbullets = [];
const ebullets = [];
const pbPools = { shot: [], laser: [], missile: [] };
function makePlayerBulletMesh(type) {
  if (type === 'shot') {
    const m = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.22, 0.22),
      new THREE.MeshBasicMaterial({ color: 0xd8feff }));
    const g = makeGlowSprite(0x59f2ff, 1);
    g.scale.set(3.0, 0.8, 1);
    m.add(g);
    return m;
  }
  if (type === 'laser') {
    const m = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.26, 0.26),
      new THREE.MeshBasicMaterial({ color: 0xa8fff4 }));
    const g = makeGlowSprite(0x2affd6, 1);
    g.scale.set(7.5, 1.1, 1);
    m.add(g);
    return m;
  }
  const m = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.1, 6),
    new THREE.MeshBasicMaterial({ color: 0xffc46b }));
  m.add(makeGlowSprite(0xff8a2a, 1.3));
  return m;
}
function firePlayerBullet(type, x, y, vx, vy, dmg) {
  const pool = pbPools[type];
  const mesh = pool.pop() || makePlayerBulletMesh(type);
  mesh.position.set(x, y, 0);
  mesh.rotation.z = type === 'missile' ? Math.atan2(vy, vx) - Math.PI / 2 : Math.atan2(vy, vx);
  scene.add(mesh);
  pbullets.push({
    mesh, type, x, y, vx, vy, dmg,
    r: type === 'laser' ? 0.9 : 0.45,
    pierce: type === 'laser' ? new Set() : null,
    gliding: false,
  });
}
function removePlayerBullet(i) {
  const b = pbullets[i];
  scene.remove(b.mesh);
  pbPools[b.type].push(b.mesh);
  pbullets.splice(i, 1);
}

const ebPool = [];
function fireEnemyBullet(x, y, vx, vy) {
  if (ebullets.length > 110) return;
  let mesh = ebPool.pop();
  if (!mesh) {
    mesh = new THREE.Mesh(new THREE.SphereGeometry(0.34, 8, 6),
      new THREE.MeshBasicMaterial({ color: 0xffe9f2 }));
    mesh.add(makeGlowSprite(0xff3b6b, 1.9));
  }
  mesh.position.set(x, y, 0);
  scene.add(mesh);
  ebullets.push({ mesh, x, y, vx, vy, r: 0.4 });
}
function removeEnemyBullet(i) {
  const b = ebullets[i];
  scene.remove(b.mesh);
  ebPool.push(b.mesh);
  ebullets.splice(i, 1);
}
function aimedShot(x, y, speed, spreadAngle = 0) {
  const dx = player.x - x, dy = player.y - y;
  const a = Math.atan2(dy, dx) + spreadAngle;
  fireEnemyBullet(x, y, Math.cos(a) * speed, Math.sin(a) * speed);
}

// ---------- capsules ----------
const capsules = [];
const capPool = [];
function spawnCapsule(x, y) {
  let m = capPool.pop();
  if (!m) {
    m = new THREE.Group();
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.72),
      new THREE.MeshBasicMaterial({ color: 0xffb037 }));
    m.add(core);
    m.add(makeGlowSprite(0xff9a2a, 3.2));
    const shell = new THREE.Mesh(new THREE.OctahedronGeometry(1.0),
      new THREE.MeshBasicMaterial({ color: 0xffdf9a, wireframe: true, transparent: true, opacity: 0.7 }));
    m.add(shell);
  }
  m.position.set(x, y, 0);
  scene.add(m);
  capsules.push({ mesh: m, x, y, t: rand(0, 6) });
}
function updateCapsules(dt) {
  for (let i = capsules.length - 1; i >= 0; i--) {
    const c = capsules[i];
    c.t += dt;
    const dx = player.x - c.x, dy = player.y - c.y;
    const d2 = dx * dx + dy * dy;
    if (!player.dead && d2 < 36) { // magnet
      const d = Math.sqrt(d2) || 1;
      c.x += (dx / d) * 16 * dt;
      c.y += (dy / d) * 16 * dt;
    } else {
      c.x -= 3.5 * dt;
      c.y += Math.sin(c.t * 2.4) * 1.4 * dt;
    }
    c.mesh.position.set(c.x, c.y, 0);
    c.mesh.rotation.y += dt * 3;
    c.mesh.rotation.x += dt * 1.7;
    const pulse = 1 + Math.sin(c.t * 6) * 0.12;
    c.mesh.scale.setScalar(pulse);
    if (!player.dead && d2 < 2.6) {
      collectCapsule();
      scene.remove(c.mesh);
      capPool.push(c.mesh);
      capsules.splice(i, 1);
      continue;
    }
    if (c.x < KILL_X) {
      scene.remove(c.mesh);
      capPool.push(c.mesh);
      capsules.splice(i, 1);
    }
  }
}

// ---------- enemies ----------
const enemies = [];
const enemyPools = {};
function stdMat(color, emissive) {
  return new THREE.MeshStandardMaterial({
    color, emissive, emissiveIntensity: 0.7, metalness: 0.35, roughness: 0.4, flatShading: true,
  });
}
const ENEMY_TYPES = {};
function defEnemy(type, def) { ENEMY_TYPES[type] = def; }

defEnemy('drone', {
  hp: 1, r: 0.95, score: 100,
  make() {
    const g = new THREE.Group();
    const mat = stdMat(0xff2fd6, 0x99127f);
    const body = new THREE.Mesh(new THREE.OctahedronGeometry(0.95), mat);
    g.add(body);
    g.userData = { mats: [mat], spin: body };
    return g;
  },
  init(e, o) {
    e.y0 = o.y; e.amp = o.amp ?? 3.4; e.phase = o.phase ?? 0; e.freq = o.freq ?? 2.6;
    e.vx = -(9 + world.diff * 2.2);
  },
  update(e, dt) {
    e.x += e.vx * dt;
    e.y = e.y0 + Math.sin(e.t * e.freq + e.phase) * e.amp;
    e.mesh.userData.spin.rotation.y += dt * 5;
    e.mesh.userData.spin.rotation.x += dt * 3;
  },
});

defEnemy('darter', {
  hp: 1, r: 0.85, score: 150,
  make() {
    const g = new THREE.Group();
    const mat = stdMat(0xff8a3c, 0xa34a10);
    const body = new THREE.Mesh(new THREE.ConeGeometry(0.7, 2.3, 5), mat);
    body.rotation.z = Math.PI / 2;
    g.add(body);
    const glow = makeGlowSprite(0xff7a2a, 1.6);
    glow.position.x = 1.1;
    g.add(glow);
    g.userData = { mats: [mat] };
    return g;
  },
  init(e) {
    e.vx = -(16 + world.diff * 3.5);
    e.vy = 0;
  },
  update(e, dt) {
    e.x += e.vx * dt;
    const want = clamp((player.y - e.y) * 3, -7, 7);
    e.vy += clamp(want - e.vy, -14 * dt, 14 * dt) * 4;
    e.vy = clamp(e.vy, -7, 7);
    e.y += e.vy * dt;
    e.mesh.rotation.x += dt * 9;
  },
});

defEnemy('pulsar', {
  hp: 2, r: 1.05, score: 200,
  make() {
    const g = new THREE.Group();
    const mat = stdMat(0xc44bff, 0x6a1899);
    const body = new THREE.Mesh(new THREE.DodecahedronGeometry(1.0), mat);
    g.add(body);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.09, 8, 20),
      new THREE.MeshBasicMaterial({ color: 0xdf9aff }));
    g.add(ring);
    g.userData = { mats: [mat], ring, body };
    return g;
  },
  init(e, o) {
    e.y0 = o.y;
    e.fireT = rand(1.2, 2.2);
  },
  update(e, dt) {
    e.x -= 3.2 * dt;
    e.y = e.y0 + Math.sin(e.t * 2.6) * 4.5;
    e.mesh.userData.ring.rotation.x += dt * 4;
    e.mesh.userData.ring.rotation.y += dt * 2.5;
    e.mesh.userData.body.rotation.z += dt * 2;
    e.fireT -= dt;
    if (e.fireT <= 0 && e.x > player.x + 4 && e.x < 24) {
      e.fireT = Math.max(1.2, 2.4 - world.diff * 0.3);
      aimedShot(e.x, e.y, 8 + world.diff * 1.6);
      audio.bossHit();
    }
  },
});

defEnemy('turret', {
  hp: 3, r: 1.15, score: 300,
  make() {
    const g = new THREE.Group();
    const mat = stdMat(0x35c4ff, 0x0d5d8a);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.5, 1.0, 8), mat);
    base.position.y = 0.4;
    g.add(base);
    const matB = stdMat(0x9adfff, 0x1899cc);
    const barrel = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.4, 0.4), matB);
    barrel.position.set(0.5, 1.1, 0);
    const pivot = new THREE.Group();
    pivot.position.y = 1.0;
    barrel.position.set(0.95, 0, 0);
    pivot.add(barrel);
    g.add(pivot);
    g.userData = { mats: [mat, matB], pivot };
    return g;
  },
  init(e, o) {
    e.top = !!o.top;
    e.y = e.top ? 11.4 : -11.4;
    e.mesh.rotation.z = e.top ? Math.PI : 0;
    e.fireT = rand(0.8, 2.0);
  },
  update(e, dt) {
    e.x -= SCROLL * dt;
    const pivot = e.mesh.userData.pivot;
    const wa = Math.atan2(player.y - e.y, player.x - e.x);
    pivot.rotation.z = e.top ? wa - Math.PI : wa;
    e.fireT -= dt;
    if (e.fireT <= 0 && e.x > player.x + 2 && e.x < 24 && !player.dead) {
      e.fireT = Math.max(1.4, 2.6 - world.diff * 0.28);
      aimedShot(e.x, e.y + (e.top ? -1 : 1), 8.5 + world.diff * 1.8);
    }
  },
});

defEnemy('cruiser', {
  hp: 11, r: 1.9, score: 600,
  make() {
    const g = new THREE.Group();
    const mat = stdMat(0xff4664, 0x8a1030);
    const hull = new THREE.Mesh(new THREE.BoxGeometry(4.0, 1.7, 1.7), mat);
    g.add(hull);
    const matD = stdMat(0x5a2440, 0x2a0a1a);
    const top = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.9, 1.2), matD);
    top.position.y = 1.1;
    g.add(top);
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.8, 4), mat);
    nose.rotation.z = Math.PI / 2;
    nose.rotation.y = Math.PI / 4;
    nose.position.x = -2.7;
    g.add(nose);
    const glow = makeGlowSprite(0xff2f5c, 2.6);
    glow.position.x = 2.4;
    g.add(glow);
    g.userData = { mats: [mat, matD] };
    return g;
  },
  init(e, o) {
    e.y0 = o.y;
    e.fireT = 1.4;
  },
  update(e, dt) {
    e.x -= 4.2 * dt;
    e.y = e.y0 + Math.sin(e.t * 0.9) * 2;
    e.fireT -= dt;
    if (e.fireT <= 0 && e.x < 24 && !player.dead) {
      e.fireT = Math.max(1.6, 2.8 - world.diff * 0.3);
      const sp = 8 + world.diff * 1.6;
      aimedShot(e.x - 1, e.y, sp, -0.28);
      aimedShot(e.x - 1, e.y, sp, 0);
      aimedShot(e.x - 1, e.y, sp, 0.28);
    }
  },
});

defEnemy('carrier', {
  hp: 1, r: 1.1, score: 500, drops: true,
  make() {
    const g = new THREE.Group();
    const mat = stdMat(0xffb037, 0xa86206);
    const body = new THREE.Mesh(new THREE.IcosahedronGeometry(1.05, 0), mat);
    g.add(body);
    g.add(makeGlowSprite(0xffa22a, 3.4));
    g.userData = { mats: [mat], body };
    return g;
  },
  init(e, o) {
    e.y0 = o.y;
  },
  update(e, dt) {
    e.x -= 8.5 * dt;
    e.y = e.y0 + Math.sin(e.t * 1.6) * 1.2;
    e.mesh.userData.body.rotation.y += dt * 4;
    const s = 1 + Math.sin(e.t * 8) * 0.1;
    e.mesh.userData.body.scale.setScalar(s);
  },
});

function spawnEnemy(type, opts = {}) {
  const def = ENEMY_TYPES[type];
  const pool = enemyPools[type] || (enemyPools[type] = []);
  const mesh = pool.pop() || def.make();
  const e = {
    type, def, mesh,
    x: opts.x ?? SPAWN_X, y: opts.y ?? 0,
    hp: Math.ceil(def.hp * (type === 'cruiser' || type === 'turret' ? world.diff : 1)),
    r: def.r, t: 0, flashT: 0, vx: 0, vy: 0,
  };
  if (def.init) def.init(e, opts);
  mesh.position.set(e.x, e.y, 0);
  scene.add(mesh);
  enemies.push(e);
  world.waveKillsPending++;
  return e;
}
function releaseEnemy(e) {
  scene.remove(e.mesh);
  for (const m of e.mesh.userData.mats || []) m.emissiveIntensity = 0.7;
  e.mesh.scale.setScalar(1);
  enemyPools[e.type].push(e.mesh);
}
function killEnemy(i, byPlayer) {
  const e = enemies[i];
  enemies.splice(i, 1);
  world.waveKillsPending--;
  if (byPlayer) {
    addScore(e.def.score, e.x, e.y);
    bumpCombo();
    explosion(e.x, e.y, e.def.r > 1.5, e.type === 'carrier' ? [0xffd08a, 0xffb037, 0xfff2c8] : undefined);
    if (e.def.drops) spawnCapsule(e.x, e.y);
    else if (Math.random() < 0.06) spawnCapsule(e.x, e.y);
  }
  releaseEnemy(e);
}
function updateEnemies(dt) {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    e.t += dt;
    e.def.update(e, dt);
    e.mesh.position.set(e.x, e.y, 0);
    if (e.flashT > 0) {
      e.flashT -= dt;
      const k = 0.7 + Math.max(0, e.flashT) * 14;
      for (const m of e.mesh.userData.mats || []) m.emissiveIntensity = k;
    }
    if (e.x < KILL_X || e.y < -18 || e.y > 18) {
      enemies.splice(i, 1);
      world.waveKillsPending--;
      releaseEnemy(e);
    }
  }
}

// ---------- boss ----------
let boss = null;
function buildBossMesh() {
  const g = new THREE.Group();
  const shellMat = stdMat(0xff2fd6, 0x99127f);
  const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(4.2, 1), shellMat);
  g.add(shell);
  const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(4.45, 1),
    new THREE.MeshBasicMaterial({ color: 0xff9af2, wireframe: true, transparent: true, opacity: 0.5 }));
  g.add(wire);
  const core = new THREE.Group();
  const coreBall = new THREE.Mesh(new THREE.SphereGeometry(1.4, 16, 12),
    new THREE.MeshBasicMaterial({ color: 0xe6fdff }));
  core.add(coreBall);
  core.add(makeGlowSprite(0x7ff6ff, 6));
  g.add(core);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xff5c9a });
  const r1 = new THREE.Mesh(new THREE.TorusGeometry(5.6, 0.18, 8, 40), ringMat);
  const r2 = new THREE.Mesh(new THREE.TorusGeometry(6.4, 0.12, 8, 40), ringMat.clone());
  r2.material.color.setHex(0xb14bff);
  g.add(r1); g.add(r2);
  g.userData = { shell, wire, core, coreBall, r1, r2, shellMat };
  return g;
}
let bossMeshCache = null;
function spawnBoss() {
  if (!bossMeshCache) bossMeshCache = buildBossMesh();
  const mesh = bossMeshCache;
  const u = mesh.userData;
  u.shell.visible = u.wire.visible = true;
  u.shellMat.emissiveIntensity = 0.7;
  u.r1.material.color.setHex(0xff5c9a);
  mesh.position.set(SPAWN_X + 10, 0, 0);
  scene.add(mesh);
  const d = world.diff;
  boss = {
    mesh, t: 0, x: SPAWN_X + 10, y: 0,
    phase: 1,
    shellHp: Math.round(80 * d), shellMax: Math.round(80 * d),
    coreHp: Math.round(60 * d), coreMax: Math.round(60 * d),
    fireA: 0, fireB: rand(1, 2), spiralA: 0, flashT: 0,
    dying: 0,
  };
  showBossBar(true);
  audio.bossMode = true;
}
function bossDamage(dmg) {
  if (!boss || boss.dying > 0) return;
  boss.flashT = 0.08;
  audio.bossHit();
  if (boss.phase === 1) {
    boss.shellHp -= dmg;
    if (boss.shellHp <= 0) {
      boss.phase = 2;
      const u = boss.mesh.userData;
      u.shell.visible = false;
      u.wire.visible = false;
      u.r1.material.color.setHex(0xff2222);
      explosion(boss.x, boss.y, true);
      burst(boss.x, boss.y, 0, 60, 26, 1.1, 3.5, [0xff2fd6, 0xff9af2, 0xffffff], 2.0);
      shockwave(boss.x, boss.y, 0, 14, 0.7, 0xff2fd6);
      addShake(0.7);
      setBanner('CORE EXPOSED', '', 1.4);
    }
  } else {
    boss.coreHp -= dmg;
    if (boss.coreHp <= 0) {
      boss.dying = 2.2;
      boss.coreHp = 0;
    }
  }
  updateBossBar();
}
function updateBoss(dt) {
  if (!boss) return;
  const b = boss;
  b.t += dt;
  const u = b.mesh.userData;

  if (b.dying > 0) {
    b.dying -= dt;
    if (Math.random() < 0.4) {
      explosion(b.x + rand(-4, 4), b.y + rand(-4, 4), false);
    }
    b.mesh.rotation.z += dt * 2;
    b.mesh.scale.setScalar(1 + (2.2 - b.dying) * 0.08);
    if (b.dying <= 0) {
      explosion(b.x, b.y, true);
      burst(b.x, b.y, 0, 120, 30, 1.6, 4, [0xffffff, 0x7ff6ff, 0xff2fd6, 0xffd08a], 1.8);
      shockwave(b.x, b.y, 0, 20, 0.9, 0xffffff);
      addShake(1);
      bigFlash(b.x, b.y, 600);
      addScore(5000, b.x, b.y);
      spawnCapsule(b.x - 2, b.y + 2);
      spawnCapsule(b.x - 2, b.y - 2);
      scene.remove(b.mesh);
      b.mesh.scale.setScalar(1);
      b.mesh.rotation.set(0, 0, 0);
      boss = null;
      showBossBar(false);
      audio.bossMode = false;
      setBanner('DREADNOUGHT DESTROYED', '+5000', 2.2);
      world.state = 'intermission';
      world.stateT = 3;
      return;
    }
    return;
  }

  // movement
  const targetX = 13.5;
  if (b.x > targetX) b.x -= 8 * dt;
  b.y = Math.sin(b.t * (b.phase === 2 ? 0.85 : 0.5)) * 6.2;
  b.mesh.position.set(b.x, b.y, 0);
  u.shell.rotation.y += dt * 0.7;
  u.shell.rotation.x += dt * 0.4;
  u.wire.rotation.y -= dt * 0.5;
  u.r1.rotation.x += dt * (b.phase === 2 ? 2.4 : 1.1);
  u.r1.rotation.y += dt * 0.8;
  u.r2.rotation.y -= dt * (b.phase === 2 ? 1.8 : 0.9);
  u.core.scale.setScalar(1 + Math.sin(b.t * (b.phase === 2 ? 9 : 4)) * 0.12);
  if (b.flashT > 0) {
    b.flashT -= dt;
    u.shellMat.emissiveIntensity = 0.7 + b.flashT * 20;
    u.coreBall.material.color.setHex(b.flashT > 0 ? 0xffffff : 0xe6fdff);
  }

  if (b.x > 24) return; // hold fire until on screen
  const d = world.diff;
  // pattern A: aimed spread
  b.fireA -= dt;
  if (b.fireA <= 0 && !player.dead) {
    b.fireA = b.phase === 2 ? Math.max(0.9, 1.6 - d * 0.15) : Math.max(1.2, 2.0 - d * 0.15);
    const n = b.phase === 2 ? 7 : 5;
    const sp = Math.min(13, 8.5 + d * 1.4);
    for (let i = 0; i < n; i++) {
      aimedShot(b.x - 3, b.y, sp, (i - (n - 1) / 2) * 0.17);
    }
  }
  // pattern B: ring
  b.fireB -= dt;
  if (b.fireB <= 0) {
    b.fireB = b.phase === 2 ? 2.6 : 3.6;
    const n = b.phase === 2 ? 16 : 12;
    const sp = 6 + d;
    const off = rand(0, Math.PI * 2);
    for (let i = 0; i < n; i++) {
      const a = off + (i / n) * Math.PI * 2;
      fireEnemyBullet(b.x, b.y, Math.cos(a) * sp, Math.sin(a) * sp);
    }
  }
  // phase 2: spiral
  if (b.phase === 2) {
    b.spiralA += dt * 5.2;
    if ((b.t * 10 | 0) !== ((b.t - dt) * 10 | 0)) {
      const sp = 7.5 + d;
      fireEnemyBullet(b.x, b.y, Math.cos(b.spiralA) * sp, Math.sin(b.spiralA) * sp);
      fireEnemyBullet(b.x, b.y, Math.cos(b.spiralA + Math.PI) * sp, Math.sin(b.spiralA + Math.PI) * sp);
    }
  }
}

// ---------- world / waves ----------
const world = {
  mode: 'title',          // title | playing | gameover
  state: 'intermission',  // intermission | spawning | boss | bosswarn
  stateT: 2,
  wave: 0,
  diff: 1,
  events: [],
  waveT: 0,
  waveKillsPending: 0,
  time: 0,
};

function buildWaveEvents(n) {
  const ev = [];
  let t = 0.6;
  const gap = Math.max(1.3, 3.0 - n * 0.14);
  const squads = 3 + Math.min(6, Math.floor(n * 0.9));
  const pick = () => {
    const pool = ['snake', 'snake', 'darters'];
    if (n >= 2) pool.push('turrets', 'pulsars');
    if (n >= 3) pool.push('cruiser', 'turrets');
    if (n >= 4) pool.push('rain', 'cruiser', 'pulsars');
    return pool[(Math.random() * pool.length) | 0];
  };
  for (let s = 0; s < squads; s++) {
    const kind = pick();
    if (kind === 'snake') {
      const y0 = rand(-7, 7), amp = rand(2.5, 4.5), freq = rand(2.2, 3.2);
      const count = 5 + Math.min(4, n);
      for (let i = 0; i < count; i++) {
        const tt = t + i * 0.26;
        ev.push({ t: tt, fn: () => spawnEnemy('drone', { y: y0, amp, freq, phase: 0 }) });
      }
    } else if (kind === 'darters') {
      const count = 4 + Math.min(4, Math.floor(n / 2));
      const y0 = rand(-8, 8);
      for (let i = 0; i < count; i++) {
        const tt = t + i * 0.14;
        const yy = y0 + (i % 2 === 0 ? i : -i) * 1.3;
        ev.push({ t: tt, fn: () => spawnEnemy('darter', { y: clamp(yy, -10, 10) }) });
      }
    } else if (kind === 'turrets') {
      const top = Math.random() < 0.5;
      const count = 2 + Math.min(2, Math.floor(n / 3));
      for (let i = 0; i < count; i++) {
        const tt = t + i * 0.9;
        ev.push({ t: tt, fn: () => spawnEnemy('turret', { top }) });
      }
    } else if (kind === 'pulsars') {
      ev.push({ t, fn: () => spawnEnemy('pulsar', { y: rand(-6, 6) }) });
      ev.push({ t: t + 0.5, fn: () => spawnEnemy('pulsar', { y: rand(-6, 6) }) });
    } else if (kind === 'cruiser') {
      ev.push({ t, fn: () => spawnEnemy('cruiser', { y: rand(-6, 6) }) });
    } else if (kind === 'rain') {
      for (let i = 0; i < 6; i++) {
        ev.push({
          t: t + i * 0.3,
          fn: () => spawnEnemy('drone', { y: rand(-9, 9), amp: rand(1, 2.5), freq: rand(2, 4), phase: rand(0, 6) }),
        });
      }
    }
    t += gap;
  }
  // guaranteed capsule carriers
  ev.push({ t: rand(2, t * 0.5), fn: () => spawnEnemy('carrier', { y: rand(-8, 8) }) });
  ev.push({ t: rand(t * 0.5, t), fn: () => spawnEnemy('carrier', { y: rand(-8, 8) }) });
  ev.sort((a, b) => a.t - b.t);
  return ev;
}

function startWave(n) {
  world.wave = n;
  world.diff = Math.min(2.6, 1 + (n - 1) * 0.13);
  setHud('wave', 'SECTOR ' + n);
  if (n % 5 === 0) {
    world.state = 'bosswarn';
    world.stateT = 2.6;
    setBanner('⚠ WARNING ⚠', 'DREADNOUGHT APPROACHING', 2.4);
    audio.warning();
  } else {
    world.state = 'spawning';
    world.events = buildWaveEvents(n);
    world.waveT = 0;
    setBanner('SECTOR ' + n, n === 1 ? 'DESTROY EVERYTHING' : '', 1.6);
  }
}

function updateWaves(dt) {
  if (world.state === 'intermission') {
    world.stateT -= dt;
    if (world.stateT <= 0) startWave(world.wave + 1);
  } else if (world.state === 'bosswarn') {
    world.stateT -= dt;
    if (world.stateT <= 0) {
      world.state = 'boss';
      spawnBoss();
    }
  } else if (world.state === 'spawning') {
    world.waveT += dt;
    while (world.events.length && world.events[0].t <= world.waveT) {
      world.events.shift().fn();
    }
    if (!world.events.length && enemies.length === 0) {
      world.state = 'intermission';
      world.stateT = 2.2;
    }
  }
  // boss state: transition handled in updateBoss on death
}

// ---------- score / combo ----------
let score = 0, hiscore = 0;
try { hiscore = parseInt(localStorage.getItem('iontempest.hi') || '0', 10) || 0; } catch (e) { /* private mode */ }
let combo = 0, comboT = 0;
function comboMult() { return Math.min(5, 1 + Math.floor(combo / 6)); }
function bumpCombo() { combo++; comboT = 2.0; updateComboHud(); }
function addScore(base, x, y) {
  const pts = base * comboMult();
  score += pts;
  if (score > hiscore) {
    hiscore = score;
    try { localStorage.setItem('iontempest.hi', String(hiscore)); } catch (e) { /* ignore */ }
  }
  setHud('score', String(score).padStart(7, '0'));
  setHud('hiscore', String(hiscore).padStart(7, '0'));
  if (x !== undefined) popupScore(pts, x, y);
}

// score popups (HTML, projected)
const popups = [];
const popupPool = [];
function popupScore(pts, x, y) {
  let el = popupPool.pop();
  if (!el) {
    el = document.createElement('div');
    el.className = 'popup';
    document.getElementById('popups').appendChild(el);
  }
  el.textContent = '+' + pts + (comboMult() > 1 ? ' ×' + comboMult() : '');
  el.style.display = 'block';
  popups.push({ el, x, y, t: 0 });
}
const projV = new THREE.Vector3();
function updatePopups(dt) {
  for (let i = popups.length - 1; i >= 0; i--) {
    const p = popups[i];
    p.t += dt;
    if (p.t > 0.85) {
      p.el.style.display = 'none';
      popupPool.push(p.el);
      popups.splice(i, 1);
      continue;
    }
    p.y += dt * 2.4;
    projV.set(p.x, p.y, 0).project(camera);
    const sx = (projV.x * 0.5 + 0.5) * window.innerWidth;
    const sy = (-projV.y * 0.5 + 0.5) * window.innerHeight;
    p.el.style.transform = `translate(${sx}px, ${sy}px)`;
    p.el.style.opacity = String(1 - p.t / 0.85);
  }
}

// ---------- HUD ----------
const $ = (id) => document.getElementById(id);
function setHud(id, text) { $(id).textContent = text; }
function updateLivesHud() {
  $('lives').innerHTML = '';
  for (let i = 0; i < Math.max(0, player.lives); i++) {
    const s = document.createElement('span');
    s.className = 'life';
    $('lives').appendChild(s);
  }
}
function updateComboHud() {
  const el = $('combo');
  const m = comboMult();
  if (m > 1 && comboT > 0) {
    el.textContent = '×' + m;
    el.style.opacity = '1';
  } else {
    el.style.opacity = '0';
  }
}
const POWER_KEYS = ['SPEED', 'MISSILE', 'DOUBLE', 'LASER', 'OPTION', 'FORCE'];
let powerCursor = 0; // 0 = none, 1..6
function powerLevelText(i) {
  switch (i) {
    case 0: return player.speedLvl > 0 ? '·'.repeat(player.speedLvl) : '';
    case 1: return player.missileLvl > 0 ? '·'.repeat(player.missileLvl) : '';
    case 2: return player.double ? '●' : '';
    case 3: return player.laserLvl > 0 ? '·'.repeat(player.laserLvl) : '';
    case 4: return options.length > 0 ? '·'.repeat(options.length) : '';
    case 5: return player.shield > 0 ? String(player.shield) : '';
  }
  return '';
}
function updatePowerHud() {
  for (let i = 0; i < 6; i++) {
    const cell = $('p' + i);
    cell.classList.toggle('sel', powerCursor === i + 1);
    cell.querySelector('.lvl').textContent = powerLevelText(i);
  }
}
function collectCapsule() {
  powerCursor = powerCursor % 6 + 1;
  audio.pickup();
  addScore(50);
  burst(player.x, player.y, 0, 10, 8, 0.5, 2, [0xffb037, 0xffe9a8], 2.5);
  updatePowerHud();
}
function activatePower() {
  if (powerCursor === 0 || player.dead) return;
  const i = powerCursor - 1;
  let ok = true;
  switch (i) {
    case 0: if (player.speedLvl < 4) player.speedLvl++; else ok = false; break;
    case 1: if (player.missileLvl < 2) player.missileLvl++; else ok = false; break;
    case 2: if (!player.double) { player.double = true; player.laserLvl = 0; } else ok = false; break;
    case 3: if (player.laserLvl < 2) { player.laserLvl++; player.double = false; } else ok = false; break;
    case 4: if (options.length < 3) addOption(); else ok = false; break;
    case 5: player.shield = 4; break;
  }
  if (ok) {
    audio.powerup();
    setBanner(POWER_KEYS[i] + (i === 5 ? ' FIELD' : '') + ' UP', '', 0.9);
    shockwave(player.x, player.y, 0, 4, 0.4, 0x55eeff);
  } else {
    addScore(500, player.x, player.y - 2);
    audio.select();
  }
  powerCursor = 0;
  updatePowerHud();
}

// banner
let bannerT = 0;
function setBanner(main, sub, dur) {
  $('banner-main').textContent = main;
  $('banner-sub').textContent = sub || '';
  $('banner').classList.add('show');
  bannerT = dur;
}
function updateBanner(dt) {
  if (bannerT > 0) {
    bannerT -= dt;
    if (bannerT <= 0) $('banner').classList.remove('show');
  }
}

function showBossBar(v) {
  $('bossbar').style.display = v ? 'block' : 'none';
  if (v) updateBossBar();
}
function updateBossBar() {
  if (!boss) return;
  const k = boss.phase === 1
    ? 0.45 + 0.55 * (boss.shellHp / boss.shellMax)
    : 0.45 * (boss.coreHp / boss.coreMax);
  $('bossfill').style.width = (clamp(k, 0, 1) * 100).toFixed(1) + '%';
}

// ---------- input ----------
const keys = {};
window.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
  audio.init();
  audio.resume();
  if (e.repeat) return;
  keys[e.code] = true;
  if (e.code === 'KeyM') {
    const m = audio.toggleMute();
    setBanner(m ? 'MUTED' : 'SOUND ON', '', 0.7);
  }
  if (e.code === 'KeyP' || e.code === 'Escape') togglePause();
  if (e.code === 'Enter') {
    if (world.mode === 'title') startGame();
    else if (world.mode === 'gameover') startGame();
    else if (world.mode === 'playing') activatePower();
  }
  if (world.mode === 'playing' && (e.code === 'KeyX' || e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyK')) {
    activatePower();
  }
});
window.addEventListener('keyup', (e) => { keys[e.code] = false; });
window.addEventListener('pointerdown', () => { audio.init(); audio.resume(); });

let paused = false;
function togglePause() {
  if (world.mode !== 'playing') return;
  paused = !paused;
  $('pause').style.display = paused ? 'flex' : 'none';
  if (paused) audio.stopMusic(); else audio.startMusic();
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden && world.mode === 'playing' && !paused) togglePause();
});

const kDown = (...codes) => codes.some((c) => keys[c]);

// ---------- player update ----------
function firePlayerWeapons() {
  const sources = [{ x: player.x, y: player.y }];
  for (const o of options) sources.push({ x: o.x, y: o.y });
  if (player.laserLvl > 0) {
    for (const s of sources) {
      firePlayerBullet('laser', s.x + 2.5, s.y, 46, 0, 1 + player.laserLvl);
    }
    audio.laser();
  } else {
    for (const s of sources) {
      firePlayerBullet('shot', s.x + 2, s.y, 40, 0, 1);
      if (player.double) firePlayerBullet('shot', s.x + 1, s.y + 0.5, 28, 28, 1);
    }
    audio.shoot();
  }
  // muzzle sparkle
  spawnParticle(player.x + 2.2, player.y, 0, 6, 0, 0, 0.12, 3, 0x9ffcff, 0);
}
function firePlayerMissiles() {
  const sources = [{ x: player.x, y: player.y }];
  for (const o of options) sources.push({ x: o.x, y: o.y });
  for (const s of sources) {
    firePlayerBullet('missile', s.x + 0.5, s.y - 0.6, 11, -15, player.missileLvl >= 2 ? 3 : 2);
  }
  audio.missile();
}

function updatePlayer(dt) {
  if (player.dead) {
    player.respawnT -= dt;
    if (player.respawnT <= 0) {
      if (player.lives < 0) return;
      respawn();
    }
    return;
  }
  const sp = playerSpeed();
  let mx = 0, my = 0;
  if (kDown('ArrowLeft', 'KeyA')) mx -= 1;
  if (kDown('ArrowRight', 'KeyD')) mx += 1;
  if (kDown('ArrowUp', 'KeyW')) my += 1;
  if (kDown('ArrowDown', 'KeyS')) my -= 1;
  if (mx && my) { mx *= 0.7071; my *= 0.7071; }
  player.x = clamp(player.x + mx * sp * dt, X_MIN, X_MAX);
  player.y = clamp(player.y + my * sp * dt, Y_MIN, Y_MAX);

  ship.position.set(player.x, player.y, 0);
  ship.rotation.x = THREE.MathUtils.lerp(ship.rotation.x, -my * 0.55, dt * 10);
  ship.rotation.z = THREE.MathUtils.lerp(ship.rotation.z, my * 0.14, dt * 10);
  shipLight.position.set(player.x, player.y, 3);

  // engine
  const eng = ship.userData.engine;
  eng.scale.setScalar(1.8 + Math.sin(world.time * 40) * 0.35 + (mx > 0 ? 0.7 : 0));
  if (Math.random() < 0.75) {
    spawnParticle(player.x - 2.6, player.y + rand(-0.2, 0.2), 0,
      -14 + rand(-3, 3), rand(-1.5, 1.5), rand(-1, 1), rand(0.2, 0.42), rand(1.2, 2.2),
      Math.random() < 0.5 ? 0x55eeff : 0xb14bff, 1.5);
  }

  // invulnerability blink
  if (player.invulnT > 0) {
    player.invulnT -= dt;
    ship.visible = Math.sin(world.time * 30) > -0.4;
    if (player.invulnT <= 0) ship.visible = true;
  }

  // shield bubble
  const bub = ship.userData.bubble;
  bub.visible = player.shield > 0;
  if (bub.visible) {
    bub.material.opacity = 0.1 + 0.05 * player.shield + Math.sin(world.time * 6) * 0.04;
    bub.rotation.y += dt * 1.2;
  }

  // fire
  player.fireT -= dt;
  player.missileT -= dt;
  if (kDown('Space', 'KeyZ', 'KeyJ')) {
    if (player.fireT <= 0) {
      player.fireT = player.laserLvl > 0 ? 0.17 : 0.13;
      firePlayerWeapons();
    }
    if (player.missileLvl > 0 && player.missileT <= 0) {
      player.missileT = player.missileLvl >= 2 ? 0.36 : 0.55;
      firePlayerMissiles();
    }
  }
}

function updateOptions(dt) {
  if (!player.dead) {
    trail.push({ x: player.x, y: player.y });
    if (trail.length > 220) trail.shift();
  }
  for (let i = 0; i < options.length; i++) {
    const o = options[i];
    const idx = trail.length - 1 - (i + 1) * 15;
    const target = trail[Math.max(0, idx)] || { x: player.x, y: player.y };
    o.x += (target.x - o.x) * Math.min(1, dt * 14);
    o.y += (target.y - o.y) * Math.min(1, dt * 14);
    o.mesh.position.set(o.x, o.y, 0);
    o.mesh.userData.ring.rotation.y += dt * 6;
    o.mesh.userData.ring.rotation.x += dt * 3;
  }
}

// ---------- damage / death ----------
function hitPlayer() {
  if (player.dead || player.invulnT > 0) return;
  if (player.shield > 0) {
    player.shield--;
    player.invulnT = 0.9;
    audio.shieldHit();
    shockwave(player.x, player.y, 0, 3.5, 0.35, 0x7fdcff);
    addShake(0.25);
    updatePowerHud();
    return;
  }
  // death
  player.dead = true;
  player.respawnT = 1.7;
  player.lives--;
  updateLivesHud();
  ship.visible = false;
  ship.userData.bubble.visible = false;
  explosion(player.x, player.y, true, [0x7ff6ff, 0x55eeff, 0xffffff, 0xb14bff]);
  burst(player.x, player.y, 0, 40, 18, 1.2, 3, [0x7ff6ff, 0xffffff], 1.8);
  audio.playerBoom();
  addShake(0.9);
  timeScale = 0.25;
  combo = 0; comboT = 0; updateComboHud();
  if (player.lives < 0) {
    gameOver();
  }
}
function respawn() {
  player.dead = false;
  player.x = -15; player.y = 0;
  player.invulnT = 2.6;
  player.speedLvl = 0; player.missileLvl = 0; player.laserLvl = 0;
  player.double = false; player.shield = 0;
  powerCursor = 0;
  clearOptions();
  trail.length = 0;
  ship.visible = true;
  ship.position.set(player.x, player.y, 0);
  updatePowerHud();
  // pity capsules
  spawnCapsule(player.x + 12, player.y + 3);
  spawnCapsule(player.x + 14, player.y - 3);
}

// ---------- collisions ----------
function overlap(ax, ay, ar, bx, by, br) {
  const dx = ax - bx, dy = ay - by, rr = ar + br;
  return dx * dx + dy * dy < rr * rr;
}
function updateCollisions() {
  // player bullets vs enemies / boss
  for (let i = pbullets.length - 1; i >= 0; i--) {
    const b = pbullets[i];
    let consumed = false;
    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      if (!overlap(b.x, b.y, b.r, e.x, e.y, e.r)) continue;
      if (b.pierce) {
        if (b.pierce.has(e)) continue;
        b.pierce.add(e);
      }
      e.hp -= b.dmg;
      e.flashT = 0.12;
      spawnParticle(b.x + 0.5, b.y, 0, rand(-4, 4), rand(-4, 4), 0, 0.25, 2.4, 0xffffff, 2);
      if (e.hp <= 0) killEnemy(j, true);
      if (!b.pierce) { consumed = true; break; }
    }
    if (!consumed && boss && boss.dying <= 0) {
      const br = boss.phase === 1 ? 4.5 : 1.9;
      if (overlap(b.x, b.y, b.r, boss.x, boss.y, br)) {
        if (!b.pierce || !b.pierce.has(boss)) {
          if (b.pierce) b.pierce.add(boss);
          bossDamage(b.dmg);
          spawnParticle(b.x + 0.5, b.y, 0, rand(-5, 5), rand(-5, 5), 0, 0.3, 3, 0xffffff, 2);
          if (!b.pierce) consumed = true;
        }
      }
    }
    if (consumed) removePlayerBullet(i);
  }
  if (player.dead) return;
  // enemy bullets vs player
  for (let i = ebullets.length - 1; i >= 0; i--) {
    const b = ebullets[i];
    if (overlap(b.x, b.y, b.r, player.x, player.y, player.shield > 0 ? 1.9 : player.r)) {
      removeEnemyBullet(i);
      hitPlayer();
      if (player.dead) return;
    }
  }
  // enemies vs player
  for (let j = enemies.length - 1; j >= 0; j--) {
    const e = enemies[j];
    if (overlap(e.x, e.y, e.r, player.x, player.y, player.shield > 0 ? 1.9 : player.r)) {
      killEnemy(j, true);
      hitPlayer();
      if (player.dead) return;
    }
  }
  if (boss && boss.dying <= 0 && overlap(boss.x, boss.y, 4.6, player.x, player.y, player.r)) {
    hitPlayer();
  }
}

// ---------- bullets update ----------
function updateBullets(dt) {
  for (let i = pbullets.length - 1; i >= 0; i--) {
    const b = pbullets[i];
    if (b.type === 'missile' && !b.gliding && b.y <= Y_MIN - 0.2) {
      b.gliding = true;
      b.vx = 24; b.vy = 0;
      b.y = Y_MIN - 0.2;
      b.mesh.rotation.z = -Math.PI / 2;
      spawnParticle(b.x, b.y, 0, 0, 2, 0, 0.3, 2, 0xff8a2a, 1);
    }
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.mesh.position.set(b.x, b.y, 0);
    if (b.type === 'missile' && Math.random() < 0.5) {
      spawnParticle(b.x, b.y, 0, rand(-2, 2), rand(-2, 2), 0, 0.25, 1.4, 0xffb037, 2);
    }
    if (b.x > 28 || b.x < KILL_X || b.y > 15 || b.y < -15) removePlayerBullet(i);
  }
  for (let i = ebullets.length - 1; i >= 0; i--) {
    const b = ebullets[i];
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.mesh.position.set(b.x, b.y, 0);
    if (b.x > 30 || b.x < KILL_X || b.y > 16 || b.y < -16) removeEnemyBullet(i);
  }
}

// ---------- game state ----------
function resetEntities() {
  for (let i = enemies.length - 1; i >= 0; i--) { releaseEnemy(enemies[i]); }
  enemies.length = 0;
  while (pbullets.length) removePlayerBullet(0);
  while (ebullets.length) removeEnemyBullet(0);
  for (const c of capsules) { scene.remove(c.mesh); capPool.push(c.mesh); }
  capsules.length = 0;
  if (boss) { scene.remove(boss.mesh); boss = null; showBossBar(false); }
  clearOptions();
  trail.length = 0;
  world.waveKillsPending = 0;
  audio.bossMode = false;
}

function startGame() {
  resetEntities();
  score = 0;
  combo = 0; comboT = 0;
  player.lives = 3;
  player.dead = false;
  player.x = -15; player.y = 0;
  player.invulnT = 2;
  player.speedLvl = 0; player.missileLvl = 0; player.laserLvl = 0;
  player.double = false; player.shield = 0;
  player.fireT = 0; player.missileT = 0;
  powerCursor = 0;
  ship.visible = true;
  ship.position.set(player.x, player.y, 0);
  world.mode = 'playing';
  world.state = 'intermission';
  world.stateT = 1.2;
  world.wave = 0;
  world.diff = 1;
  timeScale = 1;
  paused = false;
  setHud('score', '0000000');
  setHud('hiscore', String(hiscore).padStart(7, '0'));
  updateLivesHud();
  updatePowerHud();
  updateComboHud();
  bannerT = 0;
  $('banner').classList.remove('show');
  $('title').style.display = 'none';
  $('gameover').style.display = 'none';
  $('pause').style.display = 'none';
  $('hud-play').style.display = 'block';
  audio.init();
  audio.resume();
  audio.startMusic();
}

function gameOver() {
  world.mode = 'gameover';
  bannerT = 0;
  $('banner').classList.remove('show');
  $('final-score').textContent = String(score).padStart(7, '0');
  $('final-hi').textContent = String(hiscore).padStart(7, '0');
  $('final-wave').textContent = 'SECTOR ' + world.wave;
  setTimeout(() => { $('gameover').style.display = 'flex'; }, 1100);
  audio.stopMusic();
  audio.bossMode = false;
}

// ---------- main loop ----------
let timeScale = 1;
const clock = new THREE.Clock();
const shakeOffset = new THREE.Vector3();

function animate() {
  requestAnimationFrame(animate);
  let rawDt = Math.min(clock.getDelta(), 1 / 30);
  if (paused) rawDt = 0;
  timeScale = Math.min(1, timeScale + rawDt * 1.1);
  const dt = rawDt * timeScale;
  world.time += dt;
  gridUniforms.uTime.value = world.time;

  updateStars(dt);
  updateRidges(dt);
  updateParticles(dt);
  updateRings(dt);
  updateBanner(rawDt);

  if (world.mode === 'playing' || world.mode === 'gameover') {
    if (world.mode === 'playing') {
      updatePlayer(dt);
      updateWaves(dt);
    }
    updateOptions(dt);
    updateBullets(dt);
    updateEnemies(dt);
    updateBoss(dt);
    updateCapsules(dt);
    if (world.mode === 'playing') updateCollisions();
    updatePopups(rawDt);
    if (comboT > 0) {
      comboT -= dt;
      if (comboT <= 0) { combo = 0; updateComboHud(); }
    }
  } else {
    // title attract: ship idles at launch position, particles drift by
    ship.position.set(-14, Math.sin(world.time * 0.8) * 1.4, 0);
    ship.rotation.x = Math.sin(world.time * 0.5) * 0.15;
    shipLight.position.set(-14, ship.position.y, 3);
    ship.userData.engine.scale.setScalar(1.6 + Math.sin(world.time * 30) * 0.3);
    if (Math.random() < 0.1) {
      spawnParticle(rand(-20, 25), rand(-11, 11), rand(-5, 5),
        -rand(4, 12), 0, 0, rand(0.8, 1.6), rand(1, 2), 0x55eeff, 0.3);
    }
  }

  // camera
  trauma = Math.max(0, trauma - rawDt * 1.6);
  const sh = trauma * trauma;
  shakeOffset.set(
    (Math.random() * 2 - 1) * sh * 0.9,
    (Math.random() * 2 - 1) * sh * 0.9,
    0
  );
  const followX = world.mode === 'playing' ? player.x * 0.07 : Math.sin(world.time * 0.1) * 2;
  const followY = world.mode === 'playing' ? player.y * 0.1 : Math.cos(world.time * 0.13) * 1;
  camera.position.set(
    CAM_BASE.x + followX + shakeOffset.x,
    CAM_BASE.y + followY + shakeOffset.y,
    CAM_BASE.z
  );
  camera.lookAt(followX * 2, followY * 1.4, 0);
  camera.rotation.z += sh * (Math.random() * 2 - 1) * 0.03;

  if (flashT > 0) {
    flashT -= rawDt * 5;
    flashLight.intensity *= Math.max(0, flashT);
    if (flashT <= 0) flashLight.intensity = 0;
  }

  composer.render();
}

// debug / cheat console hook (also used by the automated smoke test)
window.__IT = {
  world, player, enemies, ebullets, capsules,
  getBoss: () => boss,
  startGame, startWave, spawnEnemy, spawnCapsule, collectCapsule,
  activatePower, bossDamage, hitPlayer, addScore,
};

// ---------- boot ----------
setHud('hiscore', String(hiscore).padStart(7, '0'));
$('title').style.display = 'flex';
$('hud-play').style.display = 'none';
animate();
