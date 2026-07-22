import { DMC, GAMMA, BEADS, SHL, FNL } from '../catalogData';
import { MAP_ENTRIES } from '../mappingData';
import { useAppState } from '../StateContext';

function dlFile(name, content, type = 'text/plain') {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function Settings() {
  const { tStocks, bStocks, tNotes, tLocMap, locs, theme, setTheme, toast } = useAppState();

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
    dlFile('craftystock_threads.csv', '\uFEFF' + rows.join('\n'), 'text/csv;charset=utf-8');
    toast('Нитки экспортированы ✓');
  }

  function exportBeadsCSV() {
    const rows = [['Бренд', 'Артикул', 'Название', 'Цвет HEX', 'Форма', 'Размер', 'Покрытие', 'Граммов'].join(',')];
    BEADS.forEach((b) => rows.push([b.brand, b.article, b.name, b.hex, SHL[b.shape] || b.shape, b.size, FNL[b.finish] || b.finish, bStocks[b.id] || 0].join(',')));
    dlFile('craftystock_beads.csv', '\uFEFF' + rows.join('\n'), 'text/csv;charset=utf-8');
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
    { ic: '🧵', lb: 'Нитки CSV', ds: 'Артикулы, цвета, запасы', fn: exportThreadsCSV },
    { ic: '🔮', lb: 'Бисер CSV', ds: 'Артикулы, формы, граммы', fn: exportBeadsCSV },
    { ic: '💾', lb: 'Полный бэкап JSON', ds: 'Все данные для восстановления', fn: exportBackup },
  ];

  const catalogRows = [
    ['🧵', 'DMC', DMC.length + ' цветов'],
    ['🧵', 'Gamma', GAMMA.length + ' цветов'],
    ['🔮', 'Miyuki', BEADS.filter((b) => b.brand === 'Miyuki').length + ' цветов'],
    ['🔮', 'Preciosa', BEADS.filter((b) => b.brand === 'Preciosa').length + ' цветов'],
    ['🔗', 'DMC↔Gamma', MAP_ENTRIES.length + ' соответствий'],
  ];

  return (
    <div className="scr" id="s-settings">
      <div style={{ padding: '22px 26px', overflowY: 'auto', height: '100%', maxWidth: 540 }}>
        <div className="pt" style={{ marginBottom: 4 }}>Настройки</div>
        <div className="slbl" style={{ marginTop: 16 }}>Моя коллекция</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 4 }}>
          {stats.map((s) => (
            <div className="stile" key={s.l}>
              <div className="sbig">{s.v}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{s.l}</div>
              {s.s && <div style={{ fontSize: 10, fontWeight: 500, color: s.sc, marginTop: 3 }}>{s.s}</div>}
            </div>
          ))}
        </div>
        <div className="slbl">Тема оформления</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
          {[['light', '☀️ Светлая'], ['dark', '🌙 Тёмная']].map(([k, l]) => (
            <button key={k} className={`ch${theme === k ? ' on' : ''}`} style={{ flex: 1, textAlign: 'center' }} onClick={() => setTheme(k)}>{l}</button>
          ))}
        </div>
        <div className="slbl">Экспорт данных</div>
        <div className="slist" style={{ marginBottom: 4 }}>
          {exportItems.map((x) => (
            <button className="export-btn" key={x.lb} onClick={x.fn}>
              <span style={{ fontSize: 18, width: 26, textAlign: 'center' }}>{x.ic}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: 'var(--text)' }}>{x.lb}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>{x.ds}</div>
              </div>
              <span style={{ color: 'var(--text3)' }}>›</span>
            </button>
          ))}
        </div>
        <div className="slbl">Каталоги</div>
        <div className="slist">
          {catalogRows.map(([ic, lb, vl]) => (
            <div className="srow" key={lb}>
              <span style={{ fontSize: 17, width: 26, textAlign: 'center' }}>{ic}</span>
              <span style={{ flex: 1, fontSize: 14, color: 'var(--text)' }}>{lb}</span>
              <span style={{ fontSize: 13, color: 'var(--text3)' }}>{vl}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text4)', marginTop: 22 }}>CraftyStock v1.0.0 · Сделано с 🧵</div>
      </div>
    </div>
  );
}
