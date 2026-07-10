import { rand, randInt, clamp } from './util.js';

/**
 * Spawn director. Difficulty `d` ramps within a sector *and* across sectors, so
 * the back half of sector 1 already teaches what sector 2 opens with.
 *
 * Wave templates unlock at difficulty gates; the picker is weighted and refuses
 * to repeat itself back-to-back so patterns stay legible.
 */
const BOSS_AT = (stage) => 48 + stage * 5;
const WARN_LEAD = 3.6;

const TEMPLATES = [
  { id: 'droneLine',   minD: 0,   w: 3.0 },
  { id: 'sineSquad',   minD: 0,   w: 3.0 },
  { id: 'crossfire',   minD: 1.2, w: 2.2 },
  { id: 'vDive',       minD: 1.8, w: 2.2 },
  { id: 'mineField',   minD: 2.6, w: 1.6 },
  { id: 'turretPair',  minD: 3.0, w: 1.9 },
  { id: 'spinnerTrio', minD: 4.2, w: 1.7 },
  { id: 'carrier',     minD: 5.5, w: 0.8 },
  { id: 'gauntlet',    minD: 6.5, w: 1.5 },
];

export class Waves {
  constructor(game) {
    this.game = game;
    this.pending = [];
    this.reset(1);
  }

  reset(stage) {
    this.stage = stage;
    this.time = 0;
    this.waveCd = 1.8;
    this.pending.length = 0;
    this.bossAt = BOSS_AT(stage);
    this.warned = false;
    this.bossSpawned = false;
    this.last = null;
  }

  get difficulty() {
    return clamp((this.stage - 1) * 2.0 + this.time / 16, 0, 14);
  }

  _queue(delay, fn) { this.pending.push({ t: delay, fn }); }

  update(dt) {
    this.time += dt;

    for (let i = this.pending.length - 1; i >= 0; i--) {
      const p = this.pending[i];
      p.t -= dt;
      if (p.t <= 0) { p.fn(); this.pending.splice(i, 1); }
    }

    if (this.bossSpawned) return;

    if (!this.warned && this.time >= this.bossAt - WARN_LEAD) {
      this.warned = true;
      this.game.onBossWarning();
    }

    if (this.time >= this.bossAt) {
      this.bossSpawned = true;
      this.pending.length = 0;
      this.game.spawnBoss();
      return;
    }

    // Stop feeding new waves into the boss entrance.
    if (this.time > this.bossAt - WARN_LEAD) return;

    this.waveCd -= dt;
    if (this.waveCd <= 0) {
      this._spawnWave();
      const d = this.difficulty;
      this.waveCd = clamp(3.3 - d * 0.17, 1.0, 3.3) * rand(0.85, 1.15);
    }
  }

  _spawnWave() {
    const d = this.difficulty;
    const avail = TEMPLATES.filter((t) => d >= t.minD && t.id !== this.last);
    const total = avail.reduce((a, t) => a + t.w, 0);
    let r = Math.random() * total;
    let chosen = avail[avail.length - 1];
    for (const t of avail) { r -= t.w; if (r <= 0) { chosen = t; break; } }
    this.last = chosen.id;
    this[chosen.id](d);
  }

  // -------------------------------------------------------------- helpers

  get spawnX() { return this.game.bounds.halfW + 2.5; }
  randY(margin = 1.8) {
    const h = this.game.bounds.halfH - margin;
    return rand(-h, h);
  }

  /** Wipe out every member and the last kill drops a capsule. */
  _formation(n) { return this.game.newFormation(n); }

  // -------------------------------------------------------------- waves

  droneLine(d) {
    const n = randInt(4, 5) + (d > 5 ? 1 : 0);
    const y = this.randY(2.4);
    const f = this._formation(n);
    for (let i = 0; i < n; i++) {
      this._queue(i * 0.26, () =>
        this.game.spawnEnemy('drone', this.spawnX, y, { formation: f, canFire: i % 2 === 0 })
      );
    }
  }

