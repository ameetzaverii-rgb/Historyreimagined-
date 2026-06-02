/* ============================================================================
   HistoryReimagined — core application
   Vanilla JS SPA. Renders every screen on demand from the content in data.js.
   Pedagogy: Gagné's 9 Events structure the flow; Bloom's tags every task.
   ========================================================================== */

/* ---------- persistent profile / progress ---------- */
const SAVE_KEY = 'hr_profile_v1';
const State = loadState();
function loadState() {
  try { return Object.assign(defaults(), JSON.parse(localStorage.getItem(SAVE_KEY) || '{}')); }
  catch { return defaults(); }
}
function defaults() {
  return { name: '', avatar: '🧑‍🎓', xp: 0, scenesRead: [], quizBest: null, badges: [], mapPins: [] };
}
function save() { localStorage.setItem(SAVE_KEY, JSON.stringify(State)); }

/* ---------- tiny DOM helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// graceful image fallback: turns broken images into a captioned placeholder block
window.imgErr = (el, cap) => { el.classList.add('imgfallback'); el.removeAttribute('src'); el.setAttribute('data-cap', cap || 'Archive image'); el.onerror = null; };
const img = (src, cls, cap, attrs = '') => `<img class="${cls}" src="${src}" alt="${esc(cap || '')}" loading="lazy" onerror="imgErr(this,'${esc((cap || '').slice(0, 40))}')" ${attrs}>`;

/* ---------- navigation ---------- */
const MAIN_NAV = ['sHome', 'sTimeline', 'sStory', 'sPortfolio', 'sQuiz'];
const RENDERED = new Set();
function go(id, opts = {}) {
  $$('.screen').forEach(s => s.classList.remove('active'));
  const el = $('#' + id); if (!el) return;
  el.classList.add('active');
  const chrome = id !== 's0';
  $('#topbar').classList.toggle('show', chrome);
  $('#botnav').classList.toggle('show', chrome);
  window.scrollTo(0, 0);
  setNav(MAIN_NAV.indexOf(id));
  renderScreen(id, opts);
  $('#rp').style.width = id === 'sStory' ? $('#rp').style.width : '0';
}
function setNav(i) { $$('.bn').forEach((b, j) => b.classList.toggle('on', i === j)); }

function renderScreen(id, opts) {
  switch (id) {
    case 'sHome': renderHome(); break;
    case 'sAtlas': renderAtlas(); break;
    case 'sTimeline': renderTimeline(); break;
    case 'sPeople': renderPeople(); break;
    case 'sWars': renderWars(); break;
    case 'sStory': if (!RENDERED.has('sStory')) { buildStory(); RENDERED.add('sStory'); } break;
    case 'sMedia': renderMedia(); break;
    case 'sActivities': renderActivities(); break;
    case 'sQuiz': startQuiz(); break;
    case 'sRank': renderRank(); break;
    case 'sPortfolio': Portfolio.render(opts); break;
  }
}

/* ---------- onboarding ---------- */
function pickAvatar(el) { $$('.s0av').forEach(a => a.classList.remove('on')); el.classList.add('on'); State.avatar = el.textContent; }
function begin() {
  const v = $('#nameinp').value.trim();
  if (!v) { const i = $('#nameinp'); i.style.borderBottomColor = 'var(--red)'; i.focus(); setTimeout(() => i.style.borderBottomColor = '', 1200); return; }
  State.name = v; save();
  unlock('first', 'First Steps');
  go('sHome');
}

