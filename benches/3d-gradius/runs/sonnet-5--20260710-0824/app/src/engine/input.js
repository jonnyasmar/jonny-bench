const KEY_ALIASES = {
  ArrowUp: 'up', KeyW: 'up',
  ArrowDown: 'down', KeyS: 'down',
  ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right',
  Space: 'fire',
  KeyE: 'power',
  KeyP: 'pause',
  Escape: 'pause',
  Enter: 'confirm',
};

class InputManager {
  constructor() {
    this.state = {};
    this.pressedOnce = new Set();
    this._consumeQueue = new Set();

    window.addEventListener('keydown', (e) => {
      const action = KEY_ALIASES[e.code];
      if (!action) return;
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
      if (!this.state[action]) this._consumeQueue.add(action);
      this.state[action] = true;
    }, { passive: false });

    window.addEventListener('keyup', (e) => {
      const action = KEY_ALIASES[e.code];
      if (!action) return;
      this.state[action] = false;
    });

    window.addEventListener('blur', () => {
      for (const k in this.state) this.state[k] = false;
    });
  }

  isDown(action) {
    return !!this.state[action];
  }

  // true only on the frame the key transitioned down
  wasPressed(action) {
    if (this._consumeQueue.has(action)) {
      this._consumeQueue.delete(action);
      return true;
    }
    return false;
  }
}

export const input = new InputManager();
