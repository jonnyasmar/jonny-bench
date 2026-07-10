import * as THREE from 'three';
import { COLORS } from './config.js';

// Shared: a dark faceted body + bright neon edge lines. Bloom turns the edges
// into glow. This is the signature look of NEON VANGUARD.

export function neonBody(color, emissiveMul = 0.35) {
  return new THREE.MeshStandardMaterial({
    color: 0x0a0a16,
    emissive: new THREE.Color(color).multiplyScalar(emissiveMul),
    metalness: 0.6, roughness: 0.35, flatShading: true,
  });
}

export function edges(geometry, color, opacity = 1) {
  const eg = new THREE.EdgesGeometry(geometry, 25);
  const m = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  return new THREE.LineSegments(eg, m);
}

// Glowing solid (for cores, engines, capsules) — reads bright under bloom.
export function glow(color) {
  return new THREE.MeshBasicMaterial({ color });
}

function faceted(group, geo, color, emissiveMul) {
  const body = new THREE.Mesh(geo, neonBody(color, emissiveMul));
  const edge = edges(geo, color);
  group.add(body, edge);
  group.userData.body = body;
  group.userData.edge = edge;
  group.userData.baseColor = new THREE.Color(color);
  return body;
}

// ---------------------------------------------------------------------------
// Player ship — a sleek dart pointing +X (forward).
// ---------------------------------------------------------------------------
export function buildPlayer() {
  const g = new THREE.Group();

  // main hull: 4-sided elongated pyramid
  const hull = new THREE.ConeGeometry(0.85, 3.0, 4);
  hull.rotateZ(-Math.PI / 2);
  hull.rotateX(Math.PI / 4);
  faceted(g, hull, COLORS.player, 0.4);

  // rear body block
  const rear = new THREE.BoxGeometry(1.1, 0.55, 0.9);
  const rearMesh = new THREE.Mesh(rear, neonBody(COLORS.player, 0.3));
  rearMesh.position.x = -1.15;
  g.add(rearMesh, edges(rear, COLORS.player).translateX(-1.15));

  // wings — swept back
  const wingGeo = new THREE.BufferGeometry();
  const wv = new Float32Array([
    -1.2, 0, 0,   0.4, 0, 0,   -1.7, 0, 1.6,
    -1.2, 0, 0,  -1.7, 0, 1.6,  -1.9, 0, 0.2,
  ]);
  wingGeo.setAttribute('position', new THREE.BufferAttribute(wv, 3));
  wingGeo.computeVertexNormals();
  const wing = new THREE.Mesh(wingGeo, neonBody(COLORS.gridA, 0.5));
  const wing2 = wing.clone(); wing2.scale.z = -1;
  const wingEdge = edges(wingGeo, COLORS.gridA);
  const wingEdge2 = edges(wingGeo, COLORS.gridA); wingEdge2.scale.z = -1;
  g.add(wing, wing2, wingEdge, wingEdge2);

  // cockpit
  const cock = new THREE.SphereGeometry(0.32, 10, 8);
  const cockMesh = new THREE.Mesh(cock, glow(COLORS.playerHot));
  cockMesh.position.set(0.35, 0.28, 0);
  g.add(cockMesh);

  // engine glow core (animated flame added in player.js)
  const eng = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), glow(COLORS.engine));
  eng.position.set(-1.7, 0, 0);
  eng.scale.set(1, 0.7, 0.7);
  g.add(eng);
  g.userData.engine = eng;

  g.scale.setScalar(0.92);
  return g;
}

