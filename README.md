# Fable TV — Web

Fable TV is a free live-TV web app built with React + Vite. It streams real channels
via [hls.js](https://github.com/video-dev/hls.js), sourced from the
[iptv-org](https://github.com/iptv-org/iptv) public channel/stream database plus
community Bangladesh M3U playlists.

## Features

- Home with a rotating spotlight, featured channels, "Sports Live" / "News Live" rails
  and per-category rails
- Discover — interactive world map of countries with live channel counts
- Live TV — filterable grid/list of all playable channels
- Search by channel, country or category
- Favorites and recently-watched, persisted in `localStorage`
- Player with hls.js playback, volume/brightness controls, server switcher,
  native fullscreen and Picture-in-Picture

## Tech stack

- React 18 + Vite
- Plain CSS (`src/styles/global.css`)
- hls.js for `.m3u8` playback
- Custom hash-based router (no external router dependency)

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build into dist/
npm run preview  # preview the production build
npm run lint     # eslint
```

## Data sources

All channel, stream, category and country data is fetched client-side from the
[iptv-org](https://github.com/iptv-org/iptv) API and cached in `localStorage`
(see `src/api/`).
