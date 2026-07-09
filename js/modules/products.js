/* ============================================================
   BIZOS · Produktet
   ============================================================ */

import { esc, money, fmtNum } from '../core/utils.js';
import { makeCrud } from '../core/crud.js';

const crud = makeCrud({
  coll: 'products',
  title: 'Produktet',
  subtitle: 'Katalogu i produkteve me çmime dhe stok',
  iconName: 'package',
  itemLabel: 'produkt',
  emptyTitle: 'Ende pa produkte',
  emptyText: 'Shto produktet që shet — përdoren te faturat dhe inventari.',
  searchKeys: ['name', 'sku', 'category'],
  fields: [
    { key: 'name', label: 'Emri i produktit', required: true, span2: true, placeholder: 'p.sh. Kafe espresso 1kg' },
    { key: 'sku', label: 'Kodi / SKU', placeholder: 'P-001' },
    { key: 'category', label: 'Kategoria', placeholder: 'p.sh. Pije' },
    { key: 'price', label: 'Çmimi i shitjes (€)', type: 'number', required: true, min: 0 },
    { key: 'cost', label: 'Kosto (€)', type: 'number', min: 0, hint: 'Për llogaritjen e fitimit' },
    { key: 'unit', label: 'Njësia', type: 'select', options: [['copë', 'Copë'], ['kg', 'Kg'], ['litër', 'Litër'], ['m', 'Metër'], ['orë', 'Orë'], ['paketë', 'Paketë']] },
    { key: 'trackStock', label: 'Ndiq stokun?', type: 'select', options: [['po', 'Po'], ['jo', 'Jo']] },
    { key: 'stock', label: 'Stoku aktual', type: 'number', step: '1', min: 0 },
    { key: 'minStock', label: 'Stoku minimal', type: 'number', step: '1', min: 0, hint: 'Merr njoftim kur bie nën këtë nivel' },
  ],
  mapValues: (data) => ({ ...data, trackStock: data.trackStock === 'po' }),
  toForm: (x) => ({ ...x, trackStock: x.trackStock ? 'po' : 'jo' }),
  defaults: () => ({ unit: 'copë', trackStock: 'po', stock: 0, minStock: 0 }),
  filters: [
    { id: 'low', label: 'Stok i ulët', fn: (x) => x.trackStock && x.minStock > 0 && (x.stock || 0) <= x.minStock },
  ],
  kpis: (items) => [
    { label: 'Produkte', value: items.length },
    { label: 'Vlera e stokut', value: money(items.reduce((s, x) => s + (x.trackStock ? (x.stock || 0) * (x.cost || x.price || 0) : 0), 0)) },
    { label: 'Stok i ulët', value: items.filter((x) => x.trackStock && x.minStock > 0 && (x.stock || 0) <= x.minStock).length },
    { label: 'Kategori', value: new Set(items.map((x) => x.category).filter(Boolean)).size },
  ],
  csv: [
    ['Emri', (x) => x.name],
    ['SKU', (x) => x.sku || ''],
    ['Kategoria', (x) => x.category || ''],
    ['Çmimi', (x) => x.price ?? ''],
    ['Kosto', (x) => x.cost ?? ''],
    ['Njësia', (x) => x.unit || ''],
    ['Stoku', (x) => x.trackStock ? (x.stock ?? 0) : ''],
  ],
  renderItem: (x) => ({
    title: esc(x.name),
    sub: [x.sku, x.category].filter(Boolean).map(esc).join(' · '),
    end: `<div class="li-title mono" style="font-size:var(--text-sm)">${money(x.price)}</div>
          ${x.trackStock ? `<div class="li-sub">${fmtNum(x.stock || 0)} ${esc(x.unit || '')}</div>` : ''}`,
    badge: (x.trackStock && x.minStock > 0 && (x.stock || 0) <= x.minStock)
      ? '<span class="badge badge-warning"><span class="dot"></span>Stok i ulët</span>' : '',
  }),
});

export const render = (container) => crud.render(container);
