import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock dos componentes dependentes para evitar problemas com react-router
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: ({ path, element }: { path: string; element: React.ReactNode }) => (
    <div data-testid={`route-${path}`}>{element}</div>
  ),
  Navigate: ({ to }: { to: string }) => <div data-testid={`navigate-${to}`}>Navigate to {to}</div>,
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
  useNavigate: () => jest.fn(),
}));

// Mock do contexto de autenticação
jest.mock('./contexts/AuthContext', () => ({
  useAuth: () => ({
    authState: { isAuthenticated: true, isLoading: false, error: null },
    login: jest.fn(),
    logout: jest.fn()
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock de componentes que seriam renderizados nas rotas
jest.mock('./components/Navbar', () => () => <div data-testid="navbar">Navbar</div>);
jest.mock('./pages/TransactionPage', () => () => <div data-testid="transaction-page">Transaction Page</div>);
jest.mock('./pages/LoginPage', () => () => <div data-testid="login-page">Login Page</div>);
jest.mock('./pages/DailyBalancePage', () => () => <div data-testid="daily-balance-page">Daily Balance Page</div>);
jest.mock('./components/ProtectedRoute', () => () => <div data-testid="protected-route">Protected Route</div>);

// Importando App após os mocks
import App from './App';

test('renderiza componente App sem erros', () => {
  render(<App />);
  expect(screen.getByTestId('navbar')).toBeInTheDocument();
});
