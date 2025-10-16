/**
 * Componente de scroll personalizado reutilizável
 */

import React from 'react';
import { Box } from '@mui/material';

const CustomScrollbar = ({ 
  children, 
  maxHeight = '400px', 
  width = '8px',
  variant = 'default',
  sx = {},
  ...props
}) => {
  const scrollStyles = {
    default: {
      '&::-webkit-scrollbar': {
        width: width,
      },
      '&::-webkit-scrollbar-track': {
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'linear-gradient(135deg, #6C63FF, #00D2FF)',
        borderRadius: '4px',
        '&:hover': {
          background: 'linear-gradient(135deg, #4A42CC, #00A8CC)',
        }
      },
      '&::-webkit-scrollbar-corner': {
        background: 'rgba(255, 255, 255, 0.1)',
      }
    },
    dark: {
      '&::-webkit-scrollbar': {
        width: width,
      },
      '&::-webkit-scrollbar-track': {
        background: 'rgba(30, 30, 47, 0.3)',
        borderRadius: '4px',
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'linear-gradient(135deg, #6C63FF, #00D2FF)',
        borderRadius: '4px',
        border: '1px solid rgba(30, 30, 47, 0.3)',
        '&:hover': {
          background: 'linear-gradient(135deg, #4A42CC, #00A8CC)',
        }
      },
      '&::-webkit-scrollbar-corner': {
        background: 'rgba(30, 30, 47, 0.3)',
      }
    },
    minimal: {
      '&::-webkit-scrollbar': {
        width: '6px',
      },
      '&::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'rgba(108, 99, 255, 0.5)',
        borderRadius: '3px',
        '&:hover': {
          background: 'rgba(108, 99, 255, 0.8)',
        }
      }
    }
  };

  return (
    <Box
      sx={{
        maxHeight,
        overflow: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: '#6C63FF rgba(30, 30, 47, 0.3)',
        ...scrollStyles[variant],
        ...sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default CustomScrollbar;
