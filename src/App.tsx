import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import TransactionPage from './pages/TransactionPage';
import DailyBalancePage from './pages/DailyBalancePage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

// Verificar se está em modo mock
const USE_MOCKS = process.env.REACT_APP_USE_MOCKS === 'true';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            {/* Em modo mock, redireciona o login para a página principal */}
            <Route path="/login" element={USE_MOCKS ? <Navigate to="/" replace /> : <LoginPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<TransactionPage />} />
              <Route path="/balanco-diario" element={<DailyBalancePage />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
