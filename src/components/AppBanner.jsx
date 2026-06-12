import { useState } from 'react';
import { Icon, MiniEq } from './atoms';

const LS_KEY = 'fable_banner_dismissed';
const APK_URL = 'https://drive.google.com/file/d/1oQIOWeh5KpLGZSMxeoii2t1jsY7x4g9Y/view?usp=sharing';

export function AppBanner() {
  const [closed, setClosed] = useState(() => {
    try { return localStorage.getItem(LS_KEY) === '1'; } catch { return false; }
  });
  if (closed) return null;
  const dismiss = () => {
    setClosed(true);
    try { localStorage.setItem(LS_KEY, '1'); } catch { /* ignore */ }
  };
  return (
    <div className="appbanner">
      <div className="appbanner-left">
        <div className="appbanner-icon"><MiniEq color="#fff" bars={4} h={18} /></div>
        <div className="appbanner-copy">
          <div className="appbanner-title">Take Fable TV everywhere</div>
          <div className="appbanner-sub">Live TV and sports channels on your phone — get the Android app (APK).</div>
        </div>
      </div>
      <div className="appbanner-actions">
        <a className="apkbtn" href={APK_URL} target="_blank" rel="noreferrer">
          <Icon name="android" size={22} />
          <span><span className="storesm">Direct download · Android</span><span className="storelg">Download APK</span></span>
          <Icon name="download" size={18} style={{ marginLeft: 4, opacity: .85 }} />
        </a>
        <button className="appbanner-x" onClick={dismiss} title="Dismiss"><Icon name="close" size={16} /></button>
      </div>
    </div>
  );
}
