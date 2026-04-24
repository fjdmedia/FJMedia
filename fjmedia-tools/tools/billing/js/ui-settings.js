import { store } from './storage.js';

function render() {
  const panel = document.querySelector('[data-panel="settings"]');
  const data = store.read();
  const counts = {
    clients: data.clients.length,
    invoices: data.invoices.length,
    payments: data.payments.length
  };

  panel.innerHTML = `
    <div class="eyebrow">The knobs</div>
    <h2 class="panel-h">Settings</h2>

    <div class="card">
      <h3>Business info</h3>
      <div class="form-grid">
        <input name="businessName" value="${data.settings.businessName}" placeholder="Business name" />
        <input name="businessEmail" value="${data.settings.businessEmail}" placeholder="Email" />
      </div>
      <button id="save-biz" class="btn btn-gold" style="margin-top:12px;">Save</button>
    </div>

    <div class="card">
      <h3>Backup</h3>
      <p style="color:var(--muted);font-size:0.88rem;margin:0 0 14px;">Currently storing <strong style="color:var(--cream);">${counts.clients}</strong> clients, <strong style="color:var(--cream);">${counts.invoices}</strong> invoices, <strong style="color:var(--cream);">${counts.payments}</strong> payments. Export to JSON weekly and save to OneDrive.</p>
      <button id="export-btn" class="btn btn-gold">Export JSON</button>
      <label class="btn btn-ghost" style="margin-left:8px;cursor:pointer;">
        Import JSON
        <input id="import-input" type="file" accept="application/json" style="display:none;" />
      </label>
    </div>

    <div class="card">
      <h3>Sign out</h3>
      <p style="color:var(--muted);font-size:0.88rem;margin:0 0 14px;">Lock this page — next visitor needs the access code again.</p>
      <button id="logout-btn" class="btn btn-ghost">Lock &amp; sign out</button>
    </div>

    <div class="danger-zone">
      <h3>Danger zone</h3>
      <p style="color:var(--muted);font-size:0.88rem;margin:0 0 14px;">Wipes all clients, invoices, and payments. Cannot be undone.</p>
      <button id="reset-btn" class="btn btn-danger">Reset all data</button>
    </div>
  `;

  panel.querySelector('#save-biz').onclick = () => {
    const name = panel.querySelector('[name="businessName"]').value;
    const email = panel.querySelector('[name="businessEmail"]').value;
    store.update(d => { d.settings.businessName = name; d.settings.businessEmail = email; });
    alert('Saved.');
  };

  panel.querySelector('#export-btn').onclick = () => {
    const blob = new Blob([JSON.stringify(store.read(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fjmedia-billing-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  panel.querySelector('#import-input').onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!confirm('This will REPLACE all current data. Continue?')) return;
    const text = await file.text();
    try {
      const parsed = JSON.parse(text);
      store.write(parsed);
      render();
      alert('Imported.');
    } catch (err) {
      alert('Invalid JSON file.');
    }
  };

  panel.querySelector('#logout-btn').onclick = () => {
    try {
      sessionStorage.removeItem('fjtools_k');
      localStorage.removeItem('fjtools_k');
    } catch(_) {}
    location.reload();
  };

  panel.querySelector('#reset-btn').onclick = () => {
    if (!confirm('Delete ALL clients, invoices, and payments? This cannot be undone.')) return;
    if (!confirm('Really really sure?')) return;
    store.reset();
    location.reload();
  };
}

export function initSettings() { render(); }
