import { useState, useMemo } from 'react';
import { Icon } from '../components/atoms';
import { PosterCard, ChannelRow } from '../components/cards';

const SUGGESTIONS = ['Sports', 'News', 'Movies', 'Music', 'Kids', 'Documentary'];
const PAGE_SIZE = 60;

export function SearchPage({ data, onOpen, initialQuery }) {
  const { channels, categories } = data;
  const [q, setQ] = useState(initialQuery || '');
  const [activeCat, setActiveCat] = useState(null);
  const [grid, setGrid] = useState(true);
  const [limit, setLimit] = useState(PAGE_SIZE);

  const results = useMemo(() => {
    let list = channels;
    if (activeCat) list = list.filter((c) => c.categories.includes(activeCat));
    const t = q.trim().toLowerCase();
    if (t) {
      list = list.filter((c) =>
        c.name.toLowerCase().includes(t) ||
        c.countryName.toLowerCase().includes(t) ||
        c.catName.toLowerCase().includes(t) ||
        c.country.toLowerCase() === t);
    }
    return list;
  }, [q, activeCat, channels]);

  const [prevFilterKey, setPrevFilterKey] = useState(`${q}|${activeCat}`);
  const filterKey = `${q}|${activeCat}`;
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setLimit(PAGE_SIZE);
  }

  return (
    <div className="page">
      <div className="pagehead">
        <div>
          <h1 className="pagetitle">Search</h1>
          <p className="pagesub">Find channels, countries and genres</p>
        </div>
      </div>

      <div className="searchfield big">
        <Icon name="search" size={21} style={{ color: 'var(--faint)' }} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search channels, countries, genres…" autoFocus />
        {q && <button className="clearx" onClick={() => setQ('')}><Icon name="close" size={16} /></button>}
      </div>

      <div className="filterbar">
        <button className={'catchip' + (!activeCat ? ' on' : '')} onClick={() => setActiveCat(null)}>All</button>
        {categories.map((c) => (
          <button key={c.id} className={'catchip' + (activeCat === c.id ? ' on' : '')} onClick={() => setActiveCat(activeCat === c.id ? null : c.id)}>
            <span className="dot" style={{ background: `oklch(0.65 0.16 ${c.hue})` }} />{c.name}
          </button>
        ))}
      </div>

      {!q.trim() && !activeCat && (
        <div className="block">
          <div className="sectsub" style={{ marginBottom: 10 }}>POPULAR SEARCHES</div>
          <div className="filterbar">
            {SUGGESTIONS.map((s) => <button key={s} className="catchip" onClick={() => setQ(s)}><Icon name="search" size={13} />{s}</button>)}
          </div>
        </div>
      )}

      <div className="block">
        <div className="resultbar">
          <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>{results.length} channels</span>
          <span className="seg">
            <button data-on={grid ? 1 : 0} onClick={() => setGrid(true)}><Icon name="grid" size={15} /></button>
            <button data-on={!grid ? 1 : 0} onClick={() => setGrid(false)}><Icon name="list" size={15} /></button>
          </span>
        </div>
        {grid ? (
          <div className="postergrid">
            {results.slice(0, limit).map((ch) => <PosterCard key={ch.id} ch={ch} onOpen={onOpen} />)}
          </div>
        ) : (
          <div className="vlist twocol">
            {results.slice(0, limit).map((ch) => <ChannelRow key={ch.id} ch={ch} onOpen={onOpen} />)}
          </div>
        )}
        {results.length > limit && (
          <button className="ghostbtn" style={{ marginTop: 20 }} onClick={() => setLimit((l) => l + PAGE_SIZE)}>Load more</button>
        )}
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}
