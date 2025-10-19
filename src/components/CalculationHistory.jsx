/**
 * Componente de Histórico de Cálculos com localStorage
 */

import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Chip,
  Divider
} from '@mui/material';
import {
  History,
  Delete,
  Calculate
} from '@mui/icons-material';

const CalculationHistory = ({ onLoadCalculation }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Carrega histórico do localStorage
    const savedHistory = localStorage.getItem('calculationHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
      }
    }
  }, []);

  const saveToHistory = (calculation) => {
    const newHistory = [
      {
        id: Date.now(),
        timestamp: new Date().toLocaleString('pt-BR'),
        ...calculation
      },
      ...history.slice(0, 4) // Mantém apenas os últimos 5
    ];
    
    setHistory(newHistory);
    localStorage.setItem('calculationHistory', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('calculationHistory');
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLoadCalculation = (calculation) => {
    onLoadCalculation(calculation);
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          color: '#6C63FF',
          '&:hover': {
            background: 'rgba(108, 99, 255, 0.1)',
            transform: 'scale(1.1)'
          },
          transition: 'all 0.3s ease'
        }}
      >
        <History />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            background: 'rgba(30, 30, 47, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 16,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            minWidth: 300,
            maxWidth: 400
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#6C63FF', fontWeight: 600 }}>
              Histórico de Cálculos
            </Typography>
            {history.length > 0 && (
              <IconButton
                onClick={clearHistory}
                size="small"
                sx={{ color: '#FF6B6B' }}
              >
                <Delete fontSize="small" />
              </IconButton>
            )}
          </Box>

          {history.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#B8B8CC', textAlign: 'center', py: 2 }}>
              Nenhum cálculo realizado ainda
            </Typography>
          ) : (
            <List dense>
              {history.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItem
                    button
                    onClick={() => handleLoadCalculation(item)}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      '&:hover': {
                        background: 'rgba(108, 99, 255, 0.1)'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Calculate sx={{ color: '#6C63FF' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box>
                          <Typography variant="body2" sx={{ 
                            fontFamily: 'JetBrains Mono, monospace',
                            color: '#FFFFFF',
                            mb: 0.5
                          }}>
                            f(x) = {item.function}
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            fontFamily: 'JetBrains Mono, monospace',
                            color: '#B8B8CC'
                          }}>
                            x → {item.point}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Chip
                            label={item.direction}
                            size="small"
                            sx={{
                              background: 'rgba(0, 210, 255, 0.1)',
                              color: '#00D2FF',
                              border: '1px solid rgba(0, 210, 255, 0.3)',
                              fontSize: '0.7rem'
                            }}
                          />
                          <Typography variant="caption" sx={{ 
                            color: '#8B8B9E',
                            display: 'block',
                            mt: 0.5
                          }}>
                            {item.timestamp}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < history.length - 1 && <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default CalculationHistory;
