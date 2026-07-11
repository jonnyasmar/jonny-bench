/* ============================================================
   Space Kids! — app logic
   ============================================================ */
'use strict';

/* ---------------- tiny DOM helpers ---------------- */
const $ = (id) => document.getElementById(id);
function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const ORDWORDS = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'];

/* ---------------- saved progress ---------------- */
const SAVE_KEY = 'spaceKids.v1';
let state = { stars: 0, muted: false, visited: {}, sized: {}, badges: {} };
try {
  const raw = localStorage.getItem(SAVE_KEY);
  if (raw) state = Object.assign(state, JSON.parse(raw));
} catch (e) { /* private mode etc. — play without saving */ }
function save() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) { /* ok */ }
}

let interacted = false;
document.addEventListener('pointerdown', () => { interacted = true; }, { capture: true });

/* ---------------- sound effects (WebAudio) ---------------- */
let actx = null;
function ac() {
  if (!actx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    actx = new AC();
  }
  if (actx.state === 'suspended') actx.resume();
  return actx;
}
function tone(freq, delay, dur, type = 'sine', vol = 0.18, glideTo = null) {
  if (state.muted) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    const t0 = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  } catch (e) { /* audio blocked — fine */ }
}
const sfx = {
  ding()    { tone(660, 0, 0.12, 'sine', 0.2); tone(880, 0.09, 0.22, 'sine', 0.2); },
  buzz()    { tone(170, 0, 0.22, 'square', 0.06); },
  pop()     { tone(420, 0, 0.12, 'sine', 0.22, 900); },
  whoosh()  { tone(900, 0, 0.35, 'sine', 0.12, 180); },
  fanfare() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.13, 0.28, 'triangle', 0.16));
    tone(1319, 0.55, 0.5, 'triangle', 0.14);
  },
};

/* ---------------- speech ---------------- */
const synth = window.speechSynthesis || null;
let chosenVoice = null;
function pickVoice() {
  if (!synth) return;
  const vs = synth.getVoices();
  if (!vs.length) return;
  chosenVoice =
    vs.find((v) => /^en/i.test(v.lang) && /Samantha|Google US English|Zira|Karen|Daniel/i.test(v.name)) ||
    vs.find((v) => /^en/i.test(v.lang) && v.default) ||
    vs.find((v) => /^en/i.test(v.lang)) ||
    vs[0];
}
if (synth) {
  pickVoice();
  synth.onvoiceschanged = pickVoice;
}
function stripEmoji(text) {
  return text
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}
function estMs(text) { return 1200 + text.length * 68; }

let speakHandle = null;
function speak(text, opts = {}) {
  const clean = stripEmoji(text);
  if (speakHandle) { speakHandle.cancelled = true; speakHandle = null; }
  const handle = { cancelled: false, done: false };
  const finish = () => {
    if (handle.cancelled || handle.done) return;
    handle.done = true;
    if (opts.onend) opts.onend();
  };
  if (state.muted || !synth || !clean) {
    if (opts.onend) setTimeout(finish, Math.min(estMs(clean) * 0.7, 4500));
    speakHandle = handle;
    return;
  }
  try { synth.cancel(); } catch (e) { /* ok */ }
  const u = new SpeechSynthesisUtterance(clean);
  if (chosenVoice) u.voice = chosenVoice;
  u.rate = 0.95;
  u.pitch = 1.08;
  u.onend = finish;
  u.onerror = finish;
  handle.u = u; // keep a reference so it is not garbage-collected mid-speech
  speakHandle = handle;
  setTimeout(finish, estMs(clean) * 1.8 + 2000); // safety net if onend never fires
  setTimeout(() => {
    if (!handle.cancelled) {
      try { synth.speak(u); } catch (e) { finish(); }
    }
  }, 60);
}
function stopSpeech() {
  if (speakHandle) { speakHandle.cancelled = true; speakHandle = null; }
  if (synth) { try { synth.cancel(); } catch (e) { /* ok */ } }
}

/* ---------------- planet ball factory ---------------- */
function makeBall(id, px) {
  const b = el('div', 'ball skin-' + id);
  b.style.width = px + 'px';
  b.style.height = px + 'px';
  b.style.fontSize = px / 10 + 'px'; // ring/glow sizes use em
  return b;
}

