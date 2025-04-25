import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
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
        background: '#009FDB',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Toolbar>
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
          Agent Platform
        </Typography>
        <IconButton onClick={toggleTheme} color="inherit" aria-label="toggle theme">
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
