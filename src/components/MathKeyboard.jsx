/**
 * Componente de teclado matemático virtual
 */

import React from 'react';
import {
  Box,
  Grid,
  Button,
  Paper,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  KeyboardArrowDown,
  Backspace
} from '@mui/icons-material';

const MathKeyboard = ({ onKeyPress, onClose }) => {
  // Array de teclas organizadas em linhas
  const keyRows = [
    ['x', 'y', 'z', 'π', '7', '8', '9', '(', ')'],
    ['x²', 'x³', '√', 'e', '4', '5', '6', '*', '/'],
    ['sin', 'cos', 'tan', 'log', '1', '2', '3', '+', '-'],
    ['csc', 'sec', 'cot', ',', '0', '.', '=', 'Backspace']
  ];

  // Mapeamento de teclas especiais para texto correto
  const keyMapping = {
    'x²': 'x**2',
    'x³': 'x**3',
    '√': 'sqrt()',
    'π': 'pi',
    'sin': 'sin()',
    'cos': 'cos()',
    'tan': 'tan()',
    'csc': 'csc()',
    'sec': 'sec()',
    'cot': 'cot()',
    'log': 'log()',
    'Backspace': 'backspace'
  };

  const handleKeyClick = (key) => {
    const mappedKey = keyMapping[key] || key;
    onKeyPress(mappedKey);
  };

  const getKeyStyle = (key) => {
    const isSpecial = ['x²', 'x³', '√', 'π', 'e', 'sin', 'cos', 'tan', 'csc', 'sec', 'cot', 'log'].includes(key);
    const isOperator = ['+', '-', '*', '/', '=', '(', ')'].includes(key);
    const isNumber = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].includes(key);
    const isBackspace = key === 'Backspace';

    return {
      minHeight: 48,
      fontSize: isSpecial ? '0.8rem' : '1rem',
      fontWeight: isSpecial ? 600 : 500,
      fontFamily: 'JetBrains Mono, monospace',
      borderRadius: 12,
      textTransform: 'none',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      background: isBackspace 
        ? 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)'
        : isSpecial
        ? 'linear-gradient(135deg, #6C63FF 0%, #8B7FFF 100%)'
        : isOperator
        ? 'linear-gradient(135deg, #00D2FF 0%, #33DBFF 100%)'
        : isNumber
        ? 'linear-gradient(135deg, #FFD166 0%, #FFD980 100%)'
        : 'linear-gradient(135deg, rgba(30, 30, 47, 0.8) 0%, rgba(42, 42, 62, 0.8) 100%)',
      color: '#FFFFFF',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        ...(isBackspace && {
          background: 'linear-gradient(135deg, #FF5252 0%, #FF7979 100%)'
        }),
        ...(isSpecial && {
          background: 'linear-gradient(135deg, #4A42CC 0%, #6B5FFF 100%)'
        }),
        ...(isOperator && {
          background: 'linear-gradient(135deg, #00A8CC 0%, #00C4E6 100%)'
        }),
        ...(isNumber && {
          background: 'linear-gradient(135deg, #E6B800 0%, #FFD700 100%)'
        })
      },
      '&:active': {
        transform: 'translateY(0px)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      }
    };
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mt: 2,
        background: 'rgba(30, 30, 47, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Efeito de brilho no topo */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, #6C63FF, #00D2FF, #FFD166, #6C63FF)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 3s ease-in-out infinite'
      }} />

      {/* Cabeçalho do teclado */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 2 
      }}>
        <Typography variant="h6" sx={{ 
          color: '#6C63FF', 
          fontWeight: 700,
          fontSize: '1rem',
          fontFamily: 'JetBrains Mono, monospace'
        }}>
          ⌨️ Teclado Matemático
        </Typography>
        <Tooltip title="Fechar teclado">
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: '#B8B8CC',
              '&:hover': {
                color: '#6C63FF',
                background: 'rgba(108, 99, 255, 0.1)'
              }
            }}
          >
            <KeyboardArrowDown />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Grid de teclas */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {keyRows.map((row, rowIndex) => (
          <Grid container spacing={1} key={rowIndex}>
            {row.map((key, keyIndex) => (
              <Grid item xs key={keyIndex}>
                <Button
                  fullWidth
                  onClick={() => handleKeyClick(key)}
                  sx={getKeyStyle(key)}
                  startIcon={key === 'Backspace' ? <Backspace /> : null}
                >
                  {key === 'Backspace' ? '' : key}
                </Button>
              </Grid>
            ))}
          </Grid>
        ))}
      </Box>

      {/* Dica de uso */}
      <Typography variant="caption" sx={{
        display: 'block',
        textAlign: 'center',
        mt: 2,
        color: '#8B8B9E',
        fontStyle: 'italic'
      }}>
        💡 Dica: Clique nas teclas para inserir símbolos matemáticos
      </Typography>
    </Paper>
  );
};

export default MathKeyboard;
