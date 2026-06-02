/* ============================================================================
   Collab — the collaboration data layer.

   ONE simple API for the rest of the app, with two interchangeable back-ends:

     • NEON   — talks to the Neon Postgres database through the /api functions.
                Real, cross-device, multi-user. The class wall stays fresh by
                polling every few seconds. Activates when API_BASE is set.
     • LOCAL  — localStorage + the browser 'storage' event. Works instantly with
                no setup; syncs across tabs on this device and supports manual
                "share code" import/export between friends.

   Public API:
     Collab.ready            -> Promise<'neon'|'local'>
     Collab.mode             -> 'neon' | 'local'
     Collab.onWall(room, cb) -> subscribe to wall posts (array, newest first);
                                returns an unsubscribe function
     Collab.postWall(room, post)
     Collab.shareFolder(code, payload)
     Collab.loadFolder(code) -> Promise<payload|null>
   ========================================================================== */
const Collab = (() => {
  // API_BASE === null/undefined  -> local mode.
  // API_BASE === "" or a URL     -> neon mode ("" means "same website").
  const base = (typeof window.API_BASE === 'string') ? window.API_BASE : null;
  let mode = (base === null) ? 'local' : 'neon';
  const POLL_MS = 4000;

  const api = {
    ready: Promise.resolve(mode),
    onWall, postWall, shareFolder, loadFolder,
    get mode() { return mode; },
  };

  // ---- WALL -------------------------------------------------------------
  function onWall(room, cb) {
    if (mode === 'neon') {
      let stopped = false;
      const poll = async () => {
        try {
          const r = await fetch(`${base}/api/wall?room=${encodeURIComponent(room)}`);
          if (r.ok) cb(await r.json());
        } catch (e) { /* offline blip — keep showing last data */ }
      };
      poll();
      const iv = setInterval(() => { if (!stopped) poll(); }, POLL_MS);
      return () => { stopped = true; clearInterval(iv); };
    }
    // local
    const key = lkey(room);
    const emit = () => cb(readLocal(key));
    emit();
    const handler = e => { if (e.key === key) emit(); };
    window.addEventListener('storage', handler);
    window.addEventListener('hr-wall-' + room, emit);
    return () => { window.removeEventListener('storage', handler); window.removeEventListener('hr-wall-' + room, emit); };
  }

  async function postWall(room, post) {
    const doc = Object.assign({ room }, post);
    if (mode === 'neon') {
      await fetch(`${base}/api/wall`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(doc) });
      return;
    }
    const key = lkey(room);
    const arr = readLocal(key);
    arr.unshift(Object.assign({ ts: Date.now() }, post));
    localStorage.setItem(key, JSON.stringify(arr.slice(0, 60)));
    window.dispatchEvent(new Event('hr-wall-' + room));
  }

  // ---- FOLDER SHARING ---------------------------------------------------
  async function shareFolder(code, payload) {
    if (mode === 'neon') {
      const r = await fetch(`${base}/api/folder`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.assign({ code }, payload)) });
      return r.ok;
    }
    localStorage.setItem('hr_folder_' + code, JSON.stringify(Object.assign({ ts: Date.now() }, payload)));
    return true;
  }

  async function loadFolder(code) {
    if (mode === 'neon') {
      try {
        const r = await fetch(`${base}/api/folder?code=${encodeURIComponent(code)}`);
        if (!r.ok) return null;
        return await r.json();
      } catch { return null; }
    }
    const raw = localStorage.getItem('hr_folder_' + code);
    return raw ? JSON.parse(raw) : null;
  }

  // ---- local helpers ----------------------------------------------------
  function lkey(room) { return 'hr_wall_' + room; }
  function readLocal(key) { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } }

  return api;
})();
