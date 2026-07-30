import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DMC, GAMMA, BEADS, QC, QL } from '../catalogData';
import { findByArticle } from '../mappingData';
import { dlFile, parseArticleList, pct } from '../helpers';
import Dot from '../components/Dot';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import FilterChips from '../components/ui/FilterChips';
import Button from '../components/ui/Button';
import SectionLabel from '../components/ui/SectionLabel';
import SwatchHero from '../components/ui/SwatchHero';
import SwatchPair from '../components/ui/SwatchPair';
import MatchQualityBadge from '../components/ui/MatchQualityBadge';
import EmptyState from '../components/ui/EmptyState';
import ColorSwatchGrid from '../components/ui/ColorSwatchGrid';
import { IconArrowRight, IconDownload, IconAlertCircle, IconInbox, IconHash, IconList, IconPalette } from '../components/ui/icons';

const MODES = [
  ['single', 'По номеру'],
  ['bulk', 'По списку'],
  ['color', 'По цвету'],
];
const MODE_ICONS = { single: IconHash, bulk: IconList, color: IconPalette };

const SAMPLES = ['321', '666', '0305', 'blanc', '3820', '552', '740', '3325'];
const QCOLS = ['#FFFFFF', '#F5EDD3', '#FAB8A8', '#F07878', '#C82030', '#8C1020', '#F07010', '#FFCC00', '#3A9848', '#1AA8B0', '#4868D0', '#182090', '#7A3C8A', '#C88060', '#888888', '#1A1A1A'];

export default function Converter() {
  const [mode, setMode] = useState('single');

  return (
    <div className="scr" id="s-converter">
      <PageHeader title="Конвертер" />
      <div className="mode-switch">
        {MODES.map(([k, l]) => {
          const Icon = MODE_ICONS[k];
          return (
            <button key={k} type="button" className={`mode-btn${mode === k ? ' on' : ''}`} onClick={() => setMode(k)}>
              <Icon size={14} strokeWidth={1.9} />
              {l}
            </button>
          );
        })}
      </div>
      {mode === 'single' && <SingleMode />}
      {mode === 'bulk' && <BulkMode />}
      {mode === 'color' && <ColorMode />}
    </div>
  );
}

