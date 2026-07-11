import { SolarSystem } from "./solar-system.js";
import { BODIES } from "./data.js";
import {
  createScore,
  initBook,
  initOrder,
  initSize,
  initQuiz,
  initMemory,
  planetDrawerHTML,
} from "./games.js";
import { playClick, playWhoosh, unlockAudio } from "./audio.js";

/* ── Starfield background ── */
function initStarfield() {
  const canvas = document.getElementById("stars-bg");
  const ctx = canvas.getContext("2d");
  let stars = [];
  let w = 0;
  let h = 0;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.floor((w * h) / 4500);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.3,
      a: Math.random(),
      s: Math.random() * 0.02 + 0.005,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.a += s.s;
      const alpha = 0.3 + 0.7 * Math.abs(Math.sin(s.a * Math.PI));
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
}

/* ── Navigation ── */
const screens = {
  home: document.getElementById("screen-home"),
  explore: document.getElementById("screen-explore"),
  book: document.getElementById("screen-book"),
  order: document.getElementById("screen-order"),
  size: document.getElementById("screen-size"),
  quiz: document.getElementById("screen-quiz"),
  memory: document.getElementById("screen-memory"),
};

let solar = null;
const score = createScore(document.getElementById("star-count"));
const book = initBook();
const orderGame = initOrder(score);
const sizeGame = initSize();
const quizGame = initQuiz(score);
const memoryGame = initMemory(score);

function showScreen(name) {
  Object.entries(screens).forEach(([key, el]) => {
    el.classList.toggle("active", key === name);
  });

  if (name === "explore") {
    ensureSolar();
    solar?.start();
  }
  if (name === "book") book.show();
  if (name === "order") orderGame.show();
  if (name === "size") sizeGame.show();
  if (name === "quiz") quizGame.show();
  if (name === "memory") memoryGame.show();
}

function ensureSolar() {
  if (solar) {
    solar.start();
    return;
  }
  const canvas = document.getElementById("solar-canvas");
  const drawer = document.getElementById("planet-drawer");
  const drawerBody = document.getElementById("drawer-body");
  const hint = document.getElementById("explore-hint");

  function openBody(body) {
    playWhoosh();
    drawerBody.innerHTML = planetDrawerHTML(body);
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    if (hint) hint.style.opacity = "0";
  }

  solar = new SolarSystem(canvas, {
    onSelect(body) {
      openBody(body);
    },
  });

  // Big easy-tap rail for little hands
  const rail = document.getElementById("planet-rail");
  if (rail && !rail.childElementCount) {
    BODIES.forEach((b) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "rail-btn";
      btn.innerHTML = `<span class="rail-ball" style="background:radial-gradient(circle at 30% 30%, ${b.color}, ${b.color2 || b.color})"></span>${b.name}`;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        playClick();
        solar.selectById(b.id); // triggers onSelect → openBody
      });
      rail.appendChild(btn);
    });
  }

  document.getElementById("drawer-close").onclick = () => {
    playClick();
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
  };

  document.getElementById("btn-spin").onclick = (e) => {
    const btn = e.currentTarget;
    const on = btn.getAttribute("aria-pressed") !== "true";
    btn.setAttribute("aria-pressed", String(on));
    solar.setSpinning(on);
    playClick();
  };

  document.getElementById("btn-labels").onclick = (e) => {
    const btn = e.currentTarget;
    const on = btn.getAttribute("aria-pressed") !== "true";
    btn.setAttribute("aria-pressed", String(on));
    solar.setLabels(on);
    playClick();
  };

  document.getElementById("btn-reset-cam").onclick = () => {
    solar.resetCamera();
    playClick();
  };
}

/* ── Wire UI ── */
document.querySelectorAll(".mode-card").forEach((btn) => {
  btn.addEventListener("click", () => {
    unlockAudio();
    playClick();
    showScreen(btn.dataset.mode);
  });
});

document.getElementById("btn-home").addEventListener("click", () => {
  playClick();
  showScreen("home");
  const drawer = document.getElementById("planet-drawer");
  drawer?.classList.remove("open");
});

// Unlock audio on first interaction
["pointerdown", "keydown"].forEach((ev) => {
  window.addEventListener(ev, () => unlockAudio(), { once: true });
});

initStarfield();
showScreen("home");

// Keyboard: Escape closes drawer / goes home from games
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const drawer = document.getElementById("planet-drawer");
    if (drawer?.classList.contains("open")) {
      drawer.classList.remove("open");
      return;
    }
    showScreen("home");
  }
});
