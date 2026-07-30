export default function PageHeader({ title, badge, badgeTone = 'neutral', action }) {
  return (
    <div className="ph">
      <div className="ph-left">
        <span className="pt">{title}</span>
        {badge != null && <span className={`pill p-${badgeTone}`}>{badge}</span>}
      </div>
      {action && <div className="ph-action">{action}</div>}
    </div>
  );
}
