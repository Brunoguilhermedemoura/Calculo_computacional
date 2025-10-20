/**
 * Context de autenticação
 * Gerencia estado global de autenticação e usuário
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  login as authLogin, 
  register as authRegister, 
  logout as authLogout, 
  getCurrentUser, 
  updateUser as authUpdateUser,
  isAuthenticated 
} from '../services/authService.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verifica se há usuário logado ao inicializar
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const currentUser = getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Erro ao inicializar autenticação:', err);
        setError('Erro ao carregar dados do usuário');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Função de login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = await authLogin(email, password);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função de registro
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = await authRegister(name, email, password);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await authLogout();
      setUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar dados do usuário
  const updateUser = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedUser = await authUpdateUser(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função para limpar erros
  const clearError = () => {
    setError(null);
  };

  // Verifica se está autenticado
  const authenticated = isAuthenticated();

  const value = {
    user,
    loading,
    error,
    authenticated,
    login,
    register,
    logout,
    updateUser,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
