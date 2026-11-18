# SoundPath

**Orientação a pé por voz e vibração, sem precisar olhar a tela.**

Projeto de Design de Interação (IHC) do curso de Ciência da Computação da Dom Helder Escola Superior, 2º semestre de 2026.

O desafio da disciplina pergunta como o Design de Interação pode tornar a mobilidade urbana mais acessível, compreensível, segura e autônoma. O foco é o **design da interação**: o app deste repositório é um protótipo navegável, feito para ser testado com pessoas, e não um produto pronto.

---

## O problema

> Como orientar uma pessoa com 60 anos ou mais, durante uma caminhada até um lugar que ela não conhece, usando voz e vibração, de modo que ela não precise parar nem olhar para a tela, continue ouvindo a rua e não precise ter muita experiência com o celular?
>
> Problema de interação formulado na Entrega 3 (Definição).

| | |
|---|---|
| **Público** | Pessoas com 60 anos ou mais que caminham pela cidade, com diferentes níveis de uso do celular |
| **Contexto** | Ir a pé até um destino novo, em rua com trânsito, calçadas irregulares e barulho |
| **Tarefa** | Seguir uma rota sabendo quando virar, quanto falta, quando há travessia e quando chegou |
| **Barreira** | Os mapas atuais exigem olhar e tocar na tela: a pessoa para de andar, divide a atenção com a rua e pode ter dificuldade de leitura |

A persona principal é a **Lúcia, 67 anos**. Ela usa mapa no celular, mas "tem que parar a cada esquina para ver se está no caminho certo".

---

## O protótipo (app)

Fica na pasta [`mobile/`](mobile/). É um app em **Expo (React Native)** que roda no celular de verdade pelo aplicativo **Expo Go**. Voz e vibração são reais; a rota e a localização são simuladas.

### Fluxo principal

```
Início ──► Resumo do caminho ──► Caminhada ("modo bolso") ──► Chegada
  │            │                    │                            │
  │            └─► Ajustes          ├─ toque na tela = repetir   └─► Salvar caminho de volta
  ├─► Falar o destino (simulado)    ├─ "Quanto falta?"
  └─► Os 4 sinais + treino          └─ Pausar / Encerrar
```

| Tela | O que a pessoa faz | Requisitos (Entrega 3) |
|---|---|---|
| **Início** | Escolhe um lugar salvo ou fala o destino | RF01, RNF06 |
| **Falar o destino** | Fala, ouve "Entendi: Laboratório Vida. É isso?" e confirma | RF01 (reconhecimento de voz simulado) |
| **Os 4 sinais** | Sente cada vibração e faz um treino de 4 rodadas sem olhar | RNF02 |
| **Resumo do caminho** | Vê distância, tempo e checklist ("não precisa de fone") e começa | RNF04, RNF05 |
| **Caminhada** | Guarda o celular. Recebe voz e vibração a cada aviso. Toca em qualquer lugar da tela para repetir | RF02 a RF08, RNF05 |
| **Chegada** | Recebe a vibração de chegada e pode salvar o caminho de volta | RF04, RF10 |
| **Ajustes** | Escolhe só voz, só vibração ou os dois; volume; velocidade da fala; força da vibração | RF09, RNF03, RNF07 |

### Os 4 sinais de vibração

O RNF02 limita o app a 4 padrões. Eles se diferenciam pela **quantidade** e pelo **ritmo** dos toques:

| Sinal | Ritmo | Ideia |
|---|---|---|
| Virar à direita | `● ●` dois toques curtos | rápido, rápido |
| Virar à esquerda | `━━━` um toque longo | um só, comprido |
| Travessia à frente | `● ● ● ● ●` cinco toques rápidos | alarme: atenção na rua |
| Você chegou | `━━ ━━ ━━` três toques longos e lentos | calmo, encerra |

"Saiu do caminho" (RF08) usa **só a voz**, de propósito: um quinto padrão aumentaria a confusão entre avisos, que é a dificuldade da persona Teresa.

### Decisões de interação e de acessibilidade

