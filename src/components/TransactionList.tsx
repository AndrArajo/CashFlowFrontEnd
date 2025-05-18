import React, { useEffect, useState, useCallback } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography,
  CircularProgress,
  Box,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Transaction, TransactionType } from '../types';
import { getTransactions } from '../services/api';

const TransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar transações. Por favor, tente novamente.');
      // Só loga erros se não estiver em ambiente de teste
      if (process.env.NODE_ENV !== 'test') {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleRefresh = () => {
    fetchTransactions();
  };

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">
          Transações
        </Typography>
        <Tooltip title="Atualizar transações">
          <span>
            <IconButton 
              onClick={handleRefresh} 
              color="primary" 
              aria-label="refresh" 
              data-testid="refresh-button"
              disabled={loading}
            >
              <RefreshIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box p={4}>
          <Typography color="error">{error}</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleRefresh} 
            sx={{ mt: 2 }}
          >
            Tentar novamente
          </Button>
        </Box>
      ) : transactions.length === 0 ? (
        <Typography>Nenhuma transação encontrada.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Origem</TableCell>
                <TableCell>Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>{transaction.description || '-'}</TableCell>
                  <TableCell>
                    R$ {transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {transaction.type === TransactionType.Credit ? 'Crédito' : 'Débito'}
                  </TableCell>
                  <TableCell>{transaction.origin || '-'}</TableCell>
                  <TableCell>
                    {new Date(transaction.transactionDate).toLocaleDateString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default TransactionList; 