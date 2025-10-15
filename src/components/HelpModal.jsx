/**
 * Modal de ajuda de sintaxe
 */

import React from 'react';
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
  Chip
} from '@mui/material';
import { getSyntaxHelp } from '../services/limitsEngine.js';

const HelpModal = ({ open, onClose }) => {
  const helpText = getSyntaxHelp();

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '600px' }
      }}
    >
      <DialogTitle>
        <Typography variant="h5" component="div">
          Ajuda de Sintaxe
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Guia completo para digitação de expressões matemáticas
        </Typography>
      </DialogTitle>
      
      <DialogContent>
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
        <Button onClick={onClose} variant="contained">
          Entendi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HelpModal;
