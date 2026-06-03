/* ============================================================================
   Reader — "The Living Textbook".
   Renders ONE deeply-built chapter (DEEP_META + DEEP_CHAPTER) as a single,
   continuous, beautiful read: flowing sections, real images, contextual video,
   inline interactions, key people, and Sage grounded to the chapter.
   Globals: DEEP_META, DEEP_CHAPTER, PEOPLE, img, esc, svgIcon, sideLabel,
   bindGlossary, State, gainXP, save, unlock, Guide.
   ========================================================================== */
const Reader = (() => {
  let built = false, ticking = false;

  function render() {
    if (!built) {
      const pane = document.getElementById('readerPane');
      pane.innerHTML = cover()
        + `<article class="bk-ch"><div class="bk-body bk-deepbody">${DEEP_CHAPTER.map(section).join('')}</div></article>`
        + soon() + endCard();
      built = true;
      window.readerContext = {
        title: DEEP_META.title,
        text: DEEP_CHAPTER.filter(s => s.t === 'para').map(s => s.html.replace(/<[^>]+>/g, ' ')).join(' ').replace(/\s+/g, ' ').slice(0, 4500),
      };
      if (typeof bindGlossary === 'function') bindGlossary();
      observe();
      if (!State.scenesRead.includes(0)) { State.scenesRead.push(0); save(); gainXP(20, '+20 XP · Chapter opened'); }
    }
    wireScroll();
  }

  function cover() {
    return `<section class="bk-cover">
      <div class="bk-cover-ovl"></div>
      ${img(DEEP_META.cover, 'bk-cover-img', 'Cover')}
      <div class="bk-cover-c">
        <div class="bk-kicker">${esc(DEEP_META.kicker)}</div>
        <h1 class="bk-title">${esc(DEEP_META.title)}</h1>
        <p class="bk-sub">${esc(DEEP_META.subtitle)}</p>
        <div class="bk-scroll">Scroll to begin ↓</div>
      </div>
    </section>`;
  }

  function section(s) {
    switch (s.t) {
      case 'minihead': return `<h3 class="bk-minihead reveal">${esc(s.text)}</h3>`;
      case 'para': return `<p class="bk-para reveal ${s.dropcap ? 'dropcap' : ''}">${s.html}</p>`;
      case 'img': return `<figure class="bk-figure reveal">${img(s.src, 'bk-fig-img', s.cap)}<figcaption>${esc(s.cap)}</figcaption></figure>`;
      case 'video': return `<figure class="bk-video reveal"><div class="bk-video-frame"><iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/${s.id}" title="${esc(s.label || 'Video')}" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe></div><figcaption>${esc(s.label || 'Watch')}</figcaption></figure>`;
      case 'quote': return `<div class="scpull reveal">${esc(s.text)}<cite>— ${esc(s.who)}</cite></div>`;
      case 'fact': return `<div class="scfact reveal"><div class="scfl">${esc(s.label)}</div><p>${esc(s.text)}</p></div>`;
      case 'did': return `<div class="scdid reveal"><div class="dl">Did you know?</div><p>${esc(s.text)}</p></div>`;
      case 'decision': return `<div class="bk-break reveal"><div class="bk-break-t">🧭 ${esc(s.title)}</div><p>${esc(s.d)}</p><button class="btn btn-g btn-sm" onclick="go('sDecide');setTimeout(()=>Interactive.openDecision('${s.id}'),60)">Step in →</button></div>`;
      case 'source': return `<div class="bk-break reveal"><div class="bk-break-t">🔍 ${esc(s.title)}</div><p>${esc(s.d)}</p><button class="btn btn-g btn-sm" onclick="go('sDetective');setTimeout(()=>Interactive.openSource('${s.id}'),60)">Investigate →</button></div>`;
      case 'people': return `<div class="bk-people reveal">${s.ids.map(id => { const p = PEOPLE.find(x => x.id === id); return p ? `<div class="bk-person" onclick="openPerson('${id}')">${img(p.img, 'bk-person-img', p.name)}<div><h4>${esc(p.name)}</h4><p>${esc(p.role)}</p><span class="pside ${p.side}">${sideLabel(p.side)}</span></div></div>` : ''; }).join('')}</div>`;
      default: return '';
    }
  }

  function soon() {
    return `<section class="bk-soon">
      <div class="bk-soon-ic">📚</div>
      <h3>More chapters coming soon</h3>
      <p>This is the full, deep version of one chapter. The Spark of 1914, the Trenches, Versailles and the Dawn of 1945 are on the way.</p>
      <button class="btn btn-o btn-sm" onclick="go('sTimeline')">Meanwhile, explore the timeline →</button>
    </section>`;
  }
  function endCard() {
    return `<section class="bk-end">
      <div class="bk-end-badge">🌟</div>
      <h2 class="h2" style="color:#fff">You read the whole chapter</h2>
      <p>From a wounded democracy to a warning for the world. Now make it yours.</p>
      <div class="bk-end-actions">
        <button class="btn btn-g" onclick="go('sQuiz')">Test yourself →</button>
        <button class="btn btn-o" onclick="go('sPortfolio')">Build your walkthrough</button>
      </div>
    </section>`;
  }

  function observe() {
    if (!('IntersectionObserver' in window)) { document.querySelectorAll('#readerPane .reveal').forEach(e => e.classList.add('in')); return; }
    const rev = new IntersectionObserver((ents) => {
      ents.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); rev.unobserve(en.target); } });
    }, { threshold: .1, rootMargin: '0px 0px -7% 0px' });
    document.querySelectorAll('#readerPane .reveal').forEach(e => rev.observe(e));

    const endEl = document.querySelector('#readerPane .bk-end');
    if (endEl) {
      const fin = new IntersectionObserver((ents) => {
        ents.forEach(en => { if (en.isIntersecting) { fin.disconnect(); unlock('storyteller'); window.Guide && Guide.react('finish'); } });
      }, { threshold: .5 });
      fin.observe(endEl);
    }
  }

  function wireScroll() {
    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const sc = document.getElementById('sRead');
      if (!sc || !sc.classList.contains('active')) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(100, window.scrollY / max * 100) : 0;
      const rp = document.getElementById('rp'); if (rp) rp.style.width = p + '%';
    });
  }

  return { render };
})();
