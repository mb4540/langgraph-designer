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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
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

// Memory types
const MEMORY_TYPES = [
  {
    value: 'conversation-buffer',
    label: 'Conversation Buffer / Short-Term Working Memory',
    description: 'Stores the raw dialogue or tool calls of the current session verbatim; useful for chat agents that need full context but can tolerate token growth.',
    source: 'Medium'
  },
  {
    value: 'sliding-window',
    label: 'Sliding-Window (Buffer Window) Memory',
    description: 'Keeps only the _last k messages or tokens so the prompt stays within context-window limits while preserving recency.',
    source: 'Medium'
  },
  {
    value: 'summary',
    label: 'Summary Memory',
    description: 'Maintains an ever-evolving synopsis of the conversation (often updated by an LLM) instead of the full transcript. Great for long multi-step tasks.',
    source: '🦜️🔗 Langchain'
  },
  {
    value: 'summary-buffer-hybrid',
    label: 'Summary-Buffer Hybrid',
    description: 'Combines a short raw window with the rolling summary so the agent gets both recent detail and long-horizon context.',
    source: 'Medium'
  },
  {
    value: 'entity-knowledge-graph',
    label: 'Entity / Knowledge-Graph Memory',
    description: 'Extracts and tracks entities (people, projects, dates, etc.) as a mini KG so the agent can reason over structured facts.',
    source: 'Medium'
  },
  {
    value: 'vector-store',
    label: 'Vector-Store (Retriever) Memory',
    description: 'Embeds chunks of past dialogue, documents, or tool outputs into a vector DB (Pinecone, FAISS, Qdrant, etc.) and retrieves the most relevant items at query time (classic RAG pattern).',
    source: 'LinkedIn'
  },
  {
    value: 'episodic',
    label: 'Episodic Memory',
    description: 'Logs task "episodes" (goal → plan → actions → results) so agents can learn from prior successes/failures across sessions; often paired with vector or relational storage.',
    source: 'IBM - United States, Medium'
  },
  {
    value: 'long-term-profile',
    label: 'Long-Term Profile / Preference Memory',
    description: 'Persists user-specific facts (name, role, style, constraints) so every new session starts personalized without re-asking basics.',
    source: 'Medium'
  },
  {
    value: 'scratch-pad',
    label: 'Scratch-pad / Planning Memory',
    description: 'A dedicated area (often JSON) where reasoning chains or tree-of-thought plans are written, read, and revised as the agent thinks.',
    source: ''
  },
  {
    value: 'tool-result-cache',
    label: 'Tool-Result Cache Memory',
    description: 'Saves expensive or rate-limited API responses so repeated queries can be served instantly and counted toward reasoning context.',
    source: ''
  },
  {
    value: 'read-only-shared',
    label: 'Read-Only Shared Knowledge Memory',
    description: 'A static corpus (policies, product docs, codebase) mounted in retrieval mode; the agent can reference but not mutate it.',
    source: 'Medium'
  },
  {
    value: 'combined-layered',
    label: 'Combined / Layered Memory Controllers',
    description: 'Orchestrators that switch among several of the above (e.g., raw buffer + summary + vector store) based on token budget, recency needs, or task phase.',
    source: ''
  },
];

const DetailsPanel: React.FC = () => {
  const { selectedNode, updateNode } = useWorkflowStore();
  const { mode } = useThemeContext();
  const [name, setName] = useState('');
  const [llmModel, setLlmModel] = useState('gpt-4o-mini');
  const [content, setContent] = useState('');
  const [memoryType, setMemoryType] = useState('conversation-buffer');

  // Update local state when selected node changes
  useEffect(() => {
    if (selectedNode) {
      setName(selectedNode.name);
      setContent(selectedNode.content);
      
      // Handle model selection for agent and model nodes
      if (selectedNode.type === 'agent' && selectedNode.llmModel) {
        setLlmModel(selectedNode.llmModel);
      } else if (selectedNode.type === 'model' && selectedNode.llmModel) {
        setLlmModel(selectedNode.llmModel);
      } else if (selectedNode.type === 'model' && !selectedNode.llmModel) {
        // Default model for model nodes
        setLlmModel('gpt-4o');
      }
      
      // Handle memory type selection
      if (selectedNode.type === 'memory' && selectedNode.memoryType) {
        setMemoryType(selectedNode.memoryType);
      } else if (selectedNode.type === 'memory' && !selectedNode.memoryType) {
        // Default memory type
        setMemoryType('conversation-buffer');
      }
    }
  }, [selectedNode]);

  const handleSave = () => {
    if (selectedNode) {
      const updates: any = {};
      
      // Only include name and content for non-model and non-memory nodes
      if (selectedNode.type !== 'model' && selectedNode.type !== 'memory') {
        updates.name = name;
        updates.content = content;
      }
      
      // Include llmModel for both agent and model nodes
      if (selectedNode.type === 'agent' || selectedNode.type === 'model') {
        updates.llmModel = llmModel;
      }
      
      // Include memoryType for memory nodes
      if (selectedNode.type === 'memory') {
        updates.memoryType = memoryType;
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
    } else if (selectedNode.type === 'memory') {
      // For memory nodes, show the memory type selection
      return (
        <Box sx={{ mb: 2, mt: 2 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Memory Type</FormLabel>
            <RadioGroup
              value={memoryType}
              onChange={(e) => setMemoryType(e.target.value)}
            >
              {MEMORY_TYPES.map(memory => (
                <Box key={memory.value} sx={{ mb: 2, border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                  <FormControlLabel 
                    value={memory.value} 
                    control={<Radio />} 
                    label={
                      <Box>
                        <Typography variant="subtitle1">{memory.label}</Typography>
                        <Typography variant="body2" color="text.secondary">{memory.description}</Typography>
                        {memory.source && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            Source: {memory.source}
                          </Typography>
                        )}
                      </Box>
                    } 
                  />
                </Box>
              ))}
            </RadioGroup>
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
