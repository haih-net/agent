const breakpoints = {
  xs: 480,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1920,
}

const colors = {
  // Primary colors
  primary: '#3b82f6',
  secondary: '#6b7280',
  foreground: '#1f2937',
  background: '#ffffff',
  muted: '#9ca3af',

  // States
  success: '#10b981',
  successBg: '#ecfdf5',
  error: '#ef4444',
  errorBg: '#fef2f2',
  warning: '#f59e0b',
  warningBg: '#fffbeb',
  info: '#3b82f6',
  infoBg: '#eff6ff',

  // Text
  text: {
    primary: '#1f2937',
    secondary: '#6b7280',
    disabled: '#9ca3af',
    light: '#ffffff',
  },
  textMuted: '#9ca3af',

  // Borders and dividers
  divider: '#e5e7eb',
  border: '#e5e7eb',
  borderHover: '#d1d5db',

  // Special
  star: '#fbbf24',
  starEmpty: '#e5e7eb',

  // Gray scale (Tailwind)
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
} as const

const backgrounds = {
  page: '#f5f5f5',
  paper: '#ffffff',
  elevated: '#ffffff',
  overlay: 'rgba(0, 0, 0, 0.5)',
}

export const theme = {
  colors,
  backgrounds,
  breakpoints,

  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },

  radii: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    focus: '0 0 0 3px rgba(37, 99, 235, 0.1)',
  },

  transitions: {
    fast: '0.15s ease',
    normal: '0.2s ease',
  },

  zIndex: {
    dropdown: 100,
    sticky: 200,
    header: 300,
    overlay: 400,
    modal: 500,
    popover: 600,
    tooltip: 700,
  },
}

export type Theme = typeof theme

export type ThemeProps = { theme?: Theme }
