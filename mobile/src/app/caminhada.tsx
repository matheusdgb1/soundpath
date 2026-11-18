import { useKeepAwake } from 'expo-keep-awake';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, type ReactNode } from 'react';
import { Alert, BackHandler, Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Pause, Play, Repeat, StepSign } from '@/components/Icons';
import { SignalGlyph } from '@/components/SignalGlyph';
import { Button, Choice, T } from '@/components/ui';
import { formatDistance } from '@/data/routes';
import { SIGNALS, tap } from '@/lib/signals';
import { useStore, type Pace } from '@/lib/store';
import { border, colors, radius, space } from '@/lib/theme';
import { useCaminhada } from '@/lib/useCaminhada';

/**
 * Caminhada em andamento. A pessoa NÃO precisa olhar esta tela (RNF05): tudo chega por voz
 * e vibração. A tela existe para:
 *   1. repetir o último aviso com um toque em qualquer lugar (RF06 — no app final, botão de volume);
 *   2. quem acompanha, avalia ou assiste à demonstração ver o que está sendo falado/vibrado.
 *
 * Fundo escuro = "modo bolso": sinaliza que a tela é secundária e economiza bateria.
 * Toque longo no topo abre o Painel do avaliador (Mágico de Oz) para o teste de usabilidade.
 */
export default function Caminhada() {
  useKeepAwake();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getRoute, settings, update } = useStore();
  const route = getRoute(id)!;
  const [panel, setPanel] = useState(false);

  const nav = useCaminhada(route, settings, (segundos) =>
    router.replace({ pathname: '/chegada', params: { id: route.id, segundos: String(segundos) } }),
  );

  const confirmExit = () =>
    Alert.alert('Encerrar o caminho?', 'Você pode começar de novo depois.', [
      { text: 'Continuar andando', style: 'cancel' },
      { text: 'Encerrar', style: 'destructive', onPress: () => router.dismissAll() },
    ]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      confirmExit();
      return true;
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { step, phase } = nav;
  const paused = phase === 'pausado';
  const lost = phase === 'fora';
  const preparing = phase === 'preparando';

  let big = step.tela;
  if (preparing) big = 'Pode guardar o celular';
  if (paused) big = 'Pausado';
  if (lost) big = 'Você saiu do caminho';

  return (
    <SafeAreaView style={st.screen} edges={['top', 'bottom']}>
      <StatusBar style="light" />

      <Pressable
        onLongPress={() => setPanel(true)}
        delayLongPress={900}
        accessibilityLabel={`Indo para ${route.nome}. Faltam ${formatDistance(step.faltam)}.`}
        accessibilityHint="Toque longo abre o painel do avaliador"
        style={st.top}
      >
        <View style={{ flex: 1 }}>
          <T variant="small" style={{ color: colors.nightSoft }}>
            Indo para
          </T>
          <T variant="heading" style={{ color: colors.paper }} numberOfLines={1}>
            {route.nome}
          </T>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <T variant="small" style={{ color: colors.nightSoft }}>
            Faltam
          </T>
          <T variant="heading" style={{ color: colors.signal }}>
            {formatDistance(step.faltam)}
          </T>
        </View>
      </Pressable>
      <View style={st.bar} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(nav.progress * 100) }}>
        <View style={[st.barFill, { width: `${Math.round(nav.progress * 100)}%` }]} />
      </View>

      <Pressable
        style={st.stage}
        onPress={() => {
          tap();
          if (paused) nav.resume();
          else nav.repeat();
        }}
        accessibilityRole="button"
        accessibilityLabel={paused ? 'Continuar o caminho' : `Repetir o aviso: ${nav.caption}`}
      >
        <View style={[st.sign, lost && { backgroundColor: colors.stop }]}>
          {paused ? (
            <Play size={110} color={colors.night} />
          ) : preparing ? (
            <StepSign seta="frente" size={130} color={colors.night} />
          ) : (
            <StepSign seta={lost ? 'frente' : step.seta} size={130} color={lost ? colors.paper : colors.night} />
          )}
        </View>

        <T variant="display" style={st.big} accessibilityLiveRegion="assertive">
          {big}
        </T>

        {!preparing && !paused && step.sinal && nav.usesVibration && !lost && (
          <View style={st.vibe}>
            <T variant="small" style={{ color: colors.nightSoft }}>
              Vibração: {SIGNALS[step.sinal].nome.toLowerCase()}
            </T>
            <SignalGlyph
              id={step.sinal}
              playKey={nav.signalKey}
              intensity={settings.intensity}
              color={colors.nightSoft}
              lit={colors.signal}
            />
          </View>
        )}

        <View style={st.caption}>
          <T variant="small" style={{ color: colors.nightSoft }}>
            {nav.usesVoice || lost || paused || preparing ? 'A voz disse' : 'Só vibração (voz desligada)'}
          </T>
          <T style={{ color: colors.paper }}>“{nav.caption}”</T>
        </View>

        <View style={st.hint}>
          <Repeat size={22} color={colors.nightSoft} />
          <T variant="small" style={{ color: colors.nightSoft }}>
            {paused ? 'Toque em qualquer lugar para continuar' : 'Toque em qualquer lugar para repetir'}
          </T>
        </View>
      </Pressable>

      <View style={st.actions}>
        <DarkButton label="Quanto falta?" onPress={nav.howFar} primary disabled={preparing} />
        <DarkButton
          label={paused ? 'Continuar' : 'Pausar'}
          icon={paused ? <Play size={22} color={colors.paper} /> : <Pause size={22} color={colors.paper} />}
          onPress={paused ? nav.resume : nav.pause}
          disabled={preparing}
        />
      </View>
      <Pressable onPress={confirmExit} accessibilityRole="button" style={st.exit} hitSlop={8}>
        <T variant="label" style={{ color: colors.nightSoft, textDecorationLine: 'underline' }}>
          Encerrar caminho
        </T>
      </Pressable>

      <EvaluatorPanel
        visible={panel}
        onClose={() => setPanel(false)}
        pace={settings.pace}
        onPace={(pace) => update({ pace })}
        onNext={() => {
          setPanel(false);
          nav.next();
        }}
        onOff={() => {
          setPanel(false);
          nav.offRoute();
        }}
        stepLabel={`Passo ${nav.index + 1} de ${route.passos.length}: ${step.tela}`}
      />
    </SafeAreaView>
  );
}

