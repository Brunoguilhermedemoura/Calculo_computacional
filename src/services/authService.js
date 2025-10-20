/**
 * Serviço de autenticação usando localStorage
 * Gerencia registro, login, logout e persistência de usuários
 */

// Chaves para localStorage
const USERS_KEY = 'calculadora_limites_users';
const CURRENT_USER_KEY = 'calculadora_limites_current_user';

/**
 * Gera um ID único simples
 */
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Hash básico de senha (para localStorage local)
 */
const hashPassword = (password) => {
  return btoa(password + 'salt_calculadora');
};

/**
 * Verifica se a senha está correta
 */
const verifyPassword = (password, hashedPassword) => {
  return hashPassword(password) === hashedPassword;
};

/**
 * Valida formato de email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida força da senha
 */
const validatePassword = (password) => {
  if (password.length < 6) {
    return { valid: false, message: 'Senha deve ter pelo menos 6 caracteres' };
  }
  return { valid: true };
};

/**
 * Busca usuário por email
 */
const findUserByEmail = (email) => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

/**
 * Busca usuário por ID
 */
const findUserById = (id) => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

/**
 * Obtém todos os usuários do localStorage
 */
const getUsers = () => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
    return [];
  }
};

/**
 * Salva usuários no localStorage
 */
const saveUsers = (users) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Erro ao salvar usuários:', error);
    return false;
  }
};

/**
 * Registra um novo usuário
 */
export const register = async (name, email, password) => {
  // Validações
  if (!name || !email || !password) {
    throw new Error('Todos os campos são obrigatórios');
  }

  if (!isValidEmail(email)) {
    throw new Error('Email inválido');
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    throw new Error(passwordValidation.message);
  }

  // Verifica se email já existe
  const existingUser = findUserByEmail(email);
  if (existingUser) {
    throw new Error('Email já cadastrado');
  }

  // Cria novo usuário
  const newUser = {
    id: generateId(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashPassword(password),
    createdAt: new Date().toISOString(),
    calculations: []
  };

  // Salva no localStorage
  const users = getUsers();
  users.push(newUser);
  
  if (!saveUsers(users)) {
    throw new Error('Erro ao salvar usuário');
  }

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    createdAt: newUser.createdAt
  };
};

/**
 * Faz login do usuário
 */
export const login = async (email, password) => {
  // Validações
  if (!email || !password) {
    throw new Error('Email e senha são obrigatórios');
  }

  if (!isValidEmail(email)) {
    throw new Error('Email inválido');
  }

  // Busca usuário
  const user = findUserByEmail(email.toLowerCase().trim());
  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  // Verifica senha
  if (!verifyPassword(password, user.password)) {
    throw new Error('Senha incorreta');
  }

  // Salva usuário atual
  try {
    localStorage.setItem(CURRENT_USER_KEY, user.id);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };
  } catch (error) {
    console.error('Erro ao salvar sessão:', error);
    throw new Error('Erro ao fazer login');
  }
};

/**
 * Faz logout do usuário
 */
export const logout = () => {
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
    return true;
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    return false;
  }
};

/**
 * Obtém usuário atual
 */
export const getCurrentUser = () => {
  try {
    const userId = localStorage.getItem(CURRENT_USER_KEY);
    if (!userId) return null;

    const user = findUserById(userId);
    if (!user) {
      // Remove sessão inválida
      localStorage.removeItem(CURRENT_USER_KEY);
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error);
    return null;
  }
};

/**
 * Atualiza dados do usuário
 */
export const updateUser = async (userData) => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('Usuário não logado');
  }

  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === currentUser.id);
  
  if (userIndex === -1) {
    throw new Error('Usuário não encontrado');
  }

  // Atualiza dados permitidos
  if (userData.name) {
    users[userIndex].name = userData.name.trim();
  }
  if (userData.email) {
    if (!isValidEmail(userData.email)) {
      throw new Error('Email inválido');
    }
    // Verifica se email já existe em outro usuário
    const existingUser = findUserByEmail(userData.email);
    if (existingUser && existingUser.id !== currentUser.id) {
      throw new Error('Email já cadastrado');
    }
    users[userIndex].email = userData.email.toLowerCase().trim();
  }

  if (!saveUsers(users)) {
    throw new Error('Erro ao atualizar usuário');
  }

  return {
    id: users[userIndex].id,
    name: users[userIndex].name,
    email: users[userIndex].email,
    createdAt: users[userIndex].createdAt
  };
};

/**
 * Verifica se usuário está autenticado
 */
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

/**
 * Obtém dados completos do usuário (incluindo cálculos)
 */
export const getUserData = () => {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  const user = findUserById(currentUser.id);
  return user;
};

/**
 * Altera senha do usuário atual
 */
