/**
 * Modal de exibição de gráficos
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
  Slider,
  Chip,
  Stack,
  IconButton
} from '@mui/material';
import {
  Minimize as MinimizeIcon,
  CropSquare as MaximizeIcon,
  FullscreenExit as FullscreenExitIcon,
  Close as CloseIcon,
  Restore as RestoreIcon
} from '@mui/icons-material';
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js-dist-min';
import { generateGraphData, canPlotFunction } from '../services/graphService.js';
import { generateEnhancedGraphData } from '../services/enhancedGraphService.js';
import { calculateDerivative } from '../services/derivativesEngine.js';
import SimpleChart from './SimpleChart.jsx';

const GraphModal = ({ open, onClose, functionStr, limitPoint, limitValue = null }) => {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useChartJS, setUseChartJS] = useState(false);
  
  // Estados para controles de janela
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Novos estados para controles interativos
  const [showDerivative, setShowDerivative] = useState(false);
  const [useLogScale, setUseLogScale] = useState(false);
  const [xRange, setXRange] = useState([null, null]);
  const [rangeSlider, setRangeSlider] = useState(4);

  const generateGraph = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Iniciando geração de gráfico...');
      
      // Verifica se é possível plotar
      const { canPlot, reason } = canPlotFunction(functionStr, limitPoint);
      console.log('Pode plotar?', canPlot, 'Razão:', reason);
      
      if (!canPlot) {
        setError(reason);
        setLoading(false);
        return;
      }
      
      // Calcula o intervalo baseado no range slider
      let currentXRange = xRange;
      if (currentXRange[0] === null || currentXRange[1] === null) {
        const limitPointNum = parseFloat(limitPoint);
        if (!isNaN(limitPointNum) && isFinite(limitPointNum)) {
          currentXRange = [
            limitPointNum - rangeSlider,
            limitPointNum + rangeSlider
          ];
        }
      }
      
      // Gera os dados do gráfico aprimorado
      console.log('Gerando dados do gráfico aprimorado...');
      const data = generateEnhancedGraphData(functionStr, limitPoint, {
        showDerivative,
        useLogScale,
        xRange: currentXRange,
        limitValue
      });
      console.log('Dados gerados:', data);
      setGraphData(data);
      
    } catch (err) {
      console.error('Erro ao gerar gráfico:', err);
      setError(`Erro ao gerar gráfico: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [functionStr, limitPoint, showDerivative, useLogScale, xRange, rangeSlider, limitValue]);

  useEffect(() => {
    if (open) {
      console.log('Modal aberto, testando Plotly...');
      
      // Teste básico do Plotly
      try {
        console.log('Plotly disponível:', typeof Plotly);
        
        // Verifica se Plotly está disponível
        if (typeof Plotly === 'undefined') {
          console.log('Plotly não disponível, usando Chart.js');
          setUseChartJS(true);
        }
        
        // Dados de teste muito simples
        const testData = {
          data: [{
            x: [1, 2, 3, 4, 5],
            y: [1, 4, 9, 16, 25],
            type: 'scatter',
            mode: 'lines',
            name: 'Teste',
            line: { color: '#6C63FF', width: 3 }
          }],
          layout: {
            title: {
              text: 'Gráfico de Teste - Plotly Funcionando',
              font: { color: '#B8B8CC', family: 'Inter' }
            },
            xaxis: { 
              title: 'x',
              color: '#B8B8CC',
              tickfont: { color: '#B8B8CC', family: 'Inter' }
            },
            yaxis: { 
              title: 'y',
              color: '#B8B8CC',
              tickfont: { color: '#B8B8CC', family: 'Inter' }
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { family: 'Inter', color: '#B8B8CC' }
          },
          config: {
            responsive: true,
            displayModeBar: true
          }
        };
        
        console.log('Dados de teste criados:', testData);
        setGraphData(testData);
        setLoading(false);
        
        // Se há função e ponto, tenta gerar o gráfico real
        if (functionStr && limitPoint) {
          console.log('Tentando gerar gráfico real...');
          generateGraph();
        }
        
      } catch (error) {
        console.error('Erro ao testar Plotly:', error);
        console.log('Usando Chart.js como fallback');
        setUseChartJS(true);
        setError(`Erro ao inicializar Plotly: ${error.message}`);
        setLoading(false);
      }
    }
  }, [open, functionStr, limitPoint, generateGraph]);

  const handleClose = () => {
    setGraphData(null);
    setError('');
    setShowDerivative(false);
    setUseLogScale(false);
    setXRange([null, null]);
    setRangeSlider(4);
    setIsMaximized(false);
    setIsMinimized(false);
    onClose();
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleRestore = () => {
    setIsMinimized(false);
  };

  const handleRangeSliderChange = (event, newValue) => {
    setRangeSlider(newValue);
    setXRange([null, null]); // Reset custom range
  };

  const parseLimitPoint = (limitPointStr) => {
    if (limitPointStr === 'inf' || limitPointStr === '+inf' || limitPointStr === 'infinity') {
      return Infinity;
    }
    if (limitPointStr === '-inf' || limitPointStr === '-infinity') {
      return -Infinity;
    }
    return parseFloat(limitPointStr);
  };

  return (
    <>
      <Dialog 
        open={open && !isMinimized} 
        onClose={handleClose} 
        maxWidth={isMaximized ? false : "lg"}
        fullScreen={isMaximized}
        fullWidth
        PaperProps={{
          sx: { 
            minHeight: isMaximized ? '100vh' : '600px',
            background: 'rgba(30, 30, 47, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 16,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }
        }}
      >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
              📊
            </Box>
            <Box>
              <Typography variant="h5" component="div" sx={{ 
                color: '#6C63FF',
                fontWeight: 700
              }}>
                Gráfico de f(x) = {functionStr}
              </Typography>
              <Typography variant="body2" sx={{ 
                color: '#B8B8CC'
              }}>
                Vizinhança do ponto x = {limitPoint}
              </Typography>
            </Box>
          </Box>
          
          {/* Controles de Janela */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {/* Botão Minimizar */}
            <IconButton
              onClick={handleMinimize}
              sx={{
                width: 36,
                height: 36,
                background: 'rgba(108, 99, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(108, 99, 255, 0.3)',
                borderRadius: 2,
                color: '#6C63FF',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'rgba(108, 99, 255, 0.2)',
                  border: '1px solid rgba(108, 99, 255, 0.5)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(108, 99, 255, 0.2)'
                }
              }}
            >
              <MinimizeIcon fontSize="small" />
            </IconButton>
            
            {/* Botão Maximizar */}
            <IconButton
              onClick={handleMaximize}
              sx={{
                width: 36,
                height: 36,
                background: 'rgba(0, 210, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 210, 255, 0.3)',
                borderRadius: 2,
                color: '#00D2FF',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'rgba(0, 210, 255, 0.2)',
                  border: '1px solid rgba(0, 210, 255, 0.5)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 210, 255, 0.2)'
                }
              }}
            >
              {isMaximized ? (
                <FullscreenExitIcon fontSize="small" />
              ) : (
                <MaximizeIcon fontSize="small" />
              )}
            </IconButton>
            
            {/* Botão Fechar */}
            <IconButton
              onClick={handleClose}
              sx={{
                width: 36,
                height: 36,
                background: 'rgba(255, 82, 82, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 82, 82, 0.3)',
                borderRadius: 2,
                color: '#FF5252',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'rgba(255, 82, 82, 0.2)',
                  border: '1px solid rgba(255, 82, 82, 0.5)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(255, 82, 82, 0.2)'
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: isMaximized ? 'calc(100vh - 100px)' : 'auto',
        overflow: isMaximized ? 'hidden' : 'auto'
      }}>
        {/* Controles Interativos */}
        <Box sx={{ 
          mb: 3, 
          p: 3, 
          background: 'rgba(108, 99, 255, 0.1)',
          borderRadius: 12,
          border: '1px solid rgba(108, 99, 255, 0.3)',
          backdropFilter: 'blur(10px)',
          flexShrink: 0
        }}>
          <Typography variant="h6" sx={{ color: '#6C63FF', mb: 2 }}>
            Controles de Visualização
          </Typography>
          
          <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
            <FormControlLabel
              control={
                <Switch
                  checked={showDerivative}
                  onChange={(e) => setShowDerivative(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#00D2FF',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#00D2FF',
                    },
                  }}
                />
              }
              label="Exibir Derivada (f'(x))"
              sx={{ color: '#B8B8CC' }}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={useLogScale}
                  onChange={(e) => setUseLogScale(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#FFD166',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#FFD166',
                    },
                  }}
                />
              }
              label="Escala Logarítmica (Y)"
              sx={{ color: '#B8B8CC' }}
            />
            
            <Box sx={{ minWidth: 200 }}>
              <Typography variant="body2" sx={{ color: '#B8B8CC', mb: 1 }}>
                Intervalo do Eixo X: ±{rangeSlider}
              </Typography>
              <Slider
                value={rangeSlider}
                onChange={handleRangeSliderChange}
                min={1}
                max={20}
                step={0.5}
                sx={{
                  color: '#6C63FF',
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#6C63FF',
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: '#6C63FF',
                  },
                }}
              />
            </Box>
          </Stack>
        </Box>

        <Box sx={{ 
          width: '100%',
          flex: isMaximized ? '1 1 auto' : '0 0 500px',
          overflow: 'hidden',
          minHeight: 0
        }}>
          {loading && (
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100%' 
              }}
            >
              <CircularProgress />
              <Typography variant="body2" sx={{ ml: 2 }}>
                Gerando gráfico...
              </Typography>
            </Box>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          
          {graphData && !loading && !error && (
            <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
              {useChartJS ? (
                <SimpleChart 
                  data={graphData.data?.[0]} 
                  title={graphData.layout?.title?.text || 'Gráfico'} 
                />
              ) : (
                <Plot
                  data={graphData.data}
                  layout={graphData.layout}
                  config={graphData.config}
                  style={{ width: '100%', height: '100%' }}
                  useResizeHandler={true}
                  onError={(err) => {
                    console.error('Erro do Plotly:', err);
                    console.log('Mudando para Chart.js...');
                    setUseChartJS(true);
                  }}
                />
              )}
            </Box>
          )}
          
          {!graphData && !loading && !error && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%',
              gap: 2
            }}>
              <Typography variant="h6" sx={{ color: '#B8B8CC' }}>
                Gráfico não disponível
              </Typography>
              <Typography variant="body2" sx={{ color: '#8B8B9E' }}>
                Clique em "Regenerar Gráfico" para tentar novamente
              </Typography>
            </Box>
          )}
        </Box>
        
        {graphData && !loading && !error && (
          <Box sx={{ 
            mt: 2, 
            p: 3, 
            background: 'rgba(108, 99, 255, 0.1)',
            borderRadius: 12,
            border: '1px solid rgba(108, 99, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            flexShrink: 0
          }}>
            <Typography variant="body2" sx={{ 
              color: '#B8B8CC',
              fontSize: '0.9rem'
            }}>
              <strong>Instruções:</strong> Use o mouse para zoom e pan. A linha vertical tracejada 
              indica o ponto limite. A linha roxa representa a função f(x). 
              {showDerivative && " A linha tracejada azul representa a derivada f'(x)."}
              {useLogScale && " O eixo Y está em escala logarítmica."}
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={() => setUseChartJS(!useChartJS)} 
          variant="outlined" 
          disabled={loading}
          sx={{
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
        >
          {useChartJS ? 'Usar Plotly' : 'Usar Chart.js'}
        </Button>
        <Button 
          onClick={generateGraph} 
          variant="outlined" 
          disabled={loading}
          sx={{
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
          Regenerar Gráfico
        </Button>
        <Button 
          onClick={handleClose} 
          variant="contained"
          sx={{
            borderRadius: 12,
            background: 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
            boxShadow: '0 8px 32px rgba(108, 99, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4A42CC 0%, #00A8CC 100%)',
              boxShadow: '0 12px 40px rgba(108, 99, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>

    {/* Modal Minimizado */}
    {open && isMinimized && (
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          minWidth: 300,
          maxWidth: 400,
          background: 'rgba(30, 30, 47, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(108, 99, 255, 0.3)',
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          zIndex: 1400,
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            cursor: 'pointer',
            '&:hover': {
              background: 'rgba(108, 99, 255, 0.05)'
            }
          }}
          onClick={handleRestore}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(108, 99, 255, 0.3)'
            }}>
              📊
            </Box>
            <Box>
              <Typography variant="body1" sx={{ 
                color: '#6C63FF',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}>
                Gráfico de f(x) = {functionStr}
              </Typography>
              <Typography variant="caption" sx={{ 
                color: '#B8B8CC',
                fontSize: '0.75rem'
              }}>
                Ponto: x = {limitPoint}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {/* Botão Restaurar */}
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleRestore();
              }}
              sx={{
                width: 32,
                height: 32,
                background: 'rgba(108, 99, 255, 0.1)',
                border: '1px solid rgba(108, 99, 255, 0.3)',
                borderRadius: 1.5,
                color: '#6C63FF',
                '&:hover': {
                  background: 'rgba(108, 99, 255, 0.2)',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <RestoreIcon fontSize="small" />
            </IconButton>
            
            {/* Botão Fechar */}
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              sx={{
                width: 32,
                height: 32,
                background: 'rgba(255, 82, 82, 0.1)',
                border: '1px solid rgba(255, 82, 82, 0.3)',
                borderRadius: 1.5,
                color: '#FF5252',
                '&:hover': {
                  background: 'rgba(255, 82, 82, 0.2)',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    )}
    </>
  );
};

export default GraphModal;
