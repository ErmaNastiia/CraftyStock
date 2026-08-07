export function isLight(hex) {
  try {
    const c = hex.replace('#', '');
    return (parseInt(c.slice(0, 2), 16) * 299 + parseInt(c.slice(2, 4), 16) * 587 + parseInt(c.slice(4, 6), 16) * 114) / 1000 > 175;
  } catch {
    return true;
  }
}

function parseHex(h) {
  const c = h.replace('#', '');
  return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
}

export function hdist(h1, h2) {
  try {
    const [r1, g1, b1] = parseHex(h1);
    const [r2, g2, b2] = parseHex(h2);
    const dr = (r1 - r2) * 0.3, dg = (g1 - g2) * 0.59, db = (b1 - b2) * 0.11;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  } catch {
    return 999;
  }
}

const MXD = hdist('#000000', '#ffffff');
export function pct(h1, h2) {
  return Math.round((1 - hdist(h1, h2) / MXD) * 100);
}

export function fmtQ(v) {
  return v % 1 === 0 ? String(v) : v.toFixed(1);
}

// Triggers a browser download of `content` as a file named `name`.
export function dlFile(name, content, type = 'text/plain') {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

// Splits a free-form block of text into individual article numbers.
// Accepts commas, semicolons, whitespace and newlines as separators, and
// de-duplicates while preserving the first-seen order.
// Downscales + re-encodes an image file client-side before it's uploaded —
// phone camera photos are routinely 4-12MB, which is slow to upload and
// wasteful to store for something that only needs to look good at swatch
// size. Draws onto a canvas capped at `maxDim` on the long edge and
// re-exports as JPEG. Resolves to a Blob ready to hand to Storage.
export function compressImage(file, { maxDim = 1280, quality = 0.82 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type || !file.type.startsWith('image/')) {
      reject(new Error('not-an-image'));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const scale = maxDim / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (blob) resolve(blob);
          else reject(new Error('compress-failed'));
        },
        'image/jpeg',
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('image-load-failed'));
    };
    img.src = url;
  });
}

export function parseArticleList(raw) {
  const seen = new Set();
  const out = [];
  raw
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((s) => {
      const key = s.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        out.push(s);
      }
    });
  return out;
}
