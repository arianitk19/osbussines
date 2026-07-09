/* ============================================================
   BIZOS · Kalkulatori
   Kalkulator klasik + kalkulator TVSH-je dhe marzhi —
   veglat e përditshme të një biznesi.
   ============================================================ */

import { $, esc, money, num, round2 } from '../core/utils.js';
import { icon } from '../core/icons.js';
import { pageHead } from '../core/ui.js';

/* ---------- Kalkulatori klasik (parser i sigurt, pa eval) ---------- */

const tokenize = (s) => s.match(/\d+\.?\d*|[+\-×÷()]/g) || [];

const evaluate = (expr) => {
  const tokens = tokenize(expr);
  // Shunting-yard i thjeshtuar
  const prec = { '+': 1, '-': 1, '×': 2, '÷': 2 };
  const out = [], ops = [];
  for (const t of tokens) {
    if (/^\d/.test(t)) out.push(parseFloat(t));
    else if (t === '(') ops.push(t);
    else if (t === ')') {
      while (ops.length && ops[ops.length - 1] !== '(') out.push(ops.pop());
      ops.pop();
    } else {
      while (ops.length && prec[ops[ops.length - 1]] >= prec[t]) out.push(ops.pop());
      ops.push(t);
    }
  }
  while (ops.length) out.push(ops.pop());
  const stack = [];
  for (const t of out) {
    if (typeof t === 'number') stack.push(t);
    else {
      const b = stack.pop(), a = stack.pop();
      if (a === undefined || b === undefined) return NaN;
      stack.push(t === '+' ? a + b : t === '-' ? a - b : t === '×' ? a * b : b === 0 ? NaN : a / b);
    }
  }
  return stack.length === 1 ? stack[0] : NaN;
};

