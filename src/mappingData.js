import raw from './dmc_gamma_map.json';

// raw: [{dmc_article, gamma_article, color_hex, color_name, match_quality, anchor_article, madeira_article}, ...]
// This is a many-to-many mapping (one DMC article can have several Gamma matches and vice versa),
// so we group entries by dmc_article and by gamma_article for fast lookup.

export const MAP_ENTRIES = raw;

export const byDmc = {};
export const byGamma = {};

raw.forEach((e) => {
  if (e.dmc_article) {
    (byDmc[e.dmc_article] ||= []).push(e);
  }
  if (e.gamma_article) {
    (byGamma[e.gamma_article] ||= []).push(e);
  }
});

// sort matches: exact first, then approximate/close, keep stable order otherwise
const qRank = { exact: 0, close: 1, approximate: 2 };
Object.values(byDmc).forEach((list) => list.sort((a, b) => (qRank[a.match_quality] ?? 9) - (qRank[b.match_quality] ?? 9)));
Object.values(byGamma).forEach((list) => list.sort((a, b) => (qRank[a.match_quality] ?? 9) - (qRank[b.match_quality] ?? 9)));

export function findByArticle(article) {
  const v = article.trim().toLowerCase();
  if (byDmc[article]) return { from: 'dmc', article, matches: byDmc[article] };
  if (byGamma[article]) return { from: 'gamma', article, matches: byGamma[article] };
  // try case-insensitive
  const dmcKey = Object.keys(byDmc).find((k) => k.toLowerCase() === v);
  if (dmcKey) return { from: 'dmc', article: dmcKey, matches: byDmc[dmcKey] };
  const gaKey = Object.keys(byGamma).find((k) => k.toLowerCase() === v);
  if (gaKey) return { from: 'gamma', article: gaKey, matches: byGamma[gaKey] };
  return null;
}
