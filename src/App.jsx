/**
 * Aplicação principal da Calculadora de Limites
 */

import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './styles/globals.css';
import Calculator from './components/Calculator.jsx';

// Tema educacional moderno com neumorfismo
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6C63FF',
      light: '#8B7FFF',
      dark: '#4A42CC',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00D2FF',
      light: '#33DBFF',
      dark: '#00A8CC',
    },
    background: {
      default: '#1E1E2F',
      paper: 'rgba(30, 30, 47, 0.8)',
    },
    success: {
      main: '#00D2FF',
      light: '#33DBFF',
    },
    info: {
      main: '#6C63FF',
      light: '#8B7FFF',
    },
    warning: {
      main: '#FFD166',
      light: '#FFD980',
    },
    error: {
      main: '#FF6B6B',
      light: '#FF8E8E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B8B8CC',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      'JetBrains Mono',
      'IBM Plex Sans',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
      color: '#FFFFFF',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
      color: '#B8B8CC',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
    body1: {
      color: '#B8B8CC',
    },
    body2: {
      color: '#8B8B9E',
    },
  },
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
          boxShadow: '0 8px 32px rgba(108, 99, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4A42CC 0%, #00A8CC 100%)',
            boxShadow: '0 12px 40px rgba(108, 99, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          border: '2px solid rgba(108, 99, 255, 0.3)',
          background: 'rgba(30, 30, 47, 0.6)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            border: '2px solid rgba(108, 99, 255, 0.6)',
            background: 'rgba(108, 99, 255, 0.1)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'rgba(30, 30, 47, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            background: 'rgba(30, 30, 47, 0.6)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(108, 99, 255, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              border: '2px solid rgba(108, 99, 255, 0.4)',
              boxShadow: '0 4px 20px rgba(108, 99, 255, 0.1)',
            },
            '&.Mui-focused': {
              border: '2px solid #6C63FF',
              boxShadow: '0 0 0 4px rgba(108, 99, 255, 0.2)',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 500,
          background: 'rgba(108, 99, 255, 0.1)',
          border: '1px solid rgba(108, 99, 255, 0.3)',
          color: '#6C63FF',
          '&:hover': {
            background: 'rgba(108, 99, 255, 0.2)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(30, 30, 47, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(108, 99, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Calculator />
    </ThemeProvider>
  );
}

export default App;