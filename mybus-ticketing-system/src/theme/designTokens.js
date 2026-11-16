/**
 * Stitch Design System Tokens
 * Extracted and optimized for MyBus Ticketing System
 * Integrates with Material UI & Framer Motion
 */

export const tokens = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      main: '#1e3a8a', // Deep royal navy
      600: '#2563eb',
      700: '#1d4ed8',
      dark: '#172554',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
      contrastText: '#ffffff',
    },
    secondary: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      main: '#06b6d4', // Vibrant modern cyan
      600: '#0891b2',
      dark: '#0e7490',
      gradient: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
      contrastText: '#ffffff',
    },
    accent: {
      main: '#f59e0b',
      light: '#fef3c7',
      dark: '#b45309',
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    state: {
      success: {
        main: '#10b981',
        light: '#d1fae5',
        dark: '#065f46',
      },
      warning: {
        main: '#f59e0b',
        light: '#fef3c7',
        dark: '#92400e',
      },
      error: {
        main: '#ef4444',
        light: '#fee2e2',
        dark: '#991b1b',
      },
      info: {
        main: '#3b82f6',
        light: '#dbeafe',
        dark: '#1e40af',
      },
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
      subtle: '#f1f5f9',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
      muted: '#94a3b8',
      inverted: '#ffffff',
    },
    border: {
      subtle: '#f1f5f9',
      default: '#e2e8f0',
      strong: '#cbd5e1',
      focus: '#06b6d4',
    },
  },

  typography: {
    fontFamily: '"Plus Jakarta Sans", "Google Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    weights: {
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
      extraBold: 800,
    },
    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
    },
  },

  radii: {
    none: '0px',
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '22px',
    '2xl': '28px',
    full: '9999px',
  },

  shadows: {
    none: 'none',
    sm: '0 1px 3px rgba(0, 0, 0, 0.05)',
    md: '0 4px 16px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 30px rgba(0, 0, 0, 0.08)',
    xl: '0 18px 45px rgba(0, 0, 0, 0.12)',
    glowPrimary: '0 4px 20px rgba(30, 58, 138, 0.25)',
    glowSecondary: '0 4px 20px rgba(6, 182, 212, 0.35)',
    inner: 'inset 0 2px 4px rgba(0,0,0,0.06)',
  },

  motion: {
    // Standard cubic-bezier curves for fluid physics
    easeOut: [0.16, 1, 0.3, 1],
    easeStandard: [0.4, 0, 0.2, 1],
    spring: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
    springGentle: {
      type: 'spring',
      stiffness: 280,
      damping: 22,
    },
    durations: {
      fast: 0.15,
      normal: 0.25,
      slow: 0.4,
    },
    interactions: {
      hoverScale: 1.02,
      tapScale: 0.97,
    },
  },
};

export default tokens;
