/* ============================================================
   BIZOS · Gjenerues Barkodesh
   Code128 dhe EAN-13 me shkarkim SVG/PNG — offline, me
   librarinë vendore JsBarcode.
   ============================================================ */

import { $, downloadBlob } from '../core/utils.js';
import { icon } from '../core/icons.js';
import { loadScript } from '../core/loader.js';
import { Toast, pageHead } from '../core/ui.js';

export const render = (container) => {
  const page = document.createElement('div');
  page.className = 'page';
  container.appendChild(page);

  page.innerHTML = `
    ${pageHead('Barkodet', 'Gjenero barkode për produktet e tua')}
    <div class="grid-2" style="max-width:820px;margin:0 auto">
      <div class="card">
        <div class="form-grid">
          <div class="field span-2">
            <label for="bc-value">Vlera</label>
            <input class="input" id="bc-value" placeholder="p.sh. P-0001 ose 5901234123457">
          </div>
          <div class="field">
            <label for="bc-format">Formati</label>
            <select class="select" id="bc-format">
              <option value="CODE128">Code 128 (universal)</option>
              <option value="EAN13">EAN-13 (13 shifra)</option>
            </select>
          </div>
          <div class="field">
            <label for="bc-height">Lartësia</label>
            <select class="select" id="bc-height">
              <option value="60">Normale</option>
              <option value="90">E lartë</option>
              <option value="40">E ulët</option>
            </select>
          </div>
        </div>
        <p class="faint" style="font-size:var(--text-xs);margin-top:10px">
          EAN-13 kërkon saktësisht 12–13 shifra; shifra e fundit e kontrollit llogaritet vetë.
        </p>
        <button class="btn btn-primary btn-block" data-gen style="margin-top:16px">${icon('barcode')}<span>Gjenero barkodin</span></button>
      </div>
      <div class="card" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;min-height:240px">
        <div id="bc-wrap" style="background:#fff;padding:14px;border-radius:14px;display:none;max-width:100%;overflow:auto">
          <svg id="bc-out"></svg>
        </div>
        <p id="bc-hint" class="faint" style="font-size:var(--text-sm)">Barkodi do të shfaqet këtu</p>
        <div id="bc-dl" style="display:none;gap:10px">
          <button class="btn btn-ghost btn-sm" data-dl="svg">${icon('download')}<span>SVG</span></button>
          <button class="btn btn-ghost btn-sm" data-dl="png">${icon('download')}<span>PNG</span></button>
        </div>
      </div>
    </div>`;

  const generate = async () => {
    const value = $('#bc-value', page).value.trim();
    const format = $('#bc-format', page).value;
    if (!value) { Toast.show('Shkruaj vlerën së pari', 'error'); return; }
    if (format === 'EAN13' && !/^\d{12,13}$/.test(value)) {
      Toast.show('EAN-13 kërkon 12 ose 13 shifra', 'error');
      return;
    }
    try {
      await loadScript('js/vendor/jsbarcode.min.js');
    } catch {
      Toast.show('Libraria e barkodeve nuk u ngarkua', 'error');
      return;
    }
    try {
      window.JsBarcode('#bc-out', value, {
        format,
        height: Number($('#bc-height', page).value),
        displayValue: true,
        fontSize: 14,
        margin: 4,
        background: '#ffffff',
        lineColor: '#111111',
      });
    } catch {
      Toast.show('Vlera nuk është e vlefshme për këtë format', 'error');
      return;
    }
    $('#bc-wrap', page).style.display = 'block';
    $('#bc-hint', page).style.display = 'none';
    $('#bc-dl', page).style.display = 'flex';
  };

  page.querySelector('[data-gen]').addEventListener('click', generate);
  $('#bc-value', page).addEventListener('keydown', (e) => { if (e.key === 'Enter') generate(); });

  page.querySelectorAll('[data-dl]').forEach((b) =>
    b.addEventListener('click', () => {
      const svgEl = $('#bc-out', page);
      if (!svgEl.hasChildNodes()) { Toast.show('Gjenero barkodin së pari', 'error'); return; }
      const svgStr = new XMLSerializer().serializeToString(svgEl);
      if (b.dataset.dl === 'svg') {
        downloadBlob(new Blob([svgStr], { type: 'image/svg+xml' }), 'bizos-barkod.svg');
      } else {
        const img = new Image();
        const url = URL.createObjectURL(new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' }));
        img.onload = () => {
          const scale = 3;
          const c = document.createElement('canvas');
          c.width = img.width * scale;
          c.height = img.height * scale;
          const ctx = c.getContext('2d');
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, c.width, c.height);
          ctx.drawImage(img, 0, 0, c.width, c.height);
          URL.revokeObjectURL(url);
          c.toBlob((blob) => downloadBlob(blob, 'bizos-barkod.png'), 'image/png');
        };
        img.src = url;
      }
    }));
};
