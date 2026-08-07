# CraftyStock

A React app for tracking embroidery thread and bead inventory: browse DMC /
Gamma / Anchor / Madeira thread catalogs and Miyuki / Preciosa beads, convert
colors between brands, track stock and storage locations, attach photos, and
keep it all in sync across devices.

The UI is in Russian; this README is in English for a general dev audience.

Demo: https://threadsbeads.netlify.app/

## Features

- Thread catalog (DMC, Gamma, Anchor, Madeira) and bead catalog (Miyuki,
  Preciosa) with search and filters
- DMC ↔ Gamma color converter — single lookup, bulk list conversion (paste
  many article numbers at once), or find-by-color matching
- Stock quantity tracking per item with quick +/- adjustments
- Storage location tracking (assign items to boxes, organizers, shelves)
- Notes per item
- Photo uploads per item, compressed client-side before upload
- CSV / JSON export
- Light and dark theme
- Account-based sync: sign in on a computer and a phone and see the same
  data on both, updated in real time, with offline support

## Tech stack

- [React 18](https://react.dev/) + [React Router](https://reactrouter.com/)
- [Vite](https://vitejs.dev/)
- [Firebase](https://firebase.google.com/) (Authentication, Firestore, Storage)

## Getting started

```bash
git clone https://github.com/ErmaNastiia/CraftyStock.git
cd CraftyStock
npm install
cp .env.example .env.local   # fill in your Firebase config — see below
npm run dev
```

Open the printed local URL (usually http://localhost:5173).

## Firebase setup

The app needs its own Firebase project to handle sign-in and sync. The free
Spark plan is enough for personal or small-scale use.

1. Create a project at the [Firebase console](https://console.firebase.google.com/).
2. **Authentication** → *Sign-in method* → enable **Email/Password**.
3. **Firestore Database** → *Create database* (production mode) → *Rules*,
   set:

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

4. **Storage** → *Get started* (production mode) → *Rules*, set:

   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /users/{userId}/photos/{allPaths=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId
                             && request.resource.size < 8 * 1024 * 1024;
       }
     }
   }
   ```

5. *Project settings* → *Your apps* → add a **web app** → copy the resulting
   config into `.env.local` (see `.env.example` for the expected variable
   names).

Both rule sets scope every read/write to the signed-in user's own data.

## Available scripts

| Command           | Description                          |
| ------------------ | ------------------------------------- |
| `npm run dev`       | Start the dev server                  |
| `npm run build`     | Production build to `dist/`           |
| `npm run preview`   | Preview the production build locally  |

## Deployment

This is a static build, deployable to any static/SPA host (Netlify, Firebase
Hosting, Vercel, etc.):

- Build command: `npm run build`
- Publish directory: `dist`
- Needs an SPA fallback rule (`/* → /index.html`) so client-side routes like
  `/threads/:id` don't 404 on refresh — `netlify.toml` and
  `public/_redirects` already handle this for Netlify.
- Set the `VITE_FIREBASE_*` environment variables on the host itself (Vite
  bakes them into the build, so adding them after a build won't take effect
  until the next one).
- Add your deployed domain to Firebase → Authentication → Settings →
  *Authorized domains*, or sign-in requests will be rejected.

Firebase itself isn't currently a `package.json` dependency — the SDK is
vendored as a pre-bundled file at `src/vendor/firebase-bundle.js` (built
with esbuild, covering the `app`, `auth`, `firestore`, and `storage`
modules). To switch to a normal npm dependency instead, run
`npm install firebase`, then in `src/firebase.js`, `src/AuthContext.jsx`,
and `src/StateContext.jsx` change the imports from
`./vendor/firebase-bundle.js` to the corresponding `firebase/*` package
paths and delete the vendor file — the exported names are identical, so
nothing else needs to change.

## Project structure

```
src/
  catalogData.js        DMC/Gamma/Anchor/Madeira/bead catalogs
  mappingData.js         DMC ↔ Gamma color mapping (many-to-many lookup)
  tabs.js                 sidebar nav config
  firebase.js              Firebase app/auth/Firestore/Storage init
  AuthContext.jsx          sign in/up/out, current user
  StateContext.jsx         stock, notes, locations, photos — synced state
  helpers.js                shared utilities (formatting, image compression, CSV/JSON export)
  vendor/firebase-bundle.js  pre-bundled Firebase SDK (see Deployment)
  pages/                     one component per route (incl. Login)
  components/                Sidebar, Toast, Modal, PhotoUploader, etc.
  components/ui/              small reusable UI kit (Card, Button, Stepper, ...)
  styles.css                   app-wide styles and design tokens
```

Routes: `/login`, `/threads`, `/threads/:id`, `/beads`, `/beads/:id`,
`/converter`, `/storage`, `/settings`. All routes except `/login` require
signing in.

## License

No license specified yet.
