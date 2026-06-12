import { useReducer, useState, useEffect, useRef, useMemo } from 'react';
import { Icon, Logo, CodeBadge } from '../components/atoms';
import { Rail, PosterCard } from '../components/cards';
import { VideoShell } from '../components/player/VideoShell';
import { ServerPanel } from '../components/player/ServerPanel';

const initialPlayerState = {
  playing: true,
  muted: true,
  volume: 0.8,
  brightness: 0.6,
  show: true,
  locked: false,
  serverOpen: false,
  switching: false,
};

function reducer(state, patch) {
  return { ...state, ...patch };
}

export function PlayerPage({ data, channelId, fav, toggleFav, onOpen }) {
  const { channels, streamIndex } = data;
  const ch = useMemo(() => channels.find((c) => c.id === channelId), [channels, channelId]);

  const [st, dispatch] = useReducer(reducer, initialPlayerState);
  const [serverIdx, setServerIdx] = useState(0);
  const [tab, setTab] = useState('country');
  const [fsActive, setFsActive] = useState(false);
  const videostageRef = useRef(null);
  const videoRef = useRef(null);

  const [prevChannelId, setPrevChannelId] = useState(channelId);
  if (channelId !== prevChannelId) {
    setPrevChannelId(channelId);
    setServerIdx(0);
  }

  useEffect(() => {
    const onFsChange = () => setFsActive(document.fullscreenElement === videostageRef.current);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const handleFs = () => {
    const el = videostageRef.current;
    if (!el) return;
    if (document.fullscreenElement === el) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  const handlePip = () => {
    const video = videoRef.current;
    if (!video) return;
    if (document.pictureInPictureElement) document.exitPictureInPicture();
    else video.requestPictureInPicture?.().catch(() => {});
  };

  const streams = ch ? (streamIndex[ch.id] || []) : [];

  const related = useMemo(() => {
    if (!ch) return [];
    return channels.filter((c) => c.id !== ch.id && c.country === ch.country && (streamIndex[c.id] || []).length > 0).slice(0, 12);
  }, [channels, streamIndex, ch]);

  const more = useMemo(() => {
    if (!ch) return [];
    return channels.filter((c) => c.id !== ch.id && c.cat === ch.cat && (streamIndex[c.id] || []).length > 0).slice(0, 12);
  }, [channels, streamIndex, ch]);

  if (!ch) {
    return (
      <div className="page">
        <div className="errorbox">
          <Icon name="info" size={32} />
          <div>Channel not found.</div>
        </div>
      </div>
    );
  }

  const isFav = fav.has(ch.id);
  const list = tab === 'country' ? related : more;

  const selectServer = (i) => {
    setServerIdx(i);
    dispatch({ serverOpen: false, switching: true });
  };

  return (
    <div className="page">
      <button className="backrow" onClick={() => window.history.back()}>
        <Icon name="back" size={17} />Back
      </button>

      <div className="cinemawrap">
        <VideoShell
          ch={ch}
          streams={streams}
          serverIdx={serverIdx}
          st={st}
          dispatch={dispatch}
          videostageRef={videostageRef}
          videoRef={videoRef}
          fsActive={fsActive}
          onFs={handleFs}
          onPip={handlePip}
        />
      </div>

      <div className="playerinfo">
        <div className="playerhead">
          <Logo ch={ch} size={56} radius={16} />
          <div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, color: 'var(--txt)' }}>{ch.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
              <CodeBadge code={ch.country} />
              {ch.countryName && <span style={{ fontSize: 13, color: 'var(--muted)' }}>{ch.countryFlag} {ch.countryName}</span>}
              {ch.catName && <><span className="bulletsep" /><span style={{ fontSize: 13, color: 'var(--muted)' }}>{ch.catName}</span></>}
              {ch.res && <><span className="bulletsep" /><span style={{ fontSize: 13, color: 'var(--muted)' }}>{ch.res}</span></>}
            </div>
          </div>
          <div className="playeractions">
            <button className={'actbtn' + (isFav ? ' primary saved' : '')} onClick={() => toggleFav(ch.id)}>
              <Icon name={isFav ? 'starfill' : 'star'} size={16} />{isFav ? 'Saved' : 'Save'}
            </button>
            <button className="actbtn" onClick={handlePip}><Icon name="pip" size={16} />Mini player</button>
            <button className="actbtn" onClick={() => dispatch({ serverOpen: true })}><Icon name="server" size={16} />Servers</button>
          </div>
        </div>

        <div className="tabrow">
          <button data-on={tab === 'country' ? 1 : 0} onClick={() => setTab('country')}>More from {ch.countryName || 'this country'}</button>
          <button data-on={tab === 'category' ? 1 : 0} onClick={() => setTab('category')}>{ch.catName || 'Category'} channels</button>
        </div>

        {list.length > 0 ? (
          <Rail>
            {list.map((c) => <div key={c.id} style={{ width: 168, flex: '0 0 auto' }}><PosterCard ch={c} onOpen={onOpen} /></div>)}
          </Rail>
        ) : (
          <div style={{ color: 'var(--faint)', fontSize: 13.5, padding: '6px 0 30px' }}>Nothing else to show here yet.</div>
        )}
      </div>

      {st.serverOpen && (
        <ServerPanel streams={streams} serverIdx={serverIdx} onSelect={selectServer} onClose={() => dispatch({ serverOpen: false })} />
      )}

      <div style={{ height: 40 }} />
    </div>
  );
}
