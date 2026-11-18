import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { SIGNALS, type Intensity, type SignalId } from '@/lib/signals';
import { colors } from '@/lib/theme';

const SCALE: Record<Intensity, number> = { fraca: 0.75, media: 1, forte: 1.35 };

/**
 * Desenha o ritmo de um sinal: toque curto = bolinha, toque longo = barra.
 * Quando `playKey` muda, acende cada toque no mesmo tempo da vibração — assim quem
 * assiste (professora, colegas, avaliador) "vê" o que a pessoa sente no bolso.
 */
export function SignalGlyph({
  id,
  playKey,
  intensity = 'media',
  color = colors.ink,
  lit = colors.signal,
  unit = 18,
}: {
  id: SignalId;
  playKey?: number;
  intensity?: Intensity;
  color?: string;
  lit?: string;
  unit?: number;
}) {
  const pulses = SIGNALS[id].pulses;
  const [active, setActive] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!playKey) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const k = SCALE[intensity];
    let t = 0;
    pulses.forEach((p, i) => {
      const on = Math.round(p.on * k);
      timers.current.push(setTimeout(() => setActive(i), t));
      timers.current.push(setTimeout(() => setActive(null), t + on));
      t += on + p.off;
    });
    return () => timers.current.forEach(clearTimeout);
  }, [playKey, intensity, pulses]);

  return (
    <View
      style={st.row}
      accessible
      accessibilityLabel={`Ritmo: ${SIGNALS[id].descricao}`}
    >
      {pulses.map((p, i) => {
        const long = p.on >= 300;
        return (
          <View
            key={i}
            style={{
              height: unit,
              width: long ? unit * 3.2 : unit,
              borderRadius: unit / 2,
              backgroundColor: active === i ? lit : color,
              borderWidth: active === i ? 3 : 0,
              borderColor: color,
              transform: [{ scale: active === i ? 1.25 : 1 }],
            }}
          />
        );
      })}
    </View>
  );
}

const st = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 32 },
});
