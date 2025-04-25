import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useSelectionStore, useNodeStore } from '../store';

// Import the new component files
import AgentDetailsPanel from './details/AgentDetailsPanel';
import MemoryDetailsPanel from './details/MemoryDetailsPanel';
import ToolDetailsPanel from './details/ToolDetailsPanel';

const DetailsPanel: React.FC = () => {
  const { selectedNode } = useSelectionStore();
  const { updateNode } = useNodeStore();

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

  // Determine the title based on node type
  const getNodeTitle = () => {
    switch (selectedNode.type) {
      case 'agent': return 'Agent Details';
      case 'memory': return 'Memory Details';
      case 'tool': return 'Tool Details';
      default: return 'Node Details';
    }
  };

  // Handle saving updates to the node
  const handleSave = (updates: Partial<typeof selectedNode>) => {
    updateNode(selectedNode.id, updates);
  };

  // Render the appropriate details panel based on node type
  const renderDetailsContent = () => {
    switch (selectedNode.type) {
      case 'agent':
        return <AgentDetailsPanel node={selectedNode} onSave={handleSave} />;
      case 'memory':
        return <MemoryDetailsPanel node={selectedNode} onSave={handleSave} />;
      case 'tool':
        return <ToolDetailsPanel node={selectedNode} onSave={handleSave} />;
      default:
        return (
          <Typography variant="body1" color="text.secondary">
            No details available for this node type.
          </Typography>
        );
    }
  };

  return (
    <Paper elevation={3} sx={{ height: '100%', padding: 2, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        {getNodeTitle()}
      </Typography>
      
      {renderDetailsContent()}
    </Paper>
  );
};

export default DetailsPanel;
