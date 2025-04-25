import React from 'react';
import { Box, Container, Typography, Paper, Grid, Divider, Tabs, Tab, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import TerminalIcon from '@mui/icons-material/Terminal';
import BarChartIcon from '@mui/icons-material/BarChart';
import CloudIcon from '@mui/icons-material/Cloud';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const CommandCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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
            <TerminalIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Command Center
          </Typography>
        </Breadcrumbs>
      </Paper>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 4 }}>
          Command Center
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
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            sx={{ mb: 3 }}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab icon={<TerminalIcon />} label="Workflows" />
            <Tab icon={<BarChartIcon />} label="Metrics" />
            <Tab icon={<CloudIcon />} label="Deployments" />
          </Tabs>
          
          <Divider sx={{ mb: 3 }} />
          
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Active Workflows
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                Monitor and control your running workflows. View logs, execution status, and manage workflow instances.
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1, border: '1px dashed', borderColor: 'divider' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                      Workflow Monitoring Interface Placeholder
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This area will contain the workflow monitoring interface with tables, logs, and controls for managing running workflows.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
          
          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Performance Metrics
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                View detailed performance metrics for your workflows. Track latency, throughput, and resource usage.
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1, border: '1px dashed', borderColor: 'divider' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                      Metrics Dashboard Placeholder
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This area will contain charts, graphs, and tables showing performance metrics for your workflows.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
          
          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Deployment Management
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                Manage deployments of your workflows. Configure environments, versions, and deployment settings.
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1, border: '1px dashed', borderColor: 'divider' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                      Deployment Management Interface Placeholder
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This area will contain the deployment management interface with environment configuration, version control, and deployment options.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default CommandCenterPage;
