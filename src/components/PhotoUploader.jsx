import { useRef } from 'react';
import { IconCamera, IconX } from './ui/icons';

// Drop-in replacement for the old static "Добавить фото" placeholder at the
// top of a detail page. Shows the color swatch until a photo exists, then
// shows the photo with small "change" / "remove" controls over it.
export default function PhotoUploader({ hex, photoUrl, uploading, onUpload, onRemove, compact }) {
  const inputRef = useRef(null);

  function handleChange(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = ''; // so picking the same file again still fires onChange
    if (file) onUpload(file);
  }

  return (
    <div className={`detail-hero${compact ? ' detail-hero-sm' : ''}`} style={{ background: photoUrl ? undefined : hex }}>
      {photoUrl && <img src={photoUrl} alt="" className="detail-hero-photo" />}
      <input ref={inputRef} type="file" accept="image/*" className="photo-input-hidden" onChange={handleChange} />

      {uploading ? (
        <div className="photo-spinner" />
      ) : photoUrl ? (
        <div className="photo-hero-actions">
          <button type="button" className="photo-hint" onClick={() => inputRef.current?.click()}>
            <IconCamera size={14} strokeWidth={1.7} /> Изменить
          </button>
          <button type="button" className="photo-hint photo-hint-danger" onClick={onRemove} title="Удалить фото">
            <IconX size={14} strokeWidth={2} />
          </button>
        </div>
      ) : (
        <button type="button" className="photo-hint" onClick={() => inputRef.current?.click()}>
          <IconCamera size={16} strokeWidth={1.6} /> Добавить фото
        </button>
      )}
    </div>
  );
}