/* ---------- XP / rank / toast / badges ---------- */
const RANKS = [
  { xp: 0, t: 'Apprentice', ab: 'APP', sub: 'Just enrolled. Read, explore and build to rise.' },
  { xp: 80, t: 'Chronicler', ab: 'CHR', sub: 'You are starting to connect the dots of history.' },
  { xp: 180, t: 'Analyst', ab: 'ANL', sub: 'You can weigh causes and read sources critically.' },
  { xp: 320, t: 'Historian', ab: 'HIS', sub: 'You think like a historian — evidence first.' },
  { xp: 520, t: 'Master Curator', ab: 'MC', sub: 'You can teach this history to anyone. The highest rank.' },
];
const BADGES = {
  first: 'First Steps', timetraveller: 'Time Traveller', storyteller: 'Storyteller',
  scholar: 'Scholar', curator: 'Curator', collaborator: 'Collaborator',
  cartographer: 'Cartographer', researcher: 'Researcher', atlas: 'Atlas Explorer',
};
function rankFor(xp) { let r = RANKS[0]; for (const x of RANKS) if (xp >= x.xp) r = x; return r; }
function gainXP(n, msg) { State.xp += n; save(); $('#xpn').textContent = State.xp; if (msg) toast(msg); }
function unlock(key, label) { if (!State.badges.includes(key)) { State.badges.push(key); save(); toast('🏅 Badge unlocked — ' + (label || BADGES[key])); } }
let toastT;
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600); }

/* ============================================================================
   HOME  (Gagné #2 Inform Objectives, #3 Recall, overview of everything)
   ========================================================================== */
const HUBS = [
  { id: 'sAtlas', i: '📚', t: 'Curriculum Atlas', d: 'NCERT Grades 8·9·10, indexed & linked' },
  { id: 'sStory', i: '📖', t: 'Story Mode', d: 'Live the history, scene by scene' },
  { id: 'sTimeline', i: '🕰️', t: 'Timeline', d: '1914 → 1947, interactive' },
  { id: 'sPeople', i: '👤', t: 'Personalities', d: 'The people who shaped the age' },
  { id: 'sWars', i: '🗺️', t: 'Wars & Map', d: 'WW1, WW2 and the battle map' },
  { id: 'sMedia', i: '🎬', t: 'Media Library', d: 'Open resources & video' },
  { id: 'sActivities', i: '🎯', t: 'Activity Ladder', d: "Bloom's tasks → your folder" },
  { id: 'sPortfolio', i: '🗂️', t: 'My Walkthrough', d: 'Build & share your folder' },
  { id: 'sQuiz', i: '⚡', t: 'Quiz', d: 'Test yourself, earn XP' },
  { id: 'sRank', i: '🎖️', t: 'Progress', d: 'XP, ranks & badges' },
];
function renderHome() {
  const m = MODULE;
  $('#homePane').innerHTML = `
    <div class="home-hero">
      ${img(m.hero, '', 'Module hero')}
      <div class="home-hg"></div>
      <div class="home-hc">
        <div class="eyebrow">${m.anchor}</div>
        <h1>From Trenches to <em>Tyranny</em></h1>
        <p>${esc(m.subtitle)} — a living, gamified module that threads through your NCERT history across Grades 8, 9 &amp; 10.</p>
      </div>
    </div>

    <div class="eq"><small>The Essential Question</small>${esc(m.essentialQuestion)}</div>

    <div class="sec-head"><div class="eyebrow">Choose your path</div><h2 class="h2">Explore the Module</h2></div>
    <div class="hubgrid">
      ${HUBS.map(h => `<div class="hubcard" onclick="go('${h.id}')"><span class="arrow">→</span><span class="hi">${h.i}</span><h3>${h.t}</h3><p>${h.d}</p></div>`).join('')}
    </div>

    <div class="divider"></div>
    <div class="sec-head"><div class="eyebrow">Gagné #2 · Inform objectives</div><h2 class="h2">What you'll be able to do</h2></div>
    <ul class="obj">${m.objectives.map(o => `<li>${esc(o)}</li>`).join('')}</ul>

    <div class="divider"></div>
    <div class="sec-head"><div class="eyebrow">Learning science, built in</div><h2 class="h2">Gagné's 9 Events of Instruction</h2><p class="lead">Every feature in this app maps to a proven teaching step — tap any to jump there.</p></div>
    <div class="gagne">${m.gagne.map(g => `<div class="gstep" onclick="go('${mapWhere(g.where)}')"><div class="gn">Event ${g.n}</div><h4>${esc(g.t)}</h4><p>${esc(g.d)}</p></div>`).join('')}</div>

    <div class="divider"></div>
    <div class="sec-head"><div class="eyebrow">Multiple strategies</div><h2 class="h2">Bloom's Taxonomy Ladder</h2><p class="lead">You won't just remember — you'll climb all the way to <em>create</em>.</p></div>
    <div class="bloom">${m.bloom.map(b => `<div class="brung" style="background:${b.color}"><span class="bl">L${b.level}</span><span class="bt">${b.t}</span><span class="bv">${esc(b.verb)}</span></div>`).join('')}</div>

    <div class="divider"></div>
    <div class="sec-head"><div class="eyebrow">Did you know?</div><h2 class="h2">An interesting fact</h2></div>
    <div class="scfact"><div class="scfl">Interstitial</div><p id="homeFact">${esc(FACTS[Math.floor(Math.random() * FACTS.length)])}</p></div>
    <div style="margin-top:12px"><button class="btn btn-o btn-sm" onclick="$('#homeFact').textContent=FACTS[Math.floor(Math.random()*FACTS.length)]">↻ Another fact</button></div>

    <div style="height:8px"></div>`;
}
function mapWhere(w) { return ({ story: 'sStory', home: 'sHome', atlas: 'sAtlas', tutor: 'sMedia', activities: 'sActivities', quiz: 'sQuiz', rank: 'sRank', portfolio: 'sPortfolio' })[w] || 'sHome'; }

