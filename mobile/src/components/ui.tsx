import { router } from 'expo-router';
import type { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { tap } from '@/lib/signals';
import { border, colors, maxScale, radius, space, touch, type } from '@/lib/theme';
import { Back } from './Icons';

/** Texto com a fonte do app e limite de ampliação (respeita o tamanho de letra do sistema). */
export function T({
  style,
  variant = 'body',
  ...rest
}: TextProps & { variant?: keyof typeof type; style?: StyleProp<TextStyle> }) {
  return (
    <Text
      maxFontSizeMultiplier={maxScale}
      style={[type[variant], { color: colors.ink }, style]}
      {...rest}
    />
  );
}

type BtnVariant = 'primary' | 'secondary' | 'signal' | 'quiet' | 'danger';

export function Button({
  label,
  hint,
  onPress,
  variant = 'primary',
  icon,
  style,
  big,
  disabled,
}: {
  label: string;
  hint?: string;
  onPress: () => void;
  variant?: BtnVariant;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  big?: boolean;
  disabled?: boolean;
}) {
  const v = BTN[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [
        s.btn,
        { backgroundColor: v.bg, borderColor: v.border, minHeight: big ? 84 : touch },
        pressed && { transform: [{ translateY: 2 }], opacity: 0.9 },
        disabled && { opacity: 0.4 },
        style,
      ]}
    >
      {icon}
      <T variant={big ? 'heading' : 'label'} style={{ color: v.fg, textAlign: 'center', flexShrink: 1 }}>
        {label}
      </T>
    </Pressable>
  );
}

const BTN: Record<BtnVariant, { bg: string; fg: string; border: string }> = {
  primary: { bg: colors.ink, fg: colors.paper, border: colors.ink },
  secondary: { bg: colors.card, fg: colors.ink, border: colors.ink },
  signal: { bg: colors.signal, fg: colors.ink, border: colors.ink },
  quiet: { bg: 'transparent', fg: colors.ink, border: 'transparent' },
  danger: { bg: colors.card, fg: colors.stop, border: colors.stop },
};

/** Tela padrão: área segura, fundo papel, rolagem e cabeçalho com "Voltar" grande. */
export function Screen({
  title,
  back = true,
  children,
  footer,
  scroll = true,
}: {
  title?: string;
  back?: boolean;
  children: ReactNode;
  footer?: ReactNode;
  scroll?: boolean;
}) {
  const body = scroll ? (
    <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  ) : (
    <View style={[s.content, { flex: 1 }]}>{children}</View>
  );
  return (
    <SafeAreaView style={s.screen} edges={['top', 'bottom']}>
      {(back || title) && (
        <View style={s.header}>
          {back && router.canGoBack() && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              onPress={() => {
                tap();
                router.back();
              }}
              hitSlop={12}
              style={s.back}
            >
              <Back size={22} />
              <T variant="label">Voltar</T>
            </Pressable>
          )}
        </View>
      )}
      {title && (
        <T variant="title" accessibilityRole="header" style={s.title}>
          {title}
        </T>
      )}
      {body}
      {footer && <View style={s.footer}>{footer}</View>}
    </SafeAreaView>
  );
}

/** Escolha única com opções grandes (no lugar de sliders, difíceis para quem tem pouca prática). */
export function Choice<V extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: V;
  options: { value: V; label: string; icon?: ReactNode }[];
  onChange: (v: V) => void;
}) {
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={{ gap: space.sm }}>
      <T variant="heading">{label}</T>
      <View style={{ gap: space.sm }}>
        {options.map((o) => {
          const on = o.value === value;
          return (
            <Pressable
              key={o.value}
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              accessibilityLabel={o.label}
              onPress={() => {
                tap();
                onChange(o.value);
              }}
              style={[s.option, on && s.optionOn]}
            >
              <View style={[s.radio, on && s.radioOn]}>{on && <View style={s.radioDot} />}</View>
              {o.icon}
              <T variant={on ? 'bodyBold' : 'body'} style={{ flex: 1 }}>
                {o.label}
              </T>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/** Ajuste em degraus: "menos" e "mais" bem grandes, com o valor por extenso. */
export function Stepper({
  label,
  valueLabel,
  onMinus,
  onPlus,
  canMinus,
  canPlus,
}: {
  label: string;
  valueLabel: string;
  onMinus: () => void;
  onPlus: () => void;
  canMinus: boolean;
  canPlus: boolean;
}) {
  return (
    <View style={{ gap: space.sm }} accessibilityLabel={`${label}: ${valueLabel}`}>
      <T variant="heading">{label}</T>
      <View style={s.stepper}>
        <Button label="Menos" variant="secondary" onPress={onMinus} disabled={!canMinus} style={{ flex: 1 }} />
        <View style={s.stepValue} accessibilityLiveRegion="polite">
          <T variant="bodyBold" style={{ textAlign: 'center' }}>
            {valueLabel}
          </T>
        </View>
        <Button label="Mais" variant="secondary" onPress={onPlus} disabled={!canPlus} style={{ flex: 1 }} />
      </View>
    </View>
  );
}

export function Divider() {
  return <View style={{ height: border, backgroundColor: colors.line, marginVertical: space.sm }} />;
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  header: { minHeight: 52, paddingHorizontal: space.md, justifyContent: 'center' },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingVertical: 8, paddingRight: 12 },
  title: { paddingHorizontal: space.lg, paddingBottom: space.sm },
  content: { padding: space.lg, gap: space.lg, paddingBottom: space.xxl },
  footer: { paddingHorizontal: space.lg, paddingBottom: space.md, paddingTop: space.sm, gap: space.sm, borderTopWidth: border, borderTopColor: colors.line, backgroundColor: colors.paper },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
    borderRadius: radius,
    borderWidth: border,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    minHeight: touch,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius,
    borderWidth: border,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  optionOn: { borderColor: colors.ink, backgroundColor: colors.signal },
  radio: { width: 28, height: 28, borderRadius: 14, borderWidth: 3, borderColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  radioOn: { backgroundColor: colors.card },
  radioDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.ink },
  stepper: { flexDirection: 'row', alignItems: 'stretch', gap: space.sm },
  stepValue: { flex: 1.2, justifyContent: 'center', borderRadius: radius, borderWidth: border, borderColor: colors.line, backgroundColor: colors.card, paddingHorizontal: 4 },
});
