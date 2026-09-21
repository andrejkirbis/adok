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
  var mainLinks = NAV.map(function(n){ return '<a href="'+n.href+'">'+n.label+'</a>'; }).join("");

  var footer = ''
    + '<footer><div class="wrap">'
    + '<div class="foot-top">'
    + '<div style="max-width:300px"><img class="foot-logo" src="images/web/adok-logo-white.png" alt="ADOK, gradbeništvo, d.o.o.">'
    + '<p style="margin-top:8px;opacity:.82">Gradbeništvo, novogradnje in adaptacije<br>Sokolska ulica 46, 2000 Maribor</p>'
    + '<p style="margin-top:10px;opacity:.82">'+MOBILE+' &middot; 02 614 01 13<br>adnan.kolcakovic1@gmail.com</p></div>'
    + '<div class="foot-col"><h5>Storitve</h5>'+svcLinks+'</div>'
    + '<div class="foot-col"><h5>Podjetje</h5>'+mainLinks+'</div>'
    + '</div>'
    + '<div class="foot-bottom"><span>&copy; '+new Date().getFullYear()+' ADOK, gradbeništvo, d.o.o. Vse pravice pridržane.</span><span>Matična 5707340 &middot; Davčna SI89707621</span><span>Spletno stran izdelal: <a href="https://storitve-bonal.com/izdelava-spletnih-strani.html" target="_blank" rel="noopener">BONAL</a></span></div>'
    + '</div></footer>';

  var h = document.getElementById("site-header");
  if(h){ h.outerHTML = header; }
  var f = document.getElementById("site-footer");
  if(f){ f.outerHTML = footer; }

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
