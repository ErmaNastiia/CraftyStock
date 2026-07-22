import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DMC, GAMMA, BEADS } from '../catalogData';
import { pct } from '../helpers';
import Dot from '../components/Dot';

const QCOLS = ['#FFFFFF', '#F5EDD3', '#FAB8A8', '#F07878', '#C82030', '#8C1020', '#F07010', '#FFCC00', '#3A9848', '#1AA8B0', '#4868D0', '#182090', '#7A3C8A', '#C88060', '#888888', '#1A1A1A'];

export default function ColorMatch() {
  const [hex, setHex] = useState('#C82030');
  const [type, setType] = useState('all');
  const nav = useNavigate();

  const results = useMemo(() => {
    const all = [
      ...(type !== 'beads' ? [...DMC, ...GAMMA].map((t) => ({ id: t.id, brand: t.brand, article: t.article, name: t.name_ru, hex: t.hex, type: 'thread' })) : []),
      ...(type !== 'threads' ? BEADS.map((b) => ({ id: b.id, brand: b.brand, article: b.article, name: b.name, hex: b.hex, type: 'bead' })) : []),
    ];
    return all.map((x) => ({ ...x, p: pct(hex, x.hex) })).filter((x) => x.p > 57).sort((a, b) => b.p - a.p).slice(0, 18);
  }, [hex, type]);

  const pc = (p) => (p >= 90 ? 'var(--green)' : p >= 75 ? 'var(--amber)' : 'var(--text3)');

  function onHexInput(v) {
    const h = '#' + v;
    if (h.length === 7) setHex(h);
  }

  return (
    <div className="scr" id="s-color">
      <div className="ph" style={{ paddingBottom: 10 }}><span className="pt">По цвету</span></div>
      <div className="card" style={{ margin: '0 26px 10px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0, border: '1px solid var(--border)', background: hex }} />
          <span style={{ fontSize: 15, color: 'var(--text3)', fontFamily: 'monospace' }}>#</span>
          <input className="hex-inp" defaultValue={hex.replace('#', '')} maxLength={6} onInput={(e) => onHexInput(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {QCOLS.map((c) => (
            <div key={c} className={`qc${hex.toUpperCase() === c.toUpperCase() ? ' sel' : ''}`} style={{ background: c, ...(c === '#FFFFFF' ? { borderColor: 'var(--border2)' } : {}) }} onClick={() => setHex(c)} />
          ))}
        </div>
      </div>
      <div className="cr">
        {[['all', 'Все'], ['threads', 'Нитки'], ['beads', 'Бисер']].map(([k, l]) => (
          <button key={k} className={`ch${type === k ? ' on' : ''}`} onClick={() => setType(k)}>{l}</button>
        ))}
      </div>
      <div className="cnt">Найдено {results.length} похожих</div>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 24 }}>
        <div style={{ padding: '0 26px 24px' }}>
          {results.map((r, i) => (
            <div key={r.id} className="srcard" onClick={() => nav(r.type === 'thread' ? `/threads/${r.id}` : `/beads/${r.id}`)}>
              <span style={{ fontSize: 11, color: 'var(--text4)', width: 16, textAlign: 'center', flexShrink: 0 }}>{i + 1}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <Dot hex={hex} size={26} />
                <div style={{ width: 10, height: 1.5, background: 'var(--border2)' }} />
                <Dot hex={r.hex} size={26} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>{r.brand} {r.article}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</div>
                <span style={{ fontSize: 9, fontWeight: 500, borderRadius: 4, padding: '1px 6px', display: 'inline-block', marginTop: 2, background: r.type === 'thread' ? 'var(--green-bg)' : 'var(--purple-bg)', color: r.type === 'thread' ? 'var(--green-t)' : 'var(--purple-t)' }}>{r.type === 'thread' ? 'Нитка' : 'Бисер'}</span>
              </div>
              <div style={{ textAlign: 'right', minWidth: 42, flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: pc(r.p) }}>{r.p}%</div>
                <div style={{ width: 40, height: 3, background: 'var(--surface2)', borderRadius: 2, marginTop: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${r.p}%`, height: '100%', background: pc(r.p), borderRadius: 2 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