/* ---------------- stars (score) ---------------- */
function addStars(n) {
  state.stars += n;
  save();
  $('starNum').textContent = state.stars;
  const sc = $('starCount');
  sc.classList.remove('pulse');
  void sc.offsetWidth;
  sc.classList.add('pulse');
}

/* ---------------- badges + toast ---------------- */
const toastQueue = [];
let toastShowing = false;
function showToast(msg) {
  toastQueue.push(msg);
  if (!toastShowing) nextToast();
}
function nextToast() {
  const msg = toastQueue.shift();
  if (!msg) { toastShowing = false; return; }
  toastShowing = true;
  const t = $('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => {
    t.classList.add('hidden');
    setTimeout(nextToast, 250);
  }, 2600);
}
function awardBadge(id) {
  if (state.badges[id]) return;
  state.badges[id] = true;
  save();
  const b = BADGES.find((x) => x.id === id);
  showToast('🎉 New sticker! ' + b.emoji + ' ' + b.name);
  sfx.fanfare();
  confettiBurst(60);
  // Everything (except "expert" itself) earned → Solar System Expert!
  if (!state.badges.expert && BADGES.every((x) => x.id === 'expert' || state.badges[x.id])) {
    setTimeout(() => {
      state.badges.expert = true;
      save();
      showToast('🌈 You are a SOLAR SYSTEM EXPERT!!! 🌈');
      sfx.fanfare();
      confettiBurst(220);
      speak('Wow! You collected every sticker! You are a real solar system expert! Amazing work!');
    }, 2000);
  }
}

/* ---------------- starfield + confetti (one render loop) ---------------- */
const starCanvas = $('starfield');
const starCtx = starCanvas.getContext('2d');
let stars = [];
function initStars() {
  starCanvas.width = innerWidth;
  starCanvas.height = innerHeight;
  const n = Math.min(240, Math.floor((innerWidth * innerHeight) / 4500));
  stars = [];
  for (let i = 0; i < n; i++) {
    stars.push({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() * 1.6 + 0.4,
      base: Math.random() * 0.5 + 0.3,
      amp: Math.random() * 0.4,
      sp: Math.random() * 1.5 + 0.4,
      ph: Math.random() * Math.PI * 2,
    });
  }
}
let shooter = null;
function drawStars(t) {
  starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
  for (const s of stars) {
    const a = Math.max(0, Math.min(1, s.base + Math.sin(t / 1000 * s.sp + s.ph) * s.amp));
    starCtx.globalAlpha = a;
    starCtx.fillStyle = '#fff';
    starCtx.beginPath();
    starCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    starCtx.fill();
  }
  starCtx.globalAlpha = 1;
  // occasional shooting star
  if (!shooter && Math.random() < 0.002) {
    shooter = { x: Math.random() * innerWidth * 0.7, y: Math.random() * innerHeight * 0.35, life: 1 };
  }
  if (shooter) {
    shooter.x += 9; shooter.y += 4.5; shooter.life -= 0.02;
    if (shooter.life <= 0) shooter = null;
    else {
      starCtx.strokeStyle = 'rgba(255,255,255,' + shooter.life * 0.8 + ')';
      starCtx.lineWidth = 2;
      starCtx.beginPath();
      starCtx.moveTo(shooter.x - 44, shooter.y - 22);
      starCtx.lineTo(shooter.x, shooter.y);
      starCtx.stroke();
    }
  }
}

