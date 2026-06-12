import { useMemo } from 'react';
import { Reveal } from '../components/atoms';
import { Rail, HeroSpotlight, FeaturedCard, RecentCard, PosterCard, SectionHeader } from '../components/cards';
import { navigate } from '../router';

export function HomePage({ data, fav, toggleFav, recent, onOpen }) {
  const { channels, categories, streamIndex } = data;

  const playable = useMemo(
    () => channels.filter((ch) => (streamIndex[ch.id] || []).length > 0),
    [channels, streamIndex],
  );

  const byCategory = (id) => playable.filter((ch) => ch.categories.includes(id));

  const featuredPool = useMemo(
    () => playable.filter((ch) => ch.countryName && ch.catName).slice().sort((a, b) => a.hue - b.hue),
    [playable],
  );
  const spotlight = featuredPool.slice(0, 6);
  const featuredRail = featuredPool.slice(6, 18);

  const recentChannels = useMemo(
    () => recent.map((id) => channels.find((c) => c.id === id)).filter(Boolean),
    [recent, channels],
  );

  const sportsChannels = useMemo(() => byCategory('sports').slice(0, 12), [playable]);
  const newsChannels = useMemo(() => byCategory('news').slice(0, 12), [playable]);

  const otherRails = useMemo(() => {
    const counts = categories
      .filter((c) => c.id !== 'sports' && c.id !== 'news')
      .map((c) => ({ cat: c, chans: byCategory(c.id) }))
      .filter((x) => x.chans.length >= 6)
      .sort((a, b) => b.chans.length - a.chans.length)
      .slice(0, 4);
    return counts;
  }, [categories, playable]);

  return (
    <div className="page">
      {spotlight.length > 0 && (
        <Reveal y={14}>
          <HeroSpotlight items={spotlight} onOpen={onOpen} fav={fav} toggleFav={toggleFav} />
        </Reveal>
      )}

      {recentChannels.length > 0 && (
        <Reveal delay={90} className="block">
          <SectionHeader title="Continue watching" sub="Pick up where you left off" />
          <Rail>
            {recentChannels.map((ch) => <RecentCard key={ch.id} ch={ch} onOpen={onOpen} />)}
          </Rail>
        </Reveal>
      )}

      {sportsChannels.length > 0 && (
        <Reveal delay={110} className="block">
          <SectionHeader title="Sports Live" sub={`${sportsChannels.length} channels broadcasting now`} icon="trophy" action="See all" onAction={() => navigate('/category/sports')} />
          <Rail>
            {sportsChannels.map((ch) => <div key={ch.id} style={{ width: 168, flex: '0 0 auto' }}><PosterCard ch={ch} onOpen={onOpen} /></div>)}
          </Rail>
        </Reveal>
      )}

      {newsChannels.length > 0 && (
        <Reveal delay={120} className="block">
          <SectionHeader title="News Live" sub={`${newsChannels.length} channels broadcasting now`} icon="signal" action="See all" onAction={() => navigate('/category/news')} />
          <Rail>
            {newsChannels.map((ch) => <div key={ch.id} style={{ width: 168, flex: '0 0 auto' }}><PosterCard ch={ch} onOpen={onOpen} /></div>)}
          </Rail>
        </Reveal>
      )}

      {featuredRail.length > 0 && (
        <Reveal delay={130} className="block">
          <SectionHeader title="Featured channels" sub="A mix of channels to get you started" />
          <Rail className="top10row">
            {featuredRail.map((ch, i) => <FeaturedCard key={ch.id} ch={ch} rank={i + 1} onOpen={onOpen} />)}
          </Rail>
        </Reveal>
      )}

      <Reveal delay={150} className="block">
        <SectionHeader title="Browse by category" />
        <Rail className="chips">
          {categories.map((c) => (
            <button key={c.id} className="catchip glasschip" onClick={() => navigate(`/category/${c.id}`)}>
              <span className="dot" style={{ background: `oklch(0.68 0.17 ${c.hue})`, boxShadow: `0 0 8px oklch(0.68 0.17 ${c.hue})` }} />
              {c.name}
            </button>
          ))}
        </Rail>
      </Reveal>

      {otherRails.map(({ cat, chans }) => (
        <Reveal key={cat.id} delay={120} className="block">
          <SectionHeader title={cat.name} sub={`${chans.length} live channels`} action="See all" onAction={() => navigate(`/category/${cat.id}`)} />
          <Rail>
            {chans.slice(0, 10).map((ch) => <div key={ch.id} style={{ width: 168, flex: '0 0 auto' }}><PosterCard ch={ch} onOpen={onOpen} /></div>)}
          </Rail>
        </Reveal>
      ))}
      <div style={{ height: 40 }} />
    </div>
  );
}
