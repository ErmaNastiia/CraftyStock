import Modal from './Modal';
import { IconCheck } from './ui/icons';

// Shared "pick a storage location" sheet — used identically by ThreadDetail
// and BeadDetail (previously duplicated in both files).
export default function LocationPickerModal({ open, onClose, locs, selectedId, onSelect, onClear }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="modal-title">Место хранения</div>
      {!locs.length && (
        <div className="modal-empty">Добавь места на вкладке «Хранение»</div>
      )}
      {locs.map((l) => (
        <div
          key={l.id}
          className={`mloc${selectedId === l.id ? ' sel' : ''}`}
          onClick={() => onSelect(l.id)}
        >
          <div className="locdot" style={{ background: l.color }} />
          <div className="row-main">
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{l.name}</div>
            {l.desc && <div style={{ fontSize: 11, color: 'var(--text3)' }}>{l.desc}</div>}
          </div>
          {selectedId === l.id && <IconCheck size={16} strokeWidth={2.25} />}
        </div>
      ))}
      {selectedId && (
        <button className="link-danger" onClick={onClear}>
          Убрать место хранения
        </button>
      )}
    </Modal>
  );
}
