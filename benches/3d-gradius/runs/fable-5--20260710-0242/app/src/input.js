// Keyboard + basic touch input. `down()` = held, `pressed()` = edge (cleared per frame).

const MAP = {
  ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right',
  ArrowUp: 'up', KeyW: 'up',
  ArrowDown: 'down', KeyS: 'down',
  Space: 'fire', KeyZ: 'fire', KeyJ: 'fire',
  KeyX: 'redeem', KeyK: 'redeem', ShiftLeft: 'redeem', ShiftRight: 'redeem',
  Enter: 'start',
  KeyP: 'pause', Escape: 'pause',
  KeyM: 'mute',
  KeyR: 'restart',
};

export class Input {
  constructor(onAnyGesture) {
    this.held = new Set();
    this.edge = new Set();
    this.touch = { active: false, x: 0, y: 0, id: -1 };
    this._gesture = onAnyGesture;

    window.addEventListener('keydown', (e) => {
      if (e.repeat) { if (MAP[e.code]) e.preventDefault(); return; }
      this._gesture && this._gesture();
      const k = MAP[e.code];
      if (!k) return;
      e.preventDefault();
      this.held.add(k);
      this.edge.add(k);
      // Space doubles as start on menus.
      if (e.code === 'Space') this.edge.add('start');
    });
    window.addEventListener('keyup', (e) => {
      const k = MAP[e.code];
      if (k) this.held.delete(k);
    });
    window.addEventListener('blur', () => this.held.clear());

    // Touch: drag anywhere = steer (relative), holding = autofire,
    // second finger tap = redeem surge.
    window.addEventListener('pointerdown', (e) => {
      this._gesture && this._gesture();
      if (e.pointerType === 'mouse') return;
      if (!this.touch.active) {
        this.touch.active = true;
        this.touch.id = e.pointerId;
        this.touch.x = e.clientX;
        this.touch.y = e.clientY;
        this.touch.dx = 0;
        this.touch.dy = 0;
        this.edge.add('start');
      } else {
        this.edge.add('redeem');
      }
    }, { passive: true });
    window.addEventListener('pointermove', (e) => {
      if (!this.touch.active || e.pointerId !== this.touch.id) return;
      this.touch.dx += (e.clientX - this.touch.x);
      this.touch.dy += (e.clientY - this.touch.y);
      this.touch.x = e.clientX;
      this.touch.y = e.clientY;
    }, { passive: true });
    const endTouch = (e) => {
      if (e.pointerId === this.touch.id) {
        this.touch.active = false;
        this.touch.id = -1;
      }
    };
    window.addEventListener('pointerup', endTouch);
    window.addEventListener('pointercancel', endTouch);
  }

  down(k) { return this.held.has(k) || (k === 'fire' && this.touch.active); }
  pressed(k) { return this.edge.has(k); }
  endFrame() {
    this.edge.clear();
    if (this.touch.active) { this.touch.dx = 0; this.touch.dy = 0; }
  }
}
