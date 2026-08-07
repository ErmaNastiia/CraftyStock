import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DMC, GAMMA } from '../catalogData';
import { byDmc, byGamma } from '../mappingData';
import { useAppState } from '../StateContext';
import { fmtQ } from '../helpers';
import Dot from '../components/Dot';
import Card from '../components/ui/Card';
import DetailHeader from '../components/ui/DetailHeader';
import SectionLabel from '../components/ui/SectionLabel';
import Stepper from '../components/ui/Stepper';
import QuickAdjust from '../components/ui/QuickAdjust';
import MatchQualityBadge from '../components/ui/MatchQualityBadge';
import LocationPickerModal from '../components/LocationPickerModal';
import Modal from '../components/Modal';
import Button from '../components/ui/Button';
import PhotoUploader from '../components/PhotoUploader';
import { IconMapPin } from '../components/ui/icons';

const ALL = [...DMC, ...GAMMA];

export default function ThreadDetail() {
  const { id } = useParams();
  const { tStocks, tQ, tLocMap, locs, tNotes, setNote, setLoc, clearLoc, tPhotos, photoUploading, uploadPhoto, removePhoto } = useAppState();
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
      <DetailHeader title={`${t.brand} ${t.article}`} backTo="/threads" />
      <div className="sa" style={{ paddingTop: 0 }}>
        <PhotoUploader
          hex={t.hex}
          photoUrl={tPhotos[t.id]}
          uploading={Boolean(photoUploading[`thread_${t.id}`])}
          onUpload={(file) => uploadPhoto('thread', t.id, file)}
          onRemove={() => removePhoto('thread', t.id)}
        />
        <div className="detail-body">
          <SectionLabel>Нитка</SectionLabel>
          <Card>
            <div className="detail-title-row">
              <div>
                <div className="detail-title">{t.brand} {t.article}</div>
                <div className="detail-subtitle">{t.name_ru}</div>
                {t.name_en && <div className="detail-subtitle-en">{t.name_en}</div>}
              </div>
              <Dot hex={t.hex} size={38} />
            </div>
            <div className="detail-tags">
              <span className="mc">{t.hex.toUpperCase()}</span>
              <span className="mc">{t.mat}</span>
              <span className="mc">8г · 8м</span>
            </div>
          </Card>

          <SectionLabel>В запасе</SectionLabel>
          <Card>
            <div className="detail-stock-row">
              <div className="detail-stock-status">
                <div className={`stock-dot${qty > 0 ? ' has-stock' : ''}`} />
                <span className="detail-stock-label">{qty > 0 ? `${fmtQ(qty)} ${qty === 1 ? 'моток' : qty < 2 ? 'мотка' : 'мотков'}` : 'Нет в запасе'}</span>
              </div>
              <Stepper value={qty} onChange={(d) => tQ(t.id, d)} step={0.5} formatValue={fmtQ} size="lg" />
            </div>
            <QuickAdjust deltas={[-2, -1, -0.5, 0.5, 1, 2]} value={qty} onChange={(d) => tQ(t.id, d)} />
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

          {matches.length > 0 && (
            <>
              <SectionLabel>{t.brand === 'DMC' ? 'Аналоги Gamma' : 'Аналоги DMC'}</SectionLabel>
              {matches.map((m, i) => {
                const otherArticle = t.brand === 'DMC' ? m.gamma_article : m.dmc_article;
                const otherBrand = t.brand === 'DMC' ? 'Gamma' : 'DMC';
                return (
                  <Card key={i} className="match-card">
                    <div className="match-row">
                      <div className="swatch-pair">
                        <Dot hex={t.hex} size={34} />
                        <div className="swatch-pair-line" />
                        <Dot hex={m.color_hex} size={34} />
                      </div>
                      <div className="row-main">
                        <div className="match-title">{otherBrand} {otherArticle}</div>
                        {m.color_name && <div className="match-color-name">{m.color_name}</div>}
                        <div className="match-quality-wrap">
                          <MatchQualityBadge quality={m.match_quality} />
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </>
          )}

          <SectionLabel action={
            <button className="link-btn" onClick={() => { setNoteDraft(note); setNoteModal(true); }}>
              {note ? 'Изменить' : 'Добавить'}
            </button>
          }>
            Заметки
          </SectionLabel>
          <Card onClick={() => { setNoteDraft(note); setNoteModal(true); }} className="note-card">
            <span className={note ? 'note-text' : 'note-text-empty'}>{note || 'Нет заметок — нажми, чтобы добавить'}</span>
          </Card>
        </div>
      </div>

      <LocationPickerModal
        open={locModal}
        onClose={() => setLocModal(false)}
        locs={locs}
        selectedId={tLocMap[t.id]}
        onSelect={(lid) => { setLoc(t.id, lid); setLocModal(false); }}
        onClear={() => { clearLoc(t.id); setLocModal(false); }}
      />

      <Modal open={noteModal} onClose={() => setNoteModal(false)}>
        <div className="modal-title">Заметки</div>
        <textarea className="nta" placeholder="Куплено в Леонардо, партия 2024..." value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} />
        <div className="modal-actions">
          <Button variant="ghost" onClick={() => setNoteModal(false)}>Отмена</Button>
          <Button variant="primary" onClick={() => { setNote(t.id, noteDraft.trim()); setNoteModal(false); }}>Сохранить</Button>
        </div>
      </Modal>
    </div>
  );
}
