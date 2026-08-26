window.siteConfig = {
  my_name: "Thomas Myklebust Soleng",
  my_description: "Liker å lære nye ting som helst kan brukes til noe fornuftig",
  my_title: "Teknologientusiast",
  linkedin_url: "https://www.linkedin.com/in/thomas-soleng",
  linkedin_profile_pic_url: "/profile.jpg",
  github_url: "https://github.com/Mythso",
  published_url: "https://www.digi.no/tumstudio/digitalisering-og-offentlig-it/annonse-her-kan-de-bryne-seg-pa-it-rollene-du-ikke-visste-fantes/557319",

  // Utvalgte prosjekter (vises som kort på forsiden)
  featured_projects: [
    {
      icon: "🛡️",
      title: "TryggNett",
      description: "Android-nettleser (tidligere «AllowlistBrowser») som kun tillater navigasjon til domener godkjent via api.appdownstatus.com. Viser tydelig forklaring ved blokkering — svindel/phishing, skadevare, ulovlig eller upassende innhold.",
      link: "",
      linkLabel: ""
    },
    {
      icon: "🔒",
      title: "Cairn",
      description: "NIS2 Compliance Engine — automatiserer etterlevelse av EUs nye cybersikkerhetsdirektiv for virksomheter.",
      link: "https://replit.com/@mythso/NIS2-Compliance-Engine",
      linkLabel: "Se demo →"
    },
    {
      icon: "💬",
      title: "Medarbeiderpuls",
      description: "Kontinuerlig, anonym pulsmåling for ansattes trivsel, solgt til norske virksomheter og offentlig sektor. Ansatte svarer med kun en teamkode (ingen innlogging) — arbeidsgivere får sanntidsdashboard med helsescore og trender.",
      link: "https://replit.com/@mythso/Pulse-Insight",
      linkLabel: "Se demo →"
    },
    {
      icon: "🚗",
      title: "Garasjelagportalen",
      description: "Internportal for garasjelaget ved Heggedal Terrasse borettslag. Beboere logger inn med personlig plasskode og rapporterer hendelser; administratorer får full oversikt med statistikk, CSV-eksport og varsling.",
      link: "https://garasje-frontend-production.up.railway.app",
      linkLabel: "Se prosjekt →"
    },
    {
      icon: "📡",
      title: "AppDownStatus",
      description: "Crowdsourcet nedetids-overvåking for ~90 populære tjenester (sosiale medier, streaming, spill, AI, bank m.fl.) fordelt på 14 kategorier, med feilkode-leksikon og forslag til nye tjenester.",
      link: "https://appdownstatus.com",
      linkLabel: "Besøk siden →"
    },
    {
      icon: "📊",
      title: "Sievoo",
      description: "Finans-SaaS for tallfokuserte investorer: DCF-verdsettelsesmotor, automatiserte ukentlige verdsettelser, porteføljedashboard, FIRE-kalkulator og et transparent investormiljø — ingen synsing, bare matte.",
      link: "https://sievoo.com",
      linkLabel: "Se live →"
    },
    {
      icon: "🎬",
      title: "Trend Unpacked",
      description: "YouTube Shorts-kanal som pakker ut hva som skjer i verden akkurat nå — og hvorfor. Daglige videoer bygget på minst to uavhengige kilder, ingen fyllstoff, ingen clickbait.",
      link: "https://www.youtube.com/@trendunpacked",
      linkLabel: "Se kanalen →"
    },
    {
      icon: "🗣️",
      title: "Sermo",
      description: "AI-basert uttale-coach for språklæring (React Native/Expo). Brukeren snakker inn en frase og får AI-vurdert score samt tilbakemelding på eget morsmål, med strek-telling og resultatoversikt.",
      link: "https://replit.com/@mythso/Speak-Skill",
      linkLabel: "Se demo →"
    },
    {
      icon: "👶",
      title: "OppvekstNorge",
      description: "Kuratert digital veileder for foreldre og familier med barn 0–5 år. Aldersinndelte råd, lynraskt søk og direkte lenker til offentlige kilder som Helsenorge, NAV og Bufdir.",
      link: "https://oppvekstnorge.no",
      linkLabel: "Besøk siden →"
    }
  ],
  cv_url: "CV_2026.pdf",

  // Brukes av /allowlist.html
  allow_hosts: [
    "nrk.no",
    "www.nrk.no",
    "vg.no",
    "www.vg.no",
    "uio.no",
    "www.uio.no",
    "*.altinn.no"
  ],

  // Prosjekter til detaljsider
  projects: [
    {
      title: "Gravid App",
      slug: "Gravid_App",
      url: "/Gravid_App",
      intro: "Kort intro om hva Gravid App er.",
      links: [{ label: "Nettside", href: "https://mythso.no/Gravid_App" }],
      sections: [
        { heading: "Bakgrunn", text: "Til tider litt vanskelig å være gravid i Norge. Har derfor prøvd å gjøre det lettere å finne informasjon og tips" },
        { heading: "Teknologi", text: "Kotlin" }
      ]
    }
  ],

  // NYTT: footer-tekst (styrer alle sider)
  footer_text: "© 2026 mythso. Alle rettigheter reservert."
};
