import * as Haptics from 'expo-haptics';
import { Platform, Vibration } from 'react-native';

/**
 * Os 4 sinais de vibração do SoundPath (RNF02: no máximo 4, bem diferentes entre si).
 *
 * Cada sinal se distingue pela QUANTIDADE e pelo RITMO, não por sutilezas de duração:
 *   DIREITA    ● ●          dois toques curtos
 *   ESQUERDA   ━━━          um toque longo
 *   TRAVESSIA  ● ● ● ● ●    cinco toques rápidos (insistente, pede atenção)
 *   CHEGADA    ━━  ━━  ━━   três toques longos e lentos (calmo, encerra)
 *
 * "Saiu do caminho" (RF08) usa só a voz, de propósito: um 5º padrão aumentaria a confusão
 * que a persona Teresa já relata ("confunde avisos").
 */
export type SignalId = 'direita' | 'esquerda' | 'travessia' | 'chegada';
export type Intensity = 'fraca' | 'media' | 'forte';

type Pulse = { on: number; off: number };

export const SIGNALS: Record<
  SignalId,
  { nome: string; descricao: string; dica: string; pulses: Pulse[] }
> = {
  direita: {
    nome: 'Virar à direita',
    descricao: 'Dois toques curtos',
    dica: 'Pense em "di-rei-ta": rápido, rápido.',
    pulses: [
      { on: 120, off: 140 },
      { on: 120, off: 0 },
    ],
  },
  esquerda: {
    nome: 'Virar à esquerda',
    descricao: 'Um toque longo',
    dica: 'Um único toque, comprido.',
    pulses: [{ on: 650, off: 0 }],
  },
  travessia: {
    nome: 'Travessia à frente',
    descricao: 'Cinco toques rápidos',
    dica: 'Parece um alarme: preste atenção na rua.',
    pulses: [
      { on: 70, off: 70 },
      { on: 70, off: 70 },
      { on: 70, off: 70 },
      { on: 70, off: 70 },
      { on: 70, off: 0 },
    ],
  },
  chegada: {
    nome: 'Você chegou',
    descricao: 'Três toques longos e lentos',
    dica: 'Calmo, como um "pronto".',
    pulses: [
      { on: 350, off: 300 },
      { on: 350, off: 300 },
      { on: 350, off: 0 },
    ],
  },
};

export const SIGNAL_ORDER: SignalId[] = ['direita', 'esquerda', 'travessia', 'chegada'];

/** O Android não aceita força da vibração pela API padrão: a intensidade alonga os toques. */
const DURATION_SCALE: Record<Intensity, number> = { fraca: 0.75, media: 1, forte: 1.35 };

const IOS_STYLE: Record<Intensity, Haptics.ImpactFeedbackStyle> = {
  fraca: Haptics.ImpactFeedbackStyle.Light,
  media: Haptics.ImpactFeedbackStyle.Medium,
  forte: Haptics.ImpactFeedbackStyle.Heavy,
};

export function signalDuration(id: SignalId, intensity: Intensity = 'media'): number {
  const k = DURATION_SCALE[intensity];
  return SIGNALS[id].pulses.reduce((t, p) => t + Math.round(p.on * k) + p.off, 0);
}

let timers: ReturnType<typeof setTimeout>[] = [];

export function stopSignal() {
  timers.forEach(clearTimeout);
  timers = [];
  Vibration.cancel();
}

/**
 * Toca um sinal. Android: padrão nativo [espera, liga, desliga, liga...].
 * iOS: a vibração do sistema tem duração fixa (~400 ms), então toques longos usam
 * Vibration e toques curtos usam o motor háptico (impactAsync).
 */
export function playSignal(id: SignalId, intensity: Intensity = 'media') {
  stopSignal();
  const k = DURATION_SCALE[intensity];
  const pulses = SIGNALS[id].pulses;

  if (Platform.OS === 'android' || Platform.OS === 'web') {
    const pattern: number[] = [0];
    pulses.forEach((p, i) => {
      pattern.push(Math.round(p.on * k));
      if (i < pulses.length - 1) pattern.push(p.off);
    });
    Vibration.vibrate(pattern);
    return;
  }

  let t = 0;
  for (const p of pulses) {
    const on = Math.round(p.on * k);
    timers.push(
      setTimeout(() => {
        if (on >= 300) Vibration.vibrate();
        else Haptics.impactAsync(IOS_STYLE[intensity]).catch(() => {});
      }, t),
    );
    t += on + p.off;
  }
}

/** Toque leve de confirmação ao apertar botões (feedback tátil). */
export function tap() {
  Haptics.selectionAsync().catch(() => {});
}
