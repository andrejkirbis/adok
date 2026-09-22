/* ADOK, gradbeništvo, d.o.o. — skupna logika za vse strani
   Vstavi glavo in nogo, poskrbi za mobilni meni, animacije ob drsenju
   in učinek "žive" fotografije (parallax + zoom ob prehodu miške). */
(function(){
  var MOBILE = "069 673 013";

  var NAV = [
    {href:"index.html",    id:"domov",    label:"Domov"},
    {href:"storitve.html", id:"storitve", label:"Storitve"},
    {href:"o-nas.html",    id:"o-nas",    label:"O nas"},
    {href:"zakaj.html",    id:"zakaj",    label:"Zakaj mi"},
    {href:"kontakt.html",  id:"kontakt",  label:"Kontakt"}
  ];

  var SERVICES = [
    {href:"novogradnje.html",     label:"Novogradnje"},
    {href:"prenove.html",         label:"Prenove in adaptacije"},
    {href:"fasade.html",          label:"Fasade"},
    {href:"strehe.html",          label:"Strehe"},
    {href:"suhomontaza.html",     label:"Suhomontaža (knauf)"},
    {href:"ploscice.html",        label:"Polaganje ploščic"},
    {href:"kamen.html",           label:"Kamnite obloge"},
    {href:"skarpe.html",          label:"Škarpe in podporni zidovi"},
    {href:"zemeljska-dela.html",  label:"Zemeljska dela"}
  ];

  var active = document.body.getAttribute("data-page") || "domov";

  var logo = '<img class="brand-logo" src="images/web/adok-logo.png" alt="ADOK, gradbeništvo, d.o.o.">';

  var navItems = NAV.map(function(n){
    return '<li><a href="'+n.href+'"'+(n.id===active?' class="active"':'')+'>'+n.label+'</a></li>';
  }).join("");

  var header = ''
    + '<header><div class="wrap nav">'
    + '<a class="brand" href="index.html" aria-label="ADOK, gradbeništvo, d.o.o.">'+logo+'</a>'
    + '<nav><ul>'+navItems+'</ul></nav>'
    + '<div class="nav-right">'
    + '<a class="nav-phone" href="tel:+38669673013"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#262A2E" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg><span>'+MOBILE+'</span></a>'
    + '<button class="menu-toggle" aria-label="Odpri meni" aria-expanded="false" aria-controls="glavni-meni"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>'
    + '</div></div></header>';

  var svcLinks = SERVICES.map(function(s){ return '<a href="'+s.href+'">'+s.label+'</a>'; }).join("");
  var mainLinks = NAV.map(function(n){ return '<a href="'+n.href+'">'+n.label+'</a>'; }).join("")
    + '<a href="politika-zasebnosti.html">Politika zasebnosti</a>';

  var footer = ''
    + '<footer><div class="wrap">'
    + '<div class="foot-top">'
    + '<div style="max-width:300px"><img class="foot-logo" src="images/web/adok-logo-white.png" alt="ADOK, gradbeništvo, d.o.o.">'
    + '<p style="margin-top:8px;opacity:.82">Gradbeništvo, novogradnje in adaptacije<br>Sokolska ulica 46, 2000 Maribor</p>'
    + '<p style="margin-top:10px;opacity:.82">'+MOBILE+'<br>adok.doo@gmail.com</p></div>'
    + '<div class="foot-col"><h5>Storitve</h5>'+svcLinks+'</div>'
    + '<div class="foot-col"><h5>Podjetje</h5>'+mainLinks+'</div>'
    + '</div>'
    + '<div class="foot-bottom"><span>&copy; '+new Date().getFullYear()+' ADOK, gradbeništvo, d.o.o. Vse pravice pridržane.</span><span>Matična 5707340 &middot; Davčna SI89707621</span><span><button type="button" class="privacy-settings" data-privacy-settings>Nastavitve zasebnosti</button></span><span>Spletno stran izdelal: <a href="https://storitve-bonal.com/izdelava-spletnih-strani.html" target="_blank" rel="noopener">BONAL</a></span></div>'
    + '</div></footer>';

  var h = document.getElementById("site-header");
  if(h){ h.outerHTML = header; }
  var f = document.getElementById("site-footer");
  if(f){ f.outerHTML = footer; }

  var COOKIE_KEY = "adokCookieConsent";
  var COOKIE_VERSION = 1;
  var COOKIE_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;
  var GA_MEASUREMENT_ID = "G-X4ZNPEY2H7";
  var analyticsLoaded = false;

  function readConsent(){
    var raw;
    try { raw = localStorage.getItem(COOKIE_KEY); }
    catch(e){ return null; }
    if(!raw) return null;
    try {
      var parsed = JSON.parse(raw);
      var age = Date.now() - Date.parse(parsed.timestamp || "");
      if(!parsed || parsed.version !== COOKIE_VERSION || !isFinite(age) || age > COOKIE_MAX_AGE_MS) return null;
      return parsed;
    } catch(e){ return null; }
  }

  function writeConsent(partial){
    var consent = {
      version: COOKIE_VERSION,
      essential: true,
      analytics: Boolean(partial.analytics),
      maps: Boolean(partial.maps),
      timestamp: new Date().toISOString()
    };
    try { localStorage.setItem(COOKIE_KEY, JSON.stringify(consent)); }
    catch(e){}
    return consent;
  }

  function loadMaps(){
    document.querySelectorAll("[data-external-src][data-consent-category='maps']").forEach(function(el){
      if(!el.getAttribute("src")){ el.setAttribute("src", el.getAttribute("data-external-src")); }
      var box = el.closest(".external-service");
      if(box){ box.classList.add("is-loaded"); }
    });
  }

  function unloadMaps(){
    document.querySelectorAll("[data-external-src][data-consent-category='maps']").forEach(function(el){
      el.removeAttribute("src");
      var box = el.closest(".external-service");
      if(box){ box.classList.remove("is-loaded"); }
    });
  }

  function loadAnalytics(){
    if(analyticsLoaded || !GA_MEASUREMENT_ID){ return; }
    analyticsLoaded = true;
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_MEASUREMENT_ID);
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });
  }

  function applyConsent(consent){
    consent = consent || readConsent();
    if(consent && consent.maps){ loadMaps(); } else { unloadMaps(); }
    if(consent && consent.analytics){ loadAnalytics(); }
  }

  function createCookieUi(){
    if(document.getElementById("cookie-banner")){ return; }
    var banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.id = "cookie-banner";
    banner.hidden = true;
    banner.style.display = "none";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Obvestilo o piškotkih");
    banner.innerHTML = ''
      + '<div class="cookie-banner-inner">'
      + '<div class="cookie-banner-text">'
      + '<h2>Piškotki in zasebnost</h2>'
      + '<p>Uporabljamo nujno lokalno shrambo za shranjevanje vaše izbire. Google Analytics in Google Maps se naložita samo, če to dovolite. <button type="button" class="cookie-link" id="cookie-more" onclick="window.ADOKCookieConsent.openSettings()">Preberi več</button></p>'
      + '</div>'
      + '<div class="cookie-banner-actions">'
      + '<button type="button" class="cookie-btn" id="cookie-accept" onclick="window.ADOKCookieConsent.acceptAll()">Sprejmi vse</button>'
      + '<button type="button" class="cookie-btn secondary" id="cookie-reject" onclick="window.ADOKCookieConsent.rejectOptional()">Zavrni neobvezne</button>'
      + '<button type="button" class="cookie-btn secondary" id="cookie-manage" onclick="window.ADOKCookieConsent.openSettings()">Prilagodi</button>'
      + '</div>'
      + '</div>';

    var overlay = document.createElement("div");
    overlay.className = "cookie-modal-overlay";
    overlay.id = "cookie-modal-overlay";
    overlay.hidden = true;
    overlay.style.display = "none";
    overlay.innerHTML = ''
      + '<div class="cookie-modal" role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title">'
      + '<button type="button" class="cookie-modal-close" id="cookie-modal-close" aria-label="Zapri" onclick="window.ADOKCookieConsent.closeSettings()">&times;</button>'
      + '<h2 id="cookie-modal-title">Vaše možnosti zasebnosti</h2>'
      + '<p>Neobvezne kategorije lahko kadarkoli sprejmete ali zavrnete. Izbira se shrani v vašem brskalniku.</p>'
      + '<div class="cookie-category">'
      + '<div><h3>Analitika</h3><p>Google Analytics pomaga razumeti obisk strani in izboljšati vsebino.</p></div>'
      + '<label class="cookie-toggle"><input type="checkbox" id="cookie-cat-analytics" data-category="analytics"><span>Vključi</span></label>'
      + '</div>'
      + '<div class="cookie-category">'
      + '<div><h3>Google Maps</h3><p>Zemljevid na strani Kontakt se naloži šele po vaši potrditvi.</p></div>'
      + '<label class="cookie-toggle"><input type="checkbox" id="cookie-cat-maps" data-category="maps"><span>Vključi</span></label>'
      + '</div>'
      + '<div class="cookie-category">'
      + '<div><h3>Nujno potrebno</h3><p>Shrani vašo izbiro in omogoča osnovno delovanje strani.</p></div>'
      + '<label class="cookie-toggle"><input type="checkbox" checked disabled><span>Vedno vključeno</span></label>'
      + '</div>'
      + '<button type="button" class="cookie-save" id="cookie-save" onclick="window.ADOKCookieConsent.saveSettings()">Shrani nastavitve</button>'
      + '<p class="cookie-small">Več informacij je v <a href="politika-zasebnosti.html">politiki zasebnosti</a>.</p>'
      + '</div>';

    document.body.appendChild(banner);
    document.body.appendChild(overlay);
  }

  function applyToggleStates(consent){
    document.querySelectorAll("#cookie-modal-overlay input[data-category]").forEach(function(toggle){
      var category = toggle.getAttribute("data-category");
      toggle.checked = Boolean(consent && consent[category]);
    });
  }

  function hideBanner(){
    var banner = document.getElementById("cookie-banner");
    if(banner){ banner.hidden = true; banner.style.display = "none"; }
  }

  function showBanner(){
    var banner = document.getElementById("cookie-banner");
    if(banner){ banner.hidden = false; banner.style.display = ""; }
  }

  function openModal(){
    var overlay = document.getElementById("cookie-modal-overlay");
    if(!overlay){ return; }
    applyToggleStates(readConsent());
    overlay.hidden = false;
    overlay.style.display = "";
    document.body.style.overflow = "hidden";
    var closeBtn = document.getElementById("cookie-modal-close");
    if(closeBtn){ closeBtn.focus(); }
  }

  function closeModal(){
    var overlay = document.getElementById("cookie-modal-overlay");
    if(!overlay){ return; }
    overlay.hidden = true;
    overlay.style.display = "none";
    document.body.style.overflow = "";
  }

  function saveConsent(partial){
    var consent = writeConsent(partial);
    applyToggleStates(consent);
    hideBanner();
    closeModal();
    applyConsent(consent);
  }

  window.ADOKCookieConsent = {
    acceptAll: function(){ saveConsent({ analytics: true, maps: true }); },
    rejectOptional: function(){ saveConsent({ analytics: false, maps: false }); },
    openSettings: openModal,
    closeSettings: closeModal,
    saveSettings: function(){
      var partial = {};
      document.querySelectorAll("#cookie-modal-overlay input[data-category]").forEach(function(toggle){
        partial[toggle.getAttribute("data-category")] = toggle.checked;
      });
      saveConsent(partial);
    },
    allowMaps: function(){
      var current = readConsent();
      saveConsent({ analytics: Boolean(current && current.analytics), maps: true });
    }
  };

  createCookieUi();
  var storedConsent = readConsent();
  if(storedConsent){ hideBanner(); applyConsent(storedConsent); }
  else { showBanner(); applyConsent(null); }

  var acceptBtn = document.getElementById("cookie-accept");
  var rejectBtn = document.getElementById("cookie-reject");
  var manageBtn = document.getElementById("cookie-manage");
  var moreBtn = document.getElementById("cookie-more");
  var saveBtn = document.getElementById("cookie-save");
  var closeBtn = document.getElementById("cookie-modal-close");
  var overlay = document.getElementById("cookie-modal-overlay");

  if(acceptBtn){ acceptBtn.addEventListener("click", function(){ saveConsent({ analytics: true, maps: true }); }); }
  if(rejectBtn){ rejectBtn.addEventListener("click", function(){ saveConsent({ analytics: false, maps: false }); }); }
  if(manageBtn){ manageBtn.addEventListener("click", openModal); }
  if(moreBtn){ moreBtn.addEventListener("click", openModal); }
  if(saveBtn){
    saveBtn.addEventListener("click", function(){
      var partial = {};
      document.querySelectorAll("#cookie-modal-overlay input[data-category]").forEach(function(toggle){
        partial[toggle.getAttribute("data-category")] = toggle.checked;
      });
      saveConsent(partial);
    });
  }
  if(closeBtn){ closeBtn.addEventListener("click", closeModal); }
  if(overlay){ overlay.addEventListener("click", function(event){ if(event.target === overlay){ closeModal(); } }); }
  document.addEventListener("keydown", function(event){ if(event.key === "Escape"){ closeModal(); } });
  document.addEventListener("click", function(event){
    if(event.target.closest("[data-privacy-settings]")){ openModal(); }
    if(event.target.closest("[data-load-external]")){
      saveConsent({ analytics: Boolean(readConsent() && readConsent().analytics), maps: true });
    }
  });

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mobile menu */
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.querySelector('nav ul');
  if(toggle && menu){
    menu.id = menu.id || 'glavni-meni';
    toggle.addEventListener('click', function(){
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* Reveal on scroll */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if(reduceMotion || !('IntersectionObserver' in window)){
    reveals.forEach(function(el){ el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
    reveals.forEach(function(el){ io.observe(el); });
    /* Karkoli je že v vidnem polju ob nalaganju, prikaži takoj s stopnjevanjem */
    requestAnimationFrame(function(){
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var i = 0;
      reveals.forEach(function(el){
        var r = el.getBoundingClientRect();
        if(r.top < vh*0.92){ el.style.transitionDelay = (i*0.06)+'s'; el.classList.add('is-visible'); io.unobserve(el); i++; }
      });
    });
  }

  /* Žive fotografije: parallax ob drsenju (zoom ob hoverju je v CSS) */
  function updateAlive(){
    if(reduceMotion) return;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    document.querySelectorAll('.photo-frame.alive').forEach(function(frame){
      var inner = frame.querySelector('.photo-inner'); if(!inner) return;
      var r = frame.getBoundingClientRect();
      if(r.bottom < -80 || r.top > vh + 80) return;
      var center = r.top + r.height/2;
      var d = (center - vh/2)/vh;
      var prox = 1 - Math.min(Math.abs(d)*1.8, 1);
      var scale = 1.04 + prox*0.07;
      var ty = d*16;
      inner.style.transform = 'translateY('+ty.toFixed(1)+'px) scale('+scale.toFixed(3)+')';
    });
  }
  var ticking = false;
  function onScroll(){ if(!ticking){ window.requestAnimationFrame(function(){ updateAlive(); ticking=false; }); ticking=true; } }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll);
  setTimeout(updateAlive, 200);
})();
