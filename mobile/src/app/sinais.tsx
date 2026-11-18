import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Check, StepSign } from '@/components/Icons';
import { SignalGlyph } from '@/components/SignalGlyph';
import { Button, Screen, T } from '@/components/ui';
import { SIGNAL_ORDER, SIGNALS, playSignal, type SignalId } from '@/lib/signals';
import { useStore } from '@/lib/store';
import { border, colors, radius, space } from '@/lib/theme';
import { say } from '@/lib/voice';

const SIGN_OF: Record<SignalId, 'direita' | 'esquerda' | 'travessia' | 'chegada'> = {
  direita: 'direita',
  esquerda: 'esquerda',
  travessia: 'travessia',
  chegada: 'chegada',
};

function shuffle<T>(a: T[]) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/**
 * Conhecer e treinar os 4 sinais de vibração antes de sair.
 * O treino também é uma ferramenta de TESTE: mede se as pessoas distinguem os padrões
 * (hipótese de RNF02) — o avaliador anota os acertos.
 */
export default function Sinais() {
  const { settings, setTrained } = useStore();
  const voice = { volume: settings.volume, speed: settings.speed };
  const [playing, setPlaying] = useState<Record<SignalId, number>>({ direita: 0, esquerda: 0, travessia: 0, chegada: 0 });

  const [quiz, setQuiz] = useState<SignalId[] | null>(null);
  const [round, setRound] = useState(0);
  const [hits, setHits] = useState(0);
  const [answer, setAnswer] = useState<SignalId | null>(null);
  const [quizKey, setQuizKey] = useState(0);

  const feel = (id: SignalId) => {
    playSignal(id, settings.intensity);
    setPlaying((p) => ({ ...p, [id]: p[id] + 1 }));
    say(SIGNALS[id].nome, voice);
  };

  const current = quiz?.[round];
  const done = quiz && round >= quiz.length;

  const startQuiz = () => {
    const q = shuffle(SIGNAL_ORDER);
    setQuiz(q);
    setRound(0);
    setHits(0);
    setAnswer(null);
    setTimeout(() => {
      playSignal(q[0], settings.intensity);
      setQuizKey((k) => k + 1);
    }, 600);
    say('Sinta a vibração e escolha qual é.', voice);
  };

  const replay = () => {
    if (!current) return;
    playSignal(current, settings.intensity);
    setQuizKey((k) => k + 1);
  };

  const choose = (id: SignalId) => {
    if (!current || answer) return;
    setAnswer(id);
    const ok = id === current;
    if (ok) setHits((h) => h + 1);
    say(ok ? `Isso! ${SIGNALS[current].nome}.` : `Quase. Esse era: ${SIGNALS[current].nome}.`, voice);
  };

  const nextRound = () => {
    if (!quiz) return;
    const n = round + 1;
    setRound(n);
    setAnswer(null);
    if (n < quiz.length) {
      setTimeout(() => {
        playSignal(quiz[n], settings.intensity);
        setQuizKey((k) => k + 1);
      }, 400);
    } else {
      setTrained(true);
    }
  };

  const options = useMemo(() => SIGNAL_ORDER, []);

  return (
    <Screen title="Os 4 sinais de vibração">
      <T>Cada aviso vibra de um jeito. Toque em "Sentir" para experimentar. A voz também fala o nome do sinal.</T>

      {SIGNAL_ORDER.map((id) => (
        <View key={id} style={st.card}>
          <View style={st.cardTop}>
            <View style={st.icon}>
              <StepSign seta={SIGN_OF[id]} size={44} />
            </View>
            <View style={{ flex: 1 }}>
              <T variant="heading">{SIGNALS[id].nome}</T>
              <T variant="small" style={{ color: colors.inkSoft }}>
                {SIGNALS[id].descricao}
              </T>
            </View>
          </View>
          <SignalGlyph id={id} playKey={playing[id]} intensity={settings.intensity} />
          <T variant="small">{SIGNALS[id].dica}</T>
          <Button variant="secondary" label="Sentir" onPress={() => feel(id)} />
        </View>
      ))}

      <View style={st.quiz}>
        <T variant="title" accessibilityRole="header">
          Vamos treinar?
        </T>

        {!quiz && (
          <>
            <T>O celular vai vibrar 4 vezes. Sem olhar, escolha qual sinal você sentiu.</T>
            <Button big variant="signal" label="Começar o treino" onPress={startQuiz} />
          </>
        )}

        {quiz && !done && current && (
          <>
            <T variant="bodyBold">
              Sinal {round + 1} de {quiz.length}
            </T>
            <View style={{ alignItems: 'center', paddingVertical: space.sm }}>
              {answer ? (
                <SignalGlyph id={current} playKey={quizKey} intensity={settings.intensity} />
              ) : (
                <T variant="heading">Qual foi?</T>
              )}
            </View>
            {!answer && <Button variant="secondary" label="Sentir de novo" onPress={replay} />}
            {options.map((id) => {
              const isRight = answer && id === current;
              const isWrong = answer === id && id !== current;
              return (
                <Button
                  key={id}
                  variant={isRight ? 'signal' : isWrong ? 'danger' : 'secondary'}
                  label={SIGNALS[id].nome}
                  icon={isRight ? <Check size={24} /> : undefined}
                  onPress={() => choose(id)}
                  disabled={!!answer && !isRight && !isWrong}
                />
              );
            })}
            {answer && <Button label={round + 1 < quiz.length ? 'Próximo sinal' : 'Ver resultado'} onPress={nextRound} />}
          </>
        )}

        {done && (
          <>
            <T variant="heading" accessibilityLiveRegion="polite">
              Você acertou {hits} de {quiz.length}.
            </T>
            <T>
              {hits === quiz.length
                ? 'Ótimo! Você já conhece os sinais.'
                : 'Tudo bem. Você pode treinar de novo, ou usar só a voz nos Ajustes.'}
            </T>
            <Button label="Pronto, voltar ao início" onPress={() => router.back()} />
            <Button variant="secondary" label="Treinar de novo" onPress={startQuiz} />
          </>
        )}
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  card: { gap: space.sm, padding: space.md, borderRadius: radius, borderWidth: border, borderColor: colors.ink, backgroundColor: colors.card },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  icon: { width: 64, height: 64, borderRadius: radius, backgroundColor: colors.signal, borderWidth: border, borderColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  quiz: { gap: space.sm, padding: space.md, borderRadius: radius, backgroundColor: colors.paperDeep },
});
