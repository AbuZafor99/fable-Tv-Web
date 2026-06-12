import { mapPos } from '../../utils/channelHelpers';

export function WorldMap({ countries, onPick, activeCode }) {
  return (
    <div className="mapwrap">
      <img src="/assets/world-dots.svg" className="mapimg" alt="" draggable="false" />
      <div className="mapglow" />
      {countries.map((co) => {
        const p = mapPos(co.lng, co.lat);
        const big = co.count >= 8;
        const act = activeCode === co.code;
        return (
          <button key={co.code} className="pin" data-active={act ? 1 : 0}
            style={{ left: p.left + '%', top: p.top + '%' }}
            onClick={() => onPick(co)} title={co.name}>
            <span className="pinhalo" style={{ width: big ? 30 : 22, height: big ? 30 : 22 }} />
            <span className="pincore" style={{ width: big ? 10 : 7.5, height: big ? 10 : 7.5 }} />
            <span className="pinlabel">{co.name} · {co.count}</span>
          </button>
        );
      })}
    </div>
  );
}
