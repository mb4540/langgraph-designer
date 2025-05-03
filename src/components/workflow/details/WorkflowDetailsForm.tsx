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
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
// Git related icons
import GitHubIcon from '@mui/icons-material/GitHub';
import AddIcon from '@mui/icons-material/Add';
import PullIcon from '@mui/icons-material/Download';
import PushIcon from '@mui/icons-material/Upload';
import CommitIcon from '@mui/icons-material/Save';
import TerminalIcon from '@mui/icons-material/Terminal';
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
  workgroup: string;
  githubRepo: string;
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
    workgroup: '',
    githubRepo: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [terminalDialogOpen, setTerminalDialogOpen] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState('');
  const [terminalCommand, setTerminalCommand] = useState('');
  const [isExecutingCommand, setIsExecutingCommand] = useState(false);

  // Define workgroup options (placeholder)
  const workgroups = [
    { id: 'wg1', name: 'General Workgroup' },
    { id: 'wg2', name: 'Customer Support' },
    { id: 'wg3', name: 'Data Analysis' },
    { id: 'wg4', name: 'Content Creation' },
  ];

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
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

  const handleAutoGenerateDescription = async () => {
    setIsGeneratingDescription(true);
    try {
      // In a real implementation, this would call an API to generate the description
      // For now, we'll simulate a delay and generate a simple description
      const graphData = JSON.parse(getGraphJson());
      
      // Simple description generation based on the graph structure
      const nodeTypes = graphData.nodes.reduce((acc: Record<string, number>, node: any) => {
        acc[node.type] = (acc[node.type] || 0) + 1;
        return acc;
      }, {});
      
      const nodeTypeSummary = Object.entries(nodeTypes)
        .map(([type, count]) => `${count} ${type}${Number(count) > 1 ? 's' : ''}`)
        .join(', ');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate description
      const description = `This workflow consists of ${graphData.nodes.length} nodes (${nodeTypeSummary}) and ${graphData.edges.length} connections. `;
      
      // Add information about start/end nodes if they exist
      const startNodes = graphData.nodes.filter((node: any) => node.type === 'operator' && node.operatorType === 'START');
      const endNodes = graphData.nodes.filter((node: any) => node.type === 'operator' && node.operatorType === 'STOP');
      
      let additionalInfo = '';
      if (startNodes.length > 0) {
        additionalInfo += `It has ${startNodes.length} start node${startNodes.length > 1 ? 's' : ''}. `;
      }
      if (endNodes.length > 0) {
        additionalInfo += `It has ${endNodes.length} end node${endNodes.length > 1 ? 's' : ''}. `;
      }
      
      // Update form data with generated description
      setFormData(prev => ({
        ...prev,
        description: description + additionalInfo + '\n\nThis workflow is designed to process data through a series of connected components, each performing specific operations to achieve the overall workflow objective.'
      }));
      setIsModified(true);
    } catch (error) {
      console.error('Error generating description:', error);
      // Handle error
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  // Git functionality handlers
  const handleOpenTerminal = () => {
    setTerminalOutput('');
    setTerminalCommand('');
    setTerminalDialogOpen(true);
  };

  const handleCloseTerminal = () => {
    setTerminalDialogOpen(false);
  };

  const handleTerminalCommandChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTerminalCommand(e.target.value);
  };

  const executeGitCommand = async (command: string) => {
    setIsExecutingCommand(true);
    setTerminalOutput(prev => prev + `\n$ ${command}\n`);
    
    try {
      // In a real implementation, this would execute the command on the server
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let output = '';
      if (command.includes('git clone')) {
        output = `Cloning into '${formData.githubRepo.split('/').pop()?.replace('.git', '')}'...\nremote: Enumerating objects: 1463, done.\nremote: Counting objects: 100% (1463/1463), done.\nremote: Compressing objects: 100% (843/843), done.\nremote: Total 1463 (delta 620), reused 1463 (delta 620), pack-reused 0\nReceiving objects: 100% (1463/1463), 2.5 MiB | 8.42 MiB/s, done.\nResolving deltas: 100% (620/620), done.`;
      } else if (command.includes('git pull')) {
        output = 'Already up to date.';
      } else if (command.includes('git push')) {
        output = 'Everything up-to-date';
      } else if (command.includes('git commit')) {
        output = '[main 3e4f982] Updated workflow\n 1 file changed, 10 insertions(+), 2 deletions(-)';
      } else if (command.includes('git add')) {
        output = ''; // git add typically doesn't produce output unless there's an error
      } else if (command.includes('git status')) {
        output = 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nChanges not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n  (use "git restore <file>..." to discard changes in working directory)\n\t modified:   src/workflow.py\n\nno changes added to commit (use "git add" and/or "git commit -a")';
      } else {
        output = `Command not recognized: ${command}`;
      }
      
      setTerminalOutput(prev => prev + output + '\n');
    } catch (error) {
      console.error('Error executing command:', error);
      setTerminalOutput(prev => prev + `Error: ${error}\n`);
    } finally {
      setIsExecutingCommand(false);
    }
  };

  const handleExecuteCommand = () => {
    if (terminalCommand.trim()) {
      executeGitCommand(terminalCommand.trim());
      setTerminalCommand('');
    }
  };

  const handleGitClone = () => {
    if (formData.githubRepo) {
      const command = `git clone ${formData.githubRepo}`;
      executeGitCommand(command);
      if (!terminalDialogOpen) setTerminalDialogOpen(true);
    }
  };

  const handleGitPull = () => {
    const command = 'git pull';
    executeGitCommand(command);
    if (!terminalDialogOpen) setTerminalDialogOpen(true);
  };

  const handleGitAdd = () => {
    const command = 'git add .';
    executeGitCommand(command);
    if (!terminalDialogOpen) setTerminalDialogOpen(true);
  };

  const handleGitCommit = () => {
    const command = 'git commit -m "Updated workflow"';
    executeGitCommand(command);
    if (!terminalDialogOpen) setTerminalDialogOpen(true);
  };

  const handleGitPush = () => {
    const command = 'git push';
    executeGitCommand(command);
    if (!terminalDialogOpen) setTerminalDialogOpen(true);
  };

  // Expose the functions to save and cancel changes
  useEffect(() => {
    // Expose functions for the DetailsPanel to call
    (window as any).saveWorkflowChanges = handleSave;
    (window as any).cancelWorkflowChanges = handleCancel;
    (window as any).isWorkflowModified = isModified;

    // Update isWorkflowModified when isModified changes
    const updateModifiedState = () => {
      (window as any).isWorkflowModified = isModified;
    };
    updateModifiedState();

    return () => {
      // Clean up
      delete (window as any).saveWorkflowChanges;
      delete (window as any).cancelWorkflowChanges;
      delete (window as any).isWorkflowModified;
    };
  }, [isModified]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Work-group Field */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="workgroup-label">Work-group</InputLabel>
        <Select
          labelId="workgroup-label"
          id="workgroup-select"
          name="workgroup"
          value={formData.workgroup || 'wg1'}
          label="Work-group"
          onChange={handleChange}
          disabled={!isEditing}
        >
          {workgroups.map((group) => (
            <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      
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

      {/* GitHub Repository Field */}
      <Paper elevation={1} sx={{ p: 2, mt: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          GitHub Repository
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <GitHubIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <TextField
            label="Repository URL"
            name="githubRepo"
            value={formData.githubRepo}
            onChange={handleChange}
            placeholder="https://github.com/username/repo.git"
            fullWidth
            margin="normal"
            disabled={!isEditing}
            helperText="Enter the URL of the GitHub repository where the workflow code will be stored"
          />
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Tooltip title="Clone the repository">
            <span>
              <Button
                variant="outlined"
                size="small"
                startIcon={<GitHubIcon />}
                onClick={handleGitClone}
                disabled={!formData.githubRepo}
              >
                Clone
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Pull latest changes">
            <Button
              variant="outlined"
              size="small"
              startIcon={<PullIcon />}
              onClick={handleGitPull}
            >
              Pull
            </Button>
          </Tooltip>
          <Tooltip title="Add all changes">
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleGitAdd}
            >
              Add
            </Button>
          </Tooltip>
          <Tooltip title="Commit changes">
            <Button
              variant="outlined"
              size="small"
              startIcon={<CommitIcon />}
              onClick={handleGitCommit}
            >
              Commit
            </Button>
          </Tooltip>
          <Tooltip title="Push changes">
            <Button
              variant="outlined"
              size="small"
              startIcon={<PushIcon />}
              onClick={handleGitPush}
            >
              Push
            </Button>
          </Tooltip>
          <Tooltip title="Open terminal">
            <Button
              variant="outlined"
              size="small"
              startIcon={<TerminalIcon />}
              onClick={handleOpenTerminal}
              color="secondary"
            >
              Terminal
            </Button>
          </Tooltip>
        </Box>
      </Paper>

      {/* Description Field with AutoGenerate Button */}
      <Box sx={{ position: 'relative' }}>
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
          disabled={!isEditing || isGeneratingDescription}
          placeholder="Enter a description for your workflow"
        />
        {isEditing && (
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={handleAutoGenerateDescription}
            disabled={isGeneratingDescription}
            startIcon={isGeneratingDescription ? <CircularProgress size={16} color="inherit" /> : <AutoFixHighIcon />}
            sx={{
              position: 'absolute',
              top: '16px',
              right: '0',
              zIndex: 1,
              textTransform: 'none',
              fontSize: '0.75rem',
              py: 0.5,
              px: 1,
              minWidth: 'auto',
              backgroundColor: '#00388f',
              '&:hover': {
                backgroundColor: '#002a6b',
              },
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              borderTopRightRadius: 4,
              borderBottomRightRadius: 0,
            }}
          >
            AutoGenerate
          </Button>
        )}
      </Box>
      
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
      
      <Dialog
        open={terminalDialogOpen}
        onClose={handleCloseTerminal}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Terminal</DialogTitle>
        <DialogContent>
          <TextField
            label="Command"
            value={terminalCommand}
            onChange={handleTerminalCommandChange}
            fullWidth
            margin="normal"
            variant="outlined"
            disabled={isExecutingCommand}
          />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Output:
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {terminalOutput}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTerminal}>Close</Button>
          <Button onClick={handleExecuteCommand} disabled={isExecutingCommand}>Execute</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkflowDetailsForm;
