import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { AgentCallOperatorConfig as AgentCallConfig } from '../../../types/nodeTypes';
import { useRuntimeContext } from '../../../context/RuntimeContext';
import { useWorkflowContext } from '../../../context/WorkflowContext';

interface AgentCallOperatorConfigProps {
  config: AgentCallConfig;
  setConfig: (config: AgentCallConfig) => void;
}

const AgentCallOperatorConfig: React.FC<AgentCallOperatorConfigProps> = ({
  config,
  setConfig
}) => {
  const { runtimeType } = useRuntimeContext();
  const { nodes } = useWorkflowContext();
  
  // Get tool nodes for tool selection
  const toolNodes = nodes.filter(node => node.type === 'tool');
  
  const handleChange = (field: keyof AgentCallConfig, value: any) => {
    setConfig({
      ...config,
      [field]: value
    });
  };

  const handleToolSelection = (toolId: string) => {
    const updatedTools = config.tools_allowed ? [...config.tools_allowed] : [];
    const index = updatedTools.indexOf(toolId);
    
    if (index === -1) {
      updatedTools.push(toolId);
    } else {
      updatedTools.splice(index, 1);
    }
    
    handleChange('tools_allowed', updatedTools);
  };

  return (
    <Box>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Agent Configuration
        </Typography>
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="agent-type-label">Agent Type</InputLabel>
          <Select
            labelId="agent-type-label"
            value={config.agent_type || ''}
            label="Agent Type"
            onChange={(e) => handleChange('agent_type', e.target.value)}
          >
            {runtimeType === 'autogen' ? (
              <>
                <MenuItem value="AssistantAgent">Assistant Agent</MenuItem>
                <MenuItem value="UserProxyAgent">User Proxy Agent</MenuItem>
                <MenuItem value="Custom">Custom Agent</MenuItem>
              </>
            ) : (
              <>
                <MenuItem value="OpenAI">OpenAI</MenuItem>
                <MenuItem value="Anthropic">Anthropic</MenuItem>
                <MenuItem value="Callable">Callable</MenuItem>
              </>
            )}
          </Select>
        </FormControl>
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="llm-model-label">LLM Model</InputLabel>
          <Select
            labelId="llm-model-label"
            value={config.llm_model || 'gpt-4o'}
            label="LLM Model"
            onChange={(e) => handleChange('llm_model', e.target.value)}
          >
            <MenuItem value="gpt-4o">OpenAI GPT-4o</MenuItem>
            <MenuItem value="gpt-4o-mini">OpenAI GPT-4o Mini</MenuItem>
            <MenuItem value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet</MenuItem>
            <MenuItem value="gemini-1.5-pro">Google Gemini 1.5 Pro</MenuItem>
            <MenuItem value="llama-3-70b">Meta Llama 3-70B</MenuItem>
            <MenuItem value="mistral-large">Mistral Large</MenuItem>
          </Select>
        </FormControl>
        
        <TextField
          fullWidth
          label="Prompt Template"
          value={config.prompt_template || ''}
          onChange={(e) => handleChange('prompt_template', e.target.value)}
          margin="normal"
          variant="outlined"
          multiline
          rows={4}
          placeholder="Enter a prompt template for the agent"
        />
        
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <TextField
            label="Temperature"
            type="number"
            value={config.temperature !== undefined ? config.temperature : 0.7}
            onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
            inputProps={{ min: 0, max: 1, step: 0.1 }}
            sx={{ width: '50%' }}
          />
          
          <TextField
            label="Max Tokens"
            type="number"
            value={config.max_tokens || ''}
            onChange={(e) => handleChange('max_tokens', e.target.value ? parseInt(e.target.value) : undefined)}
            inputProps={{ min: 1 }}
            sx={{ width: '50%' }}
          />
        </Box>
        
        {runtimeType === 'autogen' && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Allowed Tools
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {toolNodes.map(tool => (
                <Chip
                  key={tool.id}
                  label={tool.name || tool.toolType}
                  onClick={() => handleToolSelection(tool.id)}
                  color={config.tools_allowed?.includes(tool.id) ? 'primary' : 'default'}
                  variant={config.tools_allowed?.includes(tool.id) ? 'filled' : 'outlined'}
                />
              ))}
              {toolNodes.length === 0 && (
                <Typography variant="caption" color="text.secondary">
                  No tool nodes available. Add tool nodes to the workflow to enable them here.
                </Typography>
              )}
            </Box>
          </Box>
        )}
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={config.streaming === true}
                onChange={(e) => handleChange('streaming', e.target.checked)}
              />
            }
            label="Enable Streaming"
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="memory-scope-label">Memory Scope</InputLabel>
            <Select
              labelId="memory-scope-label"
              value={config.memory_scope || 'graph'}
              label="Memory Scope"
              onChange={(e) => handleChange('memory_scope', e.target.value)}
            >
              <MenuItem value="graph">Graph (Shared)</MenuItem>
              <MenuItem value="agent">Agent (Private)</MenuItem>
              <MenuItem value="none">None (Stateless)</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Stop Sequences"
            value={config.stop_sequences?.join(', ') || ''}
            onChange={(e) => handleChange('stop_sequences', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            margin="normal"
            variant="outlined"
            placeholder="Comma-separated list of sequences"
            helperText="Sequences that will stop the model generation"
          />
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Retry Policy
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Max Attempts"
              type="number"
              value={config.retry_policy?.max_attempts || ''}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value) : undefined;
                handleChange('retry_policy', {
                  ...config.retry_policy,
                  max_attempts: value
                });
              }}
              inputProps={{ min: 1 }}
              sx={{ width: '50%' }}
            />
            
            <TextField
              label="Backoff (seconds)"
              type="number"
              value={config.retry_policy?.backoff_sec || ''}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value) : undefined;
                handleChange('retry_policy', {
                  ...config.retry_policy,
                  backoff_sec: value
                });
              }}
              inputProps={{ min: 0 }}
              sx={{ width: '50%' }}
            />
          </Box>
        </Box>
        
        {runtimeType === 'langgraph' && (
          <Box sx={{ mt: 3 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="concurrency-label">Concurrency</InputLabel>
              <Select
                labelId="concurrency-label"
                value={config.concurrency || 'sequential'}
                label="Concurrency"
                onChange={(e) => handleChange('concurrency', e.target.value)}
              >
                <MenuItem value="sequential">Sequential</MenuItem>
                <MenuItem value="parallel">Parallel</MenuItem>
              </Select>
              <Typography variant="caption" color="text.secondary">
                LangGraph only: Compile-time setting for agent execution
              </Typography>
            </FormControl>
          </Box>
        )}
        
        <TextField
          fullWidth
          label="Cost Budget (USD)"
          type="number"
          value={config.cost_budget || ''}
          onChange={(e) => handleChange('cost_budget', e.target.value ? parseFloat(e.target.value) : undefined)}
          margin="normal"
          variant="outlined"
          inputProps={{ min: 0, step: 0.01 }}
          helperText="Maximum budget for this agent call in USD"
        />
      </Paper>
    </Box>
  );
};

export default AgentCallOperatorConfig;
