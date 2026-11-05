'use client';

import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    primary: {
      main: '#7B1818', // Deep Maroon / Crimson
      dark: '#5A0F0F',
      light: '#9E2A2A',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ECA51A', // Saffron Gold
      dark: '#C88710',
      light: '#F4BA42',
      contrastText: '#fff',
    },
    background: {
      default: '#F9F6F0', // Soft ivory / cream background
      paper: '#ffffff',
    },
    text: {
      primary: '#2A2A2A', // Dark charcoal
      secondary: '#5C4343', // Warm brownish-grey
    },
  },
  typography: {
    fontFamily: 'var(--font-poppins), var(--font-potti), sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em', color: '#800000' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em', color: '#800000' },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid #E5E7EB',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#800000',
          color: '#ffffff',
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
