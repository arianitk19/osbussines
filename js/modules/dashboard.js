/* ============================================================
   BIZOS · Paneli (Dashboard)
   Hero dinamik, statistika të ditës, shkurtore, vegla të
   ngjitura, aktiviteti i fundit dhe sugjerime inteligjente.
   ============================================================ */

import { esc, money, animateNumber, timeAgo, MONTHS_SQ, inMonth } from '../core/utils.js';
import { icon } from '../core/icons.js';
import { Store } from '../core/store.js';
import { Router, getModule } from '../core/router.js';

const greeting = () => {
  const h = new Date().getHours();
  if (h < 11) return 'Mirëmëngjes';
  if (h < 18) return 'Mirëdita';
  return 'Mirëmbrëma';
};

const todayStr = () => {
  const d = new Date();
  const days = ['E diel', 'E hënë', 'E martë', 'E mërkurë', 'E enjte', 'E premte', 'E shtunë'];
  return `${days[d.getDay()]}, ${d.getDate()} ${MONTHS_SQ[d.getMonth()]} ${d.getFullYear()}`;
};

/** Llogaritjet e ditës dhe muajit */
const stats = () => {
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth();
  const isToday = (dstr) => {
    const d = new Date(dstr);
    return d.getFullYear() === y && d.getMonth() === m && d.getDate() === now.getDate();
  };
  const income = Store.all('income');
  const expenses = Store.all('expenses');
  const invoices = Store.all('invoices');
  const tasks = Store.all('tasks');

  return {
    incomeToday: income.filter((x) => isToday(x.date)).reduce((s, x) => s + (x.amount || 0), 0),
    incomeMonth: income.filter((x) => inMonth(x.date, y, m)).reduce((s, x) => s + (x.amount || 0), 0),
    expensesMonth: expenses.filter((x) => inMonth(x.date, y, m)).reduce((s, x) => s + (x.amount || 0), 0),
    unpaid: invoices.filter((x) => x.status !== 'paid'),
    unpaidTotal: invoices.filter((x) => x.status !== 'paid').reduce((s, x) => s + (x.total || 0), 0),
    openTasks: tasks.filter((t) => !t.done),
    clients: Store.all('clients').length,
  };
};

/** Sugjerime inteligjente në bazë të gjendjes */
const suggestions = (s) => {
  const biz = Store.business;
  const out = [];
  if (!biz.name) {
    out.push({ icon: 'building', text: 'Plotëso profilin e biznesit — emri yt do të shfaqet në fatura e dokumente.', go: 'business' });
  }
  if (s.unpaid.length) {
    out.push({ icon: 'alert', text: `Ke ${s.unpaid.length} fatura të papaguara në vlerë ${money(s.unpaidTotal)}.`, go: 'invoices' });
  }
  if (s.openTasks.length) {
    out.push({ icon: 'checkSquare', text: `${s.openTasks.length} detyra presin të kryhen.`, go: 'tasks' });
  }
  const lowStock = Store.all('products').filter((p) => p.trackStock && (p.stock || 0) <= (p.minStock || 0) && p.minStock > 0);
  if (lowStock.length) {
    out.push({ icon: 'boxes', text: `${lowStock.length} produkte janë afër mbarimit të stokut.`, go: 'inventory' });
  }
  if (!out.length) {
    out.push({ icon: 'sparkles', text: 'Gjithçka nën kontroll. Vazhdo punën e mbarë!', go: 'reports' });
  }
  return out.slice(0, 3);
};

