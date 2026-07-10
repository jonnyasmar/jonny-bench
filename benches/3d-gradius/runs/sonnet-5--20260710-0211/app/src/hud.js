import { WEAPON_ITEMS } from './weapons.js';

const $ = (id) => document.getElementById(id);

export class Hud {
  constructor() {
    this.el = {
      hud: $('hud'),
      score: $('score-value'),
      combo: $('combo-line'),
      lives: $('lives-icons'),
      powerBar: $('power-bar'),
      waveBanner: $('wave-banner'),
      bossWrap: $('boss-health-wrap'),
      bossFill: $('boss-health-fill'),
      start: $('start-screen'),
      gameover: $('gameover-screen'),
      pause: $('pause-screen'),
      finalStats: $('final-stats'),
      gameoverTitle: $('gameover-title'),
      highScoreLine: $('high-score-line'),
      muteBtn: $('mute-btn'),
      hitVignette: $('hit-vignette'),
      lowHpVignette: $('low-hp-vignette'),
    };
    this._buildPowerSlots();
    this._displayedScore = 0;
    this._targetScore = 0;
    this._bannerTimeout = null;
  }

  _buildPowerSlots() {
    this.el.powerBar.innerHTML = '';
    this.slots = WEAPON_ITEMS.map((item) => {
      const div = document.createElement('div');
      div.className = 'power-slot';
      div.textContent = item.label;
      this.el.powerBar.appendChild(div);
      return div;
    });
  }

  showGameHud() {
    this.el.hud.classList.add('visible');
    this.el.muteBtn.classList.add('visible');
  }
  hideGameHud() {
    this.el.hud.classList.remove('visible');
  }

  showScreen(name) {
    this.el.start.classList.toggle('hidden', name !== 'start');
    this.el.gameover.classList.toggle('hidden', name !== 'gameover');
    this.el.pause.classList.toggle('hidden', name !== 'pause');
  }

  setScore(v) {
    this._targetScore = v;
  }

  tick(dt) {
    if (this._displayedScore !== this._targetScore) {
      const diff = this._targetScore - this._displayedScore;
      const step = Math.sign(diff) * Math.max(1, Math.ceil(Math.abs(diff) * Math.min(1, dt * 8)));
      this._displayedScore += step;
      if (Math.abs(this._targetScore - this._displayedScore) < Math.abs(step)) {
        this._displayedScore = this._targetScore;
      }
      this.el.score.textContent = this._displayedScore.toLocaleString();
    }
  }

  setCombo(mult, kills) {
    if (mult > 1) {
      this.el.combo.textContent = `x${mult} CHAIN (${kills})`;
    } else {
      this.el.combo.textContent = '';
    }
  }

  setLives(n) {
    this.el.lives.textContent = '◆'.repeat(Math.max(0, n));
  }

  renderPower(weapon) {
    this.slots.forEach((slot, i) => {
      slot.classList.remove('filled', 'cursor', 'active-toggle');
      const item = WEAPON_ITEMS[i].key;
      let filled = false;
      if (item === 'SPEED' && weapon.player.speedTier > 0) filled = true;
      if (item === 'TWIN' && (weapon.primaryMode === 'twin' || weapon.primaryMode === 'triple')) filled = true;
      if (item === 'MISSILE' && weapon.missileTier > 0) filled = true;
      if (item === 'LASER' && weapon.primaryMode === 'laser') filled = true;
      if (item === 'OPTION' && weapon.options.length > 0) filled = true;
      if (item === 'SHIELD' && weapon.shieldHits > 0) filled = true;
      if (filled) slot.classList.add('filled', 'active-toggle');
      if (i === weapon.cursorIndex) slot.classList.add('cursor');
    });
  }

  showWaveBanner(text) {
    const el = this.el.waveBanner;
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(this._bannerTimeout);
    this._bannerTimeout = setTimeout(() => el.classList.remove('show'), 2200);
  }

  showBossBar() {
    this.el.bossWrap.classList.add('show');
  }
  hideBossBar() {
    this.el.bossWrap.classList.remove('show');
  }
  setBossHealth(frac) {
    this.el.bossFill.style.width = `${Math.max(0, frac * 100)}%`;
  }

  flashHit(intensity = 1) {
    this.el.hitVignette.style.transition = 'none';
    this.el.hitVignette.style.opacity = String(0.65 * intensity);
    requestAnimationFrame(() => {
      this.el.hitVignette.style.transition = 'opacity .4s ease';
      this.el.hitVignette.style.opacity = '0';
    });
  }

  setLowHp(active) {
    this.el.lowHpVignette.style.animation = active ? 'lowhp 1.1s ease-in-out infinite' : 'none';
    this.el.lowHpVignette.style.opacity = active ? '' : '0';
  }

  setMuted(muted) {
    this.el.muteBtn.textContent = muted ? '🔇' : '🔊';
  }

  showGameOver({ score, best, isNew, wave }) {
    this.el.gameoverTitle.textContent = 'HULL BREACH';
    this.el.finalStats.innerHTML =
      `SCORE <b>${score.toLocaleString()}</b><br>` +
      (isNew ? `<span style="color:#59ff9c">NEW BEST</span><br>` : `BEST <b>${best.toLocaleString()}</b><br>`) +
      `DEPTH REACHED <b>${wave}</b>`;
    this.showScreen('gameover');
  }

  showVictory({ score, best, isNew }) {
    this.el.gameoverTitle.textContent = 'HIVE CORE SHATTERED';
    this.el.finalStats.innerHTML =
      `SCORE <b>${score.toLocaleString()}</b><br>` +
      (isNew ? `<span style="color:#59ff9c">NEW BEST</span><br>` : `BEST <b>${best.toLocaleString()}</b><br>`) +
      `THE THRENODY BELT FALLS SILENT.`;
    this.showScreen('gameover');
  }

  setHighScoreLine(best) {
    this.el.highScoreLine.textContent = best > 0 ? `BEST SCORE: ${best.toLocaleString()}` : '';
  }
}
