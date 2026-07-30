import Dot from '../Dot';

// Card-wrapped, clickable catalog row: swatch + title/subtitle/tags + right slot.
// Used by the Threads and Beads catalog lists.
export default function ItemRow({ swatchHex, title, subtitle, tags, onClick, right }) {
  return (
    <div className="card">
      <div className="cr2" onClick={onClick}>
        <Dot hex={swatchHex} size={42} />
        <div className="row-main">
          <div className="il">{title}</div>
          {subtitle && <div className="is">{subtitle}</div>}
          {tags && tags.length > 0 && (
            <div className="row-tags">
              {tags.map((t) => (
                <span key={t} className="tag-chip">{t}</span>
              ))}
            </div>
          )}
        </div>
        {right && (
          <div onClick={(e) => e.stopPropagation()} className="row-right-slot">
            {right}
          </div>
        )}
      </div>
    </div>
  );
}
