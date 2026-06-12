import { Icon } from '../atoms';
import { ChannelRow } from '../cards';

export function CountryDrawer({ country, channels, onOpen, onClose }) {
  return (
    <div className="drawermask" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawerhead">
          <div className="flagtile">{country.flag}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: 'var(--txt)' }}>{country.name}</div>
            <div style={{ fontSize: 12.5, color: 'var(--faint)', marginTop: 2 }}>{channels.length} live channels</div>
          </div>
          <button className="iconbtn" onClick={onClose}><Icon name="close" size={19} /></button>
        </div>
        <div className="drawerbody vlist">
          {channels.map((ch) => <ChannelRow key={ch.id} ch={ch} onOpen={onOpen} />)}
        </div>
      </div>
    </div>
  );
}
