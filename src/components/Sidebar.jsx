import { Icon, MiniEq } from './atoms';
import { navigate } from '../router';

const NAV = [
  { id: 'home', label: 'Home', icon: 'home', path: '/' },
  { id: 'discover', label: 'Discover', icon: 'compass', path: '/discover' },
  { id: 'live', label: 'Live TV', icon: 'tv', path: '/live' },
  { id: 'search', label: 'Search', icon: 'search', path: '/search' },
  { id: 'favorites', label: 'Favorites', icon: 'star', path: '/favorites' },
];

export function Sidebar({ route, categories, collapsed, setCollapsed, open, onNavigate }) {
  const active = route.name === 'watch' ? 'home' : route.name;
  const go = (path) => { navigate(path); onNavigate && onNavigate(); };
  return (
    <aside className={'sidebar' + (collapsed ? ' collapsed' : '') + (open ? ' open' : '')}>
      <button className="brand" onClick={() => go('/')}>
        <div className="brandmark"><MiniEq color="#fff" bars={4} h={17} /></div>
        {!collapsed && <div className="brandtext">Fable<span>TV</span></div>}
      </button>

      <nav className="navlist">
        {NAV.map((n) => (
          <button key={n.id} className={'navitem' + (active === n.id ? ' on' : '')} onClick={() => go(n.path)} title={n.label}>
            <span className="naviconwrap"><Icon name={n.icon} size={21} /></span>
            {!collapsed && <span className="navlabel">{n.label}</span>}
            {active === n.id && <span className="navactive" />}
          </button>
        ))}
      </nav>

      {!collapsed && categories.length > 0 && (
        <div className="navsection">
          <div className="navsectlabel">Categories</div>
          <div className="navcats">
            {categories.slice(0, 7).map((c) => (
              <button key={c.id} className={'navcat' + (route.name === 'category' && route.params.id === c.id ? ' on' : '')} onClick={() => go(`/category/${c.id}`)}>
                <span className="navcatdot" style={{ background: `oklch(0.68 0.17 ${c.hue})`, boxShadow: `0 0 7px oklch(0.68 0.17 ${c.hue})` }} />
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="sidefoot">
        <a className="profilecard" href="https://github.com/iptv-org/iptv" target="_blank" rel="noreferrer">
          <span className="avatar">FT</span>
          {!collapsed && (
            <span style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
              <span className="ellip" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--txt)' }}>Fable TV</span>
              <span className="ellip" style={{ display: 'block', fontSize: 11, color: 'var(--faint)' }}>Free · Live channels</span>
            </span>
          )}
        </a>
        <button className="collapsebtn" onClick={() => setCollapsed(!collapsed)} title="Toggle sidebar">
          <Icon name={collapsed ? 'chevR' : 'chevL'} size={16} />
        </button>
      </div>
    </aside>
  );
}
