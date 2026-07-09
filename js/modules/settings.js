/* ============================================================
   BIZOS · Cilësimet
   Tema, faturimi, të dhënat (backup / rikthim / import /
   eksport / fshirje) dhe informacioni i aplikacionit.
   ============================================================ */

import { $, esc, fmtDateTime, downloadBlob, todayISO } from '../core/utils.js';
import { icon } from '../core/icons.js';
import { Store } from '../core/store.js';
import { Toast, Dialog, Sheet, pageHead } from '../core/ui.js';
import { Router } from '../core/router.js';

const APP_VERSION = '1.0.3';

const settingRow = (title, sub, controlHTML) => `
  <div style="display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--line)">
    <div style="flex:1;min-width:0">
      <div style="font-weight:600;font-size:var(--text-sm)">${title}</div>
      ${sub ? `<div class="faint" style="font-size:var(--text-xs);margin-top:2px">${sub}</div>` : ''}
    </div>
    ${controlHTML}
  </div>`;

export const render = (container) => {
  const page = document.createElement('div');
  page.className = 'page';
  container.appendChild(page);

  const draw = () => {
    const s = Store.settings;
    const info = Store.storageInfo();
    const kb = (info.bytes / 1024).toFixed(1);

    page.innerHTML = `
      ${pageHead('Cilësimet', 'Personalizo BIZOS dhe menaxho të dhënat e tua')}

      <div class="card" style="margin-bottom:14px">
        <div class="card-title" style="margin-bottom:6px">Pamja</div>
        ${settingRow('Tema e errët', 'Ndërro mes dritës dhe errësirës',
          `<label class="switch"><input type="checkbox" id="s-theme" ${s.theme !== 'light' ? 'checked' : ''}><span class="track"></span></label>`)}
        ${settingRow('Gjuha', 'Shqip — e krijuar për Kosovën', '<span class="badge badge-accent">Shqip 🇽🇰</span>')}
        ${settingRow('Valuta', 'Euro — valuta zyrtare e Kosovës', '<span class="badge badge-neutral">EUR €</span>')}
      </div>

      <div class="card" style="margin-bottom:14px">
        <div class="card-title" style="margin-bottom:6px">Faturimi</div>
        ${settingRow('Prefiksi i faturave', 'p.sh. FAT → FAT-2026-001',
          `<input class="input" id="s-prefix" value="${esc(s.invoicePrefix)}" style="width:110px" maxlength="6" aria-label="Prefiksi i faturave">`)}
        ${settingRow('Numëratori aktual', 'Fatura e radhës merr numrin vijues',
          `<span class="mono badge badge-neutral">${s.invoiceCounter}</span>`)}
      </div>

      <div class="card" style="margin-bottom:14px">
        <div class="card-title" style="margin-bottom:6px">Të dhënat</div>
        ${settingRow('Backup i plotë (JSON)', 'Shkarko gjithçka në një skedar të vetëm',
          `<button class="btn btn-soft btn-sm" data-export>${icon('download')}<span>Shkarko</span></button>`)}
        ${settingRow('Import nga backup', 'Rikthe të dhënat nga një skedar BIZOS',
          `<button class="btn btn-ghost btn-sm" data-import>${icon('upload')}<span>Importo</span></button>
           <input type="file" id="s-file" accept="application/json,.json" hidden>`)}
        ${settingRow('Rikthim automatik', 'Kthehu te backup-i i fundit i brendshëm',
          `<button class="btn btn-ghost btn-sm" data-restore>${icon('refresh')}<span>Rikthe</span></button>`)}
        ${settingRow('Fshi të gjitha të dhënat', 'Fillim nga zero — nuk kthehet mbrapsht',
          `<button class="btn btn-danger btn-sm" data-wipe>${icon('trash')}<span>Fshi</span></button>`)}
        <p class="faint" style="font-size:var(--text-xs);margin-top:12px">
          ${info.records} regjistrime · ${kb} KB · përditësuar ${fmtDateTime(info.updatedAt)}
        </p>
      </div>

      <div class="card">
        <div class="card-title" style="margin-bottom:6px">Rreth BIZOS</div>
        ${settingRow('Versioni', 'BIZOS — Sistemi Operativ i Biznesit', `<span class="mono badge badge-neutral">v${APP_VERSION}</span>`)}
        ${settingRow('Çmimi', 'Pa abonime, pa pagesa të fshehura', '<span class="badge badge-success">100% Falas</span>')}
        ${settingRow('Privatësia', 'Gjithçka ruhet vetëm në pajisjen tënde — pa server, pa llogari', '<span class="badge badge-info">Offline-first</span>')}
        ${settingRow('Udhëzuesi i përdorimit', 'Manual i plotë hap-pas-hapi për çdo modul',
          `<button class="btn btn-soft btn-sm" data-manual>${icon('bookOpen')}<span>Hape</span></button>`)}
        ${settingRow('Instalo si aplikacion', 'Përdore BIZOS si aplikacion të mirëfilltë — me ikonë dhe offline',
          `<button class="btn btn-primary btn-sm" data-install>${icon('download')}<span>Instalo</span></button>`)}
      </div>`;

    /* --- Udhëzuesi --- */
    page.querySelector('[data-manual]').addEventListener('click', () => Router.go('manual'));

    /* --- Instalimi PWA --- */
    page.querySelector('[data-install]').addEventListener('click', async () => {
      const ev = window.__bizosInstallEvent;
      if (ev) {
        ev.prompt();
        const { outcome } = await ev.userChoice;
        if (outcome === 'accepted') { window.__bizosInstallEvent = null; Toast.show('BIZOS po instalohet 🎉'); }
        return;
      }
      // S'ka prompt automatik — trego udhëzimet sipas rastit
      const isFile = location.protocol === 'file:';
      Sheet.open({
        title: 'Si instalohet BIZOS',
        body: `
          <div style="display:flex;flex-direction:column;gap:14px;font-size:var(--text-sm)">
            ${isFile ? `<div class="card" style="background:var(--warning-soft);border-color:transparent">
              <b>Shënim:</b> Tani po e hap BIZOS direkt si skedar. Instalimi si aplikacion kërkon
              që të hapet nga një server (p.sh. <span class="mono">npx serve .</span> në dosjen BIZOS,
              pastaj hap <span class="mono">localhost:3000</span>).
            </div>` : ''}
            <div><b>💻 Kompjuter (Chrome / Edge)</b><br>
              Kliko ikonën e instalimit <b>⊕</b> në fund të shiritit të adresës → <b>“Instalo BIZOS”</b>.</div>
            <div><b>📱 Android (Chrome)</b><br>
              Menyja <b>⋮</b> → <b>“Shto në ekranin kryesor”</b> → Shto.</div>
            <div><b>📱 iPhone / iPad (Safari)</b><br>
              Butoni <b>Share</b> (katrori me shigjetë) → <b>“Add to Home Screen”</b>.</div>
            <div class="faint" style="font-size:var(--text-xs)">
              Pas instalimit BIZOS hapet si aplikacion i veçantë, me ikonën e vet dhe punon plotësisht offline.
            </div>
          </div>`,
      });
    });

    /* --- Tema --- */
    $('#s-theme', page).addEventListener('change', () =>
      document.dispatchEvent(new CustomEvent('bizos:toggle-theme')));

    /* --- Prefiksi --- */
    $('#s-prefix', page).addEventListener('change', (e) => {
      const v = e.target.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) || 'FAT';
      Store.setSettings({ invoicePrefix: v });
      e.target.value = v;
      Toast.show('Prefiksi u ruajt');
    });

    /* --- Eksporti --- */
    page.querySelector('[data-export]').addEventListener('click', () => {
      downloadBlob(new Blob([Store.exportJSON()], { type: 'application/json' }),
        `bizos-backup-${todayISO()}.json`);
      Store.logActivity('U shkarkua backup i plotë', 'settings');
      Toast.show('Backup-i u shkarkua');
    });

    /* --- Importi --- */
    const fileInput = $('#s-file', page);
    page.querySelector('[data-import]').addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', async () => {
      const file = fileInput.files[0];
      if (!file) return;
      const ok = await Dialog.confirm({
        title: 'Importo backup-in?',
        message: 'Të dhënat aktuale do të zëvendësohen me ato të skedarit. Një kopje e brendshme ruhet automatikisht.',
        okText: 'Importo',
      });
      fileInput.value = '';
      if (!ok) return;
      const raw = await file.text();
      const result = Store.importJSON(raw);
      if (result.ok) {
        Toast.show('Të dhënat u importuan me sukses');
        draw();
      } else {
        Toast.show(result.error, 'error', 4000);
      }
    });

    /* --- Rikthimi --- */
    page.querySelector('[data-restore]').addEventListener('click', async () => {
      const ok = await Dialog.confirm({
        title: 'Rikthe backup-in e brendshëm?',
        message: 'Të dhënat aktuale zëvendësohen me gjendjen e backup-it të fundit automatik.',
        okText: 'Rikthe',
      });
      if (!ok) return;
      const result = Store.restoreBackup();
      if (result.ok) { Toast.show('Të dhënat u rikthyen'); draw(); }
      else Toast.show(result.error, 'error');
    });

    /* --- Fshirja --- */
    page.querySelector('[data-wipe]').addEventListener('click', async () => {
      const ok = await Dialog.confirm({
        title: 'Fshi TË GJITHA të dhënat?',
        message: 'Fatura, klientë, financa — gjithçka fshihet nga kjo pajisje. Ky veprim nuk kthehet mbrapsht.',
        okText: 'Po, fshi gjithçka', danger: true,
      });
      if (!ok) return;
      Store.wipe();
      Toast.show('Të dhënat u fshinë', 'info');
      draw();
    });
  };

  draw();
};
