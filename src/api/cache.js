// localStorage cache with a data-version + 24h TTL, mirroring
// flutter_iptv's ChannelCacheService/CacheConstants (cacheTtl=24h, dataVersion=2).
const DATA_VERSION = 2;
const CACHE_TTL = 24 * 60 * 60 * 1000;

export function getCached(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.v !== DATA_VERSION) return null;
    if (Date.now() - parsed.t > CACHE_TTL) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

export function setCached(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ v: DATA_VERSION, t: Date.now(), data }));
  } catch {
    // storage full or unavailable — skip caching
  }
}
