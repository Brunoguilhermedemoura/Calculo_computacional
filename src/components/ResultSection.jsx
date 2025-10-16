/**
 * Componente de exibição de resultados
 */

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Alert
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Info
} from '@mui/icons-material';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import StrategyIndicator from './StrategyIndicator.jsx';
import StepByStep from './StepByStep.jsx';
import CustomScrollbar from './CustomScrollbar.jsx';

const ResultSection = ({ 
  result, 
  steps, 
  tips, 
  strategy,
  form,
  formInfo,
  strategyInfo,
  isCalculating,
  showStrategyDetails,
  showStepDetails,
  currentStep,
  onToggleStrategyDetails,
  onToggleStepDetails,
  onStepClick
}) => {
  const getResultIcon = () => {
    if (isCalculating) return <Info color="info" />;
    if (result === 'Erro') return <Error color="error" />;
    return <CheckCircle color="success" />;
  };

  const getResultColor = () => {
    if (isCalculating) return 'info';
    if (result === 'Erro') return 'error';
    return 'success';
  };

  const formatMathExpression = (expression) => {
    // Converte notação para LaTeX
    return expression
      .replace(/\*\*/g, '^')
      .replace(/oo/g, '\\infty')
      .replace(/-oo/g, '-\\infty')
      .replace(/sin/g, '\\sin')
      .replace(/cos/g, '\\cos')
      .replace(/tan/g, '\\tan')
      .replace(/log/g, '\\ln')
      .replace(/sqrt/g, '\\sqrt')
      .replace(/pi/g, '\\pi')
      .replace(/E/g, 'e');
  };

  return (
    <CustomScrollbar 
      maxHeight="calc(100vh - 200px)" 
      variant="dark" 
      width="12px"
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 3, 
        height: '100%'
      }}
    >
      {/* Resultado Principal */}
      <Paper elevation={0} sx={{ 
        p: 4, 
        flex: '0 0 auto',
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
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
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
            {getResultIcon()}
          </Box>
          <Box>
            <Typography variant="h6" sx={{ 
              color: '#6C63FF', 
              fontWeight: 700,
              fontSize: '1.1rem'
            }}>
              Resultado
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#B8B8CC',
              fontSize: '0.85rem'
            }}>
              Limite calculado
            </Typography>
          </Box>
        </Box>
        
        {result && (
          <Box sx={{ 
            p: 3, 
            background: 'rgba(108, 99, 255, 0.1)',
            borderRadius: 12,
            border: '2px solid',
            borderColor: result === 'Erro' ? 'rgba(255, 107, 107, 0.3)' : 'rgba(0, 210, 255, 0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            <Typography variant="h4" component="div" sx={{ 
              fontFamily: 'JetBrains Mono, monospace',
              color: '#FFFFFF',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              {result === 'Erro' ? (
                <Alert severity="error" sx={{ background: 'rgba(255, 107, 107, 0.1)' }}>{result}</Alert>
              ) : (
                <InlineMath math={formatMathExpression(result)} />
              )}
            </Typography>
          </Box>
        )}
        
        {isCalculating && (
          <Alert severity="info">
            Calculando limite... Aguarde.
          </Alert>
        )}
      </Paper>

      {/* Indicador de Estratégia */}
      {(strategy || form) && (
        <StrategyIndicator
          strategy={strategy}
          form={form}
          formInfo={formInfo}
          strategyInfo={strategyInfo}
          isCalculating={isCalculating}
          expanded={showStrategyDetails}
          onToggleExpanded={onToggleStrategyDetails}
        />
      )}

      {/* Passos Detalhados */}
      {steps.length > 0 && (
        <StepByStep
          steps={steps}
          tips={tips}
          strategy={strategy}
          form={form}
          isCalculating={isCalculating}
          onStepClick={onStepClick}
        />
      )}

      {/* Mensagem quando não há resultados */}
      {!result && !isCalculating && steps.length === 0 && tips.length === 0 && (
        <Paper elevation={0} sx={{ 
          p: 6, 
          textAlign: 'center', 
          flex: '1', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
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
          <Box sx={{ animation: 'float 6s ease-in-out infinite' }}>
            <Box sx={{ 
              fontSize: '5rem', 
              mb: 3,
              animation: 'pulse 2s ease-in-out infinite',
              background: 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              📈
            </Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              mb: 2,
              background: 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Calculadora de Limites
            </Typography>
            <Typography variant="h6" sx={{ 
              mb: 3, 
              fontWeight: 500,
              color: '#B8B8CC'
            }}>
              Calcule limites de funções com passos detalhados e visualização gráfica
            </Typography>
            <Typography variant="body1" sx={{ 
              mb: 4,
              color: '#8B8B9E',
              fontSize: '1.1rem'
            }}>
              Digite uma função e um ponto limite, depois clique em "Calcular Limite"
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 2,
              flexWrap: 'wrap'
            }}>
              <Chip 
                label="sin(x)/x" 
                sx={{ 
                  background: 'rgba(108, 99, 255, 0.1)',
                  color: '#6C63FF',
                  border: '1px solid rgba(108, 99, 255, 0.3)',
                  '&:hover': {
                    background: 'rgba(108, 99, 255, 0.2)',
                    transform: 'translateY(-1px)'
                  }
                }} 
              />
              <Chip 
                label="(x^2-1)/(x-1)" 
                sx={{ 
                  background: 'rgba(0, 210, 255, 0.1)',
                  color: '#00D2FF',
                  border: '1px solid rgba(0, 210, 255, 0.3)',
                  '&:hover': {
                    background: 'rgba(0, 210, 255, 0.2)',
                    transform: 'translateY(-1px)'
                  }
                }} 
              />
              <Chip 
                label="(1+1/x)^x" 
                sx={{ 
                  background: 'rgba(255, 209, 102, 0.1)',
                  color: '#FFD166',
                  border: '1px solid rgba(255, 209, 102, 0.3)',
                  '&:hover': {
                    background: 'rgba(255, 209, 102, 0.2)',
                    transform: 'translateY(-1px)'
                  }
                }} 
              />
            </Box>
          </Box>
        </Paper>
      )}
    </CustomScrollbar>
  );
};

export default ResultSection;
