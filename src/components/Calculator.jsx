/**
 * Componente principal da calculadora de limites
 * Interface premium com efeitos visuais avançados
 */

import React from 'react';
import {
  Typography,
  Box,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fade,
  Slide,
  Grow,
  Zoom
} from '@mui/material';
import {
  Refresh,
  Info,
  ExpandMore
} from '@mui/icons-material';
import UserProfile from './UserProfile.jsx';
// Temporariamente removido framer-motion - usando CSS puro para animações
// import { motion } from 'framer-motion';
import { useAdvancedLimits } from '../hooks/useAdvancedLimits.js';
import { math } from '../utils/mathConfig.js';
import { normalizeExpression } from '../services/mathParser.js';
// Removido: import de teste
import InputSection from './InputSection.jsx';
import ResultSection from './ResultSection.jsx';
import ExamplesModal from './ExamplesModal.jsx';
import HelpModal from './HelpModal.jsx';
import GraphModal from './GraphModal.jsx';
import PlotlyTest from './PlotlyTest.jsx';
import SimpleChart from './SimpleChart.jsx';
import CustomScrollbar from './CustomScrollbar.jsx';

const Calculator = ({ onLogout }) => {
  // math já importado do mathConfig.js
  
  const {
    // Estados de entrada
    functionValue,
    setFunctionValue,
    limitPoint,
    setLimitPoint,
    direction,
    setDirection,
    
    // Estados de resultado
    result,
    steps,
    tips,
    strategy,
    form,
    formInfo,
    strategyInfo,
    isCalculating,
    
    // Estados de interface
    showStrategyDetails,
    showStepDetails,
    currentStep,
    
    // Estados de validação
    validation,
    suggestions,
    
    // Estados de modais
    showExamples,
    setShowExamples,
    showHelp,
    setShowHelp,
    showGraph,
    setShowGraph,
    
    // Funções principais
    handleCalculate,
    loadExample,
    resetCalculator,
    
    // Funções de interface
    toggleStrategyDetails,
    toggleStepDetails,
    handleStepClick,
    
    // Funções utilitárias
    handleAutoCorrect,
    
    // Histórico
    history,
    clearHistory
  } = useAdvancedLimits();

  const handleExamples = () => {
    setShowExamples(true);
  };

  const handleHelp = () => {
    setShowHelp(true);
  };

  const handleGraph = () => {
    setShowGraph(true);
  };

  const handleReset = () => {
    resetCalculator();
  };

  // Removido: função de teste

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, #1E1E2F 0%, #2A2A3E 50%, #1E1E2F 100%),
          linear-gradient(45deg, #6C63FF 0%, #00D2FF 50%, #FFD166 100%)
        `,
        backgroundSize: '100% 100%, 200% 200%',
        animation: 'gradientShift 20s ease-in-out infinite',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decorativo com animação */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(108, 99, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0, 210, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 209, 102, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 60% 60%, rgba(255, 107, 107, 0.03) 0%, transparent 50%)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%',
          animation: 'gradientShift 25s ease-in-out infinite',
          zIndex: 0
        }}
      />
      
      {/* Partículas flutuantes */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          '&::before, &::after, & > div': {
            content: '""',
            position: 'absolute',
            width: 4,
            height: 4,
            background: 'rgba(108, 99, 255, 0.3)',
            borderRadius: '50%',
            animation: 'float 10s ease-in-out infinite'
          },
          '&::before': {
            top: '10%',
            left: '5%',
            animationDelay: '0s'
          },
          '&::after': {
            top: '80%',
            right: '10%',
            animationDelay: '5s',
            background: 'rgba(0, 210, 255, 0.3)',
            width: 3,
            height: 3
          }
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '40%',
            right: '5%',
            width: 2,
            height: 2,
            background: 'rgba(255, 209, 102, 0.4)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite',
            animationDelay: '2.5s'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '70%',
            left: '10%',
            width: 3,
            height: 3,
            background: 'rgba(255, 107, 107, 0.2)',
            borderRadius: '50%',
            animation: 'float 12s ease-in-out infinite',
            animationDelay: '7s'
          }}
        />
      </Box>

      <CustomScrollbar 
        maxHeight="100vh" 
        variant="dark" 
        width="14px"
        sx={{ 
          minHeight: '100vh', 
          margin: 0, 
          padding: 0,
          position: 'relative',
          zIndex: 1
        }}
      >
      {/* Header com animação */}
      <Slide direction="down" in timeout={800}>
        <AppBar 
          position="static" 
          elevation={0}
          sx={{
            background: 'rgba(30, 30, 47, 0.95)',
            backdropFilter: 'blur(25px)',
            borderBottom: '1px solid rgba(108, 99, 255, 0.3)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background: 'linear-gradient(90deg, transparent 0%, #6C63FF 50%, transparent 100%)',
              opacity: 0.6
            }
          }}
        >
          <Toolbar sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexGrow: 1 }}>
              <Zoom in timeout={1000}>
                <Box sx={{ 
                  width: 52, 
                  height: 52, 
                  borderRadius: 3, 
                  background: 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `
                    0 12px 40px rgba(108, 99, 255, 0.5),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3)
                  `,
                  animation: 'glow 4s ease-in-out infinite',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'scale(1.05) rotate(5deg)',
                    boxShadow: `
                      0 16px 50px rgba(108, 99, 255, 0.6),
                      inset 0 1px 0 rgba(255, 255, 255, 0.4)
                    `
                  }
                }}>
                  <img 
                    src="/logo.png" 
                    alt="Logo" 
                    style={{
                      width: '80%',
                      height: '80%',
                      objectFit: 'contain'
                    }}
                  />
                </Box>
              </Zoom>
              
              <Fade in timeout={1200}>
                <Box>
                  <Typography variant="h5" component="div" sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.2,
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    letterSpacing: '-0.01em'
                  }}>
                    Calculadora de Limites
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: '#B8B8CC',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                    letterSpacing: '0.01em'
                  }}>
                    Cálculo Diferencial e Integral • UNO
                  </Typography>
                </Box>
              </Fade>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Tooltip title="Resetar Calculadora" arrow>
                <IconButton 
                  color="inherit" 
                  onClick={handleReset}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    width: 48,
                    height: 48,
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                      transform: 'scale(1.1) rotate(5deg)',
                      boxShadow: '0 8px 25px rgba(255, 255, 255, 0.2)'
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <Refresh sx={{ color: '#FFFFFF' }} />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Sobre" arrow>
                <IconButton 
                  color="inherit"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    width: 48,
                    height: 48,
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                      transform: 'scale(1.1) rotate(5deg)',
                      boxShadow: '0 8px 25px rgba(255, 255, 255, 0.2)'
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <Info sx={{ color: '#FFFFFF' }} />
                </IconButton>
              </Tooltip>

              {/* Perfil do usuário */}
              <UserProfile onLogout={onLogout} />
            </Box>
          </Toolbar>
        </AppBar>
      </Slide>

      {/* Conteúdo Principal */}
      <Box sx={{ py: 2, px: 0, width: '100%', margin: 0 }}>
        {/* Layout principal responsivo */}
        <Fade in timeout={1400}>
          <Box className="grid-container" sx={{ 
            display: 'grid',
            gridTemplateColumns: { 
              xs: '1fr', 
              md: '450px 1fr', 
              lg: '450px 1fr 400px',
              xl: '480px 1fr 420px' 
            },
            gap: 4,
            width: '100%',
            minHeight: 'calc(100vh - 120px)',
            margin: 0,
            padding: { xs: 2, md: 3, lg: 4 }
          }}>
          {/* Coluna da Esquerda - Entrada com animação */}
          <Slide direction="right" in timeout={1600}>
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              height: 'fit-content',
              position: { md: 'sticky' },
              top: 20,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}>
              <InputSection
                functionValue={functionValue}
                setFunctionValue={setFunctionValue}
                limitPoint={limitPoint}
                setLimitPoint={setLimitPoint}
                direction={direction}
                setDirection={setDirection}
                onCalculate={handleCalculate}
                onExamples={handleExamples}
                onHelp={handleHelp}
                onGraph={handleGraph}
                isCalculating={isCalculating}
                validation={validation}
                suggestions={suggestions}
                onAutoCorrect={handleAutoCorrect}
                history={history}
                onClearHistory={clearHistory}
              />
            </Box>
          </Slide>

          {/* Coluna Central - Resultados com animação */}
          <Fade in timeout={1800}>
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              minHeight: 'calc(100vh - 120px)',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}>
              <ResultSection
                result={result}
                steps={steps}
                tips={tips}
                strategy={strategy}
                form={form}
                formInfo={formInfo}
                strategyInfo={strategyInfo}
                isCalculating={isCalculating}
                showStrategyDetails={showStrategyDetails}
                showStepDetails={showStepDetails}
                currentStep={currentStep}
                onToggleStrategyDetails={toggleStrategyDetails}
                onToggleStepDetails={toggleStepDetails}
                onStepClick={handleStepClick}
              />
            </Box>
          </Fade>

          {/* Coluna da Direita - Gráficos com animação */}
          <Grow in timeout={2000}>
            <Box sx={{ 
              display: { xs: 'none', lg: 'flex' },
              flexDirection: 'column',
              gap: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}>
            {/* Teste do Plotly em Accordion */}
            <Accordion sx={{
              background: 'rgba(30, 30, 47, 0.9)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '20px !important',
              boxShadow: `
                0 12px 40px rgba(0, 0, 0, 0.4),
                0 4px 12px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `,
              '&:before': { display: 'none' },
              '&.Mui-expanded': { margin: 0 },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `
                  0 16px 50px rgba(0, 0, 0, 0.5),
                  0 8px 20px rgba(0, 0, 0, 0.3),
                  inset 0 1px 0 rgba(255, 255, 255, 0.2)
                `
              }
            }}>
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ 
                  color: '#6C63FF',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(180deg)'
                  }
                }} />}
                sx={{ 
                  borderRadius: '20px 20px 0 0',
                  '&.Mui-expanded': { minHeight: 'auto' },
                  '&:hover': {
                    background: 'rgba(108, 99, 255, 0.05)'
                  }
                }}
              >
                <Typography variant="h6" sx={{ 
                  color: '#6C63FF', 
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                  letterSpacing: '0.01em'
                }}>
                  🔧 Status do Sistema
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                <PlotlyTest />
              </AccordionDetails>
            </Accordion>
            
            {/* Gráfico em tempo real */}
            <Box sx={{
              p: 3,
              background: 'rgba(30, 30, 47, 0.9)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 20,
              boxShadow: `
                0 12px 40px rgba(0, 0, 0, 0.4),
                0 4px 12px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `,
              height: 'fit-content',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `
                  0 16px 50px rgba(0, 0, 0, 0.5),
                  0 8px 20px rgba(0, 0, 0, 0.3),
                  inset 0 1px 0 rgba(255, 255, 255, 0.2)
                `
              }
            }}>
              <Typography variant="h6" sx={{ 
                color: '#6C63FF', 
                fontWeight: 600, 
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: '1rem',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                letterSpacing: '0.01em'
              }}>
                📊 Visualização
              </Typography>
              
              {functionValue && limitPoint ? (
                <Box sx={{ 
                  height: 400, 
                  width: '100%',
                  minHeight: '400px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: 16,
                  p: 2,
                  border: '1px solid rgba(108, 99, 255, 0.2)',
                  boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.2)'
                }}>
                  <SimpleChart 
                    data={{
                      x: Array.from({length: 200}, (_, i) => {
                        const limit = parseFloat(limitPoint);
                        const range = 4;
                        return limit + (i / 199) * 2 * range - range;
                      }),
                      y: Array.from({length: 200}, (_, i) => {
                        try {
                          const limit = parseFloat(limitPoint);
                          const range = 4;
                          const x = limit + (i / 199) * 2 * range - range;
                          
                          // Usar o normalizador centralizado
                          let expr = normalizeExpression(functionValue);
                          
                          // Compila e avalia a expressão
                          let result = null;
                          try {
                            const compiled = math.compile(expr);
                            result = compiled.evaluate({ x });
                          } catch {
                            // Fallback: tentar avaliar diretamente
                            try {
                              result = math.evaluate(expr, { x });
                            } catch {
                              // Se falhar, retorna null
                            }
                          }
                          
                          return isFinite(result) ? result : null;
                        } catch {
                          return null;
                        }
                      }),
                      name: `f(x) = ${functionValue}`
                    }}
                    title={`Gráfico de f(x) = ${functionValue}`}
                  />
                </Box>
              ) : (
                <>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 2, 
                      fontSize: '0.85rem',
                      color: '#B8B8CC',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                      fontWeight: 500
                    }}
                  >
                    Digite uma função e um ponto limite para ver o gráfico aqui.
                  </Typography>
                  <Box sx={{ 
                    height: 200, 
                    background: 'rgba(108, 99, 255, 0.1)',
                    borderRadius: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed rgba(108, 99, 255, 0.4)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(108, 99, 255, 0.15)',
                      borderColor: 'rgba(108, 99, 255, 0.6)'
                    }
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: '0.85rem',
                        color: '#8B8B9E',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                        fontWeight: 500
                      }}
                    >
                      Gráfico aparecerá aqui
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Grow>
          </Box>
        </Fade>

      {/* Modais */}
      <ExamplesModal
        open={showExamples}
        onClose={() => setShowExamples(false)}
        onLoadExample={loadExample}
      />

      <HelpModal
        open={showHelp}
        onClose={() => setShowHelp(false)}
      />

      <GraphModal
        open={showGraph}
        onClose={() => setShowGraph(false)}
        functionStr={functionValue}
        limitPoint={limitPoint}
      />
      </Box>

      </CustomScrollbar>
    </Box>
  );
};

export default Calculator;
