export function nextInvoiceNumber(year, counter) {
  return `FJ-${year}-${String(counter).padStart(3, '0')}`;
}

export function invoiceTotal(lineItems) {
  const sum = lineItems.reduce((acc, li) => acc + Number(li.amount || 0), 0);
  return Math.round(sum * 100) / 100;
}

export function invoiceStatus(invoice, referenceDateISO = todayISO()) {
  if (invoice.paidAt) return 'paid';
  if (!invoice.sentAt) return 'draft';
  if (referenceDateISO > invoice.dueDate) return 'overdue';
  return 'sent';
}

export function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function daysBetween(fromISO, toISO) {
  const ms = new Date(toISO) - new Date(fromISO);
  return Math.round(ms / 86400000);
}
