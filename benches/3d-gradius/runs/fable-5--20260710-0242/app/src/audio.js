// Tiny procedural WebAudio engine: synthesized SFX + a looping backing track.
// No assets, unlocks on first user gesture.

const NOTE = (n) => 440 * Math.pow(2, (n - 69) / 12);

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.intensity = 0; // 0 = cruise, 1 = boss
    this._musicTimer = null;
    this._step = 0;
    this._nextStepTime = 0;
  }

  unlock() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    const c = this.ctx;

    this.master = c.createGain();
    this.master.gain.value = this.muted ? 0 : 0.9;
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 6;
    this.master.connect(comp);
    comp.connect(c.destination);

    this.sfxBus = c.createGain();
    this.sfxBus.gain.value = 0.8;
    this.sfxBus.connect(this.master);

    this.musicBus = c.createGain();
    this.musicBus.gain.value = 0.5;
    this.musicBus.connect(this.master);

    // Shared noise buffer for explosions / hats.
    const len = c.sampleRate * 1.2;
    this.noiseBuf = c.createBuffer(1, len, c.sampleRate);
    const d = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;

    this._startMusic();
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.master) {
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.linearRampToValueAtTime(this.muted ? 0 : 0.9, t + 0.08);
    }
    return this.muted;
  }

  // ---- SFX ------------------------------------------------------------

  _env(gainVal, dur, when = 0) {
    const c = this.ctx;
    const g = c.createGain();
    const t = c.currentTime + when;
    g.gain.setValueAtTime(gainVal, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    g.connect(this.sfxBus);
    return { g, t };
  }

  _tone(type, f0, f1, gainVal, dur, when = 0) {
    if (!this.ctx) return;
    const c = this.ctx;
    const o = c.createOscillator();
    o.type = type;
    const { g, t } = this._env(gainVal, dur, when);
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
    o.connect(g);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  _noise(gainVal, dur, filterFrom, filterTo, when = 0, hp = false) {
    if (!this.ctx) return;
    const c = this.ctx;
    const s = c.createBufferSource();
    s.buffer = this.noiseBuf;
    s.playbackRate.value = 0.7 + Math.random() * 0.6;
    const f = c.createBiquadFilter();
    f.type = hp ? 'highpass' : 'lowpass';
    const { g, t } = this._env(gainVal, dur, when);
    f.frequency.setValueAtTime(filterFrom, t);
    f.frequency.exponentialRampToValueAtTime(Math.max(20, filterTo), t + dur);
    s.connect(f);
    f.connect(g);
    s.start(t);
    s.stop(t + dur + 0.02);
  }

  shoot() {
    const j = Math.random() * 60;
    this._tone('square', 900 + j, 320, 0.055, 0.08);
    this._tone('sine', 1400 + j, 500, 0.03, 0.05);
  }

  pulseShot() {
    this._tone('sawtooth', 240, 900, 0.06, 0.12);
    this._noise(0.03, 0.08, 4000, 800, 0, true);
  }

  hit() {
    this._noise(0.09, 0.06, 3200, 500, 0, true);
  }

  deflect() {
    this._tone('triangle', 1800, 2600, 0.05, 0.06);
  }

  boom(size = 1) {
    const dur = 0.32 + 0.32 * size;
    this._noise(0.32 * size + 0.1, dur, 2600, 60);
    this._tone('sine', 150 + 60 * size, 28, 0.32 * size, dur);
    if (size > 1.2) this._noise(0.2, dur * 1.5, 500, 30, 0.05);
  }

  pickup() {
    this._tone('sine', NOTE(81), NOTE(81), 0.09, 0.09);
    this._tone('sine', NOTE(88), NOTE(88), 0.09, 0.14, 0.07);
  }

  powerup() {
    const seq = [69, 73, 76, 81];
    seq.forEach((n, i) => {
      this._tone('sawtooth', NOTE(n), NOTE(n), 0.07, 0.16, i * 0.07);
      this._tone('sine', NOTE(n + 12), NOTE(n + 12), 0.05, 0.14, i * 0.07);
    });
  }

  nova() {
    this.boom(1.9);
    this._tone('sawtooth', 3000, 100, 0.16, 0.7);
    const seq = [93, 91, 88, 84, 81, 76];
    seq.forEach((n, i) => this._tone('sine', NOTE(n), NOTE(n), 0.05, 0.2, i * 0.05));
  }

  alarm() {
    for (let i = 0; i < 3; i++) {
      this._tone('sawtooth', 220, 220, 0.09, 0.3, i * 0.5);
      this._tone('sawtooth', 293, 293, 0.09, 0.3, i * 0.5 + 0.25);
    }
  }

  playerDeath() {
    this._tone('sawtooth', 800, 60, 0.2, 0.9);
    this.boom(1.6);
  }

  uiStart() {
    this._tone('square', NOTE(69), NOTE(69), 0.07, 0.1);
    this._tone('square', NOTE(76), NOTE(76), 0.07, 0.18, 0.09);
  }

  // ---- Music -----------------------------------------------------------
  // Minimal step sequencer, 8th notes, look-ahead scheduling.

  _startMusic() {
    const c = this.ctx;
    this._nextStepTime = c.currentTime + 0.1;
    this._step = 0;
    this._musicTimer = setInterval(() => this._pump(), 40);
  }

  _pump() {
    const c = this.ctx;
    if (!c || c.state !== 'running') return;
    while (this._nextStepTime < c.currentTime + 0.18) {
      this._scheduleStep(this._step, this._nextStepTime);
      const bpm = this.intensity ? 148 : 122;
      this._nextStepTime += 30 / bpm; // 8th note
      this._step = (this._step + 1) % 32;
    }
  }

  _mTone(type, freq, gain, dur, when, bus) {
    const c = this.ctx;
    const o = c.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, when);
    g.gain.linearRampToValueAtTime(gain, when + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    o.connect(g);
    g.connect(bus || this.musicBus);
    o.start(when);
    o.stop(when + dur + 0.03);
  }

  _scheduleStep(s, t) {
    // A minor-ish. Bass on quarters, arp on 8ths, hat on off-8ths.
    const BASS = [45, 45, 45, 45, 41, 41, 41, 41, 43, 43, 43, 43, 40, 40, 43, 43];
    const ARP_A = [69, 72, 76, 79, 81, 79, 76, 72];
    const ARP_B = [69, 72, 76, 81, 84, 81, 79, 76];
    const bass = BASS[(s >> 1) % 16];
    if (s % 2 === 0) {
      this._mTone('triangle', NOTE(bass), 0.16, 0.24, t);
      this._mTone('square', NOTE(bass), 0.03, 0.2, t);
    }
    const arp = (s % 16 < 8 ? ARP_A : ARP_B)[s % 8];
    const arpGain = this.intensity ? 0.055 : 0.038;
    this._mTone('square', NOTE(arp + (this.intensity ? 0 : -12)), arpGain, 0.11, t);
    // hats
    if (s % 2 === 1 || this.intensity) {
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuf;
      const f = this.ctx.createBiquadFilter();
      f.type = 'highpass';
      f.frequency.value = 7000;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(this.intensity && s % 4 === 0 ? 0.05 : 0.025, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
      src.connect(f); f.connect(g); g.connect(this.musicBus);
      src.start(t); src.stop(t + 0.08);
    }
    // slow pad swell every 2 bars
    if (s === 0) {
      this._mTone('sawtooth', NOTE(57), 0.02, 1.8, t);
      this._mTone('sawtooth', NOTE(64), 0.018, 1.8, t);
    }
  }
}
