/**
 * Modal de exemplos pré-definidos
 */

import React from 'react';
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
  Chip
} from '@mui/material';
import { getExamples } from '../services/limitsEngine.js';

const ExamplesModal = ({ open, onClose, onLoadExample }) => {
  const examples = getExamples();

  const handleLoadExample = (example) => {
    onLoadExample(example);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '500px' }
      }}
    >
      <DialogTitle>
        <Typography variant="h5" component="div">
          Exemplos de Limites
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Clique em um exemplo para carregá-lo na calculadora
        </Typography>
      </DialogTitle>
      
      <DialogContent>
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
        <Button onClick={onClose} variant="outlined">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExamplesModal;
