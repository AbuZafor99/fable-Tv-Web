import { Icon, LiveDot } from '../atoms';
import { HSlider } from './HSlider';

export function PlayerControls({ ch, st, dispatch, fsActive, onFs, onPip, hasStream }) {
  const stop = (fn) => (e) => { e.stopPropagation(); fn(); };
  return (
    <div className={'vcontrols' + (st.show ? ' show' : '')} onMouseMove={() => !st.show && dispatch({ show: true })}>
      <div className="vtop">
        <div className="vtitle">
          <LiveDot /><span className="ellip">{ch.name}</span>
          {ch.countryName && <span style={{ color: 'rgba(255,255,255,.6)', fontWeight: 500 }}>· {ch.countryName}</span>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="ovbtn" onClick={stop(() => dispatch({ locked: true, show: false }))}><Icon name="lock" size={17} /></button>
        </div>
      </div>

      <div className="vcenter">
        <button className="playbig" onClick={stop(() => dispatch({ playing: !st.playing }))} disabled={!hasStream}>
          <Icon name={st.playing ? 'pause' : 'play'} size={34} style={{ marginLeft: st.playing ? 0 : 3 }} />
        </button>
      </div>

      <div className="vbottom">
        <div className="vprogress">
          <span className="livereddot" />
          <div className="livetrack"><div className="livefill" /></div>
        </div>
        <div className="vbar">
          <div className="vbar-left">
            <button className="ovbtn sm" onClick={stop(() => dispatch({ playing: !st.playing }))} disabled={!hasStream}>
              <Icon name={st.playing ? 'pause' : 'play'} size={18} style={{ marginLeft: st.playing ? 0 : 2 }} />
            </button>
            <div className="volgroup">
              <button className="ovbtn sm" onClick={stop(() => dispatch({ muted: !st.muted }))}>
                <Icon name={st.muted || st.volume === 0 ? 'mute' : 'volume'} size={18} />
              </button>
              <HSlider value={st.muted ? 0 : st.volume} onChange={(v) => dispatch({ volume: v, muted: false })} accent="var(--accent)" />
            </div>
            <span className="vlive">LIVE</span>
          </div>
          <div className="vbar-right">
            <div className="volgroup">
              <Icon name="sun" size={17} style={{ color: 'rgba(255,255,255,.8)' }} />
              <HSlider value={st.brightness} onChange={(v) => dispatch({ brightness: v })} accent="#ffd166" width={70} />
            </div>
            <button className="ovbtn sm" onClick={stop(() => dispatch({ serverOpen: true }))} title="Servers"><Icon name="server" size={18} /></button>
            <button className="ovbtn sm" onClick={stop(onPip)} title="Picture in picture"><Icon name="pip" size={18} /></button>
            <button className="ovbtn sm" onClick={stop(onFs)} title="Fullscreen"><Icon name={fsActive ? 'minimize' : 'expand'} size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
