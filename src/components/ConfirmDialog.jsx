/**
 * Componente de diálogo de confirmação reutilizável
 * Para ações perigosas como exclusão de dados
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Alert,
  Box,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning', // 'warning', 'danger', 'info'
  requireTextInput = false,
  inputLabel = 'Digite CONFIRMAR para continuar',
  inputPlaceholder = 'CONFIRMAR',
  confirmValue = 'CONFIRMAR',
  loading = false,
  disabled = false
}) => {
  const [inputValue, setInputValue] = React.useState('');
  const [inputError, setInputError] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setInputValue('');
      setInputError(false);
    }
  }, [open]);

  const handleConfirm = () => {
    if (requireTextInput) {
      if (inputValue.trim() === confirmValue) {
        onConfirm();
        onClose();
      } else {
        setInputError(true);
      }
    } else {
      onConfirm();
      onClose();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setInputError(false);
  };

  const getTypeConfig = () => {
    switch (type) {
      case 'danger':
        return {
          color: '#FF6B6B',
          icon: <DeleteIcon sx={{ color: '#FF6B6B' }} />,
          bgColor: 'rgba(255, 107, 107, 0.1)'
        };
      case 'info':
        return {
          color: '#6C63FF',
          icon: <WarningIcon sx={{ color: '#6C63FF' }} />,
          bgColor: 'rgba(108, 99, 255, 0.1)'
        };
      default: // warning
        return {
          color: '#FFD166',
          icon: <WarningIcon sx={{ color: '#FFD166' }} />,
          bgColor: 'rgba(255, 209, 102, 0.1)'
        };
    }
  };

  const typeConfig = getTypeConfig();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(30, 30, 47, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {typeConfig.icon}
          <Typography
            variant="h6"
            sx={{
              color: '#FFFFFF',
              fontWeight: 600
            }}
          >
            {title}
          </Typography>
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
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Alert
          severity={type === 'danger' ? 'error' : type === 'info' ? 'info' : 'warning'}
          sx={{
            mb: 3,
            background: typeConfig.bgColor,
            border: `1px solid ${typeConfig.color}40`,
            '& .MuiAlert-message': {
              color: '#FFFFFF'
            }
          }}
        >
          {message}
        </Alert>

        {requireTextInput && (
          <TextField
            fullWidth
            label={inputLabel}
            placeholder={inputPlaceholder}
            value={inputValue}
            onChange={handleInputChange}
            error={inputError}
            helperText={inputError ? `Digite exatamente "${confirmValue}"` : ''}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#FFFFFF',
                '& fieldset': {
                  borderColor: inputError ? '#FF6B6B' : 'rgba(255, 255, 255, 0.2)'
                }
              },
              '& .MuiInputLabel-root': {
                color: '#B8B8CC'
              }
            }}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            color: '#B8B8CC',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={loading || disabled || (requireTextInput && inputValue.trim() !== confirmValue)}
          sx={{
            background: type === 'danger' 
              ? 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)'
              : 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
            '&:hover': {
              background: type === 'danger'
                ? 'linear-gradient(135deg, #E55A5A 0%, #FF7A7A 100%)'
                : 'linear-gradient(135deg, #4A42CC 0%, #00A8CC 100%)'
            },
            '&:disabled': {
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.3)'
            }
          }}
        >
          {loading ? 'Processando...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
