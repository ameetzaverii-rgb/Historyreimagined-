/* ============================================================================
   Collab — the collaboration data layer.

   Presents ONE simple API to the rest of the app, with two interchangeable
   back-ends:

     • LIVE   — Firebase Firestore. Real-time, cross-device, multi-user.
                Activates automatically when firebase-config.js is filled in.
     • LOCAL  — localStorage + the browser 'storage' event. Works instantly
                with no setup; syncs across tabs on the same device and
                supports manual "share code" import/export between friends.

   Public API:
     Collab.ready            -> Promise<'live'|'local'>
     Collab.mode             -> 'live' | 'local'
     Collab.onWall(room, cb) -> subscribe to wall posts (array, newest first)
     Collab.postWall(room, post)
     Collab.shareFolder(code, payload)   -> publish a folder under a room code
     Collab.loadFolder(code)             -> Promise<payload|null>
   ========================================================================== */
const Collab = (() => {
  const cfg = window.FIREBASE_CONFIG || {};
  const hasFirebase = !!(cfg.apiKey && cfg.projectId);
  let mode = 'local';
  let db = null;
  let fs = null; // firestore module namespace

  const api = { mode, ready: null, onWall, postWall, shareFolder, loadFolder, get mode() { return mode; } };

  // ---- init -------------------------------------------------------------
  api.ready = (async () => {
    if (!hasFirebase) { mode = 'local'; return mode; }
    try {
      const appMod = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
      fs = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
      const app = appMod.initializeApp(cfg);
      db = fs.getFirestore(app);
      mode = 'live';
    } catch (e) {
      console.warn('[Collab] Firebase unavailable, using local mode:', e);
      mode = 'local';
    }
    return mode;
  })();

  // ---- WALL -------------------------------------------------------------
  function onWall(room, cb) {
    if (mode === 'live') {
      const col = fs.collection(db, 'rooms', room, 'wall');
      const q = fs.query(col, fs.orderBy('ts', 'desc'), fs.limit(60));
      return fs.onSnapshot(q, snap => cb(snap.docs.map(d => d.data())));
    }
    // local: read + subscribe to storage changes
    const key = lkey(room);
    const emit = () => cb(readLocal(key));
    emit();
    const handler = e => { if (e.key === key) emit(); };
    window.addEventListener('storage', handler);
    window.addEventListener('hr-wall-' + room, emit);
    return () => { window.removeEventListener('storage', handler); window.removeEventListener('hr-wall-' + room, emit); };
  }

  async function postWall(room, post) {
    const doc = Object.assign({ ts: Date.now() }, post);
    if (mode === 'live') {
      await fs.addDoc(fs.collection(db, 'rooms', room, 'wall'), doc);
      return;
    }
    const key = lkey(room);
    const arr = readLocal(key);
    arr.unshift(doc);
    localStorage.setItem(key, JSON.stringify(arr.slice(0, 60)));
    window.dispatchEvent(new Event('hr-wall-' + room));
  }

  // ---- FOLDER SHARING ---------------------------------------------------
  async function shareFolder(code, payload) {
    const data = Object.assign({ ts: Date.now() }, payload);
    if (mode === 'live') {
      await fs.setDoc(fs.doc(db, 'folders', code), data);
      return true;
    }
    localStorage.setItem('hr_folder_' + code, JSON.stringify(data));
    return true;
  }

  async function loadFolder(code) {
    if (mode === 'live') {
      const snap = await fs.getDoc(fs.doc(db, 'folders', code));
      return snap.exists() ? snap.data() : null;
    }
    const raw = localStorage.getItem('hr_folder_' + code);
    return raw ? JSON.parse(raw) : null;
  }

  // ---- local helpers ----------------------------------------------------
  function lkey(room) { return 'hr_wall_' + room; }
  function readLocal(key) { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } }

  return api;
})();
