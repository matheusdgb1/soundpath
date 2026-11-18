import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

import { colors } from '@/lib/theme';

type P = { size?: number; color?: string };

/** Seta para frente, estilo placa de trânsito. */
export function ArrowAhead({ size = 48, color = colors.ink }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Path d="M50 8 L84 44 H62 V92 H38 V44 H16 Z" fill={color} />
    </Svg>
  );
}

/** Seta de conversão. `dir="esquerda"` espelha o desenho. */
export function ArrowTurn({ size = 48, color = colors.ink, dir = 'direita' }: P & { dir?: 'direita' | 'esquerda' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G transform={dir === 'esquerda' ? 'translate(100 0) scale(-1 1)' : undefined}>
        <Path
          d="M34 94 V54 C34 44 41 38 51 38 H62"
          stroke={color}
          strokeWidth={20}
          strokeLinecap="butt"
          fill="none"
        />
        <Path d="M60 12 L94 38 L60 64 Z" fill={color} />
      </G>
    </Svg>
  );
}

/** Faixa de pedestre vista de cima. */
export function Crossing({ size = 48, color = colors.ink }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {[10, 30, 50, 70].map((y) => (
        <Rect key={y} x={10} y={y} width={80} height={12} rx={2} fill={color} />
      ))}
      <Rect x={10} y={90} width={80} height={4} fill={color} opacity={0.35} />
    </Svg>
  );
}

/** Marcador de chegada. */
export function Pin({ size = 48, color = colors.ink, fill = colors.signal }: P & { fill?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Path
        d="M50 96 C50 96 16 60 16 38 A34 34 0 0 1 84 38 C84 60 50 96 50 96 Z"
        fill={color}
      />
      <Circle cx={50} cy={38} r={14} fill={fill} />
    </Svg>
  );
}

/**
 * Marca do SoundPath: a placa de "virar" (o caminho) com duas ondas de som saindo dela.
 * Mesma geometria do ícone do app (assets/icon.png, gerado por scripts/make-icons.py).
 */
export function Mark({ size = 40, color = colors.ink, bg = colors.signal }: P & { bg?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Rect width={100} height={100} rx={18} fill={bg} />
      <Path d="M20 86 V52 A24 24 0 0 1 44 28 H54 V44 H44 A8 8 0 0 0 36 52 V86 Z" fill={color} />
      <Path d="M52 12 L80 36 L52 60 Z" fill={color} />
      <Path d="M58 70 A10 10 0 0 1 58 86" stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" />
      <Path d="M68 62 A20 20 0 0 1 68 94" stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" />
    </Svg>
  );
}

export function Mic({ size = 32, color = colors.ink }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Rect x={34} y={8} width={32} height={54} rx={16} fill={color} />
      <Path d="M20 46 A30 30 0 0 0 80 46" stroke={color} strokeWidth={8} fill="none" strokeLinecap="round" />
      <Rect x={46} y={76} width={8} height={14} fill={color} />
      <Rect x={30} y={88} width={40} height={8} rx={4} fill={color} />
    </Svg>
  );
}

export function Back({ size = 28, color = colors.ink }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Path d="M62 14 L26 50 L62 86" stroke={color} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function Chevron({ size = 24, color = colors.ink }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Path d="M36 14 L72 50 L36 86" stroke={color} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function Check({ size = 28, color = colors.ink }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Path d="M14 54 L40 80 L88 22" stroke={color} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function Pause({ size = 28, color = colors.ink }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Rect x={20} y={14} width={22} height={72} rx={4} fill={color} />
      <Rect x={58} y={14} width={22} height={72} rx={4} fill={color} />
    </Svg>
  );
}

export function Play({ size = 28, color = colors.ink }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Path d="M24 12 L86 50 L24 88 Z" fill={color} />
    </Svg>
  );
}

export function Repeat({ size = 28, color = colors.ink }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Path d="M80 46 A30 30 0 1 1 66 22" stroke={color} strokeWidth={11} fill="none" strokeLinecap="round" />
      <Path d="M58 6 L84 20 L62 40 Z" fill={color} />
    </Svg>
  );
}

export function Sliders({ size = 28, color = colors.ink }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {[22, 50, 78].map((y, i) => (
        <G key={y}>
          <Rect x={8} y={y - 5} width={84} height={10} rx={5} fill={color} />
          <Circle cx={[30, 68, 44][i]} cy={y} r={12} fill={colors.paper} stroke={color} strokeWidth={8} />
        </G>
      ))}
    </Svg>
  );
}

export function Vibrate({ size = 28, color = colors.ink }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Rect x={30} y={10} width={40} height={80} rx={8} stroke={color} strokeWidth={9} fill="none" />
      <Path d="M16 30 V70 M6 38 V62 M84 30 V70 M94 38 V62" stroke={color} strokeWidth={7} strokeLinecap="round" />
    </Svg>
  );
}

/** Desenha a placa certa para um passo da rota. */
export function StepSign({
  seta,
  size = 120,
  color = colors.ink,
}: {
  seta: 'frente' | 'direita' | 'esquerda' | 'travessia' | 'chegada';
  size?: number;
  color?: string;
}) {
  switch (seta) {
    case 'direita':
    case 'esquerda':
      return <ArrowTurn size={size} color={color} dir={seta} />;
    case 'travessia':
      return <Crossing size={size} color={color} />;
    case 'chegada':
      return <Pin size={size} color={color} fill={colors.paper} />;
    default:
      return <ArrowAhead size={size} color={color} />;
  }
}
