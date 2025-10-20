/**
 * Página de Registro
 * Interface de cadastro com validações e design consistente
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
  LinearProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  PersonAdd as RegisterIcon,
  Login as LoginIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth.js';

const RegisterPage = ({ onSwitchToLogin }) => {
  const { register, loading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Limpa erros quando componente monta
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Calcula força da senha
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '#FF6B6B' };
    
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    const labels = ['Muito fraca', 'Fraca', 'Regular', 'Boa', 'Forte', 'Muito forte'];
    const colors = ['#FF6B6B', '#FF8E8E', '#FFD166', '#FFD980', '#00D2FF', '#6C63FF'];
    
    return {
      score,
      label: labels[Math.min(score, 5)],
      color: colors[Math.min(score, 5)]
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Validação em tempo real
  const validateField = (name, value) => {
    const errors = { ...validationErrors };

    switch (name) {
      case 'name':
        if (!value) {
          errors.name = 'Nome é obrigatório';
        } else if (value.trim().length < 2) {
          errors.name = 'Nome deve ter pelo menos 2 caracteres';
        } else {
          delete errors.name;
        }
        break;
      
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
      
      case 'confirmPassword':
        if (!value) {
          errors.confirmPassword = 'Confirmação de senha é obrigatória';
        } else if (value !== formData.password) {
          errors.confirmPassword = 'Senhas não coincidem';
        } else {
          delete errors.confirmPassword;
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
    if (!formData.name) errors.name = 'Nome é obrigatório';
    if (!formData.email) errors.email = 'Email é obrigatório';
    if (!formData.password) errors.password = 'Senha é obrigatória';
    if (!formData.confirmPassword) errors.confirmPassword = 'Confirmação de senha é obrigatória';
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Senhas não coincidem';
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await register(formData.name, formData.email, formData.password);
    } catch (err) {
      // Erro já é tratado pelo contexto
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };

  const isFormValid = Object.keys(validationErrors).length === 0 && 
                     formData.name && formData.email && 
                     formData.password && formData.confirmPassword &&
                     formData.password === formData.confirmPassword;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1E1E2F 0%, #2A2A3E 50%, #1E1E2F 100%)',
        padding: 2,
        position: 'relative'
      }}
    >
      {/* Background decorativo */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(108, 99, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0, 210, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 209, 102, 0.05) 0%, transparent 50%)
          `,
          zIndex: 0
        }}
      />

      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 450,
          p: 4,
          background: 'rgba(30, 30, 47, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          position: 'relative',
          zIndex: 1,
          animation: 'fadeIn 0.6s ease-out'
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 32px rgba(108, 99, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              animation: 'glow 3s ease-in-out infinite'
            }}
          >
            <RegisterIcon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            Criar conta
          </Typography>
          
          <Typography variant="body2" sx={{ color: '#B8B8CC' }}>
            Comece a calcular limites de forma personalizada
          </Typography>
        </Box>

        {/* Formulário */}
        <Box component="form" onSubmit={handleSubmit}>
          {/* Nome */}
          <TextField
            fullWidth
            name="name"
            type="text"
            label="Nome completo"
            value={formData.name}
            onChange={handleChange}
            error={!!validationErrors.name}
            helperText={validationErrors.name}
            disabled={loading || isSubmitting}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: '#6C63FF' }} />
                </InputAdornment>
              )
            }}
            sx={{ mb: 3 }}
          />

          {/* Email */}
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
                  <EmailIcon sx={{ color: '#6C63FF' }} />
                </InputAdornment>
              )
            }}
            sx={{ mb: 3 }}
          />

          {/* Senha */}
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
                  <LockIcon sx={{ color: '#6C63FF' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                    disabled={loading || isSubmitting}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ mb: 2 }}
          />

          {/* Indicador de força da senha */}
          {formData.password && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="caption" sx={{ color: '#B8B8CC' }}>
                  Força da senha:
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: passwordStrength.color,
                    fontWeight: 600
                  }}
                >
                  {passwordStrength.label}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(passwordStrength.score / 5) * 100}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: passwordStrength.color,
                    borderRadius: 2
                  }
                }}
              />
            </Box>
          )}

          {/* Confirmar Senha */}
          <TextField
            fullWidth
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirmar senha"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!validationErrors.confirmPassword}
            helperText={validationErrors.confirmPassword}
            disabled={loading || isSubmitting}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: '#6C63FF' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleConfirmPasswordVisibility}
                    edge="end"
                    disabled={loading || isSubmitting}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ mb: 3 }}
          />

          {/* Erro geral */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Botão de registro */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={!isFormValid || loading || isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <RegisterIcon />}
            sx={{
              mb: 3,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            {isSubmitting ? 'Criando conta...' : 'Criar conta'}
          </Button>

          {/* Divisor */}
          <Divider sx={{ mb: 3, '&::before, &::after': { borderColor: 'rgba(255, 255, 255, 0.1)' } }}>
            <Typography variant="body2" sx={{ color: '#8B8B9E', px: 2 }}>
              ou
            </Typography>
          </Divider>

          {/* Link para login */}
          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<LoginIcon />}
            onClick={onSwitchToLogin}
            disabled={loading || isSubmitting}
            sx={{
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            Já tenho uma conta
          </Button>
        </Box>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="caption" sx={{ color: '#8B8B9E' }}>
            Calculadora de Limites • Cálculo Diferencial e Integral
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
