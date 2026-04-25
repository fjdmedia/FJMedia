import { describe, it, assertEqual } from './test-runner.js';
import { loadState, saveState, STORAGE_KEY, emptyState } from '../js/storage.js';

function clearKey() { localStorage.removeItem(STORAGE_KEY); }

describe('emptyState', () => {
  it('returns { boards: [], activeBoardId: null, settings: {} }', () => {
    assertEqual(emptyState(), { boards: [], activeBoardId: null, settings: {} });
  });
});

describe('loadState', () => {
  it('returns emptyState when nothing stored', () => {
    clearKey();
    assertEqual(loadState(), emptyState());
  });
  it('returns parsed state when valid JSON stored', () => {
    clearKey();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ boards: [{ id: 'brd_x' }], activeBoardId: 'brd_x', settings: { foo: 1 } }));
    const s = loadState();
    assertEqual(s.boards.length, 1);
    assertEqual(s.activeBoardId, 'brd_x');
    assertEqual(s.settings.foo, 1);
    clearKey();
  });
  it('returns emptyState when JSON is corrupted', () => {
    clearKey();
    localStorage.setItem(STORAGE_KEY, '{not json');
    assertEqual(loadState(), emptyState());
    clearKey();
  });
  it('returns emptyState when shape is invalid (missing boards)', () => {
    clearKey();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ activeBoardId: 'x' }));
    assertEqual(loadState(), emptyState());
    clearKey();
  });
});

describe('saveState', () => {
  it('persists state under STORAGE_KEY', () => {
    clearKey();
    saveState({ boards: [{ id: 'brd_y' }], activeBoardId: 'brd_y', settings: {} });
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    assertEqual(raw.activeBoardId, 'brd_y');
    clearKey();
  });
});
