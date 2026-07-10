// Fully synthesized audio engine (Web Audio API) — no external sound assets.

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.sfxGain = null;
    this.musicGain = null;
    this.muted = false;
    this.musicTimer = null;
    this.musicStep = 0;
    this.nextNoteTime = 0;
    this.bpm = 128;
    this._started = false;
  }

  init() {
    if (this._started) return;
    this._started = true;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.9;
    this.master.connect(this.ctx.destination);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.8;
    this.sfxGain.connect(this.master);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.25;
    this.musicGain.connect(this.master);

    this._startMusic();
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  setMuted(m) {
    this.muted = m;
    if (this.master) this.master.gain.value = m ? 0 : 0.9;
  }

  now() {
    return this.ctx ? this.ctx.currentTime : 0;
  }

  // ---- primitive helpers ----

  _osc(type, freq, t0, dur, gainPeak, dest, opts = {}) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (opts.freqEnd !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, opts.freqEnd), t0 + dur);
    }
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gainPeak, t0 + (opts.attack || 0.005));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(dest || this.sfxGain);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
    return osc;
  }

  _noiseBuffer(dur) {
    const ctx = this.ctx;
    const buf = ctx.createBuffer(1, Math.max(1, ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  _noise(t0, dur, gainPeak, filterFreq, dest) {
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this._noiseBuffer(dur);
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(filterFreq, t0);
    filt.frequency.exponentialRampToValueAtTime(Math.max(80, filterFreq * 0.15), t0 + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(gainPeak, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(filt);
    filt.connect(g);
    g.connect(dest || this.sfxGain);
    src.start(t0);
    src.stop(t0 + dur + 0.02);
  }

  // ---- sound effects ----

  shoot(kind = 'blaster') {
    if (!this.ctx) return;
    const t = this.now();
    if (kind === 'laser') {
      this._osc('sawtooth', 900, t, 0.09, 0.18, this.sfxGain, { freqEnd: 300 });
    } else if (kind === 'missile') {
      this._osc('square', 220, t, 0.14, 0.16, this.sfxGain, { freqEnd: 90 });
      this._noise(t, 0.1, 0.05, 2000);
    } else {
      this._osc('square', 720, t, 0.075, 0.14, this.sfxGain, { freqEnd: 280 });
    }
  }

  explosion(scale = 1) {
    if (!this.ctx) return;
    const t = this.now();
    this._noise(t, 0.35 * scale, 0.55 * Math.min(scale, 1.6), 1800 * scale);
    this._osc('sine', 110 * scale, t, 0.3 * scale, 0.3, this.sfxGain, { freqEnd: 30 });
  }

  hit() {
    if (!this.ctx) return;
    const t = this.now();
    this._osc('triangle', 200, t, 0.08, 0.22, this.sfxGain, { freqEnd: 90 });
  }

  hurt() {
    if (!this.ctx) return;
    const t = this.now();
    this._osc('sawtooth', 180, t, 0.35, 0.28, this.sfxGain, { freqEnd: 50 });
    this._noise(t, 0.3, 0.2, 900);
  }

  powerupCollect() {
    if (!this.ctx) return;
    const t = this.now();
    [520, 660, 840].forEach((f, i) => {
      this._osc('square', f, t + i * 0.045, 0.09, 0.13, this.sfxGain);
    });
  }

  powerActivate() {
    if (!this.ctx) return;
    const t = this.now();
    this._osc('sawtooth', 200, t, 0.4, 0.2, this.sfxGain, { freqEnd: 1200 });
  }

  shieldHit() {
    if (!this.ctx) return;
    const t = this.now();
    this._osc('sine', 500, t, 0.18, 0.2, this.sfxGain, { freqEnd: 700 });
  }

  extraLife() {
    if (!this.ctx) return;
    const t = this.now();
    [440, 550, 660, 880].forEach((f, i) => {
      this._osc('triangle', f, t + i * 0.08, 0.15, 0.16, this.sfxGain);
    });
  }

  uiSelect() {
    if (!this.ctx) return;
    const t = this.now();
    this._osc('square', 380, t, 0.06, 0.1, this.sfxGain, { freqEnd: 520 });
  }

  bossAlarm() {
    if (!this.ctx) return;
    const t = this.now();
    for (let i = 0; i < 3; i++) {
      this._osc('sawtooth', 140, t + i * 0.28, 0.2, 0.25, this.sfxGain, { freqEnd: 100 });
    }
  }

  playerDeath() {
    if (!this.ctx) return;
    const t = this.now();
    this._noise(t, 0.6, 0.5, 2200);
    this._osc('sawtooth', 400, t, 0.6, 0.3, this.sfxGain, { freqEnd: 40 });
  }

  // ---- generative background music ----
  // Minor pentatonic arpeggio pad over a slow pulsing bass, scheduled ahead of time.

  _startMusic() {
    const scale = [110, 130.81, 146.83, 164.81, 196, 220, 246.94]; // A minor-ish
    this.nextNoteTime = this.ctx.currentTime + 0.1;
    const secondsPerStep = 60 / this.bpm / 2;

    const scheduler = () => {
      while (this.nextNoteTime < this.ctx.currentTime + 0.2) {
        this._scheduleMusicStep(this.musicStep, this.nextNoteTime, scale);
        this.musicStep = (this.musicStep + 1) % 32;
        this.nextNoteTime += secondsPerStep;
      }
    };
    scheduler();
    this.musicTimer = setInterval(scheduler, 60);
  }

  _scheduleMusicStep(step, t, scale) {
    const ctx = this.ctx;
    // bass pulse every 4 steps
    if (step % 8 === 0) {
      const bassFreq = scale[0] / 2 * (step % 16 === 0 ? 1 : 1.1892);
      this._osc('triangle', bassFreq, t, 0.9, 0.22, this.musicGain, { attack: 0.02 });
    }
    // sparse arpeggio, not on every step, to leave space
    if (step % 2 === 0 && Math.random() < 0.7) {
      const idx = (step / 2 + Math.floor(step / 8)) % scale.length;
      const freq = scale[idx] * (Math.random() < 0.3 ? 2 : 1);
      const g = ctx.createGain();
      g.gain.value = 1;
      g.connect(this.musicGain);
      this._osc('sine', freq, t, 0.35, 0.09, g);
    }
    // faint hat texture
    if (step % 2 === 1) {
      this._noise(t, 0.04, 0.02, 6000, this.musicGain);
    }
  }
}

export const audio = new AudioEngine();
