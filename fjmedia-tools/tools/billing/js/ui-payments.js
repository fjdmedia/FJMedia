import { store } from './storage.js';
import { todayISO } from './models.js';

function pid() { return 'p_' + Math.random().toString(36).slice(2, 10); }

function render() {
  const panel = document.querySelector('[data-panel="payments"]');
  const data = store.read();

  panel.innerHTML = `
    <div class="eyebrow">Money in the door</div>
    <h2 class="panel-h">Payments</h2>
    <table class="fj-table">
      <thead>
        <tr><th>Date</th><th>Invoice</th><th>Client</th><th>Amount</th><th>Method</th><th>Reference</th><th></th></tr>
      </thead>
      <tbody>
        ${data.payments.length === 0
          ? `<tr class="empty-row"><td colspan="7">No payments logged yet. Go to Invoices → "Log Payment" on a sent invoice.</td></tr>`
          : data.payments.slice().sort((a,b) => b.date.localeCompare(a.date)).map(p => {
              const inv = data.invoices.find(i => i.id === p.invoiceId);
              const client = inv && data.clients.find(c => c.id === inv.clientId);
              return `
                <tr>
                  <td style="color:var(--muted);">${p.date}</td>
                  <td style="font-family:'Space Mono',monospace;font-size:0.8rem;color:var(--gold);">${p.invoiceId}</td>
                  <td>${client?.name || '—'}</td>
                  <td class="money-pos">$${Number(p.amount).toFixed(2)}</td>
                  <td style="color:var(--muted);">${p.method}</td>
                  <td style="color:var(--muted);font-family:'Space Mono',monospace;font-size:0.78rem;">${p.reference || ''}</td>
                  <td class="row-actions"><button data-del="${p.id}" class="a-del">Delete</button></td>
                </tr>
              `;
            }).join('')
        }
      </tbody>
    </table>
  `;

  panel.querySelectorAll('[data-del]').forEach(btn => {
    btn.onclick = () => {
      if (!confirm('Delete this payment record? (This will NOT unmark the invoice as paid automatically.)')) return;
      const id = btn.dataset.del;
      store.update(d => { d.payments = d.payments.filter(p => p.id !== id); });
      render();
    };
  });
}

export function logPaymentDialog(invoiceId, onSaved) {
  const data = store.read();
  const inv = data.invoices.find(i => i.id === invoiceId);
  if (!inv) return;
  const client = data.clients.find(c => c.id === inv.clientId);
  const suggested = (inv.lineItems || []).reduce((a, li) => a + Number(li.amount || 0), 0);

  const amount = prompt(`Payment amount for ${inv.id} (${client?.name || ''}):`, suggested.toFixed(2));
  if (amount === null) return;
  const method = prompt('Method? (cash / e-transfer)', client?.paymentMethod === 'cash' ? 'cash' : 'e-transfer');
  if (method === null) return;
  const reference = prompt('Reference # (e-transfer confirmation, optional):', '') || '';
  const date = prompt('Date received (YYYY-MM-DD):', todayISO()) || todayISO();

  store.update(d => {
    d.payments.push({ id: pid(), invoiceId, date, amount: parseFloat(amount), method, reference });
    const target = d.invoices.find(i => i.id === invoiceId);
    if (target) target.paidAt = date;
  });

  if (onSaved) onSaved();
}

export function initPayments() { render(); }
export { render as renderPayments };
