import * as THREE from 'three';
import { Input } from './input.js';
import { AudioEngine } from './audio.js';
import { Hud } from './hud.js';
import { Game, STATE } from './game.js';
import { damp } from './utils.js';

const canvas = document.getElementById('game');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 400);
camera.position.set(0, 2.6, 9.5);

const hemi = new THREE.HemisphereLight(0x88ccff, 0x120a1e, 0.9);
scene.add(hemi);
const key = new THREE.DirectionalLight(0xffffff, 1.1);
key.position.set(4, 8, 6);
scene.add(key);
const rim = new THREE.PointLight(0xff3df0, 1.2, 60);
rim.position.set(-4, 2, -6);
scene.add(rim);

const audio = new AudioEngine();
const hud = new Hud();
const game = new Game(scene, camera, hud, audio);
window.__debug = { game, audio, hud, THREE };

const input = new Input(
  () => { if (game.state === STATE.PLAYING || game.state === STATE.PAUSED) game.togglePause(); },
  () => {
    const muted = audio.toggleMute();
    hud.setMuted(muted);
  }
);

function beginRun() {
  audio.init();
  audio.resume();
  game.startRun();
}

document.getElementById('start-btn').addEventListener('click', beginRun);
document.getElementById('retry-btn').addEventListener('click', beginRun);
document.getElementById('resume-btn').addEventListener('click', () => game.togglePause());
document.getElementById('mute-btn').addEventListener('click', () => {
  const muted = audio.toggleMute();
  hud.setMuted(muted);
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden && game.state === STATE.PLAYING) game.togglePause();
});

// Camera follows the ship with soft lag, a forward-flight FOV kick while
// firing/boosting, and a shake offset driven by the game's trauma value.
let camX = 0, camY = 0;
let fov = 62;
function updateCamera(dt) {
  const targetX = game.state === STATE.PLAYING ? game.player.x * 0.42 : 0;
  const targetY = game.state === STATE.PLAYING ? game.player.y * 0.28 : 0;
  camX = damp(camX, targetX, 5, dt);
  camY = damp(camY, targetY, 5, dt);

  const shake = game.getShakeOffset ? game.getShakeOffset() : { x: 0, y: 0, rot: 0 };
  camera.position.x = camX + shake.x;
  camera.position.y = 2.6 + camY * 0.4 + shake.y;
  camera.position.z = 9.5;
  camera.rotation.z = shake.rot;

  const lookX = game.state === STATE.PLAYING ? game.player.x * 0.55 : 0;
  const lookY = game.state === STATE.PLAYING ? game.player.y * 0.4 : 0;
  camera.lookAt(lookX, lookY + 0.6, -40);

  const speedRatio = game.state === STATE.PLAYING ? game.player.speed / 15.5 : 1;
  const targetFov = 62 + (speedRatio - 1) * 6;
  fov = damp(fov, targetFov, 4, dt);
  if (Math.abs(camera.fov - fov) > 0.01) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
}

const clock = new THREE.Clock();
function tick() {
  const dt = Math.min(clock.getDelta(), 1 / 15);
  input.update();
  game.update(dt, input);
  updateCamera(dt);
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
