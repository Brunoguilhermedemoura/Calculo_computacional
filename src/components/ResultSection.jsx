/**
 * Componente de exibição de resultados
 */

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  Snackbar
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Info,
  ExpandMore,
  ContentCopy,
  Check
} from '@mui/icons-material';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import StrategyIndicator from './StrategyIndicator.jsx';
import StepByStep from './StepByStep.jsx';
import CustomScrollbar from './CustomScrollbar.jsx';
import SkeletonLoader from './SkeletonLoader.jsx';

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
  const [copied, setCopied] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
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

  const copyToClipboard = async (text, type = 'text') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setSnackbarOpen(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  const copyResult = () => {
    const resultText = result === 'Erro' ? 'Erro' : formatMathExpression(result);
    copyToClipboard(resultText, 'result');
  };

  const copySteps = () => {
    const stepsText = steps.map((step, index) => `${index + 1}. ${step}`).join('\n');
    copyToClipboard(stepsText, 'steps');
  };

  const copyStepsLatex = () => {
    const stepsLatex = steps.map((step, index) => {
      const latexStep = formatMathExpression(step);
      return `${index + 1}. $${latexStep}$`;
    }).join('\n');
    copyToClipboard(stepsLatex, 'latex');
  };

  if (isCalculating) {
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
        <SkeletonLoader type="result" />
        <SkeletonLoader type="steps" />
      </CustomScrollbar>
    );
  }

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
          <Box sx={{ flex: 1 }}>
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
          {result && (
            <Tooltip title="Copiar resultado">
              <IconButton
                onClick={copyResult}
                sx={{
                  color: '#6C63FF',
                  '&:hover': {
                    background: 'rgba(108, 99, 255, 0.1)',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                {copied ? <Check /> : <ContentCopy />}
              </IconButton>
            </Tooltip>
          )}
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

      {/* Passos Detalhados com Accordion */}
      {steps.length > 0 && (
        <Paper elevation={0} sx={{ 
          p: 4, 
          background: 'rgba(30, 30, 47, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #00D2FF 0%, #6C63FF 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.2rem',
                boxShadow: '0 4px 16px rgba(0, 210, 255, 0.3)'
              }}>
                📋
              </Box>
              <Typography variant="h6" sx={{ 
                color: '#00D2FF', 
                fontWeight: 700,
                fontSize: '1.1rem'
              }}>
                Passos do Cálculo
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Copiar passos (texto)">
                <IconButton
                  onClick={copySteps}
                  size="small"
                  sx={{ color: '#00D2FF' }}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Copiar passos (LaTeX)">
                <IconButton
                  onClick={copyStepsLatex}
                  size="small"
                  sx={{ color: '#6C63FF' }}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Accordion 
            defaultExpanded
            sx={{
              background: 'transparent',
              boxShadow: 'none',
              '&:before': { display: 'none' },
              '&.Mui-expanded': { margin: 0 }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore sx={{ color: '#00D2FF' }} />}
              sx={{
                background: 'rgba(0, 210, 255, 0.1)',
                borderRadius: 2,
                minHeight: 48,
                '&.Mui-expanded': { minHeight: 48 }
              }}
            >
              <Typography variant="subtitle1" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                Expressão Normalizada
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 2 }}>
              <Typography variant="body1" sx={{ 
                fontFamily: 'JetBrains Mono, monospace',
                color: '#B8B8CC',
                p: 2,
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: 1
              }}>
                {steps[0]}
              </Typography>
            </AccordionDetails>
          </Accordion>

          {steps.slice(1).map((step, index) => (
            <Accordion 
              key={index + 1}
              sx={{
                background: 'transparent',
                boxShadow: 'none',
                '&:before': { display: 'none' },
                '&.Mui-expanded': { margin: 0 }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: '#6C63FF' }} />}
                sx={{
                  background: 'rgba(108, 99, 255, 0.1)',
                  borderRadius: 2,
                  minHeight: 48,
                  '&.Mui-expanded': { minHeight: 48 }
                }}
              >
                <Typography variant="subtitle1" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                  Passo {index + 2}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 2 }}>
                <Typography variant="body1" sx={{ 
                  fontFamily: 'JetBrains Mono, monospace',
                  color: '#B8B8CC',
                  p: 2,
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: 1
                }}>
                  {step}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
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

      {/* Snackbar para feedback de cópia */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Copiado para a área de transferência!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </CustomScrollbar>
  );
};

export default ResultSection;
