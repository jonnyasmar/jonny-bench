import * as THREE from 'three';
import { clamp } from './utils.js';
import { World, DESPAWN_Z } from './world.js';
import { ParticleSystem } from './particles.js';
import { Player } from './player.js';
import { WeaponSystem } from './weapons.js';
import { SpawnDirector, updateEnemy, updateEnemyBullets, updatePrisms, createPrism } from './enemies.js';
import { Boss } from './boss.js';

const HIGH_SCORE_KEY = 'astralSiege.highScore';
const COMBO_WINDOW = 2.4;
const SECTOR_NAMES = [
  'SECTOR 1 — THRENODY APPROACH',
  'SECTOR 2 — RESISTANCE RISING',
  'SECTOR 3 — DENSE HOSTILES',
  'SECTOR 4 — FINAL APPROACH',
];

export const STATE = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAMEOVER: 'gameover',
  VICTORY: 'victory',
};

export class Game {
  constructor(scene, camera, hud, audio) {
    this.scene = scene;
    this.camera = camera;
    this.hud = hud;
    this.audio = audio;

    this.entities = { playerBullets: [], enemyBullets: [], enemies: [], pickups: [] };
    this.world = new World(scene);
    this.particles = new ParticleSystem(scene);
    this.player = new Player(scene, this.particles, audio);
    this.weapons = new WeaponSystem(scene, this.particles, audio, this.player, this.entities);
    this.director = new SpawnDirector(scene, this.entities);

    this.boss = null;
    this.state = STATE.MENU;
    this.score = 0;
    this.best = Number(localStorage.getItem(HIGH_SCORE_KEY) || 0);
    this.lives = 3;
    this.comboCount = 0;
    this.comboTimer = 0;
    this.respawnTimer = 0;
    this.lastTier = -1;
    this.shakeTrauma = 0;
    this.time = 0;
    this._victoryHandled = false;

    this.hud.setHighScoreLine(this.best);
  }

  addShake(amount) {
    this.shakeTrauma = clamp(this.shakeTrauma + amount, 0, 1.5);
  }

  getShakeOffset() {
    const t = this.shakeTrauma * this.shakeTrauma;
    return {
      x: (Math.random() * 2 - 1) * t * 0.9,
      y: (Math.random() * 2 - 1) * t * 0.7,
      rot: (Math.random() * 2 - 1) * t * 0.05,
    };
  }

  startRun() {
    this.state = STATE.PLAYING;
    this.score = 0;
    this.lives = 3;
    this.comboCount = 0;
    this.comboTimer = 0;
    this.respawnTimer = 0;
    this.lastTier = -1;
    this.shakeTrauma = 0;
    this._victoryHandled = false;

    this.player.reset();
    this.weapons.reset();
    this.director.reset();
    this._clearEntities();
    if (this.boss) {
      this.boss.dispose(this.scene);
      this.boss = null;
    }
    this.hud.hideBossBar();
    this.hud.showGameHud();
    this.hud.showScreen('none');
    this.hud.setLowHp(false);
    this.audio.stopBossAlarm();
    this.hud.showWaveBanner(SECTOR_NAMES[0]);
  }

  _clearEntities() {
    for (const e of this.entities.enemies) this.scene.remove(e.mesh);
    this.entities.enemies.length = 0;
    for (const b of this.entities.enemyBullets) this.scene.remove(b.mesh);
    this.entities.enemyBullets.length = 0;
    for (const p of this.entities.pickups) this.scene.remove(p.mesh);
    this.entities.pickups.length = 0;
  }

  togglePause() {
    if (this.state === STATE.PLAYING) {
      this.state = STATE.PAUSED;
      this.hud.showScreen('pause');
    } else if (this.state === STATE.PAUSED) {
      this.state = STATE.PLAYING;
      this.hud.showScreen('none');
    }
  }

