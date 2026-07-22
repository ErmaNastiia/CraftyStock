import { useState } from 'react';
import { QC, QL } from '../catalogData';
import { findByArticle } from '../mappingData';
import { isLight } from '../helpers';
import Dot from '../components/Dot';

const SAMPLES = ['321', '666', '0305', 'blanc', '3820', '552', '740', '3325'];

export default function Converter() {
  const [input, setInput] = useState('321');
  const [result, setResult] = useState(() => findByArticle('321'));

  function run(v) {
    setInput(v);
    setResult(findByArticle(v));
  }

  return (
    <div className="scr" id="s-converter">
      <div style={{ padding: '22px 26px', overflowY: 'auto', height: '100%', maxWidth: 520 }}>
        <div className="pt" style={{ marginBottom: 4 }}>Конвертер</div>
        <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 18 }}>Введи артикул DMC или Gamma</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <input
            className="cvi"
            placeholder="321, blanc, 0305..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') run(input); }}
          />
          <button className="cvb" onClick={() => run(input)}>Найти</button>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
          {SAMPLES.map((h) => (
            <button key={h} className="hp" onClick={() => run(h)}>{h}</button>
          ))}
        </div>

        {!result && (
          <div className="nf">
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--red)', marginBottom: 3 }}>Артикул «{input}» не найден</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>Попробуй другой номер или проверь написание</div>
          </div>
        )}

        {result && result.matches.map((m, i) => {
          const fromBrand = result.from === 'dmc' ? 'DMC' : 'Gamma';
          const toBrand = result.from === 'dmc' ? 'Gamma' : 'DMC';
          const toArticle = result.from === 'dmc' ? m.gamma_article : m.dmc_article;
          const qcol = QC[m.match_quality] || 'var(--text3)';
          const qlabel = QL[m.match_quality] || m.match_quality;
          return (
            <div className="card" key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 14 }}>
                <div style={{ textAlign: 'center' }}>
                  <div className="sw2" style={{ background: m.color_hex, border: `1px solid ${isLight(m.color_hex) ? 'rgba(0,0,0,.12)' : 'rgba(255,255,255,.08)'}` }} />
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 5 }}>{fromBrand}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{result.article}</div>
                </div>
                <div style={{ fontSize: 22, color: 'var(--border2)' }}>→</div>
                <div style={{ textAlign: 'center' }}>
                  <div className="sw2" style={{ background: m.color_hex, border: `1px solid ${isLight(m.color_hex) ? 'rgba(0,0,0,.12)' : 'rgba(255,255,255,.08)'}` }} />
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 5 }}>{toBrand}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{toArticle || '—'}</div>
                </div>
              </div>
              {m.color_name && <div style={{ textAlign: 'center', fontSize: 15, fontWeight: 500, color: 'var(--text)', marginBottom: 10 }}>{m.color_name}</div>}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 14 }}>
                <div className="qdot" style={{ background: qcol }} />
                <span style={{ fontSize: 12, fontWeight: 500, color: qcol }}>{qlabel}</span>
              </div>
              {(m.anchor_article || m.madeira_article) && (
                <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
                  {m.anchor_article && <span className="mc">Anchor {m.anchor_article}</span>}
                  {m.madeira_article && <span className="mc">Madeira {m.madeira_article}</span>}
                </div>
              )}
              {toArticle && (
                <button onClick={() => run(toArticle)} style={{ width: '100%', padding: 10, border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface2)', cursor: 'pointer', fontSize: 13, color: 'var(--text2)', fontFamily: 'inherit' }}>⇄ Конвертировать обратно</button>
              )}
            </div>
          );
        })}

        <div className="card" style={{ marginTop: 6 }}>
          <div style={{ fontSize: 10, letterSpacing: '.6px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10, fontWeight: 500 }}>Качество совпадения</div>
          <div>
            {Object.entries(QC).map(([k, c]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 9 }}>
                <div className="qdot" style={{ background: c, marginTop: 3 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>{QL[k]}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{k === 'exact' ? 'Цвета идентичны' : k === 'close' ? 'Визуально очень похожи' : 'Ближайший аналог'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