const confCanvas = $('confettiCanvas');
const confCtx = confCanvas.getContext('2d');
let confetti = [];
const CONF_COLORS = ['#ffd54f', '#ff5f8f', '#4fc3f7', '#7CFC98', '#ce93d8', '#ffab91', '#fff176'];
function confettiBurst(n = 120) {
  confCanvas.width = innerWidth;
  confCanvas.height = innerHeight;
  for (let i = 0; i < n; i++) {
    confetti.push({
      x: innerWidth / 2 + (Math.random() - 0.5) * innerWidth * 0.4,
      y: innerHeight * 0.28,
      vx: (Math.random() - 0.5) * 14,
      vy: -Math.random() * 11 - 3,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 8 + 5,
      color: CONF_COLORS[Math.floor(Math.random() * CONF_COLORS.length)],
      circle: Math.random() < 0.4,
      life: 1,
    });
  }
}
function drawConfetti() {
  if (!confetti.length) {
    confCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);
    return;
  }
  confCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);
  confetti = confetti.filter((p) => p.life > 0 && p.y < innerHeight + 30);
  for (const p of confetti) {
    p.vy += 0.28;
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.99;
    p.rot += p.vr;
    p.life -= 0.004;
    confCtx.save();
    confCtx.translate(p.x, p.y);
    confCtx.rotate(p.rot);
    confCtx.globalAlpha = Math.max(0, Math.min(1, p.life * 2));
    confCtx.fillStyle = p.color;
    if (p.circle) {
      confCtx.beginPath();
      confCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      confCtx.fill();
    } else {
      confCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    }
    confCtx.restore();
  }
}

/* ---------------- orbit map (Explore) ---------------- */
const mapEl = $('orbitMap');
const angles = {}; // persistent orbit angles per body
PLANETS.forEach((p, i) => { angles[p.id] = i * 2.4 + 0.6; });
angles.moon = 0;
let mapNodes = null; // { sun, planets: {id: node}, moon }
let mapGeom = null;

function buildMap() {
  mapEl.innerHTML = '';
  const w = mapEl.clientWidth, h = mapEl.clientHeight;
  if (!w || !h) return;
  const cx = w / 2, cy = h / 2;
  const maxA = w / 2 - 55;
  const maxB = h / 2 - 42;
  const innerA = Math.min(120, maxA * 0.32);
  const k = maxB / maxA;
  const orbits = PLANETS.map((p, i) => {
    const a = innerA + ((maxA - innerA) * i) / 7;
    return { a, b: a * k };
  });
  // orbit rings
  orbits.forEach((o) => {
    const ring = el('div', 'orbit-ring');
    ring.style.width = o.a * 2 + 'px';
    ring.style.height = o.b * 2 + 'px';
    ring.style.left = cx - o.a + 'px';
    ring.style.top = cy - o.b + 'px';
    mapEl.appendChild(ring);
  });
  // scale bodies down on small screens
  const scl = Math.max(0.55, Math.min(1, Math.min(w, h) / 640));
  const nodes = { planets: {} };
  // sun
  nodes.sun = makeMapBody('sun', BODY.sun.mapSize * scl);
  nodes.sun.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
  mapEl.appendChild(nodes.sun);
  // planets
  PLANETS.forEach((p, i) => {
    const n = makeMapBody(p.id, p.mapSize * scl);
    nodes.planets[p.id] = n;
    mapEl.appendChild(n);
  });
  // the Moon (rides around Earth)
  nodes.moon = makeMapBody('moon', Math.max(14, BODY.moon.mapSize * scl), true);
  mapEl.appendChild(nodes.moon);
  mapNodes = nodes;
  mapGeom = { cx, cy, orbits, scl };
  positionMapBodies(0);
}
function makeMapBody(id, px, tiny) {
  const btn = el('button', 'map-body');
  btn.appendChild(makeBall(id, px));
  const label = el('div', 'map-label', tiny ? '' : BODY[id].name);
  btn.appendChild(label);
  if (state.visited[id]) btn.classList.add('visited');
  btn.dataset.body = id;
  btn.setAttribute('aria-label', BODY[id].name);
  btn.addEventListener('click', () => {
    $('exploreHint').classList.add('hidden');
    openBody(id);
  });
  return btn;
}
function positionMapBodies(dt) {
  if (!mapNodes || !mapGeom) return;
  const { cx, cy, orbits } = mapGeom;
  let earthX = cx, earthY = cy;
  PLANETS.forEach((p, i) => {
    angles[p.id] += (dt * Math.PI * 2) / p.periodSec;
    const o = orbits[i];
    const x = cx + o.a * Math.cos(angles[p.id]);
    const y = cy + o.b * Math.sin(angles[p.id]);
    mapNodes.planets[p.id].style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
    if (p.id === 'earth') { earthX = x; earthY = y; }
  });
  angles.moon += (dt * Math.PI * 2) / BODY.moon.periodSec;
  const mr = 30 * mapGeom.scl + 22;
  const mx = earthX + mr * Math.cos(angles.moon);
  const my = earthY - 14 + mr * Math.sin(angles.moon) * 0.7;
  mapNodes.moon.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
}

