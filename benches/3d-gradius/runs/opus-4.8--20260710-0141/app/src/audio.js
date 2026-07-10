// Fully synthesized audio — no external assets. WebAudio SFX + a driving
// synthwave music loop scheduled on the audio clock.

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.enabled = true;
    this.musicOn = true;
    this._musicTimer = null;
    this._step = 0;
    this._nextNoteTime = 0;
  }

  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.9;
    this.master.connect(this.ctx.destination);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.55;
    this.sfxGain.connect(this.master);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.0;
    this.musicGain.connect(this.master);

    // gentle master compression so explosions don't clip
    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.knee.value = 24; comp.ratio.value = 4;
    // (master already connected directly; compressor optional path skipped for simplicity)
  }

  resume() {
    if (!this.ctx) this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  get t() { return this.ctx ? this.ctx.currentTime : 0; }

  // --- primitive voice ---
  _tone({ type = 'square', f0, f1, dur, gain = 0.3, attack = 0.005, dest, detune = 0, curve = 'exp' }) {
    if (!this.ctx || !this.enabled) return;
    const t = this.t;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, t);
    if (f1 !== undefined) {
      if (curve === 'exp') osc.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
      else osc.frequency.linearRampToValueAtTime(f1, t + dur);
    }
    osc.detune.value = detune;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    osc.connect(g);
    g.connect(dest || this.sfxGain);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  _noise({ dur = 0.2, gain = 0.3, hp = 300, lp = 6000, dest }) {
    if (!this.ctx || !this.enabled) return;
    const t = this.t;
    const len = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = (hp + lp) / 2; bp.Q.value = 0.7;
    const hpf = this.ctx.createBiquadFilter();
    hpf.type = 'highpass'; hpf.frequency.value = hp;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(hpf); hpf.connect(bp); bp.connect(g); g.connect(dest || this.sfxGain);
    src.start(t); src.stop(t + dur);
  }

  // --- SFX ---
  shoot() {
    this._tone({ type: 'square', f0: 880, f1: 320, dur: 0.12, gain: 0.16, attack: 0.001 });
    this._tone({ type: 'triangle', f0: 1760, f1: 640, dur: 0.09, gain: 0.08 });
  }
  laser() {
    this._tone({ type: 'sawtooth', f0: 520, f1: 1400, dur: 0.18, gain: 0.13, attack: 0.002, curve: 'lin' });
    this._tone({ type: 'sine', f0: 1200, f1: 2600, dur: 0.12, gain: 0.06 });
  }
  missile() {
    this._tone({ type: 'triangle', f0: 300, f1: 90, dur: 0.22, gain: 0.14 });
    this._noise({ dur: 0.18, gain: 0.08, hp: 500, lp: 3000 });
  }
  enemyShoot() {
    this._tone({ type: 'square', f0: 320, f1: 140, dur: 0.14, gain: 0.07 });
  }
  hitSmall() {
    this._noise({ dur: 0.12, gain: 0.16, hp: 800, lp: 5000 });
    this._tone({ type: 'square', f0: 220, f1: 80, dur: 0.1, gain: 0.08 });
  }
  explode(big = false) {
    this._noise({ dur: big ? 0.6 : 0.32, gain: big ? 0.42 : 0.26, hp: 120, lp: big ? 1800 : 3200 });
    this._tone({ type: 'sawtooth', f0: big ? 180 : 260, f1: 30, dur: big ? 0.5 : 0.28, gain: big ? 0.28 : 0.16 });
    if (big) this._tone({ type: 'sine', f0: 90, f1: 24, dur: 0.7, gain: 0.22 });
  }
  powerup() {
    // rising arpeggio blip
    [523, 659, 784, 1047].forEach((f, i) =>
      setTimeout(() => this._tone({ type: 'triangle', f0: f, dur: 0.12, gain: 0.13 }), i * 45));
  }
  capsule() {
    this._tone({ type: 'square', f0: 660, f1: 990, dur: 0.1, gain: 0.12, curve: 'lin' });
  }
  select() {
    this._tone({ type: 'square', f0: 440, dur: 0.05, gain: 0.1 });
  }
  playerDie() {
    this._tone({ type: 'sawtooth', f0: 400, f1: 40, dur: 0.9, gain: 0.3 });
    this._noise({ dur: 0.9, gain: 0.3, hp: 100, lp: 2400 });
  }
  shieldHit() {
    this._tone({ type: 'sine', f0: 900, f1: 300, dur: 0.16, gain: 0.14 });
    this._noise({ dur: 0.1, gain: 0.08, hp: 1200, lp: 6000 });
  }
  warn() {
    this._tone({ type: 'square', f0: 660, dur: 0.14, gain: 0.14 });
    setTimeout(() => this._tone({ type: 'square', f0: 660, dur: 0.14, gain: 0.14 }), 180);
  }
  bossExplode() {
    this.explode(true);
    setTimeout(() => this.explode(true), 200);
    setTimeout(() => this.explode(true), 450);
  }

  // --- Music: a looping synthwave groove ---
  startMusic() {
    if (!this.ctx || this._musicTimer || !this.musicOn) return;
    this.musicGain.gain.cancelScheduledValues(this.t);
    this.musicGain.gain.setTargetAtTime(0.5, this.t, 0.8);
    this._step = 0;
    this._nextNoteTime = this.t + 0.1;
    const tick = () => {
      const ahead = this.t + 0.2;
      while (this._nextNoteTime < ahead) {
        this._scheduleStep(this._step, this._nextNoteTime);
        this._nextNoteTime += 0.13; // ~115bpm 16ths
        this._step = (this._step + 1) % 32;
      }
      this._musicTimer = setTimeout(tick, 60);
    };
    tick();
  }

  stopMusic(hard = false) {
    if (this._musicTimer) { clearTimeout(this._musicTimer); this._musicTimer = null; }
    if (this.musicGain) this.musicGain.gain.setTargetAtTime(0.0, this.t, hard ? 0.05 : 0.5);
  }

  setMusicEnabled(on) {
    this.musicOn = on;
    if (!on) this.stopMusic();
    else this.startMusic();
  }

  _scheduleStep(step, when) {
    if (!this.musicOn) return;
    // Minor-key synthwave: A minor. Bass root pattern + arp.
    const bassSeq = [55, 55, 82.41, 55, 65.41, 65.41, 49, 49]; // A1 pattern by half-beat
    const arp = [220, 261.63, 329.63, 392, 329.63, 261.63, 220, 196]; // A minor arp
    const g = this.musicGain;

    // bass every 2 steps
    if (step % 2 === 0) {
      const bf = bassSeq[(step / 2) % bassSeq.length];
      this._musicTone({ type: 'sawtooth', f: bf, when, dur: 0.24, gain: 0.16, lp: 700, dest: g });
      this._musicTone({ type: 'square', f: bf, when, dur: 0.22, gain: 0.06, lp: 500, dest: g });
    }
    // arp every step
    const af = arp[step % arp.length];
    this._musicTone({ type: 'triangle', f: af * 2, when, dur: 0.12, gain: 0.05, lp: 3000, dest: g });
    // sparkle pad on downbeats
    if (step % 8 === 0) {
      this._musicTone({ type: 'sawtooth', f: 440, when, dur: 0.5, gain: 0.035, lp: 2200, dest: g });
      this._musicTone({ type: 'sawtooth', f: 659.25, when, dur: 0.5, gain: 0.03, lp: 2200, dest: g });
    }
    // hats
    if (step % 2 === 1) this._musicNoise({ when, dur: 0.05, gain: 0.05, hp: 6000, dest: g });
    // kick
    if (step % 4 === 0) this._musicKick(when, g);
  }

  _musicTone({ type, f, when, dur, gain, lp = 4000, dest }) {
    const o = this.ctx.createOscillator();
    const gg = this.ctx.createGain();
    const lpf = this.ctx.createBiquadFilter();
    lpf.type = 'lowpass'; lpf.frequency.value = lp;
    o.type = type; o.frequency.value = f;
    gg.gain.setValueAtTime(0, when);
    gg.gain.linearRampToValueAtTime(gain, when + 0.01);
    gg.gain.exponentialRampToValueAtTime(0.0006, when + dur);
    o.connect(lpf); lpf.connect(gg); gg.connect(dest);
    o.start(when); o.stop(when + dur + 0.02);
  }
  _musicNoise({ when, dur, gain, hp, dest }) {
    const len = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const s = this.ctx.createBufferSource(); s.buffer = buf;
    const hpf = this.ctx.createBiquadFilter(); hpf.type = 'highpass'; hpf.frequency.value = hp;
    const gg = this.ctx.createGain(); gg.gain.value = gain;
    s.connect(hpf); hpf.connect(gg); gg.connect(dest);
    s.start(when); s.stop(when + dur);
  }
  _musicKick(when, dest) {
    const o = this.ctx.createOscillator();
    const gg = this.ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(140, when);
    o.frequency.exponentialRampToValueAtTime(45, when + 0.12);
    gg.gain.setValueAtTime(0.22, when);
    gg.gain.exponentialRampToValueAtTime(0.001, when + 0.16);
    o.connect(gg); gg.connect(dest);
    o.start(when); o.stop(when + 0.18);
  }
}

export const Audio = new AudioEngine();
