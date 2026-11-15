/* Choisit la version du site selon la langue de l'appareil (une seule fois, sans gêner les robots de Google) */
(function(){
  try {
    var path = location.pathname, onRoot = !/\/(en|es)\//.test(path);
    if(!onRoot){ return; }
    if(/bot|crawl|spider|slurp|google|bing|yandex|baidu|lighthouse|facebookexternalhit|whatsapp|linkedinbot|twitterbot/i.test(navigator.userAgent) || navigator.webdriver){ return; }
    var saved = null; try { saved = localStorage.getItem('ka-lang'); } catch(e){}
    if(saved === 'fr'){ return; }
    var want = saved;
    if(!want){
      var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'fr'];
      for(var i = 0; i < list.length; i++){
        var c = String(list[i]).slice(0, 2).toLowerCase();
        if(c === 'fr' || c === 'en' || c === 'es'){ want = c; break; }
      }
      if(!want){ want = 'en'; }
    }
    if(want === 'en' || want === 'es'){
      var base = path.replace(/index\.html$/, '');
      if(base.slice(-1) !== '/'){ base += '/'; }
      location.replace(base + want + '/' + (window.KA_PREVIEW ? 'index.html' : '') + location.hash);
    }
  } catch(e){}
})();
