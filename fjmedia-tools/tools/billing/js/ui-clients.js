import { store } from './storage.js';

function uid() {
  return 'c_' + Math.random().toString(36).slice(2, 10);
}

function render() {
  const panel = document.querySelector('[data-panel="clients"]');
  const data = store.read();

  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:16px;">
      <div>
        <div class="eyebrow">The roster</div>
        <h2 class="panel-h" style="margin:0;">Clients</h2>
      </div>
      <button id="add-client-btn" class="btn btn-gold">+ Add Client</button>
    </div>

    <div id="client-form" hidden class="inline-form">
      <div class="form-grid">
        <input name="name" placeholder="Business name" />
        <input name="contact" placeholder="Contact person" />
        <input name="email" placeholder="Email" />
        <input name="phone" placeholder="Phone" />
        <select name="billingType">
          <option value="monthly">Monthly retainer</option>
          <option value="one-time">One-time</option>
          <option value="custom">Custom</option>
        </select>
        <input name="defaultRate" type="number" step="0.01" placeholder="Default rate ($)" />
        <select name="paymentMethod">
          <option value="e-transfer">E-transfer</option>
          <option value="cash">Cash</option>
          <option value="both">Both</option>
        </select>
        <input name="startDate" type="date" />
        <textarea name="notes" placeholder="Notes" style="grid-column: span 2; min-height: 60px; resize: vertical;"></textarea>
      </div>
      <div style="margin-top:12px;display:flex;gap:8px;">
        <button id="save-client" class="btn btn-gold">Save</button>
        <button id="cancel-client" class="btn btn-ghost">Cancel</button>
      </div>
    </div>

    <table class="fj-table">
      <thead>
        <tr><th>Name</th><th>Type</th><th>Rate</th><th>Method</th><th>Status</th><th></th></tr>
      </thead>
      <tbody>
        ${data.clients.length === 0
          ? `<tr class="empty-row"><td colspan="6">No clients yet. Click "Add Client" above.</td></tr>`
          : data.clients.map(c => `
            <tr>
              <td style="font-weight:600;color:var(--cream);">${c.name}${c.contact ? `<div style="font-size:0.76rem;color:var(--muted);margin-top:2px;">${c.contact}</div>` : ''}</td>
              <td style="color:var(--muted);font-family:'Space Mono',monospace;font-size:0.78rem;letter-spacing:0.04em;">${c.billingType}</td>
              <td class="money-pos">$${(c.defaultRate || 0).toFixed(2)}</td>
              <td style="color:var(--muted);">${c.paymentMethod}</td>
              <td><span class="badge ${c.status === 'active' ? 'paid' : 'draft'}">${c.status || 'active'}</span></td>
              <td class="row-actions"><button data-del="${c.id}" class="a-del">Delete</button></td>
            </tr>
          `).join('')
        }
      </tbody>
    </table>
  `;

  const form = panel.querySelector('#client-form');
  panel.querySelector('#add-client-btn').onclick = () => { form.hidden = false; };
  panel.querySelector('#cancel-client').onclick = () => { form.hidden = true; };
  panel.querySelector('#save-client').onclick = () => {
    const f = (name) => form.querySelector(`[name="${name}"]`).value;
    const client = {
      id: uid(),
      name: f('name'),
      contact: f('contact'),
      email: f('email'),
      phone: f('phone'),
      billingType: f('billingType'),
      defaultRate: parseFloat(f('defaultRate')) || 0,
      paymentMethod: f('paymentMethod'),
      startDate: f('startDate'),
      notes: f('notes'),
      status: 'active'
    };
    if (!client.name) { alert('Name required'); return; }
    store.update(d => d.clients.push(client));
    render();
  };
  panel.querySelectorAll('[data-del]').forEach(btn => {
    btn.onclick = () => {
      if (!confirm('Delete this client?')) return;
      const id = btn.dataset.del;
      store.update(d => { d.clients = d.clients.filter(c => c.id !== id); });
      render();
    };
  });
}

export function initClients() { render(); }
export { render as renderClients };
