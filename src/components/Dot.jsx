import { isLight } from '../helpers';

export default function Dot({ hex, size }) {
  return (
    <div
      className="dot"
      style={{
        width: size,
        height: size,
        background: hex,
        border: `1px solid ${isLight(hex) ? 'rgba(0,0,0,.12)' : 'rgba(255,255,255,.07)'}`,
      }}
    />
  );
}
