// Keyboard + pointer/touch input, normalized to a small action set.

export const Input = {
  axis: { x: 0, y: 0 },      // -1..1 movement intent
  fire: false,
  firePressed: false,        // edge this frame
  power: false,
  powerPressed: false,
  pausePressed: false,
  anyPressed: false,         // for menus/start
  _down: new Set(),
  _edge: new Set(),
  pointer: { active: false, x: 0, y: 0 }, // normalized device coords for touch aim
  usingPointer: false,

  init(canvas) {
    const map = (code) => code;
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault();
      if (!this._down.has(e.code)) this._edge.add(e.code);
      this._down.add(map(e.code));
    });
    window.addEventListener('keyup', (e) => { this._down.delete(map(e.code)); });
    window.addEventListener('blur', () => { this._down.clear(); });

    // Touch / pointer: drag to move ship toward finger, tap-hold to fire.
    const setPointer = (cx, cy, active) => {
      const r = canvas.getBoundingClientRect();
      this.pointer.x = ((cx - r.left) / r.width) * 2 - 1;
      this.pointer.y = -(((cy - r.top) / r.height) * 2 - 1);
      this.pointer.active = active;
    };
    canvas.addEventListener('pointerdown', (e) => {
      this.usingPointer = true; setPointer(e.clientX, e.clientY, true);
      this.anyPressed = true; this._touchFire = true;
    });
    window.addEventListener('pointermove', (e) => {
      if (this.pointer.active) setPointer(e.clientX, e.clientY, true);
    });
    window.addEventListener('pointerup', () => { this.pointer.active = false; this._touchFire = false; });
    window.addEventListener('pointercancel', () => { this.pointer.active = false; this._touchFire = false; });
  },

  // Called once per frame BEFORE game update.
  update() {
    const d = this._down, e = this._edge;
    let x = 0, y = 0;
    if (d.has('ArrowLeft') || d.has('KeyA')) x -= 1;
    if (d.has('ArrowRight') || d.has('KeyD')) x += 1;
    if (d.has('ArrowUp') || d.has('KeyW')) y += 1;
    if (d.has('ArrowDown') || d.has('KeyS')) y -= 1;
    this.axis.x = x; this.axis.y = y;

    const fireKeys = d.has('Space') || d.has('KeyJ') || d.has('KeyZ');
    this.fire = fireKeys || this._touchFire;
    this.firePressed = e.has('Space') || e.has('KeyJ') || e.has('KeyZ');

    this.power = d.has('KeyK') || d.has('KeyX') || d.has('ShiftLeft') || d.has('ShiftRight') || d.has('KeyC');
    this.powerPressed = e.has('KeyK') || e.has('KeyX') || e.has('ShiftLeft') || e.has('ShiftRight') || e.has('KeyC');

    this.pausePressed = e.has('KeyP') || e.has('Escape');
    this.anyPressed = this.anyPressed || e.size > 0;
    this.startPressed = e.has('Enter') || e.has('Space') || e.has('KeyJ') || e.has('KeyZ');

    this._edge.clear();
  },

  consumeStart() { const v = this.startPressed || this.anyPressed; this.anyPressed = false; this.startPressed = false; return v; },
};
