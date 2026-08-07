// Firebase wiring for CraftyStock. The SDK itself is loaded from
// src/vendor/firebase-bundle.js (a pre-bundled app+auth+firestore+storage
// build) — see that file's header for why. The project config below comes
// from your own Firebase project; see README.md for the step-by-step setup.
import {
  initializeApp,
  getAuth,
  getFirestore,
  enableIndexedDbPersistence,
  getStorage,
} from "./vendor/firebase-bundle.js";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const firebaseReady = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
);

let app, auth, db, storage;

if (firebaseReady) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  // Lets the app keep working offline and syncs automatically once back
  // online — this is also what makes "computer + phone at the same time"
  // work: each device caches locally and reconciles through Firestore.
  enableIndexedDbPersistence(db).catch(() => {
    // Fails if multiple tabs are open at once, or the browser doesn't
    // support it — the app still works, just without offline cache.
  });
} else {
  // eslint-disable-next-line no-console
  console.warn("CraftyStock: Firebase config is missing.");
}

export { auth, db, storage };
