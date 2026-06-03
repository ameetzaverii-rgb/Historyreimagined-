/* ============================================================================
   Portfolio — the student's "interactive folder" + collaboration.
   (Gagné #9 Enhance retention & transfer · Bloom L6 Create)

   • Folder    : add / edit / reorder / delete learning cards.
   • Present   : a full-screen walkthrough the student can teach from.
   • Collaborate: a real-time class wall + folder sharing via room codes,
                  powered by the Collab layer (Neon live, or local).
   ========================================================================== */
const Portfolio = (() => {
  const KEY = 'hr_folder_v1';
  let cards = load();
  let tab = 'folder';
  let presentIdx = 0;
  let wallUnsub = null;
  const ROOM = window.DEFAULT_ROOM || 'class-history';

  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } }
  function persist() { localStorage.setItem(KEY, JSON.stringify(cards)); }
  const uid = () => 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  const KIND = {
    note: { lbl: 'Note', ph: 'Write your note…' },
    reflection: { lbl: 'Reflection', ph: 'What did this make you think or feel?' },
    quote: { lbl: 'Quote', ph: 'A quote that stuck with you (and who said it)…' },
    image: { lbl: 'Image', ph: 'Paste an image URL (e.g. from Wikimedia Commons)…' },
    source: { lbl: 'Source', ph: 'Paste a link to a source you used…' },
  };

  /* ---- public: add a card (called from activities, scenes, people) ---- */
  function add(kind, title, body) {
    cards.push({ id: uid(), kind: kind || 'note', title: title || '', body: body || '' });
    persist();
    if (cards.length >= 3 && typeof unlock === 'function') unlock('curator');
    if (tab === 'folder' && document.querySelector('#sPortfolio.active')) render();
  }

  /* ---- render the whole portfolio screen ---- */
  function render(opts = {}) {
    if (opts.tab) tab = opts.tab;
    const pane = document.getElementById('portfolioPane');
    pane.innerHTML = `
      <div class="sec-head"><div class="eyebrow">Make it yours</div><h2 class="h2">My Walkthrough</h2>
        <p class="lead">Collect what you learned into an interactive folder, present it like a museum guide, and share it with friends.</p></div>
      <div class="pf-tabs">
        <button class="pf-tab ${tab === 'folder' ? 'on' : ''}" onclick="Portfolio.go('folder')">🗂️ My Folder</button>
        <button class="pf-tab ${tab === 'present' ? 'on' : ''}" onclick="Portfolio.go('present')">▶ Present</button>
        <button class="pf-tab ${tab === 'collab' ? 'on' : ''}" onclick="Portfolio.go('collab')">👥 Collaborate</button>
      </div>
      <div class="pf-pane ${tab === 'folder' ? 'on' : ''}" id="pfFolder"></div>
      <div class="pf-pane ${tab === 'present' ? 'on' : ''}" id="pfPresent"></div>
      <div class="pf-pane ${tab === 'collab' ? 'on' : ''}" id="pfCollab"></div>`;
    renderFolder(); renderPresentTab(); renderCollab();
  }
  function go(t) { tab = t; render(); if (t === 'collab') subscribeWall(); }

  /* ---- FOLDER builder ---- */
  function renderFolder() {
    const el = document.getElementById('pfFolder'); if (!el) return;
    const adder = `<div class="pf-toolbar"><span class="eyebrow" style="margin:0">Add a card:</span><div class="addmenu">
      ${Object.keys(KIND).map(k => `<button class="addbtn" onclick="Portfolio.add('${k}','','')">+ ${KIND[k].lbl}</button>`).join('')}
    </div></div>`;
    if (!cards.length) {
      el.innerHTML = adder + `<div class="pf-empty"><div class="pe">🗂️</div><p>Your folder is empty.</p><p class="lead">Add cards above, or tap “Add to my folder” anywhere in the app — while reading, exploring People, or in “Try It Yourself”.</p></div>`;
      return;
    }
    el.innerHTML = adder + `<div class="foldergrid">${cards.map((c, i) => cardHTML(c, i)).join('')}</div>
      <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-o btn-sm" onclick="Portfolio.exportJSON()">⬇ Export (.json)</button>
        <button class="btn btn-o btn-sm" onclick="Portfolio.go('present')">▶ Present this folder</button>
      </div>`;
    bindCardInputs();
  }
  function cardHTML(c, i) {
    const k = KIND[c.kind] || KIND.note;
    return `<div class="fcardx" data-id="${c.id}">
      <div class="fhead">
        <span class="fkind ${c.kind}">${k.lbl}</span>
        <button class="fmove" title="Move up" onclick="Portfolio.move('${c.id}',-1)">↑</button>
        <button class="fmove" title="Move down" onclick="Portfolio.move('${c.id}',1)">↓</button>
        <button class="fdel" title="Delete" onclick="Portfolio.del('${c.id}')">🗑</button>
      </div>
      <input class="ftitle" data-id="${c.id}" data-f="title" placeholder="Title…" value="${escAttr(c.title)}">
      ${c.kind === 'image' && c.body ? imgPreview(c.body) : ''}
      <textarea data-id="${c.id}" data-f="body" placeholder="${k.ph}">${escHTML(c.body)}</textarea>
    </div>`;
  }
  function imgPreview(url) { return `<img class="fimg" src="${escAttr(url)}" alt="" onerror="this.style.display='none'">`; }
  function bindCardInputs() {
    document.querySelectorAll('#pfFolder [data-f]').forEach(inp => {
      inp.oninput = () => {
        const c = cards.find(x => x.id === inp.dataset.id); if (!c) return;
        c[inp.dataset.f] = inp.value; persist();
        if (c.kind === 'image' && inp.dataset.f === 'body') { /* live preview on next render */ }
      };
      inp.onblur = () => { const c = cards.find(x => x.id === inp.dataset.id); if (c && c.kind === 'image') renderFolder(); };
    });
  }
  function move(id, dir) { const i = cards.findIndex(c => c.id === id); const j = i + dir; if (j < 0 || j >= cards.length) return; [cards[i], cards[j]] = [cards[j], cards[i]]; persist(); renderFolder(); }
  function del(id) { cards = cards.filter(c => c.id !== id); persist(); renderFolder(); }

  function exportJSON() {
    const blob = new Blob([JSON.stringify({ app: 'HistoryReimagined', cards }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'my-walkthrough.json'; a.click(); URL.revokeObjectURL(a.href);
    typeof toast === 'function' && toast('Folder exported');
  }

  /* ---- PRESENT tab ---- */
  function renderPresentTab() {
    const el = document.getElementById('pfPresent'); if (!el) return;
    if (!cards.length) { el.innerHTML = `<div class="pf-empty"><div class="pe">▶</div><p>Add some cards first, then present them as a guided walkthrough.</p></div>`; return; }
    el.innerHTML = `<p class="lead" style="margin-bottom:14px">Step through your folder full-screen — perfect for teaching a friend or presenting in class.</p>
      <button class="btn btn-p" onclick="Portfolio.openPresent()">▶ Start walkthrough (${cards.length} cards)</button>`;
  }
  function openPresent() { presentIdx = 0; document.getElementById('present').classList.add('open'); drawSlide(); if (typeof gainXP === 'function') gainXP(20, '+20 XP · Presenting your learning'); }
  function closePresent() { document.getElementById('present').classList.remove('open'); }
  function slide(dir) { presentIdx = Math.max(0, Math.min(cards.length - 1, presentIdx + dir)); drawSlide(); }
  function drawSlide() {
    const c = cards[presentIdx]; if (!c) return;
    const k = KIND[c.kind] || KIND.note;
    document.getElementById('presentStage').innerHTML = `
      <div class="pkind">${k.lbl} · ${presentIdx + 1} of ${cards.length}</div>
      ${c.title ? `<div class="ptitle">${escHTML(c.title)}</div>` : ''}
      ${c.kind === 'image' && c.body ? `<img class="pimg" src="${escAttr(c.body)}" alt="" onerror="this.style.display='none'">` : `<div class="pbody">${escHTML(c.body) || '<span style=\"color:var(--muted)\">(empty)</span>'}</div>`}`;
    document.getElementById('presentCount').textContent = (presentIdx + 1) + ' / ' + cards.length;
  }

  /* ---- COLLABORATE: wall + sharing ---- */
  function renderCollab() {
    const el = document.getElementById('pfCollab'); if (!el) return;
    const live = Collab.mode === 'neon';
    el.innerHTML = `
      <div class="scfact" style="border-left-color:${live ? 'var(--green)' : 'var(--gold)'};margin-bottom:16px">
        <div class="scfl" style="color:${live ? 'var(--green)' : 'var(--gold)'}">${live ? '🟢 Live · multi-user (Neon)' : '🟡 Local mode'}</div>
        <p>${live
          ? 'Connected to your class through the Neon database — posts and shared folders sync across everyone’s devices (the wall refreshes every few seconds).'
          : 'Working on this device. To turn on real-time sharing across the whole class, connect the Neon database (see <code>README.md</code> → "Set up the database"). Until then you can still share a folder with a friend using a <b>share code</b> below.'}</p>
      </div>

      <div class="sec-head"><div class="eyebrow">Class wall · room “${escHTML(ROOM)}”</div><h2 class="h2">Share thoughts</h2></div>
      <div class="wallcompose">
        <textarea id="wallText" placeholder="Share a thought, a fact you found, or a question for the class…"></textarea>
        <div style="display:flex;gap:8px;align-items:center;margin-top:8px;flex-wrap:wrap">
          <select id="wallTag" style="font-family:var(--fm);font-size:11px;padding:7px;border:1px solid var(--bd);background:var(--bg)">
            <option>Thought</option><option>Did You Know</option><option>Question</option><option>Reflection</option><option>Evaluate</option>
          </select>
          <button class="btn btn-p btn-sm" onclick="Portfolio.post()">Post to wall</button>
        </div>
      </div>
      <div id="wallList"></div>

      <div class="divider"></div>
      <div class="sec-head"><div class="eyebrow">Send your folder to a friend</div><h2 class="h2">Folder share codes</h2></div>
      <div class="sharebox">
        <p class="lead" style="margin:0 0 10px">Publish your folder under a code, then tell a friend the code so they can open it.</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <input id="shareCode" placeholder="choose a code e.g. ${suggestCode()}" style="font-family:var(--fm);font-size:13px;padding:9px 11px;border:1px solid var(--bd);background:var(--bg);flex:1;min-width:160px">
          <button class="btn btn-g btn-sm" onclick="Portfolio.publish()">⬆ Publish</button>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:10px">
          <input id="loadCode" placeholder="enter a friend’s code" style="font-family:var(--fm);font-size:13px;padding:9px 11px;border:1px solid var(--bd);background:var(--bg);flex:1;min-width:160px">
          <button class="btn btn-o btn-sm" onclick="Portfolio.importByCode()">⬇ Load their folder</button>
        </div>
      </div>`;
    subscribeWall();
  }
  function suggestCode() { return (State && State.name ? State.name.toLowerCase().replace(/[^a-z0-9]/g, '') : 'me') + '-' + Math.random().toString(36).slice(2, 5); }

  function subscribeWall() {
    if (wallUnsub) { try { wallUnsub(); } catch {} wallUnsub = null; }
    const list = document.getElementById('wallList'); if (!list) return;
    // seed local wall once so the space is never empty
    seedWall();
    wallUnsub = Collab.onWall(ROOM, posts => {
      const all = posts && posts.length ? posts : CLASS_WALL_SEED.map(s => ({ name: s.name, avatar: s.avatar, text: s.text, tag: s.tag, ts: Date.now() }));
      list.innerHTML = all.map(p => `
        <div class="wallpost">
          <div class="wallav">${escHTML(p.avatar || '🧑')}</div>
          <div class="wallb">
            <div class="wallname">${escHTML(p.name || 'Student')}</div>
            <div class="wallmeta">${timeAgo(p.ts)}<span class="walltag chiptag">${escHTML(p.tag || 'Thought')}</span></div>
            <div class="walltext">${escHTML(p.text)}</div>
          </div>
        </div>`).join('');
    });
  }
  let seeded = false;
  function seedWall() {
    if (seeded || Collab.mode !== 'local') return; seeded = true;
    const key = 'hr_wall_' + ROOM;
    if (!localStorage.getItem(key)) {
      const arr = CLASS_WALL_SEED.map((s, i) => ({ name: s.name, avatar: s.avatar, text: s.text, tag: s.tag, ts: Date.now() - (i + 1) * 3600000 }));
      localStorage.setItem(key, JSON.stringify(arr));
    }
  }
  function post() {
    const ta = document.getElementById('wallText'); const text = ta.value.trim(); if (!text) return;
    const tag = document.getElementById('wallTag').value;
    Collab.postWall(ROOM, { name: State.name || 'Me', avatar: State.avatar || '🧑‍🎓', text, tag });
    ta.value = '';
    if (typeof unlock === 'function') unlock('collaborator');
    if (typeof gainXP === 'function') gainXP(12, '+12 XP · Shared with the class');
  }

  async function publish() {
    const code = (document.getElementById('shareCode').value.trim() || suggestCode()).toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!cards.length) { typeof toast === 'function' && toast('Add some cards first'); return; }
    await Collab.shareFolder(code, { owner: State.name || 'A student', cards });
    typeof toast === 'function' && toast(Collab.mode === 'live' ? 'Published! Share code: ' + code : 'Saved on this device · code: ' + code);
    document.getElementById('shareCode').value = code;
    if (typeof unlock === 'function') unlock('collaborator');
  }
  async function importByCode() {
    const code = document.getElementById('loadCode').value.trim().toLowerCase();
    if (!code) return;
    const data = await Collab.loadFolder(code);
    if (!data || !data.cards) { typeof toast === 'function' && toast('No folder found for that code'); return; }
    const incoming = data.cards.map(c => ({ id: uid(), kind: c.kind, title: (data.owner ? '[' + data.owner + '] ' : '') + (c.title || ''), body: c.body }));
    cards = cards.concat(incoming); persist();
    typeof toast === 'function' && toast('Added ' + incoming.length + ' cards from ' + (data.owner || 'a friend'));
    go('folder');
  }

  /* ---- helpers ---- */
  function timeAgo(ts) { if (!ts) return 'just now'; const s = (Date.now() - ts) / 1000; if (s < 60) return 'just now'; if (s < 3600) return Math.floor(s / 60) + 'm ago'; if (s < 86400) return Math.floor(s / 3600) + 'h ago'; return Math.floor(s / 86400) + 'd ago'; }
  function escHTML(s) { return String(s == null ? '' : s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
  function escAttr(s) { return String(s == null ? '' : s).replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
  function onCollabReady() { if (document.querySelector('#sPortfolio.active') && tab === 'collab') renderCollab(); }

  return { add, render, go, move, del, exportJSON, openPresent, closePresent, slide, post, publish, importByCode, onCollabReady };
})();
