import { createContext, useContext, useEffect, useState, useCallback } from 'react';

// ClaireOS skin system: 'light' (Classic Blue) | 'dark' (Vaporwave).
// Persisted to localStorage, shared across pages via context.

const SkinContext = createContext({
  skin: 'dark',
  dark: true,
  setSkin: () => {},
  toggleSkin: () => {},
});

const STORAGE_KEY = 'claireos-skin';

export function SkinProvider({ children }) {
  // Vaporwave is the default skin.
  const [skin, setSkinState] = useState('dark');

  // hydrate from localStorage after mount (SSR-safe)
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') setSkinState(saved);
    } catch (e) {
      /* ignore */
    }
  }, []);

  const setSkin = useCallback((next) => {
    setSkinState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      /* ignore */
    }
  }, []);

  const toggleSkin = useCallback(() => {
    setSkinState((s) => {
      const next = s === 'light' ? 'dark' : 'light';
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        /* ignore */
      }
      return next;
    });
  }, []);

  return (
    <SkinContext.Provider value={{ skin, dark: skin === 'dark', setSkin, toggleSkin }}>
      {children}
    </SkinContext.Provider>
  );
}

export function useSkin() {
  return useContext(SkinContext);
}

export default SkinContext;
