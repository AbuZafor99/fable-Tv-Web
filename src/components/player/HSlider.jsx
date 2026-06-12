import { useRef } from 'react';

// Draggable horizontal slider used for volume / brightness controls.
export function HSlider({ value, onChange, accent = '#fff', width = 90 }) {
  const ref = useRef(null);
  const set = (clientX) => {
    const r = ref.current.getBoundingClientRect();
    onChange(Math.max(0, Math.min(1, (clientX - r.left) / r.width)));
  };
  const down = (e) => {
    e.stopPropagation();
    set((e.touches ? e.touches[0] : e).clientX);
    const move = (ev) => set((ev.touches ? ev.touches[0] : ev).clientX);
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return (
    <div className="hslider" ref={ref} style={{ width }} onPointerDown={down}>
      <div className="htrack"><div className="hfill" style={{ width: (value * 100) + '%', background: accent }} /></div>
      <div className="hknob" style={{ left: `calc(${value * 100}% - 7px)` }} />
    </div>
  );
}