// Animated engine flame — a stretched cone we pulse each frame.
export function buildFlame() {
  const geo = new THREE.ConeGeometry(0.34, 1.6, 8);
  geo.rotateZ(Math.PI / 2);
  geo.translate(-0.8, 0, 0);
  const mat = new THREE.MeshBasicMaterial({
    color: COLORS.engine, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const m = new THREE.Mesh(geo, mat);
  m.position.set(-1.9, 0, 0);
  return m;
}

// ---------------------------------------------------------------------------
// Enemies — each returns a Group with userData describing its silhouette.
// ---------------------------------------------------------------------------
export function buildEnemy(type) {
  const g = new THREE.Group();
  switch (type) {
    case 'drone': {
      const geo = new THREE.OctahedronGeometry(1.05, 0);
      faceted(g, geo, COLORS.eMagenta, 0.5);
      g.userData.spin = new THREE.Vector3(0, 2.4, 1.1);
      break;
    }
    case 'sine': {
      const geo = new THREE.TetrahedronGeometry(1.15, 0);
      faceted(g, geo, COLORS.eViolet, 0.5);
      g.userData.spin = new THREE.Vector3(2.2, 2.0, 0);
      break;
    }
    case 'diver': {
      const geo = new THREE.ConeGeometry(0.8, 2.4, 6);
      geo.rotateZ(Math.PI / 2); // point -X toward player
      faceted(g, geo, COLORS.eOrange, 0.55);
      g.userData.spin = new THREE.Vector3(3.0, 0, 0);
      break;
    }
    case 'shooter': {
      const geo = new THREE.IcosahedronGeometry(1.15, 0);
      faceted(g, geo, COLORS.eGreen, 0.45);
      // barrel
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.1, 8), glow(COLORS.eGreen));
      bar.rotation.z = Math.PI / 2; bar.position.x = -0.9;
      g.add(bar);
      g.userData.spin = new THREE.Vector3(0, 1.2, 0);
      break;
    }
    case 'popcorn': {
      const geo = new THREE.IcosahedronGeometry(0.7, 0);
      faceted(g, geo, COLORS.capsule, 0.6);
      g.userData.spin = new THREE.Vector3(3.5, 3.5, 0);
      break;
    }
    case 'tank': {
      const geo = new THREE.DodecahedronGeometry(1.5, 0);
      faceted(g, geo, COLORS.eMagenta, 0.4);
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 10), glow(COLORS.bossCore));
      g.add(core);
      g.userData.core = core;
      g.userData.spin = new THREE.Vector3(0.4, 0.8, 0.2);
      break;
    }
  }
  return g;
}

// ---------------------------------------------------------------------------
// Boss — a large armored hull with an exposed pulsing core (the weak point).
// ---------------------------------------------------------------------------
export function buildBoss() {
  const g = new THREE.Group();
  // main hull
  const hull = new THREE.IcosahedronGeometry(4.2, 1);
  const hullMesh = new THREE.Mesh(hull, neonBody(COLORS.eViolet, 0.25));
  const hullEdge = edges(hull, COLORS.eViolet, 0.9);
  g.add(hullMesh, hullEdge);

  // armor ring
  const ring = new THREE.TorusGeometry(4.6, 0.6, 8, 24);
  const ringMesh = new THREE.Mesh(ring, neonBody(COLORS.eMagenta, 0.4));
  ringMesh.rotation.y = Math.PI / 2;
  g.add(ringMesh, edges(ring, COLORS.eMagenta).rotateY(Math.PI / 2));
  g.userData.ring = ringMesh;

  // exposed core
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.6, 0), glow(COLORS.bossCore));
  core.position.x = -1.5;
  g.add(core);
  g.userData.core = core;

  // core cage
  const cage = new THREE.Mesh(
    new THREE.TorusGeometry(2.0, 0.25, 6, 16),
    neonBody(COLORS.bossCore, 0.6)
  );
  cage.position.x = -1.5; cage.rotation.y = Math.PI / 2;
  g.add(cage);
  g.userData.cage = cage;

  // side turrets
  const turrets = [];
  for (const sy of [-2.6, 2.6]) {
    const tGeo = new THREE.CylinderGeometry(0.5, 0.7, 1.6, 6);
    const t = new THREE.Mesh(tGeo, neonBody(COLORS.eOrange, 0.5));
    t.rotation.z = Math.PI / 2;
    t.position.set(-1.2, sy, 0);
    const tEdge = edges(tGeo, COLORS.eOrange);
    tEdge.rotation.z = Math.PI / 2;
    tEdge.position.set(-1.2, sy, 0);
    g.add(t, tEdge);
    turrets.push(t);
  }
  g.userData.turrets = turrets;
  g.userData.hullMesh = hullMesh;
  return g;
}

// ---------------------------------------------------------------------------
// Pickups & satellites
// ---------------------------------------------------------------------------
export function buildCapsule() {
  const g = new THREE.Group();
  const geo = new THREE.OctahedronGeometry(0.62, 0);
  const mesh = new THREE.Mesh(geo, glow(COLORS.capsule));
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.85, 0.06, 6, 20),
    new THREE.MeshBasicMaterial({ color: COLORS.playerHot, transparent: true, opacity: 0.8 })
  );
  g.add(mesh, ring);
  g.userData.ring = ring;
  g.userData.mesh = mesh;
  return g;
}

export function buildOption() {
  const g = new THREE.Group();
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5, 0), glow(COLORS.optionC));
  const shell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.72, 0),
    new THREE.MeshBasicMaterial({ color: COLORS.optionC, wireframe: true, transparent: true, opacity: 0.7 })
  );
  g.add(core, shell);
  g.userData.shell = shell;
  return g;
}
