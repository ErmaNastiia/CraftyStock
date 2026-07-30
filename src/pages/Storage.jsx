import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DMC, GAMMA, ANCHOR, MADEIRA, BEADS } from "../catalogData";
import { useAppState } from "../StateContext";
import { fmtQ } from "../helpers";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import ColorSwatchGrid from "../components/ui/ColorSwatchGrid";
import EmptyState from "../components/ui/EmptyState";
import CompactRow from "../components/ui/CompactRow";
import SectionLabel from "../components/ui/SectionLabel";
import { IconPackage, IconPlus, IconChevronDown, IconX } from "../components/ui/icons";

const ALL_THREADS = [...DMC, ...GAMMA, ...ANCHOR, ...MADEIRA];
const FCOLS = ["#4A90D9", "#E5534B", "#2FA85F", "#B07FD4", "#F5A623", "#50C8C6", "#D4AC0D", "#888888"];

export default function Storage() {
  const { locs, addLoc, delLoc, tLocMap, bLocMap, tStocks, bStocks } = useAppState();
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
      <PageHeader
        title="Хранение"
        action={
          <Button variant="primary" size="sm" icon={<IconPlus size={14} strokeWidth={2.25} />} onClick={() => setOpen((o) => !o)}>
            Добавить
          </Button>
        }
      />
      {open && (
        <div className="storage-form-wrap">
          <Card>
            <div className="storage-form-title">Новое место хранения</div>
            <input className="fi" placeholder="Синяя коробка IKEA" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="fi" placeholder="Верхняя полка (необязательно)" value={desc} onChange={(e) => setDesc(e.target.value)} />
            <SectionLabel>Цвет-метка</SectionLabel>
            <ColorSwatchGrid colors={FCOLS} value={color} onChange={setColor} size={30} />
            <div className="storage-form-actions">
              <Button variant="ghost" onClick={() => setOpen(false)}>Отмена</Button>
              <Button variant="primary" onClick={save}>Сохранить</Button>
            </div>
          </Card>
        </div>
      )}
      <div className="sa">
        {!locs.length && (
          <EmptyState icon={<IconPackage size={34} />} title="Нет мест хранения" subtitle="Добавь коробку, полку или ящик" />
        )}
        {locs.map((l) => {
          const { threads, beads } = itemsFor(l.id);
          const total = threads.length + beads.length;
          const isOpen = expanded === l.id;
          return (
            <div key={l.id} className="storage-loc">
              <div className="stcard" onClick={() => setExpanded(isOpen ? null : l.id)}>
                <div className="stbar" style={{ background: l.color }} />
                <div className="stbody">
                  <div className="stbox" style={{ background: l.color + "22", color: l.color }}>
                    <IconPackage size={20} strokeWidth={1.7} />
                  </div>
                  <div className="row-main">
                    <div className="storage-loc-name">{l.name}</div>
                    {l.desc && <div className="storage-loc-desc">{l.desc}</div>}
                    <div className="storage-loc-count">
                      {total === 0 ? "Пусто" : `${threads.length} ниток, ${beads.length} видов бисера`}
                    </div>
                  </div>
                </div>
                <span className={`storage-loc-chevron${isOpen ? " open" : ""}`}>
                  <IconChevronDown size={15} />
                </span>
                <button className="dbtn" onClick={(e) => { e.stopPropagation(); delLoc(l.id); }}>
                  <IconX size={15} />
                </button>
              </div>

              {isOpen && (
                <div className="storage-loc-expanded" style={{ padding: total ? undefined : "18px 12px" }}>
                  {total === 0 && (
                    <div className="storage-loc-empty">В этом месте пока ничего не хранится</div>
                  )}
                  {threads.map((t) => (
                    <CompactRow
                      key={t.id}
                      swatchHex={t.hex}
                      title={`${t.brand} ${t.article}`}
                      subtitle={t.name_ru}
                      right={`${fmtQ(tStocks[t.id] || 0)} мот.`}
                      onClick={() => nav(`/threads/${t.id}`)}
                    />
                  ))}
                  {beads.map((b) => (
                    <CompactRow
                      key={b.id}
                      swatchHex={b.hex}
                      title={`${b.brand} ${b.article}`}
                      subtitle={b.name}
                      right={`${bStocks[b.id] || 0} г`}
                      onClick={() => nav(`/beads/${b.id}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
