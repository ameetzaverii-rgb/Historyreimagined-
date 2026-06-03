/* ============================================================================
   Reader — "The Living Textbook".
   The whole module presented as ONE coherent, scrolling book. Chapters flow
   into each other; Sage grounds to the chapter in view; interactions are
   woven in as inline "breaks". Uses globals: STORY, renderExtra, esc, img,
   State, gainXP, save, Guide, svgIcon.
   ========================================================================== */
const Reader = (() => {
  let built = false, io = null, ticking = false;
  // where to drop an inline interactive moment (after chapter index -> mode)
  const BREAKS = {
    2: { t: 'Step into the room', d: 'You’re the peacemaker at Versailles, 1919. What would you decide?', btn: 'Play “You Decide”', go: 'sDecide' },
    4: { t: 'Investigate the evidence', d: 'Real historians read sources. Decode a real photograph or poster.', btn: 'Open Source Detective', go: 'sDetective' },
    5: { t: 'Take a side', d: 'Was the world right to act as it did? Argue it with your class.', btn: 'Enter the Debate', go: 'sDebate' },
  };

  function render() {
    if (built) { wireScroll(); return; }
    const pane = document.getElementById('readerPane');
    pane.innerHTML = cover() + STORY.map((s, i) => chapter(s, i)).join('') + endCard();
    built = true;
    observe();
    wireScroll();
  }

  function cover() {
    return `<section class="bk-cover">
      <div class="bk-cover-ovl"></div>
      ${img(MODULE.hero, 'bk-cover-img', 'Cover')}
      <div class="bk-cover-c">
        <div class="bk-kicker">${esc(MODULE.anchor)}</div>
        <h1 class="bk-title">From Trenches<br>to <em>Tyranny</em></h1>
        <p class="bk-sub">${esc(MODULE.subtitle)}</p>
        <div class="bk-scroll">Scroll to begin ↓</div>
      </div>
    </section>`;
  }

  function chapter(s, i) {
    const brk = BREAKS[i];
    return `<article class="bk-ch" data-i="${i}" data-title="${esc(s.ti)}">
      <div class="bk-hero">
        ${img(s.img, 'bk-hero-img', s.ti)}
        <div class="bk-hero-grad"></div>
        <div class="bk-hero-meta">
          <div class="bk-chnum">${esc(s.ch)}</div>
          <h2 class="bk-chtitle">${esc(s.ti)}</h2>
          <p class="bk-chsub">${esc(s.su)}</p>
        </div>
      </div>
      <div class="bk-body">
        <p class="bk-para reveal ${s.lead ? 'dropcap' : ''}">${s.body}</p>
        ${mediaBlock(i)}
        <div class="bk-extra reveal">${renderExtra(s.extra)}</div>
        ${brk ? `<div class="bk-break reveal"><div class="bk-break-t">${svgIcon('flag', 'width="15" height="15"')} ${esc(brk.t)}</div><p>${esc(brk.d)}</p><button class="btn btn-g btn-sm" onclick="go('${brk.go}')">${esc(brk.btn)} →</button></div>` : ''}
      </div>
    </article>`;
  }

  // real images + contextual YouTube woven into the chapter
  function mediaBlock(i) {
    const m = (typeof CHAPTER_MEDIA !== 'undefined' && CHAPTER_MEDIA[i]) || null;
    if (!m) return '';
    let out = '';
    if (m.gallery) out += m.gallery.map(g => `<figure class="bk-figure reveal">${img(g.src, 'bk-fig-img', g.cap)}<figcaption>${esc(g.cap)}</figcaption></figure>`).join('');
    if (m.video) out += `<figure class="bk-video reveal"><div class="bk-video-frame"><iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/${m.video}" title="${esc(m.vlabel || 'Video')}" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe></div><figcaption>${esc(m.vlabel || 'Watch')}</figcaption></figure>`;
    return out;
  }

  function endCard() {
    return `<section class="bk-end">
      <div class="bk-end-badge">🌟</div>
      <h2 class="h2" style="color:#fff">You finished the book</h2>
      <p>You’ve travelled from a single shot in Sarajevo to a free India. Now make it yours.</p>
      <div class="bk-end-actions">
        <button class="btn btn-g" onclick="go('sQuiz')">Test yourself →</button>
        <button class="btn btn-o" onclick="go('sPortfolio')">Build your walkthrough</button>
      </div>
    </section>`;
  }

  /* reveal + chapter tracking */
  function observe() {
    if (!('IntersectionObserver' in window)) { document.querySelectorAll('.reveal').forEach(e => e.classList.add('in')); return; }
    const rev = new IntersectionObserver((ents) => {
      ents.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); rev.unobserve(en.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('#readerPane .reveal').forEach(e => rev.observe(e));

    io = new IntersectionObserver((ents) => {
      ents.forEach(en => { if (en.isIntersecting) enterChapter(+en.target.dataset.i, en.target); });
    }, { threshold: .4 });
    document.querySelectorAll('#readerPane .bk-ch').forEach(a => io.observe(a));
  }

  function enterChapter(i, el) {
    const s = STORY[i];
    window.readerContext = { title: s.ti, text: (s.su || '') + ' ' + (s.body || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() };
    if (!State.scenesRead.includes(i)) {
      State.scenesRead.push(i); save(); gainXP(15, '+15 XP · ' + s.ch);
      if (State.scenesRead.length >= STORY.length) { unlock('storyteller'); window.Guide && Guide.react('finish'); }
      else if (window.Guide && Math.random() < .5) Guide.react('scene');
    }
  }

  /* reading-progress bar driven by scroll position in the book */
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
