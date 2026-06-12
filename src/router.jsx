import { useState, useEffect } from 'react';

// Parses the URL hash into a route descriptor.
// Supported routes: /, /discover, /live, /search, /favorites,
// /category/:id, /watch/:id
function parseHash() {
  const raw = window.location.hash.slice(1) || '/';
  const [path, queryString] = raw.split('?');
  const parts = path.split('/').filter(Boolean);
  const query = Object.fromEntries(new URLSearchParams(queryString || ''));

  if (parts.length === 0) return { name: 'home', params: {}, query };
  if (parts[0] === 'discover') return { name: 'discover', params: {}, query };
  if (parts[0] === 'live') return { name: 'live', params: {}, query };
  if (parts[0] === 'search') return { name: 'search', params: {}, query };
  if (parts[0] === 'favorites') return { name: 'favorites', params: {}, query };
  if (parts[0] === 'category' && parts[1]) return { name: 'category', params: { id: parts[1] }, query };
  if (parts[0] === 'watch' && parts[1]) return { name: 'watch', params: { id: parts[1] }, query };
  return { name: 'home', params: {}, query };
}

export function useHashRoute() {
  const [route, setRoute] = useState(parseHash);
  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export function navigate(path) {
  window.location.hash = path;
}
