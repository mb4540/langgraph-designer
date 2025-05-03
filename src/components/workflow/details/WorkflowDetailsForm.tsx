import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { useWorkflowContext } from '../../../context/WorkflowContext';
import { useThemeContext } from '../../../context/ThemeContext';
import { useRuntimeContext } from '../../../context/RuntimeContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useVersionedId } from '../../../hooks/useVersionedId';
import { RuntimeType } from '../../../utils/workflowValidator';

interface WorkflowDetails {
  name: string;
  description: string;
  version: string;
  runtimeType: RuntimeType;
}

const WorkflowDetailsForm: React.FC = () => {
  const { nodes, edges } = useWorkflowContext();
  const { mode } = useThemeContext();
  const { runtimeType, setRuntimeType } = useRuntimeContext();
  const isDarkMode = mode === 'dark';
  
  const [formData, setFormData] = useState<WorkflowDetails>({
    name: 'My Workflow',
    description: '',
    version: '1.0.0',
    runtimeType: runtimeType,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isModified, setIsModified] = useState(false);

  // Generate versioned ID for the workflow
  const versionedWorkflow = useVersionedId('agent', formData.version); // Using 'agent' type as placeholder

  // Format the nodes and edges as a pretty JSON string
  const getGraphJson = () => {
    const graphData = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        name: node.name,
        position: node.position,
        // Include type-specific properties
        ...(node.type === 'agent' && { 
          icon: node.icon,
          llmModel: node.llmModel,
        }),
        ...(node.type === 'memory' && { 
          memoryType: node.memoryType,
        }),
        ...(node.type === 'tool' && { 
          toolType: node.toolType,
        }),
        parentId: node.parentId,
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
      })),
    };
    
    return JSON.stringify(graphData, null, 2);
  };

  // Update formData when runtimeType changes in context
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      runtimeType
    }));
  }, [runtimeType]);

  useEffect(() => {
    setIsEditing(true);
  }, []);

  useEffect(() => {
    if (isEditing) {
      setIsModified(false);
    }
  }, [isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // If changing runtime type, update the context
    if (name === 'runtimeType') {
      setRuntimeType(value as RuntimeType);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsModified(true);
  };

  const handleSave = () => {
    // Here we would update the workflow details in the store
    // For now, we'll just toggle editing mode
    setIsEditing(false);
    
    // In a real implementation, we would save the workflow details to the store
    // Example: updateWorkflowDetails(formData);
  };

  const handleCancel = () => {
    // Reset form and exit editing mode
    setIsEditing(false);
    // In a real implementation, we would reset to the stored values
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2 
      }}>
        <Typography variant="subtitle1" fontWeight="medium">
          Workflow Details
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSave}
            disabled={!isModified}
          >
            Save Changes
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Box>
      </Box>
      
      <TextField
        label="Workflow Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        variant="outlined"
        disabled={!isEditing}
      />
      
      {/* Version Fields */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Version"
            name="version"
            value={formData.version}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            disabled={!isEditing}
            helperText="Semantic version (MAJOR.MINOR.PATCH)"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Version ID"
            value={versionedWorkflow?.id || 'Not generated yet'}
            fullWidth
            margin="normal"
            variant="outlined"
            disabled={true}
            helperText={versionedWorkflow?.createdAt ? `Created: ${new Date(versionedWorkflow.createdAt).toLocaleString()}` : ''}
          />
        </Grid>
      </Grid>
      
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        fullWidth
        margin="normal"
        variant="outlined"
        multiline
        rows={4}
        disabled={!isEditing}
        placeholder="Enter a description for your workflow"
      />
      
      {/* Runtime Type Selection */}
      <Paper elevation={1} sx={{ p: 2, mt: 2, mb: 2 }}>
        <FormControl component="fieldset" disabled={!isEditing}>
          <FormLabel component="legend">Runtime Type</FormLabel>
          <RadioGroup
            row
            name="runtimeType"
            value={formData.runtimeType}
            onChange={handleChange}
          >
            <FormControlLabel 
              value="langgraph" 
              control={<Radio />} 
              label="LangGraph" 
            />
            <FormControlLabel 
              value="autogen" 
              control={<Radio />} 
              label="Autogen" 
            />
          </RadioGroup>
          <Typography variant="caption" color="text.secondary">
            {formData.runtimeType === 'langgraph' 
              ? 'LangGraph mode allows more flexible connections between operators.' 
              : 'Autogen mode enforces stricter rules, like TOOL_CALL must only be reached from AGENT_CALL.'}
          </Typography>
        </FormControl>
      </Paper>
      
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Graph JSON
      </Typography>
      
      <Paper 
        elevation={1} 
        sx={{ 
          maxHeight: '300px', 
          overflow: 'auto',
          borderRadius: 1,
          border: theme => `1px solid ${theme.palette.divider}`,
          '& pre': {
            margin: 0,
          },
          position: 'relative'
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(248, 250, 252, 0.8)', 
            px: 1, 
            py: 0.5, 
            borderBottomLeftRadius: 4,
            fontSize: '0.75rem',
            color: 'text.secondary',
            fontFamily: 'monospace',
            borderLeft: theme => `1px solid ${theme.palette.divider}`,
            borderBottom: theme => `1px solid ${theme.palette.divider}`,
          }}
        >
          JSON
        </Box>
        <SyntaxHighlighter
          language="json"
          style={isDarkMode ? vscDarkPlus : vs}
          customStyle={{
            margin: 0,
            padding: '16px',
            fontSize: '0.875rem',
            borderRadius: '4px',
          }}
          wrapLines={true}
          wrapLongLines={true}
        >
          {getGraphJson()}
        </SyntaxHighlighter>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleSave}
          disabled={!isModified}
        >
          Save Changes
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default WorkflowDetailsForm;
