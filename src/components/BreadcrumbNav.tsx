import React from 'react';
import { Breadcrumbs, Link, Typography, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DashboardIcon from '@mui/icons-material/Dashboard';

interface BreadcrumbNavProps {
  currentPage: string;
  currentPageIcon: 'DesignServices' | 'AccountTree' | 'Dashboard';
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ currentPage, currentPageIcon }) => {
  // Map of icon types to their components
  const iconMap = {
    DesignServices: <DesignServicesIcon sx={{ mr: 0.5, fontSize: 18 }} />,
    AccountTree: <AccountTreeIcon sx={{ mr: 0.5, fontSize: 18 }} />,
    Dashboard: <DashboardIcon sx={{ mr: 0.5, fontSize: 18 }} />
  };

  return (
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
          {iconMap[currentPageIcon]}
          {currentPage}
        </Typography>
      </Breadcrumbs>
    </Paper>
  );
};

export default BreadcrumbNav;
