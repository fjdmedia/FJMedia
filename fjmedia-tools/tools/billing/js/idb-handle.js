// Tiny IndexedDB wrapper — stores a single FileSystemDirectoryHandle (the
// "Invoices" root folder). localStorage can't serialize handles; IndexedDB can.

const DB_NAME = 'fjmedia-billing-fs';
const STORE = 'handles';
const KEY = 'invoicesRoot';

function open() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx(db, mode) {
  return db.transaction(STORE, mode).objectStore(STORE);
}

export async function saveHandle(handle) {
  const db = await open();
  await new Promise((res, rej) => {
    const req = tx(db, 'readwrite').put(handle, KEY);
    req.onsuccess = res;
    req.onerror = () => rej(req.error);
  });
  db.close();
}

export async function loadHandle() {
  const db = await open();
  const handle = await new Promise((res, rej) => {
    const req = tx(db, 'readonly').get(KEY);
    req.onsuccess = () => res(req.result || null);
    req.onerror = () => rej(req.error);
  });
  db.close();
  return handle;
}

export async function clearHandle() {
  const db = await open();
  await new Promise((res, rej) => {
    const req = tx(db, 'readwrite').delete(KEY);
    req.onsuccess = res;
    req.onerror = () => rej(req.error);
  });
  db.close();
}