export const render = (container) => {
  let mode = 'calc';
  let expr = '';

  const page = document.createElement('div');
  page.className = 'page';
  container.appendChild(page);

  const drawShell = () => {
    page.innerHTML = `
      ${pageHead('Kalkulatori', 'Llogaritje të shpejta, TVSH dhe marzh fitimi')}
      <div style="display:flex;justify-content:center;margin-bottom:18px">
        <div class="segmented" role="tablist">
          <button data-mode="calc" role="tab" class="${mode === 'calc' ? 'active' : ''}">Kalkulator</button>
          <button data-mode="vat" role="tab" class="${mode === 'vat' ? 'active' : ''}">TVSH</button>
          <button data-mode="margin" role="tab" class="${mode === 'margin' ? 'active' : ''}">Marzhi</button>
        </div>
      </div>
      <div id="calc-body"></div>`;
    page.querySelectorAll('[data-mode]').forEach((b) =>
      b.addEventListener('click', () => { mode = b.dataset.mode; drawShell(); }));
    if (mode === 'calc') drawCalc();
    else if (mode === 'vat') drawVat();
    else drawMargin();
  };

  /* --- Kalkulatori --- */
  const drawCalc = () => {
    const body = $('#calc-body', page);
    body.innerHTML = `
      <div class="calc">
        <div class="calc-display">
          <div class="calc-expr" id="c-expr">&nbsp;</div>
          <div class="calc-value" id="c-val">0</div>
        </div>
        <div class="calc-grid">
          <button class="calc-key fn" data-k="C">C</button>
          <button class="calc-key fn" data-k="(">(</button>
          <button class="calc-key fn" data-k=")">)</button>
          <button class="calc-key op" data-k="÷">÷</button>
          <button class="calc-key" data-k="7">7</button>
          <button class="calc-key" data-k="8">8</button>
          <button class="calc-key" data-k="9">9</button>
          <button class="calc-key op" data-k="×">×</button>
          <button class="calc-key" data-k="4">4</button>
          <button class="calc-key" data-k="5">5</button>
          <button class="calc-key" data-k="6">6</button>
          <button class="calc-key op" data-k="-">−</button>
          <button class="calc-key" data-k="1">1</button>
          <button class="calc-key" data-k="2">2</button>
          <button class="calc-key" data-k="3">3</button>
          <button class="calc-key op" data-k="+">+</button>
          <button class="calc-key" data-k="0">0</button>
          <button class="calc-key" data-k=".">.</button>
          <button class="calc-key fn" data-k="⌫">⌫</button>
          <button class="calc-key eq" data-k="=" style="grid-row:auto">=</button>
        </div>
      </div>`;

    const update = () => {
      $('#c-expr', body).textContent = expr || ' ';
      const v = expr ? evaluate(expr) : 0;
      $('#c-val', body).textContent = Number.isFinite(v)
        ? (Math.round(v * 1e10) / 1e10).toLocaleString('sq-AL', { maximumFractionDigits: 8 })
        : '…';
    };

    const press = (k) => {
      if (k === 'C') expr = '';
      else if (k === '⌫') expr = expr.slice(0, -1);
      else if (k === '=') {
        const v = evaluate(expr);
        expr = Number.isFinite(v) ? String(Math.round(v * 1e10) / 1e10) : expr;
      } else expr += k;
      update();
    };

    body.querySelectorAll('.calc-key').forEach((b) =>
      b.addEventListener('click', () => press(b.dataset.k)));
    update();
  };

  /* --- Kalkulatori i TVSH-së --- */
  const drawVat = () => {
    const body = $('#calc-body', page);
    body.innerHTML = `
      <div class="card" style="max-width:440px;margin:0 auto">
        <div class="form-grid">
          <div class="field"><label for="v-amount">Shuma (€)</label>
            <input class="input" id="v-amount" type="number" inputmode="decimal" step="0.01" placeholder="100.00"></div>
          <div class="field"><label for="v-rate">Norma e TVSH-së</label>
            <select class="select" id="v-rate">
              <option value="18">18% — standarde</option>
              <option value="8">8% — e reduktuar</option>
            </select></div>
          <div class="field span-2"><label for="v-dir">Shuma është</label>
            <select class="select" id="v-dir">
              <option value="net">Pa TVSH → shto TVSH-në</option>
              <option value="gross">Me TVSH → nxirr TVSH-në</option>
            </select></div>
        </div>
        <div class="inv-totals" id="v-out" aria-live="polite">
          <div class="row"><span>Pa TVSH</span><span class="mono" data-o="net">—</span></div>
          <div class="row"><span>TVSH</span><span class="mono" data-o="vat">—</span></div>
          <div class="row total"><span>Me TVSH</span><span class="mono" data-o="gross">—</span></div>
        </div>
      </div>`;

    const calc = () => {
      const amount = num($('#v-amount', body).value);
      const rate = num($('#v-rate', body).value) / 100;
      const isGross = $('#v-dir', body).value === 'gross';
      const net = isGross ? amount / (1 + rate) : amount;
      const vat = net * rate;
      $('[data-o="net"]', body).textContent = money(round2(net));
      $('[data-o="vat"]', body).textContent = money(round2(vat));
      $('[data-o="gross"]', body).textContent = money(round2(net + vat));
    };
    body.querySelectorAll('input, select').forEach((el) => el.addEventListener('input', calc));
    $('#v-amount', body).focus();
  };

  /* --- Kalkulatori i marzhit --- */
  const drawMargin = () => {
    const body = $('#calc-body', page);
    body.innerHTML = `
      <div class="card" style="max-width:440px;margin:0 auto">
        <div class="form-grid">
          <div class="field"><label for="m-cost">Kosto (€)</label>
            <input class="input" id="m-cost" type="number" inputmode="decimal" step="0.01" placeholder="60.00"></div>
          <div class="field"><label for="m-price">Çmimi i shitjes (€)</label>
            <input class="input" id="m-price" type="number" inputmode="decimal" step="0.01" placeholder="100.00"></div>
        </div>
        <div class="inv-totals" aria-live="polite">
          <div class="row"><span>Fitimi për njësi</span><span class="mono" data-o="profit">—</span></div>
          <div class="row"><span>Marzhi (nga çmimi)</span><span class="mono" data-o="margin">—</span></div>
          <div class="row total"><span>Markup (mbi koston)</span><span class="mono" data-o="markup">—</span></div>
        </div>
      </div>`;

    const calc = () => {
      const cost = num($('#m-cost', body).value);
      const price = num($('#m-price', body).value);
      const profit = price - cost;
      $('[data-o="profit"]', body).textContent = money(round2(profit));
      $('[data-o="margin"]', body).textContent = price > 0 ? `${round2(profit / price * 100)}%` : '—';
      $('[data-o="markup"]', body).textContent = cost > 0 ? `${round2(profit / cost * 100)}%` : '—';
    };
    body.querySelectorAll('input').forEach((el) => el.addEventListener('input', calc));
    $('#m-cost', body).focus();
  };

  drawShell();
};
