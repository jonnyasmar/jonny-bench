// Fully procedural WebAudio sound design — no external audio files.
// Everything (SFX + ambient pad) is synthesized at runtime.

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.sfxGain = null;
    this.musicGain = null;
    this.muted = false;
    this.noiseBuffer = null;
    this._ambientNodes = null;
    this._bossAlarm = null;
    this._started = false;
  }

  init() {
    if (this._started) return;
    this._started = true;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.85;
    this.master.connect(this.ctx.destination);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.9;
    this.sfxGain.connect(this.master);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.35;
    this.musicGain.connect(this.master);

    this.noiseBuffer = this._buildNoiseBuffer();
    this._startAmbient();
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.master) {
      this.master.gain.setTargetAtTime(this.muted ? 0 : 0.85, this.ctx.currentTime, 0.05);
    }
    return this.muted;
  }

  _buildNoiseBuffer() {
    const len = this.ctx.sampleRate * 1.0;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  _noiseSource() {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    src.loop = true;
    return src;
  }

  _env(gainNode, t0, attack, decay, peak) {
    const g = gainNode.gain;
    g.cancelScheduledValues(t0);
    g.setValueAtTime(0.0001, t0);
    g.linearRampToValueAtTime(peak, t0 + attack);
    g.exponentialRampToValueAtTime(0.0001, t0 + attack + decay);
  }

  // ---------------- SFX ----------------

  laser(tier = 0) {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    const base = 720 + tier * 90;
    osc.frequency.setValueAtTime(base, t0);
    osc.frequency.exponentialRampToValueAtTime(base * 0.35, t0 + 0.11);
    this._env(gain, t0, 0.002, 0.12, 0.22);
    const filt = this.ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = 3200;
    osc.connect(filt).connect(gain).connect(this.sfxGain);
    osc.start(t0);
    osc.stop(t0 + 0.15);
  }

  laserBeam() {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t0);
    osc.frequency.linearRampToValueAtTime(220, t0 + 0.2);
    this._env(gain, t0, 0.01, 0.22, 0.18);
    osc.connect(gain).connect(this.sfxGain);
    osc.start(t0);
    osc.stop(t0 + 0.24);
  }

  missile() {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, t0);
    osc.frequency.exponentialRampToValueAtTime(520, t0 + 0.18);
    this._env(gain, t0, 0.005, 0.2, 0.18);
    osc.connect(gain).connect(this.sfxGain);
    osc.start(t0);
    osc.stop(t0 + 0.22);
  }

  explosion(size = 1) {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime;
    const src = this._noiseSource();
    const gain = this.ctx.createGain();
    const filt = this.ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(2200 * size, t0);
    filt.frequency.exponentialRampToValueAtTime(120, t0 + 0.5 * size);
    this._env(gain, t0, 0.005, 0.5 * size + 0.15, 0.55 * size);
    src.connect(filt).connect(gain).connect(this.sfxGain);
    src.start(t0);
    src.stop(t0 + 0.7 * size + 0.2);

    const osc = this.ctx.createOscillator();
    const oGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(90 * size, t0);
    osc.frequency.exponentialRampToValueAtTime(30, t0 + 0.4 * size);
    this._env(oGain, t0, 0.005, 0.4 * size, 0.35 * size);
    osc.connect(oGain).connect(this.sfxGain);
    osc.start(t0);
    osc.stop(t0 + 0.45 * size);
  }

  hit() {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(340, t0);
    osc.frequency.exponentialRampToValueAtTime(120, t0 + 0.08);
    this._env(gain, t0, 0.001, 0.09, 0.16);
    osc.connect(gain).connect(this.sfxGain);
    osc.start(t0);
    osc.stop(t0 + 0.1);
  }

  playerHit() {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime;
    const src = this._noiseSource();
    const gain = this.ctx.createGain();
    const filt = this.ctx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.value = 900;
    this._env(gain, t0, 0.002, 0.3, 0.4);
    src.connect(filt).connect(gain).connect(this.sfxGain);
    src.start(t0);
    src.stop(t0 + 0.35);
  }

  pickup() {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime;
    [0, 0.07].forEach((delay, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(i === 0 ? 660 : 990, t0 + delay);
      this._env(gain, t0 + delay, 0.005, 0.15, 0.22);
      osc.connect(gain).connect(this.sfxGain);
      osc.start(t0 + delay);
      osc.stop(t0 + delay + 0.17);
    });
  }

  powerActivate() {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, t0);
    osc.frequency.exponentialRampToValueAtTime(880, t0 + 0.28);
    this._env(gain, t0, 0.01, 0.3, 0.3);
    const filt = this.ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = 4000;
    osc.connect(filt).connect(gain).connect(this.sfxGain);
    osc.start(t0);
    osc.stop(t0 + 0.32);
  }

  uiMove() {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, t0);
    this._env(gain, t0, 0.001, 0.06, 0.12);
    osc.connect(gain).connect(this.sfxGain);
    osc.start(t0);
    osc.stop(t0 + 0.07);
  }

  waveStart() {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime;
    [0, 0.12, 0.24].forEach((delay, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(220 * (i + 1.4), t0 + delay);
      this._env(gain, t0 + delay, 0.005, 0.18, 0.14);
      osc.connect(gain).connect(this.sfxGain);
      osc.start(t0 + delay);
      osc.stop(t0 + delay + 0.2);
    });
  }

  shieldBreak() {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime;
    const src = this._noiseSource();
    const gain = this.ctx.createGain();
    const filt = this.ctx.createBiquadFilter();
    filt.type = 'highpass';
    filt.frequency.value = 1200;
    this._env(gain, t0, 0.001, 0.2, 0.3);
    src.connect(filt).connect(gain).connect(this.sfxGain);
    src.start(t0);
    src.stop(t0 + 0.22);
  }

  // ---------------- Ambient music + boss alarm loops ----------------

  _startAmbient() {
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const pad = ctx.createGain();
    pad.gain.value = 0;
    pad.connect(this.musicGain);
    pad.gain.linearRampToValueAtTime(1, now + 3);

    const notes = [55, 82.4, 110, 130.8]; // A1, E2, A2, C3 — dark drone
    const oscs = notes.map((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = f;
      const detune = ctx.createOscillator();
      detune.type = osc.type;
      detune.frequency.value = f * 1.004;
      const g = ctx.createGain();
      g.gain.value = 0.22 / (i + 1);
      osc.connect(g);
      detune.connect(g);
      g.connect(pad);
      osc.start();
      detune.start();
      return [osc, detune];
    });

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.05;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.12;
    lfo.connect(lfoGain);
    lfoGain.connect(pad.gain);
    lfo.start();

    this._ambientNodes = { pad, oscs, lfo };
  }

  startBossAlarm() {
    if (this._bossAlarm || !this.ctx) return;
    const ctx = this.ctx;
    const gain = ctx.createGain();
    gain.gain.value = 0.16;
    gain.connect(this.musicGain);
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 90;
    const lfo = ctx.createOscillator();
    lfo.type = 'square';
    lfo.frequency.value = 2.4;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.14;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    osc.connect(gain);
    osc.start();
    lfo.start();
    this._bossAlarm = { osc, lfo, gain };
  }

  stopBossAlarm() {
    if (!this._bossAlarm) return;
    const { osc, lfo, gain } = this._bossAlarm;
    const t0 = this.ctx.currentTime;
    gain.gain.setTargetAtTime(0, t0, 0.2);
    osc.stop(t0 + 1);
    lfo.stop(t0 + 1);
    this._bossAlarm = null;
  }
}
