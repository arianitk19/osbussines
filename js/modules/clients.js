/* ============================================================
   BIZOS · Klientët
   ============================================================ */

import { esc, initials, money } from '../core/utils.js';
import { makeCrud } from '../core/crud.js';
import { Store } from '../core/store.js';

const crud = makeCrud({
  coll: 'clients',
  title: 'Klientët',
  subtitle: 'Bizneset dhe personat me të cilët punon',
  iconName: 'users',
  itemLabel: 'klient',
  emptyTitle: 'Ende pa klientë',
  emptyText: 'Shto klientin e parë — do të shfaqet automatikisht kur krijon fatura.',
  searchKeys: ['name', 'phone', 'email', 'city', 'nui'],
  fields: [
    { key: 'name', label: 'Emri', required: true, placeholder: 'p.sh. Kompania ABC sh.p.k.', span2: true },
    { key: 'type', label: 'Lloji', type: 'select', options: [['biznes', 'Biznes'], ['individ', 'Individ']] },
    { key: 'nui', label: 'NUI / Nr. fiskal', placeholder: '8xxxxxxxx' },
    { key: 'phone', label: 'Telefoni', type: 'tel', placeholder: '+383 44 000 000' },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'info@kompania.com' },
    { key: 'city', label: 'Qyteti', placeholder: 'Prishtinë' },
    { key: 'address', label: 'Adresa', placeholder: 'Rr. ...' },
    { key: 'notes', label: 'Shënime', type: 'textarea', span2: true },
  ],
  filters: [
    { id: 'biznes', label: 'Biznese', fn: (x) => x.type === 'biznes' },
    { id: 'individ', label: 'Individë', fn: (x) => x.type === 'individ' },
  ],
  kpis: (items) => {
    const invoiced = (client) => Store.all('invoices')
      .filter((f) => f.clientId === client.id)
      .reduce((s, f) => s + (f.total || 0), 0);
    const top = [...items].sort((a, b) => invoiced(b) - invoiced(a))[0];
    return [
      { label: 'Klientë gjithsej', value: items.length },
      { label: 'Biznese', value: items.filter((x) => x.type === 'biznes').length },
      { label: 'Individë', value: items.filter((x) => x.type === 'individ').length },
      { label: 'Klienti kryesor', value: top ? esc(top.name.split(' ')[0]) : '—' },
    ];
  },
  csv: [
    ['Emri', (x) => x.name],
    ['Lloji', (x) => x.type || ''],
    ['NUI', (x) => x.nui || ''],
    ['Telefoni', (x) => x.phone || ''],
    ['Email', (x) => x.email || ''],
    ['Qyteti', (x) => x.city || ''],
    ['Adresa', (x) => x.address || ''],
  ],
  renderItem: (x) => {
    const total = Store.all('invoices')
      .filter((f) => f.clientId === x.id)
      .reduce((s, f) => s + (f.total || 0), 0);
    return {
      avatar: initials(x.name),
      title: esc(x.name),
      sub: [x.phone, x.city].filter(Boolean).map(esc).join(' · ') || (x.type === 'individ' ? 'Individ' : 'Biznes'),
      end: total ? `<div class="li-title mono" style="font-size:var(--text-sm)">${money(total)}</div><div class="li-sub">faturuar</div>` : '',
    };
  },
});

export const render = (container) => crud.render(container);
