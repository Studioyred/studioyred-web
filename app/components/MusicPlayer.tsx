'use client';

import { useEffect, useRef, useState } from 'react';
import { useMusicContext } from '../context/MusicContext';

type Track = { title: string; file: string };

export default function MusicPlayer() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const shouldPlayRef = useRef(true);
  const { setCurrentTrackTitle } = useMusicContext();

  useEffect(() => {
    fetch('/music/playlist.json')
      .then(r => r.json())
      .then((data: Track[]) => setTracks(data))
      .catch(() => {});
  }, []);

  // Load track; auto-play if shouldPlayRef is set
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || tracks.length === 0) return;
    audio.src = tracks[index].file;
    setCurrentTrackTitle(tracks[index].title);
    if (shouldPlayRef.current) {
      audio.play()
        .then(() => setPlaying(true))
        .catch(() => { shouldPlayRef.current = false; setPlaying(false); });
    }
  }, [index, tracks]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || tracks.length === 0) return;
    if (playing) {
      audio.pause();
      shouldPlayRef.current = false;
      setPlaying(false);
    } else {
      shouldPlayRef.current = true;
      audio.play()
        .then(() => setPlaying(true))
        .catch(() => { shouldPlayRef.current = false; setPlaying(false); });
    }
  };

  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    shouldPlayRef.current = false;
    setPlaying(false);
  };

  const skipPrev = () => {
    shouldPlayRef.current = playing;
    setIndex(i => (i - 1 + tracks.length) % tracks.length);
  };

  const skipNext = () => {
    shouldPlayRef.current = playing;
    setIndex(i => (i + 1) % tracks.length);
  };

  const handleEnded = () => {
    shouldPlayRef.current = true;
    setIndex(i => (i + 1) % tracks.length);
  };

  if (tracks.length === 0) return null;

  const track = tracks[index];

  return (
    <>
      <audio ref={audioRef} onEnded={handleEnded} />

      <div
        className="flex items-center gap-0.5 pl-3 pr-1 h-9 rounded-full transition-colors duration-200"
        style={{
          background: playing ? 'rgba(44,26,14,0.07)' : 'rgba(232,201,160,0.18)',
          border: '1px solid rgba(232,201,160,0.55)',
        }}
      >
        {/* Icon + title */}
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke={playing ? '#c0392b' : '#9b7d65'}
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="flex-shrink-0 mr-1"
        >
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
        <span className="text-[11px] font-medium text-[#2c1a0e] max-w-[120px] truncate mr-2">
          {track.title}
        </span>

        {/* Prev */}
        <button
          onClick={skipPrev}
          disabled={tracks.length <= 1}
          title="이전 곡"
          className="w-7 h-7 flex items-center justify-center rounded-full text-[#6b4c35] hover:bg-[#f5ede0] transition-colors disabled:opacity-30"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="19 20 9 12 19 4 19 20" />
            <line x1="5" y1="19" x2="5" y2="5" />
          </svg>
        </button>

        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          title={playing ? '일시정지' : '재생'}
          className="w-7 h-7 flex items-center justify-center rounded-full transition-all duration-150"
          style={{ background: '#2c1a0e', color: 'white' }}
        >
          {playing ? (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Stop */}
        <button
          onClick={stop}
          title="정지"
          className="w-7 h-7 flex items-center justify-center rounded-full text-[#6b4c35] hover:bg-[#f5ede0] transition-colors"
        >
          <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
            <rect x="4" y="4" width="16" height="16" rx="2" />
          </svg>
        </button>

        {/* Next */}
        <button
          onClick={skipNext}
          disabled={tracks.length <= 1}
          title="다음 곡"
          className="w-7 h-7 flex items-center justify-center rounded-full text-[#6b4c35] hover:bg-[#f5ede0] transition-colors disabled:opacity-30"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 4 15 12 5 20 5 4" />
            <line x1="19" y1="5" x2="19" y2="19" />
          </svg>
        </button>
      </div>
    </>
  );
}
