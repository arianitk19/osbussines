/* ============================================================
   BIZOS · Shpenzimet
   ============================================================ */

import { esc, money, fmtDateShort, todayISO, inMonth } from '../core/utils.js';
import { makeCrud } from '../core/crud.js';

const CATEGORIES = [
  'Qira', 'Furnizime', 'Paga', 'Komunali (rrymë/ujë)', 'Internet & telefon',
  'Transport & karburant', 'Marketing', 'Mirëmbajtje', 'Taksa & tatime', 'Tjetër',
];

const crud = makeCrud({
  coll: 'expenses',
  title: 'Shpenzimet',
  subtitle: 'Çdo dalje parash e biznesit',
  iconName: 'trendDown',
  itemLabel: 'shpenzim',
  emptyTitle: 'Ende pa shpenzime',
  emptyText: 'Regjistro shpenzimet për të parë fitimin real në raporte.',
  searchKeys: ['description', 'category', 'supplier'],
  fields: [
    { key: 'description', label: 'Përshkrimi', required: true, span2: true, placeholder: 'p.sh. Qiraja e lokalit — korrik' },
    { key: 'amount', label: 'Shuma (€)', type: 'number', required: true, min: 0 },
    { key: 'date', label: 'Data', type: 'date', required: true },
    { key: 'category', label: 'Kategoria', type: 'select', options: CATEGORIES },
    { key: 'method', label: 'Mënyra e pagesës', type: 'select', options: [['kesh', 'Kesh'], ['banke', 'Bankë'], ['karte', 'Kartë']] },
    { key: 'supplier', label: 'Furnitori', placeholder: 'opsionale' },
  ],
  defaults: () => ({ date: todayISO(), method: 'kesh', category: 'Tjetër' }),
  filters: [
    { id: 'month', label: 'Ky muaj', fn: (x) => inMonth(x.date, new Date().getFullYear(), new Date().getMonth()) },
  ],
  kpis: (items) => {
    const now = new Date();
    const monthTotal = items.filter((x) => inMonth(x.date, now.getFullYear(), now.getMonth()))
      .reduce((s, x) => s + (x.amount || 0), 0);
    const byCat = {};
    for (const x of items) byCat[x.category || 'Tjetër'] = (byCat[x.category || 'Tjetër'] || 0) + (x.amount || 0);
    const topCat = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
    return [
      { label: 'Gjithsej', value: money(items.reduce((s, x) => s + (x.amount || 0), 0)) },
      { label: 'Këtë muaj', value: money(monthTotal) },
      { label: 'Regjistrime', value: items.length },
      { label: 'Kategoria kryesore', value: topCat ? esc(topCat[0].split(' ')[0]) : '—' },
    ];
  },
  csv: [
    ['Data', (x) => fmtDateShort(x.date)],
    ['Përshkrimi', (x) => x.description],
    ['Kategoria', (x) => x.category || ''],
    ['Shuma', (x) => x.amount ?? ''],
    ['Mënyra', (x) => x.method || ''],
    ['Furnitori', (x) => x.supplier || ''],
  ],
  renderItem: (x) => ({
    title: esc(x.description),
    sub: [fmtDateShort(x.date), x.category].filter(Boolean).map(esc).join(' · '),
    end: `<div class="li-title mono text-danger" style="font-size:var(--text-sm)">−${money(x.amount)}</div>`,
  }),
});

export const render = (container) => crud.render(container);
