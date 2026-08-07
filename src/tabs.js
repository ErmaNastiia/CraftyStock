// Split out of catalogData.js on purpose: Sidebar needs this immediately
// (it renders right after login), but the rest of catalogData.js is ~230KB
// of DMC/Gamma/beads reference data that should only load once someone
// actually navigates into a page that needs it. Keeping TABS in its own
// tiny file means Sidebar never pulls the big file into the eager bundle.
export const TABS = [
  { id: "threads", label: "Нитки", icon: "thread" },
  { id: "beads", label: "Бисер", icon: "bead" },
  { id: "converter", label: "Конвертер", icon: "shuffle" },
  { id: "storage", label: "Хранение", icon: "package" },
  { id: "settings", label: "Настройки", icon: "settings" },
];
