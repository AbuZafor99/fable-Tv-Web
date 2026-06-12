import { Icon } from './atoms';
import { navigate } from '../router';

export function Topbar({ onMenu }) {
  return (
    <header className="topbar">
      <button className="menubtn" onClick={onMenu} title="Menu">
        <Icon name="list" size={20} />
      </button>
      <button className="quicksearch" onClick={() => navigate('/search')}>
        <Icon name="search" size={18} style={{ color: 'var(--faint)' }} />
        <span>Search channels, countries, genres…</span>
        <span className="kbd">/</span>
      </button>
      <div className="topactions">
        <button className="livenowpill" onClick={() => navigate('/live')}>
          <span className="reddot" />LIVE NOW
        </button>
      </div>
    </header>
  );
}
