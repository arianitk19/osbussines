/* ============================================================
   BIZOS · Faturat
   Lista + krijuesi i faturave me artikuj, TVSH (18/8/0),
   zbritje, statuse dhe printim profesional A4.
   ============================================================ */

import { $, esc, money, num, round2, fmtDate, fmtDateShort, todayISO, debounce } from '../core/utils.js';
import { icon } from '../core/icons.js';
import { Store } from '../core/store.js';
import { Router } from '../core/router.js';
import { Toast, Dialog, emptyState, pageHead, printDocument } from '../core/ui.js';

const STATUS = {
  draft: { label: 'Draft', badge: 'badge-neutral' },
  sent: { label: 'Dërguar', badge: 'badge-info' },
  paid: { label: 'Paguar', badge: 'badge-success' },
  overdue: { label: 'Vonesë', badge: 'badge-danger' },
};

/* ---------- Llogaritjet ---------- */

const calcTotals = (inv) => {
  const subtotal = round2(inv.lines.reduce((s, l) => s + num(l.qty) * num(l.price), 0));
  const discount = round2(subtotal * num(inv.discountPct) / 100);
  const base = subtotal - discount;
  const vat = round2(base * num(inv.vatRate) / 100);
  return { subtotal, discount, vat, total: round2(base + vat) };
};

/* ---------- Printimi ---------- */

const printInvoice = (inv) => {
  const biz = Store.business;
  const t = calcTotals(inv);
  printDocument(`
    <div class="doc-head">
      <div>
        <div class="doc-brand">${esc(biz.name || 'Biznesi im')}</div>
        <div style="font-size:11px;color:#555">
          ${[biz.address, biz.city].filter(Boolean).map(esc).join(', ')}<br>
          ${[biz.nui ? `NUI: ${esc(biz.nui)}` : '', biz.vatNo ? `Nr. TVSH: ${esc(biz.vatNo)}` : ''].filter(Boolean).join(' · ')}<br>
          ${[biz.phone, biz.email].filter(Boolean).map(esc).join(' · ')}
        </div>
      </div>
      <div class="doc-meta">
        <div style="font-size:18px;font-weight:800">FATURË</div>
        <div><strong>${esc(inv.number)}</strong></div>
        <div>Data: ${fmtDateShort(inv.date)}</div>
        ${inv.dueDate ? `<div>Afati: ${fmtDateShort(inv.dueDate)}</div>` : ''}
      </div>
    </div>
    <div class="doc-two-col">
      <div>
        <h4>Faturuar për</h4>
        <strong>${esc(inv.clientName || '—')}</strong><br>
        ${esc(inv.clientDetails || '')}
      </div>
    </div>
    <table class="doc-table">
      <thead><tr><th>#</th><th>Përshkrimi</th><th class="num">Sasia</th><th class="num">Çmimi</th><th class="num">Shuma</th></tr></thead>
      <tbody>
        ${inv.lines.map((l, i) => `<tr>
          <td>${i + 1}</td><td>${esc(l.name)}</td>
          <td class="num">${num(l.qty)}</td>
          <td class="num">${money(l.price)}</td>
          <td class="num">${money(num(l.qty) * num(l.price))}</td>
        </tr>`).join('')}
      </tbody>
    </table>
    <div class="doc-totals">
      <div class="row"><span>Nëntotali</span><span>${money(t.subtotal)}</span></div>
      ${t.discount ? `<div class="row"><span>Zbritja (${num(inv.discountPct)}%)</span><span>−${money(t.discount)}</span></div>` : ''}
      <div class="row"><span>TVSH (${num(inv.vatRate)}%)</span><span>${money(t.vat)}</span></div>
      <div class="row grand"><span>TOTALI</span><span>${money(t.total)}</span></div>
    </div>
    ${inv.note ? `<div class="doc-note"><strong>Shënim:</strong> ${esc(inv.note)}</div>` : ''}
    ${biz.iban ? `<div class="doc-note"><strong>Pagesa:</strong> ${esc(biz.bank || '')} · IBAN: ${esc(biz.iban)}</div>` : ''}
    <div class="doc-foot"><span>Faleminderit për besimin!</span><span>Gjeneruar me BIZOS</span></div>`);
};

