import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TransactionList from '../../components/TransactionList';
import { Transaction, TransactionType } from '../../types';

// Mock do módulo api
jest.mock('../../services/api', () => ({
  getPaginatedTransactions: jest.fn()
}));

// Importar api após o mock
import * as api from '../../services/api';

describe('TransactionList Component', () => {
  const mockTransactions: Transaction[] = [
    {
      id: 1,
      description: 'Salário',
      amount: 5000,
      type: TransactionType.Credit,
      origin: 'Empresa',
      transactionDate: '2025-05-10T00:00:00',
      createdAt: '2025-05-10T10:30:00',
    },
    {
      id: 2,
      description: 'Aluguel',
      amount: 1200,
      type: TransactionType.Debit,
      origin: 'Imobiliária',
      transactionDate: '2025-05-05T00:00:00',
      createdAt: '2025-05-05T14:45:00',
    }
  ];

  const mockPaginatedResponse = {
    data: mockTransactions,
    page: 1,
    pageSize: 10,
    totalItems: 2,
    totalPages: 1
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve renderizar a lista de transações corretamente', async () => {
    // Mock da função getPaginatedTransactions
    (api.getPaginatedTransactions as jest.Mock).mockResolvedValue(mockPaginatedResponse);

    render(<TransactionList />);

    // Verificar se o loading está sendo exibido inicialmente
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Esperar pelas transações carregadas
    await waitFor(() => {
      expect(screen.getByText('Salário')).toBeInTheDocument();
    });

    // Verificar se os dados das transações são exibidos
    expect(screen.getByText('Salário')).toBeInTheDocument();
    expect(screen.getByText('Aluguel')).toBeInTheDocument();
    expect(screen.getByText('R$ 5000.00')).toBeInTheDocument();
    expect(screen.getByText('R$ 1200.00')).toBeInTheDocument();
    expect(screen.getByText('Crédito')).toBeInTheDocument();
    expect(screen.getByText('Débito')).toBeInTheDocument();
  });

  test('deve exibir mensagem quando não há transações', async () => {
    // Mock da função getPaginatedTransactions retornando array vazio
    (api.getPaginatedTransactions as jest.Mock).mockResolvedValue({
      data: [],
      page: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0
    });

    render(<TransactionList />);

    // Esperar pela mensagem de nenhuma transação
    await waitFor(() => {
      expect(screen.getByText('Nenhuma transação encontrada.')).toBeInTheDocument();
    });
  });

  test('deve exibir mensagem de erro quando a API falha', async () => {
    // Mock da função getPaginatedTransactions retornando erro
    (api.getPaginatedTransactions as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(<TransactionList />);

    // Esperar pela mensagem de erro
    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar transações. Por favor, tente novamente.')).toBeInTheDocument();
    });

    // Verificar se o botão de tentar novamente está presente
    expect(screen.getByText('Tentar novamente')).toBeInTheDocument();
  });

  test('deve atualizar os dados quando o botão de refresh é clicado', async () => {
    const novoItem = {
      id: 3,
      description: 'Novo item',
      amount: 300,
      type: TransactionType.Credit,
      origin: 'Teste',
      transactionDate: '2025-05-20T00:00:00',
      createdAt: '2025-05-20T10:00:00',
    };

    // Configurar o mock para retornar diferentes conjuntos de dados
    (api.getPaginatedTransactions as jest.Mock)
      .mockResolvedValueOnce(mockPaginatedResponse)
      .mockResolvedValueOnce({
        data: [...mockTransactions, novoItem],
        page: 1,
        pageSize: 10,
        totalItems: 3,
        totalPages: 1
      });

    render(<TransactionList />);

    // Esperar pelo carregamento inicial dos dados
    await waitFor(() => {
      expect(screen.getByText('Salário')).toBeInTheDocument();
    });

    // Verificar que foram chamados uma vez
    expect(api.getPaginatedTransactions).toHaveBeenCalledTimes(1);

    // Clicar no botão de refresh
    fireEvent.click(screen.getByTestId('refresh-button'));

    // Esperar pelo novo item
    await waitFor(() => {
      expect(screen.getByText('Novo item')).toBeInTheDocument();
    });

    // Verificar que foram chamados uma segunda vez
    expect(api.getPaginatedTransactions).toHaveBeenCalledTimes(2);
  });
}); 