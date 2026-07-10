import * as THREE from 'three';
import { COLORS, CONFIG, bounds, setBounds } from './config.js';
import { clamp, rand } from './utils.js';
import { Audio } from './audio.js';
import { Input } from './input.js';
import { UI } from './ui.js';
import { PostFX } from './postfx.js';
import { Starfield, GridTunnel, Particles, ScreenShake } from './effects.js';
import { ProjectileSystem, EnemyBullets } from './weapons.js';
import { EnemyManager } from './enemies.js';
import { WaveDirector } from './waves.js';
import { Player } from './player.js';
import { buildCapsule } from './models.js';

const HISCORE_KEY = 'neon_vanguard_hi';

export class Game {
  constructor(container) {
    this.container = container;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    this.renderer.setClearColor(COLORS.bg, 1);
    container.appendChild(this.renderer.domElement);
    this.canvas = this.renderer.domElement;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(COLORS.fog, 0.008);
    this.camera = new THREE.PerspectiveCamera(CONFIG.fov, 1, 0.1, 400);
    this.camera.position.set(0, 0, CONFIG.camZ);
    this.camera.lookAt(0, 0, 0);

    // lights
    this.scene.add(new THREE.AmbientLight(0x334466, 1.1));
    const key = new THREE.DirectionalLight(0xbfe0ff, 1.1); key.position.set(-4, 6, 10); this.scene.add(key);
    const rim = new THREE.DirectionalLight(COLORS.gridA, 0.6); rim.position.set(6, -4, 4); this.scene.add(rim);

    // effects & systems
    this.starfield = new Starfield(this.scene, bounds);
    this.grid = new GridTunnel(this.scene);
    this.particles = new Particles(this.scene);
    this.shake = new ScreenShake(this.camera);
    this.postfx = new PostFX(this.renderer, this.scene, this.camera);

    this.proj = new ProjectileSystem(this.scene);
    this.ebul = new EnemyBullets(this.scene);
    this.enemies = new EnemyManager(this.scene, this.particles, this.ebul);
    this.waves = new WaveDirector(this.enemies);
    this.player = new Player(this.scene, this.proj, this.particles);
    this.enemies.setPlayer(this.player);

    // capsules
    this.capsules = [];
    this.capsulePool = [];

    // scoring callbacks
    this.enemies.onScore = (pts, x, y) => this.addScore(pts, x, y);
    this.enemies.onCapsule = (x, y) => this.spawnCapsule(x, y);

    this.ui = new UI(document.getElementById('ui'));
    this.hi = parseInt(localStorage.getItem(HISCORE_KEY) || '0', 10) || 0;
    this.ui.setHi(this.hi);

    // meter
    this.meterSel = 0;
    this.hasSel = false;

    this.state = 'title';
    this.phase = 'waves';
    this.stage = 1;

    Input.init(this.canvas);
    window.addEventListener('resize', () => this.resize());
    this.resize();
    this.ui.showTitle(true);

    this._v = new THREE.Vector3();
    this._camPos = new THREE.Vector3();
    this.last = performance.now();
    this._loop = this._loop.bind(this);
    requestAnimationFrame(this._loop);
  }

  resize() {
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.postfx.setSize(w, h);
    // recompute play bounds from frustum at z=0
    const halfH = Math.tan((CONFIG.fov * Math.PI) / 360) * CONFIG.camZ;
    const halfW = halfH * this.camera.aspect;
    setBounds(-halfW, halfW, halfH, -halfH);
    this.ui.setCanvasRect(this.canvas.getBoundingClientRect());
  }

  // ---------- state control ----------
  startGame() {
    Audio.resume();
    Audio.startMusic();
    this.score = 0;
    this.lives = CONFIG.startLives;
    this.stage = 1;
    this.meterSel = 0; this.hasSel = false;
    this._clearCapsules();
    this.enemies.clearAll();
    this.proj.reset(); this.ebul.reset();
    this.player.reset(true);
    this.waves.reset(1);
    this.phase = 'waves';
    this.state = 'playing';
    this.respawnTimer = 0;
    this.bossWarnT = 0;
    this.clearT = 0;
    this.ui.showTitle(false);
    this.ui.showGameOver(false);
    this.ui.showBossBar(false);
    this.ui.setScore(0); this.ui.setStage(1); this.ui.setLives(this.lives);
    this.updateMeterUI();
    this.ui.center(`STAGE 1`, 1600, 'stage');
  }

