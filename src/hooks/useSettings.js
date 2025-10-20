/**
 * Hook customizado para gerenciar configurações do usuário
 * Aplica configurações automaticamente e fornece interface para atualizações
 */

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth.js';
import {
  loadUserSettings,
  saveUserSettings,
  updateSettingsSection,
  applyAppearanceSettings
} from '../services/settingsService.js';

export const useSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar configurações quando o usuário muda
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userSettings = loadUserSettings();
        setSettings(userSettings);
        
        // Aplicar configurações de aparência imediatamente
        applyAppearanceSettings(userSettings);
      } catch (err) {
        console.error('Erro ao carregar configurações:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  // Atualizar configuração específica
  const updateSetting = (section, key, value) => {
    try {
      const newSettings = {
        ...settings,
        [section]: {
          ...settings[section],
          [key]: value
        }
      };
      
      setSettings(newSettings);
      updateSettingsSection(section, { [key]: value });
      
      // Aplicar configurações de aparência se necessário
      if (section === 'appearance') {
        applyAppearanceSettings(newSettings);
      }
      
      return true;
    } catch (err) {
      console.error('Erro ao atualizar configuração:', err);
      setError(err.message);
      return false;
    }
  };

  // Atualizar múltiplas configurações de uma seção
  const updateSettingsSection = (section, updates) => {
    try {
      const newSettings = {
        ...settings,
        [section]: {
          ...settings[section],
          ...updates
        }
      };
      
      setSettings(newSettings);
      saveUserSettings(newSettings);
      
      // Aplicar configurações de aparência se necessário
      if (section === 'appearance') {
        applyAppearanceSettings(newSettings);
      }
      
      return true;
    } catch (err) {
      console.error('Erro ao atualizar seção de configurações:', err);
      setError(err.message);
      return false;
    }
  };

  // Obter configuração específica
  const getSetting = (section, key) => {
    if (!settings || !settings[section]) {
      return null;
    }
    return settings[section][key];
  };

  // Obter seção completa de configurações
  const getSettingsSection = (section) => {
    if (!settings || !settings[section]) {
      return null;
    }
    return settings[section];
  };

  // Verificar se uma configuração está ativa
  const isEnabled = (section, key) => {
    const value = getSetting(section, key);
    return value === true;
  };

  // Obter valor numérico de configuração
  const getNumericValue = (section, key, defaultValue = 0) => {
    const value = getSetting(section, key);
    return typeof value === 'number' ? value : defaultValue;
  };

  // Obter valor de string de configuração
  const getStringValue = (section, key, defaultValue = '') => {
    const value = getSetting(section, key);
    return typeof value === 'string' ? value : defaultValue;
  };

  // Recarregar configurações
  const reloadSettings = () => {
    try {
      const userSettings = loadUserSettings();
      setSettings(userSettings);
      applyAppearanceSettings(userSettings);
      setError(null);
      return true;
    } catch (err) {
      console.error('Erro ao recarregar configurações:', err);
      setError(err.message);
      return false;
    }
  };

  // Aplicar configurações de aparência manualmente
  const applyAppearance = () => {
    if (settings) {
      applyAppearanceSettings(settings);
    }
  };

  return {
    settings,
    loading,
    error,
    updateSetting,
    updateSettingsSection,
    getSetting,
    getSettingsSection,
    isEnabled,
    getNumericValue,
    getStringValue,
    reloadSettings,
    applyAppearance
  };
};
