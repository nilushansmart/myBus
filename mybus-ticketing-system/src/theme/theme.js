import { createTheme } from '@mui/material/styles';
import { tokens } from './designTokens';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: tokens.colors.primary.main,
      light: tokens.colors.primary[500],
      dark: tokens.colors.primary.dark,
      contrastText: tokens.colors.primary.contrastText,
    },
    secondary: {
      main: tokens.colors.secondary.main,
      light: tokens.colors.secondary[300],
      dark: tokens.colors.secondary.dark,
      contrastText: tokens.colors.secondary.contrastText,
    },
    success: {
      main: tokens.colors.state.success.main,
      light: tokens.colors.state.success.light,
      dark: tokens.colors.state.success.dark,
    },
    warning: {
      main: tokens.colors.state.warning.main,
      light: tokens.colors.state.warning.light,
      dark: tokens.colors.state.warning.dark,
    },
    error: {
      main: tokens.colors.state.error.main,
      light: tokens.colors.state.error.light,
      dark: tokens.colors.state.error.dark,
    },
    background: {
      default: tokens.colors.background.default,
      paper: tokens.colors.background.paper,
    },
    text: {
      primary: tokens.colors.text.primary,
      secondary: tokens.colors.text.secondary,
    },
    divider: tokens.colors.border.default,
  },
  typography: {
    fontFamily: tokens.typography.fontFamily,
    h1: { fontWeight: tokens.typography.weights.extraBold, letterSpacing: '-0.025em' },
    h2: { fontWeight: tokens.typography.weights.bold, letterSpacing: '-0.02em' },
    h3: { fontWeight: tokens.typography.weights.bold, letterSpacing: '-0.02em' },
    h4: { fontWeight: tokens.typography.weights.bold, letterSpacing: '-0.015em' },
    h5: { fontWeight: tokens.typography.weights.semiBold, letterSpacing: '-0.01em' },
    h6: { fontWeight: tokens.typography.weights.semiBold },
    subtitle1: { fontWeight: tokens.typography.weights.medium },
    subtitle2: { fontWeight: tokens.typography.weights.medium },
    button: { textTransform: 'none', fontWeight: tokens.typography.weights.semiBold },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radii.md,
          padding: '10px 20px',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: tokens.shadows.md,
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        containedPrimary: {
          background: tokens.colors.primary.gradient,
        },
        containedSecondary: {
          background: tokens.colors.secondary.gradient,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radii.lg,
          boxShadow: tokens.shadows.sm,
          border: `1px solid ${tokens.colors.border.default}`,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: tokens.colors.secondary.main,
            boxShadow: tokens.shadows.md,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: tokens.typography.weights.semiBold,
          borderRadius: tokens.radii.sm,
          transition: 'all 0.15s ease',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: tokens.radii.md,
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            '&.Mui-focused fieldset': {
              borderColor: tokens.colors.secondary.main,
              boxShadow: `0 0 0 3px rgba(6, 182, 212, 0.25)`,
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: tokens.radii.lg,
        },
      },
    },
  },
});

export default theme;
