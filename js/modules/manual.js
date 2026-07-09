/* ============================================================
   BIZOS · Udhëzuesi i Përdorimit
   Manual i plotë hap-pas-hapi për çdo modul.
   ============================================================ */

import { esc } from '../core/utils.js';
import { icon } from '../core/icons.js';
import { Router } from '../core/router.js';
import { pageHead } from '../core/ui.js';

const GUIDE = [
  {
    icon: 'bolt', title: 'Fillimi i shpejtë', open: true,
    steps: [
      ['Plotëso profilin', 'Shko te <b>Profili i Biznesit</b> dhe shkruaj emrin, NUI-në dhe kontaktet — këto shfaqen automatikisht në fatura, dokumente e kartëvizita.', 'business'],
      ['Shto klientët dhe produktet', 'Te <b>Klientët</b> dhe <b>Produktet/Shërbimet</b> shto ato me të cilat punon çdo ditë.', 'clients'],
      ['Krijo faturën e parë', 'Shtyp <b>Faturë e re</b> në panel — numri caktohet vetë (FAT-2026-001).', 'invoices'],
      ['Bëj backup', 'Te <b>Cilësimet → Të dhënat</b> shkarko një kopje të sigurisë sa herë të duash.', 'settings'],
    ],
  },
  {
    icon: 'invoice', title: 'Faturat',
    steps: [
      ['Krijo faturë', 'Shtyp <b>Faturë e re</b>, zgjidh klientin nga lista (ose shkruaje manualisht) dhe shto artikujt. Kur zgjedh një produkt nga katalogu, çmimi plotësohet vetë.'],
      ['TVSH dhe zbritja', 'Zgjidh normën e TVSH-së (18%, 8% ose 0%) dhe zbritjen në % — totalet llogariten menjëherë.'],
      ['Printo në A4', 'Shtyp <b>Printo</b> — fatura del në format profesional me të dhënat e biznesit tënd. Mund ta ruash si PDF nga dialogu i printerit.'],
      ['Shëno të paguar', 'Kur klienti paguan, shtyp <b>Shëno të paguar</b> — shuma regjistrohet automatikisht te Të hyrat.'],
    ],
  },
  {
    icon: 'users', title: 'Klientët, Produktet & Shërbimet',
    steps: [
      ['Shto dhe edito', 'Butoni <b>+ Shto</b> hap formularin; kliko mbi çdo rresht për ta edituar; ikonat anash për fshirje.'],
      ['Kërko dhe filtro', 'Çdo listë ka kërkim të menjëhershëm dhe filtra (p.sh. Biznese/Individë, Stok i ulët).'],
      ['Eksporto CSV', 'Butoni <b>CSV</b> shkarkon listën për Excel.'],
      ['Stoku', 'Te produktet cakto "Ndiq stokun = Po" dhe stokun minimal — merr paralajmërim kur bie nën nivel.'],
    ],
  },
  {
    icon: 'chart', title: 'Financat & Raportet',
    steps: [
      ['Të hyrat / Shpenzimet', 'Regjistro çdo hyrje e dalje parash me datë, kategori dhe mënyrë pagese.'],
      ['Raportet', 'Shiko të hyrat, shpenzimet dhe <b>fitimin</b> për çdo muaj, trendin 6-mujor, klientët kryesorë dhe shpenzimet sipas kategorive.'],
      ['Ndërro muajin', 'Përdor shigjetat ‹ › lart te Raportet për të parë muajt e kaluar.'],
      ['Inventari', 'Rregullo stokun me + / − dhe shiko vlerën totale të mallit.'],
    ],
  },
  {
    icon: 'checkSquare', title: 'Detyrat, Shënimet & Dokumentet',
    steps: [
      ['Detyrat', 'Shto detyra me prioritet dhe afat; klik mbi rrethin për t’i shënuar të kryera. Detyrat me vonesë dalin të parat.'],
      ['Shënimet', 'Ruaj ide e kujtesa; ngjiti lart me yll ★ ato të rëndësishmet.'],
      ['Dokumentet', 'Zgjidh shabllonin (Ofertë, Dëftesë pagese, Vërtetim, Kontratë), plotëso fushat dhe <b>printo</b> — me kokën e biznesit tënd dhe vende për nënshkrim.'],
    ],
  },
  {
    icon: 'calculator', title: 'Veglat',
    steps: [
      ['Kalkulatori', 'Tre mënyra: klasik, <b>TVSH</b> (shto ose nxirr TVSH-në nga një shumë) dhe <b>Marzhi</b> (fitimi, marzhi dhe markup-i nga kosto e çmimi).'],
      ['Kodi QR', 'Gjenero QR për çdo link/tekst, për <b>WiFi-në e lokalit</b> (klientët lidhen me skanim) ose kontaktin tënd (vCard). Shkarko SVG ose PNG.'],
      ['Barkodet', 'Code 128 për kode të brendshme ose EAN-13 për produkte — gati për etiketa.'],
      ['Kartëvizitat', 'Zgjidh njërin nga 4 stilet dhe shkarko PNG me cilësi shtypi — të dhënat merren nga profili.'],
    ],
  },
  {
    icon: 'search', title: 'Kërkimi Global',
    steps: [
      ['Hape me tastierë', 'Shtyp <span class="kbd">Ctrl K</span> (ose <span class="kbd">/</span>) kudo — ose ikonën e kërkimit lart.'],
      ['Kërkon gjithçka', 'Module, klientë, fatura, produkte, detyra, shënime — të gjitha nga një vend.'],
      ['Naviga me shigjeta', '↑ ↓ për të lëvizur, Enter për të hapur, Esc për të mbyllur.'],
    ],
  },
  {
    icon: 'shield', title: 'Të dhënat & Siguria',
    steps: [
      ['Gjithçka lokale', 'BIZOS nuk ka server — të dhënat ruhen vetëm në pajisjen tënde. Askush tjetër s’i sheh.'],
      ['Backup', 'Te <b>Cilësimet</b> shkarko backup JSON. Ruaje në USB, email apo cloud — është e gjithë baza jote.'],
      ['Rikthim / Import', 'Importo backup-in në çdo pajisje tjetër — të dhënat rikthehen plotësisht. Ka edhe backup automatik të brendshëm çdo 5 minuta.'],
      ['Kujdes', 'Mos pastro të dhënat e shfletuesit pa bërë backup më parë.'],
    ],
  },
  {
    icon: 'download', title: 'Instalimi si Aplikacion',
    steps: [
      ['Nga Cilësimet', 'Shtyp <b>Instalo</b> te Cilësimet → Rreth BIZOS. Nëse shfletuesi e lejon, instalimi nis menjëherë.'],
      ['Në kompjuter', 'Chrome/Edge: ikona e instalimit ⊕ në fund të shiritit të adresës → "Instalo BIZOS".'],
      ['Në telefon', 'Android (Chrome): menyja ⋮ → "Shto në ekranin kryesor". iPhone (Safari): Share → "Add to Home Screen".'],
      ['Shënim', 'Instalimi PWA kërkon që aplikacioni të hapet nga një server (http/https), jo si skedar i thjeshtë.'],
    ],
  },
];

