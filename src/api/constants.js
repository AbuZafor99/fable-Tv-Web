export const IPTV_ORG_BASE = 'https://iptv-org.github.io/api';
export const RAW_GITHUB_BASE = 'https://raw.githubusercontent.com';

export const ENDPOINTS = {
  channels: `${IPTV_ORG_BASE}/channels.json`,
  streams: `${IPTV_ORG_BASE}/streams.json`,
  categories: `${IPTV_ORG_BASE}/categories.json`,
  countries: `${IPTV_ORG_BASE}/countries.json`,
};

export const BD_PLAYLISTS = {
  shadmanIslam: `${RAW_GITHUB_BASE}/Shadmanislam/bdiptv/master/BD%20IPTV.m3u`,
  mrgifyBdix: `${RAW_GITHUB_BASE}/abusaeeidx/Mrgify-BDIX-IPTV/main/playlist.m3u`,
  bundledExtra: '/data/bangla_extra.m3u',
};
