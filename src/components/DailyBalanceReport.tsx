import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import { DailyBalance } from '../types';
import { getDailyBalanceByPeriod } from '../services/api';

const DailyBalanceReport: React.FC = () => {
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [balances, setBalances] = useState<DailyBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = async () => {
    if (!startDate || !endDate) {
      setError('Por favor, selecione as datas inicial e final.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('A data inicial não pode ser posterior à data final.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getDailyBalanceByPeriod(startDate, endDate);
      setBalances(data);
    } catch (err) {
      console.error('Erro ao carregar balanços:', err);
      setError('Erro ao carregar os balanços. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Paper elevation={3}>
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          Relatório de Balanço Diário
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label="Data Inicial"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          
          <TextField
            fullWidth
            label="Data Final"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          
          <Button
            variant="contained"
            color="primary"
            onClick={fetchBalances}
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Buscar'}
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {balances.length === 0 ? (
              <Typography>Nenhum balanço encontrado para o período selecionado.</Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Data</TableCell>
                      <TableCell>Saldo Anterior</TableCell>
                      <TableCell>Total Créditos</TableCell>
                      <TableCell>Total Débitos</TableCell>
                      <TableCell>Saldo Final</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {balances.map((balance) => (
                      <TableRow key={balance.id}>
                        <TableCell>{formatDate(balance.balanceDate)}</TableCell>
                        <TableCell>{formatCurrency(balance.previousBalance)}</TableCell>
                        <TableCell>{formatCurrency(balance.totalCredits)}</TableCell>
                        <TableCell>{formatCurrency(balance.totalDebits)}</TableCell>
                        <TableCell>{formatCurrency(balance.finalBalance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Box>
    </Paper>
  );
};

export default DailyBalanceReport; 