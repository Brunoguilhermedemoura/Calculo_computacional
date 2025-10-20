/**
 * Aplicação principal da Calculadora de Limites
 */

import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './styles/globals.css';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { useSettings } from './hooks/useSettings.js';
import LoginPage from './components/auth/LoginPage.jsx';
import RegisterPage from './components/auth/RegisterPage.jsx';
import Dashboard from './components/Dashboard.jsx';
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

// Componente interno da aplicação com roteamento
const AppContent = () => {
  const { user, loading } = useAuth();
  const { settings, applyAppearance } = useSettings();
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'dashboard', 'calculator'
  const [hasVisitedDashboard, setHasVisitedDashboard] = useState(false);

  // Aplicar configurações de aparência quando carregadas
  React.useEffect(() => {
    if (settings) {
      applyAppearance();
    }
  }, [settings, applyAppearance]);

  // Lógica de roteamento baseada no estado de autenticação
  React.useEffect(() => {
    if (!loading) {
      if (user) {
        // Usuário logado - verifica se já visitou o dashboard
        if (!hasVisitedDashboard) {
          setCurrentView('dashboard');
        } else {
          setCurrentView('calculator');
        }
      } else {
        // Usuário não logado
        setCurrentView('login');
        setHasVisitedDashboard(false);
      }
    }
  }, [user, loading, hasVisitedDashboard]);

  // Handlers de navegação
  const handleSwitchToRegister = () => {
    setCurrentView('register');
  };

  const handleSwitchToLogin = () => {
    setCurrentView('login');
  };

  const handleStartCalculator = () => {
    setHasVisitedDashboard(true);
    setCurrentView('calculator');
  };

  const handleLogout = () => {
    setHasVisitedDashboard(false);
    setCurrentView('login');
  };

  // Loading state
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1E1E2F 0%, #2A2A3E 50%, #1E1E2F 100%)'
        }}>
          <div style={{ color: '#6C63FF', fontSize: '1.2rem' }}>Carregando...</div>
        </div>
      </ThemeProvider>
    );
  }

  // Renderização baseada na view atual
  switch (currentView) {
    case 'login':
      return <LoginPage onSwitchToRegister={handleSwitchToRegister} />;
    
    case 'register':
      return <RegisterPage onSwitchToLogin={handleSwitchToLogin} />;
    
    case 'dashboard':
      return (
        <Dashboard 
          onStartCalculator={handleStartCalculator}
          onLogout={handleLogout}
        />
      );
    
    case 'calculator':
      return <Calculator onLogout={handleLogout} />;
    
    default:
      return <LoginPage onSwitchToRegister={handleSwitchToRegister} />;
  }
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;