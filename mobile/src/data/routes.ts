import type { SignalId } from '@/lib/signals';

/**
 * Rotas FICTÍCIAS para o protótipo. Não há GPS: cada passo dura um tempo simulado.
 * Ruas, lugares e distâncias são inventados (cenário da Entrega 3: Lúcia indo ao laboratório).
 *
 * Redesign pós-pesquisa (ver pesquisa/analise-questionario.md):
 *  - As viradas e travessias citam um PONTO DE REFERÊNCIA ("na esquina da padaria"). Todos os
 *    respondentes 60+ com consentimento, 8 de 9 preferem esse formato. O nome da rua vem depois,
 *    como apoio, quando existe.
 *  - Use "na esquina de…" ou "perto de…" nas viradas e travessias: são frases que valem nos dois
 *    sentidos, então a rota de volta (makeReturnRoute) continua correta. "Depois de…" só aparece
 *    no passo 'perto', que a rota de volta não reaproveita.
 *  - Os marcos de distância confirmam "Você está no caminho certo" (resposta a "não confiar nas
 *    orientações").
 */
export type StepKind = 'siga' | 'previa' | 'vire' | 'travessia' | 'marco' | 'perto' | 'chegada';

export type Step = {
  kind: StepKind;
  /** O que a voz fala (frase curta, linguagem simples — RNF01). */
  fala: string;
  /** Texto grande mostrado na tela (para acompanhante/avaliador; a pessoa não precisa olhar). */
  tela: string;
  /** Sinal de vibração tocado neste passo, se houver. */
  sinal?: SignalId;
  /** Direção desenhada na placa. */
  seta: 'frente' | 'direita' | 'esquerda' | 'travessia' | 'chegada';
  /** Metros que faltam até o destino ao começar este passo. */
  faltam: number;
  /** Duração simulada do passo em segundos (no ritmo "normal"). */
  dur: number;
};

export type Route = {
  id: string;
  nome: string;
  tipo: string;
  distancia: number;
  minutos: number;
  resumo: string;
  passos: Step[];
};

export const ROUTES: Route[] = [
  {
    id: 'laboratorio',
    nome: 'Laboratório Vida',
    tipo: 'Exame marcado',
    distancia: 900,
    minutos: 12,
    resumo: '2 viradas e 1 travessia',
    passos: [
      { kind: 'siga', seta: 'frente', faltam: 900, dur: 7, tela: 'Siga em frente', fala: 'Caminho começado. Siga em frente pela Rua das Acácias.' },
      { kind: 'previa', seta: 'direita', faltam: 700, dur: 6, tela: 'Em 50 metros, vire à direita na padaria', fala: 'Daqui a 50 metros, vire à direita na esquina da padaria.' },
      { kind: 'vire', seta: 'direita', sinal: 'direita', faltam: 650, dur: 6, tela: 'Vire à direita na padaria', fala: 'Vire à direita agora, na esquina da padaria. É a Rua Ipê.' },
      { kind: 'marco', seta: 'frente', faltam: 500, dur: 6, tela: 'Caminho certo. Faltam 500 metros', fala: 'Você está no caminho certo. Faltam 500 metros.' },
      { kind: 'travessia', seta: 'travessia', sinal: 'travessia', faltam: 380, dur: 8, tela: 'Travessia perto da praça', fala: 'Atenção: travessia à frente, perto da praça. Atravesse na faixa.' },
      { kind: 'previa', seta: 'esquerda', faltam: 250, dur: 6, tela: 'Em 50 metros, vire à esquerda no banco', fala: 'Daqui a 50 metros, vire à esquerda na esquina do banco.' },
      { kind: 'vire', seta: 'esquerda', sinal: 'esquerda', faltam: 200, dur: 6, tela: 'Vire à esquerda no banco', fala: 'Vire à esquerda agora, na esquina do banco. É a Avenida Central.' },
      { kind: 'marco', seta: 'frente', faltam: 100, dur: 5, tela: 'Caminho certo. Faltam 100 metros', fala: 'Você está no caminho certo. Falta pouco: 100 metros.' },
      { kind: 'perto', seta: 'esquerda', faltam: 30, dur: 5, tela: 'O destino fica à sua esquerda', fala: 'O laboratório fica à sua esquerda, logo depois da banca de jornal.' },
      { kind: 'chegada', seta: 'chegada', sinal: 'chegada', faltam: 0, dur: 0, tela: 'Você chegou', fala: 'Você chegou ao Laboratório Vida.' },
    ],
  },
  {
    id: 'farmacia',
    nome: 'Farmácia Bem-Estar',
    tipo: 'Perto de casa',
    distancia: 350,
    minutos: 5,
    resumo: '1 virada, sem travessia',
    passos: [
      { kind: 'siga', seta: 'frente', faltam: 350, dur: 6, tela: 'Siga em frente', fala: 'Caminho começado. Siga em frente.' },
      { kind: 'previa', seta: 'esquerda', faltam: 220, dur: 5, tela: 'Em 50 metros, vire à esquerda no mercadinho', fala: 'Daqui a 50 metros, vire à esquerda na esquina do mercadinho.' },
      { kind: 'vire', seta: 'esquerda', sinal: 'esquerda', faltam: 170, dur: 6, tela: 'Vire à esquerda no mercadinho', fala: 'Vire à esquerda agora, na esquina do mercadinho.' },
      { kind: 'marco', seta: 'frente', faltam: 100, dur: 5, tela: 'Caminho certo. Faltam 100 metros', fala: 'Você está no caminho certo. Faltam 100 metros.' },
      { kind: 'perto', seta: 'direita', faltam: 30, dur: 5, tela: 'O destino fica à sua direita', fala: 'A farmácia fica à sua direita, ao lado da igreja.' },
      { kind: 'chegada', seta: 'chegada', sinal: 'chegada', faltam: 0, dur: 0, tela: 'Você chegou', fala: 'Você chegou à Farmácia Bem-Estar.' },
    ],
  },
  {
    id: 'ana',
    nome: 'Casa da Ana',
    tipo: 'Filha',
    distancia: 1200,
    minutos: 16,
    resumo: '2 viradas e 2 travessias',
    passos: [
      { kind: 'siga', seta: 'frente', faltam: 1200, dur: 7, tela: 'Siga em frente', fala: 'Caminho começado. Siga em frente.' },
      { kind: 'travessia', seta: 'travessia', sinal: 'travessia', faltam: 1000, dur: 8, tela: 'Travessia perto da escola', fala: 'Atenção: travessia à frente, perto da escola. Atravesse na faixa.' },
      { kind: 'previa', seta: 'direita', faltam: 800, dur: 6, tela: 'Em 50 metros, vire à direita no posto', fala: 'Daqui a 50 metros, vire à direita na esquina do posto de gasolina.' },
      { kind: 'vire', seta: 'direita', sinal: 'direita', faltam: 750, dur: 6, tela: 'Vire à direita no posto', fala: 'Vire à direita agora, na esquina do posto de gasolina.' },
      { kind: 'marco', seta: 'frente', faltam: 500, dur: 6, tela: 'Caminho certo. Faltam 500 metros', fala: 'Você está no caminho certo. Faltam 500 metros.' },
      { kind: 'travessia', seta: 'travessia', sinal: 'travessia', faltam: 400, dur: 8, tela: 'Travessia perto do ponto de ônibus', fala: 'Atenção: travessia à frente, perto do ponto de ônibus. Atravesse na faixa.' },
      { kind: 'previa', seta: 'direita', faltam: 200, dur: 6, tela: 'Em 50 metros, vire à direita na sorveteria', fala: 'Daqui a 50 metros, vire à direita na esquina da sorveteria.' },
      { kind: 'vire', seta: 'direita', sinal: 'direita', faltam: 150, dur: 6, tela: 'Vire à direita na sorveteria', fala: 'Vire à direita agora, na esquina da sorveteria.' },
      { kind: 'perto', seta: 'frente', faltam: 30, dur: 5, tela: 'O destino fica logo à frente', fala: 'A casa da Ana fica logo à frente, depois da árvore grande.' },
      { kind: 'chegada', seta: 'chegada', sinal: 'chegada', faltam: 0, dur: 0, tela: 'Você chegou', fala: 'Você chegou à casa da Ana.' },
    ],
  },
];

