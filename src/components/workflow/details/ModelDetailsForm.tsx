import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { WorkflowNode } from '../../../store/workflowStore';
import { useWorkflowContext } from '../../../context/WorkflowContext';

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

interface ModelDetailsFormProps {
  node: WorkflowNode;
}

const ModelDetailsForm: React.FC<ModelDetailsFormProps> = ({ node }) => {
  const { updateNode } = useWorkflowContext();
  const [llmModel, setLlmModel] = useState(node.llmModel || 'gpt-4o');
  
  // Update form when node changes
  useEffect(() => {
    setLlmModel(node.llmModel || 'gpt-4o');
  }, [node]);

  const handleSave = () => {
    updateNode(node.id, {
      llmModel
    });
  };

  return (
    <>
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
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </Box>
    </>
  );
};

export default ModelDetailsForm;
