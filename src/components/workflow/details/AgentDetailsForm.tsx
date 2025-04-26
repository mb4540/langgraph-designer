import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';

// Import icons for agent icon selection
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AssistantIcon from '@mui/icons-material/Assistant';
import BiotechIcon from '@mui/icons-material/Biotech';
import SchoolIcon from '@mui/icons-material/School';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DataObjectIcon from '@mui/icons-material/DataObject';
import TerminalIcon from '@mui/icons-material/Terminal';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DescriptionIcon from '@mui/icons-material/Description';
import SecurityIcon from '@mui/icons-material/Security';

import { WorkflowNode } from '../../../types/nodeTypes';
import { useWorkflowContext } from '../../../context/WorkflowContext';
import LoadingIndicator from '../../ui/LoadingIndicator';
import ErrorMessage from '../../ui/ErrorMessage';
import useAsyncOperation from '../../../hooks/useAsyncOperation';

interface AgentDetailsFormProps {
  node: WorkflowNode;
}

// Define workgroup options (placeholder)
const workgroups = [
  { id: 'wg1', name: 'General Workgroup' },
  { id: 'wg2', name: 'Customer Support' },
  { id: 'wg3', name: 'Data Analysis' },
  { id: 'wg4', name: 'Content Creation' },
];

// Define LLM model options
const llmModels = [
  { id: 'gpt-4o', label: 'OpenAI GPT-4o' },
  { id: 'claude-3-7-sonnet', label: 'Anthropic Claude 3.7 Sonnet' },
  { id: 'gemini-2-5-pro', label: 'Google DeepMind Gemini 2.5 Pro' },
  { id: 'llama-3-70b', label: 'Meta Llama 3-70B' },
  { id: 'mistral-large', label: 'Mistral Large' },
  { id: 'grok-3', label: 'xAI Grok 3' },
  { id: 'deepseek-coder-v2', label: 'DeepSeek-Coder V2' },
  { id: 'cohere-command-r', label: 'Cohere Command-R' },
  { id: 'phi-3', label: 'Microsoft Phi-3' },
  { id: 'jurassic-2-ultra', label: 'AI21 Labs Jurassic-2 Ultra' },
  { id: 'pangu-2', label: 'Huawei PanGu 2.0' },
  { id: 'ernie-4', label: 'Baidu ERNIE 4.0' },
];

// Define agent icon options
const agentIcons = [
  { id: 'smart-toy', name: 'Robot Assistant', icon: SmartToyIcon },
  { id: 'psychology', name: 'AI Brain', icon: PsychologyIcon },
  { id: 'support-agent', name: 'Support Agent', icon: SupportAgentIcon },
  { id: 'assistant', name: 'Virtual Assistant', icon: AssistantIcon },
  { id: 'biotech', name: 'Research Agent', icon: BiotechIcon },
  { id: 'school', name: 'Knowledge Agent', icon: SchoolIcon },
  { id: 'auto-fix', name: 'Creative Agent', icon: AutoFixHighIcon },
  { id: 'data-object', name: 'Data Agent', icon: DataObjectIcon },
  { id: 'terminal', name: 'Code Agent', icon: TerminalIcon },
  { id: 'account-tree', name: 'Workflow Agent', icon: AccountTreeIcon },
  { id: 'description', name: 'RAG Agent', icon: DescriptionIcon },
  { id: 'security', name: 'Security/Governance Agent', icon: SecurityIcon },
];

