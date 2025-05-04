import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { WorkflowNode } from '../../../types/nodeTypes';
import { useWorkflowContext } from '../../../context/WorkflowContext';
import useAsyncOperation from '../../../hooks/useAsyncOperation';

// Import common components
import { BaseNodeForm } from './common';

// Import agent-specific components
import { AgentIconSelector, AgentPromptEditor, AgentSettings } from './agent';
import AgentTypeSelector from './agent/AgentTypeSelector';
import AgentVersionControl from './agent/AgentVersionControl';

interface AgentDetailsFormProps {
  node: WorkflowNode;
}

// Define agent type options
const AGENT_TYPES = [
  { value: 'assistant', label: 'Assistant' },
  { value: 'tool-user', label: 'Tool User' },
  { value: 'reasoning', label: 'Reasoning Agent' },
  { value: 'planner', label: 'Planner' },
  { value: 'researcher', label: 'Researcher' },
  { value: 'specialist', label: 'Domain Specialist' },
];

// Define LLM model options
const LLM_MODELS = [
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
];

// Define credentials source options
const CREDENTIALS_SOURCES = [
  { value: 'workgroup', label: 'Workgroup Default' },
  { value: 'custom', label: 'Custom Credentials' },
];

const AgentDetailsForm: React.FC<AgentDetailsFormProps> = ({ node }) => {
  const { updateNode } = useWorkflowContext();
  
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
  const [settings, setSettings] = useState(node.settings || []);
  
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

  // Handle save operation
  const { execute, loading, error } = useAsyncOperation<void>(async () => {
    // Validate required fields
    if (!name) {
      throw new Error('Agent name is required');
    }
    if (!prompt) {
      throw new Error('Agent prompt is required');
    }

    // Update the node with form values
    updateNode(node.id, {
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
      settings,
    });
  });

  // Create a wrapper function that always returns Promise<void>
  const handleSave = async () => {
    await execute();
  };

  // Handle cancel operation
  const handleCancel = () => {
    // Reset form to node values
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

  return (
    <BaseNodeForm
      title="Agent Configuration"
      onSave={handleSave}
      onCancel={handleCancel}
      loading={loading}
      error={error}
      nodeId={node.id}
    >
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Agent Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Grid>
        
        <Grid item xs={12}>
          <AgentTypeSelector
            value={agentType}
            onChange={setAgentType}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={2}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Agent ID"
                value={node.id}
                InputProps={{ readOnly: true }}
                size="small"
                helperText="Unique identifier for this agent"
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <AgentVersionControl
                version={version}
                onVersionChange={setVersion}
              />
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <AgentIconSelector
            selectedIcon={selectedIcon}
            onSelectIcon={setSelectedIcon}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>Model Configuration</Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>LLM Model</InputLabel>
                <Select
                  value={llmModel}
                  onChange={(e) => setLlmModel(e.target.value)}
                  label="LLM Model"
                >
                  {LLM_MODELS.map((model) => (
                    <MenuItem key={model.value} value={model.value}>
                      {model.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Credentials Source</InputLabel>
                <Select
                  value={credentialsSource}
                  onChange={(e) => setCredentialsSource(e.target.value)}
                  label="Credentials Source"
                >
                  {CREDENTIALS_SOURCES.map((source) => (
                    <MenuItem key={source.value} value={source.value}>
                      {source.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Max Consecutive Replies"
                type="number"
                value={maxConsecutiveReplies}
                onChange={(e) => setMaxConsecutiveReplies(parseInt(e.target.value))}
                InputProps={{ inputProps: { min: 1, max: 10 } }}
              />
            </Grid>
          </Grid>
        </Grid>
        
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <AgentPromptEditor
            prompt={prompt}
            onPromptChange={setPrompt}
            enableMarkdown={enableMarkdown}
            onEnableMarkdownChange={setEnableMarkdown}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <AgentSettings
            settings={settings}
            onSettingsChange={setSettings}
          />
        </Grid>
      </Grid>
    </BaseNodeForm>
  );
};

export default AgentDetailsForm;
