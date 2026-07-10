import { SURGE_SLOTS } from './config.js';

// DOM overlay: score/lives/multiplier, the SURGE chain meter, boss bar,
// center messages, floating score popups, full-screen flash, title/gameover.

const el = (tag, cls, parent, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  (parent || document.body).appendChild(e);
  return e;
};

export class HUD {
  constructor() {
    this.root = el('div', 'hud');

    const top = el('div', 'hud-top', this.root);
    const scoreBox = el('div', 'hud-box', top);
    el('div', 'hud-label', scoreBox, 'SCORE');
    this.scoreEl = el('div', 'hud-value', scoreBox, '0');

    const midBox = el('div', 'hud-box hud-center-box', top);
    el('div', 'hud-label', midBox, 'BEST');
    this.hiEl = el('div', 'hud-value hud-dim', midBox, '0');

    const rightBox = el('div', 'hud-box hud-right-box', top);
    this.multEl = el('div', 'hud-mult', rightBox, '');
    this.livesEl = el('div', 'hud-lives', rightBox, '');

    // Boss bar
    this.bossWrap = el('div', 'boss-wrap hidden', this.root);
    el('div', 'boss-name', this.bossWrap, 'PRISM WARDEN');
    const bb = el('div', 'boss-bar', this.bossWrap);
    this.bossFill = el('div', 'boss-fill', bb);

    // Surge chain meter
    this.chainWrap = el('div', 'chain', this.root);
    this.slots = SURGE_SLOTS.map((s) => {
      const d = el('div', 'slot', this.chainWrap);
      el('div', 'slot-key', d, s.key);
      return d;
    });
    this.chainHint = el('div', 'chain-hint', this.root, '');

    // Center message
    this.msgEl = el('div', 'msg hidden', this.root);
    this.msgTimer = 0;

    // Flash overlay
    this.flashEl = el('div', 'flash', this.root);

    // Popups container
    this.popupWrap = el('div', 'popups', this.root);

    // Title screen
    this.title = el('div', 'screen title-screen', this.root);
    el('div', 'game-title', this.title, 'VOID<span class="accent">SURGE</span>');
    el('div', 'game-sub', this.title, 'a neon gauntlet beyond the rift');
    this.titleHi = el('div', 'title-hi', this.title, '');
    el('div', 'title-start blink', this.title, 'PRESS <b>ENTER</b> TO LAUNCH');
    el('div', 'title-controls', this.title,
      '<b>WASD / ARROWS</b> steer &nbsp;·&nbsp; <b>SPACE / Z</b> fire (hold)<br>' +
      '<b>X / SHIFT</b> redeem surge chain &nbsp;·&nbsp; <b>P</b> pause &nbsp;·&nbsp; <b>M</b> sound<br>' +
      '<span class="dim">collect <span class="shard-ico">◆</span> shards to charge the chain — redeem deeper slots for stronger gifts</span>');

    // Game over screen
    this.over = el('div', 'screen over-screen hidden', this.root);
    el('div', 'over-title', this.over, 'SHIP LOST');
    this.overScore = el('div', 'over-score', this.over, '');
    this.overBest = el('div', 'over-best', this.over, '');
    el('div', 'title-start blink', this.over, 'PRESS <b>R</b> TO RE-LAUNCH');

    // Pause veil
    this.pauseEl = el('div', 'screen pause-screen hidden', this.root, '<div class="msg-big">PAUSED</div>');

    this.muteEl = el('div', 'mute-ind hidden', this.root, 'MUTED');
  }

  setScore(v) { this.scoreEl.textContent = v.toLocaleString('en-US'); }
  setHi(v) {
    this.hiEl.textContent = v.toLocaleString('en-US');
    this.titleHi.textContent = v > 0 ? `BEST ${v.toLocaleString('en-US')}` : '';
  }

  setMult(m) {
    this.multEl.textContent = m > 1 ? `×${m}` : '';
    if (m > 1) {
      this.multEl.classList.remove('pop');
      void this.multEl.offsetWidth;
      this.multEl.classList.add('pop');
    }
  }

  setLives(n) {
    this.livesEl.innerHTML = '';
    for (let i = 0; i < n; i++) el('span', 'life', this.livesEl, '▲');
  }

  setChain(n, novaReady) {
    this.slots.forEach((s, i) => {
      s.classList.toggle('lit', i < n);
      s.classList.toggle('active', i === n - 1);
    });
    this.chainHint.textContent = n > 0
      ? `X · claim ${SURGE_SLOTS[n - 1].key} — ${SURGE_SLOTS[n - 1].desc}`
      : '';
    this.chainWrap.classList.toggle('full', novaReady);
  }

  pulseChain() {
    this.chainWrap.classList.remove('pulse');
    void this.chainWrap.offsetWidth;
    this.chainWrap.classList.add('pulse');
  }

  showBoss(frac) {
    if (frac === null) { this.bossWrap.classList.add('hidden'); return; }
    this.bossWrap.classList.remove('hidden');
    this.bossFill.style.width = `${Math.max(0, frac) * 100}%`;
  }

  message(text, cls = '', dur = 2) {
    this.msgEl.innerHTML = text;
    this.msgEl.className = `msg ${cls}`;
    this.msgTimer = dur;
  }

  flash(color, alpha = 0.5) {
    this.flashEl.style.transition = 'none';
    this.flashEl.style.background = color;
    this.flashEl.style.opacity = alpha;
    requestAnimationFrame(() => {
      this.flashEl.style.transition = 'opacity 0.45s ease-out';
      this.flashEl.style.opacity = 0;
    });
  }

  // Floating score/text popup at screen position (px).
  popup(sx, sy, text, cls = '') {
    const p = el('div', `popup ${cls}`, this.popupWrap, text);
    p.style.left = `${sx}px`;
    p.style.top = `${sy}px`;
    setTimeout(() => p.remove(), 900);
  }

  update(dt) {
    if (this.msgTimer > 0) {
      this.msgTimer -= dt;
      if (this.msgTimer <= 0) this.msgEl.classList.add('hidden');
    }
  }

  showTitle(show) { this.title.classList.toggle('hidden', !show); }
  showPause(show) { this.pauseEl.classList.toggle('hidden', !show); }
  showMuted(show) { this.muteEl.classList.toggle('hidden', !show); }
  showGameOver(score, best, isRecord) {
    this.over.classList.remove('hidden');
    this.overScore.textContent = `SCORE ${score.toLocaleString('en-US')}`;
    this.overBest.innerHTML = isRecord
      ? '<span class="record">NEW RECORD</span>'
      : `BEST ${best.toLocaleString('en-US')}`;
  }
  hideGameOver() { this.over.classList.add('hidden'); }
}
