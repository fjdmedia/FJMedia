export const STORAGE_KEY = 'fjmedia-sketch-v1';

export function emptyState() {
  return { boards: [], activeBoardId: null, settings: {} };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.boards)) {
      console.warn('[sketch] invalid state shape, resetting');
      return emptyState();
    }
    return {
      boards: parsed.boards,
      activeBoardId: parsed.activeBoardId || null,
      settings: parsed.settings || {}
    };
  } catch (err) {
    console.warn('[sketch] load failed:', err.message);
    return emptyState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('[sketch] save failed:', err.message);
  }
}

export function makeDebouncedSaver(delay = 300) {
  let t = null;
  return function (state) {
    clearTimeout(t);
    t = setTimeout(() => saveState(state), delay);
  };
}
