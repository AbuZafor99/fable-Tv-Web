import { useState, useEffect, useCallback } from 'react';
import { loadAll } from './dataStore';

let dataPromise = null;

// Loads the joined channel/category/country/stream data once per session
// and shares it across every component that calls this hook.
export function useChannelData() {
  const [state, setState] = useState({ loading: true, error: null, data: null });

  useEffect(() => {
    if (!dataPromise) dataPromise = loadAll();
    let cancelled = false;
    dataPromise.then(
      (data) => { if (!cancelled) setState({ loading: false, error: null, data }); },
      (error) => { if (!cancelled) setState({ loading: false, error, data: null }); },
    );
    return () => { cancelled = true; };
  }, []);

  return state;
}

const FAV_KEY = 'fable_fav';

export function useFavorites() {
  const [fav, setFav] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY)) || []); } catch { return new Set(); }
  });

  useEffect(() => {
    try { localStorage.setItem(FAV_KEY, JSON.stringify([...fav])); } catch { /* ignore */ }
  }, [fav]);

  const toggleFav = useCallback((id) => {
    setFav((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  return [fav, toggleFav];
}

const RECENT_KEY = 'fable_recent';
const MAX_RECENT = 10;

export function useRecent() {
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; } catch { return []; }
  });

  const addRecent = useCallback((id) => {
    setRecent((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, MAX_RECENT);
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  return [recent, addRecent];
}
