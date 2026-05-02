// File-archive module — bridges the billing tool to a real folder on disk
// using the File System Access API. Persists the directory handle in
// IndexedDB so the connection survives page reloads.
//
// One-time setup: user picks the "Invoices" root folder once.
// Per invoice: tool writes <root>/<ClientName>/FJ-YYYY-NNN-<slug>-<period>.pdf
// directly to disk via html2pdf rendering, with collision protection.
//
// Boot sync: scans every <ClientName>/*.pdf for FJ-YYYY-NNN- prefixes,
// then sets store.settings.nextInvoiceCounter to max(localCounter, fsMax + 1).
// Folder is the source of truth — localStorage is a cache.

import { store } from './storage.js';
import { saveHandle, loadHandle, clearHandle } from './idb-handle.js';

const CONNECTED_FLAG_KEY = 'fjmedia-billing-fs-connected';

export function isFSAccessSupported() {
  return typeof window.showDirectoryPicker === 'function';
}

// ─── Permissions ─────────────────────────────────────────────────────────

async function ensurePermission(handle, mode = 'readwrite') {
  if (!handle) return false;
  const opts = { mode };
  const current = await handle.queryPermission(opts);
  if (current === 'granted') return true;
  const requested = await handle.requestPermission(opts);
  return requested === 'granted';
}

// ─── Connect / disconnect ───────────────────────────────────────────────

export async function connectInvoicesFolder() {
  if (!isFSAccessSupported()) {
    throw new Error('Your browser does not support the File System Access API. Use Chrome or Edge.');
  }
  const handle = await window.showDirectoryPicker({
    id: 'fjmedia-invoices-root',
    mode: 'readwrite',
    startIn: 'documents'
  });
  await saveHandle(handle);
  try { localStorage.setItem(CONNECTED_FLAG_KEY, '1'); } catch (_) {}
  return handle;
}

export async function disconnectInvoicesFolder() {
  await clearHandle();
  try { localStorage.removeItem(CONNECTED_FLAG_KEY); } catch (_) {}
}

export async function getRoot({ silent = false } = {}) {
  const handle = await loadHandle();
  if (!handle) return null;
  // queryPermission is cheap and silent. requestPermission requires a user
  // gesture on first prompt and may show a popup — only call it when the
  // caller is OK with that (e.g. clicked "Save PDF"), never on boot.
  if (silent) {
    const current = await handle.queryPermission({ mode: 'readwrite' });
    if (current !== 'granted') return null;
    return handle;
  }
  const ok = await ensurePermission(handle, 'readwrite');
  return ok ? handle : null;
}

export async function isConnected() {
  return (await getRoot({ silent: true })) !== null;
}

// ─── Slug + filename helpers ─────────────────────────────────────────────

// Folder names: keep human-readable (case + spaces + ampersand preserved),
// strip only Windows-illegal characters (< > : " / \ | ? *).
function folderSafe(s) {
  return String(s || 'Unknown Client')
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    .replace(/\s+/g, ' ')
    .trim() || 'Unknown Client';
}

// Filename slug: replace ampersand with "and", hyphenate spaces, strip
// remaining illegals. Preserves case (matches today's manual file
// FJ-2026-005-Sugar-and-Shai-May.pdf).
function filenameSlug(s) {
  return String(s || '')
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/&/g, 'and')
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function periodSlug(invoice) {
  // Issue-date-based period tag: e.g. 2026-05 → "May" (good for monthly retainers).
  const d = new Date(invoice.issueDate);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleString('en-US', { month: 'short' });
}

export function buildInvoiceFilename(invoice, client) {
  const cs = filenameSlug(client?.name || 'unknown-client');
  const period = periodSlug(invoice);
  const tail = period ? `-${filenameSlug(period)}` : '';
  return `${invoice.id}-${cs}${tail}.pdf`;
}

export function clientSubfolder(client) {
  return folderSafe(client?.name);
}

// ─── Filesystem scan (counter sync) ──────────────────────────────────────

const ID_REGEX = /^FJ-(\d{4})-(\d+)/;

