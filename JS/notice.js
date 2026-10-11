(function () {
  
  var IMAGE_URL = '';   
  var NEW_URL   = 'https://anipub.org';
  var KEY       = 'anipub_domain_notice_dismissed';
 


  try { if (localStorage.getItem(KEY) === '1') return; } catch (e) {}

  var css = [
   
    'body{display:none!important}',
    '#dn-overlay{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;',
    'padding:12px;box-sizing:border-box;background:#12131a;overflow-y:auto;',
    'font-family:system-ui,-apple-system,"Segoe UI",sans-serif}',
    '#dn-overlay *{box-sizing:border-box}',
    '#dn-box{position:relative;width:100%;max-width:480px;max-height:100%;overflow-y:auto;background:#1c1e2b;color:#f2f2f7;',
    'border:1px solid #343852;border-left:5px solid #ff4d6d;border-radius:10px;box-shadow:0 20px 50px rgba(0,0,0,.5)}',
    '#dn-img{display:none;width:100%;height:auto;max-height:240px;object-fit:cover;border-radius:5px 5px 0 0}',
    '#dn-body{padding:22px}',
    '#dn-box h2{margin:0 0 12px;padding-right:24px;font-size:clamp(1.1rem,4.5vw,1.3rem);line-height:1.3;color:#fff}',
    '#dn-box p{margin:0 0 12px;line-height:1.55;color:#c9cbe0;font-size:.97rem}',
    '#dn-box s{color:#8a8da8}#dn-box strong{color:#fff}',
    '#dn-actions{display:flex;gap:10px;margin-top:18px;flex-wrap:wrap}',
    '.dn-btn{flex:1 1 140px;min-height:44px;padding:12px 16px;border-radius:8px;border:1px solid #ff4d6d;',
    'font:600 .95rem inherit;font-family:inherit;text-align:center;text-decoration:none;cursor:pointer;display:flex;align-items:center;justify-content:center}',
    '#dn-go{background:#ff4d6d;color:#fff}#dn-go:hover{background:#ff6b85}',
    '#dn-close{background:transparent;color:#c9cbe0;border-color:#4a4e6b}#dn-close:hover{background:#262941}',
    '#dn-x{position:absolute;top:8px;right:8px;width:36px;height:36px;border:0;border-radius:50%;z-index:2;',
    'background:rgba(18,19,26,.65);color:#fff;font-size:1.5rem;line-height:1;cursor:pointer}',
    '#dn-x:hover{background:rgba(255,77,109,.9)}',
    '@media(max-width:480px){#dn-body{padding:18px 16px}#dn-img{max-height:180px}',
    '#dn-actions{flex-direction:column}.dn-btn{flex-basis:auto;width:100%}}',
    '@media(max-height:420px){#dn-img{max-height:110px}}'
  ].join('');

  var style = document.createElement('style');
  style.id = 'dn-style';
  style.textContent = css;
  document.documentElement.appendChild(style);  

  var overlay = document.createElement('div');
  overlay.id = 'dn-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.innerHTML =
    '<div id="dn-box">' +
      '<button id="dn-x" aria-label="Close">&times;</button>' +
      '<img id="dn-img" alt="AniPub is moving to AniPub.org">' +
      '<div id="dn-body">' +
        '<h2>We\'re moving to a new domain</h2>' +
        '<p>We are switching our domain from <s>AniPub.xyz</s> to <strong>AniPub.org</strong>.</p>' +
        '<p>In a few days, AniPub.xyz will stop working. Switch to AniPub.org now and keep watching anime like you always have.</p>' +
        '<div id="dn-actions">' +
          '<a class="dn-btn" id="dn-go" href="' + NEW_URL + '">Go to AniPub.org</a>' +
          '<button class="dn-btn" id="dn-close">Got it</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.documentElement.appendChild(overlay); 

  // Image only shows if it loads
  if (IMAGE_URL) {
    var img = overlay.querySelector('#dn-img');
    img.onload = function () { img.style.display = 'block'; };
    img.src = IMAGE_URL;
  }

 
  function close() {
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    if (style.parentNode) style.parentNode.removeChild(style);
    document.removeEventListener('keydown', onKey);
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
  }
  function onKey(e) { if (e.key === 'Escape') close(); }

  overlay.querySelector('#dn-x').addEventListener('click', close);
  overlay.querySelector('#dn-close').addEventListener('click', close);
  overlay.querySelector('#dn-go').addEventListener('click', close);
  document.addEventListener('keydown', onKey);
})();