/* ---------------- master animation loop ---------------- */
let lastT = 0;
function loop(t) {
  const dt = Math.min(0.05, (t - lastT) / 1000 || 0);
  lastT = t;
  drawStars(t);
  drawConfetti();
  if (currentScreen === 'explore' && !modalOpen) positionMapBodies(dt);
  requestAnimationFrame(loop);
}

/* ---------------- planet detail modal + Grand Tour ---------------- */
const TOUR_SEQ = BODIES.slice().sort((a, b) => a.order - b.order);
let modalOpen = false;
let modalBodyId = null;
let tourActive = false;
let tourIdx = 0;
let tourToken = 0;

function orderPillText(b) {
  if (b.kind === 'star') return '⭐ The star at the center of our solar system';
  if (b.kind === 'moon') return "🌍 Earth's Moon — it circles around us";
  const kindName = { rocky: 'A small rocky planet', gas: 'A giant gas planet', ice: 'A big icy planet' }[b.kind];
  return `${ORDINALS[b.planetNum]} planet from the Sun · ${kindName}`;
}
function openBody(id, opts = {}) {
  const b = BODY[id];
  modalBodyId = id;
  modalOpen = true;
  $('modal').classList.remove('hidden');
  $('tourStop').classList.toggle('hidden', !tourActive);
  $('modalPrev').classList.toggle('hidden', tourActive);
  $('modalNext').classList.toggle('hidden', tourActive);

  const holder = $('modalBallHolder');
  holder.innerHTML = '';
  const px = Math.round(Math.max(110, Math.min(170, b.mapSize * 2.1)));
  holder.appendChild(makeBall(id, px));
  $('modalName').textContent = b.name;
  $('modalTagline').textContent = b.tagline;
  $('modalOrderPill').textContent = orderPillText(b);
  const ul = $('modalFacts');
  ul.innerHTML = '';
  b.facts.forEach((f) => ul.appendChild(el('li', '', f)));

  // progress: mark visited
  if (!state.visited[id]) {
    state.visited[id] = true;
    save();
    if (BODIES.every((x) => state.visited[x.id])) awardBadge('explorer');
  }
  if (mapNodes) {
    const n = id === 'sun' ? mapNodes.sun : id === 'moon' ? mapNodes.moon : mapNodes.planets[id];
    if (n) n.classList.add('visited');
  }

  sfx.pop();
  if (opts.tour) {
    const myToken = tourToken;
    const text = `${b.name}. ${b.tagline} ${b.facts[0]}`;
    speak(text, {
      onend: () => {
        if (!tourActive || myToken !== tourToken) return;
        setTimeout(() => {
          if (!tourActive || myToken !== tourToken) return;
          tourIdx++;
          if (tourIdx >= TOUR_SEQ.length) finishTour();
          else openBody(TOUR_SEQ[tourIdx].id, { tour: true });
        }, 800);
      },
    });
  } else {
    speak(`${b.name}! ${b.tagline}`);
  }
}
function closeModal() {
  modalOpen = false;
  modalBodyId = null;
  $('modal').classList.add('hidden');
  stopSpeech();
}
function readModalFacts() {
  const b = BODY[modalBodyId];
  if (!b) return;
  speak(`${b.name}. ${b.tagline} ${b.facts.join(' ')}`);
}
function modalStep(dir) {
  if (tourActive) stopTour(false);
  const idx = TOUR_SEQ.findIndex((x) => x.id === modalBodyId);
  const next = TOUR_SEQ[(idx + dir + TOUR_SEQ.length) % TOUR_SEQ.length];
  openBody(next.id);
}
function startTour() {
  tourActive = true;
  tourToken++;
  tourIdx = 0;
  sfx.whoosh();
  openBody(TOUR_SEQ[0].id, { tour: true });
}
function stopTour(closeToo = true) {
  if (!tourActive) return;
  tourActive = false;
  tourToken++;
  $('tourStop').classList.add('hidden');
  $('modalPrev').classList.remove('hidden');
  $('modalNext').classList.remove('hidden');
  if (closeToo) closeModal();
}
function finishTour() {
  tourActive = false;
  tourToken++;
  closeModal();
  addStars(2);
  awardBadge('tourist');
  confettiBurst(140);
  speak('You finished the Grand Tour! You flew past every planet, all the way to Neptune! Great job, space explorer!');
}

