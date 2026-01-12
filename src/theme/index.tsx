const breakpoints = {
  xs: 480,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1920,
}

const colors = {
  // Primary colors
  primary: '#2196f3',
  secondary: '#757575',

  // States
  success: '#4caf50',
  successBg: '#e8f5e9',
  error: '#f44336',
  errorBg: '#ffebee',
  warning: '#ff9800',
  warningBg: '#fff3e0',
  info: '#2196f3',
  infoBg: '#e3f2fd',

  // Text
  text: {
    primary: '#333',
    secondary: '#757575',
    disabled: '#9e9e9e',
    light: '#ffffff',
  },
  textMuted: '#9e9e9e',

  // Borders and dividers
  divider: '#e0e0e0',
  border: '#e0e0e0',
  borderHover: '#bdbdbd',

  // Special
  star: '#ffc107',
  starEmpty: '#e0e0e0',
}

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
