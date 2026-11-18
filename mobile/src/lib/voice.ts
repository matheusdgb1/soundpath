import * as Speech from 'expo-speech';

export type VoiceSpeed = 'devagar' | 'normal' | 'rapida';

const RATE: Record<VoiceSpeed, number> = { devagar: 0.8, normal: 1, rapida: 1.2 };

/**
 * Fala uma instrução em português. Sempre interrompe a fala anterior: na rua, a
 * instrução mais recente é a que importa (evita fila de avisos atrasados).
 */
export function say(
  text: string,
  opts: { volume: number; speed: VoiceSpeed; onDone?: () => void },
) {
  Speech.stop();
  Speech.speak(text, {
    language: 'pt-BR',
    rate: RATE[opts.speed],
    volume: Math.max(0, Math.min(1, opts.volume)),
    onDone: opts.onDone,
  });
}

export function silence() {
  Speech.stop();
}
