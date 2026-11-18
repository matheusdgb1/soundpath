import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Check, StepSign } from '@/components/Icons';
import { Button, Screen, T } from '@/components/ui';
import { formatDistance } from '@/data/routes';
import { useStore } from '@/lib/store';
import { border, colors, radius, space } from '@/lib/theme';

const CHANNEL_LABEL = { ambos: 'Voz e vibração', voz: 'Só voz', vibracao: 'Só vibração' } as const;

/**
 * Resumo antes de sair. É a última tela que a pessoa precisa olhar (RNF05).
 * A lista de passos também serve para quem ajuda a configurar (filha, acompanhante).
 */
export default function Rota() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getRoute, settings } = useStore();
  const route = getRoute(id);

  if (!route) {
    return (
      <Screen title="Lugar não encontrado">
        <Button label="Voltar ao início" onPress={() => router.replace('/')} />
      </Screen>
    );
  }

  const passos = route.passos.filter((p) => p.kind === 'vire' || p.kind === 'travessia' || p.kind === 'chegada');

  return (
    <Screen
      title={route.nome}
      footer={
        <Button
          big
          label="Começar a caminhada"
          hint="Depois disso você pode guardar o celular"
          onPress={() => router.replace({ pathname: '/caminhada', params: { id: route.id } })}
        />
      }
    >
      <View style={st.facts}>
        <View style={st.fact}>
          <T variant="title">{formatDistance(route.distancia)}</T>
          <T variant="small" style={st.factLabel}>
            de caminhada
          </T>
        </View>
        <View style={st.fact}>
          <T variant="title">{route.minutos} min</T>
          <T variant="small" style={st.factLabel}>
            mais ou menos
          </T>
        </View>
      </View>

      <View style={st.box}>
        <T variant="small" style={{ color: colors.inkSoft }}>
          Você vai receber os avisos por
        </T>
        <View style={st.rowBetween}>
          <T variant="heading">{CHANNEL_LABEL[settings.channel]}</T>
          <Button variant="secondary" label="Mudar" onPress={() => router.push('/ajustes')} />
        </View>
      </View>

      <View style={{ gap: space.sm }}>
        <T variant="heading" accessibilityRole="header">
          Antes de sair
        </T>
        {[
          'Aumente o volume do celular.',
          'Não precisa de fone. Se usar, que deixe ouvir a rua.',
          'Guarde o celular no bolso ou na bolsa. Não precisa olhar a tela.',
        ].map((t) => (
          <View key={t} style={st.check}>
            <Check size={24} />
            <T style={{ flex: 1 }}>{t}</T>
          </View>
        ))}
      </View>

      <View style={{ gap: space.sm }}>
        <T variant="heading" accessibilityRole="header">
          O caminho ({route.resumo})
        </T>
        {passos.map((p, i) => (
          <View key={i} style={st.step}>
            <View style={st.stepIcon}>
              <StepSign seta={p.seta} size={34} />
            </View>
            <T style={{ flex: 1 }}>{p.kind === 'chegada' ? 'Chegada' : p.tela.replace(' agora', '')}</T>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  facts: { flexDirection: 'row', gap: space.sm },
  fact: { flex: 1, padding: space.md, borderRadius: radius, borderWidth: border, borderColor: colors.ink, backgroundColor: colors.card },
  factLabel: { color: colors.inkSoft },
  box: { gap: 4, padding: space.md, borderRadius: radius, backgroundColor: colors.paperDeep },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm, flexWrap: 'wrap' },
  check: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start' },
  step: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.xs, borderBottomWidth: 1, borderBottomColor: colors.line },
  stepIcon: { width: 52, height: 52, borderRadius: radius, backgroundColor: colors.signal, alignItems: 'center', justifyContent: 'center', borderWidth: border, borderColor: colors.ink },
});
