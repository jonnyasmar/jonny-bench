/**
 * Keyboard + pointer input. Edge-triggered queries (`pressed`) are valid for the
 * frame in which the key went down; call `endFrame()` once per frame after logic.
 */
const MOVE_KEYS = new Set([
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space',
]);

export class Input {
  constructor() {
    this.down = new Set();
    this.justDown = new Set();
    this.anyKey = false;
    this.pointer = { active: false, nx: 0, ny: 0, tapPower: false };
    this._bound = false;
  }

  bind(el) {
    if (this._bound) return;
    this._bound = true;

    addEventListener('keydown', (e) => {
      if (e.repeat) return;
      if (MOVE_KEYS.has(e.code)) e.preventDefault();
      this.down.add(e.code);
      this.justDown.add(e.code);
      this.anyKey = true;
    });
    addEventListener('keyup', (e) => this.down.delete(e.code));
    // Losing focus mid-hold would otherwise stick the ship at full throttle.
    addEventListener('blur', () => { this.down.clear(); this.pointer.active = false; });

    const setPointer = (e) => {
      this.pointer.nx = (e.clientX / innerWidth) * 2 - 1;
      this.pointer.ny = -((e.clientY / innerHeight) * 2 - 1);
    };
    el.addEventListener('pointerdown', (e) => {
      el.setPointerCapture?.(e.pointerId);
      this.pointer.active = true;
      this.anyKey = true;
      setPointer(e);
    });
    el.addEventListener('pointermove', (e) => { if (this.pointer.active) setPointer(e); });
    const up = () => { this.pointer.active = false; };
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  isDown(...codes) { return codes.some((c) => this.down.has(c)); }
  pressed(...codes) { return codes.some((c) => this.justDown.has(c)); }

  /** -1..1 movement axes; keyboard wins over pointer steering. */
  get moveX() {
    return (this.isDown('ArrowRight', 'KeyD') ? 1 : 0) - (this.isDown('ArrowLeft', 'KeyA') ? 1 : 0);
  }
  get moveY() {
    return (this.isDown('ArrowUp', 'KeyW') ? 1 : 0) - (this.isDown('ArrowDown', 'KeyS') ? 1 : 0);
  }
  get usingKeys() { return this.moveX !== 0 || this.moveY !== 0; }

  get firing() { return true; } // auto-fire; Space still works as a "confirm" key
  get powerPressed() {
    if (this.pointer.tapPower) { this.pointer.tapPower = false; return true; }
    return this.pressed('KeyE', 'Enter', 'ShiftLeft', 'ShiftRight');
  }

  consumeAnyKey() {
    const v = this.anyKey;
    this.anyKey = false;
    return v;
  }

  endFrame() { this.justDown.clear(); }
}
