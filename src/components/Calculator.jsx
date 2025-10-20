/**
 * Componente principal da calculadora de limites
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
  AccordionDetails
} from '@mui/material';
import {
  Refresh,
  Info,
  ExpandMore
} from '@mui/icons-material';
// Temporariamente removido framer-motion - usando CSS puro para animações
// import { motion } from 'framer-motion';
import { useAdvancedLimits } from '../hooks/useAdvancedLimits.js';
import { math } from '../utils/mathConfig.js';
// Removido: import de teste
import InputSection from './InputSection.jsx';
import ResultSection from './ResultSection.jsx';
import ExamplesModal from './ExamplesModal.jsx';
import HelpModal from './HelpModal.jsx';
import GraphModal from './GraphModal.jsx';
import PlotlyTest from './PlotlyTest.jsx';
import SimpleChart from './SimpleChart.jsx';
import CustomScrollbar from './CustomScrollbar.jsx';

const Calculator = () => {
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
    <CustomScrollbar 
      maxHeight="100vh" 
      variant="dark" 
      width="14px"
      sx={{ 
        minHeight: '100vh', 
        margin: 0, 
        padding: 0,
        position: 'relative'
      }}
    >
      {/* Header com animação */}
      <div className="animate-slide-in">
        <AppBar position="static" elevation={0} className="animate-slide-in">
        <Toolbar sx={{ py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexGrow: 1 }}>
            <Box sx={{ 
              width: 45, 
              height: 45, 
              borderRadius: 12, 
              background: 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.3rem',
              boxShadow: '0 8px 32px rgba(108, 99, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              animation: 'glow 3s ease-in-out infinite'
            }}>
              ∫
            </Box>
            <Box>
              <Typography variant="h5" component="div" sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.2
              }}>
                Calculadora de Limites
              </Typography>
              <Typography variant="body2" sx={{ 
                color: '#B8B8CC',
                fontWeight: 500,
                fontSize: '0.9rem'
              }}>
                Cálculo Diferencial e Integral • UNO
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Resetar Calculadora">
              <IconButton 
                color="inherit" 
                onClick={handleReset}
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Sobre">
              <IconButton 
                color="inherit"
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Info />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      </div>

      {/* Conteúdo Principal */}
      <Box sx={{ py: 1, px: 0, width: '100%', margin: 0 }}>
        {/* Layout principal responsivo */}
        <Box className="grid-container" sx={{ 
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr', 
            md: '450px 1fr', 
            lg: '450px 1fr 400px',
            xl: '480px 1fr 420px' 
          },
          gap: 3,
          width: '100%',
          minHeight: 'calc(100vh - 120px)',
          margin: 0,
          padding: { xs: 2, md: 3 }
        }}>
          {/* Coluna da Esquerda - Entrada com animação */}
          <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              height: 'fit-content',
              position: { md: 'sticky' },
              top: 20,
              className: 'animate-slide-in'
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
          </div>

          {/* Coluna Central - Resultados com animação */}
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              minHeight: 'calc(100vh - 120px)',
              overflow: 'hidden',
              className: 'animate-fade-in'
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
          </div>

          {/* Coluna da Direita - Gráficos com animação */}
          <div className="animate-scale-in" style={{ animationDelay: '0.6s' }}>
            <Box sx={{ 
              display: { xs: 'none', lg: 'flex' },
              flexDirection: 'column',
              gap: 3,
              className: 'animate-scale-in'
            }}>
            {/* Teste do Plotly em Accordion */}
            <Accordion sx={{
              background: 'rgba(30, 30, 47, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px !important',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              '&:before': { display: 'none' },
              '&.Mui-expanded': { margin: 0 }
            }}>
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: '#6C63FF' }} />}
                sx={{ 
                  borderRadius: '16px 16px 0 0',
                  '&.Mui-expanded': { minHeight: 'auto' }
                }}
              >
                <Typography variant="h6" sx={{ 
                  color: '#6C63FF', 
                  fontWeight: 600,
                  fontSize: '0.95rem'
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
              background: 'rgba(30, 30, 47, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 16,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              height: 'fit-content'
            }}>
              <Typography variant="h6" sx={{ 
                color: '#6C63FF', 
                fontWeight: 600, 
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: '1rem'
              }}>
                📊 Visualização
              </Typography>
              
              {functionValue && limitPoint ? (
                <Box sx={{ 
                  height: 400, 
                  width: '100%',
                  minHeight: '400px',
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: 12,
                  p: 2
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
                          
                          // Normaliza a expressão para math.js
                          let expr = functionValue
                            .replace(/\^/g, '**')
                            .replace(/sin/g, 'sin')
                            .replace(/cos/g, 'cos')
                            .replace(/tan/g, 'tan')
                            .replace(/ln/g, 'log')
                            .replace(/log/g, 'log10')
                            .replace(/sqrt/g, 'sqrt')
                            .replace(/pi/g, 'pi')
                            .replace(/e/g, 'e');
                          
                          // Compila e avalia a expressão
                          const compiled = math.compile(expr);
                          const result = compiled.evaluate({ x });
                          
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
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.85rem' }}>
                    Digite uma função e um ponto limite para ver o gráfico aqui.
                  </Typography>
                  <Box sx={{ 
                    height: 200, 
                    background: 'rgba(108, 99, 255, 0.1)',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed rgba(108, 99, 255, 0.3)'
                  }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                      Gráfico aparecerá aqui
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
            </Box>
          </div>
        </Box>

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
  );
};

export default Calculator;
