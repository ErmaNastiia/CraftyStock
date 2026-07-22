import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DMC, GAMMA, QC, QL } from '../catalogData';
import { byDmc, byGamma } from '../mappingData';
import { useAppState } from '../StateContext';
import { fmtQ } from '../helpers';
import Dot from '../components/Dot';
import Modal from '../components/Modal';

const ALL = [...DMC, ...GAMMA];

export default function ThreadDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { tStocks, tQ, tLocMap, locs, tNotes, setNote, setLoc, clearLoc } = useAppState();
  const [locModal, setLocModal] = useState(false);
  const [noteModal, setNoteModal] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');

  const t = ALL.find((x) => x.id === id);
  if (!t) return null;

  const qty = tStocks[t.id] || 0;
  const matches = t.brand === 'DMC' ? (byDmc[t.article] || []) : (byGamma[t.article] || []);
  const loc = locs.find((l) => l.id === tLocMap[t.id]);
  const note = tNotes[t.id] || '';

  return (
    <div className="scr" id="s-td">
      <div className="dh">
        <button className="bk" onClick={() => nav('/threads')}>← Назад</button>
        <span className="dt">{t.brand} {t.article}</span>
        <div style={{ width: 60 }} />
      </div>
      <div className="sa" style={{ paddingTop: 0 }}>
        <div style={{ height: 150, background: t.hex, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <div className="photo-hint">
            <svg width="18" height="18" fill="none" stroke="rgba(255,255,255,.9)" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
            Добавить фото
          </div>
        </div>
        <div style={{ padding: '0 26px 36px' }}>
          <div className="slbl" style={{ marginTop: 16 }}>Нитка</div>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-.3px', color: 'var(--text)' }}>{t.brand} {t.article}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 3 }}>{t.name_ru}</div>
                {t.name_en && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>{t.name_en}</div>}
              </div>
              <Dot hex={t.hex} size={38} />
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span className="mc">{t.hex.toUpperCase()}</span>
              <span className="mc">{t.mat}</span>
              <span className="mc">8г · 8м</span>
            </div>
          </div>

          <div className="slbl">В запасе</div>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: qty > 0 ? 'var(--green)' : 'var(--border2)' }} />
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{qty > 0 ? `${fmtQ(qty)} ${qty === 1 ? 'моток' : qty < 2 ? 'мотка' : 'мотков'}` : 'Нет в запасе'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button className="bcb" disabled={qty <= 0} onClick={() => tQ(t.id, -0.5)}>−</button>
                <span className="bcv">{fmtQ(qty)}</span>
                <button className="bcb" onClick={() => tQ(t.id, 0.5)}>+</button>
              </div>
            </div>
            <div className="fbs">
              {[-2, -1, -0.5, 0.5, 1, 2].map((d) => (
                <button key={d} className="fb" disabled={qty + d < 0} onClick={() => tQ(t.id, d)}>{d > 0 ? '+' + d : d}</button>
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

          {matches.length > 0 && (
            <>
              <div className="slbl">{t.brand === 'DMC' ? 'Аналоги Gamma' : 'Аналоги DMC'}</div>
              {matches.map((m, i) => {
                const otherArticle = t.brand === 'DMC' ? m.gamma_article : m.dmc_article;
                const otherBrand = t.brand === 'DMC' ? 'Gamma' : 'DMC';
                const qcol = QC[m.match_quality] || 'var(--text3)';
                const qlabel = QL[m.match_quality] || m.match_quality;
                return (
                  <div className="card" key={i} style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Dot hex={t.hex} size={34} />
                        <div style={{ width: 18, height: 1.5, background: 'var(--border2)' }} />
                        <Dot hex={m.color_hex} size={34} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{otherBrand} {otherArticle}</div>
                        {m.color_name && <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{m.color_name}</div>}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5 }}>
                          <div className="qdot" style={{ background: qcol }} />
                          <span style={{ fontSize: 11, fontWeight: 500, color: qcol }}>{qlabel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          <div className="slbl" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Заметки</span>
            <button onClick={() => { setNoteDraft(note); setNoteModal(true); }} style={{ background: 'none', border: 'none', color: 'var(--blue)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>{note ? 'Изменить' : 'Добавить'}</button>
          </div>
          <div className="card" onClick={() => { setNoteDraft(note); setNoteModal(true); }} style={{ cursor: 'pointer', minHeight: 52 }}>
            <span style={{ fontSize: 13, color: note ? 'var(--text)' : 'var(--text3)', lineHeight: 1.6 }}>{note || 'Нет заметок — нажми, чтобы добавить'}</span>
          </div>
        </div>
      </div>

      <Modal open={locModal} onClose={() => setLocModal(false)}>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>Место хранения</div>
        {!locs.length && <div style={{ textAlign: 'center', padding: 20, color: 'var(--text3)' }}>Добавь места на вкладке «Хранение»</div>}
        {locs.map((l) => (
          <div key={l.id} className={`mloc${tLocMap[t.id] === l.id ? ' sel' : ''}`} onClick={() => { setLoc(t.id, l.id); setLocModal(false); }}>
            <div className="locdot" style={{ background: l.color }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{l.name}</div>
              {l.desc && <div style={{ fontSize: 11, color: 'var(--text3)' }}>{l.desc}</div>}
            </div>
            {tLocMap[t.id] === l.id && <span style={{ fontWeight: 600, color: 'var(--text)' }}>✓</span>}
          </div>
        ))}
        {tLocMap[t.id] && (
          <button onClick={() => { clearLoc(t.id); setLocModal(false); }} style={{ width: '100%', marginTop: 8, padding: 9, border: 'none', borderRadius: 10, background: 'transparent', cursor: 'pointer', fontSize: 12, color: 'var(--red)', fontFamily: 'inherit' }}>Убрать место хранения</button>
        )}
      </Modal>

      <Modal open={noteModal} onClose={() => setNoteModal(false)}>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Заметки</div>
        <textarea className="nta" placeholder="Куплено в Леонардо, партия 2024..." value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="bcn" onClick={() => setNoteModal(false)}>Отмена</button>
          <button className="bsv" onClick={() => { setNote(t.id, noteDraft.trim()); setNoteModal(false); }}>Сохранить</button>
        </div>
      </Modal>
    </div>
  );
}
