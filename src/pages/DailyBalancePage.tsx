import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import DailyBalanceReport from '../components/DailyBalanceReport';

const DailyBalancePage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Relatório de Balanço Diário
        </Typography>
        
        <Box mt={4}>
          <DailyBalanceReport />
        </Box>
      </Box>
    </Container>
  );
};

export default DailyBalancePage; 