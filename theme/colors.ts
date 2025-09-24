/* Centralized color tokens and role mapping for Menuz mobile */

export type ColorRole =
  | 'bg.default'
  | 'bg.subtle'
  | 'bg.elevated'
  | 'fg.primary'
  | 'fg.secondary'
  | 'fg.muted'
  | 'fg.inverse'
  | 'border.default'
  | 'border.subtle'
  | 'action.primary'
  | 'action.secondary'
  | 'action.ghost'
  | 'success.text'
  | 'success.surface'
  | 'success.border'
  | 'warning.text'
  | 'warning.surface'
  | 'warning.border'
  | 'danger.text'
  | 'danger.surface'
  | 'danger.border'
  | 'info.text'
  | 'info.surface'
  | 'info.border'
  | 'overlay.strong'
  | 'overlay.medium'
  | 'overlay.light';

const tokens = {
  // Base
  '--color-bg': '#FFFFFF',
  '--color-bg-subtle': '#F9FAFB',
  '--color-bg-elevated': '#FFFFFF',
  '--color-fg': '#374151',
  '--color-fg-muted': '#6B7280',
  '--color-border': '#E5E7EB',

  // Brand
  '--color-brand': '#FF6B35',
  '--color-brand-foreground': '#FFFFFF',
  '--color-brand-surface': '#FFF7F5',
  '--color-brand-border': '#FFE5D9',

  // Feedback
  '--color-info': '#3B82F6',
  '--color-info-surface': '#EFF6FF',
  '--color-info-border': '#BFDBFE',
  '--color-success': '#10B981',
  '--color-success-surface': '#ECFDF5',
  '--color-success-border': '#10B981',
  '--color-danger': '#EF4444',
  '--color-danger-surface': '#FEF2F2',
  '--color-danger-border': '#FECACA',
  '--color-warning': '#FFA500',
  '--color-warning-surface': '#FFF7F5',
  '--color-warning-border': '#FFE5D9',

  // States
  '--state-focus-outline': '#3B82F6',
  '--overlay-strong': 'rgba(0,0,0,0.6)',
  '--overlay-medium': 'rgba(0,0,0,0.5)',
  '--overlay-light': 'rgba(255,255,255,0.95)',
} as const;

export type TokenName = keyof typeof tokens;

const roles: Record<ColorRole, string> = {
  'bg.default': tokens['--color-bg'],
  'bg.subtle': tokens['--color-bg-subtle'],
  'bg.elevated': tokens['--color-bg-elevated'],
  'fg.primary': tokens['--color-fg'],
  'fg.secondary': tokens['--color-fg'],
  'fg.muted': tokens['--color-fg-muted'],
  'fg.inverse': '#FFFFFF',
  'border.default': tokens['--color-border'],
  'border.subtle': '#F3F4F6',
  'action.primary': tokens['--color-brand'],
  'action.secondary': tokens['--color-bg-subtle'],
  'action.ghost': 'transparent',
  'success.text': tokens['--color-success'],
  'success.surface': tokens['--color-success-surface'],
  'success.border': tokens['--color-success-border'],
  'warning.text': tokens['--color-warning'],
  'warning.surface': tokens['--color-warning-surface'],
  'warning.border': tokens['--color-warning-border'],
  'danger.text': tokens['--color-danger'],
  'danger.surface': tokens['--color-danger-surface'],
  'danger.border': tokens['--color-danger-border'],
  'info.text': tokens['--color-info'],
  'info.surface': tokens['--color-info-surface'],
  'info.border': tokens['--color-info-border'],
  'overlay.strong': tokens['--overlay-strong'],
  'overlay.medium': tokens['--overlay-medium'],
  'overlay.light': tokens['--overlay-light'],
};

export function getColor(role: ColorRole): string {
  return roles[role];
}

export const Colors = { tokens, roles, getColor };
