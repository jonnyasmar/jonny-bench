import { bounds } from './config.js';
import { rand, randInt, pick, clamp } from './utils.js';

// Schedules enemy waves with an escalating difficulty curve, then signals the
// boss when the stage's waves are exhausted.
export class WaveDirector {
  constructor(enemyManager) {
    this.em = enemyManager;
    this.formId = 1;
    this.reset(1);
  }

  reset(stage) {
    this.stage = stage;
    this.em.diff = 1 + (stage - 1) * 0.35;
    this.wavesTotal = 6 + stage * 2;
    this.wavesLeft = this.wavesTotal;
    this.timer = 1.2;              // grace before first wave
    this.interval = clamp(3.4 - stage * 0.18, 1.7, 3.4);
    this.done = false;            // all waves spawned
    this.sinceCapsule = 2;        // ensure early capsule
  }

  _yspan() { return [bounds.bottom + 3, bounds.top - 3]; }
  _randY() { const [a, b] = this._yspan(); return rand(a, b); }

  spawnWave() {
    const stage = this.stage;
    const forceCapsule = this.sinceCapsule >= 2;
    const pool = ['lineDrones', 'sineSquad', 'popcorn', 'diverPack'];
    if (stage >= 1) pool.push('shooters');
    if (stage >= 2) pool.push('tank', 'diverPack');
    if (stage >= 3) pool.push('shooters', 'sineSquad');

    let kind = pick(pool);
    if (forceCapsule) kind = pick(['popcorn', 'carrier']);

    switch (kind) {
      case 'lineDrones': this._line('drone'); break;
      case 'sineSquad': this._sine(); break;
      case 'diverPack': this._divers(); break;
      case 'shooters': this._shooters(); break;
      case 'tank': this._tank(); break;
      case 'popcorn': this._popcorn(); this.sinceCapsule = 0; break;
      case 'carrier': this._carrier(); this.sinceCapsule = 0; break;
    }
    if (kind !== 'popcorn' && kind !== 'carrier') this.sinceCapsule++;
  }

  _spawnRight(type, y, dx, opts) {
    return this.em.spawn(type, bounds.right + 3 + dx, y, opts);
  }

  _line(type) {
    const n = randInt(4, 6) + Math.min(3, this.stage);
    const y = this._randY();
    for (let i = 0; i < n; i++) this._spawnRight(type, y + rand(-0.6, 0.6), i * 2.6, { speed: rand(9, 12) });
  }

  _sine() {
    const n = randInt(4, 6);
    const amp = rand(3, 5), freq = rand(1.3, 2.0);
    const y = this._randY() * 0.5;
    for (let i = 0; i < n; i++)
      this._spawnRight('sine', y, i * 2.8, { amp, freq, phase: i * 0.6, speed: rand(8, 11) });
  }

  _divers() {
    const n = randInt(3, 4) + Math.min(2, this.stage - 1);
    for (let i = 0; i < n; i++) {
      const top = i % 2 === 0;
      const y = top ? bounds.top - rand(1, 3) : bounds.bottom + rand(1, 3);
      this._spawnRight('diver', y, i * 2.2, { speed: rand(10, 13) });
    }
  }

  _shooters() {
    const n = 1 + Math.min(2, Math.floor(this.stage / 2)) + (Math.random() < 0.5 ? 1 : 0);
    for (let i = 0; i < n; i++) this._spawnRight('shooter', this._randY(), i * 4, { speed: rand(4, 6) });
  }

  _tank() {
    this._spawnRight('tank', rand(-3, 3), 0, { dropsCapsule: true });
    this.sinceCapsule = 0;
  }

  _popcorn() {
    const id = this.formId++;
    const cols = randInt(2, 3), rows = randInt(3, 4);
    const cy = this._randY() * 0.6;
    for (let c = 0; c < cols; c++)
      for (let r = 0; r < rows; r++)
        this._spawnRight('popcorn', cy + (r - rows / 2) * 1.7, c * 2.0, {
          formationId: id, amp: rand(1, 2.5), freq: rand(1.6, 2.6), phase: r * 0.5, speed: rand(11, 13),
        });
  }

  _carrier() {
    // a lone tinted drone that drops a capsule
    this._spawnRight('drone', this._randY(), 0, { dropsCapsule: true, speed: rand(8, 10) });
  }

  update(dt) {
    if (this.done) return;
    this.timer -= dt;
    if (this.timer <= 0 && this.wavesLeft > 0) {
      this.spawnWave();
      this.wavesLeft--;
      // waves speed up as the stage progresses
      const prog = 1 - this.wavesLeft / this.wavesTotal;
      this.timer = this.interval * (1 - prog * 0.4);
      if (this.wavesLeft === 0) this.done = true;
    }
  }
}
