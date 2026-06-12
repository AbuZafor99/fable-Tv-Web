import { useState, useMemo } from 'react';
import { Reveal, Icon } from '../components/atoms';
import { SectionHeader } from '../components/cards';
import { WorldMap } from '../components/discover/WorldMap';
import { CountryDrawer } from '../components/discover/CountryDrawer';

export function DiscoverPage({ data, onOpen }) {
  const { countries, channels } = data;

  const [country, setCountry] = useState(null);
  const popular = useMemo(() => countries.slice().sort((a, b) => b.count - a.count), [countries]);
  const countryChannels = useMemo(
    () => (country ? channels.filter((ch) => ch.country === country.code) : []),
    [country, channels],
  );

  return (
    <div className="page">
      <div className="pagehead">
        <div>
          <h1 className="pagetitle">Discover the world</h1>
          <p className="pagesub">Explore live channels from {countries.length} countries</p>
        </div>
      </div>

      <Reveal y={14}>
        <WorldMap countries={countries} onPick={setCountry} activeCode={country?.code} />
      </Reveal>

      <Reveal delay={100} className="block">
        <SectionHeader title="Popular regions" icon="globe" />
        <div className="countrygrid">
          {popular.map((co) => (
            <button key={co.code} className="countrytile" onClick={() => setCountry(co)}>
              <div className="countryflag">{co.flag}</div>
              <div style={{ minWidth: 0 }}>
                <div className="ellip" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--txt)' }}>{co.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--faint)', marginTop: 2 }}>{co.count} channels</div>
              </div>
              <Icon name="chevR" size={16} style={{ color: 'var(--faint)', marginLeft: 'auto' }} />
            </button>
          ))}
        </div>
      </Reveal>
      <div style={{ height: 40 }} />
      {country && (
        <CountryDrawer
          country={country}
          channels={countryChannels}
          onOpen={(ch) => { setCountry(null); onOpen(ch); }}
          onClose={() => setCountry(null)}
        />
      )}
    </div>
  );
}
