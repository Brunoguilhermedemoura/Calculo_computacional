/**
 * Modal de exemplos pré-definidos
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  Minimize as MinimizeIcon,
  CropSquare as MaximizeIcon,
  FullscreenExit as FullscreenExitIcon,
  Restore as RestoreIcon,
  MenuBook as MenuBookIcon
} from '@mui/icons-material';
import { getAdvancedExamples } from '../services/advancedLimitsEngine.js';

const ExamplesModal = ({ open, onClose, onLoadExample }) => {
  // Estados para controles de janela
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Funções de controle
  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleRestore = () => {
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsMaximized(false);
    setIsMinimized(false);
    onClose();
  };
  
  const examplesData = getAdvancedExamples();
  const examples = examplesData.flatMap(category => category.examples);

  const handleLoadExample = (example) => {
    onLoadExample(example);
    onClose();
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
          minHeight: isMaximized ? '100vh' : '500px',
          borderRadius: isMaximized ? 0 : 16,
          background: 'rgba(30, 30, 47, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 1,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
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
            boxShadow: '0 4px 16px rgba(108, 99, 255, 0.3)'
          }}>
            <MenuBookIcon />
          </Box>
          <Box>
            <Typography variant="h5" component="div" sx={{ 
              color: '#6C63FF',
              fontWeight: 700
            }}>
              Exemplos de Limites
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#B8B8CC'
            }}>
              Clique em um exemplo para carregá-lo na calculadora
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
      </DialogTitle>
      
      <DialogContent sx={{ 
        display: 'flex',
        flexDirection: 'column',
        height: isMaximized ? 'calc(100vh - 150px)' : 'auto',
        overflow: 'auto'
      }}>
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Função f(x)</strong></TableCell>
                <TableCell><strong>x →</strong></TableCell>
                <TableCell><strong>Direção</strong></TableCell>
                <TableCell><strong>Resultado</strong></TableCell>
                <TableCell><strong>Descrição</strong></TableCell>
                <TableCell><strong>Ação</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {examples.map((example, index) => (
                <TableRow 
                  key={index}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleLoadExample(example)}
                >
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                    >
                      {example.function}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ fontFamily: 'monospace' }}
                    >
                      {example.point}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={example.direction} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}
                    >
                      {example.expectedResult}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {example.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLoadExample(example);
                      }}
                    >
                      Carregar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Dica:</strong> Estes exemplos demonstram diferentes tipos de limites e 
            formas indeterminadas. Experimente cada um para entender as técnicas de cálculo.
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" sx={{
          borderRadius: 12,
          border: '2px solid rgba(108, 99, 255, 0.3)',
          background: 'rgba(30, 30, 47, 0.6)',
          backdropFilter: 'blur(10px)',
          color: '#6C63FF',
          '&:hover': {
            border: '2px solid rgba(108, 99, 255, 0.6)',
            background: 'rgba(108, 99, 255, 0.1)'
          }
        }}>
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
              color: 'white',
              boxShadow: '0 4px 12px rgba(108, 99, 255, 0.3)'
            }}>
              <MenuBookIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="body1" sx={{ 
                color: '#6C63FF',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}>
                Exemplos de Limites
              </Typography>
              <Typography variant="caption" sx={{ 
                color: '#B8B8CC',
                fontSize: '0.75rem'
              }}>
                Clique para carregar exemplo
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

export default ExamplesModal;
