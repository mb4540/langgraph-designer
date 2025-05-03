import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import CodeIcon from '@mui/icons-material/Code';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { WorkflowNode, OperatorType, TriggerType } from '../../../types/nodeTypes';
import { useWorkflowContext } from '../../../context/WorkflowContext';
import { useRuntimeContext } from '../../../context/RuntimeContext';
import ActionButtons from '../../ui/ActionButtons';

// Trigger type descriptions
const triggerTypeDescriptions: Record<TriggerType, { description: string, runtimeNotes: Record<string, string> }> = {
  'human': {
    description: 'Workflow is initiated by a human user and requires human input to start.',
    runtimeNotes: {
      'autogen': 'Requires UserProxyAgent as the first node in the workflow.',
      'langgraph': 'Initializes with user message in state.'
    }
  },
  'system': {
    description: 'Workflow is triggered programmatically by the system without human intervention.',
    runtimeNotes: {
      'autogen': 'Cannot be resume-capable in Autogen.',
      'langgraph': 'Invoked via function call with initial arguments.'
    }
  },
  'event': {
    description: 'Workflow is triggered by external events like webhooks, scheduled tasks, or other systems.',
    runtimeNotes: {
      'autogen': 'Autogen lacks a native scheduler; requires external wrapper.',
      'langgraph': 'Can be connected to event sources like HTTP endpoints.'
    }
  },
  'multi': {
    description: 'Multiple entry points are allowed in the workflow, enabling different starting paths.',
    runtimeNotes: {
      'autogen': 'Not supported in Autogen.',
      'langgraph': 'Edges from implicit START are emitted by graph builder automatically.'
    }
  }
};

// Sample code snippets for each trigger type
const codeSnippets: Record<TriggerType, Record<string, string>> = {
  'human': {
    'autogen': `const user = new UserProxyAgent({ ... });
groupChat.initiate_chat(userMessage);`,
    'langgraph': `initialState.messages = [ userMessage ];`
  },
  'system': {
    'autogen': `export function run_workflow(args) {
  compiledGraph.invoke(args);
}`,
    'langgraph': `export function run_workflow(args) {
  compiledGraph.invoke(args);
}`
  },
  'event': {
    'autogen': `// Requires custom implementation
export const handler = async (req) => {
  compiledGraph.invoke(JSON.parse(req.body));
};`,
    'langgraph': `export const handler = async (req) => {
  compiledGraph.invoke(JSON.parse(req.body));
};`
  },
  'multi': {
    'autogen': `// Not supported in Autogen`,
    'langgraph': `// Edges from implicit START are emitted by graph builder automatically`
  }
};

interface OperatorDetailsFormProps {
  node: WorkflowNode;
}

