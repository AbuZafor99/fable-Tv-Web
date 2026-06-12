import { useState, useEffect } from 'react';

export function Icon({ name, size = 22, stroke = 1.8, style, className }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    home: <><path d="M3 10.5 12 3l9 7.5" {...p} /><path d="M5 9.5V20a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1V9.5" {...p} /></>,
    search: <><circle cx="11" cy="11" r="7" {...p} /><path d="m20 20-3.2-3.2" {...p} /></>,
    heart: <path d="M12 20s-7-4.4-9.3-8.2C1.2 9 2.3 5.6 5.5 5.1 7.7 4.8 9.2 6.2 12 9c2.8-2.8 4.3-4.2 6.5-3.9 3.2.5 4.3 3.9 2.8 6.7C19 15.6 12 20 12 20Z" {...p} />,
    heartfill: <path d="M12 20s-7-4.4-9.3-8.2C1.2 9 2.3 5.6 5.5 5.1 7.7 4.8 9.2 6.2 12 9c2.8-2.8 4.3-4.2 6.5-3.9 3.2.5 4.3 3.9 2.8 6.7C19 15.6 12 20 12 20Z" fill="currentColor" stroke="none" />,
    user: <><circle cx="12" cy="8" r="3.6" {...p} /><path d="M5 20c.8-3.6 3.6-5.4 7-5.4s6.2 1.8 7 5.4" {...p} /></>,
    play: <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" stroke="none" />,
    pause: <><rect x="7" y="5.5" width="3.2" height="13" rx="1" fill="currentColor" stroke="none" /><rect x="13.8" y="5.5" width="3.2" height="13" rx="1" fill="currentColor" stroke="none" /></>,
    back: <path d="M15 5l-7 7 7 7" {...p} />,
    close: <path d="M6 6l12 12M18 6 6 18" {...p} />,
    chevR: <path d="m9 5 7 7-7 7" {...p} />,
    chevL: <path d="m15 5-7 7 7 7" {...p} />,
    chevD: <path d="m5 9 7 7 7-7" {...p} />,
    volume: <><path d="M4 9v6h3.5L13 20V4L7.5 9H4Z" {...p} /><path d="M16.5 8.5a5 5 0 0 1 0 7" {...p} /><path d="M19 6a8.5 8.5 0 0 1 0 12" {...p} /></>,
    mute: <><path d="M4 9v6h3.5L13 20V4L7.5 9H4Z" {...p} /><path d="m17 9 4 6M21 9l-4 6" {...p} /></>,
    sun: <><circle cx="12" cy="12" r="4" {...p} /><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" {...p} /></>,
    expand: <path d="M8 3H3v5M16 3h5v5M16 21h5v-5M8 21H3v-5" {...p} />,
    minimize: <path d="M9 3v6H3M21 9h-6V3M3 15h6v6M15 21v-6h6" {...p} />,
    pip: <><rect x="3" y="5" width="18" height="14" rx="2.5" {...p} /><rect x="12" y="11" width="7" height="6" rx="1.5" fill="currentColor" stroke="none" /></>,
    server: <><rect x="3.5" y="4" width="17" height="6.5" rx="2" {...p} /><rect x="3.5" y="13.5" width="17" height="6.5" rx="2" {...p} /><circle cx="7" cy="7.2" r=".9" fill="currentColor" stroke="none" /><circle cx="7" cy="16.7" r=".9" fill="currentColor" stroke="none" /></>,
    filter: <path d="M4 6h16M7 12h10M10 18h4" {...p} />,
    grid: <><rect x="4" y="4" width="6.5" height="6.5" rx="1.6" {...p} /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6" {...p} /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6" {...p} /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6" {...p} /></>,
    globe: <><circle cx="12" cy="12" r="9" {...p} /><path d="M3 12h18M12 3c2.5 2.4 3.8 5.6 3.8 9S14.5 18.6 12 21C9.5 18.6 8.2 15.4 8.2 12S9.5 5.4 12 3Z" {...p} /></>,
    star: <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" {...p} />,
    starfill: <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" fill="currentColor" stroke="none" />,
    cast: <><path d="M3 16.5a4.5 4.5 0 0 1 4.5 4.5M3 12a9 9 0 0 1 9 9M3 7.5h17a1 1 0 0 1 1 1v11" {...p} /><circle cx="3.2" cy="20.8" r="1" fill="currentColor" stroke="none" /></>,
    settings: <><circle cx="12" cy="12" r="3.2" {...p} /><path d="M12 2.5v2.5M12 19v2.5M21.5 12H19M5 12H2.5M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8M18.7 18.7l-1.8-1.8M7.1 7.1 5.3 5.3" {...p} /></>,
    signal: <path d="M5 19v-3M10 19v-7M15 19v-10M20 19V6" {...p} />,
    eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" {...p} /><circle cx="12" cy="12" r="2.8" {...p} /></>,
    list: <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" {...p} />,
    info: <><circle cx="12" cy="12" r="9" {...p} /><path d="M12 11v5M12 8h.01" {...p} /></>,
    forward: <path d="M13 5l7 7-7 7M5 5l7 7-7 7" {...p} />,
    lock: <><rect x="5" y="10.5" width="14" height="10" rx="2.2" {...p} /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" {...p} /></>,
    tv: <><rect x="3" y="6" width="18" height="12.5" rx="2.4" {...p} /><path d="M8 21h8M12 6 9 2.5M12 6l3-3.5" {...p} /></>,
    calendar: <><rect x="4" y="5.5" width="16" height="15" rx="2.4" {...p} /><path d="M4 10h16M8 3.5v4M16 3.5v4" {...p} /></>,
    compass: <><circle cx="12" cy="12" r="9" {...p} /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" {...p} /></>,
    bell: <><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" {...p} /><path d="M10 19a2 2 0 0 0 4 0" {...p} /></>,
    plus: <path d="M12 5v14M5 12h14" {...p} />,
    check: <path d="m5 12.5 4.5 4.5L19 6.5" {...p} />,
    skip: <path d="M6 5v14M18 5v14M6 12l9-7v14l-9-7Z" {...p} />,
    sound: <path d="M3 13v-2M7 16V8M11 18V6M15 15V9M19 13v-2" {...p} />,
    trophy: <><path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" {...p} /><path d="M7 6H4.5a2.5 2.5 0 0 0 2.5 3M17 6h2.5a2.5 2.5 0 0 1-2.5 3" {...p} /><path d="M12 13v3M9 20h6M10 20c0-1.5.7-2 2-2s2 .5 2 2" {...p} /></>,
    cricket: <><circle cx="7" cy="7" r="3" {...p} /><path d="M9 9.2 19 19" {...p} /><path d="m16.5 16.5 3-3a1.6 1.6 0 0 1 2.3 2.3l-3 3" {...p} /></>,
    bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" {...p} />,
    whistle: <><circle cx="9" cy="14" r="5" {...p} /><path d="M14 12h7v3h-5M9 9V5h4" {...p} /></>,
    download: <><path d="M12 3v12M8 11l4 4 4-4" {...p} /><path d="M5 20h14" {...p} /></>,
    android: <><path d="M5 11.5h14v6a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 17.5z" {...p} /><path d="M5 11.5a7 7 0 0 1 14 0" {...p} /><path d="m7.5 8.5-1-1.5M16.5 8.5l1-1.5" {...p} /><circle cx="9.5" cy="8.6" r=".7" fill="currentColor" stroke="none" /><circle cx="14.5" cy="8.6" r=".7" fill="currentColor" stroke="none" /></>,
  };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={style} className={className} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

