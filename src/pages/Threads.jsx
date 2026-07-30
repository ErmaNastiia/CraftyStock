import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DMC, GAMMA, ANCHOR, MADEIRA } from "../catalogData";
import { useAppState } from "../StateContext";
import { fmtQ } from "../helpers";
import PageHeader from "../components/ui/PageHeader";
import SearchInput from "../components/ui/SearchInput";
import FilterChips from "../components/ui/FilterChips";
import ItemRow from "../components/ui/ItemRow";
import Stepper from "../components/ui/Stepper";
import EmptyState from "../components/ui/EmptyState";
import { IconSearch } from "../components/ui/icons";

const ALL = [...DMC, ...GAMMA, ...ANCHOR, ...MADEIRA];
const BRAND_OPTIONS = [
  ["all", "Все"],
  ["DMC", "DMC"],
  ["Gamma", "Gamma"],
  ["Anchor", "Anchor"],
  ["Madeira", "Madeira"],
  ["stock", "В запасе"],
];

export default function Threads() {
  const { tStocks, tQ } = useAppState();
  const [brand, setBrand] = useState("all");
  const [q, setQ] = useState("");
  const nav = useNavigate();

  const list = useMemo(() => {
    const query = q.toLowerCase();
    return ALL.filter((t) => {
      const ms =
        !query ||
        t.article.toLowerCase().includes(query) ||
        t.name_ru.toLowerCase().includes(query) ||
        t.brand.toLowerCase().includes(query);
      const mb =
        brand === "all" ||
        t.brand === brand ||
        (brand === "stock" && (tStocks[t.id] || 0) > 0);
      return ms && mb;
    });
  }, [q, brand, tStocks]);

  const inStockCount = ALL.filter((t) => (tStocks[t.id] || 0) > 0).length;

  return (
    <div className="scr" id="s-threads">
      <PageHeader title="Нитки" badge={`${inStockCount} в запасе`} badgeTone="green" />
      <SearchInput value={q} onChange={setQ} placeholder="Артикул, название..." />
      <FilterChips options={BRAND_OPTIONS} value={brand} onChange={setBrand} />
      <div className="cnt">{list.length} ниток</div>
      <div className="sa">
        {list.length === 0 && (
          <EmptyState icon={<IconSearch size={30} />} title="Ничего не найдено" subtitle="Попробуй изменить запрос или фильтр" />
        )}
        {list.map((t) => {
          const qty = tStocks[t.id] || 0;
          return (
            <ItemRow
              key={t.id}
              swatchHex={t.hex}
              title={`${t.brand} ${t.article}`}
              subtitle={t.name_ru}
              onClick={() => nav(`/threads/${t.id}`)}
              right={
                <div className="row-right-col">
                  <span className={`sp ${qty > 0 ? "si" : "so"}`}>
                    {qty > 0 ? fmtQ(qty) + " мот." : "нет"}
                  </span>
                  <Stepper value={qty} onChange={(d) => tQ(t.id, d)} step={0.5} formatValue={fmtQ} />
                </div>
              }
            />
          );
        })}
      </div>
    </div>
  );
}
