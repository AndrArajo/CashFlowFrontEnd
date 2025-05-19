import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  SelectChangeEvent,
  Stack,
  Alert,
  Snackbar
} from '@mui/material';
import { TransactionInput, TransactionType } from '../types';
import { createTransaction } from '../services/api';

const TransactionForm: React.FC = () => {
  const initialFormData: TransactionInput = {
    description: '',
    amount: 0,
    type: TransactionType.Credit,
    origin: '',
    transactionDate: new Date().toISOString().slice(0, 10)
  };

  const [formData, setFormData] = useState<TransactionInput>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    setFormData({
      ...formData,
      type: parseInt(e.target.value) as TransactionType
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.amount <= 0) {
      setError('O valor da transação deve ser maior que zero');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await createTransaction(formData);
      setSuccess(true);
      setFormData(initialFormData);
    } catch (err) {
      console.error('Erro ao criar transação:', err);
      setError('Erro ao criar transação. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  return (
    <Paper elevation={3}>
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          Nova Transação
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Descrição"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
            
            <TextField
              fullWidth
              required
              label="Valor"
              name="amount"
              type="number"
              inputProps={{ step: '0.01', min: '0.01' }}
              value={formData.amount === 0 ? '' : formData.amount}
              onChange={handleInputChange}
            />
            
            <FormControl fullWidth required>
              <InputLabel>Tipo de Transação</InputLabel>
              <Select
                value={formData.type.toString()}
                label="Tipo de Transação"
                onChange={handleSelectChange}
              >
                <MenuItem value={TransactionType.Credit.toString()}>Crédito</MenuItem>
                <MenuItem value={TransactionType.Debit.toString()}>Débito</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Origem"
              name="origin"
              value={formData.origin}
              onChange={handleInputChange}
            />
            
            <TextField
              fullWidth
              label="Data da Transação"
              name="transactionDate"
              type="date"
              value={formData.transactionDate}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
            />
            
            {error && (
              <Alert severity="error">{error}</Alert>
            )}
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading || formData.amount <= 0}
            >
              {loading ? 'Enviando...' : 'Adicionar Transação'}
            </Button>
          </Stack>
        </form>
        
        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            Transação criada com sucesso!
          </Alert>
        </Snackbar>
      </Box>
    </Paper>
  );
};

export default TransactionForm; 