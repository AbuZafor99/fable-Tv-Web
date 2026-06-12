import { useState, useEffect, useRef } from 'react';
import { Icon, Logo, LiveDot, CodeBadge, MiniEq, Thumb } from './atoms';

// Horizontal rail with hover scroll arrows.
export function Rail({ children, className = '' }) {
  const ref = useRef(null);
  const [edge, setEdge] = useState({ l: false, r: true });
  const update = () => {
    const el = ref.current; if (!el) return;
    setEdge({ l: el.scrollLeft > 8, r: el.scrollLeft < el.scrollWidth - el.clientWidth - 8 });
  };
  useEffect(() => { update(); }, []);
  const nudge = (dir) => { const el = ref.current; el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' }); };
  return (
    <div className="railwrap">
      {edge.l && <button className="railarrow l" onClick={() => nudge(-1)}><Icon name="chevL" size={20} /></button>}
      <div className={'rail ' + className} ref={ref} onScroll={update}>{children}</div>
      {edge.r && <button className="railarrow r" onClick={() => nudge(1)}><Icon name="chevR" size={20} /></button>}
    </div>
  );
}

// Wide auto-rotating hero spotlight for the home page.
export function HeroSpotlight({ items, onOpen, fav, toggleFav }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || items.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 5200);
    return () => clearInterval(t);
  }, [items.length, paused]);
  const ch = items[Math.min(idx, items.length - 1)];
  if (!ch) return null;
  const isFav = fav && fav.has(ch.id);
  return (
    <div className="hero" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {items.map((c, i) => (
        <div key={c.id} className={'herobg' + (i === idx ? ' on' : '')}
          style={{ background: `linear-gradient(115deg, oklch(0.42 0.15 ${c.hue}), oklch(0.15 0.06 ${(c.hue + 40) % 360}))` }}>
          <div className="herostripe" />
          <div className="heroglow" style={{ background: `radial-gradient(60% 100% at 80% 0%, oklch(0.6 0.2 ${c.hue} / .5), transparent 60%)` }} />
        </div>
      ))}
      <div className="heroscrim" />
      <div className="herobody" key={ch.id}>
        <div className="herorow">
          <LiveDot />
          {ch.countryName && <span className="herometa">{ch.countryFlag} {ch.countryName}</span>}
          {ch.catName && <><span className="herodot" /><span className="herotxt">{ch.catName}</span></>}
        </div>
        <div className="heroname">{ch.name}</div>
        <div className="herochips">
          <CodeBadge code={ch.country} />
          {ch.res && <span className="herotxt">{ch.res}</span>}
        </div>
        <div className="herobtns">
          <button className="herowatch" onClick={() => onOpen(ch)}><Icon name="play" size={19} />Watch live</button>
          <button className={'heroadd' + (isFav ? ' on' : '')} onClick={() => toggleFav && toggleFav(ch.id)} title="Favorite">
            <Icon name={isFav ? 'starfill' : 'star'} size={18} />
          </button>
          <button className="heroadd" onClick={() => onOpen(ch)} title="Details"><Icon name="info" size={18} /></button>
        </div>
      </div>
      <div className="heroLogoWrap"><Logo ch={ch} size={62} radius={18} /></div>
      <div className="herodots">
        {items.map((_, i) => <button key={i} className={'herodotbtn' + (i === idx ? ' on' : '')} onClick={() => setIdx(i)} />)}
      </div>
    </div>
  );
}

// Featured channel card with a large outlined rank number.
export function FeaturedCard({ ch, rank, onOpen }) {
  return (
    <button className="top10card" onClick={() => onOpen(ch)}>
      <span className="rankno" data-d={rank >= 10 ? 2 : 1}>{rank}</span>
      <Thumb ch={ch} style={{ width: 132, height: 188 }}>
        <div className="top10over">
          <div style={{ position: 'absolute', top: 9, left: 9 }}><MiniEq color="#fff" /></div>
          <Logo ch={ch} size={34} radius={11} />
          <div className="ellip top10name">{ch.name}</div>
        </div>
        <div className="playover sm"><Icon name="play" size={16} style={{ marginLeft: 1 }} /></div>
        <div className="sheen" />
      </Thumb>
    </button>
  );
}

