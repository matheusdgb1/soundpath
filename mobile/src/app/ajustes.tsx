import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, Choice, Divider, Screen, Stepper, T } from '@/components/ui';
import { playSignal } from '@/lib/signals';
import { useStore } from '@/lib/store';
import { border, colors, radius, space } from '@/lib/theme';
import { say } from '@/lib/voice';

const VOLUMES = [0.4, 0.6, 0.8, 1];
const VOLUME_LABEL = ['Baixo', 'Médio', 'Alto', 'Máximo'];

/**
 * Ajustes: RF09 (voz, vibração ou os dois), RNF03 (volume e velocidade da voz),
 * RNF07 (intensidade da vibração). Sem sliders: opções grandes e botões "Menos/Mais".
 */
export default function Ajustes() {
  const { settings, update } = useStore();
  const vi = Math.max(0, VOLUMES.indexOf(settings.volume));

  const testVoice = (volume = settings.volume, speed = settings.speed) =>
    say('Daqui a 50 metros, vire à direita.', { volume, speed });

  return (
    <Screen title="Ajustes" footer={<Button label="Pronto" onPress={() => router.back()} />}>
      <Choice
        label="Como receber os avisos"
        value={settings.channel}
        onChange={(channel) => update({ channel })}
        options={[
          { value: 'ambos', label: 'Voz e vibração (recomendado)' },
          { value: 'voz', label: 'Só voz' },
          { value: 'vibracao', label: 'Só vibração' },
        ]}
      />

      <Divider />

      <Stepper
        label="Volume da voz"
        valueLabel={VOLUME_LABEL[vi]}
        canMinus={vi > 0}
        canPlus={vi < VOLUMES.length - 1}
        onMinus={() => {
          const volume = VOLUMES[vi - 1];
          update({ volume });
          testVoice(volume);
        }}
        onPlus={() => {
          const volume = VOLUMES[vi + 1];
          update({ volume });
          testVoice(volume);
        }}
      />

      <Choice
        label="Velocidade da voz"
        value={settings.speed}
        onChange={(speed) => {
          update({ speed });
          testVoice(settings.volume, speed);
        }}
        options={[
          { value: 'devagar', label: 'Devagar' },
          { value: 'normal', label: 'Normal' },
          { value: 'rapida', label: 'Rápida' },
        ]}
      />

      <Button variant="secondary" label="Ouvir um exemplo" onPress={() => testVoice()} />

      <Divider />

      <Choice
        label="Força da vibração"
        value={settings.intensity}
        onChange={(intensity) => {
          update({ intensity });
          playSignal('direita', intensity);
        }}
        options={[
          { value: 'fraca', label: 'Fraca' },
          { value: 'media', label: 'Média' },
          { value: 'forte', label: 'Forte' },
        ]}
      />

      <View style={st.note}>
        <T variant="heading">Precisa de fone?</T>
        <T>
          Não. O SoundPath fala pelo alto-falante do celular. Se preferir fone, use um que deixe ouvir os carros e as
          pessoas na rua.
        </T>
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  note: { gap: space.xs, padding: space.md, borderRadius: radius, borderWidth: border, borderColor: colors.line, backgroundColor: colors.card },
});
