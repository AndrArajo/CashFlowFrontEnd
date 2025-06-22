import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Interface para o resultado do login
export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

// Interface para as credenciais de login
export interface LoginCredentials {
  username: string;
  password: string;
}

// Função para realizar o login
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('client_id', 'kong');
  params.append('client_secret', 'kong-client-secret');
  params.append('username', credentials.username);
  params.append('password', credentials.password);
  params.append('scope', 'openid profile email');

  const response = await axios.post(`${API_URL}/token`, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  });

  return response.data;
};

// Salvar token no localStorage
export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

// Recuperar token do localStorage
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Remover token (logout)
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Verificar se o usuário está autenticado
export const isAuthenticated = (): boolean => {
  return !!getToken();
}; 