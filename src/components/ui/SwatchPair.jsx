import Dot from '../Dot';

// Two small circular swatches joined by a thin connector — used to show a
// "this matches that" relationship inline in a row.
export default function SwatchPair({ fromHex, toHex, size = 26 }) {
  return (
    <div className="swatch-pair">
      <Dot hex={fromHex} size={size} />
      <div className="swatch-pair-line" />
      <Dot hex={toHex} size={size} />
    </div>
  );
}
