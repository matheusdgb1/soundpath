# CLAUDE.md — SoundPath

Contexto para sessões do Claude Code neste repositório. O README.md tem a visão geral do projeto. Este arquivo traz as regras de trabalho e o que não pode quebrar.

## O que é

Trabalho prático de **Design de Interação / IHC** (Dom Helder, Ciência da Computação, 2026). O SoundPath orienta pessoas com 60 anos ou mais em caminhadas por voz e vibração, sem que elas precisem olhar a tela. A professora avalia o **processo de design**: pesquisa → problema → decisões → teste → redesign. Não avalia a sofisticação do código. O app é um **protótipo de média fidelidade** para testes de usabilidade.

## Regras de trabalho

- **Idioma:** tudo em português do Brasil, tanto o texto da interface quanto os comentários e a documentação.
- **Repositório:** é de outro integrante (`matheusdgb1/soundpath`) e é **público**.
  - Trabalhe sempre em branch própria, nunca direto na `main`.
  - Não faça push sem pedir.
- **`docs/` está no `.gitignore`.** A pasta tem enunciados, slides de aula, nomes e e-mails, e serve só como contexto local. Nunca a versione e nunca copie dados pessoais dela para arquivos versionados (o e-mail da professora, por exemplo).
- **`index.html`** é o protótipo v1 (web, Entrega 4). Não apague: a apresentação final precisa mostrar o "antes × depois".

## Fonte da verdade do design

A **Entrega 3** (Definição) manda: personas, jornada, problema e requisitos RF01–RF10 e RNF01–RNF08. Quando algo entrar em conflito com a Entrega 1, vale a Entrega 3. Regras que já foram decididas:

- **No máximo 4 padrões de vibração:** direita, esquerda, travessia e chegada (RNF02). A única fonte desses padrões é `mobile/src/lib/signals.ts`. "Saiu do caminho" usa só voz.
- **Fone não é obrigatório.** A fala sai pelo alto-falante (RNF04). Não volte com a tela "coloque seus fones".
- **Sem avisos de "área com histórico de assaltos"** (Won't). Áudio espacial é hipótese, não requisito.
- **Nenhuma ação obrigatória na tela durante a caminhada** (RNF05).
- **Linguagem simples:** frases curtas, sem termos técnicos na interface (RNF01).
- **Acessibilidade visual:**
  - fonte Atkinson Hyperlegible;
  - texto de 19 pt ou mais;
  - alvos de toque de 64 pt ou mais;
  - contraste AA ou maior;
  - cor nunca é o único sinal;
  - nada de sliders: use `Choice` ou `Stepper`.
- **Visual de sinalização de rua:** papel `#F4EFE6`, tinta `#161513` e amarelo `#FFC929`. Os ícones são desenhados à mão em SVG, em `Icons.tsx`. Evite a estética genérica "feita por IA": gradientes, glassmorphism, neon, emojis ou ícones de biblioteca.
- **Tudo o que for simulado** (GPS, reconhecimento de voz, botão de volume) precisa estar dito como simulação na interface ou no README.

## App (`mobile/`)

Expo SDK 58, React Native 0.88, Expo Router (rotas em `src/app/`) e TypeScript estrito. Leia **`mobile/AGENTS.md`**: a API do Expo muda a cada SDK, então consulte a documentação da versão em vez de confiar na memória.

```bash
cd mobile
npm install
npm run tunel             # roda no celular pelo Expo Go via túnel (padrão da equipe: rede da faculdade/Norton/hotspot atrapalham a LAN)
npm run web               # navegador (precisa de react-native-web, já instalado)
npx tsc --noEmit          # typecheck
npx expo-doctor           # versões e configuração
npx expo install <pacote> # SEMPRE use este em vez de npm install <pacote>
```

Verificação antes de dizer que está pronto: `npx tsc --noEmit`, `npx expo-doctor` e um bundle com `npx expo export --platform android --platform ios --output-dir <pasta temporária>`.

Só use módulos que existem no **Expo Go**. A equipe testa sem development build.

### Mapa do código

| Arquivo | Papel |
|---|---|
| `src/lib/signals.ts` | Os 4 padrões de vibração. Android usa `Vibration` com padrão; iOS combina `Haptics` com `Vibration` |
| `src/lib/voice.ts` | `expo-speech` em pt-BR. Sempre interrompe a fala anterior |
| `src/lib/store.tsx` | Estado em memória: ajustes, rotas salvas, treino feito |
| `src/lib/useCaminhada.ts` | Simulação da caminhada. Fases: preparando, andando, pausado, fora, chegou |
| `src/data/routes.ts` | Rotas fictícias e rota de volta (RF10) |
| `src/app/caminhada.tsx` | Modo bolso. O painel do avaliador abre com toque longo no topo |
| `src/components/ui.tsx` | `T`, `Button`, `Screen`, `Choice`, `Stepper` |

## Prazos

- **Teste de usabilidade:** 19/11/2026.
- **Redesign e apresentação final (pitch de 7 minutos):** 27/11/2026.

Mudanças feitas depois do teste precisam ficar registradas, porque a apresentação final mostra o antes e o depois.