function DarkButton({
  label,
  onPress,
  icon,
  primary,
  disabled,
}: {
  label: string;
  onPress: () => void;
  icon?: ReactNode;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [
        st.dbtn,
        primary && { backgroundColor: colors.signal, borderColor: colors.signal },
        pressed && { opacity: 0.85 },
        disabled && { opacity: 0.4 },
      ]}
    >
      {icon}
      <T variant="label" style={{ color: primary ? colors.ink : colors.paper }}>
        {label}
      </T>
    </Pressable>
  );
}

/** Controles do Mágico de Oz para o teste: o avaliador provoca os eventos na hora certa. */
function EvaluatorPanel({
  visible,
  onClose,
  onNext,
  onOff,
  pace,
  onPace,
  stepLabel,
}: {
  visible: boolean;
  onClose: () => void;
  onNext: () => void;
  onOff: () => void;
  pace: Pace;
  onPace: (p: Pace) => void;
  stepLabel: string;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={st.backdrop}>
        <View style={st.panel}>
          <T variant="title">Painel do avaliador</T>
          <T variant="small" style={{ color: colors.inkSoft }}>
            {stepLabel}
          </T>
          <Button label="Próximo aviso agora" onPress={onNext} />
          <Button variant="danger" label="Simular: saiu do caminho" onPress={onOff} />
          <Choice
            label="Ritmo da simulação"
            value={pace}
            onChange={onPace}
            options={[
              { value: 'lento', label: 'Lento' },
              { value: 'normal', label: 'Normal' },
              { value: 'rapido', label: 'Rápido (demonstração)' },
            ]}
          />
          <Button variant="secondary" label="Fechar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const st = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.night },
  top: { flexDirection: 'row', alignItems: 'flex-end', gap: space.md, paddingHorizontal: space.lg, paddingTop: space.md, paddingBottom: space.sm },
  bar: { height: 8, marginHorizontal: space.lg, borderRadius: 4, backgroundColor: '#2C2A26', overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: colors.signal },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.lg, paddingHorizontal: space.lg },
  sign: { width: 190, height: 190, borderRadius: 24, backgroundColor: colors.signal, alignItems: 'center', justifyContent: 'center'},
  big: { color: colors.paper, textAlign: 'center' },
  vibe: { alignItems: 'center', gap: space.xs },
  caption: { alignSelf: 'stretch', gap: 4, padding: space.md, borderRadius: radius, borderWidth: border, borderColor: '#34312C' },
  hint: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  actions: { flexDirection: 'row', gap: space.sm, paddingHorizontal: space.lg },
  dbtn: { flex: 1, minHeight: 68, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.sm, borderRadius: radius, borderWidth: border, borderColor: colors.nightSoft },
  exit: { alignSelf: 'center', paddingVertical: space.md, paddingHorizontal: space.lg },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  panel: { backgroundColor: colors.paper, padding: space.lg, gap: space.md, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
});
