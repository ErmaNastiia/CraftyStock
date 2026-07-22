import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DMC, GAMMA, ANCHOR, MADEIRA } from "../catalogData";
import { useAppState } from "../StateContext";
import { fmtQ } from "../helpers";
import Dot from "../components/Dot";

const ALL = [...DMC, ...GAMMA, ...ANCHOR, ...MADEIRA];

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
      <div className="ph">
        <span className="pt">Нитки</span>
        <span className="pill pg">{inStockCount} в запасе</span>
      </div>
      <div className="sw">
        <div className="sb2">
          <svg
            width="15"
            height="15"
            fill="none"
            stroke="var(--text3)"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            placeholder="Артикул, название..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>
      <div className="cr">
        {[
          ["all", "Все"],
          ["DMC", "DMC"],
          ["Gamma", "Gamma"],
          ["Anchor", "Anchor"],
          ["Madeira", "Madeira"],
          ["stock", "В запасе"],
        ].map(([k, l]) => (
          <button
            key={k}
            className={`ch${brand === k ? " on" : ""}`}
            onClick={() => setBrand(k)}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="cnt">{list.length} ниток</div>
      <div className="sa">
        {list.map((t) => {
          const qty = tStocks[t.id] || 0;
          return (
            <div className="card" key={t.id}>
              <div className="cr2" onClick={() => nav(`/threads/${t.id}`)}>
                <Dot hex={t.hex} size={42} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="il">
                    {t.brand} {t.article}
                  </div>
                  {t.name_ru && <div className="is">{t.name_ru}</div>}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 7,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className={`sp ${qty > 0 ? "si" : "so"}`}>
                    {qty > 0 ? fmtQ(qty) + " мот." : "нет"}
                  </span>
                  <div className="ctr">
                    <button
                      className="cb"
                      disabled={qty <= 0}
                      onClick={() => tQ(t.id, -0.5)}
                    >
                      −
                    </button>
                    <span className="cv">{fmtQ(qty)}</span>
                    <button className="cb" onClick={() => tQ(t.id, 0.5)}>
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
