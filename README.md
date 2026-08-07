# CraftyStock — React version

Single-page React app (React Router, one window) are routes rendered inside one persistent layout with a
sidebar — like the web version, but running as a real React app instead of
manual DOM string-building.

The DMC↔Gamma converter and the "Аналоги" section on each thread's detail
page now use your accurate `dmc_gamma_map.json` (595 entries, many-to-many,
with Anchor/Madeira cross-references) instead of the old hardcoded 30-entry
table.

## Run it

```bash
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

#
