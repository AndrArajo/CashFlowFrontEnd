import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import TransactionPage from './pages/TransactionPage';
import DailyBalancePage from './pages/DailyBalancePage';

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
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<TransactionPage />} />
          <Route path="/balanco-diario" element={<DailyBalancePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
