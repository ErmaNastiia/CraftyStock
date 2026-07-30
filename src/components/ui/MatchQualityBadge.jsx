import { QC, QL } from '../../catalogData';

export default function MatchQualityBadge({ quality }) {
  const color = QC[quality] || 'var(--text3)';
  const label = QL[quality] || quality;
  return (
    <span className="quality-badge">
      <span className="qdot" style={{ background: color }} />
      <span style={{ color }}>{label}</span>
    </span>
  );
}
