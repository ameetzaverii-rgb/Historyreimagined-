/* ============================================================================
   API configuration — connects the web page to your Neon database via the API.

   • While developing locally (opening index.html as a file), leave API_BASE as
     null. The app runs in LOCAL mode (saves on this device; friends can still
     swap folders with a share code).

   • After you deploy to Vercel (see README.md), the page and the /api functions
     live on the SAME website, so set:
            window.API_BASE = "";
     That one change turns on REAL, cross-device, multi-user collaboration.

   • If your API lives on a DIFFERENT address than the page, put its full URL,
     e.g.  window.API_BASE = "https://your-app.vercel.app";
   ========================================================================== */
// TEST PHASE: set to "" so the page uses the API on the same website (server.js / Vercel).
// Note: opening index.html directly as a file:// has no API, so collaboration needs
// the dev server (node server.js) or a deploy. Set back to null for pure offline use.
window.API_BASE = "";

// A shared room id so a whole class lands on the same collaboration wall.
window.DEFAULT_ROOM = "class-8to10-history";
