export default function Card({ children, onClick, className = '', style, noPad = false }) {
  const cls = ['card', onClick ? 'card-clickable' : '', noPad ? 'card-nopad' : '', className]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls} style={style} onClick={onClick}>
      {children}
    </div>
  );
}
