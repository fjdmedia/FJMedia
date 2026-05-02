import { initClients } from './ui-clients.js';
import { initInvoices } from './ui-invoices.js';
import { initPayments } from './ui-payments.js';
import { initDashboard } from './ui-dashboard.js';
import { initSettings } from './ui-settings.js';
import { seedIfEmpty } from './seed.js';
import { syncCounterFromFolder } from './file-archive.js';

seedIfEmpty();

// Silent boot scan: if the Invoices folder is already connected from a
// previous session AND the user previously granted persistent permission,
// reconcile the localStorage counter with what's on disk. Folder is the
// source of truth — localStorage is a cache. Won't prompt or alert; if
// permission needs re-granting it just no-ops until the user clicks
// "Re-scan" or saves an invoice (both of which can request it via gesture).
syncCounterFromFolder().then(result => {
  if (result?.synced && result.advanced) {
    console.info(`[file-archive] counter synced from folder: ${result.localBefore} → ${result.localAfter} (max found: FJ-${new Date().getFullYear()}-${String(result.fsMax).padStart(3,'0')})`);
  }
}).catch(e => console.warn('[file-archive] boot sync skipped:', e));

const tabs = document.querySelectorAll('[data-tab]');
const panels = document.querySelectorAll('[data-panel]');

function showTab(name) {
  tabs.forEach(b => b.classList.toggle('active', b.dataset.tab === name));
  panels.forEach(p => (p.hidden = p.dataset.panel !== name));
  if (name === 'dashboard') initDashboard();
  if (name === 'clients') initClients();
  if (name === 'invoices') initInvoices();
  if (name === 'payments') initPayments();
  if (name === 'settings') initSettings();
}

tabs.forEach(btn => btn.addEventListener('click', () => showTab(btn.dataset.tab)));

initDashboard();
initClients();
initInvoices();
initPayments();
initSettings();
showTab('dashboard');
