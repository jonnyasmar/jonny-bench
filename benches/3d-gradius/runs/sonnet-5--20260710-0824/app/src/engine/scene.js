import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { CopyShader } from 'three/addons/shaders/CopyShader.js';

export function createSceneRig(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05030c, 0.0115);

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 400);
  camera.position.set(0, 0, 34);
  camera.lookAt(0, 0, 0);

  const camRig = new THREE.Group();
  camRig.add(camera);
  scene.add(camRig);

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.05, // strength
    0.5,  // radius
    0.1   // threshold
  );
  composer.addPass(bloomPass);

  const copyPass = new ShaderPass(CopyShader);
  copyPass.renderToScreen = true;
  composer.addPass(copyPass);

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    composer.setSize(w, h);
    bloomPass.setSize(w, h);
  }
  window.addEventListener('resize', resize);
  resize();

  // Ambient + key lighting for a bit of dimensionality on top of the emissive/bloom look.
  const ambient = new THREE.AmbientLight(0x3d4d8f, 1.7);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0x9fd9ff, 1.6);
  key.position.set(-10, 12, 20);
  scene.add(key);
  const rim = new THREE.PointLight(0xff4de0, 1.1, 120, 2);
  rim.position.set(0, 0, 25);
  scene.add(rim);

  return { renderer, scene, camera, camRig, composer, bloomPass, resize };
}

// Computes the visible half-width/half-height of the camera frustum at a given world z (0 by default).
export function visibleBoundsAtZ(camera, z = 0) {
  const distance = camera.position.z - z;
  const vFov = (camera.fov * Math.PI) / 180;
  const halfHeight = Math.tan(vFov / 2) * distance;
  const halfWidth = halfHeight * camera.aspect;
  return { halfWidth, halfHeight };
}
