/**
 * Modal de dicas de sintaxe com LaTeX formatado
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
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton
} from '@mui/material';
import {
  Close,
  Code,
  Functions,
  Calculate,
  Science
} from '@mui/icons-material';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const SyntaxTipsModal = ({ open, onClose }) => {
  const syntaxExamples = [
    {
      category: 'Operações Básicas',
      icon: <Calculate />,
      examples: [
        { input: 'x + 2', output: 'x + 2' },
        { input: 'x^2 - 1', output: 'x^2 - 1' },
        { input: 'sqrt(x)', output: '\\sqrt{x}' },
        { input: 'abs(x)', output: '|x|' }
      ]
    },
    {
      category: 'Funções Trigonométricas',
      icon: <Science />,
      examples: [
        { input: 'sin(x)', output: '\\sin(x)' },
        { input: 'cos(x)', output: '\\cos(x)' },
        { input: 'tan(x)', output: '\\tan(x)' },
        { input: 'sin(x)/x', output: '\\frac{\\sin(x)}{x}' }
      ]
    },
    {
      category: 'Funções Logarítmicas',
      icon: <Functions />,
      examples: [
        { input: 'log(x)', output: '\\ln(x)' },
        { input: 'log10(x)', output: '\\log_{10}(x)' },
        { input: 'exp(x)', output: 'e^x' },
        { input: 'log(x)/x', output: '\\frac{\\ln(x)}{x}' }
      ]
    },
    {
      category: 'Limites Especiais',
      icon: <Code />,
      examples: [
        { input: 'oo', output: '\\infty' },
        { input: '-oo', output: '-\\infty' },
        { input: '(1+1/x)^x', output: '\\left(1 + \\frac{1}{x}\\right)^x' },
        { input: '(x^2-1)/(x-1)', output: '\\frac{x^2-1}{x-1}' }
      ]
    }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 16,
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
            fontSize: '1.2rem',
            boxShadow: '0 4px 16px rgba(108, 99, 255, 0.3)'
          }}>
            <Code />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ 
              fontWeight: 700,
              color: '#6C63FF'
            }}>
              Dicas de Sintaxe
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#B8B8CC',
              fontSize: '0.85rem'
            }}>
              Guia de sintaxe matemática
            </Typography>
          </Box>
        </Box>
        <IconButton 
          onClick={onClose} 
          size="small"
          sx={{
            color: '#B8B8CC',
            '&:hover': {
              color: '#FFFFFF',
              background: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body2" sx={{ 
          mb: 3,
          color: '#B8B8CC',
          fontSize: '1rem',
          lineHeight: 1.6
        }}>
          Use a sintaxe matemática padrão para inserir funções. A calculadora converte automaticamente para LaTeX.
        </Typography>

        <Grid container spacing={3}>
          {syntaxExamples.map((category, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card sx={{ 
                height: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 12,
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1rem'
                    }}>
                      {category.icon}
                    </Box>
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 600,
                      color: '#6C63FF',
                      fontSize: '1.1rem'
                    }}>
                      {category.category}
                    </Typography>
                  </Box>
                  
                  {category.examples.map((example, idx) => (
                    <Box key={idx} sx={{ 
                      mb: 3, 
                      p: 2.5, 
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 8,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(5px)'
                    }}>
                      <Typography variant="caption" sx={{ 
                        display: 'block', 
                        mb: 1,
                        color: '#B8B8CC',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Entrada:
                      </Typography>
                      <Chip 
                        label={example.input} 
                        size="small" 
                        sx={{ 
                          fontFamily: 'JetBrains Mono, monospace',
                          mb: 2,
                          background: 'rgba(108, 99, 255, 0.2)',
                          color: '#6C63FF',
                          border: '1px solid rgba(108, 99, 255, 0.3)',
                          fontWeight: 600,
                          fontSize: '0.85rem'
                        }} 
                      />
                      
                      <Typography variant="caption" sx={{ 
                        display: 'block', 
                        mb: 1,
                        color: '#B8B8CC',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Resultado:
                      </Typography>
                      <Box sx={{ 
                        p: 2, 
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: 8,
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        textAlign: 'center',
                        minHeight: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <InlineMath math={example.output} />
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ 
          mt: 4, 
          p: 3, 
          background: 'rgba(0, 210, 255, 0.1)',
          borderRadius: 12,
          border: '1px solid rgba(0, 210, 255, 0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 600, 
            mb: 2,
            color: '#00D2FF',
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            💡 Dicas Importantes
          </Typography>
          <Typography variant="body2" sx={{
            color: '#B8B8CC',
            lineHeight: 1.8,
            fontSize: '0.95rem'
          }}>
            • Use vírgulas como separadores decimais (serão convertidas automaticamente)<br/>
            • Para potências, use ^ ou **<br/>
            • Para frações, use parênteses: (x^2-1)/(x-1)<br/>
            • Para infinito, use 'oo' ou '-oo'
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          size="large"
          sx={{
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
          }}
        >
          Entendi!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SyntaxTipsModal;
