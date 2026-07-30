import { NavLink } from 'react-router-dom';
import { TABS } from '../catalogData';
import { useAppState } from '../StateContext';
import { IconThread, IconBead, IconShuffle, IconPackage, IconSettings, IconSun, IconMoon } from './ui/icons';

const TAB_ICONS = {
  thread: IconThread,
  bead: IconBead,
  shuffle: IconShuffle,
  package: IconPackage,
  settings: IconSettings,
};

export default function Sidebar() {
  const { theme, setTheme } = useAppState();
  return (
    <div className="sb">
      <div className="sb-logo">
        <div className="sb-mark">CS</div>
        <div>
          <div className="sb-title">CraftyStock</div>
          <div className="sb-sub">Учёт рукодельных запасов</div>
        </div>
      </div>
      <nav className="sb-nav">
        {TABS.map((t) => {
          const Icon = TAB_ICONS[t.icon];
          return (
            <NavLink key={t.id} to={`/${t.id}`} className={({ isActive }) => `nb${isActive ? ' active' : ''}`}>
              <span className="nb-icon-wrap">
                <Icon size={17} strokeWidth={1.8} />
              </span>
              {t.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="sb-foot">
        <span className="sb-ver">v2.0.0</span>
        <div className="tt">
          <button className={`ttb${theme === 'light' ? ' on' : ''}`} onClick={() => setTheme('light')} title="Светлая">
            <IconSun size={14} strokeWidth={1.8} />
          </button>
          <button className={`ttb${theme === 'dark' ? ' on' : ''}`} onClick={() => setTheme('dark')} title="Тёмная">
            <IconMoon size={14} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
}
