# CraftyStock — React version

Single-page React app (React Router, one window) are routes rendered inside one persistent layout with a
sidebar — like the web version, but running as a real React app instead of
manual DOM string-building.

The DMC↔Gamma converter and the "Аналоги" section on each thread's detail
page now use your accurate `dmc_gamma_map.json` (595 entries, many-to-many,
with Anchor/Madeira cross-references) instead of the old hardcoded 30-entry
table.

## Run it

```bash
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Structure

- `src/catalogData.js` — DMC/Gamma/beads catalogs (from the original prototype)
- `src/mappingData.js` — loads `dmc_gamma_map.json` and builds fast lookup
  indexes (`byDmc`, `byGamma`) since the mapping is many-to-many
- `src/firebase.js` — Firebase app/auth/Firestore init, reads config from
  `.env.local`
- `src/AuthContext.jsx` — sign in/up/out, exposes the current user
- `src/StateContext.jsx` — stock counts, notes, storage locations — synced in
  real time to Firestore per signed-in account, with a `localStorage` mirror
  for instant loads and offline use. Theme stays a local, per-device setting.
- `src/vendor/firebase-bundle.js` — see note below
- `src/pages/*` — one component per route (`Login` included)
- `src/components/*` — Sidebar, Toast, Modal, Dot, ImportPrompt,
  LocationPickerModal, and a small reusable UI kit under `components/ui/`
- `src/styles.css` — app-wide styles and design tokens

Routes: `/login`, `/threads`, `/threads/:id`, `/beads`, `/beads/:id`,
`/converter`, `/color` (redirects to `/converter`), `/storage`, `/settings`.
All routes except `/login` require signing in.

### Why `src/vendor/firebase-bundle.js` instead of `npm install firebase`

This was built with esbuild (app + auth + firestore, browser target) instead
of added as a normal npm dependency, purely because of a quirk in the dev
sandbox this was built in — not a recommendation for how you should run
things going forward. If you'd rather have `firebase` as a real
`package.json` dependency (recommended long-term, e.g. so `npm audit` and
version bumps work normally), you can swap it in yourself:

```bash
npm install firebase
```

then in `src/firebase.js`, `src/AuthContext.jsx`, and `src/StateContext.jsx`,
change the imports from `./vendor/firebase-bundle.js` to the real package
paths (`firebase/app`, `firebase/auth`, `firebase/firestore`), and delete
`src/vendor/firebase-bundle.js`. Nothing else needs to change — same
function names, same behavior.

## Set up Firebase (login + syncing between devices)

This app needs its own free Firebase project — Firebase can't be created on
your behalf, so here's the five-minute setup:

1. **Create the project.** Go to <https://console.firebase.google.com/>,
   click "Add project", give it a name (e.g. "craftystock"), and finish the
   wizard (Google Analytics is optional, skip it if you don't need it).
2. **Enable sign-in.** In the project, go to *Build → Authentication →
   Get started*, open the *Sign-in method* tab, and enable **Email/Password**.
3. **Create the database.** Go to *Build → Firestore Database → Create
   database*. Pick any region close to you, and start in **production mode**
   (the rules below lock it down properly).
4. **Set security rules.** In *Firestore Database → Rules*, replace the
   contents with:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

   This means each signed-in account can only read or write its own data —
   publish the rules once you've pasted them in.
5. **Register a web app.** Go to *Project settings* (the gear icon) →
   scroll to "Your apps" → click the `</>` (web) icon → give it a nickname →
   *Register app*. Firebase will show a `firebaseConfig` object with keys
   like `apiKey`, `authDomain`, `projectId`, etc.
6. **Paste the config in.** Copy `.env.example` to `.env.local` in this
   folder, and fill in the six `VITE_FIREBASE_*` values from that
   `firebaseConfig` object. `.env.local` is gitignored, so these never get
   committed. Restart `npm run dev` after saving it.

Once that's done, opening the app will show a sign-in/sign-up screen. Create
an account (any email + password works — it doesn't have to be a real inbox
you can receive mail at, though "forgot password" only works if it is), and
the same account signed in on a phone and a computer will show the same
stock data, kept in sync automatically.

**A note if you're using this from Russia:** Firebase runs on Google Cloud,
and Google services are unevenly reachable there depending on your network/
ISP. If sign-in or syncing hangs, that's the most likely cause — a VPN
pointed outside Russia is the usual workaround people use for Google-hosted
services.

### Using it from your phone

Signing in with the same account is what actually keeps data in sync — but
your phone still needs a way to reach the app itself:

- **Quick/local:** run `npm run dev -- --host` on your computer, then on
  your phone (same Wi-Fi) open the "Network" URL it prints
  (something like `http://192.168.1.23:5173`).
- **From anywhere:** deploy it as a static site so it has a real URL. Firebase
  Hosting is a natural fit since you already have the project:
  ```bash
  npm install -g firebase-tools
  firebase login
  firebase init hosting   # public directory: dist, single-page app: yes
  npm run build
  firebase deploy
  ```
  Firebase will give you a `https://<project>.web.app` URL that works from
  any device, anywhere.
#
