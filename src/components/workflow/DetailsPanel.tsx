import React, { useState, useEffect, memo } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useWorkflowContext } from '../../context/WorkflowContext';
import { useThemeContext } from '../../context/ThemeContext';
import AgentDetailsForm from './details/AgentDetailsForm';
import MemoryDetailsForm from './details/MemoryDetailsForm';
import ToolDetailsForm from './details/ToolDetailsForm';
import OperatorDetailsForm from './details/OperatorDetailsForm';
import WorkflowDetailsForm from './details/WorkflowDetailsForm';

// Create a context for the details panel
const DetailsPanelContext = React.createContext<{ showWorkflowDetails: () => void } | null>(null);

// Export hook to access the details panel context
export const useDetailsPanel = () => {
  const context = React.useContext(DetailsPanelContext);
  if (!context) {
    throw new Error('useDetailsPanel must be used within a DetailsPanelProvider');
  }
  return context;
};

// Create a provider component
export const DetailsPanelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showWorkflowDetailsState, setShowWorkflowDetailsState] = useState(false);

  const showWorkflowDetails = React.useCallback(() => {
    setShowWorkflowDetailsState(true);
  }, []);

  return (
    <DetailsPanelContext.Provider value={{ showWorkflowDetails }}>
      {children}
    </DetailsPanelContext.Provider>
  );
};

// The actual DetailsPanel component
const DetailsPanel: React.FC = () => {
  const { selectedNode } = useWorkflowContext();
  const { mode } = useThemeContext();
  const [showWorkflowDetails, setShowWorkflowDetails] = useState(false);

  // Reset workflow details view when a node is selected
  useEffect(() => {
    if (selectedNode) {
      setShowWorkflowDetails(false);
    }
  }, [selectedNode]);

  // Function to show workflow details
  const handleShowWorkflowDetails = () => {
    setShowWorkflowDetails(true);
  };

  // Expose the function to show workflow details
  React.useEffect(() => {
    // This is a workaround since we don't have direct access to the context here
    // In a real app, you would use the context properly
    (window as any).showWorkflowDetails = handleShowWorkflowDetails;
  }, []);

  // Determine the title based on node type or if showing workflow details
  const getNodeTitle = () => {
    if (showWorkflowDetails) return 'Workflow Details';
    if (!selectedNode) return 'Details';
    
    switch (selectedNode.type) {
      case 'agent': return 'Agent Details';
      case 'memory': return 'Memory Details';
      case 'tool': return 'Tool Details';
      case 'operator': return 'Operator Details';
      default: return 'Node Details';
    }
  };

  // Render different content based on node type or if showing workflow details
  const renderDetailsContent = () => {
    if (showWorkflowDetails) {
      return <WorkflowDetailsForm />;
    }
    
    if (!selectedNode) return null;
    
    switch (selectedNode.type) {
      case 'agent':
        return <AgentDetailsForm node={selectedNode} />;
      case 'memory':
        return <MemoryDetailsForm node={selectedNode} />;
      case 'tool':
        return <ToolDetailsForm node={selectedNode} />;
      case 'operator':
        return <OperatorDetailsForm node={selectedNode} />;
      default:
        return null;
    }
  };

  if (!selectedNode && !showWorkflowDetails) {
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          {getNodeTitle()}
        </Typography>
        {(showWorkflowDetails || selectedNode) && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                if (showWorkflowDetails) {
                  (window as any).saveWorkflowChanges?.();
                } else if (selectedNode) {
                  (window as any).saveNodeChanges?.();
                }
              }}
              disabled={showWorkflowDetails ? (window as any).isWorkflowModified === false : (window as any).isNodeModified === false}
            >
              Save Changes
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                if (showWorkflowDetails) {
                  (window as any).cancelWorkflowChanges?.();
                } else if (selectedNode) {
                  (window as any).cancelNodeChanges?.();
                }
              }}
            >
              Cancel
            </Button>
          </Box>
        )}
      </Box>
      {renderDetailsContent()}
    </Paper>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default memo(DetailsPanel);
