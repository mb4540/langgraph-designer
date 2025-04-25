import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from './context/ThemeContext';
import './styles/global.css';

// Pages
import LandingPage from './pages/LandingPage';
import AccountsPage from './pages/AccountsPage';
import CommandCenterPage from './pages/CommandCenterPage';
import WorkflowDesignerPage from './pages/WorkflowDesignerPage';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/designer" element={<WorkflowDesignerPage />} />
          <Route path="/command-center" element={<CommandCenterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
