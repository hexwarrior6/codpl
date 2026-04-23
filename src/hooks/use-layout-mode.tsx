import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type LayoutMode = 'standard' | 'wide';

interface LayoutModeState {
  mode: LayoutMode;
  setMode: (mode: LayoutMode) => void;
  toggle: () => void;
}

const LayoutModeContext = createContext<LayoutModeState | null>(null);

const STORAGE_KEY = 'cpb-layout-mode';

function readStored(): LayoutMode {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === 'wide' || value === 'standard') return value;
  } catch {
    /* ignore */
  }
  return 'standard';
}

function applyMode(mode: LayoutMode) {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.layoutMode = mode;
}

export function LayoutModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<LayoutMode>(() => readStored());

  useEffect(() => {
    applyMode(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
  }, [mode]);

  const setMode = useCallback((value: LayoutMode) => setModeState(value), []);
  const toggle = useCallback(() => setModeState((prev) => (prev === 'wide' ? 'standard' : 'wide')), []);

  const value = useMemo<LayoutModeState>(() => ({ mode, setMode, toggle }), [mode, setMode, toggle]);

  return <LayoutModeContext.Provider value={value}>{children}</LayoutModeContext.Provider>;
}

export function useLayoutMode(): LayoutModeState {
  const ctx = useContext(LayoutModeContext);
  if (!ctx) throw new Error('useLayoutMode 必须在 LayoutModeProvider 内使用');
  return ctx;
}
