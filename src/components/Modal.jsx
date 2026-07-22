export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="mbg" onClick={onClose}>
      <div className="msh" onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}
