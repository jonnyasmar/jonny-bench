import * as THREE from 'three';
import { getGridTexture, getGlowTexture, randRange, choice } from './utils.js';

// Flight envelope the player and enemies live inside.
export const BOUNDS = { xMin: -7.6, xMax: 7.6, yMin: -3.9, yMax: 4.2 };
export const PLAYER_Z = 0;
export const SPAWN_Z = -230;
export const DESPAWN_Z = 16;

const SEGMENT_LENGTH = 34;
const SEGMENT_COUNT = 10;
const PALETTE = [0x4dfaff, 0xff3df0, 0xffb347];

export class World {
  constructor(scene) {
    this.scene = scene;
    this.scrollSpeed = 26; // world units / second the tunnel appears to move
    this.distance = 0;
    this.time = 0;

    this._buildFog();
    this._buildStarfield();
    this._buildGrids();
    this._buildTunnel();
  }

  _buildFog() {
    this.scene.fog = new THREE.FogExp2(0x03040a, 0.014);
    this.scene.background = new THREE.Color(0x03040a);
  }

  _buildStarfield() {
    const layers = [
      { count: 400, spread: 260, z: -260, size: 1.6, color: 0x88e6ff, speed: 0.4 },
      { count: 250, spread: 200, z: -180, size: 2.2, color: 0xff9de8, speed: 0.7 },
      { count: 150, spread: 140, z: -120, size: 2.8, color: 0xffffff, speed: 1.0 },
    ];
    this.starLayers = layers.map((cfg) => {
      const positions = new Float32Array(cfg.count * 3);
      for (let i = 0; i < cfg.count; i++) {
        positions[i * 3] = randRange(-cfg.spread, cfg.spread);
        positions[i * 3 + 1] = randRange(-cfg.spread * 0.5, cfg.spread * 0.5);
        positions[i * 3 + 2] = randRange(-300, 40);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        color: cfg.color,
        size: cfg.size,
        map: getGlowTexture(THREE, '#ffffff'),
        alphaTest: 0.02,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const pts = new THREE.Points(geo, mat);
      this.scene.add(pts);
      return { pts, cfg, positions };
    });
  }

  _buildGrids() {
    const tex = getGridTexture(THREE);
    tex.repeat.set(10, 60);
    const geo = new THREE.PlaneGeometry(60, 360, 1, 1);
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.floorGrid = new THREE.Mesh(geo, mat);
    this.floorGrid.rotation.x = -Math.PI / 2;
    this.floorGrid.position.set(0, BOUNDS.yMin - 1.4, -140);
    this.scene.add(this.floorGrid);

    this.ceilGrid = new THREE.Mesh(geo, mat.clone());
    this.ceilGrid.rotation.x = Math.PI / 2;
    this.ceilGrid.position.set(0, BOUNDS.yMax + 1.4, -140);
    this.scene.add(this.ceilGrid);

    this.floorTex = tex;
    this.ceilTex = this.ceilGrid.material.map;
  }

  _buildTunnel() {
    // Decorative crystal ring segments recycled to fake an infinite tunnel.
    // Kept well outside the flight envelope and away from the camera's
    // near field so they read as distant scenery, not screen-filling props.
    this.crystalGeo = new THREE.OctahedronGeometry(1, 0);
    this.segments = [];
    for (let s = 1; s <= SEGMENT_COUNT; s++) {
      const group = new THREE.Group();
      group.position.z = -s * SEGMENT_LENGTH;
      const crystalCount = 8 + ((s * 3) % 5);
      for (let i = 0; i < crystalCount; i++) {
        const angle = (i / crystalCount) * Math.PI * 2 + randRange(-0.2, 0.2);
        const radius = randRange(15, 21);
        const color = choice(PALETTE);
        const mat = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.5,
          wireframe: false,
        });
        const mesh = new THREE.Mesh(this.crystalGeo, mat);
        const scale = randRange(0.6, 1.3);
        mesh.scale.set(scale, scale * randRange(1.1, 1.9), scale);
        mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.72, randRange(-SEGMENT_LENGTH * 0.45, SEGMENT_LENGTH * 0.45));
        mesh.rotation.set(randRange(0, Math.PI), randRange(0, Math.PI), randRange(0, Math.PI));
        mesh.userData.phase = randRange(0, Math.PI * 2);
        mesh.userData.baseOpacity = mat.opacity;

        const edges = new THREE.EdgesGeometry(this.crystalGeo);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 }));
        mesh.add(line);

        group.add(mesh);
      }
      this.scene.add(group);
      this.segments.push(group);
    }
  }

  update(dt, playerX = 0, playerY = 0) {
    this.time += dt;
    const dz = this.scrollSpeed * dt;
    this.distance += dz;

    // Recycle tunnel segments once they pass behind the camera.
    for (const seg of this.segments) {
      seg.position.z += dz;
      if (seg.position.z > 14) {
        seg.position.z -= SEGMENT_LENGTH * SEGMENT_COUNT;
      }
      for (const mesh of seg.children) {
        mesh.rotation.x += dt * 0.15;
        mesh.rotation.y += dt * 0.1;
        const pulse = 0.55 + Math.sin(this.time * 1.6 + mesh.userData.phase) * 0.2;
        mesh.material.opacity = pulse;
      }
    }

    // Parallax starfield drift + gentle drift toward player for depth cue.
    for (const layer of this.starLayers) {
      const pos = layer.positions;
      for (let i = 0; i < layer.cfg.count; i++) {
        pos[i * 3 + 2] += dz * layer.cfg.speed;
        if (pos[i * 3 + 2] > 40) {
          pos[i * 3 + 2] -= 340;
          pos[i * 3] = randRange(-layer.cfg.spread, layer.cfg.spread);
          pos[i * 3 + 1] = randRange(-layer.cfg.spread * 0.5, layer.cfg.spread * 0.5);
        }
      }
      layer.pts.geometry.attributes.position.needsUpdate = true;
      layer.pts.position.x = playerX * 0.04;
      layer.pts.position.y = playerY * 0.04;
    }

    this.floorTex.offset.y -= dz * 0.03;
    this.ceilTex.offset.y -= dz * 0.03;
  }
}