  gameOver() {
    this.state = 'gameover';
    Audio.stopMusic();
    if (this.score > this.hi) { this.hi = this.score; localStorage.setItem(HISCORE_KEY, String(this.hi)); this.ui.setHi(this.hi); }
    this.ui.showBossBar(false);
    this.ui.showGameOver(true, this.score, this.hi);
  }

  togglePause() {
    if (this.state === 'playing') { this.state = 'paused'; this.ui.showPause(true); Audio.stopMusic(); }
    else if (this.state === 'paused') { this.state = 'playing'; this.ui.showPause(false); Audio.startMusic(); }
  }

  // ---------- scoring / meter ----------
  addScore(pts, x, y) {
    this.score += pts;
    this.ui.setScore(this.score);
    if (x !== undefined) {
      const s = this._toScreen(x, y);
      this.ui.popup('+' + pts, s.x, s.y, pts >= 5000 ? 'big' : '');
    }
  }

  spawnCapsule(x, y) {
    let c = this.capsulePool.pop();
    if (!c) { c = { mesh: buildCapsule() }; this.scene.add(c.mesh); }
    c.mesh.visible = true;
    c.x = x; c.y = y; c.vx = -4.5; c.alive = true; c.t = rand(0, 6);
    c.mesh.position.set(x, y, 0);
    this.capsules.push(c);
  }

  _clearCapsules() {
    for (const c of this.capsules) { c.mesh.visible = false; this.capsulePool.push(c); }
    this.capsules.length = 0;
  }

  collectCapsule(c) {
    Audio.capsule();
    if (!this.hasSel) { this.hasSel = true; this.meterSel = 0; }
    else this.meterSel = (this.meterSel + 1) % CONFIG.powerSlots.length;
    const s = this._toScreen(c.x, c.y);
    this.ui.popup('POWER', s.x, s.y, 'cap');
    this.updateMeterUI();
  }

  spendPower() {
    if (!this.hasSel) return;
    const slot = CONFIG.powerSlots[this.meterSel];
    const label = this.player.applyPower(slot);
    if (label) {
      Audio.powerup();
      this.hasSel = false;
      const s = this._toScreen(this.player.x + 2, this.player.y + 2);
      this.ui.popup(label, s.x, s.y, 'power');
      this.shake.add(0.12);
    } else {
      Audio.select(); // maxed — keep selection so player can pick another
      const s = this._toScreen(this.player.x + 2, this.player.y + 2);
      this.ui.popup('MAX', s.x, s.y, '');
    }
    this.updateMeterUI();
  }

  updateMeterUI() {
    this.ui.setMeter(this.hasSel ? this.meterSel : -1, this.player.owned());
  }

  // ---------- main loop ----------
  _loop(now) {
    let dt = (now - this.last) / 1000;
    this.last = now;
    dt = Math.min(dt, 0.05); // clamp big frame gaps

    Input.update();

    if (this.state === 'title') {
      this._ambientUpdate(dt);
      if (Input.consumeStart()) this.startGame();
    } else if (this.state === 'gameover') {
      this._ambientUpdate(dt);
      if (Input.consumeStart()) { this.ui.showGameOver(false); this.state = 'title'; this.ui.showTitle(true); }
    } else if (this.state === 'paused') {
      if (Input.pausePressed) this.togglePause();
    } else if (this.state === 'playing') {
      if (Input.pausePressed) this.togglePause();
      else this._playUpdate(dt);
    }

    this.shake.update(dt);
    this.postfx.render();
    requestAnimationFrame(this._loop);
  }

  _ambientUpdate(dt) {
    this.starfield.update(dt, 1);
    this.grid.update(dt, 1);
    this.particles.update(dt);
    // idle demo drift of the player ship on the title screen
    if (this.state === 'title') {
      this.player.group.position.y = Math.sin(performance.now() * 0.001) * 1.5;
    }
  }