/* ---------------- Planet Parade (order game) ---------------- */
let orderNext = 0;
let orderMistakes = 0;
let orderWrongStreak = 0;

function startOrderGame() {
  orderNext = 0;
  orderMistakes = 0;
  orderWrongStreak = 0;
  $('orderDone').classList.add('hidden');
  $('orderBank').classList.remove('hidden');
  $('orderPrompt').innerHTML = 'Put the planets in order from the Sun! ☀️ Which one is <b>closest</b>?';

  const track = $('orderTrack');
  track.innerHTML = '';
  // the Sun anchors the line
  const sunCell = el('div', 'track-cell');
  const sunHold = el('div');
  sunHold.appendChild(makeBall('sun', 56));
  sunCell.appendChild(sunHold);
  sunCell.appendChild(el('div', 'cell-label', 'The Sun'));
  track.appendChild(sunCell);
  // 8 empty slots
  PLANETS.forEach((p, i) => {
    const cell = el('div', 'track-cell');
    const slot = el('div', 'slot', String(i + 1));
    slot.dataset.idx = i;
    if (i === 0) slot.classList.add('next-up');
    cell.appendChild(slot);
    cell.appendChild(el('div', 'cell-label', ''));
    track.appendChild(cell);
  });

  const bank = $('orderBank');
  bank.innerHTML = '';
  shuffle(PLANETS).forEach((p) => {
    const chip = el('button', 'chip');
    chip.dataset.body = p.id;
    chip.appendChild(makeBall(p.id, 46));
    chip.appendChild(el('span', 'chip-name', p.name));
    chip.addEventListener('click', () => onChipTap(chip, p));
    bank.appendChild(chip);
  });
}
function onChipTap(chip, p) {
  const expected = PLANETS[orderNext];
  if (!expected) return;
  if (p.id === expected.id) {
    sfx.ding();
    orderWrongStreak = 0;
    document.querySelectorAll('#orderBank .chip.hint').forEach((c) => c.classList.remove('hint'));
    chip.classList.add('placing');
    setTimeout(() => chip.remove(), 300);
    const slot = document.querySelector(`.slot[data-idx="${orderNext}"]`);
    slot.classList.remove('next-up');
    slot.classList.add('filled', 'slot-pop');
    slot.textContent = '';
    slot.appendChild(makeBall(p.id, Math.round(slot.clientWidth * 0.72) || 44));
    slot.parentElement.querySelector('.cell-label').textContent = p.name;
    orderNext++;
    if (orderNext >= PLANETS.length) {
      speak(`${p.name}! The ${ORDWORDS[p.planetNum]} planet. You did it!`);
      setTimeout(finishOrderGame, 700);
    } else {
      const nextSlot = document.querySelector(`.slot[data-idx="${orderNext}"]`);
      nextSlot.classList.add('next-up');
      speak(`${p.name}! The ${ORDWORDS[p.planetNum]} planet from the Sun. Which planet comes next?`);
    }
  } else {
    sfx.buzz();
    orderMistakes++;
    orderWrongStreak++;
    chip.classList.add('wrong');
    setTimeout(() => chip.classList.remove('wrong'), 550);
    const lines = ['Oops! Not yet!', 'Almost! Try another one!', 'Hmm, not that one. You can do it!'];
    speak(lines[Math.floor(Math.random() * lines.length)]);
    if (orderWrongStreak >= 2) {
      const hintChip = document.querySelector(`#orderBank .chip[data-body="${PLANETS[orderNext].id}"]`);
      if (hintChip) hintChip.classList.add('hint');
    }
  }
}
function finishOrderGame() {
  $('orderBank').classList.add('hidden');
  $('orderPrompt').innerHTML = '🎉 <b>You did it!</b> All 8 planets in order!';
  const box = $('mnemonicBox');
  box.innerHTML = '';
  box.appendChild(el('div', 'mn-title', '✨ A silly way to remember the order:'));
  const words = el('div', 'mn-words');
  MNEMONIC.forEach((m) => {
    const w = el('b', '', m.word);
    w.style.color = BODY[m.planet].color;
    w.title = BODY[m.planet].name;
    words.appendChild(w);
  });
  box.appendChild(words);
  $('orderDone').classList.remove('hidden');
  confettiBurst(150);
  sfx.fanfare();
  const perfect = orderMistakes === 0;
  addStars(perfect ? 5 : 3);
  awardBadge('parade');
  if (perfect) awardBadge('paradePerfect');
  const mn = MNEMONIC.map((m) => m.word).join(' ');
  speak(
    `Hooray! You put all eight planets in order! ${perfect ? 'And with no mistakes! Incredible!' : 'Great job!'} ` +
    `Here is a silly way to remember it: ${mn} — My is for Mercury, Very is for Venus, Excellent is for Earth, ` +
    `Mother is for Mars, Just is for Jupiter, Served is for Saturn, Us is for Uranus, and Noodles is for Neptune!`
  );
}

