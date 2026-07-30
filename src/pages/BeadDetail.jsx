import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BEADS, SHL, FNL } from '../catalogData';
import { useAppState } from '../StateContext';
import Dot from '../components/Dot';
import Card from '../components/ui/Card';
import DetailHeader from '../components/ui/DetailHeader';
import SectionLabel from '../components/ui/SectionLabel';
import Stepper from '../components/ui/Stepper';
import QuickAdjust from '../components/ui/QuickAdjust';
import LocationPickerModal from '../components/LocationPickerModal';
import { IconCamera, IconMapPin } from '../components/ui/icons';

export default function BeadDetail() {
  const { id } = useParams();
  const { bStocks, bQ, bLocMap, locs, setBLoc, clearBLoc } = useAppState();
  const [locModal, setLocModal] = useState(false);
  const b = BEADS.find((x) => x.id === id);
  if (!b) return null;
  const qty = bStocks[b.id] || 0;
  const loc = locs.find((l) => l.id === bLocMap[b.id]);

  const specs = [
    ['Форма', SHL[b.shape] || b.shape],
    ['Размер', b.size],
    ['Покрытие', FNL[b.finish] || b.finish],
    ['Материал', 'Стекло'],
  ];

  return (
    <div className="scr" id="s-bd">
      <DetailHeader title={`${b.brand} ${b.article}`} backTo="/beads" />
      <div className="sa" style={{ paddingTop: 0 }}>
        <div className="detail-hero detail-hero-sm" style={{ background: b.hex }}>
          <div className="photo-hint">
            <IconCamera size={16} strokeWidth={1.6} /> Добавить фото
          </div>
        </div>
        <div className="detail-body">
          <SectionLabel>Бисер</SectionLabel>
          <Card>
            <div className="detail-title-row">
              <div>
                <div className="detail-title detail-title-sm">{b.brand} {b.article}</div>
                <div className="detail-subtitle">{b.name}</div>
              </div>
              <Dot hex={b.hex} size={36} />
            </div>
            <div className="detail-specs-grid">
              {specs.map(([l, v]) => (
                <div key={l} className="detail-spec-tile">
                  <div className="detail-spec-label">{l}</div>
                  <div className="detail-spec-value">{v}</div>
                </div>
              ))}
            </div>
          </Card>

          <SectionLabel>В запасе</SectionLabel>
          <Card>
            <div className="detail-stock-row">
              <div className="detail-stock-status">
                <div className={`stock-dot${qty > 0 ? ' has-stock' : ''}`} />
                <span className="detail-stock-label">{qty > 0 ? qty + ' г' : 'Нет в запасе'}</span>
              </div>
              <Stepper value={qty} onChange={(d) => bQ(b.id, d)} step={1} size="lg" unit="г" />
            </div>
            <QuickAdjust deltas={[-5, -1, -0.5, 0.5, 1, 5]} value={qty} onChange={(d) => bQ(b.id, d)} suffix="г" />
          </Card>

          <SectionLabel>Место хранения</SectionLabel>
          <Card onClick={() => setLocModal(true)}>
            {loc ? (
              <div className="detail-loc-row">
                <div className="locdot" style={{ background: loc.color }} />
                <div className="row-main">
                  <div className="detail-loc-name">{loc.name}</div>
                  {loc.desc && <div className="detail-loc-desc">{loc.desc}</div>}
                </div>
                <span className="detail-loc-change">Изменить</span>
              </div>
            ) : (
              <div className="detail-loc-empty">
                <IconMapPin size={15} /> Не указано — нажми, чтобы выбрать
              </div>
            )}
          </Card>
        </div>
      </div>

      <LocationPickerModal
        open={locModal}
        onClose={() => setLocModal(false)}
        locs={locs}
        selectedId={bLocMap[b.id]}
        onSelect={(lid) => { setBLoc(b.id, lid); setLocModal(false); }}
        onClear={() => { clearBLoc(b.id); setLocModal(false); }}
      />
    </div>
  );
}
