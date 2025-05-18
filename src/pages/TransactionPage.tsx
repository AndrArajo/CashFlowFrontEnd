import React from 'react';
import { Container, Stack, Typography, Box } from '@mui/material';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';

const TransactionPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Gerenciamento de Fluxo de Caixa
        </Typography>
        
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={3}
          sx={{ alignItems: { md: 'flex-start' } }}
        >
          <Box sx={{ width: { xs: '100%', md: '40%' } }}>
            <TransactionForm />
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: '60%' } }}>
            <TransactionList />
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default TransactionPage; 