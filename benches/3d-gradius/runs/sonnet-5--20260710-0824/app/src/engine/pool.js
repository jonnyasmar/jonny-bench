// Simple object pool: reuses dead instances instead of reallocating every frame.
export class Pool {
  constructor(factory, resetFn) {
    this.factory = factory;
    this.resetFn = resetFn;
    this.active = [];
    this.free = [];
  }

  spawn(...args) {
    let obj = this.free.pop();
    if (!obj) obj = this.factory();
    this.resetFn(obj, ...args);
    obj.alive = true;
    this.active.push(obj);
    return obj;
  }

  update(dt, updateFn) {
    for (let i = this.active.length - 1; i >= 0; i--) {
      const obj = this.active[i];
      // killed out-of-band since it was last ticked (e.g. by collision resolution) —
      // retire it now instead of running one more update (which could re-fire, re-move, etc.)
      if (!obj.alive) {
        if (obj.onDespawn) obj.onDespawn();
        this.active.splice(i, 1);
        this.free.push(obj);
        continue;
      }
      const stillAlive = updateFn(obj, dt);
      if (!stillAlive || !obj.alive) {
        obj.alive = false;
        if (obj.onDespawn) obj.onDespawn();
        this.active.splice(i, 1);
        this.free.push(obj);
      }
    }
  }

  killAll() {
    for (const obj of this.active) {
      obj.alive = false;
      if (obj.mesh) obj.mesh.visible = false;
      if (obj.onDespawn) obj.onDespawn();
      this.free.push(obj);
    }
    this.active.length = 0;
  }
}
