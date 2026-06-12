import { useState } from 'react';
import { useHashRoute, navigate } from './router';
import { useChannelData, useFavorites, useRecent } from './api/hooks';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { AppBanner } from './components/AppBanner';
import { Icon, Equalizer } from './components/atoms';
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { SearchPage } from './pages/SearchPage';
import { CategoryPage } from './pages/CategoryPage';
import { LiveTvPage } from './pages/LiveTvPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { PlayerPage } from './pages/PlayerPage';

export default function App() {
  const route = useHashRoute();
  const { loading, error, data } = useChannelData();
  const [fav, toggleFav] = useFavorites();
  const [recent, addRecent] = useRecent();
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openChannel = (ch) => {
    addRecent(ch.id);
    navigate(`/watch/${ch.id}`);
  };

  let page;
  if (loading) {
    page = (
      <div className="loadingscreen">
        <Equalizer color="var(--accent)" bars={5} h={32} />
        <div>Loading channels…</div>
      </div>
    );
  } else if (error) {
    page = (
      <div className="errorbox">
        <Icon name="info" size={32} />
        <div>Couldn't load channel data. Check your connection and reload.</div>
      </div>
    );
  } else if (route.name === 'discover') {
    page = <DiscoverPage data={data} onOpen={openChannel} />;
  } else if (route.name === 'live') {
    page = <LiveTvPage data={data} onOpen={openChannel} />;
  } else if (route.name === 'search') {
    page = <SearchPage data={data} onOpen={openChannel} initialQuery={route.query.q || ''} />;
  } else if (route.name === 'favorites') {
    page = <FavoritesPage data={data} fav={fav} toggleFav={toggleFav} onOpen={openChannel} />;
  } else if (route.name === 'category') {
    page = <CategoryPage data={data} categoryId={route.params.id} onOpen={openChannel} />;
  } else if (route.name === 'watch') {
    page = <PlayerPage data={data} channelId={route.params.id} fav={fav} toggleFav={toggleFav} onOpen={openChannel} />;
  } else {
    page = <HomePage data={data} fav={fav} toggleFav={toggleFav} recent={recent} onOpen={openChannel} />;
  }

  return (
    <div className="app">
      {sidebarOpen && <div className="sidebarmask" onClick={() => setSidebarOpen(false)} />}
      <Sidebar
        route={route}
        categories={data?.categories || []}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        open={sidebarOpen}
        onNavigate={() => setSidebarOpen(false)}
      />
      <div className="main">
        <AppBanner />
        <Topbar onMenu={() => setSidebarOpen(true)} />
        <div className="scroll">{page}</div>
      </div>
    </div>
  );
}
