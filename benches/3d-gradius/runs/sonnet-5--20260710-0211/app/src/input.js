// Keyboard + touch input. Exposes a small normalized interface the game
// logic reads every frame: axisX/axisY in [-1,1], fireHeld, powerHeld/JustPressed.

const KEY_LEFT = new Set(['ArrowLeft', 'KeyA']);
const KEY_RIGHT = new Set(['ArrowRight', 'KeyD']);
const KEY_UP = new Set(['ArrowUp', 'KeyW']);
const KEY_DOWN = new Set(['ArrowDown', 'KeyS']);
const KEY_FIRE = new Set(['Space', 'KeyZ', 'KeyJ']);
const KEY_POWER = new Set(['ShiftLeft', 'ShiftRight', 'KeyK']);
const KEY_PAUSE = new Set(['KeyP', 'Escape']);
const KEY_MUTE = new Set(['KeyM']);

export class Input {
  constructor(onPauseToggle, onMuteToggle) {
    this.axisX = 0;
    this.axisY = 0;
    this.fireHeld = false;
    this.powerHeld = false;
    this.powerJustPressed = false;
    this._powerWasHeld = false;
    this.isTouch = false;

    this._keys = new Set();
    this.onPauseToggle = onPauseToggle;
    this.onMuteToggle = onMuteToggle;

    window.addEventListener('keydown', (e) => this._onKeyDown(e));
    window.addEventListener('keyup', (e) => this._onKeyUp(e));
    window.addEventListener('blur', () => this._keys.clear());

    this._setupTouch();
  }

  _onKeyDown(e) {
    if (
      KEY_LEFT.has(e.code) || KEY_RIGHT.has(e.code) ||
      KEY_UP.has(e.code) || KEY_DOWN.has(e.code) ||
      KEY_FIRE.has(e.code) || KEY_POWER.has(e.code) || KEY_PAUSE.has(e.code)
    ) {
      e.preventDefault();
    }
    if (KEY_PAUSE.has(e.code) && !this._keys.has(e.code)) {
      this.onPauseToggle && this.onPauseToggle();
    }
    if (KEY_MUTE.has(e.code) && !this._keys.has(e.code)) {
      this.onMuteToggle && this.onMuteToggle();
    }
    this._keys.add(e.code);
  }

  _onKeyUp(e) {
    this._keys.delete(e.code);
  }

  _setupTouch() {
    const stickZone = document.getElementById('touch-stick-zone');
    const fireZone = document.getElementById('touch-fire-zone');
    const powerBtn = document.getElementById('power-btn-touch');
    const stickBase = document.getElementById('stick-base');
    const stickNub = document.getElementById('stick-nub');
    const controlsRoot = document.getElementById('touch-controls');

    const enableTouchMode = () => {
      if (this.isTouch) return;
      this.isTouch = true;
      controlsRoot.classList.add('enabled');
      document.getElementById('desktop-controls').style.display = 'none';
    };

    window.addEventListener('touchstart', enableTouchMode, { once: true, passive: true });

    let stickTouchId = null;
    let stickOrigin = { x: 0, y: 0 };
    const maxRadius = 48;

    stickZone.addEventListener('touchstart', (e) => {
      enableTouchMode();
      const t = e.changedTouches[0];
      stickTouchId = t.identifier;
      stickOrigin = { x: t.clientX, y: t.clientY };
      stickBase.style.display = 'block';
      stickBase.style.left = `${t.clientX - 48}px`;
      stickBase.style.top = `${t.clientY - 48}px`;
      stickNub.style.left = '26px';
      stickNub.style.top = '26px';
      e.preventDefault();
    }, { passive: false });

    stickZone.addEventListener('touchmove', (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier !== stickTouchId) continue;
        let dx = t.clientX - stickOrigin.x;
        let dy = t.clientY - stickOrigin.y;
        const len = Math.hypot(dx, dy);
        if (len > maxRadius) {
          dx = (dx / len) * maxRadius;
          dy = (dy / len) * maxRadius;
        }
        stickNub.style.left = `${26 + dx}px`;
        stickNub.style.top = `${26 + dy}px`;
        this.axisX = clampAxis(dx / maxRadius);
        this.axisY = clampAxis(-dy / maxRadius);
      }
      e.preventDefault();
    }, { passive: false });

    const endStick = (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier !== stickTouchId) continue;
        stickTouchId = null;
        stickBase.style.display = 'none';
        this.axisX = 0;
        this.axisY = 0;
      }
    };
    stickZone.addEventListener('touchend', endStick);
    stickZone.addEventListener('touchcancel', endStick);

    fireZone.addEventListener('touchstart', (e) => {
      enableTouchMode();
      this.fireHeld = true;
      e.preventDefault();
    }, { passive: false });
    fireZone.addEventListener('touchend', (e) => {
      this.fireHeld = false;
      e.preventDefault();
    }, { passive: false });
    fireZone.addEventListener('touchcancel', () => (this.fireHeld = false));

    powerBtn.addEventListener('touchstart', (e) => {
      enableTouchMode();
      this.powerHeld = true;
      e.preventDefault();
    }, { passive: false });
    powerBtn.addEventListener('touchend', (e) => {
      this.powerHeld = false;
      e.preventDefault();
    }, { passive: false });
  }

  update() {
    if (!this.isTouch) {
      let x = 0, y = 0;
      if (this._anyKey(KEY_LEFT)) x -= 1;
      if (this._anyKey(KEY_RIGHT)) x += 1;
      if (this._anyKey(KEY_UP)) y += 1;
      if (this._anyKey(KEY_DOWN)) y -= 1;
      this.axisX = x;
      this.axisY = y;
      this.fireHeld = this._anyKey(KEY_FIRE);
      this.powerHeld = this._anyKey(KEY_POWER);
    }
    this.powerJustPressed = this.powerHeld && !this._powerWasHeld;
    this._powerWasHeld = this.powerHeld;
  }

  _anyKey(set) {
    for (const k of set) if (this._keys.has(k)) return true;
    return false;
  }
}

function clampAxis(v) {
  return v < -1 ? -1 : v > 1 ? 1 : v;
}
