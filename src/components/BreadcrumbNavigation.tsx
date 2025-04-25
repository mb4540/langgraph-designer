import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

interface BreadcrumbNavigationProps {
  currentPage: string;
  icon?: React.ReactNode;
}

const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({ currentPage, icon }) => {
  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
      <Link
        component={RouterLink}
        to="/"
        color="inherit"
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        Home
      </Link>
      <Typography 
        color="text.primary" 
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          fontWeight: 500 
        }}
      >
        {icon && <span style={{ marginRight: '4px', display: 'flex', alignItems: 'center' }}>{icon}</span>}
        {currentPage}
      </Typography>
    </Breadcrumbs>
  );
};

export default BreadcrumbNavigation;