/* ---------- Lista ---------- */

const renderList = (container) => {
  let query = '';
  let filter = 'all';
  const page = document.createElement('div');
  page.className = 'page';
  container.appendChild(page);

  const draw = () => {
    const all = Store.all('invoices');
    let items = all;
    if (filter !== 'all') items = items.filter((x) => x.status === filter);
    if (query) {
      const q = query.toLowerCase();
      items = items.filter((x) =>
        (x.number || '').toLowerCase().includes(q) || (x.clientName || '').toLowerCase().includes(q));
    }
    const unpaidTotal = all.filter((x) => x.status !== 'paid').reduce((s, x) => s + (x.total || 0), 0);
    const paidTotal = all.filter((x) => x.status === 'paid').reduce((s, x) => s + (x.total || 0), 0);

    page.innerHTML = `
      ${pageHead('Faturat', 'Krijo, dërgo dhe ndiq faturat e tua', `
        <button class="btn btn-primary" data-new>${icon('plus')}<span>Faturë e re</span></button>`)}
      ${all.length ? `<div class="grid-stats">
        <div class="card stat-card"><span class="stat-label">Fatura gjithsej</span><span class="stat-value" style="font-size:var(--text-xl)">${all.length}</span></div>
        <div class="card stat-card"><span class="stat-label">Të paguara</span><span class="stat-value" style="font-size:var(--text-xl)">${money(paidTotal)}</span></div>
        <div class="card stat-card"><span class="stat-label">Në pritje</span><span class="stat-value" style="font-size:var(--text-xl)">${money(unpaidTotal)}</span></div>
        <div class="card stat-card"><span class="stat-label">Këtë muaj</span><span class="stat-value" style="font-size:var(--text-xl)">${all.filter((x) => new Date(x.date).getMonth() === new Date().getMonth() && new Date(x.date).getFullYear() === new Date().getFullYear()).length}</span></div>
      </div>` : ''}
      <div class="toolbar">
        <div class="searchbar">${icon('search')}<input class="input" type="search" placeholder="Kërko numër ose klient…" value="${esc(query)}" aria-label="Kërko fatura"></div>
      </div>
      <div class="chip-row" style="margin-bottom:16px">
        <button class="chip ${filter === 'all' ? 'active' : ''}" data-filter="all">Të gjitha</button>
        ${Object.entries(STATUS).map(([k, v]) => `
          <button class="chip ${filter === k ? 'active' : ''}" data-filter="${k}">${v.label}</button>`).join('')}
      </div>
      ${items.length ? `<div class="list">
        ${items.map((inv, i) => `
          <div class="list-item clickable" data-id="${inv.id}" style="animation-delay:${Math.min(i * 22, 260)}ms">
            <div class="avatar">${icon('invoice')}</div>
            <div class="li-main">
              <div class="li-title">${esc(inv.number)}</div>
              <div class="li-sub truncate">${esc(inv.clientName || 'Pa klient')} · ${fmtDateShort(inv.date)}</div>
            </div>
            <div class="li-end">
              <div class="li-title mono" style="font-size:var(--text-sm)">${money(inv.total)}</div>
            </div>
            <span class="badge ${STATUS[inv.status]?.badge || 'badge-neutral'}">${STATUS[inv.status]?.label || inv.status}</span>
            <div class="li-actions">
              <button class="icon-btn" data-print aria-label="Printo">${icon('print')}</button>
              <button class="icon-btn danger" data-del aria-label="Fshi">${icon('trash')}</button>
            </div>
          </div>`).join('')}
      </div>`
      : (query || filter !== 'all')
        ? emptyState('search', 'Asnjë rezultat', 'Provo filtra të tjerë.')
        : emptyState('invoice', 'Ende pa fatura', 'Krijo faturën e parë profesionale — me TVSH, zbritje dhe printim A4.',
            `<button class="btn btn-primary" data-new>${icon('plus')}<span>Faturë e re</span></button>`)}
      <button class="fab" data-new aria-label="Faturë e re">${icon('plus')}</button>`;

    page.querySelectorAll('[data-new]').forEach((b) => b.addEventListener('click', () => Router.go('invoices', 'new')));
    page.querySelectorAll('[data-filter]').forEach((b) => b.addEventListener('click', () => { filter = b.dataset.filter; draw(); }));
    const search = page.querySelector('.searchbar input');
    search?.addEventListener('input', debounce(() => {
      query = search.value;
      const pos = search.selectionStart;
      draw();
      const s2 = page.querySelector('.searchbar input');
      s2.focus(); s2.setSelectionRange(pos, pos);
    }, 220));
    page.querySelectorAll('.list-item').forEach((row) => {
      const id = row.dataset.id;
      row.querySelector('[data-print]').addEventListener('click', (e) => {
        e.stopPropagation();
        printInvoice(Store.find('invoices', id));
      });
      row.querySelector('[data-del]').addEventListener('click', async (e) => {
        e.stopPropagation();
        const ok = await Dialog.confirm({ title: 'Fshi faturën?', message: 'Ky veprim nuk kthehet mbrapsht.', okText: 'Fshi', danger: true });
        if (ok) { Store.remove('invoices', id); Toast.show('Fatura u fshi', 'info'); draw(); }
      });
      row.addEventListener('click', () => Router.go('invoices', 'edit', id));
    });
  };
  draw();
};