/* ---------------- Space Quiz ---------------- */
const QUIZ_LEN = 8;
let quizQs = [];
let quizIdx = 0;
let quizScore = 0;
let quizFirstTry = true;

function startQuiz() {
  quizQs = shuffle(QUIZ).slice(0, QUIZ_LEN);
  quizIdx = 0;
  quizScore = 0;
  $('quizEnd').classList.add('hidden');
  $('quizPlay').classList.remove('hidden');
  const prog = $('quizProgress');
  prog.innerHTML = '';
  for (let i = 0; i < QUIZ_LEN; i++) prog.appendChild(el('span', 'qdot', '⭐'));
  renderQuestion();
}
function renderQuestion() {
  quizFirstTry = true;
  const q = quizQs[quizIdx];
  $('quizQText').textContent = q.q;
  const box = $('quizChoices');
  box.innerHTML = '';
  const opts = shuffle(q.choices.map((c, i) => ({ c, correct: i === 0 })));
  opts.forEach((o) => {
    const btn = el('button', 'choice');
    if (o.c.startsWith('#')) {
      const id = o.c.slice(1);
      btn.appendChild(makeBall(id, 84));
      btn.appendChild(el('span', '', BODY[id].name));
    } else {
      btn.appendChild(el('span', '', o.c));
      btn.style.fontSize = 'clamp(18px, 3.4vw, 26px)';
      btn.style.padding = '30px 18px';
    }
    btn.addEventListener('click', () => onChoiceTap(btn, o.correct, q));
    box.appendChild(btn);
  });
  speak(q.q);
}
function onChoiceTap(btn, correct, q) {
  if (correct) {
    sfx.ding();
    btn.classList.add('right');
    document.querySelectorAll('#quizChoices .choice').forEach((c) => { c.style.pointerEvents = 'none'; });
    const dot = $('quizProgress').children[quizIdx];
    if (quizFirstTry) {
      quizScore++;
      addStars(1);
      dot.classList.add('won');
    } else {
      dot.textContent = '💫';
      dot.classList.add('missed');
    }
    speak(q.yay, {
      onend: () => {
        setTimeout(() => {
          quizIdx++;
          if (quizIdx >= quizQs.length) finishQuiz();
          else renderQuestion();
        }, 400);
      },
    });
  } else {
    sfx.buzz();
    quizFirstTry = false;
    btn.classList.add('wrong');
    const lines = ['Oops! Try again!', 'Not that one — you can do it!', 'Almost! Pick another one!'];
    speak(lines[Math.floor(Math.random() * lines.length)]);
  }
}
function finishQuiz() {
  $('quizPlay').classList.add('hidden');
  $('quizEnd').classList.remove('hidden');
  $('quizScoreBig').textContent = `${quizScore} / ${QUIZ_LEN} ⭐`;
  let msg;
  if (quizScore === QUIZ_LEN) msg = '🏆 PERFECT! You are a Quiz Champion!';
  else if (quizScore >= 6) msg = '🌟 Amazing! You really know your planets!';
  else if (quizScore >= 4) msg = '🚀 Nice flying! Play again to win more stars!';
  else msg = '💪 Good try! Visit the planets in Explore Space, then try again!';
  $('quizScoreMsg').textContent = msg;
  if (quizScore >= 6) { confettiBurst(150); sfx.fanfare(); }
  if (quizScore >= 6) awardBadge('quizStar');
  if (quizScore === QUIZ_LEN) awardBadge('quizChamp');
  speak(`You got ${quizScore} out of ${QUIZ_LEN} stars! ${msg}`);
}

