import { describe, it, assertEqual, assertTrue } from './test-runner.js';
import { createStore } from '../js/storage.js';

describe('storage.createStore', () => {
  const mockLocalStorage = () => {
    let store = {};
    return {
      getItem: (k) => store[k] ?? null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; }
    };
  };

  it('returns default shape when nothing stored', () => {
    const store = createStore(mockLocalStorage(), 'test-key');
    const data = store.read();
    assertEqual(data.clients, []);
    assertEqual(data.invoices, []);
    assertEqual(data.payments, []);
    assertEqual(data.settings.nextInvoiceCounter, 1);
  });

  it('persists writes and reads them back', () => {
    const ls = mockLocalStorage();
    const store = createStore(ls, 'test-key');
    store.write({ clients: [{ id: 'c1', name: 'Test' }], invoices: [], payments: [], settings: { nextInvoiceCounter: 5 } });
    const fresh = createStore(ls, 'test-key');
    assertEqual(fresh.read().clients[0].name, 'Test');
    assertEqual(fresh.read().settings.nextInvoiceCounter, 5);
  });

  it('update() mutates and saves atomically', () => {
    const store = createStore(mockLocalStorage(), 'test-key');
    store.update(d => { d.clients.push({ id: 'c1', name: 'A' }); });
    assertEqual(store.read().clients.length, 1);
  });
});
