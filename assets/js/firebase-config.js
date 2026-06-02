/* ============================================================================
   Firebase configuration  —  enables REAL multi-user collaboration.

   HOW TO GO LIVE (free, ~5 minutes, no credit card):
   1. Go to https://console.firebase.google.com  → "Add project".
   2. In the project, click the </> (Web) icon to "Add an app".
   3. Firebase shows you a `firebaseConfig` object — copy its values below.
   4. In the left menu open  Build → Firestore Database → Create database
      (start in *test mode* for classroom use).
   5. Save this file. The app auto-detects the config and switches from
      local mode to live, cross-device sharing. No other change needed.

   Until you fill this in, the app runs in LOCAL mode: everything works on
   this device and a "share code" lets a friend import your folder manually.
   ========================================================================== */
window.FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

// Optional: a default classroom/room id so a whole class lands on one wall.
window.DEFAULT_ROOM = "class-8to10-history";