  sineSquad(d) {
    const n = randInt(5, 6) + (d > 6 ? 2 : 0);
    const y = this.randY(3.6);
    const f = this._formation(n);
    const up = Math.random() < 0.5 ? 1 : -1;
    for (let i = 0; i < n; i++) {
      this._queue(i * 0.17, () =>
        this.game.spawnEnemy('waver', this.spawnX, y, {
          formation: f, phase: i * 0.55 * up, amp: 2.4 + d * 0.06, freq: 2.2,
        })
      );
    }
  }

  crossfire(d) {
    const n = randInt(3, 4);
    const h = this.game.bounds.halfH - 2;
    const f = this._formation(n * 2);
    for (let i = 0; i < n; i++) {
      const t = i * 0.3;
      this._queue(t, () => this.game.spawnEnemy('waver', this.spawnX, h, { formation: f, phase: 0, amp: 3.2, freq: 1.8 }));
      this._queue(t + 0.12, () => this.game.spawnEnemy('waver', this.spawnX, -h, { formation: f, phase: Math.PI, amp: 3.2, freq: 1.8 }));
    }
    if (d > 3) this._queue(1.2, () => this.game.spawnEnemy('drone', this.spawnX, 0, { canFire: true }));
  }

  vDive(d) {
    const n = 3 + (d > 6 ? 2 : 0);
    for (let i = 0; i < n; i++) {
      this._queue(i * 0.42, () => this.game.spawnEnemy('hunter', this.spawnX, this.randY(2.6), {}));
    }
  }

  mineField(d) {
    const n = randInt(4, 6);
    for (let i = 0; i < n; i++) {
      this._queue(i * 0.34, () => this.game.spawnEnemy('mine', this.spawnX, this.randY(1.6), {}));
    }
    if (d > 4) {
      const f = this._formation(3);
      for (let i = 0; i < 3; i++) {
        this._queue(1.4 + i * 0.24, () => this.game.spawnEnemy('drone', this.spawnX, this.randY(2.4), { formation: f, canFire: true }));
      }
    }
  }

  turretPair(d) {
    const h = this.game.bounds.halfH - 2.6;
    this.game.spawnEnemy('turret', this.spawnX, h * rand(0.5, 1), {});
    this._queue(0.5, () => this.game.spawnEnemy('turret', this.spawnX, -h * rand(0.5, 1), {}));
    if (d > 5) {
      const f = this._formation(4);
      for (let i = 0; i < 4; i++) {
        this._queue(1.5 + i * 0.2, () => this.game.spawnEnemy('waver', this.spawnX, 0, { formation: f, phase: i * 0.6, amp: 4, freq: 2 }));
      }
    }
  }

  spinnerTrio(d) {
    const n = d > 8 ? 3 : 2;
    for (let i = 0; i < n; i++) {
      this._queue(i * 0.9, () => this.game.spawnEnemy('spinner', this.spawnX, this.randY(3), {}));
    }
  }

  carrier() {
    this.game.spawnEnemy('carrier', this.spawnX + 1, this.randY(3.4), { forceDrop: true });
  }

  gauntlet(d) {
    const f = this._formation(5);
    for (let i = 0; i < 5; i++) {
      this._queue(i * 0.2, () => this.game.spawnEnemy('waver', this.spawnX, this.randY(4), { formation: f, phase: i * 0.5, amp: 2.6, freq: 2.4 }));
    }
    this._queue(1.3, () => this.game.spawnEnemy('turret', this.spawnX, this.randY(3), {}));
    this._queue(2.1, () => this.game.spawnEnemy('spinner', this.spawnX, this.randY(3), {}));
    if (d > 9) this._queue(2.8, () => this.game.spawnEnemy('hunter', this.spawnX, this.randY(2.6), {}));
    if (d > 11) this._queue(3.4, () => this.game.spawnEnemy('hunter', this.spawnX, this.randY(2.6), {}));
  }
}
