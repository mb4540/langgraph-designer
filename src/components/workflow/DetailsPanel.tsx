import React, { useState, useEffect, memo } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useWorkflowContext } from '../../context/WorkflowContext';
import { useThemeContext } from '../../context/ThemeContext';
import AgentDetailsForm from './details/AgentDetailsForm';
import ModelDetailsForm from './details/ModelDetailsForm';
import MemoryDetailsForm from './details/MemoryDetailsForm';
import ToolDetailsForm from './details/ToolDetailsForm';
import OutputParserDetailsForm from './details/OutputParserDetailsForm';

const DetailsPanel: React.FC = () => {
  const { selectedNode } = useWorkflowContext();
  const { mode } = useThemeContext();

  // Determine the title based on node type
  const getNodeTitle = () => {
    if (!selectedNode) return 'Details';
    
    switch (selectedNode.type) {
      case 'agent': return 'Agent Details';
      case 'model': return 'Model Details';
      case 'memory': return 'Memory Details';
      case 'tool': return 'Tool Details';
      case 'outputParser': return 'Output Parser Details';
      default: return 'Node Details';
    }
  };

  // Render different content based on node type
  const renderDetailsContent = () => {
    if (!selectedNode) return null;
    
    switch (selectedNode.type) {
      case 'agent':
        return <AgentDetailsForm node={selectedNode} />;
      case 'model':
        return <ModelDetailsForm node={selectedNode} />;
      case 'memory':
        return <MemoryDetailsForm node={selectedNode} />;
      case 'tool':
        return <ToolDetailsForm node={selectedNode} />;
      case 'outputParser':
        return <OutputParserDetailsForm node={selectedNode} />;
      default:
        return null;
    }
  };

  if (!selectedNode) {
    return (
      <Paper elevation={3} sx={{ height: '100%', padding: 2, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>
          Details
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
          <Typography variant="body1" color="text.secondary">
            Double-click on an agent or tool in the workflow to view and edit its details here.
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ height: '100%', padding: 2, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        {getNodeTitle()}
      </Typography>
      {renderDetailsContent()}
    </Paper>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default memo(DetailsPanel);