export const render = (container) => {
  const s = stats();
  const biz = Store.business;
  const activity = Store.all('activity').slice(0, 6);
  const pinned = (Store.settings.pinnedTools || [])
    .map((id) => getModule(id)).filter((m) => m && !m.soon);
  const shortcuts = ['invoices', 'clients', 'products', 'income', 'expenses', 'reports', 'tasks', 'documents']
    .map((id) => getModule(id)).filter(Boolean);

  const page = document.createElement('div');
  page.className = 'page';
  page.innerHTML = `
    <section class="hero">
      <div class="hero-date">${todayStr()}</div>
      <h1>${greeting()}${biz.name ? `, ${esc(biz.name)}` : ''} 👋</h1>
      <p>${biz.name
        ? 'Ja përmbledhja e biznesit tënd për sot.'
        : 'Mirë se erdhe në BIZOS — sistemi operativ i biznesit tënd. Falas, offline dhe gjithçka mbetet në pajisjen tënde.'}</p>
      <div class="hero-actions">
        <button class="btn btn-primary" data-go="invoices/new">${icon('plus')}<span>Faturë e re</span></button>
        ${biz.name
          ? `<button class="btn btn-ghost" data-go="reports">${icon('chart')}<span>Shiko raportet</span></button>`
          : `<button class="btn btn-ghost" data-go="business">${icon('building')}<span>Plotëso profilin</span></button>`}
      </div>
    </section>

    <div class="grid-stats">
      <div class="card stat-card">
        <span class="stat-label">${icon('euro')} Të hyrat sot</span>
        <span class="stat-value" data-stat="incomeToday">0</span>
        <span class="stat-sub">nga arka dhe faturat</span>
      </div>
      <div class="card stat-card">
        <span class="stat-label">${icon('trendUp')} Të hyrat ${MONTHS_SQ[new Date().getMonth()].toLowerCase()}</span>
        <span class="stat-value" data-stat="incomeMonth">0</span>
        <span class="stat-sub">këtë muaj</span>
      </div>
      <div class="card stat-card">
        <span class="stat-label">${icon('trendDown')} Shpenzimet</span>
        <span class="stat-value" data-stat="expensesMonth">0</span>
        <span class="stat-sub">këtë muaj</span>
      </div>
      <div class="card stat-card">
        <span class="stat-label">${icon('invoice')} Pa paguar</span>
        <span class="stat-value">${s.unpaid.length}</span>
        <span class="stat-sub">${money(s.unpaidTotal)} në pritje</span>
      </div>
    </div>

    <div class="section-head"><h2>Sugjerime</h2></div>
    <div class="list">
      ${suggestions(s).map((sg, i) => `
        <div class="list-item clickable" data-go="${sg.go}" style="animation-delay:${i * 40}ms">
          <div class="avatar">${icon(sg.icon)}</div>
          <div class="li-main"><div class="li-title" style="font-size:var(--text-sm);font-weight:550">${esc(sg.text)}</div></div>
          ${icon('chevronRight', 'faint')}
        </div>`).join('')}
    </div>

    <div class="section-head"><h2>Shkurtoret</h2></div>
    <div class="grid-shortcuts">
      ${shortcuts.map((m) => `
        <button class="shortcut" data-go="${m.id}">${icon(m.icon)}<span>${esc(m.title)}</span></button>`).join('')}
    </div>

    <div class="grid-2" style="margin-top:var(--s-6)">
      <div>
        <div class="section-head" style="margin-top:0"><h2>Veglat e ngjitura</h2></div>
        <div class="grid-shortcuts">
          ${pinned.map((m) => `
            <button class="shortcut" data-go="${m.id}">${icon(m.icon)}<span>${esc(m.title)}</span></button>`).join('')}
        </div>
      </div>
      <div>
        <div class="section-head" style="margin-top:0"><h2>Aktiviteti i fundit</h2></div>
        ${activity.length ? `<div class="card" style="padding:8px 4px">
          ${activity.map((a) => `
            <div style="display:flex;align-items:center;gap:12px;padding:9px 14px">
              <span class="dot" style="color:var(--accent)"></span>
              <span class="truncate" style="flex:1;font-size:var(--text-sm)">${esc(a.text)}</span>
              <span class="faint" style="font-size:var(--text-xs);flex:none">${timeAgo(a.at)}</span>
            </div>`).join('')}
        </div>` : `<div class="card" style="text-align:center;color:var(--ink-3);font-size:var(--text-sm);padding:28px">
          Aktiviteti yt do të shfaqet këtu sapo të fillosh punën.
        </div>`}
      </div>
    </div>`;

  container.appendChild(page);

  // Navigim i deleguar
  page.addEventListener('click', (e) => {
    const target = e.target.closest('[data-go]');
    if (target) Router.go(...target.dataset.go.split('/'));
  });

  // Numra të animuar
  animateNumber(page.querySelector('[data-stat="incomeToday"]'), s.incomeToday, money);
  animateNumber(page.querySelector('[data-stat="incomeMonth"]'), s.incomeMonth, money);
  animateNumber(page.querySelector('[data-stat="expensesMonth"]'), s.expensesMonth, money);
};
