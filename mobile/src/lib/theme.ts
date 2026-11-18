/**
 * Tokens visuais do SoundPath.
 *
 * Linguagem: sinalização de rua (papel claro, tinta preta, amarelo de faixa de pedestre).
 * Decisões ligadas à Entrega 3:
 *  - Fundo claro de alto contraste: a persona Lúcia "quase não lê a tela com o sol".
 *  - Fonte Atkinson Hyperlegible: desenhada pelo Braille Institute para leitores com baixa visão.
 *  - Texto mínimo de 19 pt e alvos de toque de 64 pt ou mais (RNF06).
 *  - Cor nunca é o único sinal: todo estado tem texto + forma.
 *
 * Contrastes (WCAG 2.2): tinta sobre papel ≈ 16:1 · tinta-suave sobre papel ≈ 8:1 ·
 * tinta sobre amarelo ≈ 12:1 · papel sobre tinta ≈ 16:1.
 */
export const colors = {
  paper: '#F4EFE6',
  paperDeep: '#E8DFCF',
  card: '#FBF8F2',
  ink: '#161513',
  inkSoft: '#4A463F',
  line: '#CBBFAB',
  signal: '#FFC929',
  signalDeep: '#E0A800',
  stop: '#A3241B',
  go: '#1E6A3A',
  night: '#12110F',
  nightSoft: '#B9B1A2',
} as const;

export const fonts = {
  regular: 'AtkinsonHyperlegible_400Regular',
  bold: 'AtkinsonHyperlegible_700Bold',
} as const;

export const type = {
  display: { fontFamily: fonts.bold, fontSize: 40, lineHeight: 46 },
  title: { fontFamily: fonts.bold, fontSize: 30, lineHeight: 36 },
  heading: { fontFamily: fonts.bold, fontSize: 24, lineHeight: 30 },
  body: { fontFamily: fonts.regular, fontSize: 21, lineHeight: 29 },
  bodyBold: { fontFamily: fonts.bold, fontSize: 21, lineHeight: 29 },
  label: { fontFamily: fonts.bold, fontSize: 19, lineHeight: 24 },
  small: { fontFamily: fonts.regular, fontSize: 19, lineHeight: 25 },
} as const;

export const space = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32, xxl: 48 } as const;

export const radius = 10;
export const border = 2;
export const touch = 64;

/** Limite de ampliação do texto do sistema para não quebrar o layout (ainda permite 160%). */
export const maxScale = 1.6;
