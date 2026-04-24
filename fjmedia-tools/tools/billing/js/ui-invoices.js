import { store } from './storage.js';
import { nextInvoiceNumber, invoiceTotal, invoiceStatus, todayISO } from './models.js';
import { logPaymentDialog } from './ui-payments.js';
import { DEFAULT_PRESETS } from './presets.js';
import { downloadInvoicePDF, previewInvoice, copyEmailPack } from './ui-invoice-pdf.js';

function groupedPresets() {
  const groups = {};
  DEFAULT_PRESETS.forEach(p => {
    groups[p.group] = groups[p.group] || [];
    groups[p.group].push(p);
  });
  return groups;
}

function presetOptionsHTML(selectedLabel) {
  const groups = groupedPresets();
  let html = `<option value="">-- Pick a line item --</option>`;
  Object.entries(groups).forEach(([g, items]) => {
    html += `<optgroup label="${g}">`;
    items.forEach(p => {
      const sel = p.label === selectedLabel ? ' selected' : '';
      html += `<option value="${p.label}" data-amount="${p.amount}"${sel}>${p.label} — $${p.amount}</option>`;
    });
    html += `</optgroup>`;
  });
  html += `<option value="__custom__"${selectedLabel === '__custom__' ? ' selected' : ''}>Custom description…</option>`;
  return html;
}

function findPreset(label) {
  return DEFAULT_PRESETS.find(p => p.label === label) || null;
}

function lineDiscount(li) {
  if (!li.presetAmount) return 0;
  return Math.max(0, Number(li.presetAmount) - Number(li.amount || 0));
}

function invoiceTotalDiscount(inv) {
  return (inv.lineItems || []).reduce((sum, li) => sum + lineDiscount(li), 0);
}

