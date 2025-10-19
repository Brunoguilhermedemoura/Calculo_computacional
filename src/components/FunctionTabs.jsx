/**
 * Componente de Tabs para múltiplas funcionalidades matemáticas
 */

import React, { useState } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Paper
} from '@mui/material';
import {
  Functions,
  TrendingUp,
  IntegrationInstructions
} from '@mui/icons-material';

const FunctionTabs = ({ 
  activeTab, 
  onTabChange, 
  children 
}) => {
  const tabs = [
    {
      value: 'limits',
      label: 'Limites',
      icon: <Functions />,
      description: 'Calcular limites de funções'
    },
    {
      value: 'derivatives',
      label: 'Derivadas',
      icon: <TrendingUp />,
      description: 'Calcular derivadas de funções'
    },
    {
      value: 'integrals',
      label: 'Integrais',
      icon: <IntegrationInstructions />,
      description: 'Calcular integrais indefinidas'
    }
  ];

  return (
    <Paper elevation={0} sx={{
      background: 'rgba(30, 30, 47, 0.8)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 16,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      overflow: 'hidden'
    }}>
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => onTabChange(newValue)}
        variant="fullWidth"
        sx={{
          background: 'rgba(0, 0, 0, 0.2)',
          '& .MuiTab-root': {
            color: '#B8B8CC',
            fontWeight: 600,
            textTransform: 'none',
            minHeight: 64,
            '&.Mui-selected': {
              color: '#6C63FF',
              background: 'rgba(108, 99, 255, 0.1)'
            }
          },
          '& .MuiTabs-indicator': {
            background: 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
            height: 3
          }
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            icon={tab.icon}
            label={
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {tab.label}
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: 'inherit',
                  opacity: 0.7,
                  fontSize: '0.7rem'
                }}>
                  {tab.description}
                </Typography>
              </Box>
            }
            iconPosition="top"
          />
        ))}
      </Tabs>
      
      <Box sx={{ p: 0 }}>
        {children}
      </Box>
    </Paper>
  );
};

export default FunctionTabs;
