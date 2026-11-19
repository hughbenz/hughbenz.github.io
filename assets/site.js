/* football-analytics: shared glass header, sticky section browser, table pagination and hub pages.
   Loaded at the top of <body> on every page:
   <script src="ROOT/assets/site.js" data-root="ROOT" data-page="slug|home|cat:id" data-nav='{...}'></script> */
(function () {
  var me = document.currentScript;
  var ROOT = me.getAttribute('data-root') || '';
  var PAGE = me.getAttribute('data-page') || 'home';
  var NAV = {};
  try { NAV = JSON.parse(me.getAttribute('data-nav') || '{}'); } catch (e) { NAV = {}; }

  var CATS = [
    { id: 'referee', name: 'Referee', color: '#f4c430',
      blurb: 'How referees shape matches: who they favour, where they whistle, and what their big calls are worth.' },
    { id: 'performance', name: 'Performance analysis', color: '#45d18a',
      blurb: 'Players and teams: who lifts a side above expectation, and who is about to lose form.' },
    { id: 'predictive', name: 'Predictive impact', color: '#5fb0ff',
      blurb: 'Forecasting models and betting strategies tested against the closing market on matches they never saw.' },
    { id: 'addendum', name: 'Addendum', color: '#e5484d',
      blurb: 'How the database was built, what it covers, where the work could be applied, and what comes next.' }
  ];

  var PAGES = [
    { slug: 'referee-impact', cat: 'referee', title: 'Referee impact',
      blurb: 'Does knowing the referee improve the forecast? Real referee features tested against placebo referees across match targets.' },
    { slug: 'referee-explorer', cat: 'referee', title: 'Referee explorer',
      blurb: 'Every referee’s current profile as percentiles, searchable by name or league, with a full trait profile for each.' },
    { slug: 'penalty-eagerness', cat: 'referee', title: 'Penalty eagerness',
      blurb: 'Is a referee quicker or slower to give a penalty than to give a foul elsewhere on the pitch?' },
    { slug: 'foul-maps', cat: 'referee', title: 'Foul maps',
      blurb: 'Where fouls are committed, won and given, filtered by team, referee, player, score and period.' },
    { slug: 'decision-impact', cat: 'referee', title: 'Decision impact',
      blurb: 'Every penalty and red card valued in expected league points, by team, referee and biggest call.' },
    { slug: 'form-downturn', cat: 'performance', title: 'Form downturn',
      blurb: 'Which signals predict a player’s drop in form, by signal family and by position.' },
    { slug: 'market-beaters', cat: 'performance', title: 'Market beaters',
      blurb: 'When a player is on the pitch, does his team beat the closing odds? Goal difference per 90 above the market.' },
    { slug: 'model-backtest', cat: 'predictive', title: 'Models vs the market',
      blurb: 'Prediction models against the closing market: leaderboard, log-loss gain, profit and bankroll paths.' },
    { slug: 'tactical-model', cat: 'predictive', title: 'Tactical model',
      blurb: 'Do tactical and technical attributes add anything to the forecast? Families, attributes and style matchups.' },
    { slug: 'unified-models', cat: 'predictive', title: 'Unified models',
      blurb: 'Base, tactical and form models alone and together, with a fair split of the combined gain.' },
    { slug: 'coach-familiarity', cat: 'predictive', title: 'Coach familiarity',
      blurb: 'Does a coach’s inside knowledge of the opposition club and its players beat the market?' },
    { slug: 'referee-ou-backtest', cat: 'predictive', title: 'Referee over/under',
      blurb: 'Betting goal totals on referees whose over or under lean is statistically significant.' },
    { slug: 'referee-cards-backtest', cat: 'predictive', title: 'Referee cards',
      blurb: 'Betting yellow-card lines on referees who consistently lean over or under the price.' },
    { slug: 'data-pipeline', cat: 'addendum', title: 'Data pipeline',
      blurb: 'From the Sportmonks API to a browsable HTML dashboard, in seven steps.' },
    { slug: 'database-architecture', cat: 'addendum', title: 'Database architecture',
      blurb: 'Sportmonks Football API v3 into PostgreSQL across five schemas: design rules, tables, keys and the analysis layer.' },
    { slug: 'stat-coverage', cat: 'addendum', title: 'Stat coverage',
      blurb: 'The share of finished fixtures with each stat, for 145 stats across 61 leagues.' },
    { slug: 'applications', cat: 'addendum', title: 'Applications',
      blurb: 'Where the referee profiling, player form prediction and market modelling could be put to use.' },
    { slug: 'prospective-projects', cat: 'addendum', title: 'Prospective projects',
      blurb: 'Planned next projects: an xG model for NRL goal kicking, and non-contact measurement of player sentiment.' }
  ];

  function catOf(id) { for (var i = 0; i < CATS.length; i++) if (CATS[i].id === id) return CATS[i]; }
  function pageOf(slug) { for (var i = 0; i < PAGES.length; i++) if (PAGES[i].slug === slug) return PAGES[i]; }
  function href(p) { return ROOT + p.cat + '/' + p.slug + '.html'; }
  function catHref(c) { return ROOT + c.id + '.html'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function qsa(sel, root) { try { return [].slice.call((root || document).querySelectorAll(sel)); } catch (e) { return []; } }
  function inCat(id) { return PAGES.filter(function (p) { return p.cat === id; }); }

  try { var savedTheme = localStorage.getItem('fa-theme'); if (savedTheme === 'dark' || savedTheme === 'light') document.documentElement.setAttribute('data-theme', savedTheme); } catch (e) {}

  var current = pageOf(PAGE);
  var currentCat = current ? current.cat : (PAGE.indexOf('cat:') === 0 ? PAGE.slice(4) : null);

  if (!document.getElementById('fa-fonts')) {
    var l = document.createElement('link');
    l.id = 'fa-fonts'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Barlow:wght@400;500;600&display=swap';
    document.head.appendChild(l);
  }

  /* ================= header ================= */
  var DECAL =
    '<svg class="decal" viewBox="0 0 600 160" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">' +
    '<g fill="none" stroke="#fff" stroke-width="2">' +
    '<line x1="120" y1="-10" x2="120" y2="170"/><circle cx="120" cy="80" r="58"/><circle cx="120" cy="80" r="3" fill="#fff"/>' +
    '<rect x="470" y="10" width="140" height="140"/><rect x="550" y="48" width="60" height="64"/>' +
    '<path d="M470 52 A44 44 0 0 0 470 108"/><circle cx="518" cy="80" r="3" fill="#fff"/></g></svg>';

  var BALL =
    '<svg class="ball" viewBox="0 0 48 48" aria-hidden="true">' +
    '<circle cx="24" cy="24" r="21" fill="#fff" stroke="#0b2a1c" stroke-width="2.5"/>' +
    '<path d="M24 15l8.6 6.2-3.3 10.1H18.7l-3.3-10.1z" fill="#0b2a1c"/>' +
    '<g stroke="#0b2a1c" stroke-width="2.2" stroke-linecap="round">' +
    '<line x1="24" y1="15" x2="24" y2="4"/><line x1="32.6" y1="21.2" x2="43" y2="17.5"/>' +
    '<line x1="29.3" y1="31.3" x2="35.8" y2="40.4"/><line x1="18.7" y1="31.3" x2="12.2" y2="40.4"/>' +
    '<line x1="15.4" y1="21.2" x2="5" y2="17.5"/></g>' +
    '<path d="M17.5 4.8l6.5-.8 6.5.8-6.5 4.2zM42.6 14.5l2 5.6-.6 6.6-4-6.2zM40.5 38.6l-4.6 4-6.4 1.9 2.5-7zM7.5 38.6l4.6 4 6.4 1.9-2.5-7zM5.4 14.5l-2 5.6.6 6.6 4-6.2z" fill="#0b2a1c"/>' +
    '<circle cx="17" cy="13" r="7" fill="#fff" opacity=".35"/></svg>';

  var THEMEBTN = '<button class="theme" type="button" aria-label="Switch theme" title="Switch theme">' +
    '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a6.8 6.8 0 0 0 10.7 10.7z"/></svg>' +
    '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg></button>';

  function toggleTheme() {
    var r = document.documentElement;
    var own = document.querySelector('.fa-main #theme');
    if (own) own.click();
    if (!own || !r.getAttribute('data-theme')) {
      r.setAttribute('data-theme', isDark() ? 'light' : 'dark');
      if (typeof window.faRedraw === 'function') { try { window.faRedraw(); } catch (e) {} }
    }
    try { localStorage.setItem('fa-theme', r.getAttribute('data-theme')); } catch (e) {}
  }

  var HCSS =
    ':host{all:initial;display:block;padding:14px clamp(10px,1.6vw,22px) 16px;font-family:Barlow,"Segoe UI",system-ui,sans-serif}' +
    '*{box-sizing:border-box}a{color:inherit;text-decoration:none}' +
    '.top{position:relative;max-width:1660px;margin:0 auto;border-radius:26px;overflow:hidden;color:#fff;' +
    'background:linear-gradient(180deg,rgba(255,255,255,.20),rgba(255,255,255,.04) 55%),rgba(10,52,28,.70);' +
    '-webkit-backdrop-filter:blur(36px) saturate(1.3);backdrop-filter:blur(36px) saturate(1.3);border:1px solid rgba(255,255,255,.34);' +
    'box-shadow:inset 0 1px 0 rgba(255,255,255,.5),inset 0 -1px 0 rgba(255,255,255,.08),0 16px 40px rgba(0,24,10,.28)}' +
    ':host([dark]) .top{background:linear-gradient(180deg,rgba(255,255,255,.10),rgba(255,255,255,.02) 55%),rgba(3,14,8,.55);border-color:rgba(255,255,255,.18);box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 16px 40px rgba(0,0,0,.4)}' +
    '.net{position:absolute;inset:0;pointer-events:none;background-image:url(\"data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2730%27 height=%2717.32%27 viewBox=%270 0 30 17.32%27%3E%3Cpath d=%27M0 8.66L5 0h10l5 8.66L15 17.32H5zM20 8.66h10%27 fill=%27none%27 stroke=%27%23ffffff%27 stroke-opacity=%27.085%27 stroke-width=%271%27/%3E%3C/svg%3E\");background-size:39px 22.5px;' +
    '-webkit-mask-image:radial-gradient(130% 160% at 78% 0%,#000 25%,rgba(0,0,0,.45) 60%,transparent 92%);mask-image:radial-gradient(130% 160% at 78% 0%,#000 25%,rgba(0,0,0,.45) 60%,transparent 92%)}' +
    '.row{position:relative;display:flex;flex-wrap:wrap;align-items:center;gap:14px 24px;padding:18px clamp(16px,2.4vw,30px) 0}' +
    '.brand{display:flex;align-items:center;gap:14px;margin-right:auto;border-radius:16px}' +
    '.ball{width:48px;height:48px;flex:none;filter:drop-shadow(0 4px 6px rgba(0,0,0,.35))}' +
    '.brand b{display:block;font:700 clamp(28px,4.2vw,42px)/1 "Barlow Condensed","Arial Narrow",sans-serif;letter-spacing:.01em;text-shadow:0 1px 10px rgba(0,0,0,.25)}' +
    '.brand small{display:block;margin-top:5px;font:500 15px/1.2 Barlow,system-ui,sans-serif;color:rgba(255,255,255,.86)}' +
    '.nav{position:relative;display:flex;flex-wrap:wrap;gap:8px 12px;align-items:center;padding:16px clamp(16px,2.4vw,30px) 16px}' +
    '.seg{display:flex;flex-wrap:wrap;gap:3px;padding:4px;border-radius:16px;background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.24);box-shadow:inset 0 1px 0 rgba(255,255,255,.22)}' +
    '.seg a{display:flex;align-items:center;gap:8px;min-height:40px;padding:0 15px;border-radius:12px;font:600 15px/1 Barlow,system-ui,sans-serif;color:rgba(255,255,255,.9);transition:background .2s,color .2s,box-shadow .2s}' +
    '.seg a:hover{background:rgba(255,255,255,.14);color:#fff}' +
    '.seg a[aria-current]{background:rgba(255,255,255,.92);color:#0d2a1a;box-shadow:inset 0 1px 0 #fff,inset 0 -1px 0 rgba(0,0,0,.06),0 3px 12px rgba(0,20,8,.28)}' +
    '.dot{width:10px;height:14px;border-radius:2px;flex:none;box-shadow:0 1px 2px rgba(0,0,0,.35)}' +
    '.sub{position:relative;display:flex;flex-wrap:wrap;align-items:center;gap:4px 6px;padding:10px clamp(16px,2.4vw,30px) 12px;border-top:1px solid rgba(255,255,255,.16);background:rgba(0,0,0,.10)}' +
    '.sub .lab{font:600 13px/1 Barlow,system-ui,sans-serif;color:rgba(255,255,255,.7);margin-right:6px;min-height:36px;display:flex;align-items:center}' +
    '.sub a.p{display:flex;align-items:center;gap:7px;min-height:36px;padding:0 13px;border-radius:11px;font:500 15px/1 Barlow,system-ui,sans-serif;color:rgba(255,255,255,.82);border:1px solid transparent;transition:background .2s,border-color .2s}' +
    '.sub a.p:hover{background:rgba(255,255,255,.12);color:#fff}' +
    '.sub a.p[aria-current]{color:#fff;font-weight:600;background:rgba(255,255,255,.18);border-color:rgba(255,255,255,.34);box-shadow:inset 0 1px 0 rgba(255,255,255,.3)}' +
    '.sub a.p[aria-current]::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 2px rgba(255,255,255,.35)}' +
    '.theme{position:relative;flex:none;display:grid;place-items:center;width:48px;height:48px;border-radius:50%;cursor:pointer;color:#fff;' +
    'background:linear-gradient(180deg,rgba(255,255,255,.34),rgba(255,255,255,.08));border:1px solid rgba(255,255,255,.45);' +
    'box-shadow:inset 0 1px 0 rgba(255,255,255,.7),inset 0 -1px 0 rgba(255,255,255,.12),0 6px 16px rgba(0,20,8,.25);transition:transform .2s,background .2s}' +
    '.theme:hover{background:linear-gradient(180deg,rgba(255,255,255,.45),rgba(255,255,255,.14));transform:translateY(-1px)}' +
    '.theme svg{width:22px;height:22px;transition:transform .35s}.theme:active svg{transform:rotate(-30deg)}' +
    '.theme .sun{display:none}:host([dark]) .theme .sun{display:block}:host([dark]) .theme .moon{display:none}' +
    'a:focus-visible,.theme:focus-visible{outline:3px solid #ffd84d;outline-offset:2px}' +
    '@media(max-width:600px){.seg a{padding:0 11px;font-size:14px}.dot{display:none}.brand small{font-size:14px}.ball{width:40px;height:40px}}' +
    '@media(prefers-reduced-motion:reduce){*{transition:none!important}}';

  function isDark() {
    var t = document.documentElement.getAttribute('data-theme');
    var mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    return t === 'dark' || (t !== 'light' && !!(mq && mq.matches));
  }

  function buildHeader() {
    var host = document.createElement('fa-site-header');
    host.setAttribute('role', 'banner');
    host.style.display = 'block';
    var root = host.attachShadow({ mode: 'open' });
    var tabs = '<a href="' + ROOT + 'index.html"' + (PAGE === 'home' ? ' aria-current="page"' : '') + '>Home</a>' +
      CATS.map(function (c) {
        return '<a href="' + catHref(c) + '"' + (currentCat === c.id ? ' aria-current="page"' : '') +
          '><span class="dot" style="background:' + c.color + '"></span>' + esc(c.name) + '</a>';
      }).join('');
    var sub = '';
    if (currentCat) {
      var c = catOf(currentCat);
      sub = '<nav class="sub" aria-label="' + esc(c.name) + ' pages" style="--accent:' + c.color + '">' +
        '<span class="lab">' + esc(c.name) + '</span>' +
        inCat(c.id).map(function (p) {
          return '<a class="p" href="' + href(p) + '"' + (current && current.slug === p.slug ? ' aria-current="page"' : '') + '>' + esc(p.title) + '</a>';
        }).join('') + '</nav>';
    }
    root.innerHTML = '<style>' + HCSS + '</style><header class="top"><div class="net"></div>' +
      '<div class="row"><a class="brand" href="' + ROOT + 'index.html">' + BALL +
      '<span><b>football-analytics</b><small>hugh benz | data scientist</small></span></a>' + THEMEBTN + '</div>' +
      '<nav class="nav" aria-label="Sections"><div class="seg">' + tabs + '</div></nav>' + sub + '</header>';
    var tb = root.querySelector('.theme');
    tb.addEventListener('click', toggleTheme);
    function sync() {
      var d = isDark();
      if (d) host.setAttribute('dark', ''); else host.removeAttribute('dark');
      tb.setAttribute('aria-label', d ? 'Switch to light theme' : 'Switch to dark theme');
      tb.title = tb.getAttribute('aria-label');
    }
    sync();
    new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    var mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if (mq && mq.addEventListener) mq.addEventListener('change', sync);
    return host;
  }

  me.parentNode.insertBefore(buildHeader(), me.nextSibling);
  if (current && document.title.indexOf('football-analytics') < 0) document.title = document.title + ' · football-analytics';

  /* ================= hub pages ================= */
  function card(p) {
    var c = catOf(p.cat);
    return '<a class="card" href="' + href(p) + '" style="--c:' + c.color + '">' +
      '<span class="tag">' + esc(c.name) + '</span><h3>' + esc(p.title) + '</h3><p>' + esc(p.blurb) + '</p>' +
      '<span class="go">Open page →</span></a>';
  }
  function renderHub() {
    var hub = document.getElementById('hub');
    if (!hub) return;
    if (PAGE === 'home') {
      hub.innerHTML =
        '<section class="band intro" id="start" data-fa-label="Overview">' +
        '<p class="lede">Built on a football match database from sportmonks.com. Choose a section, or jump straight to a page below.</p>' +
        '<div class="thirds">' + CATS.map(function (c) {
          var ps = inCat(c.id);
          return '<a class="third" href="' + catHref(c) + '" style="--c:' + c.color + '">' +
            '<span class="n">' + ps.length + ' pages</span><b>' + esc(c.name) + '</b><span class="d">' + esc(c.blurb) + '</span>' +
            '<span class="list">' + ps.map(function (p) { return '<i>' + esc(p.title) + '</i>'; }).join('') + '</span></a>';
        }).join('') + '</div></section>' +
        CATS.map(function (c) {
          return '<section class="band" id="' + c.id + '"><div class="sec-h"><h2><span class="dot" style="background:' + c.color + '"></span>' + esc(c.name) + '</h2>' +
            '<a class="more" href="' + catHref(c) + '">Section overview →</a></div><p class="sec-p">' + esc(c.blurb) + '</p><div class="grid">' +
            inCat(c.id).map(card).join('') + '</div></section>';
        }).join('');
    } else if (currentCat) {
      var c = catOf(currentCat);
      hub.innerHTML = '<section class="band intro" id="start"><h1><span class="dot big" style="background:' + c.color + '"></span>' + esc(c.name) + '</h1>' +
        '<p class="lede">' + esc(c.blurb) + '</p><div class="grid">' + inCat(c.id).map(card).join('') + '</div></section>';
    }
  }

  /* ================= section browser (same pattern as the unified models sidebar) ================= */
  var side, navItems = [], navSig = '', activeIdx = -1, scrollRaf = 0;

  function visible(el) { return !!(el && el.getClientRects().length) && getComputedStyle(el).visibility !== 'hidden'; }
  function labelOf(el, sel) {
    if (el.getAttribute('data-fa-label')) return el.getAttribute('data-fa-label');
    var h = sel ? (el.matches && el.matches(sel) ? el : el.querySelector(sel)) : el;
    var t = h ? h.textContent.replace(/\s+/g, ' ').trim() : '';
    return t;
  }

  function collect() {
    var items = [];
    var mode = NAV.mode || 'sections';
    if (mode === 'links') {
      inCat(currentCat).forEach(function (p) { items.push({ label: p.title, link: href(p) }); });
      return items;
    }
    if (NAV.overview) {
      var top = document.querySelector(NAV.overview);
      if (top) items.push({ el: top, label: 'Overview' });
    }
    if (mode === 'tabs') {
      qsa(NAV.tabs).forEach(function (b) {
        var on = b.classList.contains('on') || b.getAttribute('aria-selected') === 'true';
        items.push({ tab: b, label: b.textContent.replace(/\s+/g, ' ').trim(), on: on });
        if (on && NAV.sub) {
          qsa(NAV.sub).filter(visible).forEach(function (h) {
            var t = labelOf(h);
            if (t) items.push({ el: (NAV.block && h.closest(NAV.block)) || h, label: t, sub: true });
          });
        }
      });
      return items;
    }
    qsa(NAV.sel).filter(visible).forEach(function (el) {
      var t = labelOf(el, NAV.label || 'h2,h3');
      if (t) items.push({ el: el, label: t });
    });
    return items;
  }

  function renderNav() {
    if (!side) return;
    var items = collect();
    var sig = items.map(function (i) { return (i.sub ? '  ' : '') + i.label + (i.on ? '*' : ''); }).join('|');
    if (sig === navSig) { navItems.forEach(function (it, k) { it.el = items[k].el; it.tab = items[k].tab; }); spy(); return; }
    navSig = sig; navItems = items; activeIdx = -1;
    var n = 0;
    var pos = current ? inCat(current.cat).indexOf(current) : -1, list = current ? inCat(current.cat) : [];
    var prev = pos > 0 ? list[pos - 1] : null, next = pos >= 0 && pos < list.length - 1 ? list[pos + 1] : null;
    var brand = NAV.brand || (current ? current.title : (currentCat ? catOf(currentCat).name : 'football-analytics'));
    side.innerHTML = '<div class="fa-side-in"><div class="brand">' + esc(brand) + '</div>' +
      items.map(function (it, k) {
        var num = it.sub ? '' : String(++n).padStart(2, '0');
        var h = it.link ? it.link : '#';
        return '<a href="' + esc(h) + '" data-k="' + k + '" class="' + (it.sub ? 'sub' : '') + (it.on ? ' on' : '') + '">' +
          (it.sub ? '' : '<span class="n">' + num + '</span>') + '<span class="t">' + esc(it.label) + '</span></a>';
      }).join('') +
      '<div class="foot">' +
      (prev ? '<a href="' + href(prev) + '">‹ ' + esc(prev.title) + '</a>' : '') +
      (next ? '<a href="' + href(next) + '">' + esc(next.title) + ' ›</a>' : '') +
      '<a href="#" data-top="1">Back to top ↑</a>' +
      '<span>' + esc(current ? catOf(current.cat).name : 'football-analytics') + '</span></div></div>';
    spy();
  }

  function goTo(el) {
    if (!el) return;
    var y = el.getBoundingClientRect().top + window.pageYOffset - 84;
    window.scrollTo({ top: Math.max(0, y), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  function onNavClick(e) {
    var a = e.target.closest('a'); if (!a || !side.contains(a)) return;
    if (a.getAttribute('data-top')) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    var k = a.getAttribute('data-k'); if (k == null) return;
    var it = navItems[+k]; if (!it || it.link) return;
    e.preventDefault();
    if (it.tab) {
      if (!it.on) it.tab.click();
      setTimeout(function () { renderNav(); goTo(document.querySelector(NAV.content || '.fa-main')); }, 30);
    } else goTo(it.el);
  }

  function spy() {
    if (!side || !navItems.length) return;
    var idx = -1;
    var line = window.innerHeight * 0.35;
    if ((NAV.mode || 'sections') === 'tabs') {
      var subIdx = -1;
      navItems.forEach(function (it, k) { if (it.sub && it.el && it.el.getBoundingClientRect().top <= line) subIdx = k; });
      qsa('a[data-k]', side).forEach(function (a) {
        var k = +a.getAttribute('data-k'), it = navItems[k];
        a.classList.toggle('on', !!(it.tab && it.on) || k === subIdx);
      });
      return;
    }
    navItems.forEach(function (it, k) { if (it.el && it.el.getBoundingClientRect().top <= line) idx = k; });
    if (idx < 0) idx = 0;
    if (window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 4) idx = navItems.length - 1;
    if (idx === activeIdx) return;
    activeIdx = idx;
    qsa('a[data-k]', side).forEach(function (a) { a.classList.toggle('on', +a.getAttribute('data-k') === idx); });
    var on = side.querySelector('a.on'), box = side.querySelector('.fa-side-in');
    if (on && box) {
      var r = on.getBoundingClientRect(), b = box.getBoundingClientRect();
      if (r.top < b.top + 40 || r.bottom > b.bottom - 40) box.scrollTop += r.top - b.top - b.height / 3;
    }
  }

  /* ================= pagination for every table ================= */
  var PS = 15;
  try { var saved = +localStorage.getItem('fa-page-size'); if (saved) PS = saved; } catch (e) {}
  var SIZES = [10, 15, 25, 50, 100];

  function ownPager(t) {
    var c = t.closest('.card') || t.parentElement;
    return !!(c && c.querySelector('.pager, [data-fa-own]'));
  }
  function setPS(v) {
    PS = v;
    try { localStorage.setItem('fa-page-size', PS); } catch (er) {}
    qsa('table').forEach(function (x) { if (x._fa) { x._fa.page = 0; apply(x, logicalRows(x)); } });
  }
  /* for dashboards that page their own data (too many rows to render at once) */
  window.faPageSize = function () { return PS; };
  window.faPager = function (el, page, pages, total, onGo) {
    if (!el) return;
    el.classList.add('fa-pager'); el.setAttribute('data-fa-own', '');
    if (total <= PS) { el.innerHTML = ''; return; }
    renderPager(el, page, pages, total);
    function after() {
      var nel = el.id ? document.getElementById(el.id) : el, card = nel && nel.closest('.card');
      if (card && card.getBoundingClientRect().top < 0) goTo(card);
    }
    el.onclick = function (e) {
      var b = e.target.closest('button'); if (!b || b.disabled) return;
      var g = b.getAttribute('data-go'), p = g === 'prev' ? page - 1 : g === 'next' ? page + 1 : +g;
      onGo(Math.max(0, Math.min(pages - 1, p))); after();
    };
    el.onchange = function (e) { if (e.target.matches('select')) { setPS(+e.target.value); onGo(0); } };
  };
  function isAttach(tr) {
    if (tr.classList.contains('detail') || tr.classList.contains('drawer')) return true;
    return tr.cells.length === 1 && tr.cells[0].colSpan > 1;
  }
  function logicalRows(t) {
    var out = [], lead = [];
    [].slice.call(t.rows).forEach(function (tr) {
      var p = tr.parentNode.tagName;
      if (p === 'THEAD' || p === 'TFOOT' || tr.hidden) return;
      var allTh = tr.cells.length && [].every.call(tr.cells, function (c) { return c.tagName === 'TH'; });
      if (allTh) {
        /* a one-cell group heading travels with the row that follows it */
        if (tr.cells.length === 1 && tr.cells[0].colSpan > 1) lead.push(tr);
        return;
      }
      if (isAttach(tr) && out.length && !lead.length) out[out.length - 1].push(tr);
      else { out.push(lead.concat([tr])); lead = []; }
    });
    return out;
  }
  function anchorOf(t) {
    var p = t.parentElement;
    if (p && p !== document.body && p.children.length === 1) {
      var cs = getComputedStyle(p);
      if (/(auto|scroll)/.test(cs.overflowY + cs.overflowX) || p.classList.contains('scroll') || p.classList.contains('wide')) return p;
    }
    return t;
  }

  function apply(t, L) {
    var st = t._fa;
    var anchor = anchorOf(t);
    if (L.length <= PS) {
      L.forEach(function (g) { g.forEach(function (tr) { if (tr.style.display === 'none' && tr._faHid) { tr.style.display = ''; tr._faHid = false; } }); });
      if (st.pager) { st.pager.remove(); st.pager = null; }
      if (anchor !== t) anchor.removeAttribute('data-fa-paged');
      return;
    }
    var pages = Math.ceil(L.length / PS);
    st.page = Math.max(0, Math.min(st.page, pages - 1));
    var a = st.page * PS, b = a + PS;
    L.forEach(function (g, i) {
      var show = i >= a && i < b;
      g.forEach(function (tr) {
        if (show) { if (tr._faHid) { tr.style.display = ''; tr._faHid = false; } }
        else if (tr.style.display !== 'none') { tr.style.display = 'none'; tr._faHid = true; }
      });
    });
    if (anchor !== t) anchor.setAttribute('data-fa-paged', '');
    if (!st.pager || !st.pager.isConnected) {
      st.pager = document.createElement('div');
      st.pager.className = 'fa-pager';
      st.pager.setAttribute('role', 'navigation');
      st.pager.setAttribute('aria-label', 'Table pages');
      st.pager.addEventListener('click', function (e) {
        var btn = e.target.closest('button'); if (!btn || btn.disabled) return;
        var go = btn.getAttribute('data-go');
        var Lnow = logicalRows(t), n = Math.ceil(Lnow.length / PS);
        st.page = go === 'prev' ? st.page - 1 : go === 'next' ? st.page + 1 : +go;
        st.page = Math.max(0, Math.min(st.page, n - 1));
        apply(t, Lnow);
        var an = anchorOf(t); if (an !== t) an.scrollTop = 0;
        var r = t.getBoundingClientRect(); if (r.top < 0) goTo(t);
      });
      st.pager.addEventListener('change', function (e) { if (e.target.matches('select')) setPS(+e.target.value); });
      anchor.parentNode.insertBefore(st.pager, anchor.nextSibling);
    }
    renderPager(st.pager, st.page, pages, L.length);
  }

  function renderPager(el, page, pages, total) {
    var nums = [], i;
    var set = {}; [0, pages - 1, page - 1, page, page + 1].forEach(function (x) { if (x >= 0 && x < pages) set[x] = 1; });
    if (page <= 2) for (i = 0; i < Math.min(pages, 4); i++) set[i] = 1;
    if (page >= pages - 3) for (i = Math.max(0, pages - 4); i < pages; i++) set[i] = 1;
    var keys = Object.keys(set).map(Number).sort(function (x, y) { return x - y; });
    keys.forEach(function (k, j) {
      if (j && k - keys[j - 1] > 1) nums.push('<span class="gap">…</span>');
      nums.push('<button type="button" data-go="' + k + '"' + (k === page ? ' class="on" aria-current="page"' : '') + '>' + (k + 1) + '</button>');
    });
    var a = page * PS + 1, b = Math.min(total, (page + 1) * PS);
    el.innerHTML = '<button type="button" data-go="prev" aria-label="Previous page"' + (page === 0 ? ' disabled' : '') + '>‹</button>' + nums.join('') +
      '<button type="button" data-go="next" aria-label="Next page"' + (page >= pages - 1 ? ' disabled' : '') + '>›</button>' +
      '<span class="info">' + a.toLocaleString() + '–' + b.toLocaleString() + ' of ' + total.toLocaleString() + '</span>' +
      '<label>Rows per page <select>' + SIZES.map(function (s) { return '<option' + (s === PS ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></label>';
  }

  function paginateAll() {
    qsa('.fa-main table').forEach(function (t) {
      if (t.closest('.fa-pager')) return;
      if (ownPager(t)) return;
      var L = logicalRows(t);
      var st = t._fa || (t._fa = { page: 0 });
      var tb = t.tBodies[0], first = L.length ? L[0][0] : null;
      var changed = st.tb !== tb || st.n !== L.length || st.first !== first;
      if (!changed && st.done) return;
      if (st.done && (st.reset || st.n !== L.length)) st.page = 0;
      st.reset = false; st.tb = tb; st.n = L.length; st.first = first; st.done = true;
      apply(t, L);
    });
  }

  /* sorting a table returns it to its first page */
  document.addEventListener('click', function (e) {
    var th = e.target.closest && e.target.closest('th');
    if (th) { var t = th.closest('table'); if (t && t._fa) t._fa.reset = true; }
  }, true);

  /* ================= start ================= */
  var pending = 0;
  function schedule() {
    if (pending) return;
    pending = requestAnimationFrame(function () { pending = 0; paginateAll(); renderNav(); });
  }
  function ours(n) {
    return n && n.nodeType === 1 && (n.classList.contains('fa-pager') || n.closest && (n.closest('.fa-pager') || n.closest('.fa-side')));
  }

  function start() {
    renderHub();
    side = document.getElementById('fa-side');
    if (side) side.addEventListener('click', onNavClick);
    paginateAll();
    renderNav();
    var mo = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        if (ours(m.target)) continue;
        var relevant = false;
        [].forEach.call(m.addedNodes, function (n) { if (!ours(n)) relevant = true; });
        [].forEach.call(m.removedNodes, function (n) { if (!(n.nodeType === 1 && n.classList && n.classList.contains('fa-pager'))) relevant = true; });
        if (relevant) { schedule(); return; }
      }
    });
    var main = document.querySelector('.fa-main') || document.body;
    mo.observe(main, { childList: true, subtree: true });
    new MutationObserver(schedule).observe(main, { attributes: true, subtree: true, attributeFilter: ['class', 'hidden'] });
    window.addEventListener('scroll', function () {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(function () { scrollRaf = 0; spy(); });
    }, { passive: true });
    window.addEventListener('resize', spy);
    setTimeout(schedule, 400);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