/** Monta a rota de volta invertendo direções (RF10). Simplificação do protótipo. */
export function makeReturnRoute(r: Route): Route {
  const flip = (s: Step): Step => {
    const map = { direita: 'esquerda', esquerda: 'direita' } as const;
    const seta = s.seta === 'direita' || s.seta === 'esquerda' ? map[s.seta] : s.seta;
    const sinal = s.sinal === 'direita' || s.sinal === 'esquerda' ? map[s.sinal] : s.sinal;
    const swap = (t: string) =>
      t.replace(/direita|esquerda/g, (m) => (m === 'direita' ? 'esquerda' : 'direita'));
    return { ...s, seta, sinal, tela: swap(s.tela), fala: swap(s.fala) };
  };
  // Inverte o miolo da rota (sem marcos de distância, que mudariam) e mantém
  // o aviso prévio ANTES da virada correspondente.
  const invertido = r.passos.slice(1, -2).filter((s) => s.kind !== 'marco').reverse().map(flip);
  const meio: Step[] = [];
  for (let i = 0; i < invertido.length; i++) {
    const s = invertido[i];
    const next = invertido[i + 1];
    if (s.kind === 'vire' && next?.kind === 'previa') {
      meio.push(next, s);
      i++;
    } else {
      meio.push(s);
    }
  }
  return {
    id: `volta-${r.id}`,
    nome: 'Voltar para casa',
    tipo: `De ${r.nome}`,
    distancia: r.distancia,
    minutos: r.minutos,
    resumo: r.resumo,
    passos: [
      { ...r.passos[0], faltam: r.distancia },
      ...meio.map((s, i) => ({ ...s, faltam: Math.round(r.distancia * (1 - (i + 1) / (meio.length + 1))) })),
      { kind: 'perto', seta: 'frente', faltam: 30, dur: 5, tela: 'Sua casa fica logo à frente', fala: 'Sua casa fica logo à frente, a 30 metros.' },
      { kind: 'chegada', seta: 'chegada', sinal: 'chegada', faltam: 0, dur: 0, tela: 'Você chegou', fala: 'Você chegou em casa.' },
    ],
  };
}

export function formatDistance(m: number) {
  if (m >= 1000) return `${(m / 1000).toFixed(1).replace('.', ',')} km`;
  return `${m} m`;
}
