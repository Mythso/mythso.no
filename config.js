window.siteConfig = {
  my_name: "Thomas Myklebust Soleng",
  my_description: "Liker å lære nye ting som helst kan brukes til noe fornuftig",
  my_title: "Teknologientusiast",
  linkedin_url: "https://www.linkedin.com/in/thomas-soleng",
  linkedin_profile_pic_url: "https://media.licdn.com/dms/image/v2/D4D03AQGluRiGrsEhwQ/profile-displayphoto-shrink_800_800/B4DZZsYJxwHwAc-/0/1745574993524?e=1762387200&v=beta&t=Wz4vWxRclFGuNTu8OLCd3HEMu79LHgdpaNpVB3IQGVU",
  github_url: "https://github.com/Mythso",
  published_url: "https://www.digi.no/tumstudio/digitalisering-og-offentlig-it/annonse-her-kan-de-bryne-seg-pa-it-rollene-du-ikke-visste-fantes/557319",
  project_urls: ["Gravid App","Allowlist Browser"],
  cv_url: "CV_2025.pdf",

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
    },
    {
      title: "Allowlist Browser",
      slug: "Allowlist_Browser",
      url: "/Allowlist_Browser",
      intro: "Kort intro om prosjektet.",
      links: [{ label: "Nettside", href: "https://mythso.no/Allowlist_Browser" }, { label: "Allowlist", href: "https://mythso.no/Allowlist_Browser/allowlist.html"}],
      sections: [
        { heading: "Bakgrunn", text: "Prosjektet ble til siden jeg har sett internett er for utrygt. Derfor er denne nettleseren kun mulig å bruke der jeg har godkjent nettsidene." },
        { heading: "Teknologi", text: "Kotlin" }
      ]
    }
  ],

  // NYTT: footer-tekst (styrer alle sider)
  footer_text: "© 2025 mythso. Alle rettigheter reservert."
};
