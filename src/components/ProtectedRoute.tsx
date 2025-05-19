import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Verificar se está em modo mock
const USE_MOCKS = process.env.REACT_APP_USE_MOCKS === 'true';

const ProtectedRoute: React.FC = () => {
  const { authState } = useAuth();

  // Se estiver em modo mock, sempre permite acesso
  if (USE_MOCKS) {
    return <Outlet />;
  }

  if (authState.isLoading) {
    return <div>Carregando...</div>;
  }

  return authState.isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute; 