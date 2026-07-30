import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BEADS, SHL, FNL } from '../catalogData';
import { useAppState } from '../StateContext';
import PageHeader from '../components/ui/PageHeader';
import SearchInput from '../components/ui/SearchInput';
import FilterChips from '../components/ui/FilterChips';
import ItemRow from '../components/ui/ItemRow';
import Stepper from '../components/ui/Stepper';
import EmptyState from '../components/ui/EmptyState';
import { IconSearch } from '../components/ui/icons';

const BRAND_OPTIONS = [['all', 'Все'], ['Miyuki', 'Miyuki'], ['Preciosa', 'Preciosa'], ['stock', 'В запасе']];
const SHAPE_OPTIONS = [['all', 'Форма'], ['round', 'Круглый'], ['drop', 'Капля'], ['bugle', 'Стеклярус']];

export default function Beads() {
  const { bStocks, bQ } = useAppState();
  const [brand, setBrand] = useState('all');
  const [shape, setShape] = useState('all');
  const [q, setQ] = useState('');
  const nav = useNavigate();

  const list = useMemo(() => {
    const query = q.toLowerCase();
    return BEADS.filter((b) => {
      const ms = !query || b.article.toLowerCase().includes(query) || b.name.toLowerCase().includes(query) || b.brand.toLowerCase().includes(query);
      const mb = brand === 'all' || b.brand === brand || (brand === 'stock' && (bStocks[b.id] || 0) > 0);
      return ms && mb && (shape === 'all' || b.shape === shape);
    });
  }, [q, brand, shape, bStocks]);

  const insCount = BEADS.filter((b) => (bStocks[b.id] || 0) > 0).length;

  return (
    <div className="scr" id="s-beads">
      <PageHeader title="Бисер" badge={`${insCount} видов`} badgeTone="purple" />
      <SearchInput value={q} onChange={setQ} placeholder="Артикул, цвет, бренд..." />
      <FilterChips options={BRAND_OPTIONS} value={brand} onChange={setBrand} />
      <FilterChips options={SHAPE_OPTIONS} value={shape} onChange={setShape} style={{ marginTop: -4 }} />
      <div className="cnt">{list.length} позиций</div>
      <div className="sa">
        {list.length === 0 && (
          <EmptyState icon={<IconSearch size={30} />} title="Ничего не найдено" subtitle="Попробуй изменить запрос или фильтр" />
        )}
        {list.map((b) => {
          const qty = bStocks[b.id] || 0;
          return (
            <ItemRow
              key={b.id}
              swatchHex={b.hex}
              title={`${b.brand} ${b.article}`}
              subtitle={b.name}
              tags={[SHL[b.shape] || b.shape, b.size, FNL[b.finish] || b.finish]}
              onClick={() => nav(`/beads/${b.id}`)}
              right={<Stepper value={qty} onChange={(d) => bQ(b.id, d)} step={1} unit="г" />}
            />
          );
        })}
      </div>
    </div>
  );
}
