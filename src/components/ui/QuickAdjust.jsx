export default function QuickAdjust({ deltas, value, onChange, suffix = '' }) {
  return (
    <div className="fbs">
      {deltas.map((d) => (
        <button
          key={d}
          type="button"
          className="fb"
          disabled={value + d < 0}
          onClick={() => onChange(d)}
        >
          {d > 0 ? '+' + d : d}
          {suffix}
        </button>
      ))}
    </div>
  );
}
