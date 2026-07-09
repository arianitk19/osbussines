/* ============================================================
   BIZOS · Të hyrat
   ============================================================ */

import { esc, money, fmtDateShort, todayISO, inMonth } from '../core/utils.js';
import { makeCrud } from '../core/crud.js';

const SOURCES = ['Shitje', 'Shërbime', 'Fatura', 'Tjetër'];

const crud = makeCrud({
  coll: 'income',
  title: 'Të hyrat',
  subtitle: 'Çdo hyrje parash e biznesit',
  iconName: 'trendUp',
  itemLabel: 'të hyrë',
  emptyTitle: 'Ende pa të hyra',
  emptyText: 'Regjistro të hyrat ditore — shfaqen në panel dhe raporte.',
  searchKeys: ['description', 'source'],
  fields: [
    { key: 'description', label: 'Përshkrimi', required: true, span2: true, placeholder: 'p.sh. Shitjet e ditës' },
    { key: 'amount', label: 'Shuma (€)', type: 'number', required: true, min: 0 },
    { key: 'date', label: 'Data', type: 'date', required: true },
    { key: 'source', label: 'Burimi', type: 'select', options: SOURCES },
    { key: 'method', label: 'Mënyra e pagesës', type: 'select', options: [['kesh', 'Kesh'], ['banke', 'Bankë'], ['karte', 'Kartë']] },
    { key: 'note', label: 'Shënim', type: 'textarea', span2: true },
  ],
  defaults: () => ({ date: todayISO(), method: 'kesh', source: 'Shitje' }),
  filters: [
    { id: 'month', label: 'Ky muaj', fn: (x) => inMonth(x.date, new Date().getFullYear(), new Date().getMonth()) },
  ],
  kpis: (items) => {
    const now = new Date();
    const monthTotal = items.filter((x) => inMonth(x.date, now.getFullYear(), now.getMonth()))
      .reduce((s, x) => s + (x.amount || 0), 0);
    return [
      { label: 'Gjithsej', value: money(items.reduce((s, x) => s + (x.amount || 0), 0)) },
      { label: 'Këtë muaj', value: money(monthTotal) },
      { label: 'Regjistrime', value: items.length },
      { label: 'Mesatarja', value: money(items.reduce((s, x) => s + (x.amount || 0), 0) / (items.length || 1)) },
    ];
  },
  csv: [
    ['Data', (x) => fmtDateShort(x.date)],
    ['Përshkrimi', (x) => x.description],
    ['Burimi', (x) => x.source || ''],
    ['Shuma', (x) => x.amount ?? ''],
    ['Mënyra', (x) => x.method || ''],
  ],
  renderItem: (x) => ({
    title: esc(x.description),
    sub: [fmtDateShort(x.date), x.source].filter(Boolean).map(esc).join(' · '),
    end: `<div class="li-title mono text-success" style="font-size:var(--text-sm)">+${money(x.amount)}</div>`,
  }),
});

export const render = (container) => crud.render(container);
