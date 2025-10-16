/**
 * Componente de entrada de dados da calculadora
 */

import React from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  ButtonGroup,
  Paper,
  Typography,
  Alert,
  Chip
} from '@mui/material';
import {
  Calculate,
  Help,
  Functions,
  PlaylistPlay,
  Refresh,
  Lightbulb,
  ShowChart
} from '@mui/icons-material';
import { DIRECTION_OPTIONS } from '../utils/constants.js';
import SyntaxTipsModal from './SyntaxTipsModal.jsx';

const InputSection = ({
  functionValue,
  setFunctionValue,
  limitPoint,
  setLimitPoint,
  direction,
  setDirection,
  onCalculate,
  onExamples,
  onHelp,
  onGraph,
  isCalculating,
  error,
  validation,
  suggestions
}) => {
  const [showSyntaxTips, setShowSyntaxTips] = React.useState(false);
  return (
    <Paper elevation={0} sx={{ 
      p: 4, 
      height: 'fit-content',
      background: 'rgba(30, 30, 47, 0.8)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 16,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Efeito de brilho */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #6C63FF, #00D2FF, #FFD166, #6C63FF)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 3s ease-in-out infinite'
      }} />
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Box sx={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '1.2rem',
          boxShadow: '0 4px 16px rgba(108, 99, 255, 0.3)'
        }}>
          📝
        </Box>
        <Box>
          <Typography variant="h6" sx={{ 
            color: '#6C63FF', 
            fontWeight: 700,
            fontSize: '1.1rem'
          }}>
            Entradas
          </Typography>
          <Typography variant="body2" sx={{ 
            color: '#B8B8CC',
            fontSize: '0.85rem'
          }}>
            Insira a função e o ponto limite
          </Typography>
        </Box>
        {isCalculating && (
          <Chip 
            label="Calculando..." 
            color="info" 
            size="small" 
            sx={{ 
              animation: 'pulse 1.5s infinite',
              background: 'rgba(0, 210, 255, 0.1)',
              color: '#00D2FF',
              border: '1px solid rgba(0, 210, 255, 0.3)'
            }}
          />
        )}
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Campo da função */}
      <TextField
        fullWidth
        label="f(x) ="
        value={functionValue}
        onChange={(e) => setFunctionValue(e.target.value)}
        placeholder="Ex: (x^2 - 1)/(x - 1)"
        variant="outlined"
        error={!validation.valid}
        helperText={
          !validation.valid 
            ? validation.errors[0] 
            : validation.warnings.length > 0 
            ? validation.warnings[0] 
            : ''
        }
        sx={{ 
          mb: 3,
          '& .MuiInputLabel-root': {
            color: '#B8B8CC',
            '&.Mui-focused': {
              color: '#6C63FF'
            }
          },
          '& .MuiFormHelperText-root': {
            color: !validation.valid ? '#FF6B6B' : '#FFD166'
          }
        }}
        InputProps={{
          style: { 
            fontFamily: 'JetBrains Mono, monospace', 
            fontSize: '1.1rem',
            color: '#FFFFFF'
          }
        }}
      />
      
      {/* Sugestões de correção */}
      {suggestions.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ 
            color: '#FFD166',
            fontWeight: 600,
            display: 'block',
            mb: 1
          }}>
            💡 Sugestões:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {suggestions.map((suggestion, index) => (
              <Chip
                key={index}
                label={suggestion}
                size="small"
                sx={{ 
                  background: 'rgba(255, 209, 102, 0.1)',
                  color: '#FFD166',
                  border: '1px solid rgba(255, 209, 102, 0.3)',
                  fontSize: '0.7rem',
                  height: 24
                }}
              />
            ))}
          </Box>
        </Box>
      )}
      
      {/* Campos de limite e direção */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 4 }}>
        <TextField
          label="x →"
          value={limitPoint}
          onChange={(e) => setLimitPoint(e.target.value)}
          placeholder="0, oo, -oo"
          variant="outlined"
          sx={{ 
            width: 180,
            '& .MuiInputLabel-root': {
              color: '#B8B8CC',
              '&.Mui-focused': {
                color: '#6C63FF'
              }
            }
          }}
          InputProps={{
            style: { 
              fontFamily: 'JetBrains Mono, monospace', 
              fontSize: '1.1rem',
              color: '#FFFFFF'
            }
          }}
        />
        
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel sx={{ color: '#B8B8CC' }}>Direção</InputLabel>
          <Select
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            label="Direção"
            sx={{ 
              fontSize: '1rem',
              color: '#FFFFFF',
              '& .MuiOutlinedInput-notchedOutline': {
                border: '2px solid rgba(108, 99, 255, 0.2)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                border: '2px solid rgba(108, 99, 255, 0.4)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: '2px solid #6C63FF',
              }
            }}
          >
            {DIRECTION_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      {/* Botão principal de calcular */}
      <Button
        variant="contained"
        size="large"
        fullWidth
        startIcon={<Calculate />}
        onClick={onCalculate}
        disabled={isCalculating || !functionValue.trim() || !limitPoint.trim()}
        sx={{ 
          mb: 4, 
          py: 2,
          fontSize: '1.1rem',
          fontWeight: 'bold',
          borderRadius: 12,
          background: 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
          boxShadow: '0 8px 32px rgba(108, 99, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4A42CC 0%, #00A8CC 100%)',
            boxShadow: '0 12px 40px rgba(108, 99, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            transform: 'translateY(-2px)'
          },
          '&:disabled': {
            background: 'rgba(184, 184, 204, 0.1)',
            color: 'rgba(184, 184, 204, 0.5)',
            boxShadow: 'none'
          }
        }}
      >
        {isCalculating ? 'Calculando...' : 'Calcular Limite'}
      </Button>
      
      {/* Botões auxiliares em grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: 1.5,
        mb: 3
      }}>
        <Button
          startIcon={<PlaylistPlay />}
          onClick={onExamples}
          variant="outlined"
          size="medium"
          sx={{ 
            py: 1.5,
            borderRadius: 12,
            border: '2px solid rgba(108, 99, 255, 0.3)',
            background: 'rgba(30, 30, 47, 0.6)',
            backdropFilter: 'blur(10px)',
            color: '#6C63FF',
            '&:hover': {
              border: '2px solid rgba(108, 99, 255, 0.6)',
              background: 'rgba(108, 99, 255, 0.1)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          Exemplos
        </Button>
        
        <Button
          startIcon={<Help />}
          onClick={onHelp}
          variant="outlined"
          size="medium"
          sx={{ 
            py: 1.5,
            borderRadius: 12,
            border: '2px solid rgba(0, 210, 255, 0.3)',
            background: 'rgba(30, 30, 47, 0.6)',
            backdropFilter: 'blur(10px)',
            color: '#00D2FF',
            '&:hover': {
              border: '2px solid rgba(0, 210, 255, 0.6)',
              background: 'rgba(0, 210, 255, 0.1)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          Ajuda
        </Button>
        
        <Button
          startIcon={<ShowChart />}
          onClick={onGraph}
          variant="outlined"
          size="medium"
          sx={{ 
            py: 1.5,
            borderRadius: 12,
            border: '2px solid rgba(255, 209, 102, 0.3)',
            background: 'rgba(30, 30, 47, 0.6)',
            backdropFilter: 'blur(10px)',
            color: '#FFD166',
            '&:hover': {
              border: '2px solid rgba(255, 209, 102, 0.6)',
              background: 'rgba(255, 209, 102, 0.1)',
              transform: 'translateY(-1px)'
            }
          }}
          disabled={!functionValue.trim() || !limitPoint.trim()}
        >
          Gráfico
        </Button>
        
        <Button
          startIcon={<Refresh />}
          onClick={() => {
            setFunctionValue('');
            setLimitPoint('');
            setDirection('ambos');
          }}
          variant="outlined"
          size="medium"
          sx={{ 
            py: 1.5,
            borderRadius: 12,
            border: '2px solid rgba(255, 107, 107, 0.3)',
            background: 'rgba(30, 30, 47, 0.6)',
            backdropFilter: 'blur(10px)',
            color: '#FF6B6B',
            '&:hover': {
              border: '2px solid rgba(255, 107, 107, 0.6)',
              background: 'rgba(255, 107, 107, 0.1)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          Limpar
        </Button>
      </Box>
      
      {/* Botão de dicas de sintaxe */}
      <Button
        startIcon={<Lightbulb />}
        onClick={() => setShowSyntaxTips(true)}
        variant="outlined"
        fullWidth
        sx={{ 
          mt: 3,
          py: 1.5,
          borderRadius: 12,
          border: '2px solid rgba(108, 99, 255, 0.3)',
          background: 'rgba(30, 30, 47, 0.6)',
          backdropFilter: 'blur(10px)',
          color: '#6C63FF',
          '&:hover': {
            border: '2px solid rgba(108, 99, 255, 0.6)',
            background: 'rgba(108, 99, 255, 0.1)',
            transform: 'translateY(-1px)'
          }
        }}
      >
        Ver Dicas de Sintaxe
      </Button>

      {/* Modal de dicas de sintaxe */}
      <SyntaxTipsModal
        open={showSyntaxTips}
        onClose={() => setShowSyntaxTips(false)}
      />
    </Paper>
  );
};

export default InputSection;
