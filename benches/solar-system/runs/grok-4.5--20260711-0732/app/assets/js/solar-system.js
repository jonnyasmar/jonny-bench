import * as THREE from "three";
import { BODIES } from "./data.js";

/**
 * Interactive 3D solar system (educational, not to scale).
 * Tap planets to select; drag to orbit camera; pinch/scroll to zoom.
 */
export class SolarSystem {
  constructor(canvas, { onSelect } = {}) {
    this.canvas = canvas;
    this.onSelect = onSelect || (() => {});
    this.spinning = true;
    this.showLabels = true;
    this.bodies = [];
    this.labels = [];
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this._disposed = false;

    this._initRenderer();
    this._initScene();
    this._initCamera();
    this._buildSystem();
    this._bindInput();
    this._resize();
    this._animate();

    window.addEventListener("resize", this._onResize);
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(0x000000, 0);
  }

  _initScene() {
    this.scene = new THREE.Scene();

    const ambient = new THREE.AmbientLight(0x4455aa, 0.55);
    this.scene.add(ambient);

    this.sunLight = new THREE.PointLight(0xfff2cc, 2.8, 200, 0.6);
    this.scene.add(this.sunLight);

    // Soft fill so night sides stay visible for kids
    const fill = new THREE.DirectionalLight(0x8899ff, 0.35);
    fill.position.set(-20, 10, -10);
    this.scene.add(fill);

    this._addStars();
  }

