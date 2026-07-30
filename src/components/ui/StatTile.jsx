export default function StatTile({ value, label, sublabel, tone }) {
  return (
    <div className="stile">
      <div className="sbig">{value}</div>
      <div className="stile-label">{label}</div>
      {sublabel && (
        <div className="stile-sub" style={{ color: tone }}>
          {sublabel}
        </div>
      )}
    </div>
  );
}
