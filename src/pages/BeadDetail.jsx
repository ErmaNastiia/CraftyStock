import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BEADS, SHL, FNL } from '../catalogData';
import { useAppState } from '../StateContext';
import Dot from '../components/Dot';
import Modal from '../components/Modal';

export default function BeadDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { bStocks, bQ, bLocMap, locs, setBLoc, clearBLoc } = useAppState();
  const [locModal, setLocModal] = useState(false);
  const b = BEADS.find((x) => x.id === id);
  if (!b) return null;
  const qty = bStocks[b.id] || 0;
  const loc = locs.find((l) => l.id === bLocMap[b.id]);

  return (
    <div className="scr" id="s-bd">
      <div className="dh">
        <button className="bk" onClick={() => nav('/beads')}>← Назад</button>
        <span className="dt">{b.brand} {b.article}</span>
        <div style={{ width: 60 }} />
      </div>
      <div className="sa" style={{ paddingTop: 0 }}>
        <div style={{ height: 140, background: b.hex, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <div className="photo-hint">📷 Добавить фото</div>
        </div>
        <div style={{ padding: '0 26px 36px' }}>
          <div className="slbl" style={{ marginTop: 16 }}>Бисер</div>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)' }}>{b.brand} {b.article}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 3 }}>{b.name}</div>
              </div>
              <Dot hex={b.hex} size={36} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {[['Форма', SHL[b.shape] || b.shape], ['Размер', b.size], ['Покрытие', FNL[b.finish] || b.finish], ['Материал', 'Стекло']].map(([l, v]) => (
                <div key={l} style={{ background: 'var(--surface2)', borderRadius: 8, padding: '8px 10px' }}>
                  <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '.4px', color: 'var(--text3)', marginBottom: 2 }}>{l}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="slbl">В запасе</div>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: qty > 0 ? 'var(--green)' : 'var(--border2)' }} />
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{qty > 0 ? qty + ' г' : 'Нет в запасе'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button className="bcb" disabled={qty <= 0} onClick={() => bQ(b.id, -1)}>−</button>
                <span className="bcv">{qty}</span>
                <button className="bcb" onClick={() => bQ(b.id, 1)}>+</button>
              </div>
            </div>
            <div className="fbs">
              {[-5, -1, -0.5, 0.5, 1, 5].map((d) => (
                <button key={d} className="fb" disabled={qty + d < 0} onClick={() => bQ(b.id, d)}>{d > 0 ? '+' + d : d}г</button>
              ))}
            </div>
          </div>

          <div className="slbl">Место хранения</div>
          <div className="card" onClick={() => setLocModal(true)} style={{ cursor: 'pointer' }}>
            {loc ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="locdot" style={{ background: loc.color }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{loc.name}</div>
                  {loc.desc && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{loc.desc}</div>}
                </div>
                <span style={{ fontSize: 12, color: 'var(--blue)' }}>Изменить</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: 'var(--text3)', fontSize: 13 }}>📦 Не указано — нажми, чтобы выбрать</div>
            )}
          </div>
        </div>
      </div>

      <Modal open={locModal} onClose={() => setLocModal(false)}>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>Место хранения</div>
        {!locs.length && <div style={{ textAlign: 'center', padding: 20, color: 'var(--text3)' }}>Добавь места на вкладке «Хранение»</div>}
        {locs.map((l) => (
          <div key={l.id} className={`mloc${bLocMap[b.id] === l.id ? ' sel' : ''}`} onClick={() => { setBLoc(b.id, l.id); setLocModal(false); }}>
            <div className="locdot" style={{ background: l.color }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{l.name}</div>
              {l.desc && <div style={{ fontSize: 11, color: 'var(--text3)' }}>{l.desc}</div>}
            </div>
            {bLocMap[b.id] === l.id && <span style={{ fontWeight: 600, color: 'var(--text)' }}>✓</span>}
          </div>
        ))}
        {bLocMap[b.id] && (
          <button onClick={() => { clearBLoc(b.id); setLocModal(false); }} style={{ width: '100%', marginTop: 8, padding: 9, border: 'none', borderRadius: 10, background: 'transparent', cursor: 'pointer', fontSize: 12, color: 'var(--red)', fontFamily: 'inherit' }}>Убрать место хранения</button>
        )}
      </Modal>
    </div>
  );
}