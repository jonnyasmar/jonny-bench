import { PLANETS, BODIES, QUIZ_BANK, shuffle } from "./data.js";
import {
  playClick,
  playCorrect,
  playWrong,
  playWin,
  playFlip,
} from "./audio.js";

/* ───────────── Stars / celebration ───────────── */

export function createScore(el) {
  let stars = Number(localStorage.getItem("ssa-stars") || 0);
  el.textContent = String(stars);

  return {
    get() {
      return stars;
    },
    add(n) {
      stars += n;
      localStorage.setItem("ssa-stars", String(stars));
      el.textContent = String(stars);
      el.parentElement?.animate?.(
        [{ transform: "scale(1)" }, { transform: "scale(1.2)" }, { transform: "scale(1)" }],
        { duration: 350 }
      );
    },
  };
}

export function celebrate({ title, msg, emoji = "🌟", stars, score }) {
  if (stars && score) score.add(stars);
  playWin();
  confetti();

  const root = document.getElementById("celebrate");
  document.getElementById("celebrate-emoji").textContent = emoji;
  document.getElementById("celebrate-title").textContent = title;
  document.getElementById("celebrate-msg").textContent = msg;
  root.hidden = false;

  return new Promise((resolve) => {
    const btn = document.getElementById("celebrate-ok");
    const done = () => {
      root.hidden = true;
      btn.removeEventListener("click", done);
      resolve();
    };
    btn.addEventListener("click", done);
  });
}

function confetti() {
  const colors = ["#fdcb6e", "#fd79a8", "#00cec9", "#a29bfe", "#55efc4", "#ffeaa7"];
  for (let i = 0; i < 40; i++) {
    const p = document.createElement("div");
    p.className = "confetti-piece";
    p.style.left = Math.random() * 100 + "vw";
    p.style.top = -10 + Math.random() * 20 + "px";
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = Math.random() * 0.3 + "s";
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1600);
  }
}

/* ───────────── Planet Book ───────────── */

