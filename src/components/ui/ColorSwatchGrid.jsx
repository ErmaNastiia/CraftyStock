export default function ColorSwatchGrid({ colors, value, onChange, size = 29 }) {
  return (
    <div className="swatch-grid">
      {colors.map((c) => (
        <div
          key={c}
          className={`swatch-grid-dot${value && value.toUpperCase() === c.toUpperCase() ? ' sel' : ''}`}
          style={{ width: size, height: size, background: c, ...(c.toUpperCase() === '#FFFFFF' ? { borderColor: 'var(--border2)' } : {}) }}
          onClick={() => onChange(c)}
        />
      ))}
    </div>
  );
}
