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
  Tooltip,
  Pagination,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Transaction, TransactionType, PaginatedResponse } from '../types';
import { getPaginatedTransactions } from '../services/api';

const TransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para paginação
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = useCallback(async () => {
      try {
        setLoading(true);
        const response = await getPaginatedTransactions(page, pageSize);
        
        console.log('Response:', response);
        console.log('Response.data:', response.data);
        console.log('Type of response.data:', typeof response.data, Array.isArray(response.data));
        
        setTransactions(response.data);
        setTotalItems(response.totalItems);
        setTotalPages(response.totalPages);
        
        setError(null);
      } catch (err) {
        console.error('Error in fetchTransactions:', err);
        setError('Erro ao carregar transações. Por favor, tente novamente.');
        // Só loga erros se não estiver em ambiente de teste
        if (process.env.NODE_ENV !== 'test') {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
  }, [page, pageSize]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleRefresh = () => {
    fetchTransactions();
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handlePageSizeChange = (event: SelectChangeEvent) => {
    setPageSize(Number(event.target.value));
    setPage(1); // Volta para a primeira página quando mudar o tamanho da página
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
        <>
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
                {Array.isArray(transactions) ? transactions.map((transaction) => (
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
                )) : (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography align="center">Erro ao exibir transações</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="space-between" 
            alignItems="center" 
            mt={3}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <FormControl size="small">
                <InputLabel id="page-size-select-label">Itens por página</InputLabel>
                <Select
                  labelId="page-size-select-label"
                  id="page-size-select"
                  value={pageSize.toString()}
                  label="Itens por página"
                  onChange={handlePageSizeChange}
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>
              
              <Typography variant="body2" color="text.secondary">
                Total: {totalItems} transações
              </Typography>
            </Box>
            
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
              disabled={loading}
            />
          </Stack>
        </>
      )}
    </Box>
  );
};

export default TransactionList; 