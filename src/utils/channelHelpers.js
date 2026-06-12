// Derives the regional-indicator flag emoji from a 2-letter ISO country code.
export function flagFromCountryCode(code) {
  if (!code || code.length !== 2) return '';
  const upper = code.toUpperCase();
  return [...upper].map((c) => String.fromCodePoint(0x1f1a5 + c.charCodeAt(0))).join('');
}

// Deterministic hue (0-359) derived from a channel id, used for the
// gradient monogram since real channels carry no "hue" field.
export function hueFromId(id) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

// First letters of the first two words of a channel name, e.g. "BBC News" -> "BN".
export function initialsFromName(name) {
  const words = (name || '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// Buckets a raw stream "quality" value (e.g. "1080p") into a short label.
export function qualityBucket(quality) {
  if (!quality) return '';
  const q = String(quality);
  if (q.includes('2160') || /4k/i.test(q)) return '4K';
  if (q.includes('1080')) return 'FHD';
  if (q.includes('720')) return 'HD';
  return q;
}

// Projects a lat/lng pair onto the world-dots.svg map (percent offsets).
export function mapPos(lng, lat) {
  return { left: (lng + 180) / 360 * 100, top: (80 - lat) / 138 * 100 };
}
