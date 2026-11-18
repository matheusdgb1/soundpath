import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Check, Pin } from '@/components/Icons';
import { Button, T } from '@/components/ui';
import { formatDistance } from '@/data/routes';
import { useStore } from '@/lib/store';
import { border, colors, radius, space } from '@/lib/theme';
import { say } from '@/lib/voice';

/** Chegada (RF04) + oferta de salvar o caminho de volta (RF10). */
export default function Chegada() {
  const { id, segundos } = useLocalSearchParams<{ id: string; segundos?: string }>();
  const { getRoute, saveReturn, hasReturn, settings } = useStore();
  const route = getRoute(id);
  const isReturn = id?.startsWith('volta-');
  const [saved, setSaved] = useState(() => (id ? hasReturn(id) : false));

  const secs = Number(segundos ?? 0);
  const tempo = secs >= 60 ? `${Math.round(secs / 60)} min` : `${secs} s`;

  return (
    <SafeAreaView style={st.screen} edges={['top', 'bottom']}>
      <View style={st.hero}>
        <View style={st.badge}>
          <Pin size={110} fill={colors.signal} />
        </View>
        <T variant="display" accessibilityRole="header" style={{ textAlign: 'center' }}>
          Você chegou!
        </T>
        {route && (
          <T variant="title" style={{ textAlign: 'center', color: colors.inkSoft }}>
            {route.nome}
          </T>
        )}
        {route && (
          <T style={{ textAlign: 'center', color: colors.inkSoft }}>
            {formatDistance(route.distancia)} · {tempo} de simulação
          </T>
        )}
      </View>

      <View style={st.actions}>
        {route && !isReturn && !saved && (
          <View style={st.offer}>
            <T variant="heading">Quer salvar o caminho de volta?</T>
            <T>Na hora de ir embora, é só escolher "Voltar para casa".</T>
            <Button
              variant="signal"
              label="Salvar o caminho de volta"
              onPress={() => {
                saveReturn(route.id);
                setSaved(true);
                say('Caminho de volta salvo.', { volume: settings.volume, speed: settings.speed });
              }}
            />
          </View>
        )}
        {saved && !isReturn && (
          <View style={[st.offer, { flexDirection: 'row', alignItems: 'center' }]} accessibilityLiveRegion="polite">
            <Check size={30} color={colors.go} />
            <T variant="bodyBold" style={{ flex: 1 }}>
              Caminho de volta salvo. Ele aparece no início.
            </T>
          </View>
        )}
        <Button big label="Voltar ao início" onPress={() => router.dismissAll()} />
      </View>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper, padding: space.lg },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.md },
  badge: { width: 170, height: 170, borderRadius: 85, borderWidth: 3, borderColor: colors.ink, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', marginBottom: space.md },
  actions: { gap: space.md },
  offer: { gap: space.sm, padding: space.md, borderRadius: radius, borderWidth: border, borderColor: colors.ink, backgroundColor: colors.card },
});
