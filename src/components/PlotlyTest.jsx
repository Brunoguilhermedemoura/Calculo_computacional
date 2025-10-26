/**
 * Componente de teste para verificar se o Plotly está funcionando
 */

import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';

const PlotlyTest = () => {
  const [plotlyStatus, setPlotlyStatus] = useState('Testando...');
  const [error, setError] = useState('');

  useEffect(() => {
    const testPlotly = async () => {
      try {
        // Tenta importar o Plotly dinamicamente
        const Plotly = await import('plotly.js-dist-min');
        console.log('Plotly importado:', Plotly);
        
        // Tenta importar o react-plotly
        const Plot = await import('react-plotly.js');
        console.log('React-Plotly importado:', Plot);
        
        setPlotlyStatus('✅ Plotly funcionando!');
      } catch (err) {
        console.error('Erro ao importar Plotly:', err);
        setError(`Erro: ${err.message}`);
        setPlotlyStatus('❌ Plotly com erro');
      }
    };

    testPlotly();
  }, []);

  return (
    <Box sx={{ p: 3, background: 'rgba(30, 30, 47, 0.8)', borderRadius: 16 }}>
      
      <Typography variant="body1" sx={{ color: '#B8B8CC', mb: 2 }}>
        Status: {plotlyStatus}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Button 
        variant="contained" 
        onClick={() => window.location.reload()}
        sx={{
          background: 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
          borderRadius: 12
        }}
      >
        Recarregar Página
      </Button>
    </Box>
  );
};

export default PlotlyTest;
