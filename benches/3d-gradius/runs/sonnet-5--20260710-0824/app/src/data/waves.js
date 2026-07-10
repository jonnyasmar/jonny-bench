// Difficulty scaling and enemy-formation spawning for a given sector (wave) number, 1-indexed.
// Sectors 1-3 introduce each boss; beyond that the same three bosses repeat with
// steadily increasing stats for endless score-attack play.

export const SECTOR_DURATION = 38; // seconds of regular spawns before the boss arrives

export function sectorScaling(sector) {
  const s = sector - 1;
  return {
    hpMul: 1 + s * 0.2,
    speedMul: 1 + Math.min(1.1, s * 0.11),
    scoreMul: 1 + s * 0.12,
    spawnIntervalMul: Math.max(0.42, 1 - s * 0.075),
    bossHpMul: 1 + s * 0.32,
    fireIntervalMul: Math.max(0.5, 1 - s * 0.07),
    terrainAmp: Math.min(6.2, 2.4 + s * 0.45),
    terrainGap: Math.max(9, 15.5 - s * 0.6),
  };
}

const FORMATIONS = [
  { key: 'singleDrifter', minSector: 1, weight: (s) => Math.max(1, 6 - s) },
  { key: 'driftLine', minSector: 1, weight: () => 4 },
  { key: 'weaverPair', minSector: 1, weight: () => 3 },
  { key: 'swarmerWedge', minSector: 1, weight: (s) => 2 + Math.min(4, s * 0.6) },
  { key: 'turretPair', minSector: 2, weight: (s) => 2 + Math.min(3, s * 0.4) },
  { key: 'mineField', minSector: 1, weight: () => 2 },
  { key: 'eliteSolo', minSector: 2, weight: (s) => 1 + Math.min(3, s * 0.4) },
  { key: 'pincer', minSector: 3, weight: (s) => 1 + Math.min(3, s * 0.35) },
];

export class WaveDirector {
  constructor(enemySystem, boundsRef) {
    this.enemySystem = enemySystem;
    this.boundsRef = boundsRef;
    this.spawnTimer = 1.5;
    this.sector = 1;
    this.waveTime = 0;
    this.bossReady = false;
    this.scaling = sectorScaling(1);
  }

  startSector(sector) {
    this.sector = sector;
    this.scaling = sectorScaling(sector);
    this.waveTime = 0;
    this.bossReady = false;
    this.spawnTimer = 1.2;
  }

  update(dt) {
    if (this.bossReady) return;
    this.waveTime += dt;
    if (this.waveTime >= SECTOR_DURATION) {
      this.bossReady = true;
      return;
    }
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this._spawnFormation();
      const base = 2.0 * this.scaling.spawnIntervalMul;
      this.spawnTimer = base * (0.7 + Math.random() * 0.6);
    }
  }

  _pickFormation() {
    const candidates = FORMATIONS.filter((f) => f.minSector <= this.sector);
    const total = candidates.reduce((sum, f) => sum + f.weight(this.sector), 0);
    let r = Math.random() * total;
    for (const f of candidates) {
      r -= f.weight(this.sector);
      if (r <= 0) return f.key;
    }
    return candidates[0].key;
  }

  _spawnFormation() {
    const bounds = this.boundsRef();
    const sc = this.scaling;
    const spawnX = bounds.right + 4;
    const key = this._pickFormation();

    const common = { hpMul: sc.hpMul, scoreMul: sc.scoreMul };

    switch (key) {
      case 'singleDrifter': {
        this.enemySystem.spawn('drifter', {
          x: spawnX, y: (Math.random() * 2 - 1) * bounds.top * 0.7,
          speed: 9 * sc.speedMul, amp: 2 + Math.random() * 2, freq: 1 + Math.random(), ...common,
        });
        break;
      }
      case 'driftLine': {
        const count = 3 + Math.floor(Math.random() * 3);
        const centerY = (Math.random() * 2 - 1) * bounds.top * 0.5;
        for (let i = 0; i < count; i++) {
          this.enemySystem.spawn('drifter', {
            x: spawnX + i * 2.6, y: centerY + (i - count / 2) * 2.2,
            speed: 10 * sc.speedMul, amp: 1.4, freq: 1.6, phase: i * 0.6, ...common,
          });
        }
        break;
      }
      case 'weaverPair': {
        const baseY = (Math.random() * 2 - 1) * bounds.top * 0.6;
        for (let i = 0; i < 2; i++) {
          this.enemySystem.spawn('weaver', {
            x: spawnX + i * 5, y: baseY, speed: 11 * sc.speedMul,
            amp: 5 + Math.random() * 2, freq: 1.3, phase: i * Math.PI,
            fireInterval: 2.6 * sc.fireIntervalMul, ...common,
          });
        }
        break;
      }
      case 'swarmerWedge': {
        const n = 5;
        const baseY = (Math.random() * 2 - 1) * bounds.top * 0.5;
        for (let i = 0; i < n; i++) {
          this.enemySystem.spawn('swarmer', {
            x: spawnX + Math.abs(i - Math.floor(n / 2)) * 1.8,
            y: baseY + (i - Math.floor(n / 2)) * 1.5,
            speed: 13 * sc.speedMul, amp: 1.2, freq: 3, phase: i, ...common,
          });
        }
        break;
      }
      case 'turretPair': {
        const side = Math.random() < 0.5 ? 'top' : 'bottom';
        this.enemySystem.spawn('turret', {
          x: spawnX, y: 0, side, fireInterval: 2.2 * sc.fireIntervalMul, ...common,
        });
        if (Math.random() < 0.6) {
          this.enemySystem.spawn('turret', {
            x: spawnX + 14, y: 0, side: side === 'top' ? 'bottom' : 'top',
            fireInterval: 2.2 * sc.fireIntervalMul, ...common,
          });
        }
        break;
      }
      case 'mineField': {
        const count = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < count; i++) {
          this.enemySystem.spawn('mine', {
            x: spawnX + i * 5 + Math.random() * 3,
            y: (Math.random() * 2 - 1) * bounds.top * 0.7,
            speed: 5 * sc.speedMul, amp: 1.5, freq: 0.6, ...common,
          });
        }
        break;
      }
      case 'eliteSolo': {
        this.enemySystem.spawn('elite', {
          x: spawnX, y: (Math.random() * 2 - 1) * bounds.top * 0.4,
          speed: 8 * sc.speedMul, amp: 3, freq: 0.8,
          fireInterval: 1.8 * sc.fireIntervalMul, ...common,
        });
        break;
      }
      case 'pincer': {
        this.enemySystem.spawn('turret', { x: spawnX, y: 0, side: 'top', fireInterval: 2 * sc.fireIntervalMul, ...common });
        this.enemySystem.spawn('turret', { x: spawnX + 3, y: 0, side: 'bottom', fireInterval: 2 * sc.fireIntervalMul, ...common });
        for (let i = 0; i < 3; i++) {
          this.enemySystem.spawn('swarmer', {
            x: spawnX + 10 + i * 1.6, y: (i - 1) * 2.4,
            speed: 13 * sc.speedMul, amp: 1, freq: 2.6, ...common,
          });
        }
        break;
      }
    }
  }
}
