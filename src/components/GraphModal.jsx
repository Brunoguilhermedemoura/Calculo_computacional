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
  CircularProgress
} from '@mui/material';
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js-dist-min';
import { generateGraphData, canPlotFunction } from '../services/graphService.js';
import SimpleChart from './SimpleChart.jsx';

const GraphModal = ({ open, onClose, functionStr, limitPoint }) => {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useChartJS, setUseChartJS] = useState(false);

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
      
      // Gera os dados do gráfico
      console.log('Gerando dados do gráfico...');
      const data = generateGraphData(functionStr, limitPoint);
      console.log('Dados gerados:', data);
      setGraphData(data);
      
    } catch (err) {
      console.error('Erro ao gerar gráfico:', err);
      setError(`Erro ao gerar gráfico: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [functionStr, limitPoint]);

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
              font: { color: '#FFFFFF' }
            },
            xaxis: { 
              title: 'x',
              color: '#B8B8CC'
            },
            yaxis: { 
              title: 'y',
              color: '#B8B8CC'
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#FFFFFF' }
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
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { 
          minHeight: '600px',
          background: 'rgba(30, 30, 47, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }
      }}
    >
      <DialogTitle>
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
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ height: '500px', width: '100%' }}>
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
            backdropFilter: 'blur(10px)'
          }}>
            <Typography variant="body2" sx={{ 
              color: '#B8B8CC',
              fontSize: '0.9rem'
            }}>
              <strong>Instruções:</strong> Use o mouse para zoom e pan. A linha vermelha tracejada 
              indica o ponto limite. A linha azul representa a função f(x).
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
  );
};

export default GraphModal;
