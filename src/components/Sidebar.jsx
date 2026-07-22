import { NavLink } from 'react-router-dom';
import { TABS } from '../catalogData';
import { useAppState } from '../StateContext';

export default function Sidebar() {
  const { theme, setTheme } = useAppState();
  return (
    <div className="sb">
      <div className="sb-logo">
        <div className="sb-title">CraftyStock</div>
        <div className="sb-sub">Учёт рукодельных запасов</div>
      </div>
      <nav className="sb-nav">
        {TABS.map((t) => (
          <NavLink key={t.id} to={`/${t.id}`} className={({ isActive }) => `nb${isActive ? ' active' : ''}`}>
            <div className="nb-emoji">{t.emoji}</div>
            {t.label}
          </NavLink>
        ))}
      </nav>
      <div className="sb-foot">
        <span className="sb-ver">v1.0.0</span>
        <div className="tt">
          <button className={`ttb${theme === 'light' ? ' on' : ''}`} onClick={() => setTheme('light')} title="Светлая">☀️</button>
          <button className={`ttb${theme === 'dark' ? ' on' : ''}`} onClick={() => setTheme('dark')} title="Тёмная">🌙</button>
        </div>
      </div>
    </div>
  );
}