  update(dt, input) {
    dt = Math.min(dt, 1 / 20);
    this.hud.tick(dt);
    this.shakeTrauma = Math.max(0, this.shakeTrauma - dt * 2.4);

    if (this.state === STATE.MENU) {
      this.world.update(dt * 0.4, 0, 0);
      this.particles.update(dt);
      return;
    }
    if (this.state !== STATE.PLAYING) return;

    this.time += dt;
    this.world.update(dt, this.player.x, this.player.y);
    this.player.update(dt, input);
    this.weapons.update(dt, input, this.entities.enemies);
    if (input.powerJustPressed) this.weapons.tryActivate();

    if (!this.boss) {
      const result = this.director.update(dt);
      if (result === 'boss') this._startBoss();
      const tier = this.director.tier();
      if (tier !== this.lastTier && tier < SECTOR_NAMES.length) {
        this.lastTier = tier;
        this.hud.showWaveBanner(SECTOR_NAMES[tier]);
        this.audio.waveStart();
      }
    }

    this._updateEnemies(dt);
    updateEnemyBullets(dt, this.entities, this.scene);
    updatePrisms(dt, this.entities, this.player, this.world, this.scene);

    if (this.boss) this._updateBoss(dt);

    this._resolveCollisions(dt);

    this.comboTimer -= dt;
    if (this.comboTimer <= 0 && this.comboCount > 0) {
      this.comboCount = 0;
    }

    if (!this.player.alive) {
      this.respawnTimer -= dt;
      if (this.respawnTimer <= 0) {
        if (this.lives > 0) {
          this.player.respawn();
        }
      }
    }

    this.hud.setScore(this.score);
    this.hud.setCombo(this._comboMultiplier(), this.comboCount);
    this.hud.setLives(this.lives);
    this.hud.renderPower(this.weapons);
    this.hud.setLowHp(this.lives === 1);
  }

  _comboMultiplier() {
    return 1 + Math.floor(this.comboCount / 5);
  }

  _startBoss() {
    this.boss = new Boss(this.scene);
    this.hud.showWaveBanner('WARNING — HIVE CORE DETECTED');
    this.hud.showBossBar();
    this.audio.startBossAlarm();
  }

  _updateEnemies(dt) {
    const arr = this.entities.enemies;
    for (let i = arr.length - 1; i >= 0; i--) {
      const e = arr[i];
      updateEnemy(e, dt, this.player, this.world, this.scene, this.entities);
      if (e.z > DESPAWN_Z) {
        this.scene.remove(e.mesh);
        arr.splice(i, 1);
      }
    }
  }

  _updateBoss(dt) {
    this.boss.update(dt, this.player, this.scene, this.entities, this.particles, this.audio);
    this.hud.setBossHealth(this.boss.healthFraction());
    if (this.boss.isDefeated() && this.boss._deathTimer <= 0 && !this._victoryHandled) {
      this._victoryHandled = true;
      this.score += 5000;
      this.addShake(1.4);
      this.audio.stopBossAlarm();
      this._endGame(true);
    }
  }

  _killEnemy(e, awardScore = true) {
    if (!e.alive) return;
    e.alive = false;
    const color = { r: 1, g: 0.75, b: 0.35 };
    this.particles.burst(e.x, e.y, e.z, color, e.type === 'obstacle' ? 14 : 26, { speed: 11, life: 0.75, size: 1.6 });
    this.audio.explosion(e.type === 'obstacle' ? 0.9 : 0.6);
    this.scene.remove(e.mesh);
    const idx = this.entities.enemies.indexOf(e);
    if (idx >= 0) this.entities.enemies.splice(idx, 1);

    if (awardScore && e.scoreValue > 0) {
      this.comboCount += 1;
      this.comboTimer = COMBO_WINDOW;
      this.score += Math.round(e.scoreValue * this._comboMultiplier());
    }
    if (e.dropChance && Math.random() < e.dropChance) {
      const prism = createPrism(this.scene, e.x, e.y, e.z);
      this.entities.pickups.push(prism);
    }
  }

  _damagePlayer(amount) {
    if (this.player.invulnerable || !this.player.alive) return;
    if (this.weapons.absorbHit()) {
      this.addShake(0.25);
      return;
    }
    this.audio.playerHit();
    this.hud.flashHit(1);
    this.addShake(0.9);
    this.comboCount = 0;
    this.player.explode();
    this.weapons.onPlayerDeath();
    this.lives -= 1;
    this.respawnTimer = 1.3;
    if (this.lives <= 0) {
      this.respawnTimer = 999;
      this._endGame(false);
    }
  }