async function* listAllPDFs(root) {
  // Iterate every subfolder + collect PDF files in all of them.
  for await (const [name, handle] of root.entries()) {
    if (handle.kind === 'directory') {
      for await (const [fname, fhandle] of handle.entries()) {
        if (fhandle.kind === 'file' && /\.pdf$/i.test(fname)) {
          yield { folder: name, file: fname };
        }
      }
    } else if (handle.kind === 'file' && /\.pdf$/i.test(name)) {
      // Loose PDFs at root (e.g. today's hand-typed FJ-2026-005)
      yield { folder: '', file: name };
    }
  }
}

export async function scanForMaxCounter(year) {
  const root = await getRoot({ silent: true });
  if (!root) return null;
  let max = 0;
  let found = 0;
  try {
    for await (const { file } of listAllPDFs(root)) {
      const m = file.match(ID_REGEX);
      if (!m) continue;
      const fileYear = Number(m[1]);
      if (fileYear !== year) continue;
      const counter = Number(m[2]);
      if (counter > max) max = counter;
      found += 1;
    }
  } catch (e) {
    console.warn('[file-archive] scan failed:', e);
    return null;
  }
  return { max, found };
}

export async function syncCounterFromFolder() {
  const data = store.read();
  const year = data.settings.currentYear || new Date().getFullYear();
  const result = await scanForMaxCounter(year);
  if (!result) return { synced: false, reason: 'not-connected' };

  const localCounter = Number(data.settings.nextInvoiceCounter) || 1;
  // Tool's counter is the NEXT number to mint. Folder max is the highest
  // number already used. Next-counter must be > folder max.
  const reconciled = Math.max(localCounter, result.max + 1);

  if (reconciled !== localCounter) {
    store.update(d => { d.settings.nextInvoiceCounter = reconciled; });
  }

  return {
    synced: true,
    fsMax: result.max,
    fsFound: result.found,
    localBefore: localCounter,
    localAfter: reconciled,
    advanced: reconciled !== localCounter
  };
}

// ─── PDF render + write ──────────────────────────────────────────────────

async function renderHTMLToPDFBlob(html) {
  if (typeof window.html2pdf !== 'function') {
    throw new Error('html2pdf library is not loaded.');
  }
  // Mount HTML in an offscreen container so html2canvas can measure it.
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;left:-99999px;top:0;width:8.5in;background:#fff;';
  wrap.innerHTML = html;
  document.body.appendChild(wrap);
  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    const opt = {
      margin: 0,
      filename: 'invoice.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: wrap.scrollWidth
      },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    const blob = await window.html2pdf().set(opt).from(wrap).outputPdf('blob');
    return blob;
  } finally {
    wrap.remove();
  }
}

async function getOrCreateClientFolder(root, client) {
  const sub = clientSubfolder(client);
  return await root.getDirectoryHandle(sub, { create: true });
}

async function fileExists(dirHandle, filename) {
  try {
    await dirHandle.getFileHandle(filename, { create: false });
    return true;
  } catch (e) {
    return false; // NotFoundError → file doesn't exist (good)
  }
}

async function findCollidingNumber(dirHandle, invoiceIdPrefix) {
  // Returns true if any file in this folder starts with "FJ-YYYY-NNN-"
  const prefix = invoiceIdPrefix + '-';
  for await (const [name, handle] of dirHandle.entries()) {
    if (handle.kind === 'file' && name.startsWith(prefix)) return true;
  }
  return false;
}

export async function writeInvoicePDF(invoice, client, html) {
  const root = await getRoot({ silent: false });
  if (!root) {
    throw new Error('Invoices folder not connected. Open Settings → Connect Invoices folder.');
  }

  const folder = await getOrCreateClientFolder(root, client);

  // Collision seatbelt: if a file with this invoice number already exists
  // in this client folder, refuse — caller should bump the counter and retry.
  const colliding = await findCollidingNumber(folder, invoice.id);
  if (colliding) {
    throw new Error(`A file with invoice number ${invoice.id} already exists in this client's folder. Pick a higher number and try again.`);
  }

  const filename = buildInvoiceFilename(invoice, client);
  const fileHandle = await folder.getFileHandle(filename, { create: true });
  const writable = await fileHandle.createWritable();
  const blob = await renderHTMLToPDFBlob(html);
  await writable.write(blob);
  await writable.close();

  return {
    folder: clientSubfolder(client),
    filename,
    bytes: blob.size
  };
}
