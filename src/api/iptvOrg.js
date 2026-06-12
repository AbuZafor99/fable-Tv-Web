import { ENDPOINTS, BD_PLAYLISTS } from './constants';
import { parseM3uPlaylist } from './m3uParser';
import { countryCentroid } from './countryCentroids';

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

function normalizeChannel(json) {
  return {
    id: json.id || '',
    name: json.name || '',
    altNames: json.alt_names || [],
    country: (json.country || '').toUpperCase(),
    countryName: '',
    countryFlag: '',
    categories: json.categories || [],
    logoUrl: json.logo || '',
    website: json.website || '',
    isNsfw: json.is_nsfw === true,
    network: json.network || '',
    streamUrl: '',
  };
}

export async function fetchChannels() {
  const data = await fetchJson(ENDPOINTS.channels);
  return data.map(normalizeChannel).filter((c) => !c.isNsfw && c.id.length > 0);
}

function normalizeStream(json) {
  return {
    channelId: json.channel || '',
    url: json.url || '',
    quality: json.quality || '',
    label: json.label || json.title || '',
    userAgent: json.user_agent || '',
    referrer: json.referrer || json.http_referrer || '',
    isBroken: json.is_broken === true,
  };
}

export async function fetchStreams() {
  const data = await fetchJson(ENDPOINTS.streams);
  return data
    .map(normalizeStream)
    .filter((s) => !s.isBroken && s.url && s.channelId);
}

export async function fetchCategories() {
  const data = await fetchJson(ENDPOINTS.categories);
  return data
    .map((c) => ({ id: c.id || '', name: c.name || '' }))
    .filter((c) => c.id && c.id !== 'xxx');
}

export async function fetchCountries() {
  const data = await fetchJson(ENDPOINTS.countries);
  return data.map((c) => {
    const code = (c.code || '').toUpperCase();
    const centroid = countryCentroid(code);
    return {
      code,
      name: c.name || '',
      flag: c.flag || '',
      lat: typeof c.lat === 'number' ? c.lat : centroid?.lat ?? 0,
      lng: typeof c.lng === 'number' ? c.lng : centroid?.lng ?? 0,
    };
  });
}

async function fetchBdPlaylist(url, idPrefix) {
  try {
    const text = await fetchText(url);
    return parseM3uPlaylist(text, { idPrefix, country: 'BD' });
  } catch {
    return [];
  }
}

// Fetches Bangladesh-focused community M3U playlists and the bundled extra
// channel list, deduping by id (last source wins).
export async function fetchBdChannels() {
  const [shadman, mrgify, extra] = await Promise.all([
    fetchBdPlaylist(BD_PLAYLISTS.shadmanIslam, 'bd-'),
    fetchBdPlaylist(BD_PLAYLISTS.mrgifyBdix, 'bd-'),
    fetchBdPlaylist(BD_PLAYLISTS.bundledExtra, 'bd-extra-'),
  ]);
  const byId = new Map();
  for (const ch of [...shadman, ...mrgify, ...extra]) {
    byId.set(ch.id, { ...normalizeChannel({}), ...ch, isNsfw: false });
  }
  return [...byId.values()];
}