/* ============================================================================
   CURRICULUM ATLAS  (Gagné #3 Recall — links to prior + related chapters)
   ========================================================================== */
function renderAtlas() {
  unlock('atlas');
  $('#atlasPane').innerHTML = `
    <div class="sec-head"><div class="eyebrow">NCERT Social Science · indexed</div><h2 class="h2">Curriculum Atlas</h2>
      <p class="lead">The whole History curriculum for Grades 8–10, with the chapters this module draws on highlighted. Tap any chapter to open the official NCERT PDF.</p></div>

    <div class="scfact" style="margin-bottom:22px"><div class="scfl">Cross-grade thread</div><p>This single story runs across three years of school: <strong>Grade 8</strong> explains colonial India that sent millions to the World Wars → <strong>Grade 9</strong> covers the revolutions and the rise of Nazism at the centre of this module → <strong>Grade 10</strong> shows how nationalism and a connected world were reshaped by these wars.</p></div>

    ${NCERT.grades.map(g => `
      <div class="gradeblock">
        <div class="gradehd">
          <div class="gradebadge"><b>${g.grade}</b><span>CLASS</span></div>
          <div><h3>${esc(g.subject)}</h3><p>${esc(g.blurb)}</p></div>
        </div>
        <div class="chaplist">
          ${g.chapters.map(c => `
            <a class="chaprow ${c.anchor ? 'anchor' : ''}" href="${NCERT.pdfBase}${c.pdf}" target="_blank" rel="noopener" onclick="gainXP(5,'+5 XP · Opened a source')">
              <span class="chapn">${c.n}</span>
              <span class="chapt">${esc(c.t)}</span>
              ${c.anchor ? '<span class="chiptag red">Module anchor</span>' : c.link ? '<span class="chiptag gold">Linked</span>' : '<span class="chiptag">PDF ↗</span>'}
            </a>`).join('')}
        </div>
      </div>`).join('')}

    <p class="lead" style="text-align:center">Source: National Council of Educational Research and Training · <a href="${NCERT.portal}" target="_blank" rel="noopener" style="color:var(--red)">ncert.nic.in</a></p>`;
}

/* ============================================================================
   TIMELINE  (interactive, filterable)
   ========================================================================== */
