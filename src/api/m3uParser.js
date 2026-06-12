import { flagFromCountryCode } from '../utils/channelHelpers';

const ATTR_PATTERN = /([a-zA-Z0-9_-]+)="([^"]*)"/g;

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Parses a basic M3U/M3U8 playlist into channel objects. Each entry's stream
// URL is stored directly on the channel since these playlists bundle the
// channel and its stream together (unlike the iptv-org channels/streams split).
export function parseM3uPlaylist(content, { idPrefix, country = '' }) {
  const channels = [];
  let pendingName = null;
  let pendingLogo = null;
  let pendingCategories = [];

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith('#EXTINF')) {
      const commaIndex = line.lastIndexOf(',');
      if (commaIndex === -1) continue;
      const name = line.slice(commaIndex + 1).trim();
      if (!name) {
        pendingName = null;
        continue;
      }
      const attrsPart = line.slice(0, commaIndex);
      const attrs = {};
      for (const m of attrsPart.matchAll(ATTR_PATTERN)) {
        attrs[m[1].toLowerCase()] = m[2];
      }
      pendingName = name;
      pendingLogo = attrs['tvg-logo'] || '';
      const group = (attrs['group-title'] || '').trim();
      pendingCategories = group ? [group] : [];
      continue;
    }

    if (line.startsWith('#')) continue;
    if (pendingName === null) continue;

    channels.push({
      id: `${idPrefix}${slugify(pendingName)}`,
      name: pendingName,
      country,
      countryFlag: country ? flagFromCountryCode(country) : '',
      categories: pendingCategories,
      logoUrl: pendingLogo || '',
      streamUrl: line,
    });

    pendingName = null;
    pendingLogo = null;
    pendingCategories = [];
  }

  return channels;
}
