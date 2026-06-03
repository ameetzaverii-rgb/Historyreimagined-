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
  return { name: '', avatar: '🧑‍🎓', grade: 9, xp: 0, scenesRead: [], quizBest: null, badges: [], mapPins: [] };
}
function save() { localStorage.setItem(SAVE_KEY, JSON.stringify(State)); }
let atlasGrade = null; // which grade the Curriculum Atlas is currently showing

/* ---------- tiny DOM helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// graceful image fallback: turns broken images into a captioned placeholder block
window.imgErr = (el, cap) => { el.classList.add('imgfallback'); el.removeAttribute('src'); el.setAttribute('data-cap', cap || 'Archive image'); el.onerror = null; };
const img = (src, cls, cap, attrs = '') => `<img class="${cls}" src="${src}" alt="${esc(cap || '')}" loading="lazy" onerror="imgErr(this,'${esc((cap || '').slice(0, 40))}')" ${attrs}>`;

/* ---------- modern line-icon set (stroke-based, GSL style) ---------- */
const ICONS = {
  atlas: '<path d="M4 5a2 2 0 012-2h5v18H6a2 2 0 01-2-2z"/><path d="M20 5a2 2 0 00-2-2h-5v18h5a2 2 0 002-2z"/>',
  story: '<path d="M12 6c-2-1.4-5-1.4-7 0v12c2-1.4 5-1.4 7 0 2-1.4 5-1.4 7 0V6c-2-1.4-5-1.4-7 0z"/><path d="M12 6v12"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  people: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0111 0"/><path d="M16 5.6a3 3 0 010 5.2"/><path d="M16.8 13.5a5.5 5.5 0 013.7 5.5"/>',
  map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
  media: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M11 9.2l4 2.8-4 2.8z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/>',
  folder: '<path d="M3 8a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>',
  bolt: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>',
  medal: '<circle cx="12" cy="14.5" r="6"/><path d="M9 9.5L6 3M15 9.5L18 3"/><path d="M12 11.5l1 2 2 .3-1.5 1.4.4 2-1.9-1-1.9 1 .4-2L9 13.8l2-.3z"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
};
const svgIcon = (name, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${extra}>${ICONS[name] || ''}</svg>`;

/* ---------- navigation ---------- */
const MAIN_NAV = ['sHome', 'sTimeline', 'sRead', 'sPortfolio', 'sQuiz'];
const RENDERED = new Set();
function go(id, opts = {}) {
  $$('.screen').forEach(s => s.classList.remove('active'));
  const el = $('#' + id); if (!el) return;
  el.classList.add('active');
  const chrome = id !== 's0';
  $('#topbar').classList.toggle('show', chrome);
  $('#botnav').classList.toggle('show', chrome);
  const gw = $('#guideWrap'); if (gw) gw.style.display = chrome ? 'flex' : 'none';
  if (!chrome && window.Guide) Guide.close();
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
    case 'sRead': Reader.render(); break;
    case 'sMedia': renderMedia(); break;
    case 'sActivities': renderActivities(); break;
    case 'sQuiz': startQuiz(); break;
    case 'sRank': renderRank(); break;
    case 'sPortfolio': Portfolio.render(opts); break;
    case 'sLocal': Interactive.renderLocal(); break;
    case 'sDecide': Interactive.renderDecide(); break;
    case 'sDetective': Interactive.renderDetective(); break;
    case 'sSort': Interactive.renderSort(); break;
    case 'sDebate': Interactive.renderDebate(); break;
  }
}

/* ---------- onboarding ---------- */
function pickAvatar(el) { $$('.s0av').forEach(a => a.classList.remove('on')); el.classList.add('on'); State.avatar = el.textContent; }
function pickGrade(n, el) { $$('.gchip').forEach(a => a.classList.remove('on')); el.classList.add('on'); State.grade = n; atlasGrade = n; }
function begin() {
  const v = $('#nameinp').value.trim();
  if (!v) { const i = $('#nameinp'); i.style.borderBottomColor = 'var(--red)'; i.focus(); setTimeout(() => i.style.borderBottomColor = '', 1200); return; }
  State.name = v; save();
  unlock('first', 'First Steps');
  go('sHome');
  window.Guide && Guide.init();
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
function unlock(key, label) { if (!State.badges.includes(key)) { State.badges.push(key); save(); toast('🏅 Badge unlocked — ' + (label || BADGES[key])); window.Guide && Guide.react('badge'); } }
let toastT;
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600); }

/* ============================================================================
   HOME  (Gagné #2 Inform Objectives, #3 Recall, overview of everything)
   ========================================================================== */
const HUBS = [
  { id: 'sAtlas', ic: 'atlas', ac: 'var(--azure)', t: 'Curriculum Atlas', d: 'Your NCERT grade, indexed & linked' },
  { id: 'sRead', ic: 'story', ac: 'var(--turq-d)', t: 'Read the Book', d: 'One coherent, living textbook' },
  { id: 'sTimeline', ic: 'clock', ac: 'var(--purple)', t: 'Timeline', d: '1914 → 1947, interactive' },
  { id: 'sPeople', ic: 'people', ac: 'var(--orange)', t: 'Personalities', d: 'The people who shaped the age' },
  { id: 'sWars', ic: 'map', ac: 'var(--azure)', t: 'Wars & Map', d: 'WW1, WW2 and the battle map' },
  { id: 'sMedia', ic: 'media', ac: 'var(--purple)', t: 'Media Library', d: 'Open resources & video' },
  { id: 'sActivities', ic: 'target', ac: 'var(--turq-d)', t: 'Try It Yourself', d: 'Quick tasks → your folder' },
  { id: 'sPortfolio', ic: 'folder', ac: 'var(--orange)', t: 'My Walkthrough', d: 'Build & share your folder' },
  { id: 'sQuiz', ic: 'bolt', ac: 'var(--azure)', t: 'Quiz', d: 'Test yourself, earn XP' },
  { id: 'sLocal', ic: 'map', ac: 'var(--purple)', t: 'History Near You', d: 'Your region’s WW story' },
  { id: 'sDecide', ic: 'flag', ac: 'var(--orange)', t: 'You Decide', d: 'Make history’s big choices' },
  { id: 'sDetective', ic: 'target', ac: 'var(--azure)', t: 'Source Detective', d: 'Decode real evidence' },
  { id: 'sSort', ic: 'check', ac: 'var(--turq-d)', t: 'Sort It Out', d: 'Order, match & score' },
  { id: 'sDebate', ic: 'share', ac: 'var(--purple)', t: 'Debate Arena', d: 'Argue it live with class' },
  { id: 'sRank', ic: 'medal', ac: 'var(--turq-d)', t: 'Progress', d: 'XP, ranks & badges' },
];
// Student-facing journey map (derived from stored progress, so it persists).
function journeySteps() {
  const done = State.scenesRead.length, total = STORY.length;
  return [
    { ic: 'flag', t: 'Get set', d: 'You created your explorer profile.', done: true },
    { ic: 'story', t: 'Read the book', d: `${done} of ${total} chapters read`, done: done >= total, go: 'sRead' },
    { ic: 'clock', t: 'Explore the timeline', d: 'Trace how one event led to the next', done: State.badges.includes('timetraveller'), go: 'sTimeline' },
    { ic: 'map', t: 'Meet the people & places', d: 'Personalities and the battle map', done: State.mapPins.length > 0, go: 'sWars' },
    { ic: 'bolt', t: 'Take the quiz', d: State.quizBest == null ? 'Test yourself to earn XP' : `Best score: ${State.quizBest}%`, done: State.quizBest != null, go: 'sQuiz' },
    { ic: 'folder', t: 'Build your walkthrough', d: 'Collect your learning into a folder', done: State.badges.includes('curator'), go: 'sPortfolio' },
    { ic: 'share', t: 'Teach a friend', d: 'Share on the class collaboration wall', done: State.badges.includes('collaborator'), go: 'sPortfolio' },
  ];
}
function renderJourney() {
  const steps = journeySteps();
  const nowI = steps.findIndex(s => !s.done);
  return `<div class="journey">${steps.map((s, i) => {
    const cls = s.done ? 'done' : (i === nowI ? 'now' : '');
    const meta = s.done ? '✓ Done' : (i === nowI ? 'You are here' : 'Up next');
    return `<div class="jstep ${cls}">
      <div class="jrail"><div class="jnode">${s.done ? svgIcon('check') : svgIcon(s.ic)}</div>${i === steps.length - 1 ? '' : '<div class="jline"></div>'}</div>
      <div class="jbody" ${s.go ? `onclick="go('${s.go}')"` : ''}><div class="jmeta">${meta}</div><h4>${esc(s.t)}</h4><p>${esc(s.d)}</p></div>
    </div>`;
  }).join('')}</div>`;
}
const EXPLORE = [
  ['sTimeline', 'clock', 'Timeline'], ['sPeople', 'people', 'People'], ['sWars', 'map', 'Maps'],
  ['sDecide', 'flag', 'You Decide'], ['sDetective', 'target', 'Detective'], ['sSort', 'check', 'Sort'],
  ['sDebate', 'share', 'Debate'], ['sLocal', 'map', 'Near You'], ['sActivities', 'target', 'Try It'],
  ['sMedia', 'media', 'Videos'], ['sAtlas', 'atlas', 'Atlas'],
];
function renderHome() {
  const m = MODULE, r = rankFor(State.xp);
  const steps = journeySteps(); const next = steps.find(s => !s.done) || steps[steps.length - 1];
  const started = State.scenesRead.length > 0;
  $('#homePane').innerHTML = `
    <div class="greetstrip">
      <div class="greetav">${State.avatar}</div>
      <div class="greetb"><h3>Hi ${esc(State.name || 'Explorer')} 👋</h3><p>${r.t} · ${State.xp} XP</p></div>
      <div class="gradetag" onclick="go('sAtlas')">Class ${State.grade} ›</div>
    </div>

    <div class="home-hero">
      ${img(m.hero, '', 'Cover')}
      <div class="home-hg"></div>
      <div class="home-hc">
        <div class="eyebrow">${esc(m.anchor)}</div>
        <h1>From Trenches to <em>Tyranny</em></h1>
        <p>${esc(m.subtitle)}</p>
        <button class="btn btn-g" style="margin-top:14px" onclick="go('sRead')">${svgIcon('story', 'width="16" height="16"')} ${started ? 'Continue reading' : 'Start reading'} →</button>
      </div>
    </div>

    <div class="continue" onclick="go('${next.go || 'sRead'}')">
      <div class="cont-ic">${svgIcon(next.ic)}</div>
      <div class="cont-b"><div class="cont-lbl">Up next for you</div><h3>${esc(next.t)}</h3><p>${esc(next.d)}</p></div>
      <div class="cont-go">→</div>
    </div>

    <div class="sec-head" style="margin-top:24px"><div class="eyebrow">${svgIcon('people', 'width="14" height="14"')} Meet the cast</div></div>
    <div class="faces">
      ${['hitler', 'gandhi', 'annefrank', 'lenin', 'churchill', 'bose'].map(id => { const p = PEOPLE.find(x => x.id === id); return p ? `<div class="face" onclick="openPerson('${id}')">${img(p.img, '', p.name)}<span>${esc(p.name.split(' ').slice(-1)[0])}</span></div>` : ''; }).join('')}
    </div>

    <div class="sec-head" style="margin-top:28px"><div class="eyebrow">${svgIcon('flag', 'width="14" height="14"')} Your journey</div><h2 class="h2">How far you’ve come</h2></div>
    ${renderJourney()}

    <div class="divider"></div>
    <div class="sec-head"><h2 class="h2">Explore</h2><p class="lead">Dip into any part of the story whenever you like.</p></div>
    <div class="explore-row">
      ${EXPLORE.map(([id, ic, t]) => `<button class="explore-chip" onclick="go('${id}')">${svgIcon(ic)}<span>${t}</span></button>`).join('')}
    </div>

    <div class="divider"></div>
    <div class="factstrip">
      <div class="fact-ic">💡</div>
      <div style="flex:1"><div class="cont-lbl">Did you know?</div><p id="homeFact">${esc(FACTS[Math.floor(Math.random() * FACTS.length)])}</p></div>
      <button class="fact-more" onclick="$('#homeFact').textContent=FACTS[Math.floor(Math.random()*FACTS.length)]" aria-label="Another fact">↻</button>
    </div>`;
}

/* ============================================================================
   CURRICULUM ATLAS  (Gagné #3 Recall — links to prior + related chapters)
   ========================================================================== */
function setAtlasGrade(n) { atlasGrade = n; renderAtlas(); }
function renderAtlas() {
  unlock('atlas');
  if (atlasGrade == null) atlasGrade = State.grade || 9;
  const g = NCERT.grades.find(x => x.grade === atlasGrade) || NCERT.grades[1];
  const isYours = atlasGrade === State.grade;
  $('#atlasPane').innerHTML = `
    <div class="sec-head"><div class="eyebrow">${svgIcon('atlas', 'width="14" height="14"')} NCERT Social Science</div><h2 class="h2">Curriculum Atlas</h2>
      <p class="lead">${isYours ? `Showing <b>Class ${atlasGrade}</b> — your grade.` : `Showing <b>Class ${atlasGrade}</b>.`} The chapter this module is built on is highlighted. Tap any chapter to open the official NCERT PDF.</p></div>

    <div class="gradeswitch">
      ${NCERT.grades.map(x => `<button class="gsw ${x.grade === atlasGrade ? 'on' : ''}" onclick="setAtlasGrade(${x.grade})">Class ${x.grade}${x.grade === State.grade ? ' ★' : ''}</button>`).join('')}
    </div>

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
    </div>

    <div class="scfact" style="margin:18px 0"><div class="scfl">${svgIcon('share', 'width="13" height="13"')} How your grade connects to the module</div><p>${atlasGrade === 8 ? 'Your Grade 8 study of <strong>colonial India</strong> explains why millions of Indians ended up fighting in the World Wars — the human link between your history and world history.' : atlasGrade === 9 ? 'This is the <strong>home grade</strong> of the module: the Russian Revolution (Ch.2) and the Rise of Nazism (Ch.3) are exactly the story you live through here.' : 'Your Grade 10 chapters on <strong>nationalism</strong> and the <strong>making of a global world</strong> show how these wars reshaped Europe and India’s freedom struggle.'}</p></div>

    <p class="lead" style="text-align:center">Source: NCERT · <a href="${NCERT.portal}" target="_blank" rel="noopener">ncert.nic.in</a></p>`;
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
  $('#mapinfoBody').innerHTML = `
    <div class="mt">${p.flag || ''} ${esc(p.tag)}</div><h4>${esc(p.t)}</h4>
    <div class="maptabs"><button class="maptab on" id="mtThen" onclick="mapTab('then')">Then · history</button><button class="maptab" id="mtNow" onclick="mapTab('now')">Now · today</button></div>
    <div id="mapThen"><p>${esc(p.tx)}</p><div class="mf">${esc(p.fa)}</div></div>
    <div id="mapNow" hidden>
      <div class="mapframe"><iframe loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=${encodeURIComponent(p.place || p.t)}&z=11&output=embed" title="${esc(p.t)} on the map"></iframe></div>
      <p style="margin-top:9px">${esc(p.today || '')}</p>
    </div>`;
  $('#mapinfo').classList.add('open');
}
function mapTab(which) {
  const now = which === 'now';
  $('#mapThen').hidden = now; $('#mapNow').hidden = !now;
  $('#mtThen').classList.toggle('on', !now); $('#mtNow').classList.toggle('on', now);
  if (now) gainXP(3, '+3 XP · The place today');
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
  $('#shimg').onerror = function () { imgErr(this, s.ti); };
  $('#shimg').src = s.img;
  $('#shch').textContent = s.ch;
  $('#shtitle').textContent = s.ti;
  $('#shsub').textContent = s.su;
  $('#shcr').textContent = s.cr || '';
  const bl = $('#shbloom'); if (bl) bl.style.display = 'none';
  $('#sdidx').textContent = scIdx + 1;
  $('#sdrow').innerHTML = STORY.map((_, j) => `<div class="sddot ${j < scIdx ? 'done' : j === scIdx ? 'now' : ''}" onclick="renderScene(${j})"></div>`).join('');
  $('#scBody').className = 'scbody' + (s.lead ? ' firstcap' : '');
  $('#scBody').innerHTML = s.body;
  $('#scExtra').innerHTML = renderExtra(s.extra);
  $('#scnext').innerHTML = scIdx >= STORY.length - 1 ? 'Finish → Quiz' : 'Next Scene →';
  $('#rp').style.width = ((scIdx + 1) / STORY.length * 100) + '%';
  if (!State.scenesRead.includes(scIdx)) { State.scenesRead.push(scIdx); save(); gainXP(15, '+15 XP · Scene read'); }
  if (State.scenesRead.length >= STORY.length) unlock('storyteller');
  // ground Sage in the current page so its answers are about what you're reading
  window.readerContext = { title: s.ti, text: (s.su || '') + ' ' + (s.body || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() };
  bindGlossary();
  applyReveal();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
/* scrollytelling: fade + rise blocks in as they enter the viewport */
function applyReveal() {
  const els = [$('#scBody'), ...$$('#scExtra > *')].filter(Boolean);
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver((ents) => {
    ents.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
  els.forEach(e => { e.classList.add('reveal'); io.observe(e); });
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
    <div class="sec-head"><div class="eyebrow">Make it yours</div><h2 class="h2">Try It Yourself</h2>
      <p class="lead">Short thinking tasks — no grades, no pressure. Tap one and it pops a starter note into your <b>Folder</b>, ready for you to finish in your own words. Great for revision or homework.</p></div>
    <div class="howto"><span>${svgIcon('check', 'width="15" height="15"')}</span> <b>How it works:</b> Pick a task → finish the note in your Folder → present it or share it with friends.</div>
    <div class="actgrid">${ACTIVITIES.map(a => `<div class="actcard">
        <div class="ah"><span class="aico">${a.icon}</span></div>
        <h4>${esc(a.t)}</h4><p>${esc(a.d)}</p>
        <button class="btn btn-g btn-sm" onclick='Portfolio.add("note", ${JSON.stringify(a.t)}, ${JSON.stringify(a.starter)});toast("Added to your Folder — open Folder to finish");gainXP(10,"+10 XP · Nice start")'>+ Add to my Folder</button>
      </div>`).join('')}</div>`;
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
  $('#quizPane').innerHTML = `
    <div class="qzpips">${QUIZ.map((_, i) => `<div class="qzpip ${i < qCur ? 'done' : i === qCur ? 'now' : ''}"></div>`).join('')}</div>
    <div class="qzmeta"><span class="qzbloom" style="background:rgba(255,255,255,.16)">Question ${qCur + 1} of ${QUIZ.length}</span><span class="qztime"><span id="qzt">30</span>s left</span></div>
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
  if (ok) { qCorrect++; const pts = Math.max(10, qLeft * 3); qScore += pts; gainXP(pts, '+' + pts + ' XP · Correct!'); $('#qzscv').textContent = qScore; window.Guide && Guide.react('quiz'); }
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
  atlasGrade = State.grade || 9;
  // reflect a returning student's saved choices on the landing screen
  if (State.name) {
    const ni = $('#nameinp'); if (ni) ni.value = State.name;
    $$('.s0av').forEach(a => a.classList.toggle('on', a.textContent === State.avatar));
    $$('.gchip').forEach(c => c.classList.toggle('on', c.textContent.startsWith(String(State.grade))));
    $('#avatarMini') && ($('#avatarMini').textContent = State.avatar);
  }
  Collab.ready.then(m => Portfolio.onCollabReady && Portfolio.onCollabReady(m));
}
document.addEventListener('DOMContentLoaded', boot);
