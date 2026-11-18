import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { ROUTES, makeReturnRoute, type Route } from '@/data/routes';
import type { Intensity } from './signals';
import type { VoiceSpeed } from './voice';

/** RF09: a pessoa escolhe como recebe os avisos. */
export type Channel = 'voz' | 'vibracao' | 'ambos';
/** Ritmo da simulação (usado no teste para encurtar ou alongar o trajeto). */
export type Pace = 'lento' | 'normal' | 'rapido';

export type Settings = {
  channel: Channel;
  /** 0.2 a 1 (RNF03). */
  volume: number;
  speed: VoiceSpeed;
  /** RNF07. */
  intensity: Intensity;
  pace: Pace;
};

type Store = {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  routes: Route[];
  getRoute: (id: string) => Route | undefined;
  saveReturn: (fromId: string) => void;
  hasReturn: (fromId: string) => boolean;
  trained: boolean;
  setTrained: (v: boolean) => void;
};

const Ctx = createContext<Store | null>(null);

/**
 * Estado do protótipo em memória. Ao fechar o app tudo volta ao padrão — de propósito,
 * para cada participante do teste começar do mesmo ponto (RNF08: nada de histórico salvo).
 */
export function StoreProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    channel: 'ambos',
    volume: 1,
    speed: 'normal',
    intensity: 'media',
    pace: 'normal',
  });
  const [extra, setExtra] = useState<Route[]>([]);
  const [trained, setTrained] = useState(false);

  const routes = useMemo(() => [...extra, ...ROUTES], [extra]);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((s) => ({ ...s, ...patch }));
  }, []);

  const getRoute = useCallback((id: string) => routes.find((r) => r.id === id), [routes]);

  const saveReturn = useCallback((fromId: string) => {
    const base = ROUTES.find((r) => r.id === fromId);
    if (!base) return;
    setExtra((list) =>
      list.some((r) => r.id === `volta-${fromId}`) ? list : [makeReturnRoute(base), ...list],
    );
  }, []);

  const hasReturn = useCallback(
    (fromId: string) => extra.some((r) => r.id === `volta-${fromId}`),
    [extra],
  );

  const value = useMemo(
    () => ({ settings, update, routes, getRoute, saveReturn, hasReturn, trained, setTrained }),
    [settings, update, routes, getRoute, saveReturn, hasReturn, trained],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore precisa estar dentro de <StoreProvider>');
  return v;
}