// Channel monogram — gradient tile derived from the channel's deterministic hue.
export function Logo({ ch, size = 56, radius = 16, style }) {
  const h = ch.hue;
  const bg = `linear-gradient(150deg, oklch(0.62 0.17 ${h}), oklch(0.46 0.16 ${(h + 40) % 360}))`;
  return (
    <div style={{
      width: size, height: size, borderRadius: radius, background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flex: '0 0 auto', position: 'relative', overflow: 'hidden',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,.18)', ...style,
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 80% at 80% 0%, rgba(255,255,255,.25), transparent 60%)' }} />
      <span style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
        fontSize: size * 0.34, color: '#fff', letterSpacing: '-.02em', zIndex: 1,
        textShadow: '0 1px 3px rgba(0,0,0,.3)',
      }}>{ch.initials}</span>
    </div>
  );
}

export function LiveDot({ label = 'LIVE', small }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: 'rgba(255,70,92,.16)', color: '#ff6076',
      padding: small ? '2px 7px' : '3px 9px', borderRadius: 999,
      fontSize: small ? 9.5 : 11, fontWeight: 700, letterSpacing: '.06em',
      border: '1px solid rgba(255,70,92,.28)', whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: 99, background: '#ff5468', boxShadow: '0 0 6px #ff5468', animation: 'livepulse 1.6s infinite' }} />
      {label}
    </span>
  );
}

export function CodeBadge({ code }) {
  if (!code) return null;
  return (
    <span style={{
      fontFamily: "'Space Grotesk', sans-serif", fontSize: 10.5, fontWeight: 700,
      letterSpacing: '.04em', color: 'var(--muted)', background: 'rgba(255,255,255,.06)',
      border: '1px solid var(--line)', padding: '2px 6px', borderRadius: 6, whiteSpace: 'nowrap',
    }}>{code}</span>
  );
}

export function MiniEq({ color = '#fff', bars = 4, h = 13 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2.5, height: h }}>
      {Array.from({ length: bars }).map((_, i) => (
        <span key={i} style={{ width: 2.5, borderRadius: 3, background: color, height: '45%', animation: `eq 1.1s ${i * 0.14}s infinite ease-in-out` }} />
      ))}
    </div>
  );
}

export function Equalizer({ color = '#fff', bars = 5, h = 26 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: h }}>
      {Array.from({ length: bars }).map((_, i) => (
        <span key={i} style={{ width: 3, borderRadius: 3, background: color, opacity: .85, height: '40%', animation: `eq 1.1s ${i * 0.13}s infinite ease-in-out` }} />
      ))}
    </div>
  );
}

// Mount reveal — staggered fade-up.
export function Reveal({ children, delay = 0, y = 18, className = '', style }) {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), 30 + delay); return () => clearTimeout(t); }, [delay]);
  return <div className={'reveal ' + (on ? 'in ' : '') + className} style={{ '--ry': y + 'px', ...style }}>{children}</div>;
}

// Striped channel-tinted thumbnail placeholder, used behind the channel logo.
export function Thumb({ ch, children, style, radius = 14 }) {
  return (
    <div style={{
      position: 'relative', borderRadius: radius, overflow: 'hidden',
      background: `linear-gradient(135deg, oklch(0.30 0.08 ${ch.hue}), oklch(0.18 0.05 ${(ch.hue + 30) % 360}))`,
      ...style,
    }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(125deg, rgba(255,255,255,.05) 0 2px, transparent 2px 11px)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(90% 70% at 30% 10%, rgba(255,255,255,.10), transparent 55%)' }} />
      {children}
    </div>
  );
}
