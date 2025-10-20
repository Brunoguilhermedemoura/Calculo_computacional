/**
 * Serviço de armazenamento de cálculos por usuário
 * Gerencia histórico e estatísticas de cálculos individuais
 */

import { getCurrentUser, getUserData } from './authService.js';

/**
 * Salva um cálculo no histórico do usuário
 */
export const saveCalculation = (calculation) => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    console.warn('Usuário não logado - cálculo não salvo');
    return false;
  }

  try {
    const userData = getUserData();
    if (!userData) {
      console.error('Dados do usuário não encontrados');
      return false;
    }

    // Adiciona timestamp e ID único ao cálculo
    const calculationWithMeta = {
      ...calculation,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      timestamp: new Date().toISOString(),
      userId: currentUser.id
    };

    // Adiciona ao array de cálculos
    userData.calculations = userData.calculations || [];
    userData.calculations.unshift(calculationWithMeta); // Adiciona no início

    // Mantém apenas os últimos 100 cálculos por usuário
    if (userData.calculations.length > 100) {
      userData.calculations = userData.calculations.slice(0, 100);
    }

    // Atualiza no localStorage
    const users = JSON.parse(localStorage.getItem('calculadora_limites_users') || '[]');
    const userIndex = users.findIndex(user => user.id === currentUser.id);
    
    if (userIndex !== -1) {
      users[userIndex] = userData;
      localStorage.setItem('calculadora_limites_users', JSON.stringify(users));
      return true;
    }

    return false;
  } catch (error) {
    console.error('Erro ao salvar cálculo:', error);
    return false;
  }
};

/**
 * Obtém cálculos do usuário atual
 */
export const getUserCalculations = (limit = 50) => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return [];
  }

  try {
    const userData = getUserData();
    if (!userData || !userData.calculations) {
      return [];
    }

    return userData.calculations.slice(0, limit);
  } catch (error) {
    console.error('Erro ao obter cálculos do usuário:', error);
    return [];
  }
};

/**
 * Limpa histórico do usuário atual
 */
export const clearUserHistory = () => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return false;
  }

  try {
    const users = JSON.parse(localStorage.getItem('calculadora_limites_users') || '[]');
    const userIndex = users.findIndex(user => user.id === currentUser.id);
    
    if (userIndex !== -1) {
      users[userIndex].calculations = [];
      localStorage.setItem('calculadora_limites_users', JSON.stringify(users));
      return true;
    }

    return false;
  } catch (error) {
    console.error('Erro ao limpar histórico:', error);
    return false;
  }
};

/**
 * Obtém estatísticas do usuário
 */
export const getCalculationStats = () => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return {
      totalCalculations: 0,
      mostUsedStrategies: [],
      recentCalculations: [],
      averageComplexity: 0,
      lastCalculation: null
    };
  }

  try {
    const calculations = getUserCalculations(100);
    
    if (calculations.length === 0) {
      return {
        totalCalculations: 0,
        mostUsedStrategies: [],
        recentCalculations: [],
        averageComplexity: 0,
        lastCalculation: null
      };
    }

    // Conta estratégias mais usadas
    const strategyCount = {};
    let totalComplexity = 0;

    calculations.forEach(calc => {
      if (calc.strategy) {
        strategyCount[calc.strategy] = (strategyCount[calc.strategy] || 0) + 1;
      }
      
      // Calcula complexidade baseada no número de passos
      const complexity = calc.steps ? calc.steps.length : 1;
      totalComplexity += complexity;
    });

    // Ordena estratégias por frequência
    const mostUsedStrategies = Object.entries(strategyCount)
      .map(([strategy, count]) => ({ strategy, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Cálculos recentes (últimos 5)
    const recentCalculations = calculations.slice(0, 5).map(calc => ({
      id: calc.id,
      function: calc.functionValue || calc.function,
      limit: calc.limitPoint || calc.limit,
      result: calc.result,
      strategy: calc.strategy,
      timestamp: calc.timestamp
    }));

    return {
      totalCalculations: calculations.length,
      mostUsedStrategies,
      recentCalculations,
      averageComplexity: Math.round(totalComplexity / calculations.length * 10) / 10,
      lastCalculation: calculations[0] ? {
        function: calculations[0].functionValue || calculations[0].function,
        limit: calculations[0].limitPoint || calculations[0].limit,
        result: calculations[0].result,
        timestamp: calculations[0].timestamp
      } : null
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return {
      totalCalculations: 0,
      mostUsedStrategies: [],
      recentCalculations: [],
      averageComplexity: 0,
      lastCalculation: null
    };
  }
};

/**
 * Obtém cálculos por estratégia
 */
export const getCalculationsByStrategy = (strategy) => {
  const calculations = getUserCalculations();
  return calculations.filter(calc => calc.strategy === strategy);
};

/**
 * Obtém cálculos por período
 */
export const getCalculationsByPeriod = (days = 7) => {
  const calculations = getUserCalculations();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return calculations.filter(calc => {
    const calcDate = new Date(calc.timestamp);
    return calcDate >= cutoffDate;
  });
};

/**
 * Exporta dados do usuário (para backup)
 */
export const exportUserData = () => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return null;
  }

  const userData = getUserData();
  if (!userData) {
    return null;
  }

  return {
    user: {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      createdAt: userData.createdAt
    },
    calculations: userData.calculations || [],
    exportedAt: new Date().toISOString(),
    version: '1.0'
  };
};

/**
 * Importa dados do usuário (para restore)
 */
export const importUserData = (data) => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('Usuário não logado');
  }

  if (!data || !data.calculations || !Array.isArray(data.calculations)) {
    throw new Error('Dados inválidos');
  }

  try {
    const users = JSON.parse(localStorage.getItem('calculadora_limites_users') || '[]');
    const userIndex = users.findIndex(user => user.id === currentUser.id);
    
    if (userIndex !== -1) {
      // Adiciona cálculos importados aos existentes
      const existingCalculations = users[userIndex].calculations || [];
      const importedCalculations = data.calculations.map(calc => ({
        ...calc,
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        timestamp: calc.timestamp || new Date().toISOString(),
        userId: currentUser.id
      }));

      users[userIndex].calculations = [...importedCalculations, ...existingCalculations];
      
      // Mantém apenas os últimos 100
      if (users[userIndex].calculations.length > 100) {
        users[userIndex].calculations = users[userIndex].calculations.slice(0, 100);
      }

      localStorage.setItem('calculadora_limites_users', JSON.stringify(users));
      return true;
    }

    return false;
  } catch (error) {
    console.error('Erro ao importar dados:', error);
    throw new Error('Erro ao importar dados');
  }
};