  _playUpdate(dt) {
    const speedMul = 1 + this.player.speedLevel * 0.12;
    this.starfield.update(dt, speedMul);
    this.grid.update(dt, speedMul);

    // pointer aim in world space
    let aim = null;
    if (Input.usingPointer && Input.pointer.active) {
      this.camera.getWorldPosition(this._camPos);
      this._v.set(Input.pointer.x, Input.pointer.y, 0.5).unproject(this.camera).sub(this._camPos);
      const t = -this._camPos.z / this._v.z;
      aim = { active: true, wx: this._camPos.x + this._v.x * t, wy: this._camPos.y + this._v.y * t };
    }

    // player
    if (this.respawnTimer > 0) {
      this.respawnTimer -= dt;
      if (this.respawnTimer <= 0) this.player.reset(false);
    } else if (this.player.alive) {
      this.player.update(dt, Input, aim);
      if (Input.powerPressed) this.spendPower();
    }

    // enemies / waves
    this._phaseUpdate(dt);
    this.enemies.update(dt);
    this.proj.update(dt);
    this.ebul.update(dt);
    this._updateCapsules(dt);
    this.particles.update(dt);

    this._collisions();
  }

  _phaseUpdate(dt) {
    if (this.phase === 'waves') {
      this.waves.update(dt);
      if (this.waves.done && this.enemies.active.length === 0) {
        this.phase = 'bosswarn';
        this.bossWarnT = 2.4;
        this.ui.center('⚠ WARNING ⚠<br><span class="sub">MASSIVE ENEMY APPROACHING</span>', 2400, 'warn');
        Audio.warn();
      }
    } else if (this.phase === 'bosswarn') {
      this.bossWarnT -= dt;
      if (this.bossWarnT <= 0) {
        this.enemies.spawnBoss(this.stage);
        this.phase = 'boss';
        this.ui.showBossBar(true);
        this.ui.setBossHP(1);
      }
    } else if (this.phase === 'boss') {
      if (this.enemies.boss && this.enemies.boss.alive) {
        this.ui.setBossHP(this.enemies.boss.hp / this.enemies.boss.maxHp);
      } else if (this.enemies.boss && !this.enemies.boss.alive) {
        // death animation
        if (this.enemies.updateBossDeath(dt)) {
          this.phase = 'clear';
          this.clearT = 2.6;
          this.ui.showBossBar(false);
          const bonus = 3000 * this.stage + this.lives * 1000;
          this.addScore(bonus);
          this.ui.center(`STAGE ${this.stage} CLEAR<br><span class="sub">BONUS ${bonus}</span>`, 2600, 'clear');
          this.shake.add(0.5);
        }
      }
    } else if (this.phase === 'clear') {
      this.clearT -= dt;
      if (this.clearT <= 0) {
        this.stage++;
        this.ui.setStage(this.stage);
        this.waves.reset(this.stage);
        this.phase = 'waves';
        this.ui.center(`STAGE ${this.stage}`, 1600, 'stage');
      }
    }
  }

  _updateCapsules(dt) {
    for (let i = this.capsules.length - 1; i >= 0; i--) {
      const c = this.capsules[i];
      c.t += dt;
      c.x += c.vx * dt;
      c.y += Math.sin(c.t * 3) * 0.02;
      c.mesh.position.set(c.x, c.y, 0);
      c.mesh.rotation.y += dt * 2.5;
      if (c.mesh.userData.ring) c.mesh.userData.ring.rotation.z += dt * 3;
      c.mesh.userData.mesh.scale.setScalar(1 + Math.sin(c.t * 6) * 0.12);
      if (c.x < bounds.left - 4) { c.alive = false; c.mesh.visible = false; this.capsulePool.push(c); this.capsules.splice(i, 1); }
    }
  }

