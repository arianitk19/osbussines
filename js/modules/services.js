/* ============================================================
   BIZOS · Shërbimet
   ============================================================ */

import { esc, money } from '../core/utils.js';
import { makeCrud } from '../core/crud.js';

const crud = makeCrud({
  coll: 'services',
  title: 'Shërbimet',
  subtitle: 'Shërbimet që ofron me çmime standarde',
  iconName: 'wrench',
  itemLabel: 'shërbim',
  emptyTitle: 'Ende pa shërbime',
  emptyText: 'Shto shërbimet që ofron — përdoren direkt te faturat.',
  searchKeys: ['name', 'category'],
  fields: [
    { key: 'name', label: 'Emri i shërbimit', required: true, span2: true, placeholder: 'p.sh. Ndërrim vaji' },
    { key: 'category', label: 'Kategoria', placeholder: 'p.sh. Mirëmbajtje' },
    { key: 'price', label: 'Çmimi (€)', type: 'number', required: true, min: 0 },
    { key: 'duration', label: 'Kohëzgjatja (min)', type: 'number', step: '5', min: 0 },
    { key: 'description', label: 'Përshkrimi', type: 'textarea', span2: true },
  ],
  kpis: (items) => [
    { label: 'Shërbime', value: items.length },
    { label: 'Çmimi mesatar', value: money(items.reduce((s, x) => s + (x.price || 0), 0) / (items.length || 1)) },
    { label: 'Kategori', value: new Set(items.map((x) => x.category).filter(Boolean)).size },
    { label: 'Më i shtrenjti', value: money(Math.max(0, ...items.map((x) => x.price || 0))) },
  ],
  csv: [
    ['Emri', (x) => x.name],
    ['Kategoria', (x) => x.category || ''],
    ['Çmimi', (x) => x.price ?? ''],
    ['Kohëzgjatja (min)', (x) => x.duration || ''],
  ],
  renderItem: (x) => ({
    title: esc(x.name),
    sub: [x.category, x.duration ? `${x.duration} min` : ''].filter(Boolean).map(esc).join(' · '),
    end: `<div class="li-title mono" style="font-size:var(--text-sm)">${money(x.price)}</div>`,
  }),
});

export const render = (container) => crud.render(container);
