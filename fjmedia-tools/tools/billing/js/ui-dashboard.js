import { store } from './storage.js';
import { invoiceTotal, invoiceStatus, todayISO, daysBetween } from './models.js';

function fmt(n) { return `$${Number(n).toFixed(2)}`; }

function render() {
  const panel = document.querySelector('[data-panel="dashboard"]');
  const data = store.read();
  const today = todayISO();

  let outstanding = 0, overdue = 0, dueThisWeek = 0, mtdReceived = 0;
  const upcoming = [];
  const overdueList = [];

  const thisMonth = today.slice(0, 7);

  data.invoices.forEach(inv => {
    const total = invoiceTotal(inv.lineItems);
    const status = invoiceStatus(inv, today);
    if (status === 'sent' || status === 'overdue') {
      outstanding += total;
      const days = daysBetween(today, inv.dueDate);
      if (status === 'overdue') {
        overdue += total;
        overdueList.push({ inv, client: data.clients.find(c => c.id === inv.clientId), total, days });
      } else if (days <= 7) {
        dueThisWeek += total;
        upcoming.push({ inv, client: data.clients.find(c => c.id === inv.clientId), total, days });
      } else {
        upcoming.push({ inv, client: data.clients.find(c => c.id === inv.clientId), total, days });
      }
    }
  });

  data.payments.forEach(p => {
    if ((p.date || '').startsWith(thisMonth)) mtdReceived += Number(p.amount);
  });

  upcoming.sort((a, b) => a.inv.dueDate.localeCompare(b.inv.dueDate));
  overdueList.sort((a, b) => a.inv.dueDate.localeCompare(b.inv.dueDate));

  panel.innerHTML = `
    <div class="eyebrow">At a glance</div>
    <h2 class="panel-h">Dashboard</h2>

    <div class="stat-grid">
      <div class="stat-card">
        <div class="lbl">Outstanding</div>
        <div class="val">${fmt(outstanding)}</div>
      </div>
      <div class="stat-card">
        <div class="lbl">Due this week</div>
        <div class="val">${fmt(dueThisWeek)}</div>
      </div>
      <div class="stat-card ${overdue > 0 ? 'alert' : ''}">
        <div class="lbl">Overdue</div>
        <div class="val">${fmt(overdue)}</div>
      </div>
      <div class="stat-card">
        <div class="lbl">MTD received</div>
        <div class="val">${fmt(mtdReceived)}</div>
      </div>
    </div>

    ${overdueList.length > 0 ? `
      <div class="card alert">
        <h3>Overdue</h3>
        <ul class="clean">
          ${overdueList.map(x => `
            <li>
              <span>${x.client?.name || '—'} · <span style="color:var(--muted);font-family:'Space Mono',monospace;font-size:0.82rem;">${x.inv.id}</span></span>
              <span class="money-pos">${fmt(x.total)} <span style="color:var(--danger);font-size:0.78rem;">· ${Math.abs(x.days)} days late</span></span>
            </li>`).join('')}
        </ul>
      </div>` : ''}

    <div class="card">
      <h3>Upcoming (next 5)</h3>
      ${upcoming.length === 0
        ? `<div style="color:var(--muted);font-size:0.88rem;">Nothing upcoming.</div>`
        : `<ul class="clean">${upcoming.slice(0, 5).map(x => `
            <li>
              <span>${x.client?.name || '—'} · <span style="color:var(--muted);font-family:'Space Mono',monospace;font-size:0.82rem;">${x.inv.id}</span></span>
              <span>${fmt(x.total)} <span style="color:var(--muted);font-size:0.78rem;">· due ${x.inv.dueDate} ${x.days === 0 ? '(today)' : `(in ${x.days}d)`}</span></span>
            </li>`).join('')}</ul>`
      }
    </div>
  `;
}

export function initDashboard() { render(); }
export { render as renderDashboard };
