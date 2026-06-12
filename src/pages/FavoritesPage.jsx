import { useMemo } from 'react';
import { Icon, Reveal } from '../components/atoms';
import { Rail, PosterCard, SectionHeader } from '../components/cards';

export function FavoritesPage({ data, fav, toggleFav, onOpen }) {
  const { channels, streamIndex } = data;

  const favChannels = useMemo(() => channels.filter((c) => fav.has(c.id)), [channels, fav]);
  const suggested = useMemo(() => {
    return channels
      .filter((c) => !fav.has(c.id) && (streamIndex[c.id] || []).length > 0)
      .slice()
      .sort((a, b) => a.hue - b.hue)
      .slice(0, 12);
  }, [channels, fav, streamIndex]);

  return (
    <div className="page">
      <div className="pagehead">
        <div>
          <h1 className="pagetitle">Favorites</h1>
          <p className="pagesub">{favChannels.length} saved channel{favChannels.length === 1 ? '' : 's'}</p>
        </div>
      </div>

      {favChannels.length === 0 ? (
        <div className="emptyfav">
          <div className="emptyicon"><Icon name="heart" size={34} /></div>
          <div className="emptytitle">No favorites yet</div>
          <div className="emptysub">Tap the star on any channel to keep it here for quick access.</div>
        </div>
      ) : (
        <div className="postergrid">
          {favChannels.map((ch) => (
            <div key={ch.id} className="favwrap">
              <PosterCard ch={ch} onOpen={onOpen} />
              <button className="favstar on" onClick={() => toggleFav(ch.id)} title="Remove"><Icon name="starfill" size={16} /></button>
            </div>
          ))}
        </div>
      )}

      <Reveal delay={120} className="block">
        <SectionHeader title="Suggested for you" sub="Channels you might like" />
        <Rail>
          {suggested.map((ch) => <div key={ch.id} style={{ width: 168, flex: '0 0 auto' }}><PosterCard ch={ch} onOpen={onOpen} /></div>)}
        </Rail>
      </Reveal>
      <div style={{ height: 40 }} />
    </div>
  );
}