function render() {
  const panel = document.querySelector('[data-panel="invoices"]');
  const data = store.read();
  const today = todayISO();

  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:16px;">
      <div>
        <div class="eyebrow">Send · track · get paid</div>
        <h2 class="panel-h" style="margin:0;">Invoices</h2>
      </div>
      <button id="add-inv-btn" class="btn btn-gold">+ New Invoice</button>
    </div>

    <div id="inv-form" hidden class="inline-form">
      <div class="form-grid">
        <select name="clientId">
          <option value="">Select client…</option>
          ${data.clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
        </select>
        <input name="issueDate" type="date" value="${today}" />
        <input name="dueDate" type="date" />
        <input name="notes" placeholder="Notes (optional)" />
      </div>

      <div style="margin-top:16px;">
        <div style="font-family:'Space Mono',monospace;font-size:10px;color:var(--muted);letter-spacing:0.22em;text-transform:uppercase;margin-bottom:8px;">Line items</div>
        <div id="line-items"></div>
        <button id="add-line" class="btn btn-ghost btn-sm" style="margin-top:8px;">+ Add line item</button>
      </div>

      <div style="margin-top:16px;display:flex;gap:8px;align-items:flex-start;">
        <button id="save-inv" class="btn btn-gold">Save Draft</button>
        <button id="cancel-inv" class="btn btn-ghost">Cancel</button>
        <div class="totals-box">
          <div class="row" id="inv-subtotal-row" hidden><span>Subtotal</span><span>$<span id="inv-subtotal">0.00</span></span></div>
          <div class="row disc" id="inv-discount-row" hidden><span>Discount</span><span>-$<span id="inv-discount">0.00</span></span></div>
          <div class="row total"><span>TOTAL</span><span class="amt">$<span id="inv-total">0.00</span></span></div>
        </div>
      </div>
    </div>

    <table class="fj-table">
      <thead>
        <tr><th>Invoice #</th><th>Client</th><th>Issued</th><th>Due</th><th>Total</th><th>Status</th><th></th></tr>
      </thead>
      <tbody>
        ${data.invoices.length === 0
          ? `<tr class="empty-row"><td colspan="7">No invoices yet. Hit "New Invoice" above.</td></tr>`
          : data.invoices.slice().reverse().map(inv => {
              const client = data.clients.find(c => c.id === inv.clientId);
              const status = invoiceStatus(inv, today);
              const discount = invoiceTotalDiscount(inv);
              return `
                <tr>
                  <td style="font-family:'Space Mono',monospace;font-size:0.8rem;color:var(--gold);letter-spacing:0.04em;">${inv.id}</td>
                  <td style="color:var(--cream);">${client?.name || '<span style="color:var(--muted);">(deleted)</span>'}</td>
                  <td style="color:var(--muted);">${inv.issueDate}</td>
                  <td style="color:var(--muted);">${inv.dueDate}</td>
                  <td>
                    <div class="money-pos">$${invoiceTotal(inv.lineItems).toFixed(2)}</div>
                    ${discount > 0 ? `<div class="money-disc">Discount -$${discount.toFixed(2)}</div>` : ''}
                  </td>
                  <td><span class="badge ${status}">${status}</span></td>
                  <td class="row-actions">
                    <button data-preview="${inv.id}" class="a-preview" title="Preview in new tab">Preview</button>
                    <button data-pdf="${inv.id}" class="a-pdf" title="Download branded PDF">PDF</button>
                    <button data-pack="${inv.id}" class="a-pack" title="Download PDF + copy email body">Email Pack</button>
                    ${status === 'draft' ? `<button data-send="${inv.id}" class="a-send">Mark Sent</button>` : ''}
                    ${(status === 'sent' || status === 'overdue') ? `<button data-paid="${inv.id}" class="a-paid">Log Payment</button>` : ''}
                    <button data-del="${inv.id}" class="a-del">Delete</button>
                  </td>
                </tr>
              `;
            }).join('')
        }
      </tbody>
    </table>
  `;

  const form = panel.querySelector('#inv-form');
  const lineItemsEl = panel.querySelector('#line-items');
  let lineItems = [];

  function renderLineItems() {
    lineItemsEl.innerHTML = lineItems.map((li, i) => {
      const isCustom = li.presetLabel === '__custom__' || (!li.presetLabel && li.description);
      const discount = lineDiscount(li);
      const overAmt = li.presetAmount && Number(li.amount) > Number(li.presetAmount) ? (Number(li.amount) - Number(li.presetAmount)) : 0;
      return `
        <div class="li-row" data-idx="${i}">
          <div>
            <select data-i="${i}" data-f="preset">
              ${presetOptionsHTML(li.presetLabel || '')}
            </select>
            ${isCustom ? `<input placeholder="Custom description" value="${li.description || ''}" data-i="${i}" data-f="description" style="margin-top:6px;width:100%;" />` : ''}
          </div>
          <div>
            <input type="number" step="0.01" placeholder="Amount" value="${li.amount || ''}" data-i="${i}" data-f="amount" style="width:100%;" />
            ${discount > 0 ? `<div class="li-hint disc">−$${discount.toFixed(2)} (was $${Number(li.presetAmount).toFixed(2)})</div>` : ''}
            ${overAmt > 0 ? `<div class="li-hint over">+$${overAmt.toFixed(2)} over preset</div>` : ''}
          </div>
          <button data-rm="${i}" class="a-del" style="background:transparent;border:none;color:var(--danger);cursor:pointer;font-size:1.2rem;">×</button>
        </div>
      `;
    }).join('');

    lineItemsEl.querySelectorAll('select[data-f="preset"]').forEach(sel => {
      sel.onchange = () => {
        const i = +sel.dataset.i;
        const val = sel.value;
        if (val === '__custom__') {
          lineItems[i] = { presetLabel: '__custom__', presetAmount: 0, description: '', amount: lineItems[i].amount || 0 };
        } else if (val === '') {
          lineItems[i] = { presetLabel: '', presetAmount: 0, description: '', amount: 0 };
        } else {
          const p = findPreset(val);
          lineItems[i] = { presetLabel: p.label, presetAmount: p.amount, description: p.label, amount: p.amount };
        }
        renderLineItems();
        updateTotals();
      };
    });

    lineItemsEl.querySelectorAll('input[data-f]').forEach(inp => {
      inp.oninput = () => {
        const i = +inp.dataset.i;
        const f = inp.dataset.f;
        lineItems[i][f] = f === 'amount' ? parseFloat(inp.value) || 0 : inp.value;
        updateTotals();
      };
      inp.onchange = () => { renderLineItems(); };
    });

    lineItemsEl.querySelectorAll('[data-rm]').forEach(btn => {
      btn.onclick = () => { lineItems.splice(+btn.dataset.rm, 1); renderLineItems(); updateTotals(); };
    });
  }

  function updateTotals() {
    const total = invoiceTotal(lineItems);
    const discount = lineItems.reduce((sum, li) => sum + lineDiscount(li), 0);
    const subtotal = total + discount;

    panel.querySelector('#inv-total').textContent = total.toFixed(2);
    panel.querySelector('#inv-subtotal').textContent = subtotal.toFixed(2);
    panel.querySelector('#inv-discount').textContent = discount.toFixed(2);
    panel.querySelector('#inv-subtotal-row').hidden = discount === 0;
    panel.querySelector('#inv-discount-row').hidden = discount === 0;
  }

  panel.querySelector('#add-inv-btn').onclick = () => {
    lineItems = [{ presetLabel: '', presetAmount: 0, description: '', amount: 0 }];
    renderLineItems();
    updateTotals();
    form.hidden = false;
    form.querySelector('[name="clientId"]').onchange = (e) => {
      const c = data.clients.find(x => x.id === e.target.value);
      if (c && c.defaultRate && lineItems.length && !lineItems[0].amount && !lineItems[0].presetLabel) {
        lineItems[0] = {
          presetLabel: '__custom__',
          presetAmount: 0,
          description: c.billingType === 'monthly' ? `Monthly retainer — ${c.name}` : `Project — ${c.name}`,
          amount: c.defaultRate
        };
        renderLineItems();
        updateTotals();
      }
    };
  };

  panel.querySelector('#add-line').onclick = () => {
    lineItems.push({ presetLabel: '', presetAmount: 0, description: '', amount: 0 });
    renderLineItems();
  };

  panel.querySelector('#cancel-inv').onclick = () => { form.hidden = true; };

  panel.querySelector('#save-inv').onclick = () => {
    const clientId = form.querySelector('[name="clientId"]').value;
    const issueDate = form.querySelector('[name="issueDate"]').value;
    const dueDate = form.querySelector('[name="dueDate"]').value;
    const notes = form.querySelector('[name="notes"]').value;
    if (!clientId || !issueDate || !dueDate) { alert('Client, issue date, and due date required'); return; }
    const validLines = lineItems.filter(li => li.amount && (li.description || li.presetLabel));
    if (validLines.length === 0) { alert('Add at least one line item with a description and amount'); return; }

    store.update(d => {
      const year = new Date(issueDate).getFullYear();
      if (d.settings.currentYear !== year) {
        d.settings.currentYear = year;
        d.settings.nextInvoiceCounter = 1;
      }
      const id = nextInvoiceNumber(year, d.settings.nextInvoiceCounter);
      d.settings.nextInvoiceCounter += 1;
      d.invoices.push({
        id, clientId, issueDate, dueDate, notes,
        lineItems: validLines.map(li => ({
          description: li.description || li.presetLabel,
          amount: li.amount,
          presetLabel: li.presetLabel || null,
          presetAmount: li.presetAmount || null
        })),
        sentAt: null, paidAt: null
      });
    });
    render();
  };

  panel.querySelectorAll('[data-send]').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.send;
      store.update(d => { const inv = d.invoices.find(i => i.id === id); if (inv) inv.sentAt = todayISO(); });
      render();
    };
  });

  panel.querySelectorAll('[data-paid]').forEach(btn => {
    btn.onclick = () => {
      logPaymentDialog(btn.dataset.paid, render);
    };
  });

  panel.querySelectorAll('[data-preview]').forEach(btn => {
    btn.onclick = () => previewInvoice(btn.dataset.preview);
  });

  panel.querySelectorAll('[data-pdf]').forEach(btn => {
    btn.onclick = () => downloadInvoicePDF(btn.dataset.pdf);
  });

  panel.querySelectorAll('[data-pack]').forEach(btn => {
    btn.onclick = () => copyEmailPack(btn.dataset.pack);
  });

  panel.querySelectorAll('[data-del]').forEach(btn => {
    btn.onclick = () => {
      if (!confirm('Delete this invoice?')) return;
      const id = btn.dataset.del;
      store.update(d => { d.invoices = d.invoices.filter(i => i.id !== id); });
      render();
    };
  });
}

export function initInvoices() { render(); }
export { render as renderInvoices };
