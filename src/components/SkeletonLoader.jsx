/**
 * Componente de Skeleton Loader para estados de carregamento
 */

import React from 'react';
import {
  Box,
  Skeleton,
  Paper,
  Typography
} from '@mui/material';

const SkeletonLoader = ({ type = 'result' }) => {
  if (type === 'result') {
    return (
      <Paper elevation={0} sx={{ 
        p: 4, 
        background: 'rgba(30, 30, 47, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Efeito de brilho */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #6C63FF, #00D2FF, #FFD166, #6C63FF)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s ease-in-out infinite'
        }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'rgba(108, 99, 255, 0.3)' }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={32} sx={{ bgcolor: 'rgba(108, 99, 255, 0.3)' }} />
            <Skeleton variant="text" width="40%" height={20} sx={{ bgcolor: 'rgba(184, 184, 204, 0.3)' }} />
          </Box>
        </Box>
        
        <Box sx={{ 
          p: 3, 
          background: 'rgba(108, 99, 255, 0.1)',
          borderRadius: 12,
          border: '2px solid rgba(0, 210, 255, 0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          <Skeleton variant="text" width="80%" height={48} sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.3)',
            mx: 'auto',
            textAlign: 'center'
          }} />
        </Box>
      </Paper>
    );
  }

  if (type === 'steps') {
    return (
      <Paper elevation={0} sx={{ 
        p: 4, 
        background: 'rgba(30, 30, 47, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'rgba(0, 210, 255, 0.3)' }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="50%" height={28} sx={{ bgcolor: 'rgba(0, 210, 255, 0.3)' }} />
            <Skeleton variant="text" width="30%" height={20} sx={{ bgcolor: 'rgba(184, 184, 204, 0.3)' }} />
          </Box>
        </Box>
        
        {[1, 2, 3, 4].map((i) => (
          <Box key={i} sx={{ mb: 2 }}>
            <Skeleton variant="rectangular" height={56} sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2
            }} />
          </Box>
        ))}
      </Paper>
    );
  }

  if (type === 'tips') {
    return (
      <Paper elevation={0} sx={{ 
        p: 4, 
        background: 'rgba(30, 30, 47, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'rgba(255, 209, 102, 0.3)' }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="45%" height={28} sx={{ bgcolor: 'rgba(255, 209, 102, 0.3)' }} />
            <Skeleton variant="text" width="25%" height={20} sx={{ bgcolor: 'rgba(184, 184, 204, 0.3)' }} />
          </Box>
        </Box>
        
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ mb: 1.5 }}>
            <Skeleton variant="text" width="100%" height={20} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
            <Skeleton variant="text" width="85%" height={20} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
          </Box>
        ))}
      </Paper>
    );
  }

  return null;
};

export default SkeletonLoader;
