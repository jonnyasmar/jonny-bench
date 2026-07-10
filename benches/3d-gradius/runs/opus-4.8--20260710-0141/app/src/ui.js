import { CONFIG } from './config.js';

// DOM-based HUD, power meter, floating text and menu screens.
export class UI {
  constructor(root) {
    this.root = root;
    this.el = {
      score: document.getElementById('score'),
      hi: document.getElementById('hi'),
      stage: document.getElementById('stage'),
      lives: document.getElementById('lives'),
      meter: document.getElementById('meter'),
      popups: document.getElementById('popups'),
      center: document.getElementById('center'),
      title: document.getElementById('screen-title'),
      gameover: document.getElementById('screen-gameover'),
      pause: document.getElementById('screen-pause'),
      finalScore: document.getElementById('final-score'),
      finalHi: document.getElementById('final-hi'),
      bossbar: document.getElementById('bossbar'),
      bossfill: document.getElementById('bossfill'),
      canvasRect: null,
    };
    this.slots = [];
    this._buildMeter();
    this._popupPool = [];
  }

  _buildMeter() {
    const m = this.el.meter;
    m.innerHTML = '';
    CONFIG.powerSlots.forEach((name, i) => {
      const s = document.createElement('div');
      s.className = 'slot';
      s.innerHTML = `<span class="idx">${i + 1}</span><span class="lbl">${name}</span>`;
      m.appendChild(s);
      this.slots.push(s);
    });
  }

  setMeter(selected, owned) {
    this.slots.forEach((s, i) => {
      s.classList.toggle('sel', i === selected);
      s.classList.toggle('owned', !!(owned && owned[i]));
    });
  }

  setScore(v) { this.el.score.textContent = String(v).padStart(7, '0'); }
  setHi(v) { this.el.hi.textContent = String(v).padStart(7, '0'); }
  setStage(v) { this.el.stage.textContent = String(v); }
  setLives(v) {
    this.el.lives.innerHTML = '';
    for (let i = 0; i < Math.max(0, v); i++) {
      const d = document.createElement('span'); d.className = 'life'; this.el.lives.appendChild(d);
    }
  }

  setCanvasRect(rect) { this.el.canvasRect = rect; }

  // floating score / text at a screen position (px)
  popup(text, sx, sy, cls = '') {
    const d = this._popupPool.pop() || document.createElement('div');
    d.className = 'popup ' + cls;
    d.textContent = text;
    d.style.left = sx + 'px';
    d.style.top = sy + 'px';
    this.el.popups.appendChild(d);
    // force reflow then animate
    d.style.animation = 'none';
    void d.offsetWidth;
    d.style.animation = '';
    d.classList.add('go');
    const done = () => { d.classList.remove('go'); if (d.parentNode) d.parentNode.removeChild(d); this._popupPool.push(d); d.removeEventListener('animationend', done); };
    d.addEventListener('animationend', done);
  }

  center(html, ms = 1400, cls = '') {
    const c = this.el.center;
    c.innerHTML = html;
    c.className = 'center-msg show ' + cls;
    if (this._centerT) clearTimeout(this._centerT);
    if (ms > 0) this._centerT = setTimeout(() => { c.className = 'center-msg'; }, ms);
  }
  clearCenter() { this.el.center.className = 'center-msg'; if (this._centerT) clearTimeout(this._centerT); }

  showBossBar(show) { this.el.bossbar.classList.toggle('show', show); }
  setBossHP(frac) { this.el.bossfill.style.transform = `scaleX(${Math.max(0, frac)})`; }

  showTitle(show) { this.el.title.classList.toggle('show', show); }
  showPause(show) { this.el.pause.classList.toggle('show', show); }
  showGameOver(show, score, hi) {
    this.el.gameover.classList.toggle('show', show);
    if (show) { this.el.finalScore.textContent = String(score).padStart(7, '0'); this.el.finalHi.textContent = String(hi).padStart(7, '0'); }
  }
}
