import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DMC, GAMMA, ANCHOR, MADEIRA, BEADS } from "../catalogData";
import { useAppState } from "../StateContext";
import { fmtQ } from "../helpers";
import Dot from "../components/Dot";

const ALL_THREADS = [...DMC, ...GAMMA, ...ANCHOR, ...MADEIRA];
const FCOLS = [
  "#4A90D9",
  "#E5534B",
  "#2FA85F",
  "#B07FD4",
  "#F5A623",
  "#50C8C6",
  "#D4AC0D",
  "#888888",
];

export default function Storage() {
  const { locs, addLoc, delLoc, tLocMap, bLocMap, tStocks, bStocks } =
    useAppState();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [color, setColor] = useState(FCOLS[0]);
  const [expanded, setExpanded] = useState(null);

  function save() {
    const n = name.trim();
    if (!n) return;
    addLoc({ id: "l" + Date.now(), name: n, desc: desc.trim(), color });
    setOpen(false);
    setName("");
    setDesc("");
    setColor(FCOLS[0]);
  }

  function itemsFor(locId) {
    const threads = ALL_THREADS.filter((t) => tLocMap[t.id] === locId);
    const beads = BEADS.filter((b) => bLocMap[b.id] === locId);
    return { threads, beads };
  }

  return (
    <div className="scr" id="s-storage">
      <div className="ph">
        <span className="pt">Хранение</span>
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            background: "var(--accent)",
            color: "var(--accent-fg)",
            border: "none",
            borderRadius: 99,
            padding: "7px 16px",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          + Добавить
        </button>
      </div>
      {open && (
        <div style={{ margin: "0 26px 12px" }}>
          <div className="card" style={{ margin: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text)",
                marginBottom: 12,
              }}
            >
              Новое место хранения
            </div>
            <input
              className="fi"
              placeholder="Синяя коробка IKEA"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="fi"
              placeholder="Верхняя полка (необязательно)"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <div
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: ".6px",
                color: "var(--text3)",
                marginBottom: 7,
              }}
            >
              Цвет-метка
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 13,
              }}
            >
              {FCOLS.map((c) => (
                <div
                  key={c}
                  className={`cpd${color === c ? " sel" : ""}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
            <div
              style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
            >
              <button className="bcn" onClick={() => setOpen(false)}>
                Отмена
              </button>
              <button className="bsv" onClick={save}>
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="sa">
        {!locs.length && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 24px",
              color: "var(--text3)",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>📦</div>
            <div style={{ fontSize: 15, marginBottom: 6 }}>
              Нет мест хранения
            </div>
            <div style={{ fontSize: 13 }}>Добавь коробку, полку или ящик</div>
          </div>
        )}
        {locs.map((l) => {
          const { threads, beads } = itemsFor(l.id);
          const total = threads.length + beads.length;
          const isOpen = expanded === l.id;
          return (
            <div key={l.id} style={{ marginBottom: 10 }}>
              <div
                className="stcard"
                style={{ marginBottom: 0, cursor: "pointer" }}
                onClick={() => setExpanded(isOpen ? null : l.id)}
              >
                <div className="stbar" style={{ background: l.color }} />
                <div className="stbody">
                  <div className="stbox" style={{ background: l.color + "22" }}>
                    <span style={{ fontSize: 22 }}>📦</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: "var(--text)",
                      }}
                    >
                      {l.name}
                    </div>
                    {l.desc && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--text3)",
                          marginTop: 2,
                        }}
                      >
                        {l.desc}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--text3)",
                        marginTop: 3,
                      }}
                    >
                      {total === 0
                        ? "Пусто"
                        : `${threads.length} ниток, ${beads.length} видов бисера`}
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    color: "var(--text3)",
                    fontSize: 13,
                    padding: "0 6px",
                    transform: isOpen ? "rotate(180deg)" : "none",
                    transition: "transform .15s",
                  }}
                >
                  ⌄
                </span>
                <button
                  className="dbtn"
                  onClick={(e) => {
                    e.stopPropagation();
                    delLoc(l.id);
                  }}
                >
                  ✕
                </button>
              </div>

              {isOpen && (
                <div
                  style={{
                    background: "var(--surface2)",
                    borderRadius: 12,
                    padding: total ? "10px 12px" : "18px 12px",
                    marginTop: 4,
                  }}
                >
                  {total === 0 && (
                    <div
                      style={{
                        textAlign: "center",
                        fontSize: 12,
                        color: "var(--text3)",
                      }}
                    >
                      В этом месте пока ничего не хранится
                    </div>
                  )}
                  {threads.map((t) => {
                    const qty = tStocks[t.id] || 0;
                    return (
                      <div
                        key={t.id}
                        className="loc-item-row"
                        onClick={() => nav(`/threads/${t.id}`)}
                      >
                        <Dot hex={t.hex} size={26} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 12.5,
                              fontWeight: 500,
                              color: "var(--text)",
                            }}
                          >
                            {t.brand} {t.article}
                          </div>
                          {t.name_ru && (
                            <div
                              style={{ fontSize: 11, color: "var(--text3)" }}
                            >
                              {t.name_ru}
                            </div>
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: 11.5,
                            color: "var(--text2)",
                            flexShrink: 0,
                          }}
                        >
                          {fmtQ(qty)} мот.
                        </span>
                      </div>
                    );
                  })}
                  {beads.map((b) => {
                    const qty = bStocks[b.id] || 0;
                    return (
                      <div
                        key={b.id}
                        className="loc-item-row"
                        onClick={() => nav(`/beads/${b.id}`)}
                      >
                        <Dot hex={b.hex} size={26} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 12.5,
                              fontWeight: 500,
                              color: "var(--text)",
                            }}
                          >
                            {b.brand} {b.article}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--text3)" }}>
                            {b.name}
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: 11.5,
                            color: "var(--text2)",
                            flexShrink: 0,
                          }}
                        >
                          {qty} г
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
