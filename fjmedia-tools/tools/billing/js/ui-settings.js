import { store } from './storage.js';
import {
  connectInvoicesFolder,
  disconnectInvoicesFolder,
  isConnected,
  isFSAccessSupported,
  syncCounterFromFolder
} from './file-archive.js';

async function render() {
  const panel = document.querySelector('[data-panel="settings"]');
  const data = store.read();
  const counts = {
    clients: data.clients.length,
    invoices: data.invoices.length,
    payments: data.payments.length
  };

  const fsSupported = isFSAccessSupported();
  const connected = fsSupported ? await isConnected() : false;
  const counterDisplay = `FJ-${data.settings.currentYear}-${String(data.settings.nextInvoiceCounter).padStart(3, '0')}`;

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
      <h3>PDF archive ${connected ? '<span class="badge paid" style="margin-left:6px;">Connected</span>' : (fsSupported ? '<span class="badge draft" style="margin-left:6px;">Not connected</span>' : '<span class="badge overdue" style="margin-left:6px;">Unsupported</span>')}</h3>
      ${!fsSupported ? `
        <p style="color:var(--muted);font-size:0.88rem;margin:0;">Your browser doesn't support the File System Access API. Use Chrome or Edge to enable one-click PDF archiving.</p>
      ` : `
        <p style="color:var(--muted);font-size:0.88rem;margin:0 0 12px;">
          ${connected
            ? `One-click PDF saving is on. Invoices write to <strong style="color:var(--cream);">&lt;your folder&gt;/&lt;Client Name&gt;/&lt;Invoice&#x2011;ID&gt;.pdf</strong>. Next invoice mints as <strong style="color:var(--gold);font-family:'Space Mono',monospace;">${counterDisplay}</strong>.`
            : `Pick a folder once (e.g. <code>OneDrive/FJDMedia/Invoices</code>) — every "PDF" click after that writes straight into the right client subfolder, named correctly, with collision protection.`}
        </p>
        ${connected
          ? `<button id="rescan-archive" class="btn btn-ghost btn-sm">Re-scan + sync counter</button>
             <button id="disconnect-archive" class="btn btn-ghost btn-sm" style="margin-left:6px;">Disconnect</button>
             <span id="rescan-result" style="margin-left:10px;font-family:'Space Mono',monospace;font-size:11px;color:var(--muted);"></span>`
          : `<button id="connect-archive" class="btn btn-gold">Connect Invoices folder</button>`
        }
      `}
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

  // ─── PDF archive controls ─────────────────────────────────────────────
  const connectBtn = panel.querySelector('#connect-archive');
  if (connectBtn) {
    connectBtn.onclick = async () => {
      try {
        await connectInvoicesFolder();
        const result = await syncCounterFromFolder();
        const msg = result?.synced && result.advanced
          ? `Connected. Found ${result.fsFound} existing PDFs — counter advanced to FJ-${store.read().settings.currentYear}-${String(result.localAfter).padStart(3,'0')}.`
          : `Connected. ${result?.fsFound || 0} existing PDFs found.`;
        alert(msg);
        await render();
      } catch (e) {
        if (e.name !== 'AbortError') alert('Could not connect folder: ' + (e.message || e));
      }
    };
  }

  const rescanBtn = panel.querySelector('#rescan-archive');
  if (rescanBtn) {
    rescanBtn.onclick = async () => {
      const out = panel.querySelector('#rescan-result');
      out.textContent = 'Scanning…';
      const result = await syncCounterFromFolder();
      if (!result?.synced) {
        out.textContent = 'Scan failed — try Disconnect → Connect again.';
        return;
      }
      out.textContent = result.advanced
        ? `Found ${result.fsFound} PDFs · counter ${result.localBefore} → ${result.localAfter}`
        : `Found ${result.fsFound} PDFs · counter unchanged (${result.localAfter})`;
    };
  }

  const disconnectBtn = panel.querySelector('#disconnect-archive');
  if (disconnectBtn) {
    disconnectBtn.onclick = async () => {
      if (!confirm('Disconnect the Invoices folder? PDFs won\'t auto-save until you reconnect.')) return;
      await disconnectInvoicesFolder();
      await render();
    };
  }
  // ──────────────────────────────────────────────────────────────────────

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