const AgentDetailsForm: React.FC<AgentDetailsFormProps> = ({ node }) => {
  const { updateNode } = useWorkflowContext();
  
  // Form state
  const [name, setName] = useState(node.name || '');
  const [workgroup, setWorkgroup] = useState(node.workgroup || 'wg1');
  const [selectedIcon, setSelectedIcon] = useState(node.icon || 'smart-toy');
  const [agentType, setAgentType] = useState(node.agentType || 'assistant');
  const [description, setDescription] = useState(node.description || '');
  const [prompt, setPrompt] = useState(node.content || '');
  const [enableMarkdown, setEnableMarkdown] = useState(node.enableMarkdown || false);
  const [credentialsSource, setCredentialsSource] = useState(node.credentialsSource || 'workgroup');
  const [llmModel, setLlmModel] = useState(node.llmModel || 'gpt-4o');
  const [maxConsecutiveReplies, setMaxConsecutiveReplies] = useState(node.maxConsecutiveReplies || 5);
  
  // Update form when node changes
  useEffect(() => {
    setName(node.name || '');
    setWorkgroup(node.workgroup || 'wg1');
    setSelectedIcon(node.icon || 'smart-toy');
    setAgentType(node.agentType || 'assistant');
    setDescription(node.description || '');
    setPrompt(node.content || '');
    setEnableMarkdown(node.enableMarkdown || false);
    setCredentialsSource(node.credentialsSource || 'workgroup');
    setLlmModel(node.llmModel || 'gpt-4o');
    setMaxConsecutiveReplies(node.maxConsecutiveReplies || 5);
  }, [node]);

  // Handle validation
  const { 
    loading: validationLoading, 
    error: validationError, 
    execute: validateForm,
    reset: resetValidationError
  } = useAsyncOperation<boolean>(async () => {
    // Validate required fields
    if (!name.trim()) {
      throw new Error('Agent name is required');
    }
    
    if (!prompt.trim()) {
      throw new Error('Agent prompt is required');
    }
    
    // Validate max consecutive replies is a positive number
    if (maxConsecutiveReplies < 0 || maxConsecutiveReplies > 20) {
      throw new Error('Max consecutive replies must be between 0 and 20');
    }
    
    return true;
  });

  // Handle saving agent details
  const { 
    loading: saveLoading, 
    error: saveError, 
    execute: executeSave,
    reset: resetSaveError
  } = useAsyncOperation<void>(async () => {
    // Validate form before saving
    await validateForm();
    
    // Update node with form values
    updateNode(node.id, {
      name,
      workgroup,
      icon: selectedIcon,
      agentType,
      description,
      content: prompt,
      enableMarkdown,
      credentialsSource,
      llmModel,
      maxConsecutiveReplies,
    });
  });

  const handleSave = () => {
    executeSave();
  };

  return (
    <Box sx={{ p: 1 }}>
      {/* Basic Information Section */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="workgroup-label">Work-group</InputLabel>
          <Select
            labelId="workgroup-label"
            value={workgroup}
            label="Work-group"
            onChange={(e) => setWorkgroup(e.target.value)}
          >
            {workgroups.map((group) => (
              <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          variant="outlined"
          error={validationError?.message.includes('name')}
          helperText={validationError?.message.includes('name') ? validationError.message : ''}
        />

        {/* Agent Icon Selection */}
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
          Icon
        </Typography>
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {agentIcons.map((iconOption) => {
            const IconComponent = iconOption.icon;
            return (
              <Grid item key={iconOption.id}>
                <Card 
                  sx={{
                    width: 70,
                    height: 70,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: selectedIcon === iconOption.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    }
                  }}
                  onClick={() => setSelectedIcon(iconOption.id)}
                >
                  <IconComponent 
                    sx={{ 
                      fontSize: 32,
                      color: selectedIcon === iconOption.id ? '#1976d2' : 'text.secondary'
                    }} 
                  />
                  <Typography variant="caption" align="center" sx={{ mt: 0.5, fontSize: '0.6rem' }}>
                    {iconOption.name}
                  </Typography>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="agent-type-label">Type</InputLabel>
          <Select
            labelId="agent-type-label"
            value={agentType}
            label="Type"
            onChange={(e) => setAgentType(e.target.value)}
          >
            <MenuItem value="assistant">Assistant Agent</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          variant="outlined"
          multiline
          rows={2}
        />
      </Box>

      {/* Prompt Section */}
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
        Prompt (used by LLM)
      </Typography>
      
      <Box sx={{ flexGrow: 1, mb: 2, border: 1, borderColor: validationError?.message.includes('prompt') ? 'error.main' : 'divider', borderRadius: 1, overflow: 'hidden' }}>
        <TextField
          multiline
          fullWidth
          minRows={8}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          variant="outlined"
          sx={{ height: '100%' }}
          inputProps={{ style: { verticalAlign: 'top' } }}
          InputProps={{
            sx: {
              height: '100%',
              '& .MuiInputBase-inputMultiline': {
                height: '100%',
                alignItems: 'flex-start',
                verticalAlign: 'top',
                paddingTop: '14px',
                textAlign: 'left',
              }
            }
          }}
          error={validationError?.message.includes('prompt')}
        />
      </Box>
      
      {validationError?.message.includes('prompt') && (
        <Typography color="error" variant="caption" sx={{ mb: 2, display: 'block' }}>
          {validationError.message}
        </Typography>
      )}

      <FormControlLabel
        control={
          <Checkbox
            checked={enableMarkdown}
            onChange={(e) => setEnableMarkdown(e.target.checked)}
          />
        }
        label="Enable Markdown Response Format"
        sx={{ mb: 2 }}
      />

      {/* Model Info Section */}
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" sx={{ mb: 2 }}>
        Model Info
      </Typography>

      <RadioGroup
        value={credentialsSource}
        onChange={(e) => setCredentialsSource(e.target.value)}
        sx={{ mb: 2 }}
      >
        <FormControlLabel 
          value="workgroup" 
          control={<Radio />} 
          label="Use LLM credentials from this workgroup" 
        />
        <FormControlLabel 
          value="always-workgroup" 
          control={<Radio />} 
          label="Always use the LLM credentials from this workgroup" 
        />
      </RadioGroup>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="llm-model-label">Choose an LLM</InputLabel>
        <Select
          labelId="llm-model-label"
          value={llmModel}
          label="Choose an LLM"
          onChange={(e) => setLlmModel(e.target.value)}
        >
          {llmModels.map((model) => (
            <MenuItem key={model.id} value={model.id}>{model.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Max Consecutive Auto Replies"
        type="number"
        value={maxConsecutiveReplies}
        onChange={(e) => setMaxConsecutiveReplies(Number(e.target.value))}
        margin="normal"
        variant="outlined"
        InputProps={{ inputProps: { min: 0, max: 20 } }}
        sx={{ mb: 3 }}
        error={validationError?.message.includes('consecutive replies')}
        helperText={validationError?.message.includes('consecutive replies') ? validationError.message : ''}
      />

      {/* Settings Section - Placeholder for future settings */}
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" sx={{ mb: 2 }}>
        Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Additional agent settings will be available here in future updates.
      </Typography>
      
      {/* Error Message */}
      {saveError && (
        <Box sx={{ mb: 2 }}>
          <ErrorMessage 
            message="Failed to save agent details" 
            details={saveError.message}
            onRetry={() => {
              resetSaveError();
              executeSave();
            }}
          />
        </Box>
      )}
      
      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        {saveLoading || validationLoading ? (
          <LoadingIndicator 
            type="spinner" 
            size="small" 
            message="Saving..."
          />
        ) : (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSave}
            disabled={Boolean(validationError)}
          >
            Save Changes
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default AgentDetailsForm;
