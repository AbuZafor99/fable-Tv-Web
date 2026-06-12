import { useState, useEffect } from 'react';
import { Icon, Logo, LiveDot } from '../atoms';
import { VideoStage } from './VideoStage';
import { PlayerControls } from './PlayerControls';

export function VideoShell({ ch, streams, serverIdx, st, dispatch, videostageRef, videoRef, fsActive, onFs, onPip }) {
  const stream = streams[serverIdx];
  const [error, setError] = useState(false);

  const sourceKey = `${serverIdx}|${ch.id}`;
  const [prevSourceKey, setPrevSourceKey] = useState(sourceKey);
  if (sourceKey !== prevSourceKey) {
    setPrevSourceKey(sourceKey);
    setError(false);
  }

  useEffect(() => {
    if (!st.switching) return;
    const t = setTimeout(() => dispatch({ switching: false }), 1000);
    return () => clearTimeout(t);
  }, [st.switching]);

  const hasStream = !!stream && !error;

  return (
    <div
      ref={videostageRef}
      className="videostage"
      style={{ filter: `brightness(${0.5 + st.brightness * 0.7})` }}
      onClick={() => dispatch({ show: !st.show })}
    >
      {stream && (
        <VideoStage
          ref={videoRef}
          src={stream.url}
          playing={st.playing}
          muted={st.muted}
          volume={st.volume}
          onError={() => setError(true)}
          onPlayingChange={(p) => dispatch({ playing: p })}
        />
      )}
      {!hasStream && (
        <div className="nostream">
          <Logo ch={ch} size={64} radius={18} />
          <div>{error ? "This stream isn't available right now — try another server." : 'No stream available for this channel.'}</div>
        </div>
      )}
      {hasStream && <div style={{ position: 'absolute', left: 18, top: 16, zIndex: 1 }}><LiveDot /></div>}
      {hasStream && ch.res && (
        <div style={{ position: 'absolute', right: 18, top: 16, zIndex: 1, fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.9)', background: 'rgba(0,0,0,.32)', padding: '4px 9px', borderRadius: 8, backdropFilter: 'blur(4px)' }}>
          {ch.res}
        </div>
      )}
      {st.switching && <div className="switching"><div className="spinner" />Switching server…</div>}
      {st.locked ? (
        <div className="lockedlayer" onClick={(e) => { e.stopPropagation(); dispatch({ locked: false, show: true }); }}>
          <button className="ovbtn lg"><Icon name="lock" size={24} /></button><span>Click to unlock</span>
        </div>
      ) : (
        <PlayerControls ch={ch} st={st} dispatch={dispatch} fsActive={fsActive} onFs={onFs} onPip={onPip} hasStream={hasStream} />
      )}
    </div>
  );
}
