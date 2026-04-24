import { store } from './storage.js';
import { invoiceTotal } from './models.js';

function fmt(n) { return `$${Number(n).toFixed(2)}`; }

function lineDiscount(li) {
  return li.presetAmount ? Math.max(0, Number(li.presetAmount) - Number(li.amount || 0)) : 0;
}

function buildInvoiceHTML(invoice, client, settings) {
  const total = invoiceTotal(invoice.lineItems);
  const discount = (invoice.lineItems || []).reduce((s, li) => s + lineDiscount(li), 0);
  const subtotal = total + discount;

  const clientBlock = client ? `
    <div style="font-size:16px;font-weight:700;margin-top:8px;">${client.name}</div>
    ${client.contact ? `<div style="font-size:13px;margin-top:2px;">${client.contact}</div>` : ''}
    ${client.email ? `<div style="font-size:13px;color:#64748B;">${client.email}</div>` : ''}
    ${client.phone ? `<div style="font-size:13px;color:#64748B;">${client.phone}</div>` : ''}
  ` : `<div style="color:#94A3B8;">(client deleted)</div>`;

  const lineRows = (invoice.lineItems || []).map(li => {
    const d = lineDiscount(li);
    if (d > 0) {
      return `
        <tr>
          <td style="padding:14px 12px;border-bottom:1px solid #E2E8F0;font-size:14px;">${li.description}</td>
          <td style="padding:14px 12px;border-bottom:1px solid #E2E8F0;text-align:right;font-size:14px;font-weight:600;">${fmt(li.presetAmount)}</td>
        </tr>
        <tr>
          <td style="padding:6px 12px 10px 28px;border-bottom:1px solid #E2E8F0;font-size:12px;color:#16A34A;">Discount</td>
          <td style="padding:6px 12px 10px 12px;border-bottom:1px solid #E2E8F0;text-align:right;font-size:12px;color:#16A34A;">-${fmt(d)}</td>
        </tr>`;
    }
    return `
      <tr>
        <td style="padding:14px 12px;border-bottom:1px solid #E2E8F0;font-size:14px;">${li.description}</td>
        <td style="padding:14px 12px;border-bottom:1px solid #E2E8F0;text-align:right;font-size:14px;font-weight:600;">${fmt(li.amount)}</td>
      </tr>`;
  }).join('');

  const paymentLine = client?.paymentMethod === 'cash'
    ? `Cash accepted at our next meeting.`
    : client?.paymentMethod === 'both'
      ? `E-transfer to <strong>${settings.businessEmail}</strong> &middot; Cash accepted in person.`
      : `E-transfer to <strong>${settings.businessEmail}</strong>`;

  return `
  <div class="fj-invoice" style="width:8.5in;padding:0.55in 0.6in;background:#ffffff;color:#0B1A2F;font-family:'Plus Jakarta Sans',system-ui,sans-serif;box-sizing:border-box;position:relative;">

    <!-- Header -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #0B1A2F;padding-bottom:18px;margin-bottom:28px;">
      <div>
        <div style="font-size:28px;font-weight:800;letter-spacing:-.02em;line-height:1;">
          <span style="color:#0B1A2F;">{FJ}</span>
          <span style="color:#C9A24A;">Media</span>
        </div>
        <div style="font-size:10px;color:#64748B;margin-top:8px;letter-spacing:.22em;font-family:'Space Mono',monospace;">FJMEDIA.CA &middot; WINNIPEG, MB</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:26px;font-weight:800;letter-spacing:-.02em;line-height:1;">INVOICE</div>
        <div style="font-size:13px;font-family:'Space Mono',monospace;color:#C9A24A;margin-top:6px;letter-spacing:.08em;">${invoice.id}</div>
      </div>
    </div>

    <!-- Meta -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
      <tr>
        <td style="width:50%;vertical-align:top;padding-right:12px;">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:.22em;color:#64748B;font-family:'Space Mono',monospace;">BILL TO</div>
          ${clientBlock}
        </td>
        <td style="width:50%;vertical-align:top;padding-left:12px;">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:.22em;color:#64748B;font-family:'Space Mono',monospace;">DETAILS</div>
          <table style="margin-top:8px;border-collapse:collapse;font-size:13px;">
            <tr><td style="color:#64748B;padding-right:16px;padding-bottom:3px;">Issue date</td><td style="padding-bottom:3px;">${invoice.issueDate}</td></tr>
            <tr><td style="color:#64748B;padding-right:16px;padding-bottom:3px;">Due date</td><td style="padding-bottom:3px;font-weight:600;">${invoice.dueDate}</td></tr>
            <tr><td style="color:#64748B;padding-right:16px;padding-bottom:3px;">From</td><td style="padding-bottom:3px;">${settings.businessName || 'FJMedia'}</td></tr>
            <tr><td style="color:#64748B;padding-right:16px;">Email</td><td>${settings.businessEmail}</td></tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Line items -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <thead>
        <tr style="background:#0B1A2F;color:#fff;">
          <th style="padding:10px 12px;text-align:left;font-size:10px;letter-spacing:.22em;font-family:'Space Mono',monospace;font-weight:400;">DESCRIPTION</th>
          <th style="padding:10px 12px;text-align:right;font-size:10px;letter-spacing:.22em;font-family:'Space Mono',monospace;font-weight:400;">AMOUNT</th>
        </tr>
      </thead>
      <tbody>
        ${lineRows || `<tr><td colspan="2" style="padding:20px;text-align:center;color:#94A3B8;">No line items.</td></tr>`}
      </tbody>
    </table>

    <!-- Totals -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
      <tr>
        <td style="width:55%;"></td>
        <td style="width:45%;">
          <table style="width:100%;border-collapse:collapse;">
            ${discount > 0 ? `
              <tr>
                <td style="padding:6px 12px;color:#64748B;font-size:13px;">Subtotal</td>
                <td style="padding:6px 12px;text-align:right;color:#64748B;font-size:13px;">${fmt(subtotal)}</td>
              </tr>
              <tr>
                <td style="padding:6px 12px;color:#16A34A;font-size:13px;">Discount</td>
                <td style="padding:6px 12px;text-align:right;color:#16A34A;font-size:13px;font-weight:600;">-${fmt(discount)}</td>
              </tr>
            ` : ''}
            <tr>
              <td style="padding:12px;border-top:2px solid #0B1A2F;font-size:16px;font-weight:800;letter-spacing:.06em;">TOTAL</td>
              <td style="padding:12px;border-top:2px solid #0B1A2F;text-align:right;font-size:20px;font-weight:800;color:#C9A24A;">${fmt(total)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Payment -->
    <div style="background:#F8FAFC;border-left:4px solid #C9A24A;padding:14px 18px;margin-bottom:18px;">
      <div style="font-size:10px;text-transform:uppercase;letter-spacing:.22em;color:#64748B;font-family:'Space Mono',monospace;">PAYMENT</div>
      <div style="font-size:14px;margin-top:6px;">${paymentLine}</div>
    </div>

    ${invoice.notes ? `
      <div style="border:1px solid #E2E8F0;padding:14px 18px;margin-bottom:18px;border-radius:6px;">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:.22em;color:#64748B;font-family:'Space Mono',monospace;">NOTES</div>
        <div style="font-size:13px;margin-top:6px;line-height:1.5;">${invoice.notes}</div>
      </div>
    ` : ''}

    <!-- Footer -->
    <div style="margin-top:40px;padding-top:14px;border-top:1px solid #E2E8F0;display:flex;justify-content:space-between;font-size:11px;color:#64748B;font-family:'Space Mono',monospace;letter-spacing:.08em;">
      <div>FJMEDIA.CA &middot; THANK YOU.</div>
      <div>— JAMES DIAZ</div>
    </div>
  </div>`;
}

