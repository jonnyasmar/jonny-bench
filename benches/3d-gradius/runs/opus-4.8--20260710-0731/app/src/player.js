import * as THREE from 'three';
import { clamp, damp, rand, lerp } from './util.js';

/** The armament ladder. Order defines the power-meter cell order. */
export const POWERS = [
  { key: 'speed',   label: 'Speed',   max: 5 },
  { key: 'missile', label: 'Missile', max: 1 },
  { key: 'double',  label: 'Double',  max: 1 },
  { key: 'laser',   label: 'Laser',   max: 1 },
  { key: 'option',  label: 'Option',  max: 4 },
  { key: 'shield',  label: 'Shield',  max: 1 },
];

const SHIELD_MAX = 3;
const HIST_STEP = 1 / 60;
const OPT_SPACING = 8;   // history samples between successive Options
const MAX_OPTIONS = 4;

const SHIP_C = 0x5cf6ff;

/**
 * 2D dart profile, extruded — long nose, thin body, swept fins. Wound CCW so the
 * extruded caps face the camera.
 */
function hullGeometry() {
  const pts = [
    [1.45, 0], [0.55, 0.22], [-0.10, 0.28], [-0.30, 0.75], [-0.72, 0.80],
    [-0.60, 0.30], [-0.95, 0.24], [-1.15, 0.10],
    [-1.15, -0.10], [-0.95, -0.24], [-0.60, -0.30],
    [-0.72, -0.80], [-0.30, -0.75], [-0.10, -0.28], [0.55, -0.22],
  ];
  const shape = new THREE.Shape();
  shape.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) shape.lineTo(pts[i][0], pts[i][1]);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.22, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 1,
  });
  geo.center();
  return geo;
}

function buildShip(fx) {
  const g = new THREE.Group();

  // Dark faceted body + bright edge lines. A strong emissive fill would flatten
  // the hull into a featureless glowing cutout under bloom — the neon has to
  // come from the outline.
  const hull = hullGeometry();
  const body = new THREE.Mesh(hull, new THREE.MeshStandardMaterial({
    color: 0x13293f, emissive: SHIP_C, emissiveIntensity: 0.14,
    metalness: 0.35, roughness: 0.45, flatShading: true,
  }));
  g.add(body);

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(hull, 20),
    new THREE.LineBasicMaterial({ color: 0x9ff0ff, transparent: true, opacity: 1 })
  );
  g.add(edges);

  // Canopy
  const canopy = new THREE.Mesh(
    new THREE.SphereGeometry(0.17, 12, 8),
    new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xbdf3ff, emissiveIntensity: 1.0, roughness: 0.1 })
  );
  canopy.position.set(0.12, 0, 0.15);
  canopy.scale.set(1.5, 0.8, 0.7);
  g.add(canopy);

  // Engine nacelles + flames
  const nacGeo = new THREE.CylinderGeometry(0.1, 0.13, 0.42, 8);
  nacGeo.rotateZ(Math.PI / 2);
  const flames = [];
  for (const sy of [-1, 1]) {
    const nac = new THREE.Mesh(nacGeo, new THREE.MeshStandardMaterial({
      color: 0x11304a, emissive: SHIP_C, emissiveIntensity: 0.5, metalness: 0.9, roughness: 0.3,
    }));
    nac.position.set(-0.86, 0.2 * sy, 0);
    g.add(nac);

    const flame = new THREE.Sprite(new THREE.SpriteMaterial({
      map: fx.tex.streak, color: 0x6fd8ff, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    flame.position.set(-1.5, 0.2 * sy, 0);
    flame.scale.set(1.2, 0.34, 1);
    g.add(flame);
    flames.push(flame);
  }

  return { group: g, body, edges, canopy, flames };
}

function buildOption(fx) {
  const g = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.26, 0),
    new THREE.MeshBasicMaterial({ color: 0xffd166, wireframe: true })
  );
  g.add(core);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: fx.tex.glow, color: 0xffb347, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  glow.scale.setScalar(1.5);
  g.add(glow);
  return { group: g, core, glow, spawn: 0 };
}

