# BIZOS — Sistemi Operativ i Biznesit

Aplikacion modern për menaxhimin e bizneseve në Kosovë. **100% falas, offline-first, pa regjistrim, pa server** — gjithçka ruhet vetëm në pajisjen e përdoruesit.

## Nisja

**Mënyra më e thjeshtë:** hap `index.html` me dyklikim — aplikacioni punon plotësisht edhe direkt nga skedari (`file://`), falë bundle-it të vetëm `js/bizos.bundle.js`.

**Për PWA të plotë** (instalim si aplikacion + offline cache) duhet një server statik:

```bash
npx serve .
# ose
python3 -m http.server 8080
```

### Zhvillimi

Kodi burimor modular është te `js/` (ES Modules). Pas çdo ndryshimi rindërto bundle-in:

```bash
npm install   # një herë (esbuild)
npm run build # rigjeneron js/bizos.bundle.js
```

## Modulet

| Grupi | Modulet |
|---|---|
| Kryesore | Paneli, Faturat (me TVSH 18/8/0%, zbritje, printim A4), Klientët, Produktet, Shërbimet |
| Financat | Të hyrat, Shpenzimet, Raportet (trend 6-mujor, fitimi), Inventari |
| Organizimi | Detyrat, Shënimet, Dokumentet (ofertë, dëftesë, vërtetim, kontratë) |
| Veglat | Kalkulatori (klasik + TVSH + marzh), Gjenerues QR, Barkodet, Kartëvizitat |
| Sistemi | Profili i Biznesit, Cilësimet (backup, import/eksport, rikthim) |
| Së shpejti | POS, Terminet, Punonjësit, CRM, Analitika, Depoja, Dyqani Online, Menyja Digjitale, Besnikëria, Marketingu, Asistenti AI, Integrimet Shtetërore |

## Arkitektura

```
BIZOS/
├── index.html              # App shell minimal
├── manifest.webmanifest    # PWA manifest (BIZOS, sq, shortcuts)
├── sw.js                   # Service worker offline-first, i versionuar
├── css/
│   ├── tokens.css          # Design tokens: ngjyra, hapësira, tipografi, motion
│   ├── base.css            # Reset + baza
│   ├── components.css      # Libraria e komponentëve (btn, card, sheet, toast…)
│   ├── layout.css          # App shell: sidebar, bottom nav, grids
│   └── print.css           # Stilet e printimit (fatura, dokumente)
├── js/
│   ├── app.js              # Bootstrap: shell, tema, SW, router
│   ├── core/
│   │   ├── store.js        # localStorage i versionuar + backup + import/eksport
│   │   ├── router.js       # Hash-router + regjistri i moduleve (lazy import)
│   │   ├── ui.js           # Toast, Dialog, Sheet (formularë nga skema), printim
│   │   ├── crud.js         # Fabrikë modulesh CRUD (kërkim, filtra, CSV)
│   │   ├── search.js       # Kërkimi global Ctrl+K
│   │   ├── icons.js        # Ikonat SVG inline
│   │   ├── utils.js        # Formatim sq-AL/EUR, escape, ndihmës
│   │   └── loader.js       # Ngarkim lazy i librarive vendor
│   ├── modules/            # Një skedar për modul — plotësisht të pavarur
│   └── vendor/             # qrcode.js (MIT), jsbarcode.min.js (MIT)
└── assets/icons/           # Ikonat PWA (any + maskable) + favicon
```

### Si shtohet një modul i ri

1. Krijo `js/modules/emri.js` që eksporton `render(container, params)`.
2. Te `js/core/router.js` shto në `MODULES`: `{ id, title, icon, group, loader: () => import('../modules/emri.js') }` (ose kthe një hyrje ekzistuese "Së shpejti" në modul real duke i shtuar `loader` dhe hequr `soon`).
3. Shto skedarin te `APP_SHELL` në `sw.js` dhe rrit `VERSION`.

Për module liste (CRUD) mjafton konfigurimi i `makeCrud()` — kërkim, filtra, formular, CSV dhe empty states vijnë falas.

## Vendime teknike

- **Pa framework**: HTML5 + CSS modern + Vanilla JS (ES Modules). Një hap i vetëm opsional build-i (esbuild) prodhon `js/bizos.bundle.js` që lejon hapjen direkt me dyklikim (`file://`).
- **Design system me CSS custom properties** (`tokens.css`) në vend të Tailwind CDN: garanton funksionim të plotë offline, zero JS shtesë në runtime dhe temë dritë/errësirë pa flash.
- **Fonte të sistemit**: pa kërkesa rrjeti për fonte — startup i menjëhershëm.
- **Të dhënat**: `localStorage` me strukturë të versionuar, migrime, backup automatik të brendshëm çdo 5 min dhe rikuperim nga dëmtimi. Import me validim të plotë strukture.
- **Siguria**: çdo vlerë e përdoruesit kalon në `esc()` para se të hyjë në DOM; kalkulatori përdor parser të vetin (pa `eval`).
- **Vendor** (të vetmet varësi, të ruajtura lokalisht): [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) dhe [JsBarcode](https://github.com/lindell/JsBarcode) — të dyja MIT, ngarkohen vetëm kur hapen veglat përkatëse.

## Lokalizimi

Gjithçka në shqip, e ndërtuar për Kosovën: valuta **€ (EUR)**, formatimi `sq-AL`, TVSH **18% / 8% / 0%**, fusha NUI/ATK, terminologji vendore biznesi.

---

BIZOS v1.0.3 · Falas përgjithmonë · Të dhënat mbeten te ti
