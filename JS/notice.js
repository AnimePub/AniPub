(function () {
  var IMAGE_URL = 'https://raw.githubusercontent.com/AnimePub/AniPub/refs/heads/main/Logo/Ship.png';
  var APK_URL   = 'https://github.com/AnimePub/AniPub-APP/raw/master/app/release/app-release.apk';
  var KEY       = 'anipub_app_notice_dismissed';

  try { if (localStorage.getItem(KEY) === '1') return; } catch (e) {}

  var css = [
    '#ah-overlay{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;',
    'padding:12px;box-sizing:border-box;background:rgba(6,20,36,.88);overflow-y:auto;',
    'font-family:Georgia,"Times New Roman",serif}',
    '#ah-overlay *{box-sizing:border-box}',
    '#ah-box{position:relative;width:100%;max-width:500px;max-height:100%;overflow-y:auto;',
    'background:linear-gradient(180deg,#f4e4bc 0%,#e8cf93 100%);color:#3b2412;',
    'border:4px solid #b8860b;border-radius:14px;',
    'box-shadow:0 0 0 2px #5a3a16,0 24px 60px rgba(0,0,0,.6);',
    'background-image:radial-gradient(circle at 20% 10%,rgba(255,255,255,.35) 0,transparent 40%),',
    'repeating-linear-gradient(0deg,rgba(90,58,22,.04) 0 2px,transparent 2px 6px),',
    'linear-gradient(180deg,#f4e4bc 0%,#e8cf93 100%)}',
    '#ah-wave{height:28px;background:',
    'radial-gradient(circle at 10px 28px,#0b3d62 12px,transparent 13px) 0 0/20px 28px repeat-x,',
    'linear-gradient(#0b3d62,#0b3d62);border-radius:10px 10px 0 0;opacity:.9}',
    '#ah-img{display:none;width:100%;height:auto;max-height:220px;object-fit:cover;',
    'border-bottom:3px solid #b8860b}',
    '#ah-body{padding:22px 24px 24px}',
    '#ah-tag{display:inline-block;margin-bottom:8px;padding:3px 10px;font-size:.75rem;letter-spacing:.12em;',
    'text-transform:uppercase;color:#f4e4bc;background:#7a1e1e;border-radius:4px}',
    '#ah-box h2{margin:0 0 10px;padding-right:28px;font-size:clamp(1.3rem,5vw,1.6rem);line-height:1.2;color:#5a1d12}',
    '#ah-box p{margin:0 0 12px;line-height:1.55;font-size:.98rem;color:#4a2f18}',
    '#ah-box ul{margin:0 0 14px;padding:0;list-style:none}',
    '#ah-box li{margin:0 0 6px;padding-left:24px;position:relative;font-size:.95rem;color:#4a2f18}',
    '#ah-box li:before{content:"\\2693";position:absolute;left:0;top:0}',
    '.ah-note{margin:14px 0 0;padding:10px 12px;font-size:.88rem;border:1px dashed #8a5a1e;border-radius:8px;background:rgba(255,255,255,.35)}',
    '#ah-actions{display:flex;gap:10px;margin-top:18px;flex-wrap:wrap}',
    '.ah-btn{flex:1 1 150px;min-height:44px;padding:12px 16px;border-radius:8px;border:2px solid #5a1d12;',
    'font:700 .98rem Georgia,serif;text-align:center;text-decoration:none;cursor:pointer;',
    'display:flex;align-items:center;justify-content:center;gap:6px}',
    '#ah-get{background:#7a1e1e;color:#f4e4bc}#ah-get:hover{background:#94262a}',
    '#ah-later{background:transparent;color:#5a1d12}#ah-later:hover{background:rgba(90,29,18,.08)}',
    '#ah-x{position:absolute;top:44px;right:10px;width:36px;height:36px;border:0;border-radius:50%;z-index:2;',
    'background:#5a1d12;color:#f4e4bc;font-size:1.4rem;line-height:1;cursor:pointer}',
    '#ah-x:hover{background:#7a1e1e}',
    '@media(max-width:480px){#ah-body{padding:18px 16px}#ah-img{max-height:160px}',
    '#ah-actions{flex-direction:column}.ah-btn{flex-basis:auto;width:100%}}',
    '@media(max-height:420px){#ah-img{max-height:100px}}'
  ].join('');

  var style = document.createElement('style');
  style.id = 'ah-style';
  style.textContent = css;
  document.documentElement.appendChild(style);

  var overlay = document.createElement('div');
  overlay.id = 'ah-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.innerHTML =
    '<div id="ah-box">' +
      '<div id="ah-wave"></div>' +
      '<button id="ah-x" aria-label="Close">&times;</button>' +
      '<img  style="position: absolute; bottom: 0; left: 0; width: 80px; opacity: 0.5;" id="ah-img" alt="Captain AniPub">' +
      '<div id="ah-body">' +
        '<span id="ah-tag">Breaking News from the Red Lines</span>' +
        '<h2>Ahoy, matey! The Android crew is ready!</h2>' +
        '<p>Captain Adnan here. Our Android app has finally set sail, and it\'s built to fit in your pocket.</p>' +
        '<ul>' +
          '<li>Fully Ad blocking Unlike the Website</li>' +
          '<li>Offline Downloading</li>' +
          '<li>Offline Anime Tracking</li>' +
        '</ul>' +
        '<div class="ah-note">Grab the APK and join the crew. Install it from the link below.</div>' +
        '<div id="ah-actions">' +
          '<a class="ah-btn" id="ah-get" href="' + APK_URL + '" download>&#x2620; Download APK</a>' +
          '<button class="ah-btn" id="ah-later">Maybe later</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.documentElement.appendChild(overlay);

  var img = overlay.querySelector('#ah-img');
  if (IMAGE_URL) {
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

  overlay.querySelector('#ah-x').addEventListener('click', close);
  overlay.querySelector('#ah-later').addEventListener('click', close);
  overlay.querySelector('#ah-get').addEventListener('click', close);
  document.addEventListener('keydown', onKey);
})();