let tlFilter = 'all';
function renderTimeline() {
  unlock('timetraveller');
  const filters = [['all', 'All'], ['turning', 'Turning points'], ['war', 'Wars'], ['politics', 'Politics'], ['india', 'India']];
  $('#timelinePane').innerHTML = `
    <div class="sec-head"><div class="eyebrow">1914 → 1947</div><h2 class="h2">Interactive Timeline</h2><p class="lead">The chain of cause and effect from one rifle shot to a free India. Tap an event for detail; filter by theme.</p></div>
    <div class="tlfilters">${filters.map(([k, l]) => `<button class="tlfilter ${k === tlFilter ? 'on' : ''}" data-f="${k}" onclick="setTLFilter('${k}')">${l}</button>`).join('')}</div>
    <div class="tline">${TIMELINE.map((e, i) => `
      <div class="tlev ${tlFilter !== 'all' && e.type !== tlFilter ? 'hidden' : ''}" data-type="${e.type}" onclick="this.querySelector('.tldesc').style.display='block';gainXP(4)">
        <div class="tlyear">${e.y}${e.m && e.m !== '—' ? ' · ' + e.m : ''}</div>
        <div class="tlttl">${esc(e.t)}</div>
        <div class="tldesc">${esc(e.d)}</div>
        ${e.img ? img(e.img, 'tlimg', e.t) : ''}
      </div>`).join('')}</div>`;
}
function setTLFilter(f) { tlFilter = f; renderTimeline(); }

/* ============================================================================
   PERSONALITIES  (gallery + detail modal)
   ========================================================================== */
function renderPeople() {
  $('#peoplePane').innerHTML = `
    <div class="sec-head"><div class="eyebrow">The human face of history</div><h2 class="h2">Personalities</h2><p class="lead">Heroes, villains and ordinary people caught in extraordinary times. Tap a card to learn their story.</p></div>
    <div class="peoplegrid">${PEOPLE.map(p => `
      <div class="pcard" onclick="openPerson('${p.id}')">
        ${img(p.img, 'pimg', p.name)}
        <div class="pb"><span class="pside ${p.side}">${sideLabel(p.side)}</span><h3>${esc(p.name)}</h3><div class="pyr">${p.years}</div><div class="prole">${esc(p.role)}</div></div>
      </div>`).join('')}</div>`;
}
function sideLabel(s) { return ({ allied: 'Allied', axis: 'Axis', india: 'India', revolution: 'Revolution', victim: 'Witness' }[s] || s); }
function openPerson(id) {
  const p = PEOPLE.find(x => x.id === id); if (!p) return;
  gainXP(8, '+8 XP · Met ' + p.name);
  $('#modalBody').innerHTML = `
    ${img(p.img, 'pimg', p.name, 'style="height:230px;object-position:top center"')}
    <div style="padding:20px 22px">
      <span class="pside ${p.side}">${sideLabel(p.side)} · ${esc(p.country)}</span>
      <h2 class="h2" style="font-size:30px;margin-top:8px">${esc(p.name)}</h2>
      <div class="pyr" style="font-family:var(--fm);font-size:11px;color:var(--muted);margin:3px 0 10px">${p.years} · ${esc(p.role)}</div>
      <p style="font-size:15px;color:var(--ink3);line-height:1.7;font-style:italic">${esc(p.blurb)}</p>
      <div class="scfact" style="margin:16px 0"><div class="scfl">Key facts</div>${p.facts.map(f => `<p style="margin-bottom:6px">• ${esc(f)}</p>`).join('')}</div>
      <div class="scfact" style="border-left-color:var(--red)"><div class="scfl" style="color:var(--red)">Why it matters</div><p>${esc(p.matters)}</p></div>
      <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-g btn-sm" onclick="Portfolio.add('note','${esc(p.name)}','I want to remember about ${esc(p.name)}: ');closeModal();toast('Added to your folder')">+ Add to my folder</button>
        <button class="btn btn-o btn-sm" onclick="closeModal()">Close</button>
      </div>
    </div>`;
  $('#modal').classList.add('open');
}
function closeModal() { $('#modal').classList.remove('open'); }

/* ============================================================================
   WARS & MAP
   ========================================================================== */
