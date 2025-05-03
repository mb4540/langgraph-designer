import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';

import { WorkflowNode, AgentSetting } from '../../../types/nodeTypes';
import { useWorkflowContext } from '../../../context/WorkflowContext';
import { useThemeContext } from '../../../context/ThemeContext';
import useAsyncOperation from '../../../hooks/useAsyncOperation';
import { useVersionedId } from '../../../hooks/useVersionedId';
import { VersionedEntity } from '../../../utils/idGenerator';

// Import common components
import { BaseNodeForm, FormField } from './common';

// Import agent-specific components
import {
  AgentIconSelector,
  AgentSettings,
  AgentPromptEditor,
  AgentModelSettings
} from './agent';

interface AgentDetailsFormProps {
  node: WorkflowNode;
}

// Define agent type options
const AGENT_TYPES = [
  { value: 'assistant', label: 'Assistant' },
  { value: 'tool-user', label: 'Tool User' },
  { value: 'researcher', label: 'Researcher' },
  { value: 'specialist', label: 'Specialist' },
  { value: 'custom', label: 'Custom' }
];

// Define workgroup options (placeholder)
const workgroups = [
  { id: 'wg1', name: 'General Workgroup' },
  { id: 'wg2', name: 'Customer Support' },
  { id: 'wg3', name: 'Research Team' },
  { id: 'wg4', name: 'Development' },
  { id: 'wg5', name: 'Marketing' }
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
  const [settings, setSettings] = useState<AgentSetting[]>(node.settings || []);
  
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

  // Handle save operation
  const { execute: handleSave, loading, error } = useAsyncOperation(async () => {
    // Validate required fields
    if (!name) {
      throw new Error('Agent name is required');
    }
    
    if (!agentType) {
      throw new Error('Agent type is required');
    }
    
    if (!prompt) {
      throw new Error('Agent prompt is required');
    }

    // Update the node with form values
    const updatedNode = {
      ...node,
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
      versionedId: versionedAgent?.id || node.versionedId
    };
    
    updateNode(updatedNode);
  });

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
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Basic Information
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormField label="Agent Name" required>
                <TextField
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter agent name"
                  size="small"
                />
              </FormField>
            </Grid>
            
            <Grid item xs={12}>
              <FormField label="Description">
                <TextField
                  fullWidth
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this agent does"
                  size="small"
                  multiline
                  rows={2}
                />
              </FormField>
            </Grid>
            
            <Grid item xs={12}>
              <FormField label="Version">
                <TextField
                  fullWidth
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="1.0.0"
                  size="small"
                />
              </FormField>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Agent Type */}
        <Grid item xs={12}>
          <FormField label="Agent Type" required>
            <FormControl component="fieldset">
              <RadioGroup
                row
                value={agentType}
                onChange={(e) => setAgentType(e.target.value)}
              >
                {AGENT_TYPES.map((type) => (
                  <FormControl key={type.value} sx={{ mr: 2 }}>
                    <Radio
                      value={type.value}
                      id={`agent-type-${type.value}`}
                    />
                    <label htmlFor={`agent-type-${type.value}`}>
                      <Typography variant="body2">{type.label}</Typography>
                    </label>
                  </FormControl>
                ))}
              </RadioGroup>
            </FormControl>
          </FormField>
        </Grid>
        
        {/* Agent Icon */}
        <Grid item xs={12}>
          <FormField label="Agent Icon">
            <AgentIconSelector
              selectedIcon={selectedIcon}
              onSelectIcon={setSelectedIcon}
              sx={{ mt: 1 }}
            />
          </FormField>
        </Grid>
        
        {/* Agent Prompt */}
        <Grid item xs={12}>
          <AgentPromptEditor
            prompt={prompt}
            onPromptChange={setPrompt}
            enableMarkdown={enableMarkdown}
            onEnableMarkdownChange={setEnableMarkdown}
            sx={{ mt: 2 }}
          />
        </Grid>
        
        {/* Model Settings */}
        <Grid item xs={12}>
          <AgentModelSettings
            llmModel={llmModel}
            onLlmModelChange={setLlmModel}
            credentialsSource={credentialsSource}
            onCredentialsSourceChange={setCredentialsSource}
            maxConsecutiveReplies={maxConsecutiveReplies}
            onMaxConsecutiveRepliesChange={setMaxConsecutiveReplies}
            sx={{ mt: 2 }}
          />
        </Grid>
        
        {/* Agent Settings */}
        <Grid item xs={12}>
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