export function initBook() {
  const card = document.getElementById("book-card");
  const dots = document.getElementById("book-dots");
  let index = 0;
  let level = "little";

  function renderDots() {
    dots.innerHTML = "";
    BODIES.forEach((b, i) => {
      const d = document.createElement("button");
      d.type = "button";
      d.className = "book-dot" + (i === index ? " active" : "");
      d.style.background = i === index ? b.color : "";
      d.setAttribute("aria-label", b.name);
      d.addEventListener("click", () => {
        index = i;
        render();
      });
      dots.appendChild(d);
    });
  }

  function render() {
    const b = BODIES[index];
    const facts = level === "little" ? b.little : b.big;
    const rings = b.hasRings ? " has-rings" : "";
    card.innerHTML = `
      <div class="book-planet-visual${rings}" style="background: radial-gradient(circle at 35% 30%, ${b.color}, ${b.color2 || b.color}); color: ${b.color};"></div>
      <h3>${b.emoji} ${b.name}</h3>
      <div class="nickname">${b.nickname}</div>
      ${b.order ? `<span class="order-badge">Planet #${b.order} from the Sun</span>` : `<span class="order-badge">Center of our solar system</span>`}
      <div class="book-facts">
        ${facts
          .map(
            (f) => `
          <div class="fact-item ${level === "big" ? "big-kid" : ""}">
            <span class="emoji">${f.emoji}</span>
            <span>${f.text}</span>
          </div>`
          )
          .join("")}
      </div>
    `;
    renderDots();
  }

  document.getElementById("book-prev").onclick = () => {
    playClick();
    index = (index - 1 + BODIES.length) % BODIES.length;
    render();
  };
  document.getElementById("book-next").onclick = () => {
    playClick();
    index = (index + 1) % BODIES.length;
    render();
  };

  document.querySelectorAll(".level-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      playClick();
      level = btn.dataset.level;
      document.querySelectorAll(".level-btn").forEach((b) => b.classList.toggle("active", b === btn));
      render();
    });
  });

  return {
    show() {
      render();
    },
  };
}

/* ───────────── Order Game ───────────── */

export function initOrder(score) {
  const slotsEl = document.getElementById("order-slots");
  const bankEl = document.getElementById("order-bank");
  const feedback = document.getElementById("order-feedback");
  let placement = Array(8).fill(null);
  let bankOrder = shuffle(PLANETS.map((p) => p.id));

  function makeChip(planet) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "planet-chip";
    btn.dataset.id = planet.id;
    btn.innerHTML = `<span class="chip-ball" style="background: radial-gradient(circle at 30% 30%, ${planet.color}, ${planet.color2})"></span><span>${planet.name}</span>`;
    btn.addEventListener("click", () => onChipClick(planet.id));
    return btn;
  }

  function onChipClick(id) {
    playClick();
    const slotIdx = placement.indexOf(id);
    if (slotIdx >= 0) {
      placement[slotIdx] = null;
      render();
      return;
    }
    const target = placement.findIndex((p) => p === null);
    if (target < 0) return;
    placement[target] = id;
    render();
  }

  function render() {
    slotsEl.innerHTML = "";
    for (let i = 0; i < 8; i++) {
      const slot = document.createElement("div");
      slot.className = "order-slot" + (placement[i] ? " filled" : "");
      const num = document.createElement("span");
      num.className = "slot-num";
      num.textContent = String(i + 1);
      slot.appendChild(num);
      if (placement[i]) {
        const planet = PLANETS.find((p) => p.id === placement[i]);
        slot.appendChild(makeChip(planet));
      }
      slotsEl.appendChild(slot);
    }

    bankEl.innerHTML = "";
    bankOrder
      .filter((id) => !placement.includes(id))
      .forEach((id) => {
        const planet = PLANETS.find((p) => p.id === id);
        bankEl.appendChild(makeChip(planet));
      });
  }

  function reset() {
    placement = Array(8).fill(null);
    bankOrder = shuffle(PLANETS.map((p) => p.id));
    feedback.textContent = "";
    feedback.className = "feedback";
    render();
  }

  document.getElementById("order-check").onclick = async () => {
    const correct = PLANETS.map((p) => p.id);
    if (placement.some((p) => p === null)) {
      feedback.textContent = "Fill all 8 spots first! 🚀";
      feedback.className = "feedback bad";
      playWrong();
      return;
    }

    let allGood = true;
    const chips = slotsEl.querySelectorAll(".planet-chip");
    chips.forEach((chip, i) => {
      if (placement[i] === correct[i]) {
        chip.classList.add("correct");
      } else {
        chip.classList.add("wrong");
        allGood = false;
      }
    });

    if (allGood) {
      feedback.textContent = "Perfect order! Mercury → Neptune 🌟";
      feedback.className = "feedback good";
      playCorrect();
      await celebrate({
        title: "Planet Master!",
        msg: "You put all 8 planets in the right order. +5 stars!",
        emoji: "🪐",
        stars: 5,
        score,
      });
    } else {
      feedback.textContent = "Not quite — look for the red ones and try again!";
      feedback.className = "feedback bad";
      playWrong();
    }
  };

  document.getElementById("order-reset").onclick = () => {
    playClick();
    reset();
  };

  return { show: reset };
}

/* ───────────── Size Compare ───────────── */

export function initSize() {
  const picker = document.getElementById("size-picker");
  const canvas = document.getElementById("size-canvas");
  const fact = document.getElementById("size-fact");
  const label = document.getElementById("size-compare-label");
  const ctx = canvas.getContext("2d");
  let current = "jupiter";

  PLANETS.forEach((p) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "size-pick-btn" + (p.id === current ? " active" : "");
    btn.innerHTML = `<span class="dot" style="background:${p.color}"></span>${p.name}`;
    btn.addEventListener("click", () => {
      playClick();
      current = p.id;
      picker.querySelectorAll(".size-pick-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      draw();
    });
    picker.appendChild(btn);
  });

  function draw() {
    const planet = PLANETS.find((p) => p.id === current);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth || 800;
    const h = 280;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "rgba(10,14,40,0)");
    bg.addColorStop(1, "rgba(10,14,40,0.3)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const ratio = planet.sizeVsEarth;
    // Scale so largest (Jupiter 11.2) fits; Earth baseline size
    const maxR = Math.min(w, h) * 0.38;
    const earthR = maxR / Math.max(ratio, 1.15);
    const planetR = earthR * Math.min(ratio, 12);

    // If planet smaller than earth, scale earth up a bit for visibility
    let eR = earthR;
    let pR = planetR;
    if (ratio < 1) {
      eR = maxR * 0.45;
      pR = eR * ratio;
    } else if (ratio > 4) {
      pR = maxR;
      eR = pR / ratio;
    } else {
      pR = maxR * 0.55;
      eR = pR / ratio;
    }

    const midY = h * 0.55;
    const earthX = w * 0.28;
    const planetX = w * 0.68;

    // Earth
    drawGlobe(ctx, earthX, midY, eR, "#3d8bfd", "#2ecc71", true);
    ctx.fillStyle = "#a0a8c8";
    ctx.font = "bold 14px Nunito, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Earth", earthX, midY + eR + 22);

    // Planet
    drawGlobe(ctx, planetX, midY, pR, planet.color, planet.color2 || planet.color, false);
    if (planet.hasRings) {
      ctx.save();
      ctx.translate(planetX, midY);
      ctx.scale(1, 0.35);
      ctx.beginPath();
      ctx.ellipse(0, 0, pR * 1.7, pR * 1.7, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,220,150,0.65)";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();
    }
    ctx.fillStyle = "#ffeaa7";
    ctx.font = "bold 14px Nunito, sans-serif";
    ctx.fillText(planet.name, planetX, midY + pR + 22);

    // Size badge
    ctx.fillStyle = "rgba(253,203,110,0.15)";
    ctx.strokeStyle = "#fdcb6e";
    ctx.lineWidth = 2;
    roundRectPath(ctx, w / 2 - 70, 12, 140, 32, 12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#fdcb6e";
    ctx.font = "bold 15px Nunito, sans-serif";
    ctx.fillText(
      ratio >= 1 ? `${ratio.toFixed(1)}× Earth` : `${ratio.toFixed(2)}× Earth`,
      w / 2,
      34
    );

    label.textContent = `${planet.emoji} ${planet.name}`;
    fact.textContent = planet.sizeFact;
  }

  function drawGlobe(ctx, x, y, r, c1, c2, isEarth) {
    const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 2;
    ctx.stroke();
    if (isEarth && r > 12) {
      ctx.fillStyle = "rgba(46,204,113,0.65)";
      ctx.beginPath();
      ctx.ellipse(x - r * 0.15, y - r * 0.05, r * 0.28, r * 0.35, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function roundRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  return {
    show() {
      requestAnimationFrame(draw);
      window.addEventListener("resize", draw);
    },
  };
}

/* ───────────── Quiz ───────────── */

export function initQuiz(score) {
  const card = document.getElementById("quiz-card");
  const feedback = document.getElementById("quiz-feedback");
  const actions = document.getElementById("quiz-actions");
  const results = document.getElementById("quiz-results");
  const progressText = document.getElementById("quiz-progress-text");
  const bar = document.getElementById("quiz-bar");

  let questions = [];
  let qi = 0;
  let correctCount = 0;
  let answered = false;

  function start() {
    questions = shuffle(QUIZ_BANK).slice(0, 8);
    qi = 0;
    correctCount = 0;
    answered = false;
    results.hidden = true;
    card.hidden = false;
    actions.hidden = true;
    feedback.textContent = "";
    feedback.className = "feedback";
    showQuestion();
  }

  function showQuestion() {
    answered = false;
    actions.hidden = true;
    feedback.textContent = "";
    feedback.className = "feedback";
    const q = questions[qi];
    progressText.textContent = `Question ${qi + 1} of ${questions.length}`;
    bar.style.width = `${(qi / questions.length) * 100}%`;

    card.innerHTML = `
      <div class="quiz-emoji">${q.emoji}</div>
      <div class="quiz-question">${q.q}</div>
      <div class="quiz-options">
        ${q.options
          .map(
            (opt, i) =>
              `<button type="button" class="quiz-opt" data-i="${i}">${opt}</button>`
          )
          .join("")}
      </div>
    `;

    card.querySelectorAll(".quiz-opt").forEach((btn) => {
      btn.addEventListener("click", () => onAnswer(Number(btn.dataset.i), btn));
    });
  }

  function onAnswer(i, btn) {
    if (answered) return;
    answered = true;
    const q = questions[qi];
    const opts = card.querySelectorAll(".quiz-opt");
    opts.forEach((o) => (o.disabled = true));

    if (i === q.answer) {
      btn.classList.add("correct");
      correctCount++;
      feedback.textContent = "Yes! " + q.explain;
      feedback.className = "feedback good";
      playCorrect();
      score.add(1);
    } else {
      btn.classList.add("wrong");
      opts[q.answer].classList.add("correct");
      feedback.textContent = "Oops! " + q.explain;
      feedback.className = "feedback bad";
      playWrong();
    }

    actions.hidden = false;
    document.getElementById("quiz-next").textContent =
      qi + 1 >= questions.length ? "See Results ⭐" : "Next Question →";
  }

  document.getElementById("quiz-next").onclick = async () => {
    playClick();
    qi++;
    if (qi >= questions.length) {
      bar.style.width = "100%";
      finish();
    } else {
      showQuestion();
    }
  };

  async function finish() {
    card.hidden = true;
    actions.hidden = true;
    feedback.textContent = "";
    results.hidden = false;
    const pct = Math.round((correctCount / questions.length) * 100);
    let title = "Nice try!";
    let emoji = "🚀";
    if (pct === 100) {
      title = "Space Genius!";
      emoji = "🏆";
    } else if (pct >= 75) {
      title = "Star Explorer!";
      emoji = "🌟";
    } else if (pct >= 50) {
      title = "Good job!";
      emoji = "✨";
    }

    results.innerHTML = `
      <div style="font-size:3rem">${emoji}</div>
      <h3>${title}</h3>
      <div class="big-score">${correctCount}/${questions.length}</div>
      <p style="font-weight:700;color:var(--muted);margin-bottom:16px">You got ${pct}% right!</p>
      <button type="button" class="primary-btn" id="quiz-again">Play Again</button>
    `;
    document.getElementById("quiz-again").onclick = () => {
      playClick();
      start();
    };

    if (pct >= 75) {
      await celebrate({
        title,
        msg: `You scored ${correctCount} out of ${questions.length}! Bonus +3 stars!`,
        emoji,
        stars: 3,
        score,
      });
    }
  }

  return { show: start };
}

/* ───────────── Memory Match ───────────── */

export function initMemory(score) {
  const grid = document.getElementById("memory-grid");
  const movesEl = document.getElementById("memory-moves");
  const feedback = document.getElementById("memory-feedback");

  // 6 pairs = 12 cards (good for little kids)
  const pairSource = PLANETS.slice(0, 6);
  let cards = [];
  let flipped = [];
  let lock = false;
  let moves = 0;
  let matches = 0;

  function start() {
    cards = shuffle(
      pairSource.flatMap((p) => [
        { id: p.id, planet: p, key: p.id + "-a" },
        { id: p.id, planet: p, key: p.id + "-b" },
      ])
    );
    flipped = [];
    lock = false;
    moves = 0;
    matches = 0;
    movesEl.textContent = "0";
    feedback.textContent = "";
    feedback.className = "feedback";
    render();
  }

  function render() {
    grid.innerHTML = "";
    cards.forEach((c, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "memory-card";
      btn.dataset.idx = String(idx);
      btn.innerHTML = `
        <span class="face face-back">🌌</span>
        <span class="face face-front">
          <span class="ball" style="background:radial-gradient(circle at 30% 30%, ${c.planet.color}, ${c.planet.color2})"></span>
          ${c.planet.name}
        </span>
      `;
      btn.addEventListener("click", () => flip(idx, btn));
      grid.appendChild(btn);
    });
  }

  function flip(idx, btn) {
    if (lock) return;
    if (btn.classList.contains("flipped") || btn.classList.contains("matched")) return;
    playFlip();
    btn.classList.add("flipped");
    flipped.push({ idx, btn, id: cards[idx].id });

    if (flipped.length === 2) {
      moves++;
      movesEl.textContent = String(moves);
      lock = true;
      const [a, b] = flipped;
      if (a.id === b.id) {
        a.btn.classList.add("matched");
        b.btn.classList.add("matched");
        matches++;
        playCorrect();
        feedback.textContent = `You found ${cards[a.idx].planet.name}!`;
        feedback.className = "feedback good";
        flipped = [];
        lock = false;
        if (matches === pairSource.length) {
          setTimeout(async () => {
            await celebrate({
              title: "Memory Star!",
              msg: `You matched all pairs in ${moves} moves. +5 stars!`,
              emoji: "🃏",
              stars: 5,
              score,
            });
          }, 400);
        }
      } else {
        playWrong();
        feedback.textContent = "Not a match — try again!";
        feedback.className = "feedback bad";
        setTimeout(() => {
          a.btn.classList.remove("flipped");
          b.btn.classList.remove("flipped");
          flipped = [];
          lock = false;
        }, 700);
      }
    }
  }

  document.getElementById("memory-reset").onclick = () => {
    playClick();
    start();
  };

  return { show: start };
}

/* ───────────── Planet drawer HTML ───────────── */

export function planetDrawerHTML(body, level = "little") {
  const facts = level === "little" ? body.little : body.big;
  return `
    <div class="planet-header">
      <div class="planet-swatch" style="background: radial-gradient(circle at 30% 30%, ${body.color}, ${body.color2 || body.color}); color: ${body.color};"></div>
      <div>
        <h3>${body.emoji} ${body.name}</h3>
        <div class="nickname">${body.nickname}</div>
        ${
          body.isStar
            ? `<span class="order-badge">Our star</span>`
            : `<span class="order-badge">Planet #${body.order} from the Sun</span>`
        }
      </div>
    </div>
    <div class="fact-grid">
      ${facts
        .map(
          (f) => `
        <div class="fact-item">
          <span class="emoji">${f.emoji}</span>
          <span>${f.text}</span>
        </div>`
        )
        .join("")}
      ${
        !body.isStar
          ? `<div class="fact-item big-kid">
              <span class="emoji">📏</span>
              <span>${body.sizeFact}</span>
            </div>`
          : ""
      }
    </div>
    <p style="margin-top:12px;font-weight:800;color:var(--muted);font-size:0.85rem;">
      Tip: open the Planet Book for Little Kids 🐣 or Big Kids 🦊 facts!
    </p>
  `;
}
