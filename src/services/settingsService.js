/**
 * Serviço de configurações do usuário
 * Gerencia preferências e configurações personalizadas
 */

import { getCurrentUser } from './authService.js';

// Chave base para configurações no localStorage
const SETTINGS_KEY_PREFIX = 'calculadora_limites_settings_';

/**
 * Configurações padrão do sistema
 */
const DEFAULT_SETTINGS = {
  appearance: {
    theme: 'dark',
    fontSize: 'medium', // 'small', 'medium', 'large'
    animations: true,
    glassmorphism: true
  },
  calculator: {
    precision: 6, // 2-10 casas decimais
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
};

/**
 * Obtém a chave de configurações do usuário atual
 */
const getSettingsKey = (userId) => {
  return `${SETTINGS_KEY_PREFIX}${userId}`;
};

/**
 * Carrega configurações do usuário atual
 */
export const loadUserSettings = () => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return DEFAULT_SETTINGS;
  }

  try {
    const settingsKey = getSettingsKey(currentUser.id);
    const savedSettings = localStorage.getItem(settingsKey);
    
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      // Merge com configurações padrão para garantir que novas opções sejam incluídas
      return {
        ...DEFAULT_SETTINGS,
        ...parsedSettings,
        // Merge recursivo para objetos aninhados
        appearance: {
          ...DEFAULT_SETTINGS.appearance,
          ...parsedSettings.appearance
        },
        calculator: {
          ...DEFAULT_SETTINGS.calculator,
          ...parsedSettings.calculator
        },
        notifications: {
          ...DEFAULT_SETTINGS.notifications,
          ...parsedSettings.notifications
        },
        privacy: {
          ...DEFAULT_SETTINGS.privacy,
          ...parsedSettings.privacy
        }
      };
    }
  } catch (error) {
    console.error('Erro ao carregar configurações:', error);
  }

  return DEFAULT_SETTINGS;
};

/**
 * Salva configurações do usuário atual
 */
export const saveUserSettings = (settings) => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('Usuário não logado');
  }

  try {
    const settingsKey = getSettingsKey(currentUser.id);
    localStorage.setItem(settingsKey, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    throw new Error('Erro ao salvar configurações');
  }
};

/**
 * Atualiza uma seção específica das configurações
 */
export const updateSettingsSection = (section, values) => {
  const currentSettings = loadUserSettings();
  const newSettings = {
    ...currentSettings,
    [section]: {
      ...currentSettings[section],
      ...values
    }
  };
  
  saveUserSettings(newSettings);
  return newSettings;
};

/**
 * Reseta configurações para o padrão
 */
export const resetSettingsToDefault = () => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('Usuário não logado');
  }

  try {
    const settingsKey = getSettingsKey(currentUser.id);
    localStorage.removeItem(settingsKey);
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Erro ao resetar configurações:', error);
    throw new Error('Erro ao resetar configurações');
  }
};

/**
 * Calcula o tamanho usado no localStorage
 */
export const getStorageUsage = () => {
  try {
    let totalSize = 0;
    
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const value = localStorage.getItem(key);
        totalSize += key.length + value.length;
      }
    }
    
    // Converter para MB
    const sizeInMB = totalSize / (1024 * 1024);
    const sizeInKB = totalSize / 1024;
    
    return {
      bytes: totalSize,
      kb: Math.round(sizeInKB * 100) / 100,
      mb: Math.round(sizeInMB * 100) / 100,
      formatted: sizeInMB > 1 
        ? `${Math.round(sizeInMB * 100) / 100} MB`
        : `${Math.round(sizeInKB * 100) / 100} KB`
    };
  } catch (error) {
    console.error('Erro ao calcular uso de armazenamento:', error);
    return { bytes: 0, kb: 0, mb: 0, formatted: '0 KB' };
  }
};

/**
 * Limpa cache e dados temporários
 */
export const clearCache = () => {
  try {
    const keysToRemove = [];
    
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        // Remove apenas dados de cache, mantém configurações e dados do usuário
        if (key.includes('cache') || key.includes('temp') || key.includes('_temp')) {
          keysToRemove.push(key);
        }
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    return {
      success: true,
      removedKeys: keysToRemove.length
    };
  } catch (error) {
    console.error('Erro ao limpar cache:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Exporta configurações do usuário
 */
export const exportSettings = () => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('Usuário não logado');
  }

  const settings = loadUserSettings();
  const exportData = {
    settings,
    user: {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email
    },
    exportedAt: new Date().toISOString(),
    version: '1.0'
  };

  return exportData;
};

/**
 * Importa configurações de um arquivo JSON
 */
export const importSettings = (jsonData) => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('Usuário não logado');
  }

  try {
    // Validar estrutura do JSON
    if (!jsonData || typeof jsonData !== 'object') {
      throw new Error('Dados inválidos');
    }

    if (!jsonData.settings) {
      throw new Error('Arquivo não contém configurações válidas');
    }

    // Validar se as configurações têm a estrutura esperada
    const { settings } = jsonData;
    const validSections = ['appearance', 'calculator', 'notifications', 'privacy'];
    
    for (const section of validSections) {
      if (!settings[section] || typeof settings[section] !== 'object') {
        throw new Error(`Seção '${section}' inválida ou ausente`);
      }
    }

    // Salvar configurações importadas
    saveUserSettings(settings);
    
    return {
      success: true,
      settings
    };
  } catch (error) {
    console.error('Erro ao importar configurações:', error);
    throw new Error(`Erro ao importar: ${error.message}`);
  }
};

/**
 * Aplica configurações de aparência ao DOM
 */
export const applyAppearanceSettings = (settings) => {
  const { appearance } = settings;
  
  // Aplicar tamanho da fonte
  const root = document.documentElement;
  
  switch (appearance.fontSize) {
    case 'small':
      root.style.fontSize = '14px';
      break;
    case 'large':
      root.style.fontSize = '18px';
      break;
    default: // medium
      root.style.fontSize = '16px';
  }
  
  // Aplicar animações
  if (!appearance.animations) {
    root.style.setProperty('--animation-duration', '0s');
    root.style.setProperty('--transition-duration', '0s');
  } else {
    root.style.removeProperty('--animation-duration');
    root.style.removeProperty('--transition-duration');
  }
  
  // Aplicar glassmorphism
  if (!appearance.glassmorphism) {
    root.classList.add('no-glassmorphism');
  } else {
    root.classList.remove('no-glassmorphism');
  }
};

/**
 * Obtém configurações de um usuário específico (para administração)
 */
export const getUserSettingsById = (userId) => {
  try {
    const settingsKey = getSettingsKey(userId);
    const savedSettings = localStorage.getItem(settingsKey);
    
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
    
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Erro ao obter configurações do usuário:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Lista todos os usuários com configurações salvas
 */
export const listUsersWithSettings = () => {
  try {
    const users = [];
    
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith(SETTINGS_KEY_PREFIX)) {
        const userId = key.replace(SETTINGS_KEY_PREFIX, '');
        const settings = JSON.parse(localStorage.getItem(key));
        users.push({ userId, settings });
      }
    }
    
    return users;
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return [];
  }
};
