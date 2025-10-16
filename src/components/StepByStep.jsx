/**
 * Componente de passos detalhados e interativos
 */

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  ExpandMore,
  CheckCircle,
  Info,
  Error,
  Lightbulb,
  PlayArrow,
  Pause,
  Refresh
} from '@mui/icons-material';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import CustomScrollbar from './CustomScrollbar.jsx';

const StepByStep = ({ 
  steps = [], 
  tips = [], 
  strategy = '',
  form = '',
  isCalculating = false,
  onStepClick = null 
}) => {
  const [expandedSteps, setExpandedSteps] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed] = useState(1000); // ms

  const toggleStep = (stepIndex) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepIndex]: !prev[stepIndex]
    }));
  };

  const handleStepClick = (stepIndex) => {
    if (onStepClick) {
      onStepClick(stepIndex);
    }
    toggleStep(stepIndex);
  };

  const startPlayback = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, playbackSpeed);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
  };

  const resetPlayback = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const getStepIcon = (step) => {
    if (step.includes('Erro') || step.includes('❌')) {
      return <Error color="error" />;
    }
    if (step.includes('Resultado') || step.includes('✅')) {
      return <CheckCircle color="success" />;
    }
    if (step.includes('Estratégia') || step.includes('⚡')) {
      return <Lightbulb color="warning" />;
    }
    if (step.includes('Detectada') || step.includes('🔍')) {
      return <Info color="info" />;
    }
    return <Info color="info" />;
  };

  const getStepColor = (step) => {
    if (step.includes('Erro') || step.includes('❌')) {
      return 'error';
    }
    if (step.includes('Resultado') || step.includes('✅')) {
      return 'success';
    }
    if (step.includes('Estratégia') || step.includes('⚡')) {
      return 'warning';
    }
    if (step.includes('Detectada') || step.includes('🔍')) {
      return 'info';
    }
    return 'default';
  };

  const formatMathExpression = (expression) => {
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

  const isMathExpression = (text) => {
    return text.includes('=') || 
           text.includes('lim') || 
           text.includes('x') || 
           text.includes('∞') ||
           text.includes('sin') ||
           text.includes('cos') ||
           text.includes('tan') ||
           text.includes('sqrt') ||
           text.includes('log') ||
           text.includes('^') ||
           text.includes('**');
  };

  const renderStepContent = (step) => {
    if (isMathExpression(step)) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InlineMath math={formatMathExpression(step)} />
        </Box>
      );
    }
    
    return (
      <Typography variant="body2" sx={{ 
        fontFamily: 'JetBrains Mono, monospace',
        color: '#B8B8CC'
      }}>
        {step}
      </Typography>
    );
  };

  if (steps.length === 0) {
    return (
      <Paper elevation={0} sx={{ 
        p: 4, 
        textAlign: 'center',
        background: 'rgba(30, 30, 47, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      }}>
        <Typography variant="h6" sx={{ 
          color: '#6C63FF',
          mb: 2
        }}>
          Passos do Cálculo
        </Typography>
        <Typography variant="body2" sx={{ 
          color: '#B8B8CC'
        }}>
          Os passos detalhados aparecerão aqui após o cálculo
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ 
      background: 'rgba(30, 30, 47, 0.8)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 16,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
    }}>
      {/* Header com controles */}
      <Box sx={{ 
        p: 3, 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
            🔢
          </Box>
          <Box>
            <Typography variant="h6" sx={{ 
              color: '#6C63FF', 
              fontWeight: 700,
              fontSize: '1.1rem'
            }}>
              Passos Detalhados
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#B8B8CC',
              fontSize: '0.85rem'
            }}>
              {steps.length} passos • {strategy} • {form}
            </Typography>
          </Box>
        </Box>

        {/* Controles de reprodução */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={isPlaying ? "Pausar" : "Reproduzir"}>
            <IconButton
              onClick={isPlaying ? stopPlayback : startPlayback}
              disabled={isCalculating}
              sx={{ 
                color: '#6C63FF',
                '&:hover': {
                  background: 'rgba(108, 99, 255, 0.1)'
                }
              }}
            >
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Reiniciar">
            <IconButton
              onClick={resetPlayback}
              disabled={isCalculating}
              sx={{ 
                color: '#6C63FF',
                '&:hover': {
                  background: 'rgba(108, 99, 255, 0.1)'
                }
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Progress bar */}
      {isPlaying && (
        <Box sx={{ px: 3, py: 1 }}>
          <LinearProgress 
            variant="determinate"
            value={(currentStep / (steps.length - 1)) * 100}
            sx={{ 
              borderRadius: 1,
              height: 4,
              background: 'rgba(108, 99, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #6C63FF, #00D2FF)'
              }
            }} 
          />
        </Box>
      )}

      {/* Lista de passos */}
      <CustomScrollbar 
        maxHeight="600px" 
        variant="dark" 
        width="10px"
      >
        {steps.map((step, index) => (
          <Accordion
            key={index}
            expanded={expandedSteps[index] || false}
            onChange={() => handleStepClick(index)}
            sx={{
              background: 'transparent',
              boxShadow: 'none',
              border: 'none',
              '&:before': {
                display: 'none'
              },
              '&.Mui-expanded': {
                margin: 0
              }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                minHeight: 56,
                '&.Mui-expanded': {
                  minHeight: 56
                },
                '& .MuiAccordionSummary-content': {
                  margin: '12px 0',
                  '&.Mui-expanded': {
                    margin: '12px 0'
                  }
                },
                backgroundColor: index === currentStep && isPlaying 
                  ? 'rgba(108, 99, 255, 0.1)' 
                  : 'transparent',
                borderLeft: index === currentStep && isPlaying 
                  ? '4px solid #6C63FF' 
                  : '4px solid transparent',
                transition: 'all 0.3s ease'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Box sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: getStepColor(step, index) === 'error' 
                    ? 'rgba(255, 107, 107, 0.1)' 
                    : getStepColor(step, index) === 'success'
                    ? 'rgba(0, 210, 255, 0.1)'
                    : getStepColor(step, index) === 'warning'
                    ? 'rgba(255, 209, 102, 0.1)'
                    : 'rgba(108, 99, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {getStepIcon(step)}
                </Box>
                
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 600,
                    color: '#FFFFFF',
                    mb: 0.5
                  }}>
                    Passo {index + 1}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: '#B8B8CC',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {step.length > 80 ? `${step.substring(0, 80)}...` : step}
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>
            
            <AccordionDetails sx={{ 
              pt: 0, 
              pb: 2,
              px: 3
            }}>
              <Box sx={{ 
                pl: 6,
                borderLeft: '2px solid rgba(108, 99, 255, 0.2)',
                ml: 2
              }}>
                {renderStepContent(step)}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </CustomScrollbar>

      {/* Dicas */}
      {tips.length > 0 && (
        <>
          <Divider sx={{ mx: 3, my: 2 }} />
          <Box sx={{ p: 3 }}>
            <Typography variant="subtitle2" sx={{ 
              color: '#FFD166',
              fontWeight: 600,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Lightbulb />
              Dicas Técnicas
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {tips.map((tip, index) => (
                <Chip
                  key={index}
                  label={tip}
                  size="small"
                  sx={{ 
                    background: 'rgba(255, 209, 102, 0.1)',
                    color: '#FFD166',
                    border: '1px solid rgba(255, 209, 102, 0.3)',
                    fontSize: '0.8rem',
                    '&:hover': {
                      background: 'rgba(255, 209, 102, 0.2)'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default StepByStep;