/* ---------- Krijuesi / Editori ---------- */

const renderEditor = (container, existingId = null) => {
  const existing = existingId ? Store.find('invoices', existingId) : null;
  if (existingId && !existing) { Router.go('invoices'); return; }

  const biz = Store.business;
  const clients = Store.all('clients');
  const catalog = [
    ...Store.all('products').map((p) => ({ name: p.name, price: p.price })),
    ...Store.all('services').map((s) => ({ name: s.name, price: s.price })),
  ];

  // Gjendja e formës (draft në memorie derisa ruhet)
  const inv = existing ? JSON.parse(JSON.stringify(existing)) : {
    number: '', // caktohet në ruajtje
    date: todayISO(),
    dueDate: '',
    clientId: '',
    clientName: '',
    clientDetails: '',
    lines: [{ name: '', qty: 1, price: 0 }],
    vatRate: biz.vatRate ?? 18,
    discountPct: 0,
    note: '',
    status: 'draft',
    total: 0,
  };

  const page = document.createElement('div');
  page.className = 'page';
  container.appendChild(page);

  const draw = () => {
    const t = calcTotals(inv);
    page.innerHTML = `
      <div class="page-head">
        <button class="icon-btn" data-back aria-label="Kthehu">${icon('arrowLeft')}</button>
        <div class="ph-text">
          <h1>${existing ? esc(inv.number) : 'Faturë e re'}</h1>
          <p>${existing ? 'Edito faturën' : 'Plotëso të dhënat — numri caktohet automatikisht'}</p>
        </div>
        <div class="ph-actions">
          <span class="badge ${STATUS[inv.status]?.badge}">${STATUS[inv.status]?.label}</span>
        </div>
      </div>

      <div class="card" style="margin-bottom:14px">
        <div class="form-grid">
          <div class="field">
            <label for="inv-client">Klienti</label>
            <select class="select" id="inv-client">
              <option value="">— Zgjidh klientin —</option>
              ${clients.map((c) => `<option value="${c.id}" ${c.id === inv.clientId ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}
              <option value="__manual" ${!inv.clientId && inv.clientName ? 'selected' : ''}>✎ Shkruaj manualisht</option>
            </select>
          </div>
          <div class="field" ${inv.clientId || !inv.clientName ? 'hidden' : ''} id="manual-wrap">
            <label for="inv-client-name">Emri i klientit</label>
            <input class="input" id="inv-client-name" value="${esc(inv.clientName)}" placeholder="Emri">
          </div>
          <div class="field"><label for="inv-date">Data</label><input class="input" type="date" id="inv-date" value="${esc(inv.date)}"></div>
          <div class="field"><label for="inv-due">Afati i pagesës</label><input class="input" type="date" id="inv-due" value="${esc(inv.dueDate)}"></div>
        </div>
      </div>

      <div class="card" style="margin-bottom:14px">
        <div class="card-title" style="margin-bottom:14px">Artikujt</div>
        <div class="inv-lines" id="inv-lines">
          ${inv.lines.map((l, i) => `
            <div class="inv-line" data-i="${i}">
              <input class="input" list="catalog" data-k="name" value="${esc(l.name)}" placeholder="Produkt a shërbim…" aria-label="Artikulli ${i + 1}">
              <input class="input" type="number" data-k="qty" value="${esc(l.qty)}" min="0" step="any" inputmode="decimal" aria-label="Sasia">
              <input class="input" type="number" data-k="price" value="${esc(l.price)}" min="0" step="0.01" inputmode="decimal" aria-label="Çmimi">
              <button class="icon-btn danger" data-rmline aria-label="Hiq rreshtin">${icon('x')}</button>
            </div>`).join('')}
        </div>
        <datalist id="catalog">${catalog.map((c) => `<option value="${esc(c.name)}">`).join('')}</datalist>
        <button class="btn btn-soft btn-sm" data-addline style="margin-top:12px">${icon('plus')}<span>Shto artikull</span></button>

        <div class="inv-totals">
          <div class="row">
            <span style="display:flex;align-items:center;gap:8px">Zbritje
              <input class="input" id="inv-discount" type="number" value="${esc(inv.discountPct)}" min="0" max="100" step="1" style="width:70px;min-height:32px;padding:4px 8px"> %
            </span>
            <span class="mono">−${money(t.discount)}</span>
          </div>
          <div class="row">
            <span style="display:flex;align-items:center;gap:8px">TVSH
              <select class="select" id="inv-vat" style="width:90px;min-height:32px;padding:4px 28px 4px 8px">
                ${[18, 8, 0].map((r) => `<option value="${r}" ${num(inv.vatRate) === r ? 'selected' : ''}>${r}%</option>`).join('')}
              </select>
            </span>
            <span class="mono">${money(t.vat)}</span>
          </div>
          <div class="row"><span>Nëntotali</span><span class="mono">${money(t.subtotal)}</span></div>
          <div class="row total"><span>Totali</span><span class="mono">${money(t.total)}</span></div>
        </div>
      </div>

      <div class="card" style="margin-bottom:18px">
        <div class="field">
          <label for="inv-note">Shënim në faturë</label>
          <textarea class="textarea" id="inv-note" rows="2" placeholder="p.sh. Pagesa brenda 15 ditësh">${esc(inv.note)}</textarea>
        </div>
      </div>

      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-primary btn-lg" data-save>${icon('check')}<span>${existing ? 'Ruaj ndryshimet' : 'Ruaj faturën'}</span></button>
        ${inv.status !== 'paid' ? `<button class="btn btn-success btn-lg" data-paid>${icon('euro')}<span>Shëno të paguar</span></button>` : ''}
        <button class="btn btn-ghost btn-lg" data-printnow>${icon('print')}<span>Printo</span></button>
      </div>`;
    bind();
  };

  const readForm = () => {
    const clientSel = $('#inv-client', page).value;
    if (clientSel && clientSel !== '__manual') {
      const c = Store.find('clients', clientSel);
      inv.clientId = clientSel;
      inv.clientName = c?.name || '';
      inv.clientDetails = c ? [c.address, c.city, c.nui ? `NUI: ${c.nui}` : '', c.phone].filter(Boolean).join('\n') : '';
    } else {
      inv.clientId = '';
      inv.clientName = $('#inv-client-name', page)?.value.trim() || '';
      inv.clientDetails = '';
    }
    inv.date = $('#inv-date', page).value || todayISO();
    inv.dueDate = $('#inv-due', page).value || '';
    inv.discountPct = num($('#inv-discount', page).value);
    inv.vatRate = num($('#inv-vat', page).value);
    inv.note = $('#inv-note', page).value.trim();
    page.querySelectorAll('.inv-line').forEach((row) => {
      const i = Number(row.dataset.i);
      inv.lines[i] = {
        name: row.querySelector('[data-k="name"]').value.trim(),
        qty: num(row.querySelector('[data-k="qty"]').value),
        price: num(row.querySelector('[data-k="price"]').value),
      };
    });
  };

  const save = (status = null) => {
    readForm();
    inv.lines = inv.lines.filter((l) => l.name);
    if (!inv.lines.length) {
      Toast.show('Shto të paktën një artikull', 'error');
      inv.lines = [{ name: '', qty: 1, price: 0 }];
      draw();
      return null;
    }
    if (status) inv.status = status;
    inv.total = calcTotals(inv).total;

    let saved;
    if (existing) {
      saved = Store.update('invoices', existing.id, inv);
    } else {
      inv.number = Store.nextInvoiceNumber();
      saved = Store.add('invoices', inv);
      Store.logActivity(`U krijua fatura ${inv.number} (${money(inv.total)})`, 'invoices');
    }
    return saved;
  };

  const bind = () => {
    page.querySelector('[data-back]').addEventListener('click', () => Router.go('invoices'));

    $('#inv-client', page).addEventListener('change', (e) => {
      readForm();
      const wrap = $('#manual-wrap', page);
      if (e.target.value === '__manual') { wrap.hidden = false; wrap.querySelector('input').focus(); }
      else wrap.hidden = true;
    });

    // Rifresko totalet live
    const refresh = debounce(() => { readForm(); draw(); }, 350);
    page.querySelectorAll('.inv-line input, #inv-discount, #inv-vat').forEach((el) =>
      el.addEventListener('change', refresh));

    // Auto-çmimi kur zgjidhet nga katalogu
    page.querySelectorAll('.inv-line [data-k="name"]').forEach((el) =>
      el.addEventListener('change', () => {
        const hit = catalog.find((c) => c.name === el.value);
        if (hit) {
          el.closest('.inv-line').querySelector('[data-k="price"]').value = hit.price;
        }
      }));

    page.querySelector('[data-addline]').addEventListener('click', () => {
      readForm();
      inv.lines.push({ name: '', qty: 1, price: 0 });
      draw();
      const rows = page.querySelectorAll('.inv-line');
      rows[rows.length - 1]?.querySelector('input')?.focus();
    });

    page.querySelectorAll('[data-rmline]').forEach((b) =>
      b.addEventListener('click', () => {
        readForm();
        const i = Number(b.closest('.inv-line').dataset.i);
        inv.lines.splice(i, 1);
        if (!inv.lines.length) inv.lines.push({ name: '', qty: 1, price: 0 });
        draw();
      }));

    page.querySelector('[data-save]').addEventListener('click', () => {
      if (save()) { Toast.show('Fatura u ruajt'); Router.go('invoices'); }
    });

    page.querySelector('[data-paid]')?.addEventListener('click', () => {
      const saved = save('paid');
      if (!saved) return;
      // Regjistro automatikisht si e hyrë
      Store.add('income', {
        description: `Fatura ${saved.number} — ${saved.clientName || 'klient'}`,
        amount: saved.total, date: todayISO(), source: 'Fatura', method: 'banke',
      });
      Store.logActivity(`Fatura ${saved.number} u pagua (${money(saved.total)})`, 'invoices');
      Toast.show('U shënua e paguar dhe u regjistrua te të hyrat');
      Router.go('invoices');
    });

    page.querySelector('[data-printnow]').addEventListener('click', () => {
      readForm();
      const forPrint = { ...inv, number: inv.number || '(pa numër — ruaje së pari)' };
      printInvoice(forPrint);
    });
  };

  draw();
};

/* ---------- Hyrja e modulit ---------- */

export const render = (container, params = []) => {
  if (params[0] === 'new') renderEditor(container);
  else if (params[0] === 'edit' && params[1]) renderEditor(container, params[1]);
  else renderList(container);
};
