/**
 * Modal de perfil do usuário
 * Edição de dados, estatísticas e ações perigosas
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Avatar,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  Collapse,
  Card,
  CardContent,
  Chip,
  Grid,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Delete as DeleteIcon,
  BarChart as BarChartIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Functions as FunctionsIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth.js';
import { 
  updateUserProfile, 
  changePassword, 
  deleteUserAccount, 
  clearUserCalculations,
  getUserStats 
} from '../services/authService.js';
import ConfirmDialog from './ConfirmDialog.jsx';

const ProfileModal = ({ open, onClose }) => {
  const { user, updateUser } = useAuth();
  
  // Estados do modal
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados de edição
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    email: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  
  // Estados de senha
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  
  // Estados de confirmação
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showDeleteCalculations, setShowDeleteCalculations] = useState(false);
  
  // Estados de estatísticas
  const [stats, setStats] = useState(null);
  
  // Cores de avatar
  const avatarColors = [
    'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
    'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
    'linear-gradient(135deg, #FFD166 0%, #FFD980 100%)',
    'linear-gradient(135deg, #00D2FF 0%, #6C63FF 100%)',
    'linear-gradient(135deg, #4A42CC 0%, #8B7FFF 100%)',
    'linear-gradient(135deg, #FF8E8E 0%, #FFB3B3 100%)'
  ];
  const [selectedAvatarColor, setSelectedAvatarColor] = useState(0);

  // Carregar dados iniciais
  useEffect(() => {
    if (open && user) {
      setEditData({
        name: user.name,
        email: user.email
      });
      setValidationErrors({});
      setPasswordErrors({});
      setError('');
      setSuccess('');
      loadStats();
    }
  }, [open, user]);

  const loadStats = async () => {
    try {
      const userStats = getUserStats();
      setStats(userStats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancelar edição
      setEditData({
        name: user.name,
        email: user.email
      });
      setValidationErrors({});
    }
    setIsEditing(!isEditing);
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
    
    // Validação em tempo real
    const errors = { ...validationErrors };
    
    if (field === 'name' && value.trim().length < 2) {
      errors.name = 'Nome deve ter pelo menos 2 caracteres';
    } else if (field === 'name') {
      delete errors.name;
    }
    
    if (field === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors.email = 'Email inválido';
    } else if (field === 'email') {
      delete errors.email;
    }
    
    setValidationErrors(errors);
  };

  const handleSaveProfile = async () => {
    const errors = {};
    
    if (!editData.name.trim()) errors.name = 'Nome é obrigatório';
    if (!editData.email.trim()) errors.email = 'Email é obrigatório';
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const updatedUser = await updateUserProfile(editData);
      await updateUser(updatedUser);
      setIsEditing(false);
      setSuccess('Perfil atualizado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    
    const errors = { ...passwordErrors };
    
    if (field === 'newPassword' && value && value.length < 6) {
      errors.newPassword = 'Senha deve ter pelo menos 6 caracteres';
    } else if (field === 'newPassword') {
      delete errors.newPassword;
    }
    
    if (field === 'confirmPassword' && value !== passwordData.newPassword) {
      errors.confirmPassword = 'Senhas não coincidem';
    } else if (field === 'confirmPassword') {
      delete errors.confirmPassword;
    }
    
    setPasswordErrors(errors);
  };

  const handleChangePassword = async () => {
    const errors = {};
    
    if (!passwordData.currentPassword) errors.currentPassword = 'Senha atual é obrigatória';
    if (!passwordData.newPassword) errors.newPassword = 'Nova senha é obrigatória';
    if (!passwordData.confirmPassword) errors.confirmPassword = 'Confirmação é obrigatória';
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Senhas não coincidem';
    }
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordSection(false);
      setSuccess('Senha alterada com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCalculations = async () => {
    setLoading(true);
    setError('');
    
    try {
      await clearUserCalculations('EXCLUIR CÁLCULOS');
      setShowDeleteCalculations(false);
      setSuccess('Cálculos excluídos com sucesso!');
      loadStats(); // Recarregar estatísticas
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError('');
    
    try {
      await deleteUserAccount('EXCLUIR CONTA');
      setShowDeleteAccount(false);
      onClose();
      // O logout será feito automaticamente pelo authService
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(30, 30, 47, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 1
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: '#FFFFFF',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <PersonIcon sx={{ color: '#6C63FF' }} />
            Perfil do Usuário
          </Typography>
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
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pb: 2 }}>
          {/* Mensagens de feedback */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              {success}
            </Alert>
          )}

          {/* Informações Básicas */}
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              mb: 3
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    background: avatarColors[selectedAvatarColor],
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    boxShadow: '0 8px 32px rgba(108, 99, 255, 0.4)'
                  }}
                >
                  {getInitials(user.name)}
                </Avatar>
                
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#FFFFFF',
                      fontWeight: 600,
                      mb: 1
                    }}
                  >
                    {user.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#B8B8CC',
                      mb: 0.5
                    }}
                  >
                    {user.email}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#8B8B9E',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    <CalendarIcon sx={{ fontSize: 16 }} />
                    Membro desde {formatDate(user.createdAt)}
                  </Typography>
                </Box>
              </Box>

              {/* Seletor de cor do avatar */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: '#B8B8CC', mb: 1 }}>
                  Cor do Avatar
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {avatarColors.map((color, index) => (
                    <Box
                      key={index}
                      onClick={() => setSelectedAvatarColor(index)}
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: color,
                        cursor: 'pointer',
                        border: selectedAvatarColor === index 
                          ? '3px solid #FFFFFF' 
                          : '2px solid transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.1)'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Botão de editar */}
              <Button
                variant="outlined"
                startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
                onClick={handleEditToggle}
                disabled={loading}
                sx={{
                  borderColor: '#6C63FF',
                  color: '#6C63FF',
                  '&:hover': {
                    borderColor: '#8B7FFF',
                    background: 'rgba(108, 99, 255, 0.1)'
                  }
                }}
              >
                {isEditing ? 'Cancelar' : 'Editar Dados'}
              </Button>
            </CardContent>
          </Card>

          {/* Formulário de Edição */}
          {isEditing && (
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                mb: 3
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#6C63FF',
                    fontWeight: 600,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <EditIcon />
                  Editar Dados
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nome Completo"
                      value={editData.name}
                      onChange={(e) => handleEditChange('name', e.target.value)}
                      error={!!validationErrors.name}
                      helperText={validationErrors.name}
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: '#6C63FF' }} />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleEditChange('email', e.target.value)}
                      error={!!validationErrors.email}
                      helperText={validationErrors.email}
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: '#6C63FF' }} />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    onClick={handleSaveProfile}
                    disabled={loading || Object.keys(validationErrors).length > 0}
                    sx={{
                      background: 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4A42CC 0%, #00A8CC 100%)'
                      }
                    }}
                  >
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Estatísticas */}
          {stats && (
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                mb: 3
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#6C63FF',
                    fontWeight: 600,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <BarChartIcon />
                  Estatísticas
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography
                        variant="h4"
                        sx={{
                          color: '#00D2FF',
                          fontWeight: 700,
                          mb: 0.5
                        }}
                      >
                        {stats.totalCalculations}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#B8B8CC' }}>
                        Cálculos Realizados
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography
                        variant="h4"
                        sx={{
                          color: '#FFD166',
                          fontWeight: 700,
                          mb: 0.5
                        }}
                      >
                        {stats.daysSinceCreation}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#B8B8CC' }}>
                        Dias de Uso
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography
                        variant="h4"
                        sx={{
                          color: '#FF6B6B',
                          fontWeight: 700,
                          mb: 0.5
                        }}
                      >
                        {stats.averagePerDay}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#B8B8CC' }}>
                        Média/Dia
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Chip
                        label={stats.mostUsedStrategy}
                        sx={{
                          background: 'rgba(108, 99, 255, 0.2)',
                          color: '#6C63FF',
                          border: '1px solid rgba(108, 99, 255, 0.3)',
                          fontWeight: 500
                        }}
                      />
                      <Typography variant="body2" sx={{ color: '#B8B8CC', mt: 1 }}>
                        Estratégia Favorita
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Alteração de Senha */}
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              mb: 3
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Button
                fullWidth
                startIcon={<LockIcon />}
                endIcon={showPasswordSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                onClick={() => setShowPasswordSection(!showPasswordSection)}
                sx={{
                  color: '#6C63FF',
                  textTransform: 'none',
                  justifyContent: 'space-between',
                  p: 2,
                  mb: showPasswordSection ? 2 : 0
                }}
              >
                Alterar Senha
              </Button>
              
              <Collapse in={showPasswordSection}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Senha Atual"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      error={!!passwordErrors.currentPassword}
                      helperText={passwordErrors.currentPassword}
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nova Senha"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      error={!!passwordErrors.newPassword}
                      helperText={passwordErrors.newPassword}
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Confirmar Nova Senha"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      error={!!passwordErrors.confirmPassword}
                      helperText={passwordErrors.confirmPassword}
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      onClick={handleChangePassword}
                      disabled={loading || Object.keys(passwordErrors).length > 0}
                      sx={{
                        background: 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #4A42CC 0%, #00A8CC 100%)'
                        }
                      }}
                    >
                      Alterar Senha
                    </Button>
                  </Grid>
                </Grid>
              </Collapse>
            </CardContent>
          </Card>

          {/* Zona Perigosa */}
          <Card
            sx={{
              background: 'rgba(255, 107, 107, 0.05)',
              border: '1px solid rgba(255, 107, 107, 0.2)',
              borderRadius: 2
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#FF6B6B',
                  fontWeight: 600,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <DeleteIcon />
                Zona Perigosa
              </Typography>
              
              <Typography
                variant="body2"
                sx={{
                  color: '#B8B8CC',
                  mb: 3
                }}
              >
                As ações abaixo são irreversíveis. Tenha certeza antes de prosseguir.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<DeleteIcon />}
                  onClick={() => setShowDeleteCalculations(true)}
                  disabled={loading}
                  sx={{
                    borderColor: '#FFD166',
                    color: '#FFD166',
                    '&:hover': {
                      borderColor: '#FFD980',
                      background: 'rgba(255, 209, 102, 0.1)'
                    }
                  }}
                >
                  Excluir Todos os Cálculos
                </Button>
                
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setShowDeleteAccount(true)}
                  disabled={loading}
                  sx={{
                    borderColor: '#FF6B6B',
                    color: '#FF6B6B',
                    '&:hover': {
                      borderColor: '#FF8E8E',
                      background: 'rgba(255, 107, 107, 0.1)'
                    }
                  }}
                >
                  Excluir Conta
                </Button>
              </Box>
            </CardContent>
          </Card>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={onClose}
            sx={{
              color: '#B8B8CC',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modais de Confirmação */}
      <ConfirmDialog
        open={showDeleteCalculations}
        onClose={() => setShowDeleteCalculations(false)}
        onConfirm={handleDeleteCalculations}
        title="Excluir Todos os Cálculos"
        message="Esta ação irá excluir permanentemente todos os seus cálculos salvos. Esta ação não pode ser desfeita."
        confirmText="Excluir Cálculos"
        type="warning"
        requireTextInput={true}
        inputLabel="Digite 'EXCLUIR CÁLCULOS' para confirmar"
        inputPlaceholder="EXCLUIR CÁLCULOS"
        confirmValue="EXCLUIR CÁLCULOS"
        loading={loading}
      />

      <ConfirmDialog
        open={showDeleteAccount}
        onClose={() => setShowDeleteAccount(false)}
        onConfirm={handleDeleteAccount}
        title="Excluir Conta"
        message="Esta ação irá excluir permanentemente sua conta e todos os dados associados. Esta ação não pode ser desfeita e você será deslogado automaticamente."
        confirmText="Excluir Conta"
        type="danger"
        requireTextInput={true}
        inputLabel="Digite 'EXCLUIR CONTA' para confirmar"
        inputPlaceholder="EXCLUIR CONTA"
        confirmValue="EXCLUIR CONTA"
        loading={loading}
      />
    </>
  );
};

export default ProfileModal;
