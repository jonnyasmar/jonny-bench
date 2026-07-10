/**
 * Lightweight Web Audio synth — no external assets.
 */
export class AudioBus {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.muted = false;
    this.enabled = false;
  }

  unlock() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.35;
    this.master.connect(this.ctx.destination);
    this.enabled = true;
  }

  resume() {
    if (this.ctx?.state === "suspended") this.ctx.resume();
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.master) this.master.gain.value = this.muted ? 0 : 0.35;
    return this.muted;
  }

  _t() {
    return this.ctx ? this.ctx.currentTime : 0;
  }

  _osc(type, freq, dur, gain = 0.15, slideTo = null, delay = 0) {
    if (!this.enabled || this.muted || !this.ctx) return;
    this.resume();
    const t = this._t() + delay;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo != null) o.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(this.master);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  _noise(dur, gain = 0.12, filterFreq = 1200) {
    if (!this.enabled || this.muted || !this.ctx) return;
    this.resume();
    const t = this._t();
    const len = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const f = this.ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(filterFreq, t);
    f.frequency.exponentialRampToValueAtTime(80, t + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f);
    f.connect(g);
    g.connect(this.master);
    src.start(t);
    src.stop(t + dur + 0.02);
  }

  shoot() {
    this._osc("square", 880, 0.07, 0.06, 220);
  }

  laser() {
    this._osc("sawtooth", 1400, 0.12, 0.05, 400);
  }

  missile() {
    this._osc("triangle", 180, 0.18, 0.08, 60);
  }

  hit() {
    this._noise(0.08, 0.1, 2000);
  }

  explode(big = false) {
    this._noise(big ? 0.45 : 0.2, big ? 0.28 : 0.14, big ? 900 : 1600);
    this._osc("sawtooth", big ? 120 : 200, big ? 0.4 : 0.18, big ? 0.12 : 0.07, 40);
  }

  powerCollect() {
    this._osc("sine", 520, 0.08, 0.08, 780);
    this._osc("sine", 780, 0.1, 0.06, 1040, 0.06);
  }

  powerActivate() {
    this._osc("square", 300, 0.15, 0.08, 900);
    this._osc("sine", 600, 0.2, 0.06, 1200, 0.05);
  }

  playerHit() {
    this._noise(0.3, 0.2, 600);
    this._osc("sawtooth", 180, 0.35, 0.1, 40);
  }

  bossAppear() {
    this._osc("sawtooth", 80, 0.6, 0.15, 40);
    this._osc("square", 110, 0.5, 0.08, 55, 0.1);
  }

  ui() {
    this._osc("sine", 660, 0.06, 0.05);
  }

  thruster() {
    // soft continuous loop not used — avoid spam
  }

  waveClear() {
    [523, 659, 784, 1046].forEach((f, i) => this._osc("sine", f, 0.2, 0.07, f * 1.02, i * 0.08));
  }
}
