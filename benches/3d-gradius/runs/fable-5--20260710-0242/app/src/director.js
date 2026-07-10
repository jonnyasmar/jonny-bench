import { TUNE } from './config.js';
import { clamp, rand } from './util.js';
import { spawnPattern, spawnMoteChain, Boss } from './entities.js';

// Wave director: paces spawns off a rising difficulty curve, schedules the
// boss cycle (with warning telegraphs), and loops harder after each kill.

export class Director {
  constructor() { this.reset(); }

  reset() {
    this.t = 0;
    this.sinceBoss = 0;
    this.spawnT = 1.6;
    this.loop = 0;
    this.warnT = -1;
    this.sector = 1;
  }

  get diff() {
    return Math.min(3.8, 1 + this.t * 0.0115 + this.loop * 0.5);
  }

  update(dt, G) {
    this.t += dt;

    if (G.boss) return;

    // Boss warning countdown → spawn.
    if (this.warnT >= 0) {
      this.warnT -= dt;
      if (this.warnT <= 0) {
        this.warnT = -1;
        G.boss = new Boss(G, this.loop);
        G.audio.intensity = 1;
      }
      return;
    }

    this.sinceBoss += dt;
    if (this.sinceBoss > TUNE.bossEvery) {
      this.sinceBoss = 0;
      this.warnT = 2.8;
      G.hud.message('⚠ WARNING ⚠<br><span class="msg-sub">massive energy signature approaching</span>', 'warning', 2.8);
      G.audio.alarm();
      G.shake.add(0.3);
      return;
    }

    this.spawnT -= dt;
    if (this.spawnT <= 0) {
      const d = this.diff;
      // Gentle opening: only mote chains for the first few spawns of a run.
      if (this.t < 9 && this.loop === 0) spawnMoteChain(G, d);
      else spawnPattern(G, d);
      this.spawnT = clamp(3.15 - d * 0.62, 1.0, 3.2) * rand(0.8, 1.2);
    }
  }

  onBossDead(G) {
    this.loop++;
    this.sector++;
    this.sinceBoss = -10; // breather before waves resume
    this.spawnT = 4;
    G.audio.intensity = 0;
    G.hud.message(`SECTOR ${this.sector}<br><span class="msg-sub">threat level rising</span>`, 'good', 3);
  }
}