const OperatorDetailsForm: React.FC<OperatorDetailsFormProps> = ({ node }) => {
  const { updateNode } = useWorkflowContext();
  const { runtimeType, runtimeSettings, updateRuntimeSettings } = useRuntimeContext();
  
  // Form state
  const [name, setName] = useState(node.name || '');
  const [operatorType, setOperatorType] = useState<OperatorType>(node.operatorType || OperatorType.Sequential);
  const [description, setDescription] = useState(node.content || '');
  const [triggerType, setTriggerType] = useState<TriggerType>(node.triggerType || 'human');
  const [resumeCapable, setResumeCapable] = useState<boolean>(node.resumeCapable || false);
  const [showCodeSnippet, setShowCodeSnippet] = useState<boolean>(false);

  // Update form when node changes
  useEffect(() => {
    setName(node.name || '');
    setOperatorType(node.operatorType || OperatorType.Sequential);
    setDescription(node.content || '');
    setTriggerType(node.triggerType || 'human');
    setResumeCapable(node.resumeCapable || false);
  }, [node]);

  // Handle checkpoint store settings for resume capability
  const handleResumeCapableChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isResumeCapable = event.target.checked;
    setResumeCapable(isResumeCapable);
    
    // If enabling resume capability, ensure checkpoint store is configured
    if (isResumeCapable && (!runtimeSettings || !runtimeSettings.checkpointStore)) {
      updateRuntimeSettings({
        ...runtimeSettings,
        checkpointStore: 'memory' // Default to memory store
      });
    }
  };

  const handleSave = () => {
    // Update node with form values
    const updates: Partial<WorkflowNode> = {
      name,
      operatorType,
      content: description,
    };

    // Only add START-specific properties if the operator type is START
    if (operatorType === OperatorType.Start) {
      updates.triggerType = triggerType;
      updates.resumeCapable = resumeCapable;
    }

    updateNode(node.id, updates);
  };

  const handleCancel = () => {
    // Reset form to original values
    setName(node.name || '');
    setOperatorType(node.operatorType || OperatorType.Sequential);
    setDescription(node.content || '');
    setTriggerType(node.triggerType || 'human');
    setResumeCapable(node.resumeCapable || false);
    setShowCodeSnippet(false);
  };

  // Expose the functions to save and cancel changes
  useEffect(() => {
    // Track if there are unsaved changes
    const isModified = 
      name !== (node.name || '') ||
      operatorType !== (node.operatorType || OperatorType.Sequential) ||
      description !== (node.content || '') ||
      (operatorType === OperatorType.Start && triggerType !== (node.triggerType || 'human')) ||
      (operatorType === OperatorType.Start && resumeCapable !== (node.resumeCapable || false));

    // Expose functions for the DetailsPanel to call
    (window as any).saveNodeChanges = handleSave;
    (window as any).cancelNodeChanges = handleCancel;
    (window as any).isNodeModified = isModified;

    return () => {
      // Clean up
      delete (window as any).saveNodeChanges;
      delete (window as any).cancelNodeChanges;
      delete (window as any).isNodeModified;
    };
  }, [name, operatorType, description, triggerType, resumeCapable, node]);

  // Render START operator specific fields
  const renderStartOperatorFields = () => {
    if (operatorType !== OperatorType.Start) return null;

    return (
      <Box sx={{ mt: 3 }}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          Start Operator Configuration
          <Tooltip title="Configure how this workflow is triggered and executed">
            <InfoIcon fontSize="small" sx={{ ml: 1, color: 'text.secondary' }} />
          </Tooltip>
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <FormLabel component="legend">Trigger Type</FormLabel>
                <RadioGroup
                  value={triggerType}
                  onChange={(e) => {
                    const newTriggerType = e.target.value as TriggerType;
                    setTriggerType(newTriggerType);
                    
                    // Reset resume capability for system trigger in Autogen
                    if (runtimeType === 'autogen' && newTriggerType === 'system') {
                      setResumeCapable(false);
                    }
                    
                    // Reset code snippet visibility
                    setShowCodeSnippet(false);
                  }}
                >
                  {Object.entries(triggerTypeDescriptions).map(([type, { description }]) => {
                    const isDisabled = runtimeType === 'autogen' && (type === 'multi' || type === 'event');
                    
                    return (
                      <FormControlLabel 
                        key={type} 
                        value={type} 
                        control={<Radio />} 
                        label={
                          <Box>
                            <Typography variant="body1">
                              {type.charAt(0).toUpperCase() + type.slice(1)} Trigger
                              {isDisabled && " (Not supported in Autogen)"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {description}
                            </Typography>
                          </Box>
                        } 
                        disabled={isDisabled}
                      />
                    );
                  })}
                </RadioGroup>
              </FormControl>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2">Runtime Notes</Typography>
                <Button
                  startIcon={<CodeIcon />}
                  size="small"
                  onClick={() => setShowCodeSnippet(!showCodeSnippet)}
                >
                  {showCodeSnippet ? 'Hide Code' : 'Show Code'}
                </Button>
              </Box>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                {triggerTypeDescriptions[triggerType].runtimeNotes[runtimeType]}
              </Typography>
              
              {showCodeSnippet && (
                <Card variant="outlined" sx={{ mt: 2, bgcolor: 'background.default' }}>
                  <CardContent sx={{ p: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      Code snippet for {triggerType} trigger in {runtimeType}:
                    </Typography>
                    <Box 
                      component="pre"
                      sx={{
                        p: 1,
                        bgcolor: '#f5f5f5',
                        borderRadius: 1,
                        overflow: 'auto',
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                        m: 0
                      }}
                    >
                      <code>{codeSnippets[triggerType][runtimeType]}</code>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={resumeCapable}
                        onChange={handleResumeCapableChange}
                        disabled={runtimeType === 'autogen' && triggerType === 'system'}
                      />
                    }
                    label="Resume Capable"
                  />
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ ml: 3 }}>
                    Enable workflow to be resumed after interruption
                  </Typography>
                </Box>
                
                {resumeCapable && (
                  <FormControl sx={{ minWidth: 200 }} size="small">
                    <InputLabel id="checkpoint-store-label">Checkpoint Store</InputLabel>
                    <Select
                      labelId="checkpoint-store-label"
                      value={runtimeSettings?.checkpointStore || 'memory'}
                      label="Checkpoint Store"
                      onChange={(e) => updateRuntimeSettings({
                        ...runtimeSettings,
                        checkpointStore: e.target.value
                      })}
                    >
                      <MenuItem value="memory">In-Memory Store</MenuItem>
                      <MenuItem value="filesystem">File System</MenuItem>
                      <MenuItem value="redis">Redis</MenuItem>
                      <MenuItem value="dynamodb">DynamoDB</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle1" gutterBottom>
        Basic Information
      </Typography>
      
      <TextField
        fullWidth
        label="Operator Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
        variant="outlined"
      />
      
      <FormControl fullWidth margin="normal">
        <InputLabel id="operator-type-label">Operator Type</InputLabel>
        <Select
          labelId="operator-type-label"
          value={operatorType}
          label="Operator Type"
          onChange={(e) => setOperatorType(e.target.value as OperatorType)}
        >
          {Object.values(OperatorType).map((type) => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </Select>
      </FormControl>
      
      {/* Render START operator specific fields */}
      {renderStartOperatorFields()}
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
        Description
      </Typography>
      
      <TextField
        fullWidth
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        variant="outlined"
        placeholder="Enter a description for this operator"
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <ActionButtons
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </Box>
    </Box>
  );
};

export default OperatorDetailsForm;
