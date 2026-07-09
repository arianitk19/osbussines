/* ============================================================
   BIZOS · Raportet
   Të hyra vs shpenzime, fitimi, grafik 6-mujor, klientët
   kryesorë dhe statusi i faturave — pa asnjë varësi të jashtme.
   ============================================================ */

import { esc, money, MONTHS_SQ, inMonth, initials } from '../core/utils.js';
import { icon } from '../core/icons.js';
import { Store } from '../core/store.js';
import { pageHead, emptyState } from '../core/ui.js';

const sum = (arr) => arr.reduce((s, x) => s + (x.amount ?? x.total ?? 0), 0);

export const render = (container) => {
  const now = new Date();
  let offset = 0; // 0 = muaji aktual, -1 = i kaluari…

  const page = document.createElement('div');
  page.className = 'page';
  container.appendChild(page);

  const draw = () => {
    const ref = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const y = ref.getFullYear(), m = ref.getMonth();

    const income = Store.all('income');
    const expenses = Store.all('expenses');
    const invoices = Store.all('invoices');
    const hasData = income.length || expenses.length || invoices.length;

    const incMonth = sum(income.filter((x) => inMonth(x.date, y, m)));
    const expMonth = sum(expenses.filter((x) => inMonth(x.date, y, m)));
    const profit = incMonth - expMonth;

    // Grafik: 6 muajt e fundit deri te muaji i zgjedhur
    const bars = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(y, m - i, 1);
      const inc = sum(income.filter((x) => inMonth(x.date, d.getFullYear(), d.getMonth())));
      const exp = sum(expenses.filter((x) => inMonth(x.date, d.getFullYear(), d.getMonth())));
      bars.push({ label: MONTHS_SQ[d.getMonth()].slice(0, 3), inc, exp });
    }
    const maxVal = Math.max(1, ...bars.flatMap((b) => [b.inc, b.exp]));

    // Klientët kryesorë sipas faturimit
    const byClient = {};
    for (const f of invoices) {
      const key = f.clientName || 'Pa emër';
      byClient[key] = (byClient[key] || 0) + (f.total || 0);
    }
    const topClients = Object.entries(byClient).sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Shpenzimet sipas kategorive (muaji i zgjedhur)
    const byCat = {};
    for (const x of expenses.filter((e) => inMonth(e.date, y, m))) {
      byCat[x.category || 'Tjetër'] = (byCat[x.category || 'Tjetër'] || 0) + (x.amount || 0);
    }
    const topCats = Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const paid = invoices.filter((f) => f.status === 'paid').length;

    page.innerHTML = `
      ${pageHead('Raportet', 'Fotografia financiare e biznesit tënd', `
        <div class="segmented" role="group" aria-label="Zgjidh muajin">
          <button data-nav="-1" aria-label="Muaji i kaluar">‹</button>
          <button class="active" style="pointer-events:none">${MONTHS_SQ[m]} ${y}</button>
          <button data-nav="1" ${offset >= 0 ? 'disabled style="opacity:.35"' : ''} aria-label="Muaji tjetër">›</button>
        </div>`)}
      ${!hasData ? emptyState('chart', 'Ende pa të dhëna',
        'Regjistro të hyra, shpenzime ose fatura — raportet ndërtohen vetvetiu.') : `
      <div class="grid-stats">
        <div class="card stat-card"><span class="stat-label">${icon('trendUp')} Të hyrat</span>
          <span class="stat-value text-success" style="font-size:var(--text-xl)">${money(incMonth)}</span></div>
        <div class="card stat-card"><span class="stat-label">${icon('trendDown')} Shpenzimet</span>
          <span class="stat-value text-danger" style="font-size:var(--text-xl)">${money(expMonth)}</span></div>
        <div class="card stat-card"><span class="stat-label">${icon('euro')} Fitimi</span>
          <span class="stat-value ${profit >= 0 ? 'text-success' : 'text-danger'}" style="font-size:var(--text-xl)">${money(profit)}</span></div>
        <div class="card stat-card"><span class="stat-label">${icon('invoice')} Fatura të paguara</span>
          <span class="stat-value" style="font-size:var(--text-xl)">${paid}/${invoices.length}</span></div>
      </div>

      <div class="card" style="margin-bottom:16px">
        <div class="card-title" style="margin-bottom:4px">Trendi 6-mujor</div>
        <p class="faint" style="font-size:var(--text-xs);margin-bottom:10px">
          <span class="badge badge-accent" style="margin-right:6px">Të hyra</span>
          <span class="badge badge-danger">Shpenzime</span>
        </p>
        <div class="barchart" role="img" aria-label="Grafiku i të hyrave dhe shpenzimeve për 6 muajt e fundit">
          ${bars.map((b) => `
            <div class="bar-col">
              <div style="display:flex;gap:3px;align-items:flex-end;height:100%;width:100%;justify-content:center">
                <div class="bar" style="height:${Math.round(b.inc / maxVal * 100)}%" title="Të hyra: ${money(b.inc)}"></div>
                <div class="bar neg" style="height:${Math.round(b.exp / maxVal * 100)}%" title="Shpenzime: ${money(b.exp)}"></div>
              </div>
              <span class="bar-label">${b.label}</span>
            </div>`).join('')}
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-title" style="margin-bottom:14px">Klientët kryesorë</div>
          ${topClients.length ? topClients.map(([name, total]) => `
            <div style="display:flex;align-items:center;gap:12px;padding:8px 0">
              <div class="avatar" style="width:34px;height:34px;font-size:12px">${esc(initials(name))}</div>
              <span class="truncate" style="flex:1;font-size:var(--text-sm);font-weight:550">${esc(name)}</span>
              <span class="mono" style="font-size:var(--text-sm)">${money(total)}</span>
            </div>`).join('')
          : '<p class="faint" style="font-size:var(--text-sm)">Krijo fatura për të parë klientët kryesorë.</p>'}
        </div>
        <div class="card">
          <div class="card-title" style="margin-bottom:14px">Shpenzimet sipas kategorive</div>
          ${topCats.length ? topCats.map(([cat, total]) => `
            <div style="padding:7px 0">
              <div style="display:flex;justify-content:space-between;font-size:var(--text-sm);margin-bottom:5px">
                <span class="truncate">${esc(cat)}</span>
                <span class="mono">${money(total)}</span>
              </div>
              <div class="progress"><span style="width:${Math.round(total / (expMonth || 1) * 100)}%"></span></div>
            </div>`).join('')
          : '<p class="faint" style="font-size:var(--text-sm)">Asnjë shpenzim këtë muaj.</p>'}
        </div>
      </div>`}`;

    page.querySelectorAll('[data-nav]').forEach((b) =>
      b.addEventListener('click', () => {
        offset = Math.min(0, offset + Number(b.dataset.nav));
        draw();
      }));
  };

  draw();
};
