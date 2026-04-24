import { describe, it, assertEqual } from './test-runner.js';
import {
  nextInvoiceNumber,
  invoiceTotal,
  invoiceStatus,
  todayISO,
  daysBetween
} from '../js/models.js';

describe('nextInvoiceNumber', () => {
  it('formats as FJ-YYYY-### with zero padding', () => {
    assertEqual(nextInvoiceNumber(2026, 1), 'FJ-2026-001');
    assertEqual(nextInvoiceNumber(2026, 42), 'FJ-2026-042');
    assertEqual(nextInvoiceNumber(2026, 999), 'FJ-2026-999');
  });
});

describe('invoiceTotal', () => {
  it('sums line items', () => {
    assertEqual(invoiceTotal([{ amount: 150 }, { amount: 50 }]), 200);
  });
  it('returns 0 for empty line items', () => {
    assertEqual(invoiceTotal([]), 0);
  });
  it('handles decimals', () => {
    assertEqual(invoiceTotal([{ amount: 99.99 }, { amount: 0.01 }]), 100);
  });
});

describe('invoiceStatus', () => {
  const mkInvoice = (o) => ({ issueDate: '2026-01-01', dueDate: '2026-01-15', sentAt: null, paidAt: null, ...o });
  it('returns "draft" if not sent', () => {
    assertEqual(invoiceStatus(mkInvoice({}), '2026-01-20'), 'draft');
  });
  it('returns "paid" if paidAt is set', () => {
    assertEqual(invoiceStatus(mkInvoice({ sentAt: '2026-01-05', paidAt: '2026-01-10' }), '2026-01-20'), 'paid');
  });
  it('returns "sent" if sent but not due yet', () => {
    assertEqual(invoiceStatus(mkInvoice({ sentAt: '2026-01-05' }), '2026-01-10'), 'sent');
  });
  it('returns "overdue" if sent, unpaid, past due date', () => {
    assertEqual(invoiceStatus(mkInvoice({ sentAt: '2026-01-05' }), '2026-01-20'), 'overdue');
  });
});

describe('daysBetween', () => {
  it('returns integer days between two ISO dates', () => {
    assertEqual(daysBetween('2026-01-01', '2026-01-08'), 7);
    assertEqual(daysBetween('2026-01-10', '2026-01-05'), -5);
  });
});

describe('todayISO', () => {
  it('returns a YYYY-MM-DD string', () => {
    const today = todayISO();
    assertEqual(typeof today, 'string');
    assertEqual(/^\d{4}-\d{2}-\d{2}$/.test(today), true);
  });
});
