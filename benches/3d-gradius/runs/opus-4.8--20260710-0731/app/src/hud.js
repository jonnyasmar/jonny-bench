import * as THREE from 'three';
import { POWERS } from './player.js';
import { fmt } from './util.js';

const $ = (id) => document.getElementById(id);
const dots = (n, max) => '●'.repeat(n) + '○'.repeat(Math.max(0, max - n));

export class HUD {
  constructor(game) {
    this.game = game;
    this.el = {
      hud: $('hud'), score: $('score'), best: $('best'), stage: $('stage'),
      lives: $('lives'), mult: $('mult'), power: $('power'), powerhint: $('powerhint'),
      shield: $('shield'), bossbar: $('bossbar'), bossname: $('bossname'),
      bossfill: $('bossfill'), bossghost: $('bossghost'),
      banner: $('banner'), bl1: $('banner').querySelector('.l1'), bl2: $('banner').querySelector('.l2'),
      title: $('title'), pause: $('pause'), over: $('over'),
      ui: $('ui'), powerbtn: $('powerbtn'),
    };

    this.cells = POWERS.map((p) => {
      const d = document.createElement('div');
      d.className = 'cell';
      d.innerHTML = `<div class="n">${p.label}</div><div class="lv"></div>`;
      this.el.power.appendChild(d);
      return { el: d, lv: d.querySelector('.lv'), key: p.key, max: p.max };
    });

    this.pips = [];
    for (let i = 0; i < 3; i++) {
      const p = document.createElement('div');
      p.className = 'pip off';
      this.el.shield.appendChild(p);
      this.pips.push(p);
    }

    this.lifeEls = [];
    this._lastScore = -1;
    this._lastCursor = -1;
    this._lastLives = -1;
    this._bossGhost = 1;
    this._v = new THREE.Vector3();
  }

  setHud(on) { this.el.hud.classList.toggle('on', on); }

  // ------------------------------------------------------------- screens

  screen(name) {
    for (const k of ['title', 'pause', 'over']) this.el[k].classList.toggle('on', k === name);
    document.body.classList.toggle('playing', !name);
  }

  banner(l1, l2 = '', warn = false) {
    const b = this.el.banner;
    this.el.bl1.textContent = l1;
    this.el.bl2.textContent = l2;
    b.classList.toggle('warn', warn);
    b.classList.remove('show');
    void b.offsetWidth; // restart the animation
    b.classList.add('show');
  }

  // ------------------------------------------------------------- boss bar

  showBoss(name) {
    this.el.bossname.textContent = name;
    this.el.bossbar.classList.add('on');
    this.el.bossfill.style.transform = 'scaleX(1)';
    this.el.bossghost.style.transform = 'scaleX(1)';
    this._bossGhost = 1;
  }
  hideBoss() { this.el.bossbar.classList.remove('on'); }
  setBoss(frac) {
    this.el.bossfill.style.transform = `scaleX(${frac})`;
    if (frac < this._bossGhost) {
      this._bossGhost = frac;
      this.el.bossghost.style.transform = `scaleX(${frac})`;
    }
  }

  // ------------------------------------------------------------- popups

  /** Floating "+500" at a world position. */
  popup(text, x, y, color = '#fff') {
    const g = this.game;
    this._v.set(x, y, 0).project(g.camera);
    if (this._v.z > 1) return;
    const el = document.createElement('div');
    el.className = 'pop';
    el.textContent = text;
    el.style.color = color;
    el.style.left = `${(this._v.x * 0.5 + 0.5) * innerWidth}px`;
    el.style.top = `${(-this._v.y * 0.5 + 0.5) * innerHeight}px`;
    el.style.animation = 'popUp .85s cubic-bezier(.2,.7,.3,1) forwards';
    this.el.ui.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  cellFire(key) {
    const c = this.cells.find((x) => x.key === key);
    if (!c) return;
    c.el.classList.remove('fire');
    void c.el.offsetWidth;
    c.el.classList.add('fire');
  }

  // ------------------------------------------------------------- per-frame

  update(g) {
    if (g.score !== this._lastScore) {
      this.el.score.textContent = fmt(g.score);
      this.el.score.classList.remove('punch');
      void this.el.score.offsetWidth;
      this.el.score.classList.add('punch');
      this._lastScore = g.score;
    }
    this.el.best.textContent = fmt(g.best);
    this.el.stage.textContent = String(g.stage);

    this.el.mult.textContent = g.multiplier > 1 ? `Chain x${g.multiplier}` : '';

    if (g.lives !== this._lastLives) {
      this._lastLives = g.lives;
      const want = Math.max(g.lives, 0);
      this.el.lives.innerHTML = '';
      for (let i = 0; i < Math.max(3, want); i++) {
        const d = document.createElement('div');
        d.className = 'life' + (i < want ? '' : ' lost');
        this.el.lives.appendChild(d);
      }
    }

    const p = g.player;
    for (let i = 0; i < this.cells.length; i++) {
      const c = this.cells[i];
      const lv = p.levels[c.key];
      const sel = g.player.cursor === i + 1;
      c.el.classList.toggle('sel', sel);
      c.el.classList.toggle('owned', lv > 0);
      c.el.classList.toggle('maxed', lv >= c.max);
      const txt = c.max > 1 ? dots(lv, c.max) : lv > 0 ? '▮ ON' : '▯';
      if (c.lv.textContent !== txt) c.lv.textContent = txt;
    }
    this.el.powerhint.classList.toggle('on', p.cursor > 0);

    const sOn = p.shieldHP > 0;
    this.el.shield.classList.toggle('on', sOn);
    for (let i = 0; i < this.pips.length; i++) this.pips[i].classList.toggle('off', i >= p.shieldHP);

    if (g.boss && g.boss.entered && !g.boss.dead) this.setBoss(g.boss.hpFrac);
  }

  gameOver(g, isRecord) {
    $('o_score').textContent = fmt(g.score);
    $('o_stage').textContent = String(g.stage);
    $('o_chain').textContent = `x${g.bestChain}`;
    $('o_best').textContent = fmt(g.best);
    $('newhi').style.display = isRecord ? 'block' : 'none';
    $('overtitle').textContent = isRecord ? 'New Record' : 'Signal Lost';
    this.screen('over');
  }

  clearPopups() {
    this.el.ui.querySelectorAll('.pop').forEach((e) => e.remove());
  }
}
