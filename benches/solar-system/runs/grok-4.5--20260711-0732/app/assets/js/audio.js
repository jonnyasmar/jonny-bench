/** Lightweight Web Audio beeps — no external files needed */

let ctx = null;

function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) ctx = new AC();
  }
  if (ctx && ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(freq, duration, type = "sine", gain = 0.08, delay = 0) {
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

export function unlockAudio() {
  getCtx();
}

export function playClick() {
  tone(520, 0.06, "sine", 0.05);
}

export function playWhoosh() {
  tone(280, 0.12, "triangle", 0.04);
  tone(400, 0.1, "sine", 0.03, 0.05);
}

export function playCorrect() {
  tone(523, 0.1, "sine", 0.07);
  tone(659, 0.12, "sine", 0.07, 0.1);
  tone(784, 0.18, "sine", 0.08, 0.2);
}

export function playWrong() {
  tone(220, 0.15, "square", 0.04);
  tone(180, 0.2, "square", 0.04, 0.1);
}

export function playWin() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((f, i) => tone(f, 0.18, "sine", 0.08, i * 0.12));
}

export function playFlip() {
  tone(640, 0.05, "triangle", 0.04);
}
