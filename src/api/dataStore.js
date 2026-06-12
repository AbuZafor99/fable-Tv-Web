import { fetchChannels, fetchStreams, fetchCategories, fetchCountries, fetchBdChannels } from './iptvOrg';
import { getCached, setCached } from './cache';
import { hueFromId, initialsFromName, qualityBucket } from '../utils/channelHelpers';

const CACHE_KEYS = { categories: 'fable_categories', countries: 'fable_countries' };

async function loadCategories() {
  const cached = getCached(CACHE_KEYS.categories);
  if (cached) return cached;
  const data = await fetchCategories();
  setCached(CACHE_KEYS.categories, data);
  return data;
}

async function loadCountries() {
  const cached = getCached(CACHE_KEYS.countries);
  if (cached) return cached;
  const data = await fetchCountries();
  setCached(CACHE_KEYS.countries, data);
  return data;
}

// Fetches and joins iptv-org channels/streams/categories/countries plus the
// Bangladesh M3U playlists into the shape the UI consumes.
export async function loadAll() {
  const [orgChannels, bdChannels, streams, categories, countries] = await Promise.all([
    fetchChannels(),
    fetchBdChannels(),
    fetchStreams(),
    loadCategories(),
    loadCountries(),
  ]);

  const countryMap = new Map(countries.map((c) => [c.code, c]));
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const streamIndex = {};
  for (const s of streams) {
    (streamIndex[s.channelId] ??= []).push({
      url: s.url,
      quality: s.quality,
      label: s.label,
      userAgent: s.userAgent,
      referrer: s.referrer,
    });
  }

  const channelsById = new Map();
  for (const ch of orgChannels) channelsById.set(ch.id, ch);
  for (const ch of bdChannels) channelsById.set(ch.id, ch);

  const channels = [];
  for (const ch of channelsById.values()) {
    if (ch.streamUrl) {
      (streamIndex[ch.id] ??= []).unshift({
        url: ch.streamUrl,
        quality: '',
        label: 'Default',
        userAgent: '',
        referrer: '',
      });
    }
    const chStreams = streamIndex[ch.id] || [];
    const country = countryMap.get(ch.country);
    const catId = ch.categories[0] || '';
    const category = categoryMap.get(catId);

    channels.push({
      ...ch,
      countryName: country?.name || ch.countryName || '',
      countryFlag: country?.flag || ch.countryFlag || '',
      hue: hueFromId(ch.id),
      initials: initialsFromName(ch.name),
      cat: catId,
      catName: category?.name || catId,
      res: qualityBucket(chStreams[0]?.quality),
    });
  }

  const categoriesWithHue = categories.map((c) => ({ ...c, hue: hueFromId(c.id) }));

  const channelCountByCountry = {};
  for (const ch of channels) {
    if (ch.country) channelCountByCountry[ch.country] = (channelCountByCountry[ch.country] || 0) + 1;
  }
  const countriesWithCounts = countries
    .map((c) => ({ ...c, count: channelCountByCountry[c.code] || 0 }))
    .filter((c) => c.count > 0);

  return { channels, categories: categoriesWithHue, countries: countriesWithCounts, streamIndex };
}
