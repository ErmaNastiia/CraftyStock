import { DMC, GAMMA, BEADS, SHL, FNL } from '../catalogData';
import { MAP_ENTRIES } from '../mappingData';
import { useAppState } from '../StateContext';
import { useAuth } from '../AuthContext';
import { dlFile } from '../helpers';
import SectionLabel from '../components/ui/SectionLabel';
import StatTile from '../components/ui/StatTile';
import { IconThread, IconBead, IconDownload, IconShuffle, IconChevronRight, IconSun, IconMoon } from '../components/ui/icons';

const SYNC_LABEL = {
  synced: { text: 'Синхронизировано', tone: 'p-green' },
  syncing: { text: 'Синхронизация...', tone: 'p-neutral' },
  offline: { text: 'Нет связи — сохранено локально', tone: 'p-neutral' },
};

export default function Settings() {
  const { tStocks, bStocks, tNotes, tLocMap, locs, theme, setTheme, toast, syncState } = useAppState();
  const { user, signOutUser } = useAuth();

  const ti = Object.values(tStocks).filter((v) => v > 0).length;
  const bi = Object.values(bStocks).filter((v) => v > 0).length;

  function exportThreadsCSV() {
    const all = [...DMC, ...GAMMA];
    const rows = [['Бренд', 'Артикул', 'Название', 'Цвет HEX', 'Мотков', 'Место хранения', 'Заметки'].join(',')];
    all.forEach((t) => {
      const qty = tStocks[t.id] || 0;
      const loc = locs.find((l) => l.id === tLocMap[t.id]);
      rows.push([t.brand, t.article, t.name_ru, t.hex, qty, loc ? loc.name : '', (tNotes[t.id] || '').replace(/,/g, ';')].join(','));
    });
    dlFile('craftystock_threads.csv', '﻿' + rows.join('\n'), 'text/csv;charset=utf-8');
    toast('Нитки экспортированы ✓');
  }

  function exportBeadsCSV() {
    const rows = [['Бренд', 'Артикул', 'Название', 'Цвет HEX', 'Форма', 'Размер', 'Покрытие', 'Граммов'].join(',')];
    BEADS.forEach((b) => rows.push([b.brand, b.article, b.name, b.hex, SHL[b.shape] || b.shape, b.size, FNL[b.finish] || b.finish, bStocks[b.id] || 0].join(',')));
    dlFile('craftystock_beads.csv', '﻿' + rows.join('\n'), 'text/csv;charset=utf-8');
    toast('Бисер экспортирован ✓');
  }

  function exportBackup() {
    const data = {
      version: 1,
      exported_at: new Date().toISOString(),
      threads: Object.entries(tStocks).map(([id, qty]) => ({ id, qty, note: tNotes[id] || '', loc: tLocMap[id] || '' })),
      beads: Object.entries(bStocks).map(([id, qty]) => ({ id, qty })),
      locations: locs,
    };
    dlFile('craftystock_backup.json', JSON.stringify(data, null, 2), 'application/json');
    toast('Бэкап сохранён ✓');
  }

  const stats = [
    { v: ti, l: 'видов ниток', s: ti ? ti + ' в запасе' : null, sc: 'var(--green-t)' },
    { v: bi, l: 'видов бисера', s: bi ? bi + ' в запасе' : null, sc: 'var(--purple-t)' },
    { v: locs.length, l: 'мест хранения' },
    { v: DMC.length + GAMMA.length, l: 'ниток в каталоге' },
  ];

  const exportItems = [
    { Icon: IconThread, lb: 'Нитки CSV', ds: 'Артикулы, цвета, запасы', fn: exportThreadsCSV },
    { Icon: IconBead, lb: 'Бисер CSV', ds: 'Артикулы, формы, граммы', fn: exportBeadsCSV },
    { Icon: IconDownload, lb: 'Полный бэкап JSON', ds: 'Все данные для восстановления', fn: exportBackup },
  ];

  const catalogRows = [
    [IconThread, 'DMC', DMC.length + ' цветов'],
    [IconThread, 'Gamma', GAMMA.length + ' цветов'],
    [IconBead, 'Miyuki', BEADS.filter((b) => b.brand === 'Miyuki').length + ' цветов'],
    [IconBead, 'Preciosa', BEADS.filter((b) => b.brand === 'Preciosa').length + ' цветов'],
    [IconShuffle, 'DMC↔Gamma', MAP_ENTRIES.length + ' соответствий'],
  ];

  return (
    <div className="scr" id="s-settings">
      <div className="settings-wrap">
        <div className="pt" style={{ marginBottom: 4 }}>Настройки</div>
        <SectionLabel>Аккаунт</SectionLabel>
        <div className="slist" style={{ marginBottom: 4 }}>
          <div className="srow">
            <span style={{ flex: 1, fontSize: 14, color: 'var(--text)' }}>{user?.email}</span>
            <span className={`pill ${SYNC_LABEL[syncState]?.tone || 'p-neutral'}`}>{SYNC_LABEL[syncState]?.text || syncState}</span>
          </div>
          <button className="export-btn" onClick={signOutUser}>
            <span style={{ flex: 1, fontSize: 14, color: 'var(--red)' }}>Выйти из аккаунта</span>
          </button>
        </div>
        <SectionLabel>Моя коллекция</SectionLabel>
        <div className="settings-stats-grid">
          {stats.map((s) => (
            <StatTile key={s.l} value={s.v} label={s.l} sublabel={s.s} tone={s.sc} />
          ))}
        </div>
        <SectionLabel>Тема оформления</SectionLabel>
        <div className="settings-theme-row">
          <button className={`ch settings-theme-btn${theme === 'light' ? ' on' : ''}`} onClick={() => setTheme('light')}>
            <IconSun size={14} /> Светлая
          </button>
          <button className={`ch settings-theme-btn${theme === 'dark' ? ' on' : ''}`} onClick={() => setTheme('dark')}>
            <IconMoon size={14} /> Тёмная
          </button>
        </div>
        <SectionLabel>Экспорт данных</SectionLabel>
        <div className="slist" style={{ marginBottom: 4 }}>
          {exportItems.map((x) => (
            <button className="export-btn" key={x.lb} onClick={x.fn}>
              <span className="icon-tile"><x.Icon size={17} strokeWidth={1.7} /></span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: 'var(--text)' }}>{x.lb}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>{x.ds}</div>
              </div>
              <IconChevronRight size={15} className="icon-muted" />
            </button>
          ))}
        </div>
        <SectionLabel>Каталоги</SectionLabel>
        <div className="slist">
          {catalogRows.map(([Icon, lb, vl]) => (
            <div className="srow" key={lb}>
              <span className="icon-tile"><Icon size={16} strokeWidth={1.7} /></span>
              <span style={{ flex: 1, fontSize: 14, color: 'var(--text)' }}>{lb}</span>
              <span style={{ fontSize: 13, color: 'var(--text3)' }}>{vl}</span>
            </div>
          ))}
        </div>
        <div className="settings-footer">CraftyStock v2.0.0 · Сделано с <IconThread size={12} strokeWidth={2} /></div>
      </div>
    </div>
  );
}