export class Player {
  constructor(game) {
    this.game = game;
    const fx = game.fx;

    const built = buildShip(fx);
    this.group = built.group;
    this.body = built.body;
    this.edges = built.edges;
    this.flames = built.flames;
    game.scene.add(this.group);

    // Force field. Low-poly and near-white on purpose: a dense cyan cage sits at
    // the same hue as the hull's edge lines and swallows the ship's silhouette.
    this.shieldMesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.3, 0),
      new THREE.MeshBasicMaterial({
        color: 0xdff6ff, wireframe: true, transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false,
      })
    );
    this.group.add(this.shieldMesh);

    this.options = [];
    for (let i = 0; i < MAX_OPTIONS; i++) {
      const o = buildOption(fx);
      o.group.visible = false;
      game.scene.add(o.group);
      this.options.push(o);
    }

    // A dedicated light makes the ship pop off the background.
    this.light = new THREE.PointLight(0x7fd8ff, 10, 16, 2);
    game.scene.add(this.light);

    this.hist = [];
    /** Cleared on the title screen so the hero ship idles without shooting. */
    this.firingEnabled = true;
    this.reset(true);
  }

  get pos() { return this.group.position; }

  reset(hard) {
    const b = this.game.bounds;
    this.group.position.set(-b.halfW * 0.62, 0, 0);
    this.group.rotation.set(0, 0, 0);
    this.group.scale.setScalar(1); // the title screen scales the hero ship up
    this.vx = 0; this.vy = 0;
    this.alive = true;
    this.dead = false;
    this.invuln = hard ? 1.0 : 2.6;
    this.fireCd = 0;
    this.missileCd = 0;
    this.t = 0;
    this.histAcc = 0;
    this.hist.length = 0;
    this.group.visible = true;

    if (hard) {
      this.levels = { speed: 0, missile: 0, double: 0, laser: 0, option: 0, shield: 0 };
      this.cursor = 0;
      this.shieldHP = 0;
    } else {
      // Death keeps mobility (it's core to the feel) but strips the arsenal.
      const speed = this.levels.speed;
      this.levels = { speed, missile: 0, double: 0, laser: 0, option: 0, shield: 0 };
      this.shieldHP = 0;
    }
    this.syncOptions(true);
    this.shieldMesh.material.opacity = 0;
  }

  get maxSpeed() { return 14 + this.levels.speed * 2.4; }
  get weapon() { return this.levels.laser ? 'laser' : this.levels.double ? 'double' : 'normal'; }
  get optionCount() { return this.levels.option; }
  get radius() { return 0.38; }

  // ---------------------------------------------------------------- powers

  addCapsule() {
    this.cursor = (this.cursor % POWERS.length) + 1;
  }

  /** @returns {{ok:boolean, key?:string, reason?:string}} */
  activate() {
    if (this.cursor === 0) return { ok: false, reason: 'empty' };
    const p = POWERS[this.cursor - 1];
    const L = this.levels;

    switch (p.key) {
      case 'speed':
        if (L.speed >= p.max) return { ok: false, reason: 'max' };
        L.speed++;
        break;
      case 'missile':
        if (L.missile >= 1) return { ok: false, reason: 'max' };
        L.missile = 1;
        break;
      case 'double':
        if (L.double === 1) return { ok: false, reason: 'max' };
        L.double = 1; L.laser = 0;
        break;
      case 'laser':
        if (L.laser === 1) return { ok: false, reason: 'max' };
        L.laser = 1; L.double = 0;
        break;
      case 'option':
        if (L.option >= MAX_OPTIONS) return { ok: false, reason: 'max' };
        L.option++;
        this.options[L.option - 1].spawn = 1;
        this.syncOptions();
        break;
      case 'shield':
        // Re-buying tops the shield back up — always a legal purchase.
        L.shield = 1;
        this.shieldHP = SHIELD_MAX;
        break;
    }
    this.cursor = 0;
    return { ok: true, key: p.key };
  }

  syncOptions(snap = false) {
    for (let i = 0; i < MAX_OPTIONS; i++) {
      const on = i < this.levels.option;
      this.options[i].group.visible = on;
      if (on && snap) this.options[i].group.position.copy(this.group.position);
    }
  }

  // ---------------------------------------------------------------- damage

  /** @returns true if this hit killed the ship. */
  takeHit() {
    if (this.dead || this.invuln > 0) return false;
    const g = this.game;
    if (this.shieldHP > 0) {
      this.shieldHP--;
      if (this.shieldHP === 0) this.levels.shield = 0;
      this.invuln = 0.4;
      g.audio.shieldHit();
      g.fx.ring(this.pos.x, this.pos.y, 0, 0x5cf6ff, 3.2, 0.35, 1.2);
      g.fx.burst(this.pos.x, this.pos.y, 0, { count: 14, color: 0x5cf6ff, speed: 9, size: 0.5, life: 0.4 });
      g.fx.shake(0.3);
      g.fx.flash('#5cf6ff', 0.16);
      return false;
    }
    this.kill();
    return true;
  }

  kill() {
    if (this.dead) return;
    this.dead = true;
    this.alive = false;
    this.group.visible = false;
    for (const o of this.options) o.group.visible = false;
    const g = this.game;
    g.fx.explode(this.pos.x, this.pos.y, 0, 0x9beeff, 1.15);
    g.fx.ring(this.pos.x, this.pos.y, 0, 0xffffff, 9, 0.7);
    g.fx.flash('#ffffff', 0.5);
    g.fx.shake(0.9);
    g.audio.death();
  }

  respawn() {
    this.reset(false);
    const g = this.game;
    g.fx.ring(this.pos.x, this.pos.y, 0, 0x5cf6ff, 6, 0.5);
    g.fx.burst(this.pos.x, this.pos.y, 0, { count: 18, color: 0x5cf6ff, speed: 10, size: 0.5, life: 0.5 });
  }

  // ---------------------------------------------------------------- firing

  _shootFrom(x, y, isMain) {
    const g = this.game;
    const B = g.bullets;
    switch (this.weapon) {
      case 'laser':
        B.spawnLaser(x, y, { dmg: 1.55 });
        break;
      case 'double':
        B.spawnPlayerShot(x, y, { angle: 0 });
        B.spawnPlayerShot(x, y, { angle: 0.62, speed: 42 });
        break;
      default:
        B.spawnPlayerShot(x, y, { angle: 0 });
    }
    if (isMain) g.fx.muzzle(x + 0.4, y, 0, this.weapon === 'laser' ? 0xd8fbff : 0xbdf3ff, this.weapon === 'laser' ? 1.5 : 1);
  }

  _fire() {
    const g = this.game;
    const nose = this.pos.x + 1.25;
    this._shootFrom(nose, this.pos.y, true);
    for (let i = 0; i < this.levels.option; i++) {
      const o = this.options[i].group.position;
      this._shootFrom(o.x + 0.3, o.y, false);
    }
    this.fireCd = this.weapon === 'laser' ? 0.16 : 0.108;
    if (this.weapon === 'laser') g.audio.laser(); else g.audio.shoot();
  }

  _fireMissiles() {
    const g = this.game;
    const up = (this._missileFlip = !this._missileFlip);
    const vy = up ? 11 : -11;
    g.bullets.spawnMissile(this.pos.x - 0.2, this.pos.y + (up ? 0.3 : -0.3), { vx: 13, vy });
    for (let i = 0; i < Math.min(this.levels.option, 2); i++) {
      const o = this.options[i].group.position;
      g.bullets.spawnMissile(o.x, o.y, { vx: 13, vy: -vy });
    }
    this.missileCd = 0.66;
    g.audio.missile();
  }

  // ---------------------------------------------------------------- update

  update(dt, input) {
    if (this.dead) return;
    const g = this.game;
    this.t += dt;
    if (this.invuln > 0) this.invuln -= dt;

    // ---- movement
    let dx = input.moveX, dy = input.moveY;
    if (!input.usingKeys && input.pointer.active) {
      // Steer toward the pointer's projected world position.
      const b = g.bounds;
      const tx = input.pointer.nx * b.halfW;
      const ty = input.pointer.ny * b.halfH;
      const ddx = tx - this.pos.x, ddy = ty - this.pos.y;
      const d = Math.hypot(ddx, ddy);
      if (d > 0.12) { dx = clamp(ddx / 2.2, -1, 1); dy = clamp(ddy / 2.2, -1, 1); }
    }
    const len = Math.hypot(dx, dy);
    if (len > 1) { dx /= len; dy /= len; }

    const ms = this.maxSpeed;
    this.vx = damp(this.vx, dx * ms, 20, dt);
    this.vy = damp(this.vy, dy * ms, 20, dt);
    this.pos.x += this.vx * dt;
    this.pos.y += this.vy * dt;

    const b = g.bounds;
    const mx = b.halfW - 1.5, my = b.halfH - 1.0;
    if (this.pos.x < -mx) { this.pos.x = -mx; this.vx = 0; }
    if (this.pos.x > mx) { this.pos.x = mx; this.vx = 0; }
    if (this.pos.y < -my) { this.pos.y = -my; this.vy = 0; }
    if (this.pos.y > my) { this.pos.y = my; this.vy = 0; }

    // ---- attitude (nose pitches into the turn, wings roll)
    const ny = this.vy / ms, nx = this.vx / ms;
    this.group.rotation.z = damp(this.group.rotation.z, ny * 0.34, 12, dt);
    this.group.rotation.x = damp(this.group.rotation.x, -ny * 0.55, 10, dt);
    this.group.rotation.y = damp(this.group.rotation.y, nx * 0.2, 10, dt);

    // ---- engines
    const thrust = 0.55 + clamp(nx, 0, 1) * 0.6 + Math.abs(ny) * 0.15;
    for (const f of this.flames) {
      f.scale.set(1.05 * thrust + rand(-0.12, 0.12), 0.28 + rand(-0.03, 0.03), 1);
      f.position.x = -1.1 - f.scale.x * 0.42; // stay attached to the nacelle
      f.material.opacity = 0.6 + rand(-0.12, 0.12);
    }
    if (Math.random() < 0.3) {
      g.fx.mote(this.pos.x - 1.5, this.pos.y + rand(-0.28, 0.28), 0, 0x5cf6ff, 0.24, 0.22, -14, rand(-1.5, 1.5));
    }

    this.light.position.set(this.pos.x, this.pos.y, 2.2);

    // ---- invulnerability strobe
    if (this.invuln > 0) {
      const on = Math.sin(this.t * 42) > -0.2;
      this.body.visible = on;
      this.edges.visible = on;
    } else {
      this.body.visible = true;
      this.edges.visible = true;
    }

    // ---- shield
    const sm = this.shieldMesh;
    const want = this.shieldHP / SHIELD_MAX;
    // Kept faint on purpose — the shell must never obscure the ship inside it.
    sm.material.opacity = damp(sm.material.opacity, want * 0.14, 8, dt);
    if (this.shieldHP > 0) {
      sm.rotation.y += dt * 1.5;
      sm.rotation.x += dt * 0.9;
      const p = 1 + Math.sin(this.t * 5) * 0.03;
      sm.scale.setScalar(p);
      sm.material.color.setHex(this.shieldHP === 1 ? 0xff6b9d : 0xdff6ff);
    }

    // ---- position history drives the Options
    this.histAcc += dt;
    let guard = 0;
    while (this.histAcc >= HIST_STEP && guard++ < 8) {
      this.histAcc -= HIST_STEP;
      this.hist.unshift({ x: this.pos.x, y: this.pos.y });
      if (this.hist.length > MAX_OPTIONS * OPT_SPACING + 4) this.hist.pop();
    }
    for (let i = 0; i < this.levels.option; i++) {
      const o = this.options[i];
      const idx = Math.min((i + 1) * OPT_SPACING, this.hist.length - 1);
      const h = this.hist[idx];
      if (h) {
        if (o.spawn > 0) {
          // Newly bought Options fly in from the ship rather than popping.
          o.spawn = Math.max(0, o.spawn - dt * 2.2);
          o.group.position.x = lerp(h.x, this.pos.x, o.spawn);
          o.group.position.y = lerp(h.y, this.pos.y, o.spawn);
          o.group.scale.setScalar(1 - o.spawn * 0.7);
        } else {
          o.group.position.set(h.x, h.y, 0);
          o.group.scale.setScalar(1);
        }
      }
      o.core.rotation.x += dt * 2.2;
      o.core.rotation.y += dt * 3.1;
      o.glow.material.opacity = 0.7 + Math.sin(this.t * 6 + i) * 0.2;
    }

    // ---- weapons
    if (!this.firingEnabled) return;
    this.fireCd -= dt;
    if (this.fireCd <= 0) this._fire();

    if (this.levels.missile) {
      this.missileCd -= dt;
      if (this.missileCd <= 0) this._fireMissiles();
    }
  }
}
