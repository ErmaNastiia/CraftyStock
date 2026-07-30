import Dot from '../Dot';

// Borderless row used for nested lists (e.g. items inside a storage location).
export default function CompactRow({ swatchHex, title, subtitle, right, onClick }) {
  return (
    <div className="loc-item-row" onClick={onClick}>
      <Dot hex={swatchHex} size={26} />
      <div className="row-main">
        <div className="row-main-title">{title}</div>
        {subtitle && <div className="row-main-sub">{subtitle}</div>}
      </div>
      {right != null && <span className="row-right">{right}</span>}
    </div>
  );
}
