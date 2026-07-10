import * as THREE from 'three';

const SEG_WIDTH = 9;
const CRYSTAL_DEPTH = 14;
const MIN_CHANNEL = 5.5; // guaranteed clear flight corridor, worst-case wave alignment
const WAVE_PEAK = 1.3; // sum of the three sine coefficients in _heightAt's wave()

const topMat = new THREE.MeshStandardMaterial({
  color: 0x1c2d6b,
  emissive: 0x3a5dff,
  emissiveIntensity: 0.35,
  metalness: 0.55,
  roughness: 0.35,
  flatShading: true,
});
const bottomMat = new THREE.MeshStandardMaterial({
  color: 0x2d1c5f,
  emissive: 0xa23aff,
  emissiveIntensity: 0.35,
  metalness: 0.55,
  roughness: 0.35,
  flatShading: true,
});
const edgeMat = new THREE.MeshBasicMaterial({ color: 0x8fe8ff });

function jaggedGeometry(width, depth) {
  // A crystalline wedge cross-section extruded along the tunnel (z) axis.
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, 0);
  shape.lineTo(-width / 2 + width * 0.2, 1);
  shape.lineTo(-width * 0.05, 0.3);
  shape.lineTo(width * 0.15, 1.15);
  shape.lineTo(width / 2, 0);
  shape.lineTo(width / 2, -6);
  shape.lineTo(-width / 2, -6);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
  geo.rotateY(Math.PI / 2);
  geo.translate(0, 0, depth / 2);
  return geo;
}

const segGeo = jaggedGeometry(SEG_WIDTH, CRYSTAL_DEPTH);

function makeSpike(mat) {
  const geo = new THREE.ConeGeometry(0.4, 1.6, 5);
  const m = new THREE.Mesh(geo, mat);
  return m;
}

class WallSide {
  constructor(scene, group, sign, mat, phase) {
    this.sign = sign; // +1 top, -1 bottom
    this.mat = mat;
    this.phase = phase;
    this.segments = [];
    for (let i = 0; i < 10; i++) {
      const mesh = new THREE.Mesh(segGeo, mat);
      mesh.scale.y = -sign; // template is authored as a canonical bottom-wall wedge; flip for the top wall
      group.add(mesh);
      const spike = makeSpike(mat);
      spike.scale.setScalar(0.8 + Math.random() * 0.6);
      group.add(spike);
      this.segments.push({ mesh, spike, progress: 0, height: 0 });
    }
  }
}

export class TerrainSystem {
  constructor(scene) {
    this.group = new THREE.Group();
    scene.add(this.group);
    this.top = new WallSide(scene, this.group, 1, topMat, 0);
    this.bottom = new WallSide(scene, this.group, -1, bottomMat, 5.5);
    this.amplitude = 3.2;
    this.targetAmplitude = 3.2;
    this.gap = 15;
    this.targetGap = 15;
    this.baseCenter = 0;
  }

  reset(bounds) {
    this.bounds = bounds;
    // snap instantly to whatever difficulty was last requested, instead of lerping in
    // from a leftover boss-arena (or previous-run) shape over the first seconds of play
    this.amplitude = this.targetAmplitude;
    this.gap = this.targetGap;
    const startX = bounds.left - SEG_WIDTH;
    let x = startX;
    for (const side of [this.top, this.bottom]) {
      x = startX;
      for (let i = 0; i < side.segments.length; i++) {
        const seg = side.segments[i];
        seg.progress = i * SEG_WIDTH;
        this._layout(side, seg, x);
        x += SEG_WIDTH;
      }
    }
  }

  // Clamp the amplitude actually used so the two independently-phased walls can never
  // cross: worst case both waves swing fully inward at once (each bounded by WAVE_PEAK).
  _effectiveAmplitude() {
    return Math.min(this.amplitude, Math.max(0, (this.gap - MIN_CHANNEL) / (2 * WAVE_PEAK)));
  }

  _heightAt(side, progress) {
    const p = progress * 0.045 + side.phase;
    const wave = Math.sin(p) * 0.6 + Math.sin(p * 2.3 + 1.4) * 0.3 + Math.sin(p * 0.5 + 3) * 0.4;
    return this.baseCenter + side.sign * (this.gap / 2 + wave * this._effectiveAmplitude());
  }

  _layout(side, seg, x) {
    seg.height = this._heightAt(side, seg.progress);
    seg.mesh.position.set(x, seg.height, -CRYSTAL_DEPTH / 2 + 1);
    seg.mesh.scale.y = -side.sign;
    seg.spike.position.set(x + (Math.random() - 0.5) * 2, seg.height + side.sign * 0.1, 1.5 + Math.random() * 3);
    seg.spike.rotation.z = side.sign > 0 ? Math.PI : 0;
    seg.spike.rotation.y = Math.random() * Math.PI;
  }

  setDifficulty(amplitude, gap) {
    this.targetAmplitude = amplitude;
    this.targetGap = gap;
  }

  update(dt, scrollSpeed) {
    this.amplitude = THREE.MathUtils.lerp(this.amplitude, this.targetAmplitude, dt * 0.5);
    this.gap = THREE.MathUtils.lerp(this.gap, this.targetGap, dt * 0.5);

    for (const side of [this.top, this.bottom]) {
      for (const seg of side.segments) {
        seg.mesh.position.x -= scrollSpeed * dt;
        seg.spike.position.x -= scrollSpeed * dt;
      }
      // recycle segments that fully scrolled past the left edge
      side.segments.sort((a, b) => a.mesh.position.x - b.mesh.position.x);
      const rightmost = side.segments[side.segments.length - 1];
      for (const seg of side.segments) {
        if (seg.mesh.position.x < this.bounds.left - SEG_WIDTH * 1.5) {
          const newProgress = rightmost.progress + SEG_WIDTH;
          const newX = rightmost.mesh.position.x + SEG_WIDTH;
          seg.progress = newProgress;
          this._layout(side, seg, newX);
        }
      }
    }
  }

  _sideHeightAtX(side, x) {
    // find bracketing segments by x for smooth interpolation
    let a = null, b = null;
    for (const seg of side.segments) {
      if (seg.mesh.position.x <= x) {
        if (!a || seg.mesh.position.x > a.mesh.position.x) a = seg;
      } else {
        if (!b || seg.mesh.position.x < b.mesh.position.x) b = seg;
      }
    }
    if (!a && b) return b.height;
    if (a && !b) return a.height;
    if (!a && !b) return this.baseCenter + side.sign * (this.gap / 2);
    const span = b.mesh.position.x - a.mesh.position.x || 1;
    const f = (x - a.mesh.position.x) / span;
    return THREE.MathUtils.lerp(a.height, b.height, THREE.MathUtils.clamp(f, 0, 1));
  }

  topAt(x) {
    return this._sideHeightAtX(this.top, x);
  }

  bottomAt(x) {
    return this._sideHeightAtX(this.bottom, x);
  }

  collides(x, y, radius) {
    return y + radius > this.topAt(x) || y - radius < this.bottomAt(x);
  }
}
