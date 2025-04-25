import React from 'react';
import { Box, Container, Typography, Paper, Grid, Divider, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const AccountsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Paper 
        elevation={0}
        sx={{ 
          py: 1, 
          px: 3, 
          borderRadius: 0, 
          borderBottom: '1px solid', 
          borderColor: 'divider',
          backgroundColor: 'background.paper'
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Link 
            component={RouterLink} 
            to="/" 
            color="inherit" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              '&:hover': { color: '#009FDB' }
            }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Home
          </Link>
          <Typography 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              color: '#009FDB',
              fontWeight: 500
            }}
          >
            <AccountBalanceIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Manage Workflow Accounts
          </Typography>
        </Breadcrumbs>
      </Paper>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 4 }}>
          Manage Workflow Accounts
        </Typography>

        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 2, 
            border: '1px solid', 
            borderColor: 'divider',
            mb: 4
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Workflow Accounts Dashboard
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            This page will allow you to manage your workflow accounts, API keys, and access controls.
            Future implementation will include account creation, permissions management, and usage monitoring.
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1, border: '1px dashed', borderColor: 'divider' }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                  Account Management Interface Placeholder
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This area will contain the account management interface with tables, forms, and controls for managing workflow accounts.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default AccountsPage;