/* ---------------- Big & Small (sizes) ---------------- */
let sizeSort = 'dist';
function buildSizes() {
  const strip = $('sizesStrip');
  strip.innerHTML = '';
  const stripH = strip.clientHeight || 300;
  const scale = Math.max(6, Math.min(30, (stripH * 0.8) / 11.2));

  // the Sun peeks in from the left — just its edge!
  const peek = el('button', 'sun-peek');
  peek.setAttribute('aria-label', 'The Sun');
  const d = 109 * scale;
  const giant = makeBall('sun', d);
  giant.classList.add('giant');
  giant.style.animation = 'none';
  giant.style.top = (stripH - d) / 2 + 'px';
  peek.appendChild(giant);
  peek.appendChild(el('div', 'peek-label', 'The SUN is so big, only its edge fits here!'));
  peek.addEventListener('click', () => tapSize(peek, 'sun'));
  if (state.sized.sun) peek.classList.add('tapped');
  strip.appendChild(peek);
  requestAnimationFrame(() => { giant.style.left = (peek.clientWidth - d) + 'px'; });

  const others = BODIES.filter((b) => b.id !== 'sun');
  const sorted = sizeSort === 'dist'
    ? others.slice().sort((a, b) => a.order - b.order)
    : others.slice().sort((a, b) => b.sizeEarths - a.sizeEarths);
  sorted.forEach((b) => {
    const item = el('button', 'size-item');
    item.dataset.body = b.id;
    const px = Math.max(7, b.sizeEarths * scale);
    item.appendChild(makeBall(b.id, px));
    if (b.id === 'saturn') { // leave room for the rings
      item.style.marginLeft = item.style.marginRight = Math.round(px * 0.45) + 'px';
    }
    item.appendChild(el('span', 'size-label', b.name));
    if (state.sized[b.id]) item.classList.add('tapped');
    item.addEventListener('click', () => tapSize(item, b.id));
    strip.appendChild(item);
  });
}
function tapSize(node, id) {
  sfx.pop();
  node.classList.add('bounce', 'tapped');
  setTimeout(() => node.classList.remove('bounce'), 550);
  speak(BODY[id].sizeFact);
  if (!state.sized[id]) {
    state.sized[id] = true;
    save();
    if (BODIES.every((b) => state.sized[b.id])) awardBadge('sizeWizard');
  }
}
function setSizeSort(mode) {
  if (sizeSort === mode) return;
  sizeSort = mode;
  $('sortDist').classList.toggle('on', mode === 'dist');
  $('sortSize').classList.toggle('on', mode === 'size');
  // FLIP: remember where each item was, rebuild, slide to new spots
  const before = {};
  document.querySelectorAll('#sizesStrip .size-item').forEach((n) => {
    before[n.dataset.body] = n.getBoundingClientRect().left;
  });
  buildSizes();
  document.querySelectorAll('#sizesStrip .size-item').forEach((n) => {
    const old = before[n.dataset.body];
    if (old === undefined) return;
    const dx = old - n.getBoundingClientRect().left;
    if (!dx) return;
    n.style.transition = 'none';
    n.style.transform = `translateX(${dx}px)`;
    requestAnimationFrame(() => {
      n.style.transition = 'transform .6s cubic-bezier(.3,1.3,.4,1)';
      n.style.transform = '';
    });
  });
  sfx.whoosh();
  speak(mode === 'size'
    ? 'Biggest first! Jupiter is the biggest planet, and Mercury is the smallest.'
    : 'Space order! This is how the planets line up, starting closest to the Sun.');
}