  // ---------- collisions ----------
  _collisions() {
    const P = this.player;
    const enemies = this.enemies.active;
    const boss = this.enemies.boss;

    // player projectiles vs enemies + boss
    const proj = this.proj.active;
    for (let i = proj.length - 1; i >= 0; i--) {
      const p = proj[i];
      let consumed = false;
      for (let j = enemies.length - 1; j >= 0; j--) {
        const e = enemies[j];
        if (!e.alive) continue;
        const dx = p.x - e.x, dy = p.y - e.y;
        const rr = e.radius + 0.5;
        if (dx * dx + dy * dy < rr * rr) {
          if (p.pierce) {
            if (!p.hits.has(e)) { p.hits.add(e); this.enemies.damage(e, p.damage); }
          } else {
            this.enemies.damage(e, p.damage);
            consumed = true;
            this.particles.emit(p.x, p.y, 0, { color: COLORS.bullet, speed: 6, ttl: 0.2, size: 3 });
            break;
          }
        }
      }
      if (!consumed && boss && boss.alive && boss.state === 'fight') {
        // boss weak spot = exposed core at (x-1.5)
        const cx = boss.x - 1.5, cy = boss.y;
        const dx = p.x - cx, dy = p.y - cy;
        if (dx * dx + dy * dy < (boss.coreR + 0.4) * (boss.coreR + 0.4)) {
          if (p.pierce) {
            if (!p.hits.has(boss)) { p.hits.add(boss); this.enemies.damageBoss(p.damage); }
          } else {
            this.enemies.damageBoss(p.damage);
            consumed = true;
            this.shake.add(0.05);
          }
        } else {
          // struck armor — spark, block normal shots
          const bdx = p.x - boss.x, bdy = p.y - boss.y;
          if (bdx * bdx + bdy * bdy < boss.radius * boss.radius && !p.pierce) {
            consumed = true;
            this.particles.emit(p.x, p.y, 0, { color: COLORS.eViolet, speed: 8, ttl: 0.2, size: 3 });
          }
        }
      }
      if (consumed) this.proj.recycle(p);
    }

    if (this.respawnTimer > 0 || !P.alive) return;

    // enemy bullets vs player
    const eb = this.ebul.active;
    for (let i = eb.length - 1; i >= 0; i--) {
      const b = eb[i];
      const dx = b.x - P.x, dy = b.y - P.y;
      if (dx * dx + dy * dy < (P.radius + 0.35) * (P.radius + 0.35)) {
        this.ebul.recycle(b);
        this._playerHit();
        if (!P.alive) return;
      }
    }

    // enemy bodies vs player (and capsules)
    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      if (!e.alive) continue;
      const dx = e.x - P.x, dy = e.y - P.y;
      const rr = e.radius + P.radius;
      if (dx * dx + dy * dy < rr * rr) {
        this.enemies.damage(e, 2);
        this._playerHit();
        if (!P.alive) return;
      }
    }

    // boss body vs player
    if (boss && boss.alive) {
      const dx = boss.x - P.x, dy = boss.y - P.y;
      if (dx * dx + dy * dy < (boss.radius + P.radius) * (boss.radius + P.radius)) {
        this._playerHit();
        if (!P.alive) return;
      }
    }

    // capsules vs player
    for (let i = this.capsules.length - 1; i >= 0; i--) {
      const c = this.capsules[i];
      const dx = c.x - P.x, dy = c.y - P.y;
      if (dx * dx + dy * dy < (P.radius + 1.0) * (P.radius + 1.0)) {
        this.collectCapsule(c);
        c.mesh.visible = false; this.capsulePool.push(c); this.capsules.splice(i, 1);
      }
    }
  }

  _playerHit() {
    const res = this.player.hit();
    if (res === 'shield') { this.shake.add(0.25); return; }
    if (res === 'safe') return;
    // dead
    this.player.explode();
    this.shake.add(0.7);
    this.updateMeterUI();
    if (this.lives > 0) {
      this.lives--;
      this.ui.setLives(this.lives);
      this.respawnTimer = CONFIG.respawnDelay;
    } else {
      this.gameOver();
    }
  }

  _toScreen(x, y) {
    this._v.set(x, y, 0).project(this.camera);
    const r = this.canvas.getBoundingClientRect();
    return { x: (this._v.x * 0.5 + 0.5) * r.width + r.left, y: (-this._v.y * 0.5 + 0.5) * r.height + r.top };
  }
}
