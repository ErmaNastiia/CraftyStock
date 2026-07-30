import { isLight } from '../../helpers';

// Large rounded-square swatch with a brand/article caption — the hero
// display used at the top of a single conversion result.
export default function SwatchHero({ hex, brand, article }) {
  return (
    <div className="swatch-hero">
      <div
        className="sw2"
        style={{ background: hex, border: `1px solid ${isLight(hex) ? 'rgba(0,0,0,.12)' : 'rgba(255,255,255,.08)'}` }}
      />
      <div className="swatch-hero-brand">{brand}</div>
      <div className="swatch-hero-article">{article || '—'}</div>
    </div>
  );
}
