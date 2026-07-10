import * as THREE from 'three';

// Multi-layer parallax starfield + drifting nebula shards behind the tunnel.
export function createBackground(scene) {
  const group = new THREE.Group();
  scene.add(group);

  const layers = [];

  function makeStarLayer(count, spread, size, color, speed) {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() * 2 - 1) * spread.x;
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * spread.y;
      positions[i * 3 + 2] = -Math.random() * spread.z - 20;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color,
      size,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geo, mat);
    group.add(points);
    const layer = { points, speed, spread, count };
    layers.push(layer);
    return layer;
  }

  makeStarLayer(260, { x: 140, y: 80, z: 260 }, 0.55, 0x6688ff, 4);
  makeStarLayer(160, { x: 160, y: 90, z: 260 }, 0.9, 0x4dfcff, 9);
  makeStarLayer(90, { x: 170, y: 100, z: 260 }, 1.6, 0xff8de0, 16);

  // Distant drifting crystal shards for depth/parallax silhouettes.
  const shards = new THREE.Group();
  const shardGeo = new THREE.OctahedronGeometry(1, 0);
  for (let i = 0; i < 14; i++) {
    const mat = new THREE.MeshStandardMaterial({
      color: 0x1a2a55,
      emissive: 0x2a1a55,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.5,
      roughness: 0.6,
    });
    const m = new THREE.Mesh(shardGeo, mat);
    const scale = 2 + Math.random() * 6;
    m.scale.setScalar(scale);
    m.position.set(
      (Math.random() * 2 - 1) * 90,
      (Math.random() * 2 - 1) * 50,
      -60 - Math.random() * 160
    );
    m.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    m.userData.spin = (Math.random() - 0.5) * 0.15;
    m.userData.speed = 3 + Math.random() * 4;
    shards.add(m);
  }
  group.add(shards);

  function update(dt, scrollSpeed) {
    for (const layer of layers) {
      const pos = layer.points.geometry.attributes.position;
      for (let i = 0; i < layer.count; i++) {
        let x = pos.getX(i) - layer.speed * dt * 0.6 - scrollSpeed * dt * 0.05;
        if (x < -layer.spread.x) x += layer.spread.x * 2;
        pos.setX(i, x);
      }
      pos.needsUpdate = true;
    }
    for (const m of shards.children) {
      m.position.x -= m.userData.speed * dt * 0.5;
      m.rotation.x += m.userData.spin * dt;
      m.rotation.y += m.userData.spin * dt * 0.7;
      if (m.position.x < -140) {
        m.position.x = 140 + Math.random() * 40;
        m.position.y = (Math.random() * 2 - 1) * 50;
        m.position.z = -60 - Math.random() * 160;
      }
    }
  }

  return { group, update };
}
