import { IconMinus, IconPlus } from './icons';

// Unified quantity +/- control. size="sm" is used inline in list rows,
// size="lg" is used on detail pages.
export default function Stepper({ value, onChange, step = 1, min = 0, formatValue, unit, size = 'sm' }) {
  const disabled = value - step < min;
  const display = formatValue ? formatValue(value) : value;
  const glyphSize = size === 'lg' ? 14 : 11;
  return (
    <div className={`stepper stepper-${size}`}>
      <button type="button" className="stepper-btn" disabled={disabled} onClick={() => onChange(-step)}>
        <IconMinus size={glyphSize} strokeWidth={2.25} />
      </button>
      <div className="stepper-val-wrap">
        <span className="stepper-val">{display}</span>
        {unit && <span className="stepper-unit">{unit}</span>}
      </div>
      <button type="button" className="stepper-btn" onClick={() => onChange(step)}>
        <IconPlus size={glyphSize} strokeWidth={2.25} />
      </button>
    </div>
  );
}
