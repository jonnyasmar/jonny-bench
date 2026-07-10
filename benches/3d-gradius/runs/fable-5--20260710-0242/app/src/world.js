import * as THREE from 'three';
import { PAL } from './config.js';
import { rand, TAU } from './util.js';

// Scrolling backdrop: parallax starfields, jagged crystal ridges top+bottom
// (near + far layers), and drifting background crystals.

function ridgeHeight(x, seed) {
  return (
    1.7 * Math.abs(Math.sin(x * 0.115 + seed)) +
    1.15 * Math.abs(Math.sin(x * 0.31 + seed * 2.7)) +
    0.5 * Math.abs(Math.sin(x * 0.73 + seed * 1.3))
  );
}

class Ridge {
  // sign +1 = floor (spikes point up), -1 = ceiling.
  constructor(scene, { baseY, sign, z, fill, wire, amp, seed, span = 96, segs = 150, parallax = 1 }) {
    this.sign = sign; this.baseY = baseY; this.amp = amp; this.seed = seed;
    this.span = span; this.segs = segs; this.parallax = parallax;
    this.scroll = 0;

    const verts = new Float32Array((segs + 1) * 2 * 3);
    const idx = [];
    for (let i = 0; i <= segs; i++) {
      const x = -span / 2 + (span / segs) * i;
      // even = ridge edge, odd = deep edge (offscreen)
      verts[i * 6] = x; verts[i * 6 + 1] = baseY; verts[i * 6 + 2] = z;
      verts[i * 6 + 3] = x; verts[i * 6 + 4] = baseY - sign * 8; verts[i * 6 + 5] = z;
      if (i < segs) {
        const a = i * 2, b = i * 2 + 1, c = i * 2 + 2, d = i * 2 + 3;
        idx.push(a, b, c, b, d, c);
      }
    }
    this.geo = new THREE.BufferGeometry();
    this.geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    this.geo.setIndex(idx);
    this.geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, baseY, z), span);

    const fillMat = new THREE.MeshBasicMaterial({ color: fill });
    this.mesh = new THREE.Mesh(this.geo, fillMat);
    scene.add(this.mesh);

    // Neon crest line tracing the ridge silhouette.
    const lineVerts = new Float32Array((segs + 1) * 3);
    for (let i = 0; i <= segs; i++) {
      lineVerts[i * 3] = -span / 2 + (span / segs) * i;
      lineVerts[i * 3 + 1] = baseY;
      lineVerts[i * 3 + 2] = z + 0.05;
    }
    this.lineGeo = new THREE.BufferGeometry();
    this.lineGeo.setAttribute('position', new THREE.BufferAttribute(lineVerts, 3));
    this.lineGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, baseY, z), span);
    const line = new THREE.Line(this.lineGeo, new THREE.LineBasicMaterial({
      color: wire, transparent: true, opacity: 0.85,
    }));
    line.frustumCulled = false;
    scene.add(line);
    this._reshape();
  }

  _reshape() {
    const p = this.geo.attributes.position.array;
    const lp = this.lineGeo.attributes.position.array;
    const { segs, span } = this;
    for (let i = 0; i <= segs; i++) {
      const x = -span / 2 + (span / segs) * i;
      const h = ridgeHeight(x + this.scroll, this.seed) * this.amp;
      const y = this.baseY + this.sign * h;
      p[i * 6 + 1] = y;
      lp[i * 3 + 1] = y;
    }
    this.geo.attributes.position.needsUpdate = true;
    this.lineGeo.attributes.position.needsUpdate = true;
  }

  update(dt, speed) {
    this.scroll += speed * dt;
    this._reshape();
  }
}

function makeStars(scene, count, color, sizePx, zBase) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = rand(-55, 55);
    pos[i * 3 + 1] = rand(-26, 26);
    pos[i * 3 + 2] = zBase + rand(-3, 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e5);
  const mat = new THREE.PointsMaterial({
    color, size: sizePx, sizeAttenuation: false,
    transparent: true, opacity: 0.9, depthWrite: false, fog: false,
  });
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  scene.add(pts);
  return { pts, pos, count };
}

export class World {
  constructor(scene) {
    scene.background = new THREE.Color(PAL.bg);
    scene.fog = new THREE.Fog(PAL.fog, 18, 42);

    scene.add(new THREE.AmbientLight(0x8a7fd0, 0.75));
    const key = new THREE.DirectionalLight(0xcfe8ff, 1.6);
    key.position.set(-4, 6, 8);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xff5ad2, 0.7);
    rim.position.set(6, -4, 5);
    scene.add(rim);

    this.starLayers = [
      { ...makeStars(scene, 300, PAL.starA, 1.2, -26), speed: 0.35 },
      { ...makeStars(scene, 130, PAL.starB, 1.7, -22), speed: 1.0 },
      { ...makeStars(scene, 55, PAL.starC, 2.3, -18), speed: 2.2 },
    ];

    this.ridges = [
      new Ridge(scene, { baseY: -10.6, sign: 1, z: -2.5, fill: PAL.ridgeNear, wire: PAL.ridgeNearWire, amp: 0.9, seed: 2.1 }),
      new Ridge(scene, { baseY: 10.6, sign: -1, z: -2.5, fill: PAL.ridgeNear, wire: PAL.ridgeNearWire, amp: 0.8, seed: 5.6 }),
      new Ridge(scene, { baseY: -14, sign: 1, z: -10, fill: PAL.ridgeFar, wire: PAL.ridgeFarWire, amp: 1.3, seed: 9.4, parallax: 0.45 }),
      new Ridge(scene, { baseY: 14, sign: -1, z: -10, fill: PAL.ridgeFar, wire: PAL.ridgeFarWire, amp: 1.2, seed: 13.9, parallax: 0.45 }),
    ];

    // Drifting background crystals.
    this.crystals = [];
    const geo = new THREE.OctahedronGeometry(1, 0);
    for (let i = 0; i < 11; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: PAL.crystal, roughness: 0.3, metalness: 0.6,
        emissive: PAL.ridgeNearWire, emissiveIntensity: 0.08, flatShading: true,
      });
      const m = new THREE.Mesh(geo, mat);
      m.position.set(rand(-30, 30), rand(-7, 7), rand(-14, -6));
      const s = rand(0.4, 1.6);
      m.scale.set(s, s * rand(1.2, 2.4), s);
      m.rotation.set(rand(TAU), rand(TAU), rand(TAU));
      scene.add(m);
      this.crystals.push({ m, spin: rand(0.1, 0.5), drift: rand(0.5, 1.4) });
    }
  }

  update(dt, speed, t) {
    for (const layer of this.starLayers) {
      const p = layer.pos;
      for (let i = 0; i < layer.count; i++) {
        p[i * 3] -= speed * layer.speed * dt;
        if (p[i * 3] < -55) {
          p[i * 3] += 110;
          p[i * 3 + 1] = rand(-26, 26);
        }
      }
      layer.pts.geometry.attributes.position.needsUpdate = true;
    }
    for (const r of this.ridges) r.update(dt, speed * r.parallax);
    for (const c of this.crystals) {
      c.m.rotation.y += c.spin * dt;
      c.m.rotation.x += c.spin * 0.6 * dt;
      c.m.position.x -= c.drift * dt;
      if (c.m.position.x < -34) {
        c.m.position.x = 34;
        c.m.position.y = rand(-7, 7);
      }
    }
  }
}
