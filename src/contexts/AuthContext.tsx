import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, setToken, removeToken, isAuthenticated, getToken } from '../services/auth';
import { LoginCredentials } from '../services/auth';
import { AuthState } from '../types';

// Verificar se está em modo mock
const USE_MOCKS = process.env.REACT_APP_USE_MOCKS === 'true';

// Interface do contexto de autenticação
interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

// Criação do contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props do provedor de autenticação
interface AuthProviderProps {
  children: ReactNode;
}

// Provedor de autenticação
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: USE_MOCKS || isAuthenticated(),
    isLoading: false,
    error: null
  });

  // Verifica o token ao iniciar a aplicação
  useEffect(() => {
    // Se estiver em modo mock, sempre define como autenticado
    if (USE_MOCKS) {
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      return;
    }
    
    const token = getToken();
    if (token) {
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    }
  }, []);

  // Função de login
  const login = async (credentials: LoginCredentials) => {
    // Se estiver em modo mock, simula login bem-sucedido
    if (USE_MOCKS) {
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      return;
    }

    try {
      setAuthState({
        ...authState,
        isLoading: true,
        error: null
      });

      const response = await apiLogin(credentials);
      setToken(response.access_token);

      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        error: 'Falha na autenticação. Verifique seu usuário e senha.'
      });
      throw error;
    }
  };

  // Função de logout
  const logout = () => {
    // Se estiver em modo mock, apenas atualiza o estado
    if (USE_MOCKS) {
      setAuthState({
        isAuthenticated: true, // Mantém como autenticado em modo mock
        isLoading: false,
        error: null
      });
      return;
    }

    removeToken();
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto de autenticação
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 