export const APP_PATH_RE = /^goals\/[a-z0-9-]+\/runs\/[A-Za-z0-9.\-]+\/app\/$/;

export function isValidAppPath(value) {
  return APP_PATH_RE.test(String(value || ''));
}

export function createMemoryStorage() {
  const values = new Map();
  return {
    get length() {
      return values.size;
    },
    key(index) {
      return Array.from(values.keys())[Number(index)] ?? null;
    },
    getItem(key) {
      const name = String(key);
      return values.has(name) ? values.get(name) : null;
    },
    setItem(key, value) {
      values.set(String(key), String(value));
    },
    removeItem(key) {
      values.delete(String(key));
    },
    clear() {
      values.clear();
    }
  };
}

export function installStorageShim(win, name) {
  try {
    const storage = win[name];
    const probe = '__jonny_bench_storage_probe__';
    storage.setItem(probe, '1');
    storage.removeItem(probe);
    return false;
  } catch {
    Object.defineProperty(win, name, {
      configurable: true,
      enumerable: true,
      value: createMemoryStorage()
    });
    return true;
  }
}