export const render = (container) => {
  const page = document.createElement('div');
  page.className = 'page';
  page.innerHTML = `
    ${pageHead('Udhëzuesi i Përdorimit', 'Gjithçka që duhet të dish për BIZOS — hap-pas-hapi')}
    <div class="manual">
      ${GUIDE.map((sec, i) => `
        <details class="manual-item" ${sec.open ? 'open' : ''} style="animation-delay:${i * 35}ms">
          <summary>
            <span class="avatar" style="width:36px;height:36px">${icon(sec.icon)}</span>
            <span class="manual-title">${esc(sec.title)}</span>
            ${icon('chevronRight', 'manual-chev')}
          </summary>
          <ol class="manual-steps">
            ${sec.steps.map(([t, body, go]) => `
              <li>
                <div class="manual-step-t">${esc(t)}
                  ${go ? `<button class="btn btn-soft btn-sm" data-go="${go}" style="margin-left:8px">${icon('arrowLeft')} Hape</button>` : ''}
                </div>
                <div class="manual-step-b">${body}</div>
              </li>`).join('')}
          </ol>
        </details>`).join('')}
    </div>
    <div class="card" style="margin-top:18px;display:flex;gap:14px;align-items:center">
      <div class="avatar" style="background:var(--success-soft);color:var(--success)">${icon('sparkles')}</div>
      <p class="muted" style="font-size:var(--text-sm)">
        BIZOS është <b>100% falas</b> — pa abonime, pa reklama, pa llogari. Ndërtuar për bizneset e Kosovës. 🇽🇰
      </p>
    </div>`;
  container.appendChild(page);
  page.addEventListener('click', (e) => {
    const b = e.target.closest('[data-go]');
    if (b) Router.go(b.dataset.go);
  });
};
