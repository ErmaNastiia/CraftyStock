import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BEADS, SHL, FNL } from '../catalogData';
import { useAppState } from '../StateContext';
import Dot from '../components/Dot';

export default function Beads() {
  const { bStocks, bQ } = useAppState();
  const [brand, setBrand] = useState('all');
  const [shape, setShape] = useState('all');
  const [q, setQ] = useState('');
  const nav = useNavigate();

  const list = useMemo(() => {
    const query = q.toLowerCase();
    return BEADS.filter((b) => {
      const ms = !query || b.article.toLowerCase().includes(query) || b.name.toLowerCase().includes(query) || b.brand.toLowerCase().includes(query);
      const mb = brand === 'all' || b.brand === brand || (brand === 'stock' && (bStocks[b.id] || 0) > 0);
      return ms && mb && (shape === 'all' || b.shape === shape);
    });
  }, [q, brand, shape, bStocks]);

  const insCount = BEADS.filter((b) => (bStocks[b.id] || 0) > 0).length;

  return (
    <div className="scr" id="s-beads">
      <div className="ph"><span className="pt">Бисер</span><span className="pill pp">{insCount} видов</span></div>
      <div className="sw">
        <div className="sb2">
          <svg width="15" height="15" fill="none" stroke="var(--text3)" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          <input placeholder="Артикул, цвет, бренд..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>
      <div className="cr">
        {[['all', 'Все'], ['Miyuki', 'Miyuki'], ['Preciosa', 'Preciosa'], ['stock', 'В запасе']].map(([k, l]) => (
          <button key={k} className={`ch${brand === k ? ' on' : ''}`} onClick={() => setBrand(k)}>{l}</button>
        ))}
      </div>
      <div className="cr" style={{ marginTop: -4 }}>
        {[['all', 'Форма'], ['round', 'Круглый'], ['drop', 'Капля'], ['bugle', 'Стеклярус']].map(([k, l]) => (
          <button key={k} className={`ch${shape === k ? ' on' : ''}`} onClick={() => setShape(k)}>{l}</button>
        ))}
      </div>
      <div className="cnt">{list.length} позиций</div>
      <div className="sa">
        {list.map((b) => {
          const qty = bStocks[b.id] || 0;
          return (
            <div className="card" key={b.id}>
              <div className="cr2" onClick={() => nav(`/beads/${b.id}`)}>
                <Dot hex={b.hex} size={42} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="il">{b.brand} {b.article}</div>
                  <div className="is">{b.name}</div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                    {[SHL[b.shape] || b.shape, b.size, FNL[b.finish] || b.finish].map((x) => (
                      <span key={x} style={{ background: 'var(--surface2)', borderRadius: 4, padding: '2px 6px', fontSize: 10, color: 'var(--text2)' }}>{x}</span>
                    ))}
                  </div>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <div className="ctr">
                    <button className="cb" disabled={qty <= 0} onClick={() => bQ(b.id, -1)}>−</button>
                    <div style={{ textAlign: 'center' }}>
                      <div className="cv">{qty}</div>
                      <div style={{ fontSize: 9, color: 'var(--text3)' }}>г</div>
                    </div>
                    <button className="cb" onClick={() => bQ(b.id, 1)}>+</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