/* ---------------- stickers screen ---------------- */
function buildStickers() {
  const grid = $('stickerGrid');
  grid.innerHTML = '';
  let earnedCount = 0;
  BADGES.forEach((b) => {
    const earned = !!state.badges[b.id];
    if (earned) earnedCount++;
    const card = el('div', 'sticker ' + (earned ? 'earned' : 'locked'));
    card.appendChild(el('div', 'st-emoji', earned ? b.emoji : '🔒'));
    card.appendChild(el('div', 'st-name', b.name));
    card.appendChild(el('div', 'st-how', b.how));
    grid.appendChild(card);
  });
  return earnedCount;
}

/* ---------------- navigation ---------------- */
let currentScreen = 'home';
const SCREEN_META = {
  home:     { title: '', say: 'Welcome back to Space Kids! Tap a button to play!' },
  explore:  { title: '🪐 Explore Space', say: 'Welcome to space! Tap a planet to learn all about it!' },
  order:    { title: '🧩 Planet Parade', say: 'Put the planets in order from the Sun! Which planet is closest to the Sun? Tap it!' },
  quiz:     { title: '❓ Space Quiz', say: null },
  sizes:    { title: '🐘 Big & Small', say: 'Look how big and small they are! These are their real sizes. Tap one!' },
  stickers: { title: '🏆 My Stickers', say: null },
};
function go(name) {
  stopTour(true);
  if (modalOpen) closeModal();
  stopSpeech();
  currentScreen = name;
  document.querySelectorAll('.screen').forEach((s) => s.classList.add('hidden'));
  $('screen-' + name).classList.remove('hidden');
  $('backBtn').classList.toggle('hidden', name === 'home');
  $('screenTitle').textContent = SCREEN_META[name].title;

  if (name === 'explore') buildMap();
  if (name === 'order') startOrderGame();
  if (name === 'quiz') startQuiz();
  if (name === 'sizes') { buildSizes(); }
  if (name === 'stickers') {
    const n = buildStickers();
    if (interacted) {
      speak(n === 0
        ? 'This is your sticker book! Play the games to win shiny stickers!'
        : `You have ${n} sticker${n === 1 ? '' : 's'}! Can you collect them all?`);
    }
  }
  const say = SCREEN_META[name].say;
  if (say && interacted && name !== 'home') speak(say);
}

/* ---------------- wire up ---------------- */
document.querySelectorAll('.menu-btn').forEach((b) => {
  b.addEventListener('click', () => {
    sfx.pop();
    const dest = b.dataset.go;
    if (dest === 'tour') { go('explore'); setTimeout(startTour, 350); }
    else go(dest);
  });
});
$('backBtn').addEventListener('click', () => { sfx.pop(); go('home'); });
$('tourBtn').addEventListener('click', () => { sfx.whoosh(); startTour(); });
$('modalClose').addEventListener('click', () => { stopTour(false); closeModal(); });
$('tourStop').addEventListener('click', () => stopTour(true));
$('modal').addEventListener('click', (e) => {
  if (e.target === $('modal')) { stopTour(false); closeModal(); }
});
$('modalRead').addEventListener('click', () => { if (tourActive) stopTour(false); readModalFacts(); });
$('modalPrev').addEventListener('click', () => modalStep(-1));
$('modalNext').addEventListener('click', () => modalStep(1));
$('quizSpeak').addEventListener('click', () => { const q = quizQs[quizIdx]; if (q) speak(q.q); });
$('quizAgain').addEventListener('click', startQuiz);
$('quizHome').addEventListener('click', () => go('home'));
$('orderAgain').addEventListener('click', startOrderGame);
$('orderHome').addEventListener('click', () => go('home'));
$('sortDist').addEventListener('click', () => setSizeSort('dist'));
$('sortSize').addEventListener('click', () => setSizeSort('size'));

$('soundBtn').addEventListener('click', () => {
  state.muted = !state.muted;
  save();
  $('soundBtn').textContent = state.muted ? '🔇' : '🔊';
  if (state.muted) stopSpeech();
  else speak('Sound is on!');
});

let resizeTimer = null;
addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    initStars();
    if (currentScreen === 'explore') buildMap();
    if (currentScreen === 'sizes') buildSizes();
  }, 200);
});

/* ---------------- boot ---------------- */
$('starNum').textContent = state.stars;
$('soundBtn').textContent = state.muted ? '🔇' : '🔊';
initStars();
go('home');
requestAnimationFrame(loop);
