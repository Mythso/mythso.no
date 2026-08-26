# mythso.no

Personlig portefølje-/visittkortside for Thomas Myklebust Soleng. Statisk HTML/CSS/JS, driftet gratis via **GitHub Pages** med eget domene (`mythso.no`).

**Live:** https://mythso.no

---

## Arkitektur

Siden er bevisst holdt enkel — ingen build-steg, ingen rammeverk, ren HTML/CSS/vanilla JS. All logikk kjører i nettleseren ved sideinnlasting.

```
mythso.no/
├── index.html          # Forsiden (visittkort + prosjektkort + publiserte saker)
├── project.html         # Detaljside for enkeltprosjekter (leser ?slug= fra URL)
├── config.js             # ALL innholdsdata — navn, bilde, prosjekter, lenker osv.
├── common.js              # Delt header/footer, injiseres av alle sider via renderChrome()
├── profile.jpg              # Profilbilde
├── CV_2026.pdf                # Nedlastbar CV
├── favicon.svg / safari-pinned-tab.svg
├── CNAME                        # GitHub Pages custom domain-fil (inneholder "mythso.no")
└── Gravid_App/, statistikk/        # Statiske undersider for enkeltprosjekter
```

### Hvordan sidene henger sammen

1. **`config.js`** definerer `window.siteConfig` — ett globalt objekt med all tekst, alle lenker og prosjektdata på siden. Dette er den eneste filen du normalt trenger å endre for å oppdatere innhold.
2. **`common.js`** injiserer en delt, lyst-tema sticky header (logo med forbokstav, navigasjonslenker, mobilmeny) og footer på alle sider, basert på data fra `config.js`. Kalles via `window.renderChrome()` i hver sides `<script>`-blokk.
3. **`index.html`** leser `siteConfig` og fyller ut: navn, tittel/tagline, beskrivelse, profilbilde, CTA-knapper (CV/LinkedIn/GitHub), prosjektkort (`featured_projects`-arrayet) og publiserte saker (`published_url(s)`).
4. **`project.html`** kan vise detaljerte undersider for prosjekter definert i `siteConfig.projects` (matches via `?slug=` i URL-en).

### Design

Lyst tema, avrundede kort med myk skygge, pille-formede knapper, rundt profilbilde — inspirert av klassiske "personal portfolio"-maler. Ingen CSS-rammeverk; alt er håndskrevet i `<style>`-blokker i hver HTML-fil (pluss en isolert `.chrome-*`-navngitt stil-blokk injisert av `common.js`).

---

## Oppdatere innhold

**For å endre navn, tittel, bilde, CV-lenke, sosiale lenker, eller legge til/fjerne prosjektkort:** rediger `config.js`. Ingen andre filer trenger å røres for vanlige innholdsendringer.

Prosjektkortene på forsiden styres av `featured_projects`-arrayet, som for øyeblikket viser 9 prosjekter (TryggNett, Cairn, Medarbeiderpuls, Garasjelagportalen, AppDownStatus, Sievoo, Trend Unpacked, Sermo, OppvekstNorge):

```js
featured_projects: [
  {
    icon: "🔒",              // emoji som vises øverst på kortet
    title: "Prosjektnavn",
    description: "Kort, konkret beskrivelse.",
    link: "https://...",      // valgfri — tom streng skjuler knappen
    linkLabel: "Se demo →"
  },
  // ...
]
```

---

## Deployment

- **Hosting:** GitHub Pages, kilde: `main`-branch, rot-mappe (`/`)
- **DNS:** administreres hos Webhuset (A-records mot GitHub Pages sine IP-er + CNAME for `www`)
- **Custom domain:** styres av `CNAME`-filen i repo-roten (må inneholde nøyaktig `mythso.no`)
- Endringer på `main` publiseres automatisk av GitHub Pages, vanligvis innen 1–2 minutter

---

## Historikk (kort)

Siden startet som FTP-hostet statisk HTML hos Webhuset, og ble migrert til GitHub Pages for gratis, versjonskontrollert hosting. Innholdsfilene lå opprinnelig i en `/www`-undermappe (speilet fra FTP-strukturen) og ble flyttet til repo-roten for å fungere med GitHub Pages sin standard build.