// "Continue watching" wide card.
export function RecentCard({ ch, onOpen }) {
  return (
    <button className="recentcard" onClick={() => onOpen(ch)}>
      <Thumb ch={ch} style={{ width: 256, height: 144 }}>
        <div style={{ position: 'absolute', top: 10, left: 10 }}><LiveDot small /></div>
        {ch.res && (
          <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.85)', background: 'rgba(0,0,0,.32)', padding: '2px 7px', borderRadius: 7, backdropFilter: 'blur(4px)' }}>
            {ch.res}
          </div>
        )}
        <div style={{ position: 'absolute', left: 12, bottom: 12 }}>
          <Logo ch={ch} size={34} radius={11} />
        </div>
        <div className="playover"><Icon name="play" size={22} style={{ marginLeft: 2 }} /></div>
        <div className="sheen" />
      </Thumb>
      <div style={{ marginTop: 11, textAlign: 'left', width: 256 }}>
        <div className="ellip" style={{ fontSize: 14, fontWeight: 600, color: 'var(--txt)' }}>{ch.name}</div>
        <div className="ellip" style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>{ch.countryFlag} {ch.countryName}{ch.catName ? ` · ${ch.catName}` : ''}</div>
      </div>
    </button>
  );
}

// Poster card used in category rows and grids.
export function PosterCard({ ch, onOpen }) {
  return (
    <button className="postercard" onClick={() => onOpen(ch)}>
      <Thumb ch={ch} style={{ width: '100%', aspectRatio: '3 / 4' }}>
        <div style={{ position: 'absolute', top: 10, left: 10 }}><LiveDot small /></div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.6), transparent 48%)' }} />
        <div style={{ position: 'absolute', left: 12, right: 12, bottom: 12 }}>
          <Logo ch={ch} size={38} radius={12} />
          <div className="ellip" style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginTop: 8 }}>{ch.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <CodeBadge code={ch.country} />
            {ch.res && <span style={{ fontSize: 11, color: 'rgba(255,255,255,.72)' }}>{ch.res}</span>}
          </div>
        </div>
        <div className="playover"><Icon name="play" size={20} style={{ marginLeft: 1 }} /></div>
        <div className="sheen" />
      </Thumb>
    </button>
  );
}

// List-style channel row with logo.
export function ChannelRow({ ch, onOpen, compact }) {
  return (
    <button className="channelrow" onClick={() => onOpen(ch)}>
      <Logo ch={ch} size={compact ? 46 : 54} radius={14} />
      <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
        <div className="ellip" style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--txt)' }}>{ch.name}</div>
        <div className="ellip" style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>{ch.countryFlag} {ch.countryName}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <LiveDot small />
          {ch.catName && <span style={{ fontSize: 11, color: 'var(--faint)' }}>{ch.catName}</span>}
          {ch.res && <><span className="bulletsep" /><span style={{ fontSize: 11, color: 'var(--faint)' }}>{ch.res}</span></>}
        </div>
      </div>
      <div className="rowplay"><Icon name="play" size={17} style={{ marginLeft: 1 }} /></div>
    </button>
  );
}

export function SectionHeader({ title, sub, action, onAction, icon }) {
  return (
    <div className="secthead">
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        {icon && <span className="secticon"><Icon name={icon} size={18} /></span>}
        <div>
          <div className="secttitle">{title}</div>
          {sub && <div className="sectsub">{sub}</div>}
        </div>
      </div>
      {action && <button className="seeall" onClick={onAction}>{action}<Icon name="chevR" size={14} /></button>}
    </div>
  );
}
