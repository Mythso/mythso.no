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
      icon: "📡",
      title: "AppDownStatus",
      description: "Crowdsourcet nedetids-overvåking for over 100 populære tjenester fordelt på 14 kategorier. Brukere stemmer i sanntid på om en tjeneste er nede, med feilkode-leksikon og automatisk ukentlig import av norske tjenester.",
      link: "https://appdownstatus.com",
      linkLabel: "Besøk siden →"
    },
    {
      icon: "📊",
      title: "Sievoo",
      description: "Finans-SaaS for tallfokuserte investorer: DCF-verdsettelsesmotor, automatiserte ukentlige verdsettelser, porteføljedashboard, FIRE-kalkulator og et transparent investormiljø.",
      link: "https://sievoo.com",
      linkLabel: "Se live →"
    },
    {
      icon: "💬",
      title: "Medarbeiderpuls",
      description: "Daglig, anonym pulsmåling for ansattes trivsel — kun en teamkode kreves, ingen personopplysninger lagres. Arbeidsgivere får sanntidsdashboard med helsescore, trender og nøkkelordanalyse.",
      link: "https://www.medarbeiderpuls.no",
      linkLabel: "Besøk siden →"
    },
    {
      icon: "🛡️",
      title: "TryggNett",
      description: "Mobil nettleser (Android først) som kun tillater navigasjon til domener godkjent via AppDownStatus sin allowlist-API. Blokkerer alt annet innhold med tydelig forklaring til brukeren.",
      link: "",
      linkLabel: ""
    },
    {
      icon: "🚗",
      title: "GarasjePortalen",
      description: "Internportal for garasjelaget ved Heggedal Terrasse borettslag. Beboere logger inn med personlig plasskode og rapporterer hendelser; administratorer får full oversikt med statistikk og CSV-eksport. Eget domene (htgp.no) er under utrulling.",
      link: "",
      linkLabel: ""
    },
    {
      icon: "🔒",
      title: "Cairn",
      description: "Ultralett compliance-motor for NIS2 Artikkel 21 — helt uten database. Logger lagres som roterende JSON-Lines-filer, XML-drevne regler utfører automatisk gap-analyse, og systemet genererer PDF-bevis for revisorer.",
      link: "",
      linkLabel: ""
    },
    {
      icon: "🗣️",
      title: "Sermo",
      description: "AI-basert uttale-coach for språklæring (React Native/Expo). Brukeren lytter til en AI-generert frase, spiller inn egen uttale og får poengsum og tilbakemelding på eget morsmål, med strek-telling og resultattavle.",
      link: "",
      linkLabel: ""
    },
    {
      icon: "🎬",
      title: "Trend Unpacked",
      description: "YouTube Shorts-kanal som daglig pakker ut hva som skjer i verden akkurat nå — og hvorfor. Kort, kildebasert og uten fyllstoff.",
      link: "https://www.youtube.com/@trendunpacked",
      linkLabel: "Se kanalen →"
    },
    {
      icon: "👶",
      title: "OppvekstNorge",
      description: "Kuratert digital veileder for foreldre med barn 0–5 år. Aldersinndelte råd, lynraskt søk og direkte lenker til offentlige kilder som Helsenorge og Bufdir. Domenet oppvekstnorge.no er reservert; MVP er under arbeid.",
      link: "",
      linkLabel: ""
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
