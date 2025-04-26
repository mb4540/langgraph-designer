import React from 'react';
import { Box } from '@mui/material';
import Header from '../components/Header';
import BreadcrumbNav from '../components/BreadcrumbNav';
import WorkflowDesignerLayout from '../components/workflow/WorkflowDesignerLayout';

const WorkflowDesignerPage: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <BreadcrumbNav 
        currentPage="Workflow Designer" 
        pageIcon="DesignServices" 
      />
      <WorkflowDesignerLayout />
    </Box>
  );
};

export default WorkflowDesignerPage;
