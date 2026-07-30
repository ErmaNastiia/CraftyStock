export default function FilterChips({ options, value, onChange, style }) {
  return (
    <div className="cr" style={style}>
      {options.map(([k, l]) => (
        <button
          key={k}
          type="button"
          className={`ch${value === k ? ' on' : ''}`}
          onClick={() => onChange(k)}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
