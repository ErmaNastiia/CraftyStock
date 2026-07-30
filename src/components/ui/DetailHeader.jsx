import { useNavigate } from 'react-router-dom';
import { IconArrowLeft } from './icons';

export default function DetailHeader({ title, backTo }) {
  const nav = useNavigate();
  return (
    <div className="dh">
      <button className="bk" onClick={() => nav(backTo)}>
        <IconArrowLeft size={14} strokeWidth={2.1} /> Назад
      </button>
      <span className="dt">{title}</span>
      <div className="dh-spacer" />
    </div>
  );
}
