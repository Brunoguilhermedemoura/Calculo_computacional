import React from 'react';
import { Box, Button, Paper, Typography, IconButton, Tooltip } from '@mui/material';
import { KeyboardArrowDown, Backspace as BackspaceIcon } from '@mui/icons-material';

// Definição das teclas, organizadas em linhas de 5 botões
const keyRows = [
  ['sin', 'cos', 'tan', 'log', 'e'],
  ['csc', 'sec', 'cot', '√', 'x'],
  ['y', 'z', 'π', 'x²', 'x³'],
  ['(', ')', '*', '/', '+'],
  ['-', '=', ',', '.', ''],
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['0', 'Backspace']
];

const MathKeyboard = ({ onKeyPress, onClose }) => {
  const handleKeyClick = (key) => {
    // Mapeamento de teclas especiais para o valor a ser inserido
    const keyMapping = {
      'x²': 'x^2',
      'x³': 'x^3',
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
    const valueToSend = keyMapping[key] || key;
    onKeyPress(valueToSend);
  };

  const getKeyStyle = (key) => {
    const isFunction = ['sin', 'cos', 'tan', 'csc', 'sec', 'cot', 'log', '√'].includes(key);
    const isOperator = ['+', '-', '*', '/', '=', '(', ')'].includes(key);
    const isNumber = !isNaN(parseFloat(key)) && isFinite(key) || key === '.';
    const isAction = key === 'Backspace';

    let backgroundColor = '#2A2A3E'; // Cor padrão
    if (isFunction) backgroundColor = '#5C54A5'; // Roxo
    if (isOperator) backgroundColor = '#008C9E'; // Ciano
    if (isNumber) backgroundColor = '#424262';   // Cinza escuro
    if (isAction) backgroundColor = '#D32F2F';   // Vermelho

    return {
      minHeight: 48,
      fontFamily: 'JetBrains Mono, monospace',
      borderRadius: '12px',
      textTransform: 'none',
      color: '#FFFFFF',
      background: backgroundColor,
      '&:hover': {
        background: '#6C63FF', // Cor de hover para todas
        transform: 'translateY(-2px)'
      }
    };
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mt: 2,
        background: 'rgba(30, 30, 47, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ color: '#B8B8CC', fontFamily: 'JetBrains Mono, monospace' }}>
          ⌨️ Teclado Matemático
        </Typography>
        <Tooltip title="Fechar teclado">
          <IconButton onClick={onClose} size="small" sx={{ color: '#B8B8CC', '&:hover': { background: 'rgba(108, 99, 255, 0.1)' } }}>
            <KeyboardArrowDown />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Renderização por linhas para garantir o layout */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {keyRows.map((row, rowIndex) => (
          <Box 
            key={rowIndex}
            sx={{ 
              display: 'flex', 
              gap: 1,
              width: '100%'
            }}
          >
            {row.map((key, keyIndex) => {
              if (key === '') return <Box key={`empty-${rowIndex}-${keyIndex}`} sx={{ flex: 1 }} />;
              
              // Aumentar tamanho dos botões . e , e = na linha 5
              const isPunctuation = (key === '.' || key === ',') && rowIndex === 4;
              const isEquals = key === '=' && rowIndex === 4;
              
              return (
                <Button
                  key={key}
                  onClick={() => handleKeyClick(key)}
                  sx={{
                    ...getKeyStyle(key),
                    flex: isPunctuation ? 4050.0 : isEquals ? 2700.0 : 1800.0,
                    minWidth: 0
                  }}
                >
                  {key === 'Backspace' ? <BackspaceIcon fontSize="small" /> : key}
                </Button>
              );
            })}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default MathKeyboard;