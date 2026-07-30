import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { doc, setDoc, onSnapshot, serverTimestamp } from './vendor/firebase-bundle.js';
import { db, firebaseReady } from './firebase';

const StateCtx = createContext(null);

const DEFAULT_LOCS = [
  { id: 'l1', name: 'Синяя коробка IKEA', desc: 'Верхняя полка, слева', color: '#4A90D9' },
  { id: 'l2', name: 'Красный органайзер', desc: 'На столе у окна', color: '#E5534B' },
  { id: 'l3', name: 'Зелёная папка', desc: 'Схемы и образцы', color: '#2FA85F' },
];

const FIELDS = ['tStocks', 'bStocks', 'tNotes', 'tLocMap', 'bLocMap', 'locs'];
const LEGACY_KEYS = { tStocks: 'cs_tStocks', bStocks: 'cs_bStocks', tNotes: 'cs_tNotes', tLocMap: 'cs_tLocMap', bLocMap: 'cs_bLocMap', locs: 'cs_locs' };

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota errors */
  }
}

// Reads data saved by the pre-Firebase, localStorage-only version of the
// app (unprefixed cs_* keys) so it can be offered as a one-time import once
// someone signs in for the first time on a device that already has data.
function readLegacyData() {
  const data = {};
  let hasAny = false;
  Object.entries(LEGACY_KEYS).forEach(([field, key]) => {
    const v = load(key, null);
    if (v && (Array.isArray(v) ? v.length : Object.keys(v).length)) {
      data[field] = v;
      hasAny = true;
    }
  });
  return hasAny ? data : null;
}

function snapshotOf(state) {
  return JSON.stringify(FIELDS.map((f) => state[f]));
}

