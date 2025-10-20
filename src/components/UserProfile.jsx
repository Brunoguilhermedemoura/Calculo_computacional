/**
 * Componente de perfil do usuário
 * Avatar e menu dropdown no header
 */

import React, { useState } from 'react';
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth.js';
import ProfileModal from './ProfileModal.jsx';
import SettingsModal from './SettingsModal.jsx';

const UserProfile = ({ onLogout }) => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    onLogout();
  };

  const handleOpenProfile = () => {
    setShowProfile(true);
    handleClose();
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
    handleClose();
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          p: 0.5,
          '&:hover': {
            transform: 'scale(1.05)'
          },
          transition: 'all 0.2s ease'
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            background: 'linear-gradient(135deg, #6C63FF 0%, #00D2FF 100%)',
            fontSize: '1rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 16px rgba(108, 99, 255, 0.3)',
            border: '2px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {getInitials(user.name)}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            background: 'rgba(30, 30, 47, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            minWidth: 200,
            mt: 1
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Header do usuário */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Typography
            variant="subtitle2"
            sx={{
              color: '#FFFFFF',
              fontWeight: 600,
              mb: 0.5
            }}
          >
            {user.name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#B8B8CC',
              fontSize: '0.75rem'
            }}
          >
            {user.email}
          </Typography>
        </Box>

        {/* Perfil */}
        <MenuItem
          onClick={handleOpenProfile}
          sx={{
            py: 1.5,
            px: 2,
            '&:hover': {
              background: 'rgba(108, 99, 255, 0.1)'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <PersonIcon sx={{ color: '#6C63FF', fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary="Perfil"
            primaryTypographyProps={{
              sx: { color: '#FFFFFF', fontSize: '0.9rem' }
            }}
          />
        </MenuItem>

        {/* Configurações */}
        <MenuItem
          onClick={handleOpenSettings}
          sx={{
            py: 1.5,
            px: 2,
            '&:hover': {
              background: 'rgba(108, 99, 255, 0.1)'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <SettingsIcon sx={{ color: '#6C63FF', fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary="Configurações"
            primaryTypographyProps={{
              sx: { color: '#FFFFFF', fontSize: '0.9rem' }
            }}
          />
        </MenuItem>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 0.5 }} />

        {/* Sair */}
        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.5,
            px: 2,
            '&:hover': {
              background: 'rgba(255, 107, 107, 0.1)'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <LogoutIcon sx={{ color: '#FF6B6B', fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary="Sair"
            primaryTypographyProps={{
              sx: { color: '#FF6B6B', fontSize: '0.9rem', fontWeight: 500 }
            }}
          />
        </MenuItem>
      </Menu>

      {/* Modais */}
      <ProfileModal
        open={showProfile}
        onClose={() => setShowProfile(false)}
      />
      
      <SettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
};

export default UserProfile;