function renderWars() {
  $('#warsPane').innerHTML = `
    <div class="sec-head"><div class="eyebrow">The conflicts</div><h2 class="h2">Wars &amp; Battle Map</h2><p class="lead">Two wars, one chain of cause and effect. Compare them, then explore the map of the European theatre.</p></div>
    ${WARS.map(w => `
      <div class="warcard">
        ${img(w.img, 'wimg', w.name)}
        <div class="wb">
          <div class="wtag">${esc(w.tag)}</div>
          <h3>${esc(w.name)}<span>${w.years}</span></h3>
          <p>${esc(w.summary)}</p>
          <div class="wstats">${w.stats.map(s => `<div class="wstat"><div class="sl">${esc(s[0])}</div><div class="sv">${esc(s[1])}</div></div>`).join('')}</div>
          <div class="scfl" style="margin:10px 0 2px">Main causes</div>
          <ul class="wcauses">${w.causes.map(c => `<li>${esc(c)}</li>`).join('')}</ul>
          <p style="font-size:13px;margin-top:10px"><strong>Outcome:</strong> ${esc(w.outcome)}</p>
        </div>
      </div>`).join('')}

    <div class="sec-head" style="margin-top:10px"><div class="eyebrow">The European theatre</div><h2 class="h2">Interactive Map</h2><p class="lead">Tap a marker to see what happened there. Colour shows the side or theme.</p></div>
    <div class="mapbox">
      ${mapSVG()}
      ${MAP_PINS.map(p => `<div class="mpin" style="left:${p.x}%;top:${p.y}%" onclick="openPin('${p.id}')"><div class="mpd ${p.side}"></div><div class="mplbl">${esc(p.t)}</div></div>`).join('')}
      <div class="mapinfo" id="mapinfo"><button class="mx" onclick="$('#mapinfo').classList.remove('open')">✕</button><div id="mapinfoBody"></div></div>
    </div>`;
}
function mapSVG() {
  // a clean schematic of Europe — not a precise map, a readable backdrop for pins
  return `<svg class="mapsvg" viewBox="0 0 600 320" preserveAspectRatio="xMidYMid meet">
    <rect width="600" height="320" fill="#E8DEC8"/>
    <g fill="#D8CBB0" stroke="#C9B894" stroke-width="1">
      <path d="M120 70 L240 50 L330 70 L360 120 L330 180 L260 230 L180 240 L120 200 L100 130 Z"/>
      <path d="M360 60 L520 70 L560 130 L540 210 L440 250 L360 210 L340 130 Z"/>
    </g>
    <g fill="none" stroke="#A9C3D6" stroke-width="3" opacity=".7">
      <path d="M150 240 L210 180 L250 120"/><path d="M420 250 L460 180 L500 120"/>
    </g>
    <text x="180" y="150" font-family="JetBrains Mono,monospace" font-size="11" fill="#8C7A62" opacity=".7">WESTERN EUROPE</text>
    <text x="430" y="160" font-family="JetBrains Mono,monospace" font-size="11" fill="#8C7A62" opacity=".7">EASTERN EUROPE</text>
  </svg>`;
}
function openPin(id) {
  const p = MAP_PINS.find(x => x.id === id); if (!p) return;
  if (!State.mapPins.includes(id)) { State.mapPins.push(id); save(); if (State.mapPins.length >= 3) unlock('cartographer'); }
  gainXP(6, '+6 XP · Location explored');
  $('#mapinfoBody').innerHTML = `<div class="mt">${esc(p.tag)}</div><h4>${esc(p.t)}</h4><p>${esc(p.tx)}</p><div class="mf">${esc(p.fa)}</div>`;
  $('#mapinfo').classList.add('open');
}

/* ============================================================================
   STORY MODE  (Gagné #1 Gain attention, #4 Present content)
   ========================================================================== */