export function StateProvider({ uid, children }) {
  const [tStocks, setTStocks] = useState(() => load(`cs_${uid}_tStocks`, {}));
  const [bStocks, setBStocks] = useState(() => load(`cs_${uid}_bStocks`, {}));
  const [tNotes, setTNotes] = useState(() => load(`cs_${uid}_tNotes`, {}));
  const [tLocMap, setTLocMap] = useState(() => load(`cs_${uid}_tLocMap`, {}));
  const [bLocMap, setBLocMap] = useState(() => load(`cs_${uid}_bLocMap`, {}));
  const [locs, setLocs] = useState(() => load(`cs_${uid}_locs`, DEFAULT_LOCS));
  const [theme, setThemeState] = useState(() => localStorage.getItem('cs_theme') || 'light');
  const [syncState, setSyncState] = useState('syncing'); // 'syncing' | 'synced' | 'offline'
  const [pendingImport, setPendingImport] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [toastShow, setToastShow] = useState(false);
  const toastTimer = useRef(null);
  const lastRemoteJson = useRef(null);
  const checkedForImport = useRef(false);

  useEffect(() => {
    document.body.toggleAttribute('data-dark', theme === 'dark');
  }, [theme]);
  useEffect(() => {
    save('cs_theme', theme);
  }, [theme]);

  function toast(msg) {
    setToastMsg(msg);
    setToastShow(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastShow(false), 2200);
  }

  // Real-time subscription to this user's document — this is what keeps a
  // computer and a phone signed into the same account in sync.
  useEffect(() => {
    if (!firebaseReady || !uid) {
      setSyncState('offline');
      return;
    }
    setSyncState('syncing');
    const ref = doc(db, 'users', uid);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          const next = { tStocks: data.tStocks || {}, bStocks: data.bStocks || {}, tNotes: data.tNotes || {}, tLocMap: data.tLocMap || {}, bLocMap: data.bLocMap || {}, locs: data.locs && data.locs.length ? data.locs : DEFAULT_LOCS };
          const json = snapshotOf(next);
          if (json !== lastRemoteJson.current) {
            lastRemoteJson.current = json;
            setTStocks(next.tStocks);
            setBStocks(next.bStocks);
            setTNotes(next.tNotes);
            setTLocMap(next.tLocMap);
            setBLocMap(next.bLocMap);
            setLocs(next.locs);
          }
        } else if (!checkedForImport.current) {
          const legacy = readLegacyData();
          if (legacy) setPendingImport(legacy);
        }
        checkedForImport.current = true;
        setSyncState('synced');
      },
      () => setSyncState('offline')
    );
    return unsub;
  }, [uid]);

  // Debounced push to Firestore + a local mirror for instant reloads.
  useEffect(() => {
    save(`cs_${uid}_tStocks`, tStocks);
    save(`cs_${uid}_bStocks`, bStocks);
    save(`cs_${uid}_tNotes`, tNotes);
    save(`cs_${uid}_tLocMap`, tLocMap);
    save(`cs_${uid}_bLocMap`, bLocMap);
    save(`cs_${uid}_locs`, locs);
    if (!firebaseReady || !uid) return;
    const json = snapshotOf({ tStocks, bStocks, tNotes, tLocMap, bLocMap, locs });
    const t = setTimeout(() => {
      lastRemoteJson.current = json;
      setDoc(
        doc(db, 'users', uid),
        { tStocks, bStocks, tNotes, tLocMap, bLocMap, locs, updatedAt: serverTimestamp() },
        { merge: true }
      ).catch(() => setSyncState('offline'));
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tStocks, bStocks, tNotes, tLocMap, bLocMap, locs, uid]);

  function setTheme(t) {
    setThemeState(t);
  }

  function tQ(id, d) {
    setTStocks((s) => ({ ...s, [id]: Math.max(0, parseFloat(((s[id] || 0) + d).toFixed(1))) }));
  }
  function bQ(id, d) {
    setBStocks((s) => ({ ...s, [id]: Math.max(0, parseFloat(((s[id] || 0) + d).toFixed(1))) }));
  }
  function setNote(id, text) {
    setTNotes((s) => ({ ...s, [id]: text }));
    toast('Заметка сохранена ✓');
  }

  function setLoc(tid, lid) {
    setTLocMap((s) => ({ ...s, [tid]: lid }));
    toast('Место хранения сохранено ✓');
  }
  function clearLoc(tid) {
    setTLocMap((s) => {
      const n = { ...s };
      delete n[tid];
      return n;
    });
  }

  function setBLoc(bid, lid) {
    setBLocMap((s) => ({ ...s, [bid]: lid }));
    toast('Место хранения сохранено ✓');
  }
  function clearBLoc(bid) {
    setBLocMap((s) => {
      const n = { ...s };
      delete n[bid];
      return n;
    });
  }

  function addLoc(loc) {
    setLocs((l) => [...l, loc]);
    toast('Место хранения добавлено ✓');
  }
  function delLoc(id) {
    setLocs((l) => l.filter((x) => x.id !== id));
    setTLocMap((s) => {
      const n = { ...s };
      Object.keys(n).forEach((k) => {
        if (n[k] === id) delete n[k];
      });
      return n;
    });
    setBLocMap((s) => {
      const n = { ...s };
      Object.keys(n).forEach((k) => {
        if (n[k] === id) delete n[k];
      });
      return n;
    });
  }

  function importLegacyData() {
    if (!pendingImport) return;
    if (pendingImport.tStocks) setTStocks(pendingImport.tStocks);
    if (pendingImport.bStocks) setBStocks(pendingImport.bStocks);
    if (pendingImport.tNotes) setTNotes(pendingImport.tNotes);
    if (pendingImport.tLocMap) setTLocMap(pendingImport.tLocMap);
    if (pendingImport.bLocMap) setBLocMap(pendingImport.bLocMap);
    if (pendingImport.locs && pendingImport.locs.length) setLocs(pendingImport.locs);
    setPendingImport(null);
    toast('Данные импортированы ✓');
  }
  function dismissImport() {
    setPendingImport(null);
  }

  const value = {
    tStocks, bStocks, tNotes, tLocMap, bLocMap, locs, theme,
    toastMsg, toastShow, toast, syncState,
    pendingImport, importLegacyData, dismissImport,
    setTheme, tQ, bQ, setNote, setLoc, clearLoc, setBLoc, clearBLoc, addLoc, delLoc,
  };

  return <StateCtx.Provider value={value}>{children}</StateCtx.Provider>;
}

export function useAppState() {
  return useContext(StateCtx);
}
