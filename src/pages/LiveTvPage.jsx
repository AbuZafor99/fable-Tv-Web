import { useState, useMemo } from 'react';
import { Icon } from '../components/atoms';
import { PosterCard, ChannelRow } from '../components/cards';

const PAGE_SIZE = 60;

export function LiveTvPage({ data, onOpen }) {
  const { channels, categories, streamIndex } = data;
  const [catId, setCatId] = useState('all');
  const [grid, setGrid] = useState(true);
  const [limit, setLimit] = useState(PAGE_SIZE);

  const playable = useMemo(
    () => channels.filter((ch) => (streamIndex[ch.id] || []).length > 0),
    [channels, streamIndex],
  );
  const list = useMemo(
    () => (catId === 'all' ? playable : playable.filter((ch) => ch.categories.includes(catId))),
    [playable, catId],
  );

  const [prevCatId, setPrevCatId] = useState(catId);
  if (catId !== prevCatId) {
    setPrevCatId(catId);
    setLimit(PAGE_SIZE);
  }

  return (
    <div className="page">
      <div className="pagehead">
        <div>
          <h1 className="pagetitle">Live TV</h1>
          <p className="pagesub">{list.length} channels broadcasting now</p>
        </div>
        <span className="seg">
          <button data-on={grid ? 1 : 0} onClick={() => setGrid(true)}><Icon name="grid" size={15} /></button>
          <button data-on={!grid ? 1 : 0} onClick={() => setGrid(false)}><Icon name="list" size={15} /></button>
        </span>
      </div>

      <div className="filterbar">
        <button className={'catchip' + (catId === 'all' ? ' on' : '')} onClick={() => setCatId('all')}>All channels</button>
        {categories.map((c) => (
          <button key={c.id} className={'catchip' + (catId === c.id ? ' on' : '')} onClick={() => setCatId(c.id)}>
            <span className="dot" style={{ background: `oklch(0.65 0.16 ${c.hue})` }} />{c.name}
          </button>
        ))}
      </div>

      <div className="block">
        {grid ? (
          <div className="postergrid">
            {list.slice(0, limit).map((ch) => <PosterCard key={ch.id} ch={ch} onOpen={onOpen} />)}
          </div>
        ) : (
          <div className="vlist twocol">
            {list.slice(0, limit).map((ch) => <ChannelRow key={ch.id} ch={ch} onOpen={onOpen} />)}
          </div>
        )}
        {list.length > limit && (
          <button className="ghostbtn" style={{ marginTop: 20 }} onClick={() => setLimit((l) => l + PAGE_SIZE)}>Load more</button>
        )}
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}
