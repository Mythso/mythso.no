/* common.js – felles header/footer, helt isolert (UTF-8) */

(function(){
  function isNonEmptyStr(v){return typeof v==='string' && v.trim()!==''}
  function normalizeUrl(u){
    if(!isNonEmptyStr(u)) return '';
    if(u.startsWith('/') || u.startsWith('./')) return u;
    if(/^https?:\/\//i.test(u)) return u;
    if(/^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(u)) return 'https://' + u;
    return u;
  }
  function getConfig(){
    const o = (window.siteConfig && typeof window.siteConfig==='object') ? window.siteConfig : {};
    return {
      my_name: o.my_name ?? '',
      linkedin_url: o.linkedin_url ?? '',
      github_url: o.github_url ?? '',
      cv_url: o.cv_url ?? '',
      footer_text: o.footer_text ?? `© ${new Date().getFullYear()}`
    };
  }

  function renderChrome(){
    const c = getConfig();

    // ====== STYLE (namespacet til .chrome-*) ======
    const style = document.createElement('style');
    style.textContent = `
      .chrome-header{position:sticky;top:0;z-index:1000;backdrop-filter:saturate(160%) blur(8px);background:rgba(11,12,16,.55);border-bottom:1px solid rgba(255,255,255,.06)}
      .chrome-wrap{width:min(960px,92%);margin:0 auto}
      .chrome-nav{display:flex;align-items:center;justify-content:space-between;min-height:64px;gap:12px}
      .chrome-brand{display:flex;align-items:center;gap:12px;text-decoration:none;color:#e8eaed;font-weight:700}
      .chrome-logo{width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,#5b8def,#7af0b6)}
      .chrome-links{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
      .chrome-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 12px;border-radius:10px;text-decoration:none;color:#e8eaed;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.04);transition:transform .12s ease,background .12s ease,border-color .12s ease}
      .chrome-btn:active{transform:translateY(1px)}
      .chrome-btn:hover{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.18)}

      .chrome-menu-btn{display:none;align-items:center;justify-content:center;width:40px;height:40px;border-radius:10px;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.04);color:#e8eaed}
      .chrome-menu-icon{position:relative;width:22px;height:14px;display:inline-block}
      .chrome-menu-icon span{position:absolute;left:0;right:0;height:2px;background:#e8eaed;border-radius:2px}
      .chrome-menu-icon span:nth-child(1){top:0}
      .chrome-menu-icon span:nth-child(2){top:6px}
      .chrome-menu-icon span:nth-child(3){bottom:0}

      .chrome-mobile-panel{display:none;position:relative;background:#111218;border-bottom:1px solid rgba(255,255,255,.06)}
      .chrome-mobile-panel .chrome-links{padding:12px;gap:10px;flex-direction:column;align-items:stretch}
      .chrome-mobile-panel .chrome-btn{width:100%;justify-content:center}

      @media (max-width:760px){
        .chrome-menu-btn{display:inline-flex}
        .chrome-links.chrome-desktop{display:none}
        .chrome-mobile-panel.chrome-open{display:block}
      }

      .chrome-footer{margin-top:40px;padding:28px 0 120px;text-align:center;color:#9aa0a6}
      .chrome-footer .chrome-pill{display:inline-block;padding:6px 10px;border:1px solid rgba(255,255,255,.12);border-radius:10px;background:rgba(255,255,255,.04)}
    `;
    document.head.appendChild(style);

    // ====== HEADER ======
    const header = document.createElement('header');
    header.className = 'chrome-header';
    header.innerHTML = `
      <div class="chrome-wrap chrome-nav">
        <a class="chrome-brand" href="/">
          <div class="chrome-logo" aria-hidden="true"></div>
          <span class="chrome-brand-name">${isNonEmptyStr(c.my_name) ? c.my_name : 'mythso'}</span>
        </a>

        <nav class="chrome-links chrome-desktop" id="chromeLinksDesktop" aria-label="Hovedmeny"></nav>

        <button class="chrome-menu-btn" id="chromeMenuBtn" aria-label="Åpne meny" aria-expanded="false" aria-controls="chromeMobilePanel">
          <span class="chrome-menu-icon" aria-hidden="true"><span></span><span></span><span></span></span>
        </button>
      </div>

      <div class="chrome-mobile-panel" id="chromeMobilePanel">
        <nav class="chrome-links" id="chromeLinksMobile" aria-label="Mobilmeny"></nav>
      </div>
    `;
    document.body.prepend(header);

    // Bygg lenker (interne åpnes i samme fane, eksterne i ny)
    const desktop = header.querySelector('#chromeLinksDesktop');
    const mobile  = header.querySelector('#chromeLinksMobile');
    function addLink(label, href, newTab){
      const aD=document.createElement('a'); aD.className='chrome-btn'; aD.href=href; if(newTab){aD.target='_blank'; aD.rel='noopener'}; aD.textContent=label; desktop.appendChild(aD);
      const aM=document.createElement('a'); aM.className='chrome-btn'; aM.href=href; if(newTab){aM.target='_blank'; aM.rel='noopener'}; aM.textContent=label; mobile.appendChild(aM);
    }
    // interne
    addLink('Hjem', '/', false);
    // eksterne
    if(isNonEmptyStr(c.linkedin_url)) addLink('LinkedIn', normalizeUrl(c.linkedin_url), true);
    if(isNonEmptyStr(c.github_url))   addLink('GitHub',   normalizeUrl(c.github_url), true);
    if(isNonEmptyStr(c.cv_url))       addLink('CV',       normalizeUrl(c.cv_url), true);

    // Mobilmeny
    const btn   = header.querySelector('#chromeMenuBtn');
    const panel = header.querySelector('#chromeMobilePanel');
    function closeMenu(){ panel.classList.remove('chrome-open'); btn.setAttribute('aria-expanded','false'); }
    function toggleMenu(){ const open = !panel.classList.contains('chrome-open'); panel.classList.toggle('chrome-open', open); btn.setAttribute('aria-expanded', String(open)); }
    btn.addEventListener('click', toggleMenu);
    panel.addEventListener('click', (e)=>{ const a=e.target.closest('a'); if(a) closeMenu(); });
    window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeMenu(); });
    window.addEventListener('resize', ()=>{ if(window.innerWidth > 760) closeMenu(); });

    // ====== FOOTER ======
    const footer = document.createElement('footer');
    footer.className = 'chrome-footer';
    footer.innerHTML = `
      <div class="chrome-wrap">
        <div class="chrome-pill">${c.footer_text}</div>
      </div>
    `;
    document.body.appendChild(footer);
  }

  window.renderChrome = renderChrome;
})();
