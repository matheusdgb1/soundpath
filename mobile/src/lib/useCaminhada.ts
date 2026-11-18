import { useCallback, useEffect, useRef, useState } from 'react';

import { formatDistance, type Route } from '@/data/routes';
import { playSignal, stopSignal } from './signals';
import type { Pace, Settings } from './store';
import { say, silence } from './voice';

const PACE: Record<Pace, number> = { lento: 1.6, normal: 1, rapido: 0.5 };

export type Phase = 'preparando' | 'andando' | 'pausado' | 'fora' | 'chegou';

/**
 * Simulação da caminhada (Mágico de Oz automático): cada passo da rota dura um tempo,
 * e ao entrar num passo o app fala e/ou vibra conforme as preferências (RF09).
 *
 * Ações da pessoa:     repetir (RF06) · quanto falta (RF07) · pausar.
 * Ações do avaliador:  próximo aviso · simular "saiu do caminho" (RF08).
 */
export function useCaminhada(route: Route, settings: Settings, onArrive: (segundos: number) => void) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('preparando');
  const [caption, setCaption] = useState('Pode guardar o celular.');
  const [signalKey, setSignalKey] = useState(0);
  const startedAt = useRef(Date.now());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const step = route.passos[index];
  const usesVoice = settings.channel !== 'vibracao';
  const usesVibration = settings.channel !== 'voz';

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const speak = useCallback((text: string, force = false) => {
    const s = settingsRef.current;
    setCaption(text);
    if (force || s.channel !== 'vibracao') say(text, { volume: s.volume, speed: s.speed });
  }, []);

  const announce = useCallback(
    (i: number) => {
      const s = settingsRef.current;
      const st = route.passos[i];
      if (st.sinal && s.channel !== 'voz') {
        playSignal(st.sinal, s.intensity);
        setSignalKey((k) => k + 1);
      }
      speak(st.fala);
    },
    [route, speak],
  );

  // Preparação: tempo para guardar o celular antes do primeiro aviso.
  useEffect(() => {
    speak('Pode guardar o celular. Vou avisar quando for virar.', true);
    timer.current = setTimeout(() => setPhase('andando'), 4500);
    return () => {
      clear();
      silence();
      stopSignal();
    };
  }, [speak]);

  // Ao entrar num passo enquanto anda: anuncia e agenda o próximo.
  useEffect(() => {
    if (phase !== 'andando') return;
    announce(index);
    clear();
    const st = route.passos[index];
    if (st.kind === 'chegada') {
      setPhase('chegou');
      const secs = Math.round((Date.now() - startedAt.current) / 1000);
      timer.current = setTimeout(() => onArrive(secs), 3500);
      return;
    }
    timer.current = setTimeout(
      () => setIndex((i) => Math.min(i + 1, route.passos.length - 1)),
      st.dur * 1000 * PACE[settingsRef.current.pace],
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, phase]);

  const repeat = useCallback(() => {
    if (phase === 'pausado' || phase === 'preparando') return;
    announce(index);
  }, [announce, index, phase]);

  const howFar = useCallback(() => {
    const min = Math.max(1, Math.round(step.faltam / 75));
    const text =
      step.faltam <= 30
        ? 'Você está chegando.'
        : `Faltam ${formatDistance(step.faltam).replace(' m', ' metros').replace(' km', ' quilômetros')}, cerca de ${min} ${min === 1 ? 'minuto' : 'minutos'}.`;
    speak(text, true);
  }, [speak, step]);

  const pause = useCallback(() => {
    clear();
    silence();
    stopSignal();
    setPhase('pausado');
    setCaption('Caminho pausado.');
    say('Caminho pausado.', { volume: settingsRef.current.volume, speed: settingsRef.current.speed });
  }, []);

  const resume = useCallback(() => {
    setPhase('andando');
  }, []);

  const next = useCallback(() => {
    if (phase === 'chegou' || index >= route.passos.length - 1) return;
    clear();
    if (phase === 'preparando') {
      setPhase('andando'); // começa já, sem pular o primeiro aviso
      return;
    }
    if (phase !== 'andando') setPhase('andando');
    setIndex((i) => Math.min(i + 1, route.passos.length - 1));
  }, [index, phase, route]);

  const offRoute = useCallback(() => {
    if (phase !== 'andando' && phase !== 'pausado') return;
    clear();
    stopSignal();
    setPhase('fora');
    speak('Você saiu do caminho. Volte alguns passos. Eu aviso quando estiver certo.', true);
    timer.current = setTimeout(() => {
      speak('Pronto, você voltou ao caminho.', true);
      timer.current = setTimeout(() => setPhase('andando'), 2500);
    }, 7000 * PACE[settingsRef.current.pace]);
  }, [phase, speak]);

  const progress = route.distancia ? 1 - step.faltam / route.distancia : 0;

  return {
    step,
    index,
    phase,
    caption,
    signalKey,
    progress,
    usesVoice,
    usesVibration,
    repeat,
    howFar,
    pause,
    resume,
    next,
    offRoute,
  };
}
