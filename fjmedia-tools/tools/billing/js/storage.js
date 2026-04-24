const DEFAULT_KEY = 'fjmedia-billing-v1';

const DEFAULT_DATA = () => ({
  clients: [],
  invoices: [],
  payments: [],
  settings: {
    nextInvoiceCounter: 1,
    currentYear: new Date().getFullYear(),
    businessName: 'FJMedia',
    businessEmail: 'diazcjames@gmail.com'
  }
});

export function createStore(storage = localStorage, key = DEFAULT_KEY) {
  function read() {
    const raw = storage.getItem(key);
    if (!raw) return DEFAULT_DATA();
    try {
      return { ...DEFAULT_DATA(), ...JSON.parse(raw) };
    } catch {
      return DEFAULT_DATA();
    }
  }

  function write(data) {
    storage.setItem(key, JSON.stringify(data));
  }

  function update(mutator) {
    const data = read();
    mutator(data);
    write(data);
    return data;
  }

  function reset() {
    storage.removeItem(key);
  }

  return { read, write, update, reset };
}

export const store = createStore(typeof localStorage !== 'undefined' ? localStorage : null);