function SingleMode() {
  const [input, setInput] = useState('321');
  const [result, setResult] = useState(() => findByArticle('321'));

  function run(v) {
    setInput(v);
    setResult(findByArticle(v));
  }

  return (
    <div className="conv-pane conv-pane-narrow">
      <p className="conv-hint">Введи артикул DMC или Gamma</p>
      <div className="conv-search-row">
        <input
          className="cvi"
          placeholder="321, blanc, 0305..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') run(input); }}
        />
        <Button variant="primary" onClick={() => run(input)}>Найти</Button>
      </div>
      <div className="conv-samples">
        {SAMPLES.map((h) => (
          <button key={h} className="hp" onClick={() => run(h)}>{h}</button>
        ))}
      </div>

      {!result && (
        <div className="nf">
          <div className="nf-title">Артикул «{input}» не найден</div>
          <div className="nf-sub">Попробуй другой номер или проверь написание</div>
        </div>
      )}

      {result && result.matches.map((m, i) => {
        const fromBrand = result.from === 'dmc' ? 'DMC' : 'Gamma';
        const toBrand = result.from === 'dmc' ? 'Gamma' : 'DMC';
        const toArticle = result.from === 'dmc' ? m.gamma_article : m.dmc_article;
        return (
          <Card key={i} className="conv-result-card">
            <div className="conv-hero-row">
              <SwatchHero hex={m.color_hex} brand={fromBrand} article={result.article} />
              <IconArrowRight size={20} className="icon-muted" />
              <SwatchHero hex={m.color_hex} brand={toBrand} article={toArticle} />
            </div>
            {m.color_name && <div className="conv-color-name">{m.color_name}</div>}
            <div className="conv-quality-row">
              <MatchQualityBadge quality={m.match_quality} />
            </div>
            {(m.anchor_article || m.madeira_article) && (
              <div className="conv-mc-row">
                {m.anchor_article && <span className="mc">Anchor {m.anchor_article}</span>}
                {m.madeira_article && <span className="mc">Madeira {m.madeira_article}</span>}
              </div>
            )}
            {toArticle && (
              <Button variant="secondary" className="conv-back-btn" onClick={() => run(toArticle)}>
                ⇄ Конвертировать обратно
              </Button>
            )}
          </Card>
        );
      })}

      <Card className="conv-legend-card">
        <div className="conv-legend-title">Качество совпадения</div>
        {Object.entries(QC).map(([k, c]) => (
          <div key={k} className="conv-legend-row">
            <div className="qdot" style={{ background: c, marginTop: 3 }} />
            <div>
              <div className="conv-legend-label">{QL[k]}</div>
              <div className="conv-legend-desc">
                {k === 'exact' ? 'Цвета идентичны' : k === 'close' ? 'Визуально очень похожи' : 'Ближайший аналог'}
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function BulkMode() {
  const [raw, setRaw] = useState('321, 666, blanc\n3820\n552 740');
  const [submitted, setSubmitted] = useState(null);
  const nav = useNavigate();

  const rows = useMemo(() => {
    if (submitted == null) return [];
    return parseArticleList(submitted).map((article) => ({ article, result: findByArticle(article) }));
  }, [submitted]);

  const found = rows.filter((r) => r.result);
  const missing = rows.filter((r) => !r.result);

  function exportCSV() {
    const lines = [['Введённый артикул', 'Откуда', 'Куда', 'Артикул назначения', 'Название цвета', 'Качество'].join(',')];
    rows.forEach(({ article, result }) => {
      if (!result) {
        lines.push([article, '', '', '', '', 'не найден'].join(','));
        return;
      }
      const best = result.matches[0];
      const fromBrand = result.from === 'dmc' ? 'DMC' : 'Gamma';
      const toBrand = result.from === 'dmc' ? 'Gamma' : 'DMC';
      const toArticle = result.from === 'dmc' ? best.gamma_article : best.dmc_article;
      lines.push([result.article, fromBrand, toBrand, toArticle || '', (best.color_name || '').replace(/,/g, ';'), QL[best.match_quality] || best.match_quality].join(','));
    });
    dlFile('craftystock_conversion.csv', '﻿' + lines.join('\n'), 'text/csv;charset=utf-8');
  }

  return (
    <div className="conv-pane">
      <p className="conv-hint">Вставь список артикулов через запятую, пробел или с новой строки — найдём соответствие для каждого сразу</p>
      <textarea
        className="nta bulk-textarea"
        placeholder={'321, 666, blanc\n3820\n552 740'}
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
      />
      <div className="conv-search-row">
        <Button variant="primary" onClick={() => setSubmitted(raw)}>Конвертировать список</Button>
        {rows.length > 0 && (
          <Button variant="secondary" icon={<IconDownload size={14} />} onClick={exportCSV}>Скачать CSV</Button>
        )}
      </div>

      {submitted != null && rows.length === 0 && (
        <EmptyState icon={<IconInbox size={30} />} title="Список пуст" subtitle="Введи хотя бы один артикул" />
      )}

      {rows.length > 0 && (
        <>
          <div className="cnt cnt-flush">
            Найдено {found.length} из {rows.length}
            {missing.length > 0 ? ` · ${missing.length} не найдено` : ''}
          </div>
          <div className="bulk-list">
            {found.map(({ article, result }, i) => {
              const best = result.matches[0];
              const fromBrand = result.from === 'dmc' ? 'DMC' : 'Gamma';
              const toBrand = result.from === 'dmc' ? 'Gamma' : 'DMC';
              const toArticle = result.from === 'dmc' ? best.gamma_article : best.dmc_article;
              return (
                <div
                  key={article + i}
                  className="bulk-row"
                  onClick={() => nav(result.from === 'dmc' ? `/threads/dmc_${result.article}` : `/threads/gam_${result.article}`)}
                >
                  <Dot hex={best.color_hex} size={30} />
                  <div className="row-main">
                    <div className="bulk-row-title">{fromBrand} {result.article} <IconArrowRight size={11} className="icon-muted" style={{ verticalAlign: -1 }} /> {toBrand} {toArticle || '—'}</div>
                    {best.color_name && <div className="bulk-row-sub">{best.color_name}</div>}
                  </div>
                  <MatchQualityBadge quality={best.match_quality} />
                  {result.matches.length > 1 && <span className="bulk-row-extra">+{result.matches.length - 1}</span>}
                </div>
              );
            })}
            {missing.map(({ article }, i) => (
              <div key={article + i} className="bulk-row bulk-row-missing">
                <IconAlertCircle size={18} className="icon-danger" />
                <div className="row-main">
                  <div className="bulk-row-title">{article}</div>
                </div>
                <span className="bulk-row-sub">не найден</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ColorMode() {
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
    <div className="conv-pane conv-pane-narrow">
      <p className="conv-hint">Выбери или введи цвет — найдём похожие нитки и бисер в каталоге</p>
      <Card className="color-picker-card">
        <div className="color-picker-row">
          <div className="color-picker-preview" style={{ background: hex }} />
          <span className="color-picker-hash">#</span>
          <input className="hex-inp" defaultValue={hex.replace('#', '')} maxLength={6} onInput={(e) => onHexInput(e.target.value)} />
        </div>
        <ColorSwatchGrid colors={QCOLS} value={hex} onChange={setHex} />
      </Card>
      <FilterChips
        options={[['all', 'Все'], ['threads', 'Нитки'], ['beads', 'Бисер']]}
        value={type}
        onChange={setType}
        style={{ padding: '0 0 10px' }}
      />
      <div className="cnt cnt-flush">Найдено {results.length} похожих</div>
      <div className="bulk-list">
        {results.map((r, i) => (
          <div key={r.id} className="bulk-row" onClick={() => nav(r.type === 'thread' ? `/threads/${r.id}` : `/beads/${r.id}`)}>
            <span className="bulk-row-index">{i + 1}</span>
            <SwatchPair fromHex={hex} toHex={r.hex} size={26} />
            <div className="row-main">
              <div className="bulk-row-title">{r.brand} {r.article}</div>
              {r.name && <div className="bulk-row-sub">{r.name}</div>}
              <span className={`tag-chip tag-chip-${r.type}`}>{r.type === 'thread' ? 'Нитка' : 'Бисер'}</span>
            </div>
            <div className="color-match-score">
              <div className="color-match-pct" style={{ color: pc(r.p) }}>{r.p}%</div>
              <div className="color-match-bar">
                <div className="color-match-bar-fill" style={{ width: `${r.p}%`, background: pc(r.p) }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
