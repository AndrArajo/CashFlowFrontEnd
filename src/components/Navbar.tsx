import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Verificar se está em modo mock
const USE_MOCKS = process.env.REACT_APP_USE_MOCKS === 'true';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authState, logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Se estiver em modo mock, exibe o navbar ou se estiver autenticado
  if (!USE_MOCKS && !authState.isAuthenticated) {
    return null;
  }

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CashFlow
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              component={Link}
              to="/"
              color="inherit"
              variant={isActive('/') ? 'outlined' : 'text'}
            >
              Transações
            </Button>
            
            <Button
              component={Link}
              to="/balanco-diario"
              color="inherit"
              variant={isActive('/balanco-diario') ? 'outlined' : 'text'}
            >
              Balanço Diário
            </Button>

            {/* Só exibe o botão de logout quando não estiver em modo mock */}
            {!USE_MOCKS && (
              <Button 
                color="inherit"
                onClick={handleLogout}
              >
                Sair
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 