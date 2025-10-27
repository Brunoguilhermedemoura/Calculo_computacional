/**
 * Página de Login
 * Interface de autenticação com design premium e efeitos visuais avançados
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  Divider,
  Fade,
  Slide,
  Grow,
  Zoom
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Email as EmailIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth.js';

const LoginPage = ({ onSwitchToRegister }) => {
  const { login, loading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Limpa erros quando componente monta
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Validação em tempo real
  const validateField = (name, value) => {
    const errors = { ...validationErrors };

    switch (name) {
      case 'email':
        if (!value) {
          errors.email = 'Email é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Email inválido';
        } else {
          delete errors.email;
        }
        break;
      
      case 'password':
        if (!value) {
          errors.password = 'Senha é obrigatória';
        } else if (value.length < 6) {
          errors.password = 'Senha deve ter pelo menos 6 caracteres';
        } else {
          delete errors.password;
        }
        break;
      
      default:
        break;
    }

    setValidationErrors(errors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação final
    const errors = {};
    if (!formData.email) errors.email = 'Email é obrigatório';
    if (!formData.password) errors.password = 'Senha é obrigatória';
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await login(formData.email, formData.password);
    } catch {
      // Erro já é tratado pelo contexto
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const isFormValid = Object.keys(validationErrors).length === 0 && 
                     formData.email && formData.password;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `
          linear-gradient(135deg, #1E1E2F 0%, #2A2A3E 50%, #1E1E2F 100%),
          linear-gradient(45deg, #6C63FF 0%, #00D2FF 50%, #FFD166 100%)
        `,
        backgroundSize: '100% 100%, 200% 200%',
        animation: 'gradientShift 15s ease-in-out infinite',
        padding: { xs: 1, sm: 2, md: 3 },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decorativo com animação */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(108, 99, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0, 210, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 209, 102, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 60% 60%, rgba(255, 107, 107, 0.05) 0%, transparent 50%)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%',
          animation: 'gradientShift 20s ease-in-out infinite',
          zIndex: 0
        }}
      />
      
      {/* Partículas flutuantes */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          '&::before, &::after, & > div': {
            content: '""',
            position: 'absolute',
            width: 6,
            height: 6,
            background: 'rgba(108, 99, 255, 0.4)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite'
          },
          '&::before': {
            top: '15%',
            left: '10%',
            animationDelay: '0s'
          },
          '&::after': {
            top: '70%',
            right: '20%',
            animationDelay: '4s',
            background: 'rgba(0, 210, 255, 0.4)',
            width: 4,
            height: 4
          }
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '30%',
            right: '15%',
            width: 3,
            height: 3,
            background: 'rgba(255, 209, 102, 0.5)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite',
            animationDelay: '2s'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '60%',
            left: '20%',
            width: 5,
            height: 5,
            background: 'rgba(255, 107, 107, 0.3)',
            borderRadius: '50%',
            animation: 'float 10s ease-in-out infinite',
            animationDelay: '6s'
          }}
        />
      </Box>

      <Fade in timeout={800}>
        <Box
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: 900, md: 1000 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            background: 'rgba(30, 30, 47, 0.9)',
            backdropFilter: 'blur(25px)',
            boxShadow: `
              0 12px 40px rgba(0, 0, 0, 0.4),
              0 4px 12px rgba(0, 0, 0, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              inset 0 -1px 0 rgba(0, 0, 0, 0.1)
            `,
            position: 'relative',
            zIndex: 1,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
            overflow: 'hidden',
            '&:hover': {
              transform: 'perspective(1000px) rotateX(1deg) rotateY(-0.5deg) translateY(-2px)',
              boxShadow: `
                0 20px 60px rgba(0, 0, 0, 0.5),
                0 8px 20px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2),
                inset 0 -1px 0 rgba(0, 0, 0, 0.1),
                0 0 40px rgba(108, 99, 255, 0.2)
              `
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)',
              animation: 'shimmer 4s ease-in-out infinite'
            }
          }}
        >
          {/* Seção Esquerda - Informações/Branding */}
          <Box
            sx={{
              flex: { xs: 'none', md: '1' },
              background: `
                linear-gradient(135deg, rgba(108, 99, 255, 0.1) 0%, rgba(0, 210, 255, 0.1) 100%),
                radial-gradient(circle at 30% 70%, rgba(108, 99, 255, 0.2) 0%, transparent 50%)
              `,
              p: 0,
              m: 0,
              position: 'relative',
              height: '100%',
              overflow: 'hidden'
            }}
          >
            {/* Logo principal - Grande */}
            <Zoom in timeout={1000}>
              <img 
                src="/logo.png" 
                alt="Logo Calculadora" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'fill',
                  display: 'block'
                }}
              />
            </Zoom>
          </Box>

          {/* Seção Direita - Formulário */}
          <Box
            sx={{
              flex: { xs: 'none', md: '1' },
              p: { xs: 3, md: 5 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minHeight: { xs: 'auto', md: 500 }
            }}
          >
            {/* Título do formulário */}
            <Fade in timeout={1800}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: '#FFFFFF',
                  mb: 3,
                  textAlign: 'center',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  letterSpacing: '-0.01em'
                }}
              >
                Acesse sua conta
              </Typography>
            </Fade>

            {/* Formulário */}
            <Box component="form" onSubmit={handleSubmit}>
          {/* Email */}
          <Slide direction="right" in timeout={2000}>
            <TextField
              fullWidth
              name="email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              disabled={loading || isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ 
                      color: '#6C63FF',
                      filter: 'drop-shadow(0 2px 4px rgba(108, 99, 255, 0.3))'
                    }} />
                  </InputAdornment>
                )
              }}
              sx={{ 
                mb: 3.5,
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(30, 30, 47, 0.6)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(30, 30, 47, 0.8)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#6C63FF',
                      boxShadow: '0 0 0 2px rgba(108, 99, 255, 0.2)'
                    }
                  },
                  '&.Mui-focused': {
                    background: 'rgba(30, 30, 47, 0.9)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#6C63FF',
                      borderWidth: 2,
                      boxShadow: '0 0 0 4px rgba(108, 99, 255, 0.2)'
                    }
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#B8B8CC',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                  '&.Mui-focused': {
                    color: '#6C63FF'
                  }
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  borderWidth: 1
                },
                '& .MuiInputBase-input': {
                  color: '#FFFFFF',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                  '&::placeholder': {
                    color: '#8B8B9E',
                    opacity: 1
                  }
                }
              }}
            />
          </Slide>

          {/* Senha */}
          <Slide direction="right" in timeout={2200}>
            <TextField
              fullWidth
              name="password"
              type={showPassword ? 'text' : 'password'}
              label="Senha"
              value={formData.password}
              onChange={handleChange}
              error={!!validationErrors.password}
              helperText={validationErrors.password}
              disabled={loading || isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ 
                      color: '#6C63FF',
                      filter: 'drop-shadow(0 2px 4px rgba(108, 99, 255, 0.3))'
                    }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      disabled={loading || isSubmitting}
                      sx={{
                        color: '#6C63FF',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(108, 99, 255, 0.1)',
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ 
                mb: 3.5,
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(30, 30, 47, 0.6)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(30, 30, 47, 0.8)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#6C63FF',
                      boxShadow: '0 0 0 2px rgba(108, 99, 255, 0.2)'
                    }
                  },
                  '&.Mui-focused': {
                    background: 'rgba(30, 30, 47, 0.9)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#6C63FF',
                      borderWidth: 2,
                      boxShadow: '0 0 0 4px rgba(108, 99, 255, 0.2)'
                    }
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#B8B8CC',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                  '&.Mui-focused': {
                    color: '#6C63FF'
                  }
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  borderWidth: 1
                },
                '& .MuiInputBase-input': {
                  color: '#FFFFFF',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                  '&::placeholder': {
                    color: '#8B8B9E',
                    opacity: 1
                  }
                }
              }}
            />
          </Slide>

          {/* Erro geral */}
          {error && (
            <Grow in timeout={100}>
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3.5, 
                  borderRadius: 3,
                  background: 'rgba(244, 67, 54, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(244, 67, 54, 0.3)',
                  color: '#FF6B6B',
                  '& .MuiAlert-icon': {
                    color: '#FF6B6B'
                  }
                }}
              >
                {error}
              </Alert>
            </Grow>
          )}

          {/* Botão de login */}
          <Grow in timeout={2400}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={!isFormValid || loading || isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
              sx={{
                mb: 3.5,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
                boxShadow: '0 8px 25px rgba(108, 99, 255, 0.4)',
                borderRadius: 3,
                textTransform: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5A52E5 0%, #00B8E6 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 35px rgba(108, 99, 255, 0.6)'
                },
                '&:active': {
                  transform: 'translateY(0px)'
                },
                '&:disabled': {
                  background: 'rgba(108, 99, 255, 0.3)',
                  color: 'rgba(255, 255, 255, 0.5)',
                  transform: 'none',
                  boxShadow: 'none'
                }
              }}
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </Grow>

          {/* Divisor */}
          <Fade in timeout={2600}>
            <Divider 
              sx={{ 
                mb: 3.5, 
                '&::before, &::after': { 
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  borderWidth: 1
                } 
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#8B8B9E', 
                  px: 2,
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                  fontWeight: 500
                }}
              >
                ou
              </Typography>
            </Divider>
          </Fade>

          {/* Link para registro */}
          <Grow in timeout={2800}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<RegisterIcon />}
              onClick={onSwitchToRegister}
              disabled={loading || isSubmitting}
              sx={{
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'rgba(30, 30, 47, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
                textTransform: 'none',
                color: '#FFFFFF',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: 'rgba(30, 30, 47, 0.8)',
                  borderColor: '#6C63FF',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(108, 99, 255, 0.2)'
                },
                '&:active': {
                  transform: 'translateY(0px)'
                },
                '&:disabled': {
                  background: 'rgba(30, 30, 47, 0.3)',
                  color: 'rgba(255, 255, 255, 0.3)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'none',
                  boxShadow: 'none'
                }
              }}
            >
              Criar nova conta
            </Button>
          </Grow>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
};

export default LoginPage;
