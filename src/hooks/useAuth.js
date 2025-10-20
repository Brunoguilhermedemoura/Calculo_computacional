/**
 * Hook customizado para autenticação
 * Facilita o uso do contexto de autenticação
 */

import { useAuth as useAuthContext } from '../contexts/AuthContext.jsx';

export const useAuth = useAuthContext;
