import { createContext, useContext, useEffect, useRef, useState } from 'react';

const StateCtx = createContext(null);

const DEFAULT_LOCS = [
  { id: 'l1', name: 'Синяя коробка IKEA', desc: 'Верхняя полка, слева', color: '#4A90D9' },
  { id: 'l2', name: 'Красный органайзер', desc: 'На столе у окна', color: '#E5534B' },
  { id: 'l3', name: 'Зелёная папка', desc: 'Схемы и образцы', color: '#2FA85F' },
];

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

export function StateProvider({ children }) {
  const [tStocks, setTStocks] = useState(() => load('cs_tStocks', {}));
  const [bStocks, setBStocks] = useState(() => load('cs_bStocks', {}));
  const [tNotes, setTNotes] = useState(() => load('cs_tNotes', {}));
  const [tLocMap, setTLocMap] = useState(() => load('cs_tLocMap', {}));
  const [bLocMap, setBLocMap] = useState(() => load('cs_bLocMap', {}));
  const [locs, setLocs] = useState(() => load('cs_locs', DEFAULT_LOCS));
  const [theme, setThemeState] = useState(() => localStorage.getItem('cs_theme') || 'light');
  const [toastMsg, setToastMsg] = useState('');
  const [toastShow, setToastShow] = useState(false);
  const toastTimer = useRef(null);

  useEffect(() => {
    document.body.toggleAttribute('data-dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const save = () => {
      try {
        localStorage.setItem('cs_tStocks', JSON.stringify(tStocks));
        localStorage.setItem('cs_bStocks', JSON.stringify(bStocks));
        localStorage.setItem('cs_tNotes', JSON.stringify(tNotes));
        localStorage.setItem('cs_tLocMap', JSON.stringify(tLocMap));
        localStorage.setItem('cs_bLocMap', JSON.stringify(bLocMap));
        localStorage.setItem('cs_locs', JSON.stringify(locs));
        localStorage.setItem('cs_theme', theme);
      } catch {}
    };
    const id = setInterval(save, 3000);
    window.addEventListener('beforeunload', save);
    return () => {
      clearInterval(id);
      window.removeEventListener('beforeunload', save);
      save();
    };
  }, [tStocks, bStocks, tNotes, tLocMap, bLocMap, locs, theme]);

  function toast(msg) {
    setToastMsg(msg);
    setToastShow(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastShow(false), 2200);
  }

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

  // Thread storage location
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

  // Bead storage location (mirrors thread location logic above)
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

  const value = {
    tStocks, bStocks, tNotes, tLocMap, bLocMap, locs, theme,
    toastMsg, toastShow, toast,
    setTheme, tQ, bQ, setNote, setLoc, clearLoc, setBLoc, clearBLoc, addLoc, delLoc,
  };

  return <StateCtx.Provider value={value}>{children}</StateCtx.Provider>;
}

export function useAppState() {
  return useContext(StateCtx);
}
