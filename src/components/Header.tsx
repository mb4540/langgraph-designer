import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useThemeContext } from '../context/ThemeContext';
import UserGuideContent from './help/UserGuideContent';

const Header: React.FC = () => {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeContext();
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  
  const handleOpenHelp = () => {
    setHelpDialogOpen(true);
  };
  
  const handleCloseHelp = () => {
    setHelpDialogOpen(false);
  };
  
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
        
        {/* Help Icon */}
        <IconButton 
          onClick={handleOpenHelp} 
          color="inherit" 
          aria-label="help"
          sx={{ mr: 1 }}
          title="Open User Guide"
        >
          <HelpOutlineIcon />
        </IconButton>
        
        {/* Theme Toggle */}
        <IconButton onClick={toggleTheme} color="inherit" aria-label="toggle theme">
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
      
      {/* Help Dialog */}
      <Dialog
        open={helpDialogOpen}
        onClose={handleCloseHelp}
        maxWidth="lg"
        fullWidth
        scroll="paper"
        aria-labelledby="user-guide-dialog-title"
      >
        <DialogTitle id="user-guide-dialog-title">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">User Guide</Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ p: 2, maxHeight: '70vh', overflowY: 'auto' }}>
            <UserGuideContent />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHelp}>Close</Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Header;