let scIdx = 0;
function buildStory() {
  $('#sdtot').textContent = STORY.length;
  renderScene(0);
}
function renderScene(i) {
  scIdx = Math.max(0, Math.min(STORY.length - 1, i));
  const s = STORY[scIdx];
  const bcolor = (MODULE.bloom.find(b => b.t === s.bloom) || {}).color || 'var(--gold)';
  $('#shimg').onerror = function () { imgErr(this, s.ti); };
  $('#shimg').src = s.img;
  $('#shch').textContent = s.ch;
  $('#shtitle').textContent = s.ti;
  $('#shsub').textContent = s.su;
  $('#shcr').textContent = s.cr || '';
  const bl = $('#shbloom'); bl.textContent = "Bloom · " + s.bloom; bl.style.background = bcolor;
  $('#sdidx').textContent = scIdx + 1;
  $('#sdrow').innerHTML = STORY.map((_, j) => `<div class="sddot ${j < scIdx ? 'done' : j === scIdx ? 'now' : ''}" onclick="renderScene(${j})"></div>`).join('');
  $('#scBody').className = 'scbody' + (s.lead ? ' firstcap' : '');
  $('#scBody').innerHTML = s.body;
  $('#scExtra').innerHTML = renderExtra(s.extra);
  $('#scnext').innerHTML = scIdx >= STORY.length - 1 ? 'Finish → Quiz' : 'Next Scene →';
  $('#rp').style.width = ((scIdx + 1) / STORY.length * 100) + '%';
  if (!State.scenesRead.includes(scIdx)) { State.scenesRead.push(scIdx); save(); gainXP(15, '+15 XP · Scene read'); }
  if (State.scenesRead.length >= STORY.length) unlock('storyteller');
  bindGlossary();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function renderExtra(ex) {
  if (!ex) return '';
  if (ex.type === 'fact') return `<div class="scfact"><div class="scfl">${esc(ex.label)}</div><p>${esc(ex.text)}</p></div>`;
  if (ex.type === 'pull') return `<div class="scpull">${esc(ex.text)}<cite>— ${esc(ex.author)}</cite></div>`;
  if (ex.type === 'did') return `<div class="scdid"><div class="dl">Did you know?</div><p>${esc(ex.text)}</p></div>`;
  if (ex.type === 'tl') return `<div class="sctl">${ex.items.map(it => `<div class="tlitem"><div class="d">${esc(it.d)}</div><div class="t">${it.t}</div></div>`).join('')}</div>`;
  return '';
}
function nextScene() { if (scIdx >= STORY.length - 1) { gainXP(60, 'Story complete! +60 XP'); go('sQuiz'); } else renderScene(scIdx + 1); }
function saveSceneToFolder() {
  const s = STORY[scIdx];
  Portfolio.add('note', s.ti, 'My note on "' + s.ti + '":\n');
  toast('Saved to your folder ✎');
}

/* glossary tooltips */
function bindGlossary() {
  $$('.hl').forEach(el => {
    el.onmouseenter = showTT; el.onmouseleave = hideTT;
    el.ontouchstart = e => { showTT(e); setTimeout(hideTT, 2600); };
  });
}
function showTT(e) {
  const el = e.currentTarget, t = $('#tt');
  $('#ttterm').textContent = el.dataset.term || '';
  $('#ttdef').textContent = el.dataset.def || '';
  const r = el.getBoundingClientRect();
  t.style.left = Math.min(Math.max(8, r.left), window.innerWidth - 250) + 'px';
  t.style.top = (r.bottom + 8) + 'px';
  t.classList.add('show');
}
function hideTT() { $('#tt').classList.remove('show'); }

/* ============================================================================
   MEDIA LIBRARY  (OER + YouTube)
   ========================================================================== */
function renderMedia() {
  $('#mediaPane').innerHTML = `
    <div class="sec-head"><div class="eyebrow">Open educational resources</div><h2 class="h2">Media Library</h2><p class="lead">Curated, free-to-use video and reading from NCERT, Khan Academy, CrashCourse, OER Commons and museums.</p></div>
    <div class="vidgrid">${MEDIA.videos.map(v => `
      <div class="vidcard">
        <div class="vidframe"><iframe src="https://www.youtube-nocookie.com/embed/${v.id}" title="${esc(v.t)}" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen onload="gainXP(2)"></iframe></div>
        <div class="vb"><h4>${esc(v.t)}</h4><div class="vs">${esc(v.src)} · ${esc(v.tag)}</div></div>
      </div>`).join('')}</div>
    <div class="divider"></div>
    <div class="sec-head"><div class="eyebrow">Read & explore</div><h2 class="h2">Open Resources</h2></div>
    <div class="oerlist">${MEDIA.oer.map(o => `
      <a class="oerrow" href="${o.url}" target="_blank" rel="noopener" onclick="gainXP(5,'+5 XP · Resource opened');unlock('researcher')">
        <div class="oerico">${oerIcon(o.tag)}</div>
        <div class="ob"><h4>${esc(o.t)}</h4><div class="os">${esc(o.src)}</div></div>
        <span class="chiptag gold">${esc(o.tag)} ↗</span>
      </a>`).join('')}</div>`;
}
function oerIcon(tag) { return ({ Textbook: '📕', Article: '📝', Lesson: '🧩', Primary: '🕯️', Images: '🖼️' }[tag] || '🔗'); }

/* ============================================================================
   ACTIVITIES  (Gagné #6 Elicit performance · Bloom ladder → portfolio)
   ========================================================================== */
function renderActivities() {
  $('#activitiesPane').innerHTML = `
    <div class="sec-head"><div class="eyebrow">Do history, don't just read it</div><h2 class="h2">Bloom's Activity Ladder</h2><p class="lead">Each task adds a starter card to your Walkthrough folder. Climb from <em>remember</em> all the way to <em>create</em>.</p></div>
    <div class="actgrid">${ACTIVITIES.map(a => {
      const b = MODULE.bloom.find(x => x.t === a.bloom) || {};
      return `<div class="actcard">
        <div class="ah"><span class="aico">${a.icon}</span><span class="actbloom" style="background:${b.color}">${a.bloom}</span></div>
        <h4>${esc(a.t)}</h4><p>${esc(a.d)}</p>
        <button class="btn btn-g btn-sm" onclick='Portfolio.add("note", ${JSON.stringify(a.t)}, ${JSON.stringify(a.starter)});toast("Added to your folder — go finish it!");gainXP(10,"+10 XP · Activity started")'>+ Start in my folder</button>
      </div>`;
    }).join('')}</div>`;
}

/* ============================================================================
   QUIZ  (Gagné #7 Provide feedback)
   ========================================================================== */
let qCur = 0, qScore = 0, qCorrect = 0, qAnswered = 0, qTimer = null, qLeft = 30;
function startQuiz() {
  qCur = 0; qScore = 0; qCorrect = 0; qAnswered = 0;
  renderQ();
}
function renderQ() {
  if (qCur >= QUIZ.length) return endQuiz();
  const q = QUIZ[qCur];
  const b = MODULE.bloom.find(x => x.t === q.bloom) || {};
  $('#quizPane').innerHTML = `
    <div class="qzpips">${QUIZ.map((_, i) => `<div class="qzpip ${i < qCur ? 'done' : i === qCur ? 'now' : ''}"></div>`).join('')}</div>
    <div class="qzmeta"><span class="qzbloom" style="background:${b.color}">Bloom · ${q.bloom}</span><span class="qztime">Q ${qCur + 1}/${QUIZ.length} · <span id="qzt">30</span>s</span></div>
    <div class="qzq">${esc(q.q)}</div>
    <div class="qzopts">${q.o.map((o, i) => `<button class="qzopt" data-i="${i}"><span class="qzlt">${'ABCD'[i]}</span>${esc(o)}</button>`).join('')}</div>
    <div class="qzfb" id="qzfb"></div>
    <div class="qzfoot"><div class="qzsc">Score: <span id="qzscv">${qScore}</span></div>
      <div style="display:flex;gap:7px">
        <button class="btn btn-o btn-sm" id="qznext" style="display:none" onclick="qCur++;renderQ()">Next →</button>
        <button class="btn btn-p btn-sm" id="qzend" style="display:none" onclick="endQuiz()">See result</button>
      </div></div>`;
  $$('.qzopt').forEach(btn => btn.onclick = () => answer(+btn.dataset.i, btn));
  startQTimer();
}
function answer(i, btn) {
  clearInterval(qTimer);
  const q = QUIZ[qCur], ok = i === q.c;
  $$('.qzopt').forEach(b => b.disabled = true);
  btn.classList.add(ok ? 'right' : 'wrong');
  if (!ok) $$('.qzopt')[q.c].classList.add('right');
  qAnswered++;
  if (ok) { qCorrect++; const pts = Math.max(10, qLeft * 3); qScore += pts; gainXP(pts, '+' + pts + ' XP · Correct!'); $('#qzscv').textContent = qScore; }
  const fb = $('#qzfb'); fb.innerHTML = q.fb; fb.classList.add('show');
  $('#' + (qCur < QUIZ.length - 1 ? 'qznext' : 'qzend')).style.display = 'inline-flex';
}
function startQTimer() {
  qLeft = 30; $('#qzt').textContent = 30;
  clearInterval(qTimer);
  qTimer = setInterval(() => {
    qLeft--; const t = $('#qzt'); if (t) t.textContent = qLeft;
    if (qLeft <= 0) { clearInterval(qTimer); const f = $$('.qzopt')[0]; if (f && !f.disabled) { $$('.qzopt').forEach(b => b.disabled = true); $$('.qzopt')[QUIZ[qCur].c].classList.add('right'); qAnswered++; const fb = $('#qzfb'); fb.innerHTML = "Time's up. " + QUIZ[qCur].fb; fb.classList.add('show'); $('#' + (qCur < QUIZ.length - 1 ? 'qznext' : 'qzend')).style.display = 'inline-flex'; } }
  }, 1000);
}
function endQuiz() {
  clearInterval(qTimer);
  const acc = qAnswered ? Math.round(qCorrect / qAnswered * 100) : 0;
  if (State.quizBest === null || acc > State.quizBest) State.quizBest = acc;
  save();
  if (acc >= 80) unlock('scholar');
  gainXP(qScore, 'Quiz done · ' + acc + '% · +' + qScore + ' XP');
  go('sRank');
}

/* ============================================================================
   RANK  (Gagné #8 Assess)
   ========================================================================== */
function renderRank() {
  const r = rankFor(State.xp);
  const next = RANKS.find(x => x.xp > State.xp);
  $('#rankPane').innerHTML = `
    <div class="eyebrow">Progress report · ${esc(State.name || 'Recruit')}</div>
    <div class="rkmed">${r.ab}</div>
    <div class="rktitle">${r.t}</div>
    <div class="rksub">${esc(r.sub)}${next ? `<br><br><b style="color:var(--ink3)">${next.xp - State.xp} XP</b> to ${next.t}.` : ''}</div>
    <div class="rkstats">
      <div class="rks"><div class="rksv">${State.xp}</div><div class="rksl">XP</div></div>
      <div class="rks"><div class="rksv">${State.scenesRead.length}/${STORY.length}</div><div class="rksl">Scenes</div></div>
      <div class="rks"><div class="rksv">${State.quizBest === null ? '—' : State.quizBest + '%'}</div><div class="rksl">Best Quiz</div></div>
    </div>
    <div class="sec-head" style="text-align:center"><div class="eyebrow">Badges</div></div>
    <div class="badges">${Object.entries(BADGES).map(([k, l]) => `<div class="badge ${State.badges.includes(k) ? 'on' : ''}">${State.badges.includes(k) ? '🏅' : '🔒'} ${l}</div>`).join('')}</div>
    <button class="btn btn-p" onclick="go('sHome')">Back to module</button>`;
  $('#avatarMini').textContent = State.avatar;
}

/* ============================================================================
   BOOT
   ========================================================================== */
function boot() {
  $('#xpn').textContent = State.xp;
  // resume returning students straight to the home hub
  if (State.name) { $('#nameinp') && ($('#nameinp').value = State.name); }
  Collab.ready.then(m => Portfolio.onCollabReady && Portfolio.onCollabReady(m));
}
document.addEventListener('DOMContentLoaded', boot);