- **A tela é secundária.** Durante a caminhada tudo chega por voz e vibração. O fundo escuro do "modo bolso" mostra que não é preciso olhar.
- **Repetir com um toque em qualquer lugar da tela.** No app final isso seria o botão de volume. No Expo Go não é possível capturar esse botão, então o protótipo simula a ação.
- **Sem fone obrigatório.** A fala sai pelo alto-falante, para a pessoa continuar ouvindo o trânsito (RNF04).
- **Linguagem simples.** Frases curtas e nada de "háptico" ou "áudio espacial" na interface (RNF01).
- **Leitura fácil no sol.** Fundo claro, contraste alto (tinta sobre papel ≈ 16:1), fonte **Atkinson Hyperlegible** (criada pelo Braille Institute para baixa visão), texto de 19 pt ou mais e botões de 64 pt ou mais (RNF06).
- **Sem sliders.** Os ajustes usam opções grandes e botões "Menos / Mais".
- **Legenda da voz na tela.** Ajuda quem ouve pouco e permite que a turma e a professora acompanhem a demonstração. O ritmo da vibração também aparece desenhado.
- **Nada de "áreas perigosas".** Avisos de assalto ficaram fora do escopo (Won't da Entrega 3), por falta de dados confiáveis e pelo risco de estigmatizar bairros.
- **Nenhum dado guardado.** Fechar o app volta tudo ao padrão (RNF08). Assim, cada participante do teste começa do mesmo ponto.

### O que é simulado

| Funcionalidade | No protótipo |
|---|---|
| GPS e rota | 3 rotas fictícias. Cada passo dura alguns segundos |
| Reconhecimento de voz | Finge ouvir e "entende" um lugar salvo |
| Botão de volume | Toque em qualquer lugar da tela de caminhada |
| Sair do caminho | Acionado pelo avaliador |

---

## Como rodar

**Pré-requisitos:** Node.js 20 ou mais recente e o app **Expo Go** no celular (Play Store ou App Store).

```bash
cd mobile
npm install
npm run tunel        # recomendado: funciona em qualquer rede
```

Depois é só escanear o QR code com o Expo Go (Android) ou com a câmera (iPhone).

| Comando | Quando usar |
|---|---|
| `npm run tunel` | **Padrão.** Passa por um túnel na internet e não depende de estar na mesma rede nem do firewall |
| `npm start` | Mais rápido, mas o celular e o PC precisam estar no **mesmo Wi-Fi** e o firewall (Windows/Norton) precisa liberar o Node na porta 8081 |
| `npm run web` | Abre no navegador do PC, útil para projetar. Lá não tem vibração e a voz depende do navegador |

**Se o celular não carregar:**
1. Use `npm run tunel`.
2. Se o PC tiver o **Hotspot do Windows** ligado, o QR code pode apontar para o endereço errado (`192.168.137.x`). Desligue o hotspot ou use o túnel.
3. Se aparecer erro de versão no Expo Go, atualize o app na loja, porque o projeto usa o **Expo SDK 58**.
4. Pare o servidor (Ctrl+C) e rode de novo limpando o cache: `npx expo start -c --tunnel`.

> **iPhone:** no modo silencioso a voz não toca, então tire o celular do silencioso.
> **Android:** a força da vibração é simulada alongando os toques, porque a API padrão não controla a intensidade.

---

## Para o teste de usabilidade

- **Painel do avaliador ("Mágico de Oz"):** na tela de caminhada, segure o dedo por cerca de 1 segundo no topo (onde aparece "Indo para…"). O painel permite:
  - disparar o próximo aviso na hora certa;
  - simular "saiu do caminho";
  - mudar o ritmo da simulação (lento, normal ou rápido).
- **Treino dos sinais:** a tela "Os 4 sinais" tem um treino de 4 rodadas. Use os acertos como medida de quanto os padrões de vibração se distinguem.
- **Segurança:** faça o teste em ambiente controlado e com supervisão. **Nunca** com participantes vendados em via pública. O protótipo não detecta perigos reais.

---

## Estrutura do repositório

```
mobile/                 App Expo (protótipo atual)
  src/app/              Telas (Expo Router: cada arquivo é uma tela)
  src/components/       Botões, ícones desenhados em SVG, glifo de vibração
  src/lib/              Sinais de vibração, voz, estado, simulação da caminhada
  src/data/routes.ts    Rotas fictícias
  scripts/make-icons.py Gera os ícones do app
index.html              Protótipo v1 (web), entregue na Entrega 4 e mantido para o "antes x depois"
```

## Etapas do projeto

| # | Etapa | Data | Status |
|---|---|---|---|
| 1 | Proposta e organização | 25/09/2026 | Entregue |
| 2 | Investigação (questionário para pessoas 60+) | 09/10/2026 | Entregue |
| 3 | Definição (proto-personas, jornada, requisitos) | 30/10/2026 | Entregue |
| 4 | Protótipo | 13/11/2026 | v1 web entregue; v2 app neste repositório |
| 5 | Teste de usabilidade | 19/11/2026 | — |
| 6 | Redesign e apresentação final | 27/11/2026 | — |

## Equipe

| Integrante | Papel |
|---|---|
| Kauã Rodrigues Queiroz Pires | Project Lead |
| João Batista da Cruz Rezende | UX Researcher |
| William Diego Rodrigues Souza | UX Researcher |
| Walen Kildely Aquino Aquiar | Product Owner / Product Designer |
| João Pedro Andrade Seixas | UX/UI Designer |
| Matheus Freire Anacleto | UX/UI Designer |
| Leonardo Nascimento Mariano | UX Evaluator |
| Fernando Marques | a definir |

Todos atuam em todas as etapas. Os papéis servem para organizar as responsabilidades.

## Uso de IA

A disciplina pede que a equipe informe as ferramentas de IA usadas e como usou cada resultado.

| Ferramenta | Como foi utilizada | Como a equipe utilizou o resultado |
|---|---|---|
| Claude (Claude Code) | Implementação do código do app (v2) a partir dos requisitos e decisões da Entrega 3 | *A equipe completa: o que foi revisado, alterado ou descartado* |
| *…* | *…* | *…* |
