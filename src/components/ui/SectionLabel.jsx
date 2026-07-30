export default function SectionLabel({ children, action }) {
  if (!action) return <div className="slbl">{children}</div>;
  return (
    <div className="slbl slbl-row">
      <span>{children}</span>
      {action}
    </div>
  );
}
