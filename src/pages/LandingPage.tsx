import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button,
  useTheme,
  Divider
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import TerminalIcon from '@mui/icons-material/Terminal';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  const cards = [
    {
      title: 'Manage Workflow Accounts',
      description: 'Create and manage accounts for your workflows. Configure access controls, API keys, and usage limits.',
      image: '/images/accounts-illustration.png',
      icon: <AccountBalanceIcon sx={{ fontSize: 60, color: '#009FDB' }} />,
      path: '/accounts'
    },
    {
      title: 'Workflow Designer',
      description: 'Design and visualize your workflows with our intuitive drag-and-drop interface. Connect agents, models, tools, and more.',
      image: '/images/designer-illustration.png',
      icon: <DesignServicesIcon sx={{ fontSize: 60, color: '#009FDB' }} />,
      path: '/designer'
    },
    {
      title: 'Command Center',
      description: 'Monitor and control your running workflows. View logs, performance metrics, and manage deployments in real-time.',
      image: '/images/command-illustration.png',
      icon: <TerminalIcon sx={{ fontSize: 60, color: '#009FDB' }} />,
      path: '/command-center'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.mode === 'dark' ? '#1A2027' : '#f5f5f5'} 100%)`,
        pt: 8,
        pb: 8
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 700, 
              mb: 2,
              background: 'linear-gradient(90deg, #009FDB 0%, #00c2ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0px 2px 5px rgba(0,159,219,0.2)'
            }}
          >
            Agent Platform
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              maxWidth: 800, 
              mx: 'auto', 
              color: theme.palette.text.secondary,
              mb: 4
            }}
          >
            Design, deploy, and manage intelligent agent workflows with ease
          </Typography>
        </Box>

        {/* Separator Line */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: 10,
            position: 'relative'
          }}
        >
          <Divider 
            sx={{
              width: '100%',
              maxWidth: 900,
              height: 8,
              backgroundColor: '#91DC00',
              borderRadius: 4,
              boxShadow: '0 4px 12px rgba(145, 220, 0, 0.3)',
              my: 6
            }}
          />
        </Box>

        {/* Navigation Cards */}
        <Grid container spacing={4}>
          {cards.map((card, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 30px rgba(0,159,219,0.15)'
                  },
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <Box 
                  sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,159,219,0.05)',
                    borderBottom: `1px solid ${theme.palette.divider}`
                  }}
                >
                  {card.icon}
                </Box>
                <CardContent sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  flexGrow: 1, 
                  p: 3,
                  height: '100%'
                }}>
                  <Box sx={{ mb: 'auto' }}>
                    <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      {card.description}
                    </Typography>
                  </Box>
                  <Button 
                    variant="contained" 
                    fullWidth
                    onClick={() => navigate(card.path)}
                    sx={{ 
                      backgroundColor: '#00388f',
                      '&:hover': {
                        backgroundColor: '#002a6b'
                      },
                      py: 1.5
                    }}
                  >
                    Open {card.title.split(' ').pop()}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;
