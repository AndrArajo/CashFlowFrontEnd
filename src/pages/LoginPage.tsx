import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Container
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

// Verificar se está em modo mock
const USE_MOCKS = process.env.REACT_APP_USE_MOCKS === 'true';

const LoginPage: React.FC = () => {
  const { login, authState } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (USE_MOCKS) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password });
      navigate('/');
    } catch (error) {
      // Erro gerenciado pelo contexto de autenticação
    }
  };

  if (USE_MOCKS) {
    return null;
  }

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            CashFlow
          </Typography>
          
          <Typography variant="h5" component="h2" gutterBottom align="center">
            Login
          </Typography>

          {authState.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {authState.error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Usuário do sistema"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={authState.isLoading}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={authState.isLoading}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={authState.isLoading}
            >
              {authState.isLoading ? <CircularProgress size={24} /> : 'Entrar'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage; 