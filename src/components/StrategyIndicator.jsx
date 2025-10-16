/**
 * Componente para mostrar qual estratégia está sendo aplicada
 */

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  LinearProgress,
  Tooltip,
  IconButton,
  Collapse
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  CheckCircle,
  Error,
  Info,
  Lightbulb
} from '@mui/icons-material';
import CustomScrollbar from './CustomScrollbar.jsx';

const StrategyIndicator = ({ 
  strategy, 
  form, 
  formInfo, 
  strategyInfo, 
  isCalculating = false,
  expanded = false,
  onToggleExpanded 
}) => {
  const getStrategyIcon = (strategy) => {
    switch (strategy) {
      case 'substituição_direta':
        return <CheckCircle color="success" />;
      case 'fatoração':
        return <Info color="info" />;
      case 'racionalização':
        return <Info color="info" />;
      case 'limites_fundamentais':
        return <Lightbulb color="warning" />;
      case 'maior_grau':
        return <Info color="info" />;
      case 'multiplicação_conjugado':
        return <Info color="info" />;
      case 'fundamentais_exponenciais':
        return <Lightbulb color="warning" />;
      case 'limites_laterais':
        return <Info color="info" />;
      case 'lhopital':
        return <Info color="info" />;
      case 'error':
        return <Error color="error" />;
      default:
        return <Info color="info" />;
    }
  };

  const getStrategyColor = (strategy) => {
    switch (strategy) {
      case 'substituição_direta':
        return 'success';
      case 'fatoração':
      case 'racionalização':
      case 'maior_grau':
      case 'multiplicação_conjugado':
      case 'limites_laterais':
      case 'lhopital':
        return 'info';
      case 'limites_fundamentais':
      case 'fundamentais_exponenciais':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStrategyDescription = (strategy) => {
    const descriptions = {
      'substituição_direta': 'Substituição direta do valor',
      'fatoração': 'Fatoração e cancelamento de termos',
      'racionalização': 'Racionalização com conjugado',
      'limites_fundamentais': 'Limites fundamentais conhecidos',
      'maior_grau': 'Análise do termo de maior grau',
      'multiplicação_conjugado': 'Multiplicação pelo conjugado',
      'fundamentais_exponenciais': 'Limites fundamentais exponenciais',
      'limites_laterais': 'Cálculo de limites laterais',
      'lhopital': 'Regra de L\'Hôpital',
      'error': 'Erro na detecção'
    };
    
    return descriptions[strategy] || 'Estratégia não identificada';
  };

  const getFormDescription = (form) => {
    const descriptions = {
      '0/0': 'Forma indeterminada zero sobre zero',
      '∞/∞': 'Forma indeterminada infinito sobre infinito',
      '∞-∞': 'Forma indeterminada infinito menos infinito',
      '0·∞': 'Forma indeterminada zero vezes infinito',
      '1^∞': 'Forma indeterminada um elevado ao infinito',
      '0^0': 'Forma indeterminada zero elevado a zero',
      '∞^0': 'Forma indeterminada infinito elevado a zero',
      '(número ≠ 0)/0': 'Número diferente de zero sobre zero',
      'numérico': 'Resultado numérico direto',
      'infinito': 'Tende ao infinito',
      'indefinida': 'Forma indefinida'
    };
    
    return descriptions[form] || 'Forma não identificada';
  };

  if (!strategy && !form) {
    return null;
  }

  return (
    <Paper elevation={0} sx={{ 
      p: 3, 
      mb: 2,
      background: 'rgba(30, 30, 47, 0.8)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 16,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
    }}>
      {/* Header com estratégia e forma */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
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
          {getStrategyIcon(strategy)}
        </Box>
        
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ 
            color: '#6C63FF', 
            fontWeight: 700,
            fontSize: '1.1rem'
          }}>
            Estratégia Aplicada
          </Typography>
          <Typography variant="body2" sx={{ 
            color: '#B8B8CC',
            fontSize: '0.85rem'
          }}>
            {getStrategyDescription(strategy)}
          </Typography>
        </Box>
        
        {onToggleExpanded && (
          <IconButton 
            onClick={onToggleExpanded}
            sx={{ 
              color: '#6C63FF',
              '&:hover': {
                background: 'rgba(108, 99, 255, 0.1)'
              }
            }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </Box>

      {/* Chips de estratégia e forma */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Chip
          label={strategy}
          color={getStrategyColor(strategy)}
          variant="outlined"
          size="small"
          sx={{ 
            fontWeight: 600,
            '& .MuiChip-label': {
              fontSize: '0.8rem'
            }
          }}
        />
        
        <Chip
          label={form}
          color="primary"
          variant="outlined"
          size="small"
          sx={{ 
            fontWeight: 600,
            '& .MuiChip-label': {
              fontSize: '0.8rem'
            }
          }}
        />
      </Box>

      {/* Progress bar se estiver calculando */}
      {isCalculating && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress 
            sx={{ 
              borderRadius: 1,
              height: 6,
              background: 'rgba(108, 99, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #6C63FF, #00D2FF)'
              }
            }} 
          />
          <Typography variant="caption" sx={{ 
            color: '#B8B8CC',
            mt: 1,
            display: 'block'
          }}>
            Aplicando estratégia...
          </Typography>
        </Box>
      )}

      {/* Detalhes expandidos */}
      <Collapse in={expanded}>
        <CustomScrollbar 
          maxHeight="400px" 
          variant="dark" 
          width="8px"
          sx={{ mt: 2 }}
        >
          {/* Informações da forma */}
          {formInfo && (
            <Box sx={{ mb: 3, pr: 1 }}>
              <Typography variant="subtitle2" sx={{ 
                color: '#6C63FF',
                fontWeight: 600,
                mb: 1
              }}>
                📊 Análise da Forma
              </Typography>
              <Typography variant="body2" sx={{ 
                color: '#B8B8CC',
                mb: 1
              }}>
                {getFormDescription(form)}
              </Typography>
              
              {formInfo.steps && formInfo.steps.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {formInfo.steps.map((step, index) => (
                    <Typography key={index} variant="caption" sx={{ 
                      color: '#8B8B9E',
                      display: 'block',
                      fontStyle: 'italic',
                      mb: 0.5
                    }}>
                      • {step}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {/* Informações da estratégia */}
          {strategyInfo && (
            <Box sx={{ mb: 3, pr: 1 }}>
              <Typography variant="subtitle2" sx={{ 
                color: '#6C63FF',
                fontWeight: 600,
                mb: 1
              }}>
                ⚡ Detalhes da Estratégia
              </Typography>
              
              {strategyInfo.steps && strategyInfo.steps.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {strategyInfo.steps.map((step, index) => (
                    <Typography key={index} variant="caption" sx={{ 
                      color: '#8B8B9E',
                      display: 'block',
                      fontStyle: 'italic',
                      mb: 0.5
                    }}>
                      • {step}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {/* Dicas específicas */}
          {strategyInfo && strategyInfo.tips && strategyInfo.tips.length > 0 && (
            <Box sx={{ pr: 1 }}>
              <Typography variant="subtitle2" sx={{ 
                color: '#FFD166',
                fontWeight: 600,
                mb: 1
              }}>
                💡 Dicas Específicas
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {strategyInfo.tips.map((tip, index) => (
                  <Chip
                    key={index}
                    label={tip}
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
        </CustomScrollbar>
      </Collapse>
    </Paper>
  );
};

export default StrategyIndicator;
