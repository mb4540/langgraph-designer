import React from 'react';
import { Box, Breadcrumbs, Link, Typography, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import HomeIcon from '@mui/icons-material/Home';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import Header from '../components/Header';
import ConversationPanel from '../components/ConversationPanel';
import WorkflowGraph from '../components/WorkflowGraph';
import DetailsPanel from '../components/DetailsPanel';

const WorkflowDesignerPage: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
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
            <DesignServicesIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Workflow Designer
          </Typography>
        </Breadcrumbs>
      </Paper>
      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        <PanelGroup direction="horizontal" className="main-layout">
          <Panel defaultSize={20} minSize={15}>
            <div className="panel-content">
              <ConversationPanel />
            </div>
          </Panel>
          
          <PanelResizeHandle className="resize-handle" />
          
          <Panel defaultSize={50} minSize={30}>
            <div className="panel-content">
              <WorkflowGraph />
            </div>
          </Panel>
          
          <PanelResizeHandle className="resize-handle" />
          
          <Panel defaultSize={30} minSize={15}>
            <div className="panel-content">
              <DetailsPanel />
            </div>
          </Panel>
        </PanelGroup>
      </Box>
    </Box>
  );
};

export default WorkflowDesignerPage;
