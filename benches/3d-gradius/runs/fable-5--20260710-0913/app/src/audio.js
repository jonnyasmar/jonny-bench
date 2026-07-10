// Procedural WebAudio: SFX + generative synthwave loop. No assets.

const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);

export class AudioSys {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.musicPlaying = false;
    this.bossMode = false;
    this._step = 0;
    this._nextT = 0;
    this._timer = null;
  }

  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    const c = this.ctx;
    this.comp = c.createDynamicsCompressor();
    this.comp.threshold.value = -18;
    this.comp.ratio.value = 6;
    this.comp.connect(c.destination);
    this.master = c.createGain();
    this.master.gain.value = 0.5;
    this.master.connect(this.comp);
    this.sfxBus = c.createGain();
    this.sfxBus.gain.value = 1.0;
    this.sfxBus.connect(this.master);
    this.musBus = c.createGain();
    this.musBus.gain.value = 0.34;
    this.musBus.connect(this.master);
    // 1s of white noise, reused by every noise-based sound
    const len = c.sampleRate;
    this.noiseBuf = c.createBuffer(1, len, c.sampleRate);
    const d = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.master) this.master.gain.value = this.muted ? 0 : 0.5;
    return this.muted;
  }

  _osc(type, f0, f1, t0, dur, g0, bus, curve) {
    const c = this.ctx;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t0);
    if (f1 !== null) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t0 + dur);
    g.gain.setValueAtTime(g0, t0);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + dur * (curve || 1));
    o.connect(g);
    g.connect(bus || this.sfxBus);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  }

  _noise(t0, dur, g0, fType, f0, f1, bus) {
    const c = this.ctx;
    const s = c.createBufferSource();
    s.buffer = this.noiseBuf;
    s.loop = true;
    const flt = c.createBiquadFilter();
    flt.type = fType;
    flt.frequency.setValueAtTime(f0, t0);
    if (f1) flt.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(g0, t0);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
    s.connect(flt);
    flt.connect(g);
    g.connect(bus || this.sfxBus);
    s.start(t0);
    s.stop(t0 + dur + 0.05);
  }

  _ok() { return this.ctx && this.ctx.state === 'running' && !this.muted; }

  shoot() {
    if (!this._ok()) return;
    const t = this.ctx.currentTime;
    this._osc('square', 950, 240, t, 0.09, 0.055);
  }

  laser() {
    if (!this._ok()) return;
    const t = this.ctx.currentTime;
    this._osc('sawtooth', 1500, 320, t, 0.14, 0.06);
    this._osc('square', 2200, 500, t, 0.08, 0.03);
  }

  missile() {
    if (!this._ok()) return;
    const t = this.ctx.currentTime;
    this._noise(t, 0.25, 0.08, 'bandpass', 900, 300);
  }

  explSmall() {
    if (!this._ok()) return;
    const t = this.ctx.currentTime;
    this._noise(t, 0.3, 0.2, 'lowpass', 2400, 300);
    this._osc('sine', 180, 45, t, 0.22, 0.22);
  }

  explBig() {
    if (!this._ok()) return;
    const t = this.ctx.currentTime;
    this._noise(t, 0.7, 0.32, 'lowpass', 3000, 140);
    this._osc('sine', 130, 28, t, 0.55, 0.4);
    this._osc('sawtooth', 300, 40, t, 0.4, 0.12);
  }

  playerBoom() {
    if (!this._ok()) return;
    const t = this.ctx.currentTime;
    this._noise(t, 1.3, 0.4, 'lowpass', 4000, 90);
    this._osc('sawtooth', 220, 24, t, 1.0, 0.3);
    this._osc('sine', 90, 20, t, 1.1, 0.4);
  }

  pickup() {
    if (!this._ok()) return;
    const t = this.ctx.currentTime;
    this._osc('square', 660, null, t, 0.08, 0.08);
    this._osc('square', 990, null, t + 0.07, 0.1, 0.08);
  }

  powerup() {
    if (!this._ok()) return;
    const t = this.ctx.currentTime;
    [523, 659, 784, 1047].forEach((f, i) => this._osc('square', f, null, t + i * 0.06, 0.12, 0.07));
  }

  shieldHit() {
    if (!this._ok()) return;
    const t = this.ctx.currentTime;
    this._osc('triangle', 2400, 900, t, 0.12, 0.12);
    this._noise(t, 0.1, 0.06, 'highpass', 2000, null);
  }

  bossHit() {
    if (!this._ok()) return;
    const t = this.ctx.currentTime;
    this._osc('square', 140, 70, t, 0.08, 0.09);
  }

  warning() {
    if (!this._ok()) return;
    const t = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      this._osc('sawtooth', 233, 175, t + i * 0.45, 0.35, 0.1);
      this._osc('sawtooth', 117, 88, t + i * 0.45, 0.35, 0.08);
    }
  }

  select() {
    if (!this._ok()) return;
    const t = this.ctx.currentTime;
    this._osc('square', 1200, null, t, 0.05, 0.05);
  }

  // ---- music ----
  startMusic() {
    if (!this.ctx || this.musicPlaying) return;
    this.musicPlaying = true;
    this._step = 0;
    this._nextT = this.ctx.currentTime + 0.1;
    this._timer = setInterval(() => this._tick(), 30);
  }

  stopMusic() {
    this.musicPlaying = false;
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
  }

  _tick() {
    if (!this.musicPlaying || !this.ctx) return;
    const bpm = this.bossMode ? 126 : 108;
    const stepDur = 60 / bpm / 2; // 8th notes
    while (this._nextT < this.ctx.currentTime + 0.15) {
      this._schedStep(this._step, this._nextT, stepDur);
      this._nextT += stepDur;
      this._step = (this._step + 1) % 16;
    }
  }

  _schedStep(s, t, stepDur) {
    // chord roots over 16 steps (2 bars): Am F C G — boss: chromatic descent
    const roots = this.bossMode ? [33, 32, 31, 30] : [33, 29, 36, 31];
    const root = roots[Math.floor(s / 4)];
    // bass: root / octave alternation
    const note = s % 2 === 0 ? root : root + 12;
    this._osc('sawtooth', midi(note), null, t, stepDur * 0.9, 0.16, this.musBus, 0.9);
    // kick on every beat (even steps)
    if (s % 2 === 0) this._osc('sine', 120, 38, t, 0.14, 0.5, this.musBus);
    // snare on beats 2 & 4 of each bar
    if (s === 4 || s === 12) this._noise(t, 0.12, 0.22, 'bandpass', 1800, 900, this.musBus);
    // offbeat hats
    if (s % 2 === 1) this._noise(t, 0.04, this.bossMode ? 0.1 : 0.06, 'highpass', 6000, null, this.musBus);
    // sparkle arp on top, once per 2 bars
    if (s === 8) {
      [0, 3, 7, 12].forEach((iv, i) =>
        this._osc('triangle', midi(root + 24 + iv), null, t + i * stepDur * 0.5, 0.18, 0.05, this.musBus));
    }
  }
}
