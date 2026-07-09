/* ============================================================
   BIZOS · App Shell
   Ndërton kornizën (sidebar, topbar, bottom nav), temën,
   kërkimin global, service worker-in dhe nis router-in.
   ============================================================ */

import { $, esc } from './core/utils.js';
import { icon } from './core/icons.js';
import { Store } from './core/store.js';
import { MODULES, Router, getModule } from './core/router.js';
import { initSearch, openSearch } from './core/search.js';
import { Toast } from './core/ui.js';

/* ---------- Tema ---------- */

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  $('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f6f6f8' : '#09090b');
};

const toggleTheme = () => {
  const next = (Store.settings.theme === 'light') ? 'dark' : 'light';
  Store.setSettings({ theme: next });
  applyTheme(next);
  drawThemeButtons();
};

const drawThemeButtons = () => {
  const isLight = Store.settings.theme === 'light';
  document.querySelectorAll('[data-theme-toggle]').forEach((b) => {
    b.innerHTML = icon(isLight ? 'moon' : 'sun');
    b.setAttribute('aria-label', isLight ? 'Kalo në errësirë' : 'Kalo në dritë');
  });
};

document.addEventListener('bizos:toggle-theme', toggleTheme);

/* ---------- Shell ---------- */

const BOTTOM_NAV = ['dashboard', 'invoices', 'clients', 'reports', 'settings'];

const navGroupsHTML = () => {
  const groups = [];
  for (const m of MODULES) {
    let g = groups.find((x) => x.name === m.group);
    if (!g) { g = { name: m.group, items: [] }; groups.push(g); }
    g.items.push(m);
  }
  return groups.map((g) => `
    <div class="nav-group">${esc(g.name)}</div>
    ${g.items.map((m) => `
      <a class="nav-link" href="#/${m.id}" data-nav="${m.id}">
        ${icon(m.icon)}<span>${esc(m.title)}</span>
        ${m.soon ? '<span class="soon">SË SHPEJTI</span>' : ''}
      </a>`).join('')}`).join('');
};

const renderShell = () => {
  $('#app').innerHTML = `
    <aside class="sidebar">
      <a class="brand" href="#/dashboard" aria-label="BIZOS — Paneli">
        <div class="brand-logo">B</div>
        <div>
          <div class="brand-name">BIZOS</div>
          <div class="brand-tag">Business OS · Kosovë</div>
        </div>
      </a>
      <button class="side-search" data-open-search>
        ${icon('search')}<span>Kërko…</span><span class="kbd">Ctrl K</span>
      </button>
      <nav aria-label="Navigimi kryesor">${navGroupsHTML()}</nav>
    </aside>

    <div class="main">
      <header class="topbar">
        <div class="tb-brand">
          <div class="brand-logo" style="width:32px;height:32px;font-size:15px">B</div>
          <strong>BIZOS</strong>
        </div>
        <div class="tb-title" id="tb-title"></div>
        <div class="tb-actions">
          <button class="icon-btn" data-open-search aria-label="Kërko (Ctrl+K)">${icon('search')}</button>
          <button class="icon-btn" data-theme-toggle aria-label="Ndërro temën"></button>
        </div>
      </header>
      <main id="outlet"></main>
    </div>

    <nav class="bottomnav" aria-label="Navigimi i poshtëm">
      ${BOTTOM_NAV.map((id) => {
        const m = getModule(id);
        return `<a class="bn-link" href="#/${m.id}" data-nav="${m.id}">${icon(m.icon)}<span>${esc(m.title)}</span></a>`;
      }).join('')}
    </nav>`;

  document.querySelectorAll('[data-open-search]').forEach((b) =>
    b.addEventListener('click', openSearch));
  document.querySelectorAll('[data-theme-toggle]').forEach((b) =>
    b.addEventListener('click', toggleTheme));
  drawThemeButtons();
};

const highlightNav = ({ id }) => {
  document.querySelectorAll('[data-nav]').forEach((a) =>
    a.classList.toggle('active', a.dataset.nav === id));
  const mod = getModule(id);
  const titleEl = $('#tb-title');
  if (titleEl) titleEl.textContent = (id === 'dashboard') ? '' : (mod?.title || '');
};

/* ---------- Service Worker + përditësimet ---------- */

const initServiceWorker = () => {
  // SW kërkon http(s) — kur hapet si file:// aplikacioni punon normalisht pa të
  if (!('serviceWorker' in navigator) || !/^https?:$/.test(location.protocol)) return;
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('sw.js');
      // Kur ka version të ri gati → ofro rifreskim
      reg.addEventListener('updatefound', () => {
        const sw = reg.installing;
        sw?.addEventListener('statechange', () => {
          if (sw.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdatePill(reg);
          }
        });
      });
    } catch { /* offline ose file:// — s'ka problem */ }
  });

  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    location.reload();
  });
};

const showUpdatePill = (reg) => {
  if ($('.update-pill')) return;
  const pill = document.createElement('div');
  pill.className = 'update-pill';
  pill.innerHTML = `${icon('sparkles')}<span>Version i ri gati</span>
    <button class="btn btn-primary btn-sm">Përditëso</button>`;
  pill.querySelector('button').addEventListener('click', () => {
    reg.waiting?.postMessage('SKIP_WAITING');
    pill.remove();
  });
  document.body.appendChild(pill);
};

/* ---------- Offline / Online ---------- */

/* ---------- Instalimi PWA ---------- */

window.__bizosInstallEvent = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.__bizosInstallEvent = e;
});
window.addEventListener('appinstalled', () => {
  window.__bizosInstallEvent = null;
  Toast.show('BIZOS u instalua si aplikacion 🎉');
});

window.addEventListener('offline', () => Toast.show('Je offline — gjithçka vazhdon të punojë', 'info'));
window.addEventListener('online', () => Toast.show('Lidhja u rikthye', 'success', 1800));

/* ---------- Nisja ---------- */

applyTheme(Store.settings.theme);
renderShell();
initSearch();
Router.onAfterRender(highlightNav);
Router.init($('#outlet'));
initServiceWorker();
