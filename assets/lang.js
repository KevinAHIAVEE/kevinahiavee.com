/* Langue de l'appareil, compatible avec tous les navigateurs (Chrome, Edge, Firefox, Safari, Opera, Samsung Internet, anciens IE) */
window.KA_DEV = function(){
  var list = [];
  try { if(navigator.languages && navigator.languages.length){ list = Array.prototype.slice.call(navigator.languages); } } catch(e){}
  list.push(navigator.language, navigator.userLanguage, navigator.browserLanguage, navigator.systemLanguage);
  try { list.push(Intl.DateTimeFormat().resolvedOptions().locale); } catch(e){}
  for(var i = 0; i < list.length; i++){
    if(!list[i]){ continue; }
    var c = String(list[i]).slice(0, 2).toLowerCase();
    if(c === 'fr' || c === 'en' || c === 'es'){ return c; }
  }
  return 'en';
};
/* Choix manuel du visiteur : gardé tant que la langue de son appareil ne change pas */
window.KA_SAVE = function(l){ try { localStorage.setItem('ka-lang2', JSON.stringify({l: l, d: window.KA_DEV()})); } catch(e){} };
window.KA_WANT = function(){
  if(/bot|crawl|spider|slurp|lighthouse|facebookexternalhit|whatsapp\/|linkedinbot|twitterbot|google-inspectiontool|googleother|bingpreview|yandex|baidu/i.test(navigator.userAgent || '') || navigator.webdriver){ return 'fr'; }
  var dev = window.KA_DEV();
  try {
    var s = JSON.parse(localStorage.getItem('ka-lang2') || 'null');
    if(s && s.d === dev && /^(fr|en|es)$/.test(s.l)){ return s.l; }
  } catch(e){}
  return dev;
};

/* Redirige la page d'accueil vers la bonne langue */
(function(){
  try {
    var path = location.pathname;
    if(/\/(en|es)\//.test(path)){ return; }
    var want = window.KA_WANT();
    if(want === 'en' || want === 'es'){
      var base = path.replace(/index\.html$/, '');
      if(base.slice(-1) !== '/'){ base += '/'; }
      location.replace(base + want + '/' + (window.KA_PREVIEW ? 'index.html' : '') + location.hash);
    }
  } catch(e){}
})();