export const changePassword = async (currentPassword, newPassword) => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('Usuário não logado');
  }

  // Validações
  if (!currentPassword || !newPassword) {
    throw new Error('Senha atual e nova senha são obrigatórias');
  }

  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.valid) {
    throw new Error(passwordValidation.message);
  }

  try {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === currentUser.id);
    
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }

    // Verifica senha atual
    if (!verifyPassword(currentPassword, users[userIndex].password)) {
      throw new Error('Senha atual incorreta');
    }

    // Atualiza senha
    users[userIndex].password = hashPassword(newPassword);
    
    if (!saveUsers(users)) {
      throw new Error('Erro ao salvar nova senha');
    }

    return true;
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    throw error;
  }
};

/**
 * Atualiza perfil do usuário (nome e email)
 */
export const updateUserProfile = async (userData) => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('Usuário não logado');
  }

  if (!userData || (!userData.name && !userData.email)) {
    throw new Error('Dados para atualização são obrigatórios');
  }

  try {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === currentUser.id);
    
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }

    // Validações
    if (userData.name) {
      if (userData.name.trim().length < 2) {
        throw new Error('Nome deve ter pelo menos 2 caracteres');
      }
      users[userIndex].name = userData.name.trim();
    }

    if (userData.email) {
      if (!isValidEmail(userData.email)) {
        throw new Error('Email inválido');
      }
      
      // Verifica se email já existe em outro usuário
      const existingUser = findUserByEmail(userData.email);
      if (existingUser && existingUser.id !== currentUser.id) {
        throw new Error('Email já cadastrado');
      }
      
      users[userIndex].email = userData.email.toLowerCase().trim();
    }

    if (!saveUsers(users)) {
      throw new Error('Erro ao atualizar perfil');
    }

    return {
      id: users[userIndex].id,
      name: users[userIndex].name,
      email: users[userIndex].email,
      createdAt: users[userIndex].createdAt
    };
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
};

/**
 * Exclui conta do usuário atual
 */
export const deleteUserAccount = async (confirmationText) => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('Usuário não logado');
  }

  if (confirmationText !== 'EXCLUIR CONTA') {
    throw new Error('Texto de confirmação incorreto');
  }

  try {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === currentUser.id);
    
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }

    // Remove usuário da lista
    users.splice(userIndex, 1);
    
    if (!saveUsers(users)) {
      throw new Error('Erro ao excluir conta');
    }

    // Remove sessão atual
    localStorage.removeItem(CURRENT_USER_KEY);

    // Remove configurações do usuário
    const settingsKey = `calculadora_limites_settings_${currentUser.id}`;
    localStorage.removeItem(settingsKey);

    return true;
  } catch (error) {
    console.error('Erro ao excluir conta:', error);
    throw error;
  }
};

/**
 * Exclui todos os cálculos do usuário atual
 */
export const clearUserCalculations = async (confirmationText) => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('Usuário não logado');
  }

  if (confirmationText !== 'EXCLUIR CÁLCULOS') {
    throw new Error('Texto de confirmação incorreto');
  }

  try {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === currentUser.id);
    
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }

    // Limpa array de cálculos
    users[userIndex].calculations = [];
    
    if (!saveUsers(users)) {
      throw new Error('Erro ao excluir cálculos');
    }

    return true;
  } catch (error) {
    console.error('Erro ao excluir cálculos:', error);
    throw error;
  }
};

/**
 * Obtém estatísticas detalhadas do usuário
 */
export const getUserStats = () => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return null;
  }

  try {
    const userData = getUserData();
    if (!userData) {
      return null;
    }

    const calculations = userData.calculations || [];
    const now = new Date();
    const createdAt = new Date(userData.createdAt);
    const daysSinceCreation = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));

    // Conta estratégias mais usadas
    const strategyCount = {};
    calculations.forEach(calc => {
      if (calc.strategy) {
        strategyCount[calc.strategy] = (strategyCount[calc.strategy] || 0) + 1;
      }
    });

    const mostUsedStrategy = Object.entries(strategyCount)
      .sort(([,a], [,b]) => b - a)[0];

    return {
      totalCalculations: calculations.length,
      daysSinceCreation,
      mostUsedStrategy: mostUsedStrategy ? mostUsedStrategy[0] : 'Nenhuma',
      lastCalculation: calculations[0] ? {
        function: calculations[0].functionValue || calculations[0].function,
        limit: calculations[0].limitPoint || calculations[0].point,
        result: calculations[0].result,
        timestamp: calculations[0].timestamp
      } : null,
      averagePerDay: daysSinceCreation > 0 
        ? Math.round((calculations.length / daysSinceCreation) * 10) / 10 
        : 0
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return null;
  }
};

/**
 * Limpa todos os dados (para desenvolvimento/teste)
 */
export const clearAllData = () => {
  try {
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    return true;
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
    return false;
  }
};