  _resolveCollisions() {
    const { playerBullets, enemyBullets, enemies, pickups } = this.entities;
    const bossParts = this.boss ? this.boss.damageableParts() : [];
    const bossContact = this.boss ? this.boss.contactParts() : [];

    // Player bullets vs enemies + boss parts.
    for (let bi = playerBullets.length - 1; bi >= 0; bi--) {
      const b = playerBullets[bi];
      let consumed = false;

      for (let ei = enemies.length - 1; ei >= 0; ei--) {
        const e = enemies[ei];
        if (!e.alive) continue;
        if (!this._sphereHit(b, e)) continue;
        if (e.damageable) {
          if (b.piercing) {
            if (b.hitSet.has(e.id)) continue;
            b.hitSet.add(e.id);
          } else {
            consumed = true;
          }
          this._damageEnemy(e, b.damage);
        } else {
          this.particles.spark(b.x, b.y, b.z, 0, 0, -4, { r: 0.6, g: 0.7, b: 1 });
          if (!b.piercing) consumed = true;
        }
        if (consumed) break;
      }

      if (!consumed) {
        for (const part of bossParts) {
          if (!this._sphereHit(b, part)) continue;
          if (b.piercing) {
            const key = part === this.boss.core ? 'core' : part;
            if (b.hitSet.has(key)) continue;
            b.hitSet.add(key);
          } else {
            consumed = true;
          }
          this.boss.damagePart(part, b.damage, this.particles, this.audio);
          this.addShake(0.08);
          if (part === this.boss.core) this.score += 15;
          else this.score += 8;
          if (consumed) break;
        }
      }

      if (consumed) {
        this.scene.remove(b.mesh);
        playerBullets.splice(bi, 1);
      }
    }

    // Player vs enemy contact.
    if (this.player.alive && !this.player.invulnerable) {
      for (const e of enemies) {
        if (!this._sphereHit(this.player, e)) continue;
        this._damagePlayer(e.contactDamage || 1);
        if (e.damageable) this._killEnemy(e, true);
        break;
      }
      if (this.player.alive) {
        for (const part of bossContact) {
          if (!this._sphereHit(this.player, part)) continue;
          this._damagePlayer(part.contactDamage || 1);
          break;
        }
      }
    }

    // Player vs enemy bullets.
    if (this.player.alive && !this.player.invulnerable) {
      for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const b = enemyBullets[i];
        if (!this._sphereHit(this.player, b)) continue;
        this.scene.remove(b.mesh);
        enemyBullets.splice(i, 1);
        this._damagePlayer(b.damage || 1);
        if (!this.player.alive) break;
      }
    }

    // Player vs pickups.
    if (this.player.alive) {
      for (let i = pickups.length - 1; i >= 0; i--) {
        const p = pickups[i];
        if (!this._sphereHit(this.player, p)) continue;
        this.scene.remove(p.mesh);
        pickups.splice(i, 1);
        this.weapons.collectPrism();
        this.score += 25;
      }
    }

    // Sweep now-dead enemies flagged by bullet damage (hp<=0 but not yet removed).
    for (let ei = enemies.length - 1; ei >= 0; ei--) {
      const e = enemies[ei];
      if (e.alive && e.damageable && e.hp <= 0) this._killEnemy(e, true);
    }
  }

  _damageEnemy(e, dmg) {
    if (e.shieldHp > 0) {
      e.shieldHp -= dmg;
      this.audio.hit();
      this.particles.spark(e.x, e.y, e.z, 0, 0, -3, { r: 0.4, g: 1, b: 0.7 });
      if (e.shieldHp <= 0 && e.shell) {
        e.shell.visible = false;
        this.audio.shieldBreak();
      }
      return;
    }
    e.hp -= dmg;
    this.audio.hit();
  }

  _sphereHit(a, b) {
    const dx = a.x - b.x, dy = a.y - b.y, dz = (a.z !== undefined ? a.z : a.mesh.position.z) - (b.z !== undefined ? b.z : b.mesh.position.z);
    const ar = a.radius !== undefined ? a.radius : a.hitRadius;
    const br = b.radius !== undefined ? b.radius : b.hitRadius;
    const r = ar + br;
    return dx * dx + dy * dy + dz * dz <= r * r;
  }

  _endGame(victory) {
    this.state = victory ? STATE.VICTORY : STATE.GAMEOVER;
    const isNew = this.score > this.best;
    if (isNew) {
      this.best = this.score;
      localStorage.setItem(HIGH_SCORE_KEY, String(this.best));
    }
    this.hud.hideGameHud();
    this.hud.hideBossBar();
    this.audio.stopBossAlarm();
    const wave = SECTOR_NAMES[clamp(this.lastTier, 0, SECTOR_NAMES.length - 1)]
      .split('—')[0].trim();
    if (victory) {
      this.hud.showVictory({ score: this.score, best: this.best, isNew });
    } else {
      this.hud.showGameOver({ score: this.score, best: this.best, isNew, wave });
    }
  }
}
