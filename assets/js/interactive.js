/* ============================================================================
   Interactive — the active-learning modes.
   Local History · You Decide · Source Detective · Sort Challenge · Debate Arena
   Uses globals from app.js (esc, img, svgIcon, go, gainXP, unlock, toast,
   State, save) and the Collab layer for the Debate Arena.
   ========================================================================== */
const Interactive = (() => {
  const $ = s => document.getElementById(s);
  let sortState = null, debateUnsub = null;

  /* ====================== HISTORY NEAR YOU ====================== */
  function renderLocal() {
    const pane = $('localPane');
    const loc = State.location;
    if (!loc || !LOCAL_HISTORY[loc]) {
      pane.innerHTML = head('History Near You', 'map',
        'History didn’t happen "somewhere else" — it happened where you live. Pick your region to discover its WW1 & WW2 story.') + `
        <div class="locgrid">${Object.entries(LOCAL_HISTORY).map(([k, v]) =>
          `<button class="loccard" onclick="Interactive.setLocation('${esc(k)}')"><span class="locemoji">${v.emoji}</span><span>${esc(k)}</span></button>`).join('')}</div>`;
      return;
    }
    const d = LOCAL_HISTORY[loc];
    pane.innerHTML = head(`History Near You`, 'map', `Stories connected to <b>${esc(loc)}</b>.`) + `
      <div style="margin-bottom:18px"><button class="btn btn-o btn-sm" onclick="Interactive.changeLocation()">${svgIcon('map', 'width="14" height="14"')} Change region</button></div>
      ${d.snippets.map(s => `<div class="locsnip"><div class="locemoji" style="font-size:30px">${d.emoji}</div><div><h4>${esc(s.t)}</h4><p>${esc(s.d)}</p>
        <button class="addbtn" style="margin-top:8px" onclick='Portfolio.add("note",${JSON.stringify(s.t)},${JSON.stringify("History near me: " + s.d)});toast("Saved to your folder")'>+ Save to folder</button></div></div>`).join('')}`;
  }
  function setLocation(k) { State.location = k; save(); gainXP(10, '+10 XP · ' + k + ' unlocked'); renderLocal(); }
  function changeLocation() { State.location = null; save(); renderLocal(); }

  /* ====================== YOU DECIDE (branching) ====================== */
  function renderDecide() {
    $('decidePane').innerHTML = head('You Decide', 'flag',
      'Step into history’s biggest moments. Make a choice, then see what really happened. There are no easy answers.') + `
      <div class="declist">${DECISIONS.map(d => `<div class="deccard" onclick="Interactive.openDecision('${d.id}')">
        <span class="decicon">${d.icon}</span>
        <div><h3>${esc(d.title)}</h3><p>${esc(d.setup)}</p></div>
        <span class="decgo">${svgIcon('flag', 'width="16" height="16"')}</span></div>`).join('')}</div>`;
  }
  function openDecision(id) {
    const d = DECISIONS.find(x => x.id === id); if (!d) return;
    gainXP(6, '+6 XP · Decision opened');
    $('decidePane').innerHTML = `<button class="btn btn-o btn-sm" style="margin-bottom:16px" onclick="Interactive.renderDecide()">← All scenarios</button>
      <div class="decstage"><span class="decicon" style="font-size:40px">${d.icon}</span>
      <h2 class="h2">${esc(d.title)}</h2>
      <p class="declead">${d.setup}</p>
      <div class="decbloom" style="margin:18px 0 8px">What do you do?</div>
      <div class="decchoices">${d.choices.map((c, i) => `<button class="decchoice" onclick="Interactive.choose('${id}',${i})">${esc(c.label)}</button>`).join('')}</div>
      <div id="decOutcome"></div></div>`;
  }
  function choose(id, i) {
    const d = DECISIONS.find(x => x.id === id); const c = d.choices[i];
    document.querySelectorAll('.decchoice').forEach((b, j) => { b.disabled = true; b.classList.toggle('chosen', j === i); });
    gainXP(14, '+14 XP · You decided');
    $('decOutcome').innerHTML = `<div class="decresult"><div class="scfl">What happened</div><p>${c.outcome}</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">
        <button class="btn btn-o btn-sm" onclick="Interactive.openDecision('${id}')">↺ Try another choice</button>
        <button class="btn btn-g btn-sm" onclick='Portfolio.add("reflection",${JSON.stringify(d.title)},${JSON.stringify("I chose: " + c.label + "\n\nWhat I learned: ")});toast("Saved to your folder")'>+ Reflect in folder</button>
        <button class="btn btn-p btn-sm" onclick="Interactive.renderDecide()">More scenarios →</button>
      </div></div>`;
    $('decOutcome').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ====================== SOURCE DETECTIVE (hotspots) ====================== */
  function renderDetective() {
    $('detectivePane').innerHTML = head('Source Detective', 'target',
      'Real historians don’t memorise — they investigate evidence. Examine a real source, tap the clues, and learn to read history like a detective.') + `
      <div class="srcgrid">${SOURCES.map(s => `<div class="srccard" onclick="Interactive.openSource('${s.id}')">
        ${img(s.img, 'srcthumb', s.title)}
        <div class="srcb"><div class="srckind">${esc(s.kind)}</div><h3>${esc(s.title)}</h3></div></div>`).join('')}</div>`;
  }
  function openSource(id) {
    const s = SOURCES.find(x => x.id === id); if (!s) return;
    gainXP(6, '+6 XP · Investigating');
    $('detectivePane').innerHTML = `<button class="btn btn-o btn-sm" style="margin-bottom:16px" onclick="Interactive.renderDetective()">← All sources</button>
      <div class="srckind">${esc(s.kind)}</div><h2 class="h2" style="margin-bottom:6px">${esc(s.title)}</h2>
      <p class="declead" style="margin-bottom:14px">${esc(s.question)}</p>
      <div class="srcstage">${img(s.img, 'srcimg', s.title)}
        ${s.hotspots.map((h, i) => `<button class="hotspot" style="left:${h.x}%;top:${h.y}%" onclick="Interactive.hotspot('${id}',${i},this)"><span>${i + 1}</span></button>`).join('')}
      </div>
      <div id="srcReveal" class="srcreveal"><p class="srchint">👆 Tap each numbered clue on the source.</p></div>`;
  }
  const _viewed = {};
  function hotspot(id, i, el) {
    const s = SOURCES.find(x => x.id === id); const h = s.hotspots[i];
    el.classList.add('seen');
    _viewed[id] = _viewed[id] || new Set(); _viewed[id].add(i);
    gainXP(3);
    let html = `<div class="srcclue"><div class="scfl">Clue ${i + 1} · ${esc(h.t)}</div><p>${h.d.replace(/\*(.+?)\*/g, '<em>$1</em>')}</p></div>`;
    if (_viewed[id].size >= s.hotspots.length) {
      html += `<div class="srctake"><div class="scfl">${svgIcon('check', 'width="13" height="13"')} What a historian concludes</div><p>${esc(s.takeaway)}</p>
        <button class="btn btn-g btn-sm" style="margin-top:12px" onclick='Portfolio.add("source",${JSON.stringify(s.title)},${JSON.stringify(s.takeaway)});toast("Saved to your folder")'>+ Save finding</button></div>`;
      unlock('researcher');
    }
    $('srcReveal').innerHTML = html;
  }

  /* ====================== SORT CHALLENGE ====================== */
  function renderSort() {
    $('sortPane').innerHTML = head('Sort It Out', 'target',
      'Quick brain workouts. Order events, pick sides, sort causes from consequences — then check your score.') + `
      <div class="srcgrid">${SORTS.map(s => `<div class="srccard" style="cursor:pointer" onclick="Interactive.openSort('${s.id}')">
        <div class="srcb"><span style="font-size:30px">${s.icon}</span><h3 style="margin-top:8px">${esc(s.title)}</h3><p style="font-size:12.5px;color:var(--muted)">${esc(s.prompt)}</p></div></div>`).join('')}</div>`;
  }
  function openSort(id) {
    const s = SORTS.find(x => x.id === id); if (!s) return;
    if (s.type === 'order') {
      const order = s.items.map((_, i) => i).sort(() => Math.random() - 0.5);
      sortState = { id, type: 'order', order };
    } else {
      sortState = { id, type: 'bucket', assign: {}, sel: null };
    }
    drawSort();
  }
  function drawSort() {
    const s = SORTS.find(x => x.id === sortState.id);
    const back = `<button class="btn btn-o btn-sm" style="margin-bottom:16px" onclick="Interactive.renderSort()">← All challenges</button>`;
    const headHtml = `<div class="srckind">Quick challenge</div><h2 class="h2" style="margin-bottom:4px">${s.icon} ${esc(s.title)}</h2><p class="declead" style="margin-bottom:16px">${esc(s.prompt)}</p>`;
    let body;
    if (s.type === 'order') {
      body = `<div class="orderlist">${sortState.order.map((it, pos) => `<div class="orderrow">
        <span class="ordnum">${pos + 1}</span><span class="ordtxt">${esc(s.items[it].t)}</span>
        <span class="ordmoves"><button onclick="Interactive.sortMove(${pos},-1)" ${pos === 0 ? 'disabled' : ''}>▲</button><button onclick="Interactive.sortMove(${pos},1)" ${pos === sortState.order.length - 1 ? 'disabled' : ''}>▼</button></span></div>`).join('')}</div>`;
    } else {
      const pool = s.items.map((it, i) => i).filter(i => !(i in sortState.assign));
      body = `<div class="bucketpool">${pool.map(i => `<button class="poolitem ${sortState.sel === i ? 'sel' : ''}" onclick="Interactive.sortPick(${i})">${esc(s.items[i].t)}</button>`).join('') || '<span class="srchint">All sorted — press Check!</span>'}</div>
      <div class="buckets">${s.buckets.map(b => `<div class="bucket" onclick="Interactive.sortBucket('${esc(b)}')"><div class="buckethd">${esc(b)}</div>
        ${s.items.map((it, i) => sortState.assign[i] === b ? `<button class="poolitem placed" onclick="event.stopPropagation();Interactive.sortUnplace(${i})">${esc(it.t)} ✕</button>` : '').join('')}</div>`).join('')}</div>
      <p class="srchint">Tap an item, then tap a box. Tap a placed item to remove it.</p>`;
    }
    $('sortPane').innerHTML = back + headHtml + body + `<div id="sortResult"></div>
      <button class="btn btn-p" style="margin-top:18px" onclick="Interactive.sortCheck()">Check my answer</button>`;
  }
  function sortMove(pos, dir) { const o = sortState.order; const j = pos + dir; if (j < 0 || j >= o.length) return; [o[pos], o[j]] = [o[j], o[pos]]; drawSort(); }
  function sortPick(i) { sortState.sel = (sortState.sel === i ? null : i); drawSort(); }
  function sortBucket(b) { if (sortState.sel == null) return; sortState.assign[sortState.sel] = b; sortState.sel = null; drawSort(); }
  function sortUnplace(i) { delete sortState.assign[i]; drawSort(); }
  function sortCheck() {
    const s = SORTS.find(x => x.id === sortState.id);
    let correct = 0, total = s.items.length;
    if (s.type === 'order') {
      const right = s.items.map((_, i) => i).sort((a, b) => s.items[a].year - s.items[b].year);
      sortState.order.forEach((it, pos) => { if (it === right[pos]) correct++; });
    } else {
      if (Object.keys(sortState.assign).length < total) { $('sortResult').innerHTML = `<div class="decresult"><p>Sort all the items first! 🙂</p></div>`; return; }
      s.items.forEach((it, i) => { if (sortState.assign[i] === it.b) correct++; });
    }
    const pct = Math.round(correct / total * 100);
    const win = pct === 100;
    if (win) { gainXP(25, '+25 XP · Perfect sort!'); } else gainXP(10, '+10 XP · Nice try');
    $('sortResult').innerHTML = `<div class="decresult" style="border-color:${win ? 'var(--turq)' : 'var(--orange)'}">
      <div class="scfl">${win ? '🎉 Perfect!' : 'Score'}</div><p style="font-size:22px;font-family:var(--fh);color:var(--azure)">${correct} / ${total} correct (${pct}%)</p>
      <p style="margin-top:6px">${win ? 'You’ve mastered this one.' : 'Adjust and check again — you’ve got this.'}</p></div>`;
  }

  /* ====================== DEBATE ARENA (Neon-backed) ====================== */
  function renderDebate() {
    if (debateUnsub) { try { debateUnsub(); } catch {} debateUnsub = null; }
    $('debatePane').innerHTML = head('Debate Arena', 'share',
      'History has more than one side. Pick a position, make your case, and see what your classmates argue. Powered by your live class database.') + `
      <div class="declist">${DEBATES.map(d => `<div class="deccard" onclick="Interactive.openDebate('${d.id}')">
        <span class="decicon">⚖️</span><div><h3>${esc(d.q)}</h3><p>${esc(d.ctx)}</p></div>
        <span class="decgo">${svgIcon('share', 'width="16" height="16"')}</span></div>`).join('')}</div>`;
  }
  function openDebate(id) {
    const d = DEBATES.find(x => x.id === id); if (!d) return;
    const room = 'debate:' + id;
    $('debatePane').innerHTML = `<button class="btn btn-o btn-sm" style="margin-bottom:16px" onclick="Interactive.renderDebate()">← All debates</button>
      <div class="srckind">${Collab.mode === 'neon' ? '🟢 Live class debate' : '🟡 Local (connect Neon to go live)'}</div>
      <h2 class="h2" style="margin:4px 0 6px">${esc(d.q)}</h2><p class="declead" style="margin-bottom:14px">${esc(d.ctx)}</p>
      <div class="debcompose">
        <div class="debpick"><button class="debside for" id="debFor" onclick="Interactive.debateSide('for')">👍 ${esc(d.for)}</button>
        <button class="debside against" id="debAgainst" onclick="Interactive.debateSide('against')">👎 ${esc(d.against)}</button></div>
        <textarea id="debText" placeholder="Pick a side above, then write your argument…"></textarea>
        <button class="btn btn-p btn-sm" id="debPostBtn" onclick="Interactive.debatePost('${id}')" disabled>Post my argument</button>
      </div>
      <div class="debcols">
        <div class="debcol"><div class="debcolhd for">👍 ${esc(d.for)} (<span id="debForN">0</span>)</div><div id="debForList"></div></div>
        <div class="debcol"><div class="debcolhd against">👎 ${esc(d.against)} (<span id="debAgainstN">0</span>)</div><div id="debAgainstList"></div></div>
      </div>`;
    _debSide = null;
    if (debateUnsub) { try { debateUnsub(); } catch {} }
    debateUnsub = Collab.onWall(room, posts => {
      const f = posts.filter(p => p.tag === 'for'), a = posts.filter(p => p.tag === 'against');
      $('debForN').textContent = f.length; $('debAgainstN').textContent = a.length;
      $('debForList').innerHTML = f.map(debCard).join('') || empty();
      $('debAgainstList').innerHTML = a.map(debCard).join('') || empty();
    });
  }
  let _debSide = null;
  function debateSide(side) {
    _debSide = side;
    $('debFor').classList.toggle('on', side === 'for');
    $('debAgainst').classList.toggle('on', side === 'against');
    $('debPostBtn').disabled = false;
  }
  function debatePost(id) {
    const txt = $('debText').value.trim(); if (!txt || !_debSide) return;
    Collab.postWall('debate:' + id, { name: State.name || 'Me', avatar: State.avatar || '🧑‍🎓', tag: _debSide, text: txt });
    $('debText').value = '';
    unlock('collaborator'); gainXP(15, '+15 XP · Argument posted');
  }
  function debCard(p) { return `<div class="debarg"><div class="debarghd">${esc(p.avatar || '🧑')} ${esc(p.name || 'Student')}</div><p>${esc(p.text)}</p></div>`; }
  function empty() { return `<p class="srchint" style="padding:12px">No arguments yet — be the first!</p>`; }

  /* ---- shared ---- */
  function head(title, icon, lead) {
    return `<div class="sec-head"><div class="eyebrow">${svgIcon(icon, 'width="14" height="14"')} Interactive</div><h2 class="h2">${esc(title)}</h2><p class="lead">${lead}</p></div>`;
  }

  return {
    renderLocal, setLocation, changeLocation,
    renderDecide, openDecision, choose,
    renderDetective, openSource, hotspot,
    renderSort, openSort, sortMove, sortPick, sortBucket, sortUnplace, sortCheck,
    renderDebate, openDebate, debateSide, debatePost,
  };
})();
