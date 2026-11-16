/* Kevin Ahiavee · animations et interactions */
document.addEventListener('DOMContentLoaded', function(){
  var LANG = (document.documentElement.lang || 'fr').slice(0, 2);
  var I = ({
    fr: {loc:'fr-FR', menu:'Menu', close:'Fermer', copied:'Copié ✓', ex:'Exemple', more:'Lire sur LinkedIn ↗', words:['la communication','la mobilité verte','la mode','le digital','l’événementiel']},
    en: {loc:'en-US', menu:'Menu', close:'Close', copied:'Copied ✓', ex:'Example', more:'Read on LinkedIn ↗', words:['communications','green mobility','lifestyle','digital','events']},
    es: {loc:'es-ES', menu:'Menú', close:'Cerrar', copied:'Copiado ✓', ex:'Ejemplo', more:'Leer en LinkedIn ↗', words:['la comunicación','la movilidad verde','el estilo de vida','lo digital','los eventos']}
  })[LANG] || null;
  if(!I){ I = {loc:'fr-FR', menu:'Menu', close:'Fermer', copied:'Copié ✓', ex:'Exemple', more:'Lire sur LinkedIn ↗', words:['la communication']}; }
  /* Menu des langues : se ferme au clic à l'extérieur ou avec Échap */
  document.addEventListener('click', function(ev){
    Array.prototype.forEach.call(document.querySelectorAll('details.lang[open]'), function(d){ if(!d.contains(ev.target)){ d.removeAttribute('open'); } });
  });
  document.addEventListener('keydown', function(ev){
    if(ev.key === 'Escape'){ Array.prototype.forEach.call(document.querySelectorAll('details.lang[open]'), function(d){ d.removeAttribute('open'); }); }
  });
  /* Mémorise la langue choisie par le visiteur */
  Array.prototype.forEach.call(document.querySelectorAll('[data-lang-link]'), function(a){
    a.addEventListener('click', function(){ if(window.KA_SAVE){ window.KA_SAVE(a.getAttribute('data-lang-link')); } });
  });
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var G = window.gsap, ST = window.ScrollTrigger;
  var anim = !!(G && ST) && !reduce;
  function $(s, c){ return (c || document).querySelector(s); }
  function $$(s, c){ return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* Cartes entreprises : une seule visible à la fois. La suivante n'entre
     à l'écran qu'une fois la précédente épinglée (indispensable sur grands écrans) */
  var stackCards = $$('#ka-track .vp:not(.vp--intro)');
  function stackGaps(){
    stackCards.forEach(function(card, i){
      if(i === stackCards.length - 1){ return; }
      card.style.marginBottom = '';
      var cs = getComputedStyle(card);
      var base = parseFloat(cs.marginBottom) || 0;
      var need = window.innerHeight - (parseFloat(cs.top) || 0) - card.offsetHeight + 16;
      if(need > base){ card.style.marginBottom = need + 'px'; }
    });
  }
  stackGaps();
  window.addEventListener('load', stackGaps);
  var gapT; window.addEventListener('resize', function(){ clearTimeout(gapT); gapT = setTimeout(stackGaps, 150); });
  if(document.fonts && document.fonts.ready){ document.fonts.ready.then(stackGaps); }

  /* E-mail reconstitué en JavaScript, pour le cacher aux robots qui collectent les adresses */
  var mailEl = $('#ka-mail');
  if(mailEl){
    var addr = mailEl.getAttribute('data-u') + '@' + mailEl.getAttribute('data-d');
    mailEl.textContent = addr; mailEl.href = 'mailto:' + addr;
    var mc = document.querySelector('[aria-controls="ka-mail"]'); if(mc){ mc.setAttribute('data-copy', addr); }
  }
  /* Liens externes : jamais d'accès à la page d'origine */
  $$('a[target="_blank"]').forEach(function(a){ a.rel = 'noopener noreferrer'; });

  var y = $('#ka-year'); if(y){ y.textContent = String(new Date().getFullYear()); }

  /* En-tête qui se cache en descendant, barre de progression */
  var head = $('#ka-head'), bar = $('#ka-progress'), lastY = window.scrollY;
  function onScroll(){
    var sy = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
    if(bar){ bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, sy / max) : 0) + ')'; }
    if(head){ head.classList.toggle('hide', sy > lastY && sy > 240); }
    lastY = sy;
  }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* Menu mobile */
  var mb = $('.ka-menu-btn'), menu = $('#ka-menu');
  function closeMenu(){ if(menu){ menu.hidden = true; } if(mb){ mb.setAttribute('aria-expanded','false'); mb.textContent = I.menu; } }
  if(mb && menu){
    mb.addEventListener('click', function(){
      var open = menu.hidden;
      menu.hidden = !open; mb.setAttribute('aria-expanded', open ? 'true' : 'false'); mb.textContent = open ? I.close : I.menu;
      if(open && anim){ G.from($$('a', menu), {y:40, opacity:0, stagger:.06, duration:.6, ease:'expo.out'}); }
    });
    $$('a', menu).forEach(function(a){ a.addEventListener('click', closeMenu); });
  }

  /* Boutons « Copier » */
  $$('[data-copy]').forEach(function(b){
    b.addEventListener('click', function(){
      var t = b.getAttribute('data-copy'), label = b.textContent;
      function ok(){ b.textContent = I.copied; setTimeout(function(){ b.textContent = label; }, 1600); }
      function select(){ var el = document.getElementById(b.getAttribute('aria-controls')); if(!el){ return; } var r = document.createRange(); r.selectNodeContents(el); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }
      try { navigator.clipboard.writeText(t).then(ok, select); } catch(e){ select(); }
    });
  });

  /* Carrousel LinkedIn : flèches */
  var rail = $('#ka-posts');
  function step(dir){ if(!rail){ return; } var c = rail.querySelector('.post'); var w = c ? c.getBoundingClientRect().width + 20 : 320; rail.scrollBy({left: dir * w, behavior: reduce ? 'auto' : 'smooth'}); }
  var pv = $('#ka-prev'), nx = $('#ka-next');
  if(pv){ pv.addEventListener('click', function(){ step(-1); }); }
  if(nx){ nx.addEventListener('click', function(){ step(1); }); }

  /* Mot qui change dans le hero */
  var rot = $('#ka-rot');
  if(rot && !reduce){
    var words = I.words, i = 0;
    setInterval(function(){
      i = (i + 1) % words.length;
      if(G){
        G.to(rot, {yPercent:-110, opacity:0, duration:.35, ease:'power2.in', onComplete:function(){
          rot.textContent = words[i];
          G.fromTo(rot, {yPercent:110, opacity:0}, {yPercent:0, opacity:1, duration:.6, ease:'expo.out'});
        }});
      } else { rot.textContent = words[i]; }
    }, 2400);
  }

  /* Effet magnétique sur les boutons */
  if(!reduce && window.matchMedia('(hover: hover)').matches){
    $$('.magnetic').forEach(function(el){
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = 'translate(' + dx * .25 + 'px,' + dy * .3 + 'px)';
      });
      el.addEventListener('mouseleave', function(){ el.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1)'; el.style.transform = ''; setTimeout(function(){ el.style.transition = ''; }, 600); });
    });
  }

  /* Publications LinkedIn : lues depuis data/linkedin.json (à mettre à jour à chaque nouveau post) */
  if(rail && window.fetch){
    var PROFILE = 'https://www.linkedin.com/in/kevinahiavee';
    var el = function(tag, cls, text){ var n = document.createElement(tag); if(cls){ n.className = cls; } if(text){ n.textContent = text; } return n; };
    var safeUrl = function(u){ return (typeof u === 'string' && /^https:\/\//i.test(u)) ? u : null; };
    fetch((document.documentElement.getAttribute('data-root') || '') + 'data/linkedin.json', {cache:'no-cache'})
      .then(function(res){ if(!res.ok){ throw new Error('json'); } return res.json(); })
      .then(function(d){
        var posts = (d && Array.isArray(d.posts)) ? d.posts : [];
        if(!posts.length){ return; }
        rail.textContent = '';
        posts.slice(0, 12).forEach(function(p){
          var a = el('a', 'post'); a.href = safeUrl(p.url) || PROFILE; a.target = '_blank'; a.rel = 'noopener noreferrer';
          var date = ''; try { if(p.date){ date = new Date(p.date + 'T12:00:00').toLocaleDateString(I.loc, {day:'numeric', month:'long', year:'numeric'}); } } catch(err){}
          var top = el('div', 'top'); top.appendChild(el('span', 'in', 'in')); top.appendChild(el('span', '', date));
          if(p.exemple){ top.appendChild(el('span', 'ex', I.ex)); }
          a.appendChild(top);
          var img = p.image ? (safeUrl(p.image) || (/^assets\//.test(p.image) ? p.image : null)) : null;
          if(img){ var im = document.createElement('img'); im.src = img; im.alt = ''; im.loading = 'lazy'; im.addEventListener('error', function(){ im.hidden = true; }); a.appendChild(im); }
          if(p.titre){ a.appendChild(el('h3', '', String(p.titre))); }
          if(p.texte){ var t = String(p.texte); if(t.length > 240){ t = t.slice(0, 240).replace(/\s+\S*$/, '') + '…'; } a.appendChild(el('p', '', t)); }
          a.appendChild(el('span', 'more', I.more));
          rail.appendChild(a);
        });
        if(window.ScrollTrigger){ window.ScrollTrigger.refresh(); }
      })
      .catch(function(){});
  }

  if(!anim){ return; }
  G.registerPlugin(ST);

  /* Défilement doux sur ordinateur (Lenis), synchronisé avec les animations */
  if(window.Lenis && window.matchMedia('(hover: hover)').matches){
    try {
      var lenis = new window.Lenis({duration:1.1, smoothWheel:true});
      document.documentElement.style.scrollBehavior = 'auto';
      lenis.on('scroll', ST.update);
      G.ticker.add(function(t){ lenis.raf(t * 1000); });
      G.ticker.lagSmoothing(0);
      $$('a[href^="#"]').forEach(function(a){
        a.addEventListener('click', function(ev){
          var id = a.getAttribute('href'); if(id.length < 2){ return; }
          var target = document.querySelector(id); if(!target){ return; }
          ev.preventDefault(); lenis.scrollTo(target, {offset:-80});
        });
      });
    } catch(err){}
  }

  /* Intro du hero */
  var tl = G.timeline({defaults:{ease:'expo.out'}});
  tl.from('.hero h1 .m > span', {yPercent:115, duration:1.2, stagger:.09})
    .fromTo('.hero mark', {backgroundSize:'0% 72%'}, {backgroundSize:'100% 72%', duration:.9, ease:'power3.inOut'}, '-=.7')
    .from('.hero [data-fade]', {y:28, opacity:0, duration:.9, stagger:.08}, '-=.8')
    .from('.blob', {scale:.82, opacity:0, duration:1.4}, .15)
    .from('.chip', {y:24, opacity:0, duration:.9, stagger:.15}, '-=.9');

  /* Apparitions au défilement */
  $$('[data-reveal]').forEach(function(n){
    G.from(n, {y:48, opacity:0, duration:1.1, ease:'expo.out', scrollTrigger:{trigger:n, start:'top 90%', once:true}});
  });

  /* Compteurs */
  $$('[data-count]').forEach(function(n){
    var end = +n.getAttribute('data-count'), o = {v:0};
    G.to(o, {v:end, duration:1.8, ease:'power2.out', scrollTrigger:{trigger:n, start:'top 92%', once:true},
      onUpdate:function(){ n.textContent = Math.round(o.v).toLocaleString(I.loc); }});
  });

  /* Bandeau qui suit le défilement */
  G.to('.mq--s', {xPercent:-22, ease:'none', scrollTrigger:{trigger:'.marquee', start:'top bottom', end:'bottom top', scrub:.6}});
  G.fromTo('.mq--o', {xPercent:-22}, {xPercent:0, ease:'none', scrollTrigger:{trigger:'.marquee', start:'top bottom', end:'bottom top', scrub:.6}});

  /* Texte qui s'illumine mot à mot */
  $$('.scrub').forEach(function(p){
    var walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT), nodes = [], t;
    while((t = walker.nextNode())){ nodes.push(t); }
    nodes.forEach(function(tn){
      var frag = document.createDocumentFragment();
      tn.textContent.split(/(\s+)/).forEach(function(part){
        if(!part){ return; }
        if(/^\s+$/.test(part)){ frag.appendChild(document.createTextNode(part)); return; }
        var s = document.createElement('span'); s.className = 'sw'; s.textContent = part; frag.appendChild(s);
      });
      tn.parentNode.replaceChild(frag, tn);
    });
    G.fromTo($$('.sw', p), {color:'#B9B8CC'}, {color:'#17173A', stagger:.1, ease:'none',
      scrollTrigger:{trigger:p, start:'top 82%', end:'bottom 50%', scrub:true}});
  });

  /* Surlignage progressif de la vision */
  var hls = $$('.vision-title .hl');
  if(hls.length){
    var vt = G.timeline({scrollTrigger:{trigger:'.vision-title', start:'top 78%', end:'bottom 45%', scrub:true}});
    hls.forEach(function(h){ vt.fromTo(h, {backgroundSize:'0% 38%'}, {backgroundSize:'100% 38%', ease:'none'}); });
  }

  /* Trajet Abidjan → Lomé → Cotonou qui se dessine */
  var route = $('#ka-coast .route');
  if(route && route.getTotalLength){
    var len = route.getTotalLength();
    G.fromTo(route, {strokeDasharray:len, strokeDashoffset:len}, {strokeDashoffset:0, ease:'none',
      scrollTrigger:{trigger:'#ka-coast', start:'top 85%', end:'top 35%', scrub:true}});
    G.from('#ka-coast .pin', {scale:0, transformOrigin:'center center', duration:.8, stagger:.25, ease:'back.out(2)',
      scrollTrigger:{trigger:'#ka-coast', start:'top 80%', once:true}});
  }


  /* Frise du parcours : tout est lié au scroll, donc fluide et réversible dans les deux sens */
  var tlBox = $('#ka-tl');
  if(tlBox){
    var items = $$('.tl-item', tlBox), yEl = $('#ka-tl-year');
    var years = items.map(function(it){ return +it.getAttribute('data-year'); });
    var yObj = {v: years[0] || 2018};
    if(items[0]){ items[0].classList.add('is-active'); }
    var range = {trigger:'#ka-tl .tl-list', start:'top 55%', end:'bottom 55%', scrub:.8};

    /* L'année compte au rythme du scroll, vers l'avant comme vers l'arrière */
    var ytl = G.timeline({scrollTrigger:range, defaults:{ease:'none'}});
    for(var k = 1; k < years.length; k++){
      ytl.to(yObj, {v:years[k], duration:1, onUpdate:function(){ if(yEl){ yEl.textContent = String(Math.round(yObj.v)); } }});
    }

    /* Chaque étape s'allume en entrant au centre et s'estompe en sortant */
    items.forEach(function(it){
      G.timeline({scrollTrigger:{trigger:it, start:'top 92%', end:'bottom 8%', scrub:.8}})
        .fromTo(it, {opacity:.18, y:60}, {opacity:1, y:0, duration:1, ease:'power2.out'})
        .to(it, {opacity:1, duration:1.2})
        .to(it, {opacity:.25, y:-30, duration:1, ease:'power2.in'});
      ST.create({trigger:it, start:'top 55%', end:'bottom 55%', onToggle:function(self){
        if(self.isActive){ items.forEach(function(x){ x.classList.toggle('is-active', x === it); }); }
      }});
    });

    G.fromTo('#ka-tl-fill', {scaleX:0}, {scaleX:1, ease:'none', scrollTrigger:{trigger:'#ka-tl .tl-list', start:'top 55%', end:'bottom 55%', scrub:.8}});
    G.fromTo('#ka-tl .tl-line i', {scaleY:0}, {scaleY:1, ease:'none', scrollTrigger:{trigger:'#ka-tl .tl-list', start:'top 55%', end:'bottom 55%', scrub:.8}});
  }

  /* Gros titre du contact */
  G.from('.big .m > span', {yPercent:115, duration:1.2, stagger:.08, ease:'expo.out', scrollTrigger:{trigger:'.big', start:'top 85%', once:true}});

  /* Entreprises : cartes empilées comme des calques qui se recouvrent au scroll */
  var cards = $$('#ka-track .vp:not(.vp--intro)');
  ST.addEventListener('refreshInit', stackGaps);
  cards.forEach(function(card, i){
    var next = cards[i + 1];
    if(!next){ return; }
    var depth = cards.length - 1 - i;
    G.to(card, {scale: 1 - Math.min(depth, 3) * .035, ease:'none',
      scrollTrigger:{trigger:next, start:'top bottom', end:'top 30%', scrub:.5}});
    G.to(card.querySelectorAll(':scope > *:not(.ghost)'), {opacity:.35, ease:'none',
      scrollTrigger:{trigger:next, start:'top 75%', end:'top 30%', scrub:.5}});
  });

  window.addEventListener('load', function(){ ST.refresh(); });
})();

});
