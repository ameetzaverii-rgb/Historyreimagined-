# HistoryReimagined — _From Trenches to Tyranny_

A gamified, interactive way to learn modern world history — the arc from **World War I → the rise of Nazism → World War II → 1945 & a free India** — built around the **NCERT Social Science curriculum for Grades 8, 9 and 10**.

> The “one module” is the WW1→WW2 story (anchored on NCERT Class 9, Ch. 3 *Nazism and the Rise of Hitler*), but it is threaded across all three grades through the **Curriculum Atlas**.

---

## ✨ What's inside

| Feature | What it does | Learning science |
|---|---|---|
| **Story Mode** | 7 cinematic scenes with archive imagery, pull-quotes, glossary tooltips and “Did you know?” interstitials | Gagné #1 Gain attention, #4 Present content |
| **Curriculum Atlas** | Every NCERT History chapter (Gr 8–10) indexed and linked to the official PDFs; module anchors highlighted | Gagné #3 Recall prior knowledge |
| **Interactive Timeline** | 1914→1947, filterable by theme (wars / politics / India / turning points) | Sequencing & cause–effect |
| **Personalities** | Card gallery + detail view for the people who shaped the age | Human-centred history |
| **Wars & Map** | WW1 vs WW2 comparison + a clickable schematic battle map | Apply / Analyse |
| **Media Library** | Curated **open educational resources** + embedded YouTube (NCERT, Khan Academy, CrashCourse, OER Commons, museums) | Multi-modal learning |
| **Bloom's Activity Ladder** | Tasks from *Remember* → *Create*, each drops a starter card into your folder | Bloom's Taxonomy |
| **Quiz** | Gamified, timed, Bloom-tagged, instant explained feedback | Gagné #7 Feedback |
| **Progress / Ranks / Badges** | XP, five ranks, achievement badges | Gagné #8 Assess |
| **Walkthrough Portfolio** | Build an interactive folder of notes/reflections/quotes/images, **present** it full-screen, **export** it | Gagné #9 Retention · Bloom L6 Create |
| **Collaboration** | A real-time class **wall** + **folder share codes** between friends | Social / peer learning |

Design language: a warm “living textbook” aesthetic — parchment, serif display type, ink + ember accents. **Zero build step, no framework** — just open it.

---

## 🚀 Run it locally (10 seconds)

Just open `index.html` in a browser. That's it.

It runs in **Local mode**: all your progress and your folder save on your device, and you can still share a folder with a friend using a **share code**. To turn on real, cross-device, multi-user collaboration, connect the Neon database below.

---

## 🗄️ Set up the database (Neon) — explained like you're five

We're going to give the app a **shared memory** so classmates can see each other's posts. That shared memory is a free **Neon** database. The webpage can't talk to a database directly (that would be like leaving your house keys taped to the front door), so we also deploy a tiny **API** — three little helper files in the `api/` folder — that talk to Neon safely.

### Part A — Make the database (Neon)

1. Go to **https://neon.tech** and click **Sign up** (free, no card). Sign in with Google/GitHub.
2. Click **Create project**. Give it any name (e.g. `history`). Click **Create**. 🎉 You now have a database.
3. Neon shows you a **connection string** — a long line that starts with `postgresql://...`. Click **Copy**. Keep it somewhere safe for a minute. *(This is the secret key to your database — don't paste it into the webpage code.)*
4. On the left, click **SQL Editor**.
5. Open the file `db/schema.sql` from this project, copy everything in it, paste it into the SQL Editor, and click **Run**. ✅ This creates the two tables the app needs (`wall_posts` and `folders`).

### Part B — Put the app online with its API (Vercel)

We'll use **Vercel** because it hosts your webpage **and** runs the `api/` helper files together, for free.

1. Push this project to **GitHub** (if it isn't already).
2. Go to **https://vercel.com** → **Sign up** with GitHub (free).
3. Click **Add New… → Project**, pick this repository, click **Import**.
4. Before clicking Deploy, open **Environment Variables** and add ONE:
   - **Name:** `DATABASE_URL`
   - **Value:** paste the Neon connection string from Part A, step 3.
5. Click **Deploy**. Wait ~1 minute. Vercel gives you a link like `https://history-xyz.vercel.app`. 🎉

> Vercel automatically installs `@neondatabase/serverless` (listed in `package.json`) and turns each file in `api/` into a live web address (`/api/wall`, `/api/folder`).

### Part C — Flip the switch to "live"

1. Open `assets/js/api-config.js`.
2. Change the first line from:
   ```js
   window.API_BASE = null;
   ```
   to:
   ```js
   window.API_BASE = ""; // empty string = "same website as me"
   ```
3. Save, commit, and push. Vercel redeploys automatically.

Done! Open your Vercel link on two different phones/computers, go to **My Walkthrough → Collaborate**, and post on the wall — it shows up on both within a few seconds. The banner there will read **🟢 Live · multi-user (Neon)**.

> **Local dev tip:** if you run the API on a *different* address than the page, set `window.API_BASE = "https://your-app.vercel.app";` instead of `""`.

---

## 🧰 Using Netlify or your own Node server instead?

The API in `api/*.js` uses the standard `(req, res)` handler shape and the `@neondatabase/serverless` driver, so it ports easily:

- **Netlify:** move the handlers into `netlify/functions/` (Netlify passes `(event, context)`; wrap accordingly) and set `DATABASE_URL` in Netlify env. Set `window.API_BASE = "/.netlify/functions"` and adjust the paths in `assets/js/collab.js`.
- **Express/Render/Railway:** create a small `server.js` that imports `sql` from `api/_neon.js` and exposes `GET/POST /api/wall` and `/api/folder`. Set `window.API_BASE` to that server's URL.

Tell me which host your trip-planning project used and I'll match it exactly.

---

## 📁 Project structure

```
index.html                 # app shell + all screens
assets/
  css/styles.css           # the design system
  js/
    api-config.js          # API_BASE + room id  (the "flip the switch" file)
    collab.js              # collaboration layer (Neon API  or  local fallback)
    data.js                # ALL content: curriculum, timeline, people, wars, story, quiz, media
    app.js                 # core SPA: routing, rendering, XP/ranks, quiz, glossary
    portfolio.js           # walkthrough folder builder + present mode + collaboration UI
api/
  _neon.js                 # shared Neon client + CORS (helper, not a route)
  wall.js                  # GET/POST the class wall
  folder.js                # GET/POST shared folders by code
db/schema.sql              # run once in Neon to create the tables
package.json               # declares the Neon driver dependency
```

---

## 📚 Sources & attribution

- **Curriculum:** National Council of Educational Research and Training (NCERT) — official textbook PDFs on [ncert.nic.in](https://ncert.nic.in).
- **Open educational resources:** Khan Academy, CrashCourse (World/European History), OER Commons, Anne Frank House.
- **Images:** Wikimedia Commons (public-domain / freely-licensed historical photographs and maps). Broken image URLs degrade gracefully to captioned placeholders.

All historical content is written for ages ~13–15 and aligned to the NCERT framing.
