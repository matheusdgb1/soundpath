import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Modal, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ROUTES, type Route } from '@/data/routes';
import { useStore } from '@/lib/store';
import { border, colors, radius, space } from '@/lib/theme';
import { say, silence } from '@/lib/voice';
import { Mic } from './Icons';
import { Button, T } from './ui';

/**
 * Destino por voz (RF01) — SIMULADO. O reconhecimento de fala não está ligado no protótipo:
 * depois de alguns segundos "ouvindo", ele entende um dos lugares salvos.
 * O que está sendo avaliado é a interação: pedido → escuta → confirmação ("É isso?").
 */
export function VoiceDestination({
  visible,
  onClose,
  onPick,
}: {
  visible: boolean;
  onClose: () => void;
  onPick: (r: Route) => void;
}) {
  const { settings } = useStore();
  const [heard, setHeard] = useState<Route | null>(null);
  const [round, setRound] = useState(0);
  const attempt = useRef(0);
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    setHeard(null);
    const voice = { volume: settings.volume, speed: settings.speed };
    say('Pode falar o nome do lugar.', voice);
    const loop = Animated.loop(
      Animated.timing(pulse, { toValue: 1, duration: 1200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    );
    loop.start();
    const t = setTimeout(() => {
      const r = ROUTES[attempt.current % ROUTES.length];
      attempt.current += 1;
      setHeard(r);
      say(`Entendi: ${r.nome}. É isso?`, voice);
    }, 3200);
    return () => {
      clearTimeout(t);
      loop.stop();
      silence();
    };
  }, [visible, round, settings.volume, settings.speed, pulse]);

  const retry = () => setRound((n) => n + 1);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.7] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] });

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={st.screen}>
        {!heard ? (
          <View style={st.center} accessibilityLiveRegion="polite">
            <View style={st.micWrap}>
              <Animated.View style={[st.ring, { transform: [{ scale }], opacity }]} />
              <View style={st.mic}>
                <Mic size={72} />
              </View>
            </View>
            <T variant="display" style={{ textAlign: 'center' }}>
              Pode falar…
            </T>
            <T style={{ textAlign: 'center', color: colors.inkSoft }}>
              Por exemplo: "ir para o laboratório"
            </T>
          </View>
        ) : (
          <View style={st.center} accessibilityLiveRegion="polite">
            <T variant="heading" style={{ color: colors.inkSoft }}>
              Entendi:
            </T>
            <View style={st.heard}>
              <T variant="display" style={{ textAlign: 'center' }}>
                {heard.nome}
              </T>
            </View>
            <T variant="title">É isso?</T>
          </View>
        )}

        <View style={st.actions}>
          {heard && <Button big label="Sim, é esse" onPress={() => onPick(heard)} />}
          {heard && <Button variant="secondary" label="Não, falar de novo" onPress={retry} />}
          <Button variant="quiet" label={heard ? 'Escolher na lista' : 'Cancelar'} onPress={onClose} />
          <T variant="small" style={{ textAlign: 'center', color: colors.inkSoft }}>
            Simulação: o microfone não está ligado neste protótipo.
          </T>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const st = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper, padding: space.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.lg },
  micWrap: { width: 180, height: 180, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: colors.signal },
  mic: { width: 140, height: 140, borderRadius: 70, backgroundColor: colors.signal, borderWidth: 3, borderColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  heard: { paddingVertical: space.lg, paddingHorizontal: space.xl, borderRadius: radius, borderWidth: border, borderColor: colors.ink, backgroundColor: colors.signal },
  actions: { gap: space.sm },
});
