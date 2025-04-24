import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material/styles';
import { useThemeContext } from '../context/ThemeContext';

const Header: React.FC = () => {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeContext();
  
  return (
    <AppBar 
      position="static" 
      sx={{ 
        zIndex: 1300,
        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <RocketLaunchIcon sx={{ mr: 1, fontSize: 32 }} />
          <AccountTreeIcon sx={{ mr: 2, fontSize: 28 }} />
        </Box>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 700, 
            letterSpacing: 2,
            textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
          }}
        >
          Workflow Designer
        </Typography>
        <IconButton onClick={toggleTheme} color="inherit" aria-label="toggle theme">
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
