/**
 * Modal de ajuda de sintaxe
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  Minimize as MinimizeIcon,
  CropSquare as MaximizeIcon,
  FullscreenExit as FullscreenExitIcon,
  Restore as RestoreIcon,
  HelpOutline as HelpIcon
} from '@mui/icons-material';
import { getSyntaxHelp } from '../services/limitsEngine.js';

const HelpModal = ({ open, onClose }) => {
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
  
  const helpText = getSyntaxHelp();

  return (
    <>
    <Dialog 
      open={open && !isMinimized}
      onClose={handleClose}
      maxWidth={isMaximized ? false : "md"}
      fullScreen={isMaximized}
      fullWidth
      PaperProps={{
        sx: { 
          minHeight: isMaximized ? '100vh' : '600px',
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
            <HelpIcon />
          </Box>
          <Box>
            <Typography variant="h5" component="div" sx={{ 
              color: '#6C63FF',
              fontWeight: 700
            }}>
              Ajuda de Sintaxe
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#B8B8CC'
            }}>
              Guia completo para digitação de expressões matemáticas
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
        <Box sx={{ whiteSpace: 'pre-line', fontFamily: 'monospace' }}>
          {helpText}
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Seção de exemplos práticos */}
        <Typography variant="h6" gutterBottom color="primary">
          Exemplos Práticos
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Limite Fundamental do Seno
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              sin(x)/x quando x → 0
            </Typography>
            <Chip label="Resultado: 1" size="small" color="success" sx={{ mt: 1 }} />
          </Paper>
          
          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Fatoração de Polinômio
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              (x^2-1)/(x-1) quando x → 1
            </Typography>
            <Chip label="Resultado: 2" size="small" color="success" sx={{ mt: 1 }} />
          </Paper>
          
          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Racionalização
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              (sqrt(x+1)-1)/x quando x → 0
            </Typography>
            <Chip label="Resultado: 1/2" size="small" color="success" sx={{ mt: 1 }} />
          </Paper>
          
          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Limite Exponencial
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              (1+1/x)^x quando x → oo
            </Typography>
            <Chip label="Resultado: e" size="small" color="success" sx={{ mt: 1 }} />
          </Paper>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Dicas adicionais */}
        <Typography variant="h6" gutterBottom color="primary">
          Dicas Importantes
        </Typography>
        
        <List dense>
          <ListItem>
            <ListItemText 
              primary="Use parênteses para agrupar operações"
              secondary="Exemplo: (x+1)*(x-1) em vez de x+1*x-1"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="A vírgula decimal é convertida automaticamente"
              secondary="Digite 3,14 que será convertido para 3.14"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Use oo para infinito, não infinity"
              secondary="Exemplo: 1/x quando x → oo"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Funções trigonométricas usam notação inglesa"
              secondary="sin, cos, tan (não sen, cos, tg)"
            />
          </ListItem>
        </List>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} variant="contained" sx={{
          background: 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
          borderRadius: 12,
          px: 4,
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 600,
          boxShadow: '0 8px 32px rgba(108, 99, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4A42CC 0%, #00A8CC 100%)',
            boxShadow: '0 12px 40px rgba(108, 99, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            transform: 'translateY(-2px)'
          }
        }}>
          Entendi
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
              <HelpIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="body1" sx={{ 
                color: '#6C63FF',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}>
                Ajuda de Sintaxe
              </Typography>
              <Typography variant="caption" sx={{ 
                color: '#B8B8CC',
                fontSize: '0.75rem'
              }}>
                Guia completo para digitação
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

export default HelpModal;
