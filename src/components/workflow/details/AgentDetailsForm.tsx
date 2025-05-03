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
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTheme } from '@mui/material/styles';

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

import { WorkflowNode, AgentSetting } from '../../../types/nodeTypes';
import { useWorkflowContext } from '../../../context/WorkflowContext';
import { useThemeContext } from '../../../context/ThemeContext';
import LoadingIndicator from '../../ui/LoadingIndicator';
import ErrorMessage from '../../ui/ErrorMessage';
import ActionButtons from '../../ui/ActionButtons';
import useAsyncOperation from '../../../hooks/useAsyncOperation';
import { useVersionedId } from '../../../hooks/useVersionedId';
import { VersionedEntity } from '../../../utils/idGenerator';

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
  { id: 'security', name: 'Security/Governance', icon: SecurityIcon },
];

const AgentDetailsForm: React.FC<AgentDetailsFormProps> = ({ node }) => {
  const { updateNode } = useWorkflowContext();
  const theme = useTheme();
  const { mode } = useThemeContext();
  
  // Form state
  const [name, setName] = useState(node.name || '');
  const [selectedIcon, setSelectedIcon] = useState(node.icon || 'smart-toy');
  const [agentType, setAgentType] = useState(node.agentType || 'assistant');
  const [description, setDescription] = useState(node.description || '');
  const [prompt, setPrompt] = useState(node.content || '');
  const [enableMarkdown, setEnableMarkdown] = useState(node.enableMarkdown || false);
  const [credentialsSource, setCredentialsSource] = useState(node.credentialsSource || 'workgroup');
  const [llmModel, setLlmModel] = useState(node.llmModel || 'gpt-4o');
  const [maxConsecutiveReplies, setMaxConsecutiveReplies] = useState(node.maxConsecutiveReplies || 5);
  const [version, setVersion] = useState(node.version || '1.0.0');
  
  // Settings state
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [settings, setSettings] = useState<AgentSetting[]>(node.settings || []);
  const [newSetting, setNewSetting] = useState<AgentSetting>({
    key: '',
    dataType: '',
    defaultValue: '',
    description: '',
    allowedValues: [],
    isRequired: false,
    isSecret: false,
    isRuntimeConfig: false
  });
  const [newAllowedValue, setNewAllowedValue] = useState('');
  const [keyError, setKeyError] = useState('');
  const [dataTypeError, setDataTypeError] = useState('');
  
  // Data type options
  const dataTypes = [
    'String',
    'Number',
    'Boolean',
    'JSON',
    'Array',
    'Date'
  ];
  
  // Generate versioned ID for the agent
  const versionedAgent: VersionedEntity | null = useVersionedId('agent', version);
  
  // Update form when node changes
  useEffect(() => {
    setName(node.name || '');
    setSelectedIcon(node.icon || 'smart-toy');
    setAgentType(node.agentType || 'assistant');
    setDescription(node.description || '');
    setPrompt(node.content || '');
    setEnableMarkdown(node.enableMarkdown || false);
    setCredentialsSource(node.credentialsSource || 'workgroup');
    setLlmModel(node.llmModel || 'gpt-4o');
    setMaxConsecutiveReplies(node.maxConsecutiveReplies || 5);
    setVersion(node.version || '1.0.0');
    setSettings(node.settings || []);
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
    
    // Update node with form values and include versioned ID information
    const updates: Partial<WorkflowNode> = {
      name,
      icon: selectedIcon,
      agentType,
      description,
      content: prompt,
      enableMarkdown,
      credentialsSource,
      llmModel,
      maxConsecutiveReplies,
      version,
      settings
    };
    
    // Add versioned ID information if available
    if (versionedAgent) {
      updates.versionedId = versionedAgent.id;
      updates.createdAt = versionedAgent.createdAt;
    }
    
    updateNode(node.id, updates);
  });

  const handleSave = () => {
    executeSave();
  };

  const handleCancel = () => {
    // Reset form to original values
    setName(node.name || '');
    setSelectedIcon(node.icon || 'smart-toy');
    setAgentType(node.agentType || 'assistant');
    setDescription(node.description || '');
    setPrompt(node.content || '');
    setEnableMarkdown(node.enableMarkdown || false);
    setCredentialsSource(node.credentialsSource || 'workgroup');
    setLlmModel(node.llmModel || 'gpt-4o');
    setMaxConsecutiveReplies(node.maxConsecutiveReplies || 5);
    setVersion(node.version || '1.0.0');
    setSettings(node.settings || []);
  };

  // Expose the functions to save and cancel changes
  useEffect(() => {
    // Track if there are unsaved changes
    const isModified = 
      name !== (node.name || '') ||
      selectedIcon !== (node.icon || 'smart-toy') ||
      agentType !== (node.agentType || 'assistant') ||
      description !== (node.description || '') ||
      prompt !== (node.content || '') ||
      enableMarkdown !== (node.enableMarkdown || false) ||
      credentialsSource !== (node.credentialsSource || 'workgroup') ||
      llmModel !== (node.llmModel || 'gpt-4o') ||
      maxConsecutiveReplies !== (node.maxConsecutiveReplies || 5) ||
      version !== (node.version || '1.0.0') ||
      JSON.stringify(settings) !== JSON.stringify(node.settings || []);

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
  }, [
    name, selectedIcon, agentType, description, prompt, 
    enableMarkdown, credentialsSource, llmModel, maxConsecutiveReplies, version,
    node, settings
  ]);

  return (
    <Box sx={{ p: 1 }}>
      {/* Basic Information Section */}
      <Box sx={{ mb: 3 }}>
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

        {/* Version Information */}
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <TextField
            label="Version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            margin="normal"
            variant="outlined"
            placeholder="1.0.0"
            helperText="Semantic version (MAJOR.MINOR.PATCH)"
            sx={{ width: '50%' }}
          />
          
          <TextField
            label="Versioned ID"
            value={versionedAgent?.id || 'Generating...'}
            margin="normal"
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
            sx={{ width: '50%' }}
          />
        </Box>
        
        {versionedAgent && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            Created: {new Date(versionedAgent.createdAt).toLocaleString()}
          </Typography>
        )}

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

      {/* Settings Section */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="text"
          startIcon={settingsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          onClick={() => setSettingsExpanded(!settingsExpanded)}
          sx={{ mb: 1 }}
        >
          Agent Settings
        </Button>
      </Box>

      {settingsExpanded && (
        <Paper 
          sx={{ 
            p: 3, 
            mb: 3, 
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add New Setting
          </Typography>

          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={<Checkbox checked={newSetting.isRequired} onChange={(e) => 
                setNewSetting({...newSetting, isRequired: e.target.checked})
              } />}
              label="Required"
            />
            <FormControlLabel
              control={<Checkbox checked={newSetting.isSecret} onChange={(e) => 
                setNewSetting({...newSetting, isSecret: e.target.checked})
              } />}
              label="Secret"
            />
            <FormControlLabel
              control={<Checkbox checked={newSetting.isRuntimeConfig} onChange={(e) => 
                setNewSetting({...newSetting, isRuntimeConfig: e.target.checked})
              } />}
              label="Runtime Config"
            />
          </Box>

          <TextField
            fullWidth
            label="Key"
            required
            value={newSetting.key}
            onChange={(e) => {
              setNewSetting({...newSetting, key: e.target.value});
              setKeyError(e.target.value ? '' : 'Key is required');
            }}
            margin="normal"
            variant="outlined"
            error={!!keyError}
            helperText={keyError || 'Key is required'}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
            <InputLabel id="data-type-label">Select Data Types</InputLabel>
            <Select
              labelId="data-type-label"
              value={newSetting.dataType}
              label="Select Data Types"
              onChange={(e) => {
                setNewSetting({...newSetting, dataType: e.target.value});
                setDataTypeError(e.target.value ? '' : 'Please select an Data Type');
              }}
              error={!!dataTypeError}
            >
              {dataTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
            {dataTypeError && (
              <Typography variant="caption" color="error">
                {dataTypeError}
              </Typography>
            )}
          </FormControl>

          <TextField
            fullWidth
            label="Default Value"
            value={newSetting.defaultValue}
            onChange={(e) => setNewSetting({...newSetting, defaultValue: e.target.value})}
            margin="normal"
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Description"
            value={newSetting.description}
            onChange={(e) => setNewSetting({...newSetting, description: e.target.value})}
            margin="normal"
            variant="outlined"
            multiline
            rows={2}
            sx={{ mb: 2 }}
          />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Allowed Values
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              {newSetting.allowedValues.map((value, index) => (
                <Chip
                  key={index}
                  label={value}
                  onDelete={() => {
                    const updatedValues = [...newSetting.allowedValues];
                    updatedValues.splice(index, 1);
                    setNewSetting({...newSetting, allowedValues: updatedValues});
                  }}
                  sx={{ mb: 1 }}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                value={newAllowedValue}
                onChange={(e) => setNewAllowedValue(e.target.value)}
                placeholder="Add a value"
                size="small"
                sx={{ flexGrow: 1, mr: 1 }}
              />
              <Button 
                variant="contained" 
                size="small"
                onClick={() => {
                  if (newAllowedValue.trim()) {
                    setNewSetting({
                      ...newSetting, 
                      allowedValues: [...(newSetting.allowedValues || []), newAllowedValue.trim()]
                    });
                    setNewAllowedValue('');
                  }
                }}
                sx={{ 
                  bgcolor: theme.palette.mode === 'dark' ? '#1976d2' : '#00388f', 
                  '&:hover': { 
                    bgcolor: theme.palette.mode === 'dark' ? '#1565c0' : '#002a6b' 
                  },
                  color: '#ffffff'
                }}
              >
                Add Value
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button 
              variant="outlined" 
              onClick={() => {
                setNewSetting({
                  key: '',
                  dataType: '',
                  defaultValue: '',
                  description: '',
                  allowedValues: [],
                  isRequired: false,
                  isSecret: false,
                  isRuntimeConfig: false
                });
                setNewAllowedValue('');
                setKeyError('');
                setDataTypeError('');
              }}
            >
              Undo
            </Button>
            <Button 
              variant="contained"
              onClick={() => {
                if (!newSetting.key) {
                  setKeyError('Key is required');
                  return;
                }
                if (!newSetting.dataType) {
                  setDataTypeError('Please select an Data Type');
                  return;
                }
                
                setSettings([...settings, {...newSetting}]);
                setNewSetting({
                  key: '',
                  dataType: '',
                  defaultValue: '',
                  description: '',
                  allowedValues: [],
                  isRequired: false,
                  isSecret: false,
                  isRuntimeConfig: false
                });
                setNewAllowedValue('');
                setKeyError('');
                setDataTypeError('');
              }}
              sx={{ 
                bgcolor: theme.palette.mode === 'dark' ? '#1976d2' : '#00388f', 
                '&:hover': { 
                  bgcolor: theme.palette.mode === 'dark' ? '#1565c0' : '#002a6b' 
                },
                color: '#ffffff'
              }}
            >
              Add
            </Button>
          </Box>
        </Paper>
      )}

      {/* Display existing settings */}
      {settings.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Current Settings:
          </Typography>
          {settings.map((setting: AgentSetting, index: number) => (
            <Paper 
              key={index} 
              sx={{ 
                p: 2, 
                mb: 2,
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2">
                  {setting.key} <Typography component="span" variant="caption">({setting.dataType})</Typography>
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => {
                    const updatedSettings = [...settings];
                    updatedSettings.splice(index, 1);
                    setSettings(updatedSettings);
                  }}
                >
                  <RemoveCircleIcon color="error" fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                {setting.isRequired && <Chip label="Required" size="small" color="primary" variant="outlined" />}
                {setting.isSecret && <Chip label="Secret" size="small" color="secondary" variant="outlined" />}
                {setting.isRuntimeConfig && <Chip label="Runtime Config" size="small" color="info" variant="outlined" />}
              </Box>
              {setting.defaultValue && (
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Default: {setting.defaultValue}
                </Typography>
              )}
              {setting.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {setting.description}
                </Typography>
              )}
              {setting.allowedValues && setting.allowedValues.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Allowed Values:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {setting.allowedValues.map((value: string, valueIndex: number) => (
                      <Chip key={valueIndex} label={value} size="small" />
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          ))}
        </Box>
      )}

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
          <ActionButtons
            onSave={handleSave}
            onCancel={handleCancel}
            isSaveDisabled={Boolean(validationError)}
          />
        )}
      </Box>
    </Box>
  );
};

export default AgentDetailsForm;
