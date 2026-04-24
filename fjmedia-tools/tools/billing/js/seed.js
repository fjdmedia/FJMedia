import { store } from './storage.js';

const SEED_CLIENTS = [
  {
    id: 'c_sugarshai',
    name: 'Sugar & Shai',
    contact: 'Shai',
    email: '',
    phone: '',
    billingType: 'monthly',
    defaultRate: 0,
    paymentMethod: 'e-transfer',
    startDate: '',
    notes: 'sugarandshaicookies.com — monthly retainer',
    status: 'active'
  },
  {
    id: 'c_royalkings',
    name: 'Royal Kings Auto Care',
    contact: '',
    email: '',
    phone: '',
    billingType: 'monthly',
    defaultRate: 0,
    paymentMethod: 'e-transfer',
    startDate: '',
    notes: 'fjdmedia.github.io/royal-kings-auto-care — monthly retainer',
    status: 'active'
  },
  {
    id: 'c_diegoandrea',
    name: 'Diego & Andrea',
    contact: '',
    email: '',
    phone: '',
    billingType: 'one-time',
    defaultRate: 0,
    paymentMethod: 'e-transfer',
    startDate: '',
    notes: 'Event project — completed. Keep for historical records.',
    status: 'active'
  },
  {
    id: 'c_inflatabledec',
    name: 'Inflatable Decorations',
    contact: '',
    email: '',
    phone: '',
    billingType: 'custom',
    defaultRate: 0,
    paymentMethod: 'e-transfer',
    startDate: '',
    notes: 'Winnipeg balloon decor — billing TBD, pending direction + bundle pick',
    status: 'active'
  },
  {
    id: 'c_lindaquach',
    name: 'Linda Quach',
    contact: 'Linda',
    email: '',
    phone: '',
    billingType: 'one-time',
    defaultRate: 0,
    paymentMethod: 'e-transfer',
    startDate: '',
    notes: 'Password-gated site — pending email + photo',
    status: 'active'
  }
];

export function seedIfEmpty() {
  const data = store.read();
  if (data.clients.length > 0) return;
  store.update(d => { d.clients = SEED_CLIENTS; });
}
