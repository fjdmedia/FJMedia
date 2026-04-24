import { initClients } from './ui-clients.js';
import { initInvoices } from './ui-invoices.js';
import { initPayments } from './ui-payments.js';
import { initDashboard } from './ui-dashboard.js';
import { initSettings } from './ui-settings.js';
import { seedIfEmpty } from './seed.js';

seedIfEmpty();

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
