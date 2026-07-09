(() => {
  "use strict";

  // ---------- Setup ----------
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score");
  const startScreen = document.getElementById("startScreen");
  const gameOverScreen = document.getElementById("gameOverScreen");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");
  const finalScoreEl = document.getElementById("finalScore");
  const finalBestEl = document.getElementById("finalBest");
  const startBestEl = document.getElementById("startBest");
  const newBestBadge = document.getElementById("newBestBadge");
  const muteBtn = document.getElementById("muteBtn");

  const STORAGE_BEST = "driftglow_best_v1";
  const STORAGE_MUTE = "driftglow_muted_v1";

  let W = 0, H = 0, DPR = 1;
  let scale = 1; // gameplay scale factor relative to a 600px-tall reference

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2.5);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    scale = H / 600;
    buildBackground();
  }

  // ---------- Audio (synthesized, no external assets) ----------
  let actx = null;
  let muted = localStorage.getItem(STORAGE_MUTE) === "1";
  updateMuteIcon();

  function ensureAudio() {
    if (!actx) {
      try {
        actx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        actx = null;
      }
    } else if (actx.state === "suspended") {
      actx.resume();
    }
  }

  function tone(freq, dur, type, startGain, opts) {
    if (muted || !actx) return;
    opts = opts || {};
    const t0 = actx.currentTime + (opts.delay || 0);
    const osc = actx.createOscillator();
    const gain = actx.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, t0);
    if (opts.sweepTo) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, opts.sweepTo), t0 + dur);
    }
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, startGain), t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(actx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  function playFlap() {
    ensureAudio();
    tone(520, 0.09, "sine", 0.18, { sweepTo: 760 });
  }
  function playScore() {
    ensureAudio();
    tone(760, 0.09, "triangle", 0.16, { sweepTo: 1020 });
    tone(1020, 0.12, "triangle", 0.13, { delay: 0.06 });
  }
  function playCrash() {
    ensureAudio();
    if (muted || !actx) return;
    const t0 = actx.currentTime;
    const bufferSize = actx.sampleRate * 0.35;
    const buffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noise = actx.createBufferSource();
    noise.buffer = buffer;
    const filter = actx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, t0);
    filter.frequency.exponentialRampToValueAtTime(120, t0 + 0.35);
    const gain = actx.createGain();
    gain.gain.setValueAtTime(0.35, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.35);
    noise.connect(filter).connect(gain).connect(actx.destination);
    noise.start(t0);
    noise.stop(t0 + 0.36);
    tone(140, 0.3, "sawtooth", 0.12, { sweepTo: 40 });
  }

  muteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    muted = !muted;
    localStorage.setItem(STORAGE_MUTE, muted ? "1" : "0");
    updateMuteIcon();
    if (!muted) ensureAudio();
  });

  function updateMuteIcon() {
    muteBtn.textContent = muted ? "🔇" : "🔊";
  }

  // ---------- Background (procedural, parallax) ----------
  let stars = [];
  let driftMotes = [];
  let ridgeFar = [];
  let ridgeNear = [];

  function buildBackground() {
    stars = [];
    const starCount = Math.floor((W * H) / 4200);
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H * 0.85,
        r: Math.random() * 1.6 + 0.4,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.8,
      });
    }
    driftMotes = [];
    for (let i = 0; i < 6; i++) {
      driftMotes.push({
        x: Math.random() * W,
        y: Math.random() * H * 0.7,
        r: 60 + Math.random() * 120,
        hue: 250 + Math.random() * 60,
        speed: 6 + Math.random() * 10,
      });
    }
    ridgeFar = buildRidge(0.55, 40 * scale);
    ridgeNear = buildRidge(0.72, 60 * scale);
  }

  function buildRidge(heightFrac, jitter) {
    const points = [];
    const step = 60;
    const baseY = H * heightFrac;
    let x = -step;
    while (x < W + step * 2) {
      points.push({ x, y: baseY - Math.random() * jitter });
      x += step;
    }
    return points;
  }

  function drawRidge(points, offset, color) {
    ctx.beginPath();
    ctx.moveTo(-10, H + 10);
    for (const p of points) {
      ctx.lineTo(((p.x + offset) % (W + 120)) - 60, p.y);
    }
    ctx.lineTo(W + 10, H + 10);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  // ---------- Game state ----------
  const GROUND_H = () => 46 * scale;
  const REF = {
    gravity: 1450,
    flapV: -430,
    maxFall: 620,
    playerR: 17,
    obstacleW: 66,
    hitboxPad: 9,
    baseGap: 205,
    minGap: 132,
    gapPerPoint: 2.6,
    baseSpeed: 185,
    maxSpeed: 340,
    speedPerPoint: 3.2,
    spawnDist: 300,
  };

  let state = "start"; // start | playing | dead
  let player, obstacles, particles, trail;
  let score = 0;
  let best = parseInt(localStorage.getItem(STORAGE_BEST) || "0", 10) || 0;
  let spawnTimer = 0;
  let elapsed = 0;
  let shake = { t: 0, mag: 0 };
  let deathLock = 0;
  let bgHue = 250;
  let flapCooldownForAnim = 0;

  startBestEl.textContent = best;

  function resetGame() {
    player = {
      x: W * 0.3,
      y: H * 0.42,
      vy: 0,
      rot: 0,
      squash: 1,
    };
    obstacles = [];
    particles = [];
    trail = [];
    score = 0;
    spawnTimer = 0;
    elapsed = 0;
    shake = { t: 0, mag: 0 };
    scoreEl.textContent = "0";
  }

  function currentGap() {
    return Math.max(REF.minGap, REF.baseGap - score * REF.gapPerPoint) * scale;
  }
  function currentSpeed() {
    return Math.min(REF.maxSpeed, REF.baseSpeed + score * REF.speedPerPoint) * scale;
  }

  function spawnObstacle() {
    const gap = currentGap();
    const margin = 70 * scale;
    const minCenter = margin + gap / 2;
    const maxCenter = H - GROUND_H() - margin - gap / 2;
    const centerY = minCenter + Math.random() * Math.max(10, maxCenter - minCenter);
    obstacles.push({
      x: W + REF.obstacleW * scale,
      w: REF.obstacleW * scale,
      gapY: centerY,
      gap: gap,
      passed: false,
      hue: 190 + Math.random() * 60,
    });
  }

  function flap() {
    if (state === "start") {
      startGame();
      return;
    }
    if (state === "dead") {
      if (deathLock <= 0) restartFromDeath();
      return;
    }
    ensureAudio();
    player.vy = REF.flapV * scale;
    player.squash = 1.35;
    flapCooldownForAnim = 1;
    playFlap();
    for (let i = 0; i < 5; i++) {
      particles.push(makeSpark(player.x - 10, player.y, true));
    }
  }

  function startGame() {
    resetGame();
    state = "playing";
    startScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
  }

  function restartFromDeath() {
    resetGame();
    state = "playing";
    gameOverScreen.classList.add("hidden");
  }

  function die() {
    if (state !== "playing") return;
    state = "dead";
    deathLock = 0.5;
    shake = { t: 0.35, mag: 14 * scale };
    playCrash();
    for (let i = 0; i < 26; i++) {
      particles.push(makeSpark(player.x, player.y, false));
    }
    if (score > best) {
      best = score;
      localStorage.setItem(STORAGE_BEST, String(best));
      newBestBadge.classList.remove("hidden");
    } else {
      newBestBadge.classList.add("hidden");
    }
    finalScoreEl.textContent = score;
    finalBestEl.textContent = best;
    startBestEl.textContent = best;
    setTimeout(() => {
      if (state === "dead") gameOverScreen.classList.remove("hidden");
    }, 420);
  }

  function makeSpark(x, y, gentle) {
    const ang = Math.random() * Math.PI * 2;
    const spd = gentle ? 20 + Math.random() * 40 : 60 + Math.random() * 220;
    return {
      x, y,
      vx: Math.cos(ang) * spd,
      vy: Math.sin(ang) * spd - (gentle ? 30 : 0),
      life: gentle ? 0.35 + Math.random() * 0.2 : 0.5 + Math.random() * 0.5,
      age: 0,
      r: gentle ? 1.5 + Math.random() * 1.5 : 2 + Math.random() * 2.5,
      hue: gentle ? 195 + Math.random() * 40 : 20 + Math.random() * 40,
    };
  }

  // ---------- Input ----------
  function onPointerDown(e) {
    if (e.target === muteBtn) return;
    e.preventDefault();
    flap();
  }
  canvas.addEventListener("pointerdown", onPointerDown, { passive: false });
  startBtn.addEventListener("click", (e) => { e.stopPropagation(); startGame(); ensureAudio(); });
  restartBtn.addEventListener("click", (e) => { e.stopPropagation(); restartFromDeath(); });

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
      e.preventDefault();
      flap();
    }
  });

  window.addEventListener("resize", resize);

  // ---------- Update ----------
  function update(dt) {
    elapsed += dt;
    if (shake.t > 0) shake.t = Math.max(0, shake.t - dt);
    if (deathLock > 0) deathLock -= dt;
    bgHue = 250 + Math.sin(elapsed * 0.05) * 12;

    // stars twinkle drift regardless of state
    for (const s of stars) {
      s.phase += dt * s.speed;
    }
    for (const m of driftMotes) {
      m.x -= m.speed * dt * 0.5;
      if (m.x < -m.r) m.x = W + m.r;
    }

    if (flapCooldownForAnim > 0) flapCooldownForAnim = Math.max(0, flapCooldownForAnim - dt * 4);
    player.squash += (1 - player.squash) * Math.min(1, dt * 10);

    if (state === "playing") {
      const g = REF.gravity * scale;
      player.vy += g * dt;
      player.vy = Math.min(player.vy, REF.maxFall * scale);
      player.y += player.vy * dt;
      player.rot = Math.max(-0.5, Math.min(1.1, player.vy / (500 * scale)));

      trail.push({ x: player.x, y: player.y, age: 0 });
      for (const t of trail) t.age += dt;
      trail = trail.filter(t => t.age < 0.5);

      const speed = currentSpeed();
      spawnTimer -= dt;
      if (spawnTimer <= 0) {
        spawnObstacle();
        spawnTimer = (REF.spawnDist * scale) / speed;
      }

      const pr = REF.playerR * scale - REF.hitboxPad * scale * 0.4;
      for (const o of obstacles) {
        o.x -= speed * dt;
        if (!o.passed && o.x + o.w < player.x - REF.playerR * scale) {
          o.passed = true;
          score++;
          scoreEl.textContent = String(score);
          scoreEl.classList.remove("pop");
          void scoreEl.offsetWidth;
          scoreEl.classList.add("pop");
          playScore();
        }
        // collision (AABB vs circle, approximated with padded rect check)
        const left = o.x + REF.hitboxPad * scale;
        const right = o.x + o.w - REF.hitboxPad * scale;
        if (player.x + pr > left && player.x - pr < right) {
          const gapTop = o.gapY - o.gap / 2;
          const gapBottom = o.gapY + o.gap / 2;
          if (player.y - pr < gapTop || player.y + pr > gapBottom) {
            die();
          }
        }
      }
      obstacles = obstacles.filter(o => o.x + o.w > -20);

      if (player.y + REF.playerR * scale > H - GROUND_H()) {
        player.y = H - GROUND_H() - REF.playerR * scale;
        die();
      }
      if (player.y - REF.playerR * scale < 0) {
        player.y = REF.playerR * scale;
        player.vy = 0;
      }
    }

    for (const p of particles) {
      p.age += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 260 * dt;
    }
    particles = particles.filter(p => p.age < p.life);
  }

  // ---------- Draw ----------
  function draw() {
    ctx.save();
    if (shake.t > 0) {
      const m = shake.mag * (shake.t / 0.35);
      ctx.translate((Math.random() - 0.5) * m, (Math.random() - 0.5) * m);
    }

    // sky
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, `hsl(${bgHue}, 55%, 10%)`);
    sky.addColorStop(0.55, `hsl(${bgHue + 15}, 60%, 16%)`);
    sky.addColorStop(1, `hsl(${bgHue + 30}, 45%, 22%)`);
    ctx.fillStyle = sky;
    ctx.fillRect(-40, -40, W + 80, H + 80);

    // stars
    for (const s of stars) {
      const tw = 0.55 + Math.sin(s.phase) * 0.45;
      ctx.globalAlpha = tw;
      ctx.fillStyle = "#eaf6ff";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // nebula motes
    for (const m of driftMotes) {
      const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r);
      g.addColorStop(0, `hsla(${m.hue}, 80%, 65%, 0.10)`);
      g.addColorStop(1, `hsla(${m.hue}, 80%, 65%, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // ridges (parallax silhouettes)
    const t = elapsed;
    drawRidge(ridgeFar, -(t * 8 * scale) % (W + 120), "rgba(30, 24, 60, 0.55)");
    drawRidge(ridgeNear, -(t * 18 * scale) % (W + 120), "rgba(20, 16, 44, 0.75)");

    // obstacles (crystal spires)
    for (const o of obstacles) drawObstacle(o);

    // ground
    const groundY = H - GROUND_H();
    const groundGrad = ctx.createLinearGradient(0, groundY, 0, H);
    groundGrad.addColorStop(0, "#1c1440");
    groundGrad.addColorStop(1, "#0a0620");
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, groundY, W, GROUND_H());
    ctx.fillStyle = "rgba(140, 170, 255, 0.25)";
    ctx.fillRect(0, groundY, W, 3 * scale);
    ctx.fillStyle = "rgba(120,150,255,0.08)";
    for (let x = -((elapsed * 60 * scale) % (40 * scale)); x < W; x += 40 * scale) {
      ctx.fillRect(x, groundY + 6 * scale, 18 * scale, 4 * scale);
    }

    // particles (behind/around player)
    for (const p of particles) {
      const a = 1 - p.age / p.life;
      ctx.globalAlpha = Math.max(0, a);
      ctx.fillStyle = `hsl(${p.hue}, 90%, 65%)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // trail
    for (let i = 0; i < trail.length; i++) {
      const pt = trail[i];
      const a = 1 - pt.age / 0.5;
      ctx.globalAlpha = a * 0.35;
      ctx.fillStyle = "#8fe8ff";
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, REF.playerR * scale * 0.55 * a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    drawPlayer();

    ctx.restore();
  }

  function drawObstacle(o) {
    const gapTop = o.gapY - o.gap / 2;
    const gapBottom = o.gapY + o.gap / 2;
    const groundY = H - GROUND_H();

    drawSpire(o.x, o.w, 0, gapTop, o.hue, true);
    drawSpire(o.x, o.w, gapBottom, groundY, o.hue, false);
  }

  function drawSpire(x, w, yTop, yBottom, hue, pointsDown) {
    const h = yBottom - yTop;
    if (h <= 0) return;
    const cx = x + w / 2;
    const grad = ctx.createLinearGradient(x, 0, x + w, 0);
    grad.addColorStop(0, `hsl(${hue}, 70%, 22%)`);
    grad.addColorStop(0.5, `hsl(${hue}, 85%, 46%)`);
    grad.addColorStop(1, `hsl(${hue}, 70%, 22%)`);

    ctx.save();
    ctx.shadowColor = `hsla(${hue}, 90%, 60%, 0.55)`;
    ctx.shadowBlur = 18;

    ctx.beginPath();
    const tipLen = Math.min(34, h * 0.35);
    if (pointsDown) {
      // body up top, tapering point toward the gap (downwards)
      ctx.moveTo(x, yTop);
      ctx.lineTo(x + w, yTop);
      ctx.lineTo(x + w, yBottom - tipLen);
      ctx.lineTo(cx, yBottom);
      ctx.lineTo(x, yBottom - tipLen);
      ctx.closePath();
    } else {
      ctx.moveTo(x, yBottom);
      ctx.lineTo(x + w, yBottom);
      ctx.lineTo(x + w, yTop + tipLen);
      ctx.lineTo(cx, yTop);
      ctx.lineTo(x, yTop + tipLen);
      ctx.closePath();
    }
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.shadowBlur = 0;

    // facet highlight
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.08, pointsDown ? yTop : yTop + tipLen * 0.4);
    ctx.lineTo(cx + w * 0.05, pointsDown ? yTop : yTop + tipLen * 0.4);
    ctx.lineTo(cx + w * 0.02, pointsDown ? yBottom - tipLen * 0.4 : yBottom);
    ctx.lineTo(cx - w * 0.1, pointsDown ? yBottom - tipLen * 0.4 : yBottom);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function drawPlayer() {
    const r = REF.playerR * scale;
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.rot * 0.6);
    const sx = 1 / Math.sqrt(player.squash);
    const sy = player.squash;
    ctx.scale(sx, sy);

    // outer glow
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 2.6);
    glow.addColorStop(0, "rgba(150, 220, 255, 0.55)");
    glow.addColorStop(1, "rgba(150, 220, 255, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, r * 2.6, 0, Math.PI * 2);
    ctx.fill();

    // body
    const body = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r);
    body.addColorStop(0, "#ffffff");
    body.addColorStop(0.4, "#bdeeff");
    body.addColorStop(1, "#4fb8ff");
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // eye
    ctx.fillStyle = "#0b1a2b";
    ctx.beginPath();
    ctx.arc(r * 0.32, -r * 0.08, r * 0.16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(r * 0.37, -r * 0.14, r * 0.05, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // ---------- Loop ----------
  let lastTime = null;
  function loop(ts) {
    if (lastTime === null) lastTime = ts;
    let dt = (ts - lastTime) / 1000;
    lastTime = ts;
    dt = Math.min(dt, 1 / 30);

    update(dt);
    draw();

    requestAnimationFrame(loop);
  }

  resize();
  resetGame();
  requestAnimationFrame(loop);
})();