  _addStars() {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 80 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.35,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
    });
    this.scene.add(new THREE.Points(geo, mat));
  }

  _initCamera() {
    const w = this.canvas.clientWidth || 1;
    const h = this.canvas.clientHeight || 1;
    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 500);
    this.camera.position.set(0, 28, 52);
    this.camera.lookAt(0, 0, 0);

    // Manual orbit state
    this.orbit = {
      theta: 0.35,
      phi: 1.15,
      radius: 58,
      target: new THREE.Vector3(0, 0, 0),
      dragging: false,
      lastX: 0,
      lastY: 0,
    };
    this._updateCameraFromOrbit();
  }

  _updateCameraFromOrbit() {
    const { theta, phi, radius, target } = this.orbit;
    const sinPhi = Math.sin(phi);
    this.camera.position.set(
      target.x + radius * sinPhi * Math.sin(theta),
      target.y + radius * Math.cos(phi),
      target.z + radius * sinPhi * Math.cos(theta)
    );
    this.camera.lookAt(target);
  }

  _makePlanetTexture(body) {
    const size = 128;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(size * 0.35, size * 0.35, size * 0.1, size * 0.5, size * 0.5, size * 0.5);
    g.addColorStop(0, body.color);
    g.addColorStop(1, body.color2 || body.color);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    if (body.hasBands) {
      ctx.globalAlpha = 0.35;
      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = i % 2 ? "#8b5a2b" : "#f5d6a8";
        ctx.fillRect(0, (i / 8) * size, size, size / 10);
      }
      ctx.globalAlpha = 1;
      // Great red spot
      ctx.fillStyle = "rgba(200, 60, 40, 0.55)";
      ctx.beginPath();
      ctx.ellipse(size * 0.65, size * 0.55, size * 0.12, size * 0.07, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    if (body.id === "earth") {
      ctx.fillStyle = "rgba(46, 204, 113, 0.7)";
      ctx.beginPath();
      ctx.ellipse(size * 0.35, size * 0.4, size * 0.14, size * 0.18, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(size * 0.65, size * 0.55, size * 0.12, size * 0.1, -0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    if (body.id === "mars") {
      ctx.fillStyle = "rgba(80, 30, 20, 0.3)";
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * size, Math.random() * size, 2 + Math.random() * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  _buildSystem() {
    this.system = new THREE.Group();
    this.scene.add(this.system);

    for (const body of BODIES) {
      const group = new THREE.Group();
      group.userData = { id: body.id, body };

      if (body.isStar) {
        const geo = new THREE.SphereGeometry(body.size3d, 48, 48);
        const mat = new THREE.MeshBasicMaterial({ color: body.color });
        const mesh = new THREE.Mesh(geo, mat);
        group.add(mesh);

        // Glow shell
        const glowGeo = new THREE.SphereGeometry(body.size3d * 1.35, 32, 32);
        const glowMat = new THREE.MeshBasicMaterial({
          color: 0xffaa33,
          transparent: true,
          opacity: 0.22,
          side: THREE.BackSide,
        });
        group.add(new THREE.Mesh(glowGeo, glowMat));

        // Corona points
        const corona = new THREE.Mesh(
          new THREE.SphereGeometry(body.size3d * 1.15, 24, 24),
          new THREE.MeshBasicMaterial({
            color: 0xffee88,
            transparent: true,
            opacity: 0.35,
          })
        );
        group.add(corona);
        group.userData.mesh = mesh;
      } else {
        // Orbit ring
        const orbitGeo = new THREE.RingGeometry(body.orbit - 0.04, body.orbit + 0.04, 128);
        const orbitMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.12,
          side: THREE.DoubleSide,
        });
        const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat);
        orbitMesh.rotation.x = -Math.PI / 2;
        this.system.add(orbitMesh);

        const geo = new THREE.SphereGeometry(body.size3d, 32, 32);
        const mat = new THREE.MeshStandardMaterial({
          map: this._makePlanetTexture(body),
          roughness: 0.7,
          metalness: 0.05,
        });
        const mesh = new THREE.Mesh(geo, mat);
        group.add(mesh);
        group.userData.mesh = mesh;

        // Initial position on orbit
        const angle = (body.order / 8) * Math.PI * 2;
        group.position.set(
          Math.cos(angle) * body.orbit,
          0,
          Math.sin(angle) * body.orbit
        );
        group.userData.angle = angle;
        group.userData.orbit = body.orbit;
        group.userData.speed = body.speed;

        if (body.hasRings) {
          const inner = body.size3d * 1.3;
          const outer = body.size3d * 2.2;
          const ringGeo = new THREE.RingGeometry(inner, outer, 64);
          // UV fix for ring
          const pos = ringGeo.attributes.position;
          const uv = ringGeo.attributes.uv;
          for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const u = (Math.atan2(y, x) / (Math.PI * 2)) + 0.5;
            const len = Math.sqrt(x * x + y * y);
            const v = (len - inner) / (outer - inner);
            uv.setXY(i, u, v);
          }
          const ringMat = new THREE.MeshBasicMaterial({
            color: body.ringColor || 0xe8d5a3,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.75,
          });
          const ring = new THREE.Mesh(ringGeo, ringMat);
          ring.rotation.x = -Math.PI / 2.4;
          group.add(ring);
        }

        // Earth moon mini
        if (body.id === "earth") {
          const moon = new THREE.Mesh(
            new THREE.SphereGeometry(0.18, 12, 12),
            new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.8 })
          );
          moon.position.set(1.5, 0.2, 0);
          group.add(moon);
          group.userData.moon = moon;
        }
      }

      this.system.add(group);
      this.bodies.push(group);

      // HTML-like sprite label via CSS2D would need extra addon; use simple sprites
      const label = this._makeLabel(body.name);
      label.position.y = (body.size3d || 1) + 0.9;
      group.add(label);
      this.labels.push(label);
    }
  }

  _makeLabel(text) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 256, 64);
    ctx.font = "bold 32px Nunito, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    const w = ctx.measureText(text).width;
    roundRect(ctx, 128 - w / 2 - 14, 12, w + 28, 40, 12);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText(text, 128, 34);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(3.2, 0.8, 1);
    return sprite;
  }

  _bindInput() {
    const el = this.canvas;

    const onPointerDown = (e) => {
      this.orbit.dragging = true;
      this.orbit.lastX = e.clientX;
      this.orbit.lastY = e.clientY;
      this.orbit.moved = false;
      el.setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (!this.orbit.dragging) return;
      const dx = e.clientX - this.orbit.lastX;
      const dy = e.clientY - this.orbit.lastY;
      if (Math.abs(dx) + Math.abs(dy) > 4) this.orbit.moved = true;
      this.orbit.lastX = e.clientX;
      this.orbit.lastY = e.clientY;
      this.orbit.theta -= dx * 0.008;
      this.orbit.phi = clamp(this.orbit.phi - dy * 0.008, 0.25, Math.PI - 0.25);
      this._updateCameraFromOrbit();
    };

    const onPointerUp = (e) => {
      if (!this.orbit.dragging) return;
      this.orbit.dragging = false;
      if (!this.orbit.moved) {
        this._pick(e.clientX, e.clientY);
      }
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);

    el.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        this.orbit.radius = clamp(this.orbit.radius + e.deltaY * 0.04, 18, 100);
        this._updateCameraFromOrbit();
      },
      { passive: false }
    );

    // Pinch zoom
    let pinchDist = 0;
    el.addEventListener("touchstart", (e) => {
      if (e.touches.length === 2) {
        pinchDist = dist(e.touches[0], e.touches[1]);
      }
    });
    el.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches.length === 2) {
          e.preventDefault();
          const d = dist(e.touches[0], e.touches[1]);
          const delta = pinchDist - d;
          pinchDist = d;
          this.orbit.radius = clamp(this.orbit.radius + delta * 0.05, 18, 100);
          this._updateCameraFromOrbit();
        }
      },
      { passive: false }
    );

    this._unbind = () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
    };
  }

  _pick(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);

    const meshes = this.bodies.map((b) => b.userData.mesh).filter(Boolean);
    const hits = this.raycaster.intersectObjects(meshes, false);
    if (hits.length) {
      const mesh = hits[0].object;
      const group = this.bodies.find((b) => b.userData.mesh === mesh);
      if (group) {
        this._highlight(group);
        this.onSelect(group.userData.body);
      }
    }
  }

  _highlight(group) {
    if (this._hl) {
      this._hl.scale.set(1, 1, 1);
    }
    this._hl = group;
    // brief pulse via scale on mesh
    const mesh = group.userData.mesh;
    if (mesh) {
      mesh.scale.set(1.15, 1.15, 1.15);
      setTimeout(() => {
        if (mesh) mesh.scale.set(1, 1, 1);
      }, 350);
    }
  }

  selectById(id) {
    const group = this.bodies.find((b) => b.userData.id === id);
    if (group) {
      this._highlight(group);
      this.onSelect(group.userData.body);
    }
  }

  setSpinning(on) {
    this.spinning = on;
  }

  setLabels(on) {
    this.showLabels = on;
    for (const l of this.labels) l.visible = on;
  }

  resetCamera() {
    this.orbit.theta = 0.35;
    this.orbit.phi = 1.15;
    this.orbit.radius = 58;
    this.orbit.target.set(0, 0, 0);
    this._updateCameraFromOrbit();
  }

  _onResize = () => this._resize();

  _resize() {
    const parent = this.canvas.parentElement;
    const w = parent?.clientWidth || window.innerWidth;
    const h = parent?.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / Math.max(h, 1);
    this.camera.updateProjectionMatrix();
  }

  _animate = () => {
    if (this._disposed) return;
    requestAnimationFrame(this._animate);
    const dt = Math.min(this.clock.getDelta(), 0.05);

    if (this.spinning) {
      for (const group of this.bodies) {
        const { orbit, speed, moon, mesh } = group.userData;
        if (orbit && speed) {
          group.userData.angle += speed * 0.12 * dt;
          group.position.x = Math.cos(group.userData.angle) * orbit;
          group.position.z = Math.sin(group.userData.angle) * orbit;
        }
        if (mesh && !group.userData.body?.isStar) {
          mesh.rotation.y += dt * 0.4;
        }
        if (group.userData.body?.isStar && mesh) {
          mesh.rotation.y += dt * 0.15;
        }
        if (moon) {
          moon.position.x = Math.cos(this.clock.elapsedTime * 2) * 1.5;
          moon.position.z = Math.sin(this.clock.elapsedTime * 2) * 1.5;
        }
      }
    }

    // Gentle auto-rotate when not dragging
    if (!this.orbit.dragging && this.spinning) {
      this.orbit.theta += dt * 0.05;
      this._updateCameraFromOrbit();
    }

    this.renderer.render(this.scene, this.camera);
  };

  start() {
    this._resize();
  }

  dispose() {
    this._disposed = true;
    window.removeEventListener("resize", this._onResize);
    this._unbind?.();
    this.renderer.dispose();
  }
}

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

function dist(a, b) {
  const dx = a.clientX - b.clientX;
  const dy = a.clientY - b.clientY;
  return Math.hypot(dx, dy);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
