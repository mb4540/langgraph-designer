import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Editor from '@monaco-editor/react';
import { useWorkflowStore } from '../store/workflowStore';
import { useThemeContext } from '../context/ThemeContext';

// List of available LLM models
const LLM_MODELS = [
  { value: 'gpt-4o', label: 'OpenAI GPT-4o' },
  { value: 'claude-3-7-sonnet', label: 'Anthropic Claude 3.7 Sonnet' },
  { value: 'gemini-2-5-pro', label: 'Google DeepMind Gemini 2.5 Pro' },
  { value: 'llama-3-70b', label: 'Meta Llama 3-70B' },
  { value: 'mistral-large', label: 'Mistral Large' },
  { value: 'grok-3', label: 'xAI Grok 3' },
  { value: 'deepseek-coder-v2', label: 'DeepSeek-Coder V2' },
  { value: 'cohere-command-r', label: 'Cohere Command-R' },
  { value: 'phi-3', label: 'Microsoft Phi-3' },
  { value: 'jurassic-2-ultra', label: 'AI21 Labs Jurassic-2 Ultra' },
  { value: 'pangu-2', label: 'Huawei PanGu 2.0' },
  { value: 'ernie-4', label: 'Baidu ERNIE 4.0' },
];

// Simplified list for agent nodes
const AGENT_MODELS = [
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
  { value: 'gpt-4o', label: 'GPT-4o' },
];

const DetailsPanel: React.FC = () => {
  const { selectedNode, updateNode } = useWorkflowStore();
  const { mode } = useThemeContext();
  const [name, setName] = useState('');
  const [llmModel, setLlmModel] = useState('gpt-4o-mini');
  const [content, setContent] = useState('');

  // Update local state when selected node changes
  useEffect(() => {
    if (selectedNode) {
      setName(selectedNode.name);
      setContent(selectedNode.content);
      if (selectedNode.type === 'agent' && selectedNode.llmModel) {
        setLlmModel(selectedNode.llmModel);
      } else if (selectedNode.type === 'model' && selectedNode.llmModel) {
        setLlmModel(selectedNode.llmModel);
      } else if (selectedNode.type === 'model' && !selectedNode.llmModel) {
        // Default model for model nodes
        setLlmModel('gpt-4o');
      }
    }
  }, [selectedNode]);

  const handleSave = () => {
    if (selectedNode) {
      const updates: any = {};
      
      // Only include name and content for non-model nodes
      if (selectedNode.type !== 'model') {
        updates.name = name;
        updates.content = content;
      }
      
      // Include llmModel for both agent and model nodes
      if (selectedNode.type === 'agent' || selectedNode.type === 'model') {
        updates.llmModel = llmModel;
      }
      
      updateNode(selectedNode.id, updates);
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

  // Determine the title based on node type
  const getNodeTitle = () => {
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
    if (selectedNode.type === 'model') {
      // For model nodes, only show the model selection
      return (
        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>LLM Model</InputLabel>
            <Select
              value={llmModel}
              label="LLM Model"
              onChange={(e) => setLlmModel(e.target.value)}
            >
              {LLM_MODELS.map(model => (
                <MenuItem key={model.value} value={model.value}>{model.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      );
    }
    
    // For all other node types
    return (
      <>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            variant="outlined"
          />
        </Box>
        
        {selectedNode.type === 'agent' && (
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>LLM Model</InputLabel>
              <Select
                value={llmModel}
                label="LLM Model"
                onChange={(e) => setLlmModel(e.target.value)}
              >
                {AGENT_MODELS.map(model => (
                  <MenuItem key={model.value} value={model.value}>{model.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
        
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
          {selectedNode.type === 'agent' ? 'Description' : 'Code'}
        </Typography>
        
        <Box sx={{ flexGrow: 1, mb: 2, border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
          {selectedNode.type === 'agent' ? (
            <TextField
              multiline
              fullWidth
              minRows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
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
            />
          ) : (
            <Editor
              height="300px"
              defaultLanguage="javascript"
              value={content}
              onChange={(value) => setContent(value || '')}
              theme={mode === 'dark' ? 'vs-dark' : 'light'}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
              }}
            />
          )}
        </Box>
      </>
    );
  };

  return (
    <Paper elevation={3} sx={{ height: '100%', padding: 2, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        {getNodeTitle()}
      </Typography>
      
      {renderDetailsContent()}
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Box>
    </Paper>
  );
};

export default DetailsPanel;
