'use client';

import { createContext, useContext, useState } from 'react';

type MusicContextType = {
  currentTrackTitle: string;
  setCurrentTrackTitle: (title: string) => void;
};

const MusicContext = createContext<MusicContextType>({
  currentTrackTitle: '',
  setCurrentTrackTitle: () => {},
});

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [currentTrackTitle, setCurrentTrackTitle] = useState('');
  return (
    <MusicContext.Provider value={{ currentTrackTitle, setCurrentTrackTitle }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusicContext() {
  return useContext(MusicContext);
}
