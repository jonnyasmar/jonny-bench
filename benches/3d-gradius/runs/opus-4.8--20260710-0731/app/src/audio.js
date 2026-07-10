/**
 * Everything here is synthesised at runtime — no audio files, so the build stays
 * a pure static drop. SFX are one-shot voices; music is a lookahead-scheduled
 * 16-step sequencer whose intensity tracks the game state.
 */
import { clamp } from './util.js';

const A_MINOR_PENT = [0, 3, 5, 7, 10]; // semitone offsets from root
const noteHz = (semi) => 440 * Math.pow(2, semi / 12);

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.ready = false;
    this._noise = null;
    this._timer = null;
    this._step = 0;
    this._nextNoteTime = 0;
    this._intensity = 0; // 0 = menu, 1 = combat, 2 = boss
    this._targetIntensity = 0;
    this._tempo = 132;
    this._root = -9; // A
  }

  /** Must be called from a user gesture. Safe to call repeatedly. */
  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx();

    this.master = this.ctx.createGain();
    this.master.gain.value = 0.9;
    // A limiter-ish compressor keeps dense explosion moments from clipping.
    this.comp = this.ctx.createDynamicsCompressor();
    this.comp.threshold.value = -14;
    this.comp.knee.value = 24;
    this.comp.ratio.value = 10;
    this.comp.attack.value = 0.004;
    this.comp.release.value = 0.18;
    this.master.connect(this.comp).connect(this.ctx.destination);

    this.sfx = this.ctx.createGain();
    this.sfx.gain.value = 0.55;
    this.sfx.connect(this.master);

    this.mus = this.ctx.createGain();
    this.mus.gain.value = 0.0;
    this.mus.connect(this.master);

    // Shared pink-ish noise buffer for impacts / thrusters.
    const len = this.ctx.sampleRate * 2;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + w * 0.0555179;
      b1 = 0.963 * b1 + w * 0.0750759;
      b2 = 0.577 * b2 + w * 0.153852;
      d[i] = clamp((b0 + b1 + b2 + w * 0.1848) * 0.35, -1, 1);
    }
    this._noise = buf;
    this.ready = true;
  }

  get t() { return this.ctx.currentTime; }
  _ok() { return this.ready && !this.muted && this.ctx.state === 'running'; }

  toggleMute() {
    this.muted = !this.muted;
    if (this.ready) {
      this.master.gain.cancelScheduledValues(this.t);
      this.master.gain.setTargetAtTime(this.muted ? 0 : 0.9, this.t, 0.05);
    }
    return this.muted;
  }

  // ---------------------------------------------------------------- voices

  _osc({ type = 'square', f0, f1, dur, gain = 0.3, dest = null, delay = 0, detune = 0 }) {
    const t = this.t + delay;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.detune.value = detune;
    o.frequency.setValueAtTime(f0, t);
    if (f1 != null && f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(dest || this.sfx);
    o.start(t);
    o.stop(t + dur + 0.02);
    return o;
  }

  _noiseHit({ dur = 0.3, gain = 0.4, f0 = 2400, f1 = 120, q = 1.1, type = 'lowpass', delay = 0 }) {
    const t = this.t + delay;
    const s = this.ctx.createBufferSource();
    s.buffer = this._noise;
    s.playbackRate.value = 0.8 + Math.random() * 0.5;
    const f = this.ctx.createBiquadFilter();
    f.type = type;
    f.Q.value = q;
    f.frequency.setValueAtTime(f0, t);
    f.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f).connect(g).connect(this.sfx);
    s.start(t);
    s.stop(t + dur + 0.02);
  }

  // ---------------------------------------------------------------- sfx

  shoot() {
    if (!this._ok()) return;
    this._osc({ type: 'square', f0: 1500, f1: 420, dur: 0.07, gain: 0.075 });
    this._osc({ type: 'sine', f0: 900, f1: 200, dur: 0.05, gain: 0.05 });
  }
  laser() {
    if (!this._ok()) return;
    this._osc({ type: 'sawtooth', f0: 2600, f1: 900, dur: 0.11, gain: 0.07 });
    this._osc({ type: 'sine', f0: 5200, f1: 1800, dur: 0.06, gain: 0.035 });
  }
  missile() {
    if (!this._ok()) return;
    this._noiseHit({ dur: 0.18, gain: 0.13, f0: 900, f1: 2600, type: 'bandpass', q: 2 });
  }
  hit() {
    if (!this._ok()) return;
    this._noiseHit({ dur: 0.06, gain: 0.14, f0: 3800, f1: 1200, type: 'bandpass', q: 1.4 });
    this._osc({ type: 'triangle', f0: 340, f1: 180, dur: 0.05, gain: 0.05 });
  }
  /** scale 0..1 — small popcorn kill through to boss detonation. */
  explode(scale = 0.4) {
    if (!this._ok()) return;
    const dur = 0.22 + scale * 0.85;
    this._noiseHit({ dur, gain: 0.22 + scale * 0.4, f0: 1400 + scale * 1800, f1: 60, q: 0.8 });
    this._osc({ type: 'triangle', f0: 220 - scale * 90, f1: 28, dur: dur * 0.8, gain: 0.16 + scale * 0.3 });
    if (scale > 0.55) {
      this._noiseHit({ dur: dur * 1.5, gain: 0.2, f0: 300, f1: 40, delay: 0.07 });
      this._osc({ type: 'sawtooth', f0: 90, f1: 20, dur: 0.7, gain: 0.14, delay: 0.05 });
    }
  }
  capsule() {
    if (!this._ok()) return;
    this._osc({ type: 'square', f0: 880, f1: 1320, dur: 0.07, gain: 0.09 });
    this._osc({ type: 'square', f0: 1320, f1: 1760, dur: 0.09, gain: 0.07, delay: 0.055 });
  }
  select() {
    if (!this._ok()) return;
    [0, 4, 7, 12].forEach((s, i) =>
      this._osc({ type: 'triangle', f0: noteHz(this._root + 12 + s), dur: 0.24, gain: 0.1, delay: i * 0.035 })
    );
    this._noiseHit({ dur: 0.35, gain: 0.1, f0: 6000, f1: 500, type: 'highpass' });
  }
  deny() {
    if (!this._ok()) return;
    this._osc({ type: 'square', f0: 200, f1: 120, dur: 0.1, gain: 0.06 });
  }
  shieldHit() {
    if (!this._ok()) return;
    this._osc({ type: 'sine', f0: 1400, f1: 300, dur: 0.28, gain: 0.16 });
    this._noiseHit({ dur: 0.2, gain: 0.12, f0: 5000, f1: 900, type: 'bandpass', q: 3 });
  }
  death() {
    if (!this._ok()) return;
    this.explode(1);
    this._osc({ type: 'sawtooth', f0: 500, f1: 30, dur: 1.5, gain: 0.2, delay: 0.1 });
  }
  extraLife() {
    if (!this._ok()) return;
    [0, 7, 12, 16, 19].forEach((s, i) =>
      this._osc({ type: 'square', f0: noteHz(this._root + 12 + s), dur: 0.3, gain: 0.09, delay: i * 0.07 })
    );
  }
  alarm() {
    if (!this._ok()) return;
    for (let i = 0; i < 4; i++) {
      this._osc({ type: 'sawtooth', f0: 620, f1: 900, dur: 0.16, gain: 0.1, delay: i * 0.34 });
      this._osc({ type: 'sawtooth', f0: 900, f1: 620, dur: 0.16, gain: 0.1, delay: i * 0.34 + 0.17 });
    }
  }
  fanfare() {
    if (!this._ok()) return;
    [0, 4, 7, 12, 7, 12, 16, 19].forEach((s, i) =>
      this._osc({ type: 'triangle', f0: noteHz(this._root + 12 + s), dur: 0.42, gain: 0.11, delay: i * 0.11 })
    );
  }

  // ---------------------------------------------------------------- music

  startMusic() {
    if (!this.ready || this._timer) return;
    this._step = 0;
    this._nextNoteTime = this.t + 0.08;
    this._timer = setInterval(() => this._schedule(), 25);
  }
  stopMusic() {
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
    if (this.ready) this.mus.gain.setTargetAtTime(0, this.t, 0.25);
  }
  /** 0 menu · 1 combat · 2 boss. Also nudges tempo per sector. */
  setIntensity(level, stage = 1) {
    this._targetIntensity = level;
    this._tempo = 126 + Math.min(stage - 1, 5) * 5 + (level === 2 ? 12 : 0);
    if (!this.ready) return;
    const vol = level === 0 ? 0.16 : level === 1 ? 0.3 : 0.36;
    this.mus.gain.setTargetAtTime(vol, this.t, 0.6);
  }

  _schedule() {
    if (!this.ready || this.ctx.state !== 'running') return;
    const spb = 60 / this._tempo / 4; // 16th notes
    while (this._nextNoteTime < this.t + 0.12) {
      this._playStep(this._step, this._nextNoteTime, spb);
      this._nextNoteTime += spb;
      this._step = (this._step + 1) % 32;
    }
  }

  _playStep(step, t, spb) {
    const I = this._targetIntensity;
    const root = this._root;
    const bar = (step / 16) | 0;
    // Root walks around the minor scale over two bars for a little movement.
    const prog = I === 2 ? [0, -2] : [0, 5];
    const r = root + prog[bar] - 12;

    const voice = (type, f, dur, gain, filt) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(gain, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      let node = o.connect(g);
      if (filt) {
        const bq = this.ctx.createBiquadFilter();
        bq.type = 'lowpass';
        bq.frequency.setValueAtTime(filt, t);
        bq.frequency.exponentialRampToValueAtTime(filt * 0.35, t + dur);
        bq.Q.value = 6;
        node = g.connect(bq);
      }
      node.connect(this.mus);
      o.start(t);
      o.stop(t + dur + 0.02);
    };

    const s = step % 16;

    // Kick — four on the floor once combat starts.
    if (I > 0 && s % 4 === 0) {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(150, t);
      o.frequency.exponentialRampToValueAtTime(42, t + 0.11);
      g.gain.setValueAtTime(0.34, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      o.connect(g).connect(this.mus);
      o.start(t); o.stop(t + 0.18);
    }
    // Hat
    if (I > 0 && s % 2 === 1) {
      const n = this.ctx.createBufferSource();
      n.buffer = this._noise;
      n.playbackRate.value = 2.4;
      const f = this.ctx.createBiquadFilter();
      f.type = 'highpass';
      f.frequency.value = 7200;
      const g = this.ctx.createGain();
      const amp = s % 4 === 3 ? 0.05 : 0.024;
      g.gain.setValueAtTime(amp, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
      n.connect(f).connect(g).connect(this.mus);
      n.start(t); n.stop(t + 0.06);
    }
    // Bass — driving offbeat pulse.
    const bassPat = [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0];
    if (bassPat[s]) voice('sawtooth', noteHz(r), spb * 1.6, 0.15, 520);

    // Arp lead — only in combat / boss.
    if (I > 0) {
      const idx = [0, 2, 1, 3, 4, 2, 1, 0][s % 8];
      const oct = I === 2 && s % 8 >= 4 ? 24 : 12;
      if (s % 2 === 0 || I === 2) {
        voice('square', noteHz(r + 12 + oct + A_MINOR_PENT[idx]), spb * 1.1, I === 2 ? 0.06 : 0.045, 3600);
      }
    }
    // Menu pad
    if (I === 0 && s === 0) {
      [0, 3, 7].forEach((iv) => voice('triangle', noteHz(r + 12 + iv), spb * 14, 0.05, 1400));
    }
  }
}
