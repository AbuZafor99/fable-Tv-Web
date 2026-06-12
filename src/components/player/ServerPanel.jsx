import { Icon } from '../atoms';

export function ServerPanel({ streams, serverIdx, onSelect, onClose }) {
  return (
    <div className="modalmask" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modalhead">
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <span className="secticon"><Icon name="server" size={18} /></span>
            <div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 17, fontWeight: 600, color: 'var(--txt)' }}>Choose a server</div>
              <div style={{ fontSize: 12, color: 'var(--faint)', marginTop: 1 }}>Switch source if playback stutters</div>
            </div>
          </div>
          <button className="iconbtn" onClick={onClose}><Icon name="close" size={18} /></button>
        </div>
        <div className="vlist" style={{ marginTop: 14 }}>
          {streams.length === 0 && (
            <div style={{ padding: '20px 8px', textAlign: 'center', color: 'var(--faint)', fontSize: 13 }}>No alternate servers available for this channel.</div>
          )}
          {streams.map((s, i) => {
            const on = i === serverIdx;
            let host = '';
            try { host = new URL(s.url).hostname; } catch { /* relative or invalid url */ }
            const label = s.label || (s.quality ? `${s.quality} stream` : `Server ${i + 1}`);
            return (
              <button key={i} className={'serverrow' + (on ? ' on' : '')} onClick={() => onSelect(i)}>
                <div className="signalbox"><Icon name="signal" size={18} /></div>
                <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <div className="ellip" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--txt)' }}>{label}</div>
                  <div className="ellip" style={{ fontSize: 11.5, color: 'var(--faint)', marginTop: 2 }}>{[s.quality, host].filter(Boolean).join(' · ')}</div>
                </div>
                <div className={'radio' + (on ? ' on' : '')} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