function openPrintWindow(invoice, client, settings, autoPrint = true) {
  const html = buildInvoiceHTML(invoice, client, settings);
  const w = window.open('', '_blank', 'width=900,height=1100');
  if (!w) { alert('Pop-up blocked — allow pop-ups for this page, then try again.'); return null; }
  w.document.write(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${invoice.id}</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    @page { size: letter; margin: 0; }
    html, body { margin: 0; padding: 0; background: #e2e8f0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .fj-invoice { margin: 24px auto; box-shadow: 0 4px 24px rgba(0,0,0,.15); }
    @media print {
      html, body { background: #ffffff; margin: 0; padding: 0; }
      .fj-invoice { box-shadow: none !important; margin: 0 !important; padding: 0.55in 0.6in !important; page-break-inside: avoid; page-break-after: avoid; }
    }
  </style>
</head>
<body>${html}</body>
</html>`);
  w.document.close();
  if (autoPrint) {
    const tryPrint = () => { try { w.focus(); w.print(); } catch (e) { /* user can Ctrl+P */ } };
    // Wait for fonts + layout; fall back if load event is delayed
    if (w.document.readyState === 'complete') setTimeout(tryPrint, 400);
    else w.addEventListener('load', () => setTimeout(tryPrint, 400));
  }
  return w;
}

export function downloadInvoicePDF(invoiceId) {
  const data = store.read();
  const inv = data.invoices.find(i => i.id === invoiceId);
  if (!inv) { alert('Invoice not found'); return; }
  const client = data.clients.find(c => c.id === inv.clientId);
  openPrintWindow(inv, client, data.settings, true);
}

export function previewInvoice(invoiceId) {
  const data = store.read();
  const inv = data.invoices.find(i => i.id === invoiceId);
  if (!inv) return;
  const client = data.clients.find(c => c.id === inv.clientId);
  openPrintWindow(inv, client, data.settings, false);
}

export function copyEmailPack(invoiceId) {
  const data = store.read();
  const inv = data.invoices.find(i => i.id === invoiceId);
  if (!inv) return;
  const client = data.clients.find(c => c.id === inv.clientId);
  const total = invoiceTotal(inv.lineItems);
  const greet = client?.contact || client?.name || 'there';
  const summary = (inv.lineItems || []).map(li => li.description).join(', ') || 'services rendered';

  const body = `Hi ${greet},

Attached is invoice ${inv.id} for ${summary}.

Total: ${fmt(total)}
Due: ${inv.dueDate}

Payment: E-transfer to ${data.settings.businessEmail}${client?.paymentMethod === 'cash' || client?.paymentMethod === 'both' ? ' (or cash at our next meeting)' : ''}.

I've also attached the FJMedia Service Overview so you have the full breakdown of what's included and what's ongoing.

Let me know if any questions.

— James
FJMedia · fjmedia.ca`;

  navigator.clipboard.writeText(body).then(() => {
    const msg = `Email body copied to clipboard.\n\nPrint dialog will open — choose "Save as PDF" and save as ${inv.id}.pdf.\n\nThen paste the email and attach:\n  1. ${inv.id}.pdf\n  2. FJMedia-Service-Overview.pdf\n     (FJDMedia Website\\docs\\service-overview\\)`;
    alert(msg);
    downloadInvoicePDF(invoiceId);
  }).catch(err => {
    alert('Could not copy to clipboard — here\'s the email body to copy manually:\n\n' + body);
  });
}
