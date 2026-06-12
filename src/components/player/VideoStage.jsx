import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import Hls from 'hls.js';

// Bare <video> element wired to hls.js (or native HLS on Safari).
export const VideoStage = forwardRef(function VideoStage({ src, playing, muted, volume, onError, onPlayingChange }, ref) {
  const videoRef = useRef(null);
  useImperativeHandle(ref, () => videoRef.current);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;
    let cancelled = false;
    let hls;
    if (Hls.isSupported()) {
      hls = new Hls();
      hls.on(Hls.Events.ERROR, (_evt, data) => {
        if (data.fatal && !cancelled) onError?.();
      });
      hls.loadSource(src);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      const onVideoError = () => { if (!cancelled) onError?.(); };
      video.src = src;
      video.addEventListener('error', onVideoError);
      return () => { cancelled = true; video.removeEventListener('error', onVideoError); };
    } else {
      onError?.();
      return undefined;
    }
    return () => { cancelled = true; hls?.destroy(); };
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) video.play().catch(() => {});
    else video.pause();
  }, [playing, src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    video.volume = volume;
  }, [muted, volume]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !onPlayingChange) return;
    const onPlay = () => onPlayingChange(true);
    const onPause = () => onPlayingChange(false);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    return () => { video.removeEventListener('play', onPlay); video.removeEventListener('pause', onPause); };
  }, [onPlayingChange]);

  return <video ref={videoRef} className="videoEl" playsInline autoPlay />;
});
