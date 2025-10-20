/**
 * Modal de configurações do usuário
 * Preferências de aparência, calculadora, notificações e dados
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Card,
  CardContent,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Divider,
  Alert,
  CircularProgress,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Close as CloseIcon,
  Palette as PaletteIcon,
  Calculate as CalculateIcon,
  Notifications as NotificationsIcon,
  Storage as StorageIcon,
  Info as InfoIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth.js';
import {
  loadUserSettings,
  saveUserSettings,
  updateSettingsSection,
  resetSettingsToDefault,
  getStorageUsage,
  clearCache,
  exportSettings,
  importSettings,
  applyAppearanceSettings
} from '../services/settingsService.js';

const SettingsModal = ({ open, onClose }) => {
  const { user } = useAuth();
  
  // Estados do modal
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [storageUsage, setStorageUsage] = useState(null);
  
  // Estados das configurações
  const [settings, setSettings] = useState({
    appearance: {
      theme: 'dark',
      fontSize: 'medium',
      animations: true,
      glassmorphism: true
    },
    calculator: {
      precision: 6,
      autoCorrect: true,
      autoShowSteps: true,
      autoSaveHistory: true
    },
    notifications: {
      errors: true,
      tips: true,
      validation: true
    },
    privacy: {
      analytics: false,
      crashReports: true
    }
  });

  // Carregar configurações ao abrir o modal
  useEffect(() => {
    if (open && user) {
      loadSettings();
      loadStorageUsage();
    }
  }, [open, user]);

  const loadSettings = () => {
    try {
      const userSettings = loadUserSettings();
      setSettings(userSettings);
      setError('');
    } catch (err) {
      setError('Erro ao carregar configurações');
    }
  };

  const loadStorageUsage = () => {
    try {
      const usage = getStorageUsage();
      setStorageUsage(usage);
    } catch (err) {
      console.error('Erro ao carregar uso de armazenamento:', err);
    }
  };

  const handleSettingChange = (section, key, value) => {
    const newSettings = {
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value
      }
    };
    
    setSettings(newSettings);
    
    // Salvar automaticamente
    try {
      updateSettingsSection(section, { [key]: value });
      
      // Aplicar configurações de aparência imediatamente
      if (section === 'appearance') {
        applyAppearanceSettings(newSettings);
      }
    } catch (err) {
      console.error('Erro ao salvar configuração:', err);
    }
  };

  const handleResetSettings = async () => {
    setLoading(true);
    setError('');
    
    try {
      const defaultSettings = resetSettingsToDefault();
      setSettings(defaultSettings);
      applyAppearanceSettings(defaultSettings);
      setSuccess('Configurações resetadas para o padrão!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao resetar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleExportSettings = async () => {
    setLoading(true);
    setError('');
    
    try {
      const exportData = exportSettings();
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `calculadora-configuracoes-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccess('Configurações exportadas com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao exportar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleImportSettings = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');
    
    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      
      const result = importSettings(jsonData);
      setSettings(result.settings);
      applyAppearanceSettings(result.settings);
      
      setSuccess('Configurações importadas com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(`Erro ao importar: ${err.message}`);
    } finally {
      setLoading(false);
      // Limpar input
      event.target.value = '';
    }
  };

  const handleClearCache = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = clearCache();
      if (result.success) {
        setSuccess(`Cache limpo! ${result.removedKeys} itens removidos.`);
        loadStorageUsage(); // Recarregar uso de armazenamento
      } else {
        setError(result.error);
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao limpar cache');
    } finally {
      setLoading(false);
    }
  };

  const SettingCard = ({ title, icon, children }) => (
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
          {icon}
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );

  const SettingItem = ({ label, description, children }) => (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box>
          <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 500 }}>
            {label}
          </Typography>
          {description && (
            <Typography variant="body2" sx={{ color: '#B8B8CC', fontSize: '0.85rem' }}>
              {description}
            </Typography>
          )}
        </Box>
        {children}
      </Box>
    </Box>
  );

  return (
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
          <PaletteIcon sx={{ color: '#6C63FF' }} />
          Configurações
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

        {/* Aparência */}
        <SettingCard title="Aparência" icon={<PaletteIcon sx={{ color: '#6C63FF' }} />}>
          <SettingItem
            label="Tema"
            description="Escolha o tema visual da aplicação"
          >
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={settings.appearance.theme}
                onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                sx={{
                  color: '#FFFFFF',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                  }
                }}
              >
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="light" disabled>Light (Em breve)</MenuItem>
              </Select>
            </FormControl>
          </SettingItem>

          <SettingItem
            label="Tamanho da Fonte"
            description="Ajuste o tamanho do texto"
          >
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={settings.appearance.fontSize}
                onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
                sx={{
                  color: '#FFFFFF',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                  }
                }}
              >
                <MenuItem value="small">Pequeno</MenuItem>
                <MenuItem value="medium">Médio</MenuItem>
                <MenuItem value="large">Grande</MenuItem>
              </Select>
            </FormControl>
          </SettingItem>

          <SettingItem
            label="Animações"
            description="Ativar/desativar animações e transições"
          >
            <Switch
              checked={settings.appearance.animations}
              onChange={(e) => handleSettingChange('appearance', 'animations', e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#6C63FF'
                }
              }}
            />
          </SettingItem>

          <SettingItem
            label="Efeitos Glassmorphism"
            description="Ativar/desativar efeitos de vidro e blur"
          >
            <Switch
              checked={settings.appearance.glassmorphism}
              onChange={(e) => handleSettingChange('appearance', 'glassmorphism', e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#6C63FF'
                }
              }}
            />
          </SettingItem>
        </SettingCard>

        {/* Calculadora */}
        <SettingCard title="Calculadora" icon={<CalculateIcon sx={{ color: '#6C63FF' }} />}>
          <SettingItem
            label="Precisão Decimal"
            description={`${settings.calculator.precision} casas decimais`}
          >
            <Box sx={{ width: 200 }}>
              <Slider
                value={settings.calculator.precision}
                onChange={(e, value) => handleSettingChange('calculator', 'precision', value)}
                min={2}
                max={10}
                step={1}
                marks
                valueLabelDisplay="auto"
                sx={{
                  color: '#6C63FF',
                  '& .MuiSlider-thumb': {
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: '0 0 0 8px rgba(108, 99, 255, 0.16)'
                    }
                  }
                }}
              />
            </Box>
          </SettingItem>

          <SettingItem
            label="Auto-correção de Sintaxe"
            description="Corrigir automaticamente erros de digitação"
          >
            <Switch
              checked={settings.calculator.autoCorrect}
              onChange={(e) => handleSettingChange('calculator', 'autoCorrect', e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#6C63FF'
                }
              }}
            />
          </SettingItem>

          <SettingItem
            label="Mostrar Passos Automaticamente"
            description="Exibir passos da resolução automaticamente"
          >
            <Switch
              checked={settings.calculator.autoShowSteps}
              onChange={(e) => handleSettingChange('calculator', 'autoShowSteps', e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#6C63FF'
                }
              }}
            />
          </SettingItem>

          <SettingItem
            label="Salvar Histórico Automaticamente"
            description="Salvar cálculos no histórico automaticamente"
          >
            <Switch
              checked={settings.calculator.autoSaveHistory}
              onChange={(e) => handleSettingChange('calculator', 'autoSaveHistory', e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#6C63FF'
                }
              }}
            />
          </SettingItem>
        </SettingCard>

        {/* Notificações */}
        <SettingCard title="Notificações" icon={<NotificationsIcon sx={{ color: '#6C63FF' }} />}>
          <SettingItem
            label="Alertas de Erro"
            description="Mostrar alertas quando ocorrem erros"
          >
            <Switch
              checked={settings.notifications.errors}
              onChange={(e) => handleSettingChange('notifications', 'errors', e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#6C63FF'
                }
              }}
            />
          </SettingItem>

          <SettingItem
            label="Dicas e Sugestões"
            description="Mostrar dicas para melhorar o uso"
          >
            <Switch
              checked={settings.notifications.tips}
              onChange={(e) => handleSettingChange('notifications', 'tips', e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#6C63FF'
                }
              }}
            />
          </SettingItem>

          <SettingItem
            label="Avisos de Validação"
            description="Mostrar avisos de validação em tempo real"
          >
            <Switch
              checked={settings.notifications.validation}
              onChange={(e) => handleSettingChange('notifications', 'validation', e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#6C63FF'
                }
              }}
            />
          </SettingItem>
        </SettingCard>

        {/* Dados */}
        <SettingCard title="Dados" icon={<StorageIcon sx={{ color: '#6C63FF' }} />}>
          <SettingItem
            label="Exportar Configurações"
            description="Baixar suas configurações em arquivo JSON"
          >
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportSettings}
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
              Exportar
            </Button>
          </SettingItem>

          <SettingItem
            label="Importar Configurações"
            description="Carregar configurações de um arquivo JSON"
          >
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
              disabled={loading}
              sx={{
                borderColor: '#00D2FF',
                color: '#00D2FF',
                '&:hover': {
                  borderColor: '#33DBFF',
                  background: 'rgba(0, 210, 255, 0.1)'
                }
              }}
            >
              Importar
              <input
                type="file"
                accept=".json"
                hidden
                onChange={handleImportSettings}
              />
            </Button>
          </SettingItem>

          <SettingItem
            label="Limpar Cache"
            description="Remover dados temporários e cache"
          >
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={handleClearCache}
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
              Limpar Cache
            </Button>
          </SettingItem>

          {storageUsage && (
            <SettingItem
              label="Uso de Armazenamento"
              description={`${storageUsage.formatted} usado no localStorage`}
            >
              <Box sx={{ width: 200 }}>
                <LinearProgress
                  variant="determinate"
                  value={(storageUsage.mb / 10) * 100} // Assumindo 10MB como limite
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: storageUsage.mb > 8 ? '#FF6B6B' : '#6C63FF',
                      borderRadius: 4
                    }
                  }}
                />
                <Typography variant="caption" sx={{ color: '#B8B8CC', mt: 0.5, display: 'block' }}>
                  {storageUsage.formatted} / 10 MB
                </Typography>
              </Box>
            </SettingItem>
          )}
        </SettingCard>

        {/* Sobre */}
        <SettingCard title="Sobre" icon={<InfoIcon sx={{ color: '#6C63FF' }} />}>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <InfoIcon sx={{ color: '#6C63FF' }} />
              </ListItemIcon>
              <ListItemText
                primary="Versão"
                secondary="1.0.0"
                primaryTypographyProps={{ color: '#FFFFFF' }}
                secondaryTypographyProps={{ color: '#B8B8CC' }}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <CheckIcon sx={{ color: '#00D2FF' }} />
              </ListItemIcon>
              <ListItemText
                primary="Status"
                secondary="Funcionando perfeitamente"
                primaryTypographyProps={{ color: '#FFFFFF' }}
                secondaryTypographyProps={{ color: '#B8B8CC' }}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <WarningIcon sx={{ color: '#FFD166' }} />
              </ListItemIcon>
              <ListItemText
                primary="Desenvolvido para"
                secondary="Cálculo Diferencial e Integral • UNO"
                primaryTypographyProps={{ color: '#FFFFFF' }}
                secondaryTypographyProps={{ color: '#B8B8CC' }}
              />
            </ListItem>
          </List>
        </SettingCard>

        {/* Reset */}
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
              Resetar Configurações
            </Typography>
            
            <Typography
              variant="body2"
              sx={{
                color: '#B8B8CC',
                mb: 3
              }}
            >
              Voltar todas as configurações para os valores padrão.
            </Typography>
            
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleResetSettings}
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
              {loading ? 'Resetando...' : 'Resetar para Padrão'}
            </Button>
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
  );
};

export default SettingsModal;
