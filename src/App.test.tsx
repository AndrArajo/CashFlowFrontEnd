import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock dos componentes dependentes para evitar problemas com react-router
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: ({ path, element }: { path: string; element: React.ReactNode }) => (
    <div data-testid={`route-${path}`}>{element}</div>
  ),
}));

// Mock de componentes que seriam renderizados nas rotas
jest.mock('./components/Navbar', () => () => <div data-testid="navbar">Navbar</div>);
jest.mock('./pages/TransactionPage', () => () => <div data-testid="transaction-page">Transaction Page</div>);

// Importando App após os mocks
import App from './App';

test('renderiza componente App sem erros', () => {
  render(<App />);
  expect(screen.getByTestId('navbar')).toBeInTheDocument();
});
