import { useState, useMemo } from 'react';
import { Icon } from '../components/atoms';
import { PosterCard, ChannelRow } from '../components/cards';
import { navigate } from '../router';

const PAGE_SIZE = 60;

export function CategoryPage({ data, categoryId, onOpen }) {
  const { channels, categories } = data;
  const cat = categories.find((c) => c.id === categoryId);
  const list = useMemo(() => channels.filter((ch) => ch.categories.includes(categoryId)), [channels, categoryId]);
  const [grid, setGrid] = useState(true);
  const [limit, setLimit] = useState(PAGE_SIZE);

  const [prevCategoryId, setPrevCategoryId] = useState(categoryId);
  if (categoryId !== prevCategoryId) {
    setPrevCategoryId(categoryId);
    setLimit(PAGE_SIZE);
  }

  if (!cat) {
    return (
      <div className="page">
        <div className="errorbox">
          <Icon name="info" size={32} />
          <div>Category not found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="pagehead">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span className="catbadge" style={{ background: `linear-gradient(150deg, oklch(0.6 0.17 ${cat.hue}), oklch(0.42 0.15 ${(cat.hue + 40) % 360}))` }}>
            <Icon name="tv" size={22} />
          </span>
          <div>
            <h1 className="pagetitle">{cat.name}</h1>
            <p className="pagesub">{list.length} live channels</p>
          </div>
        </div>
        <span className="seg">
          <button data-on={grid ? 1 : 0} onClick={() => setGrid(true)}><Icon name="grid" size={15} /></button>
          <button data-on={!grid ? 1 : 0} onClick={() => setGrid(false)}><Icon name="list" size={15} /></button>
        </span>
      </div>

      <div className="filterbar">
        {categories.map((c) => (
          <button key={c.id} className={'catchip' + (c.id === categoryId ? ' on' : '')} onClick={() => navigate(`/category/${c.id}`)}>
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
