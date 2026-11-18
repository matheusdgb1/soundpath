import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chevron, Mark, Mic, Pin, Sliders, Vibrate } from '@/components/Icons';
import { Button, T } from '@/components/ui';
import { VoiceDestination } from '@/components/VoiceDestination';
import { formatDistance, type Route } from '@/data/routes';
import { tap } from '@/lib/signals';
import { useStore } from '@/lib/store';
import { border, colors, radius, space } from '@/lib/theme';

/**
 * Início. Uma pergunta só ("Para onde você vai?") e dois caminhos para responder:
 * falar (RF01) ou tocar num lugar salvo — salvo, por exemplo, pela filha na noite anterior.
 */
export default function Home() {
  const { routes, trained } = useStore();
  const [listening, setListening] = useState(false);

  const open = (r: Route) => router.push({ pathname: '/rota/[id]', params: { id: r.id } });

  return (
    <SafeAreaView style={st.screen} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={st.content}>
        <View style={st.top}>
          <View style={st.brand} accessible accessibilityRole="header" accessibilityLabel="SoundPath">
            <Mark size={40} />
            <T variant="heading">SoundPath</T>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ajustes de voz e vibração"
            onPress={() => {
              tap();
              router.push('/ajustes');
            }}
            style={st.settings}
            hitSlop={8}
          >
            <Sliders size={24} />
            <T variant="label">Ajustes</T>
          </Pressable>
        </View>

        <T variant="display" accessibilityRole="header">
          Para onde você vai?
        </T>

        <Button
          big
          variant="signal"
          label="Falar o destino"
          hint="Abre o microfone para dizer o nome do lugar"
          icon={<Mic size={34} />}
          onPress={() => setListening(true)}
        />

        {!trained && (
          <View style={st.firstTime}>
            <View style={{ flexDirection: 'row', gap: space.md, alignItems: 'center' }}>
              <Vibrate size={40} />
              <T variant="heading" style={{ flex: 1 }}>
                Primeira vez?
              </T>
            </View>
            <T>O celular avisa com 4 jeitos de vibrar. Conheça cada um antes de sair. Leva 1 minuto.</T>
            <Button label="Conhecer os sinais" onPress={() => router.push('/sinais')} />
          </View>
        )}

        <View style={{ gap: space.sm }}>
          <T variant="heading" accessibilityRole="header">
            Lugares salvos
          </T>
          {routes.map((r) => {
            const volta = r.id.startsWith('volta-');
            return (
              <Pressable
                key={r.id}
                accessibilityRole="button"
                accessibilityLabel={`${r.nome}. ${r.tipo}. ${formatDistance(r.distancia)}, cerca de ${r.minutos} minutos a pé.`}
                accessibilityHint="Mostra o caminho antes de começar"
                onPress={() => {
                  tap();
                  open(r);
                }}
                style={({ pressed }) => [st.place, pressed && { backgroundColor: colors.paperDeep }]}
              >
                <Pin size={40} fill={volta ? colors.card : colors.signal} />
                <View style={{ flex: 1, gap: 2 }}>
                  <T variant="heading">{r.nome}</T>
                  <T variant="small" style={{ color: colors.inkSoft }}>
                    {r.tipo} · {formatDistance(r.distancia)} · {r.minutos} min a pé
                  </T>
                </View>
                <Chevron size={22} />
              </Pressable>
            );
          })}
        </View>

        {trained && (
          <Button variant="secondary" label="Rever os sinais de vibração" icon={<Vibrate size={26} />} onPress={() => router.push('/sinais')} />
        )}

        <T variant="small" style={st.note}>
          Protótipo de estudo · rotas e localização simuladas
        </T>
      </ScrollView>

      <VoiceDestination
        visible={listening}
        onClose={() => setListening(false)}
        onPick={(r) => {
          setListening(false);
          open(r);
        }}
      />
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: { padding: space.lg, gap: space.lg, paddingBottom: space.xxl },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  settings: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 48, paddingHorizontal: 12, borderRadius: radius, borderWidth: border, borderColor: colors.ink },
  firstTime: { gap: space.md, padding: space.lg, borderRadius: radius, borderWidth: border, borderColor: colors.ink, backgroundColor: colors.card },
  place: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, minHeight: 88, borderRadius: radius, borderWidth: border, borderColor: colors.ink, backgroundColor: colors.card },
  note: { color: colors.inkSoft, textAlign: 'center' },
});
