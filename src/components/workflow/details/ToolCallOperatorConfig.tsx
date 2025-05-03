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
import Divider from '@mui/material/Divider';
import { ToolCallOperatorConfig as ToolCallConfig } from '../../../types/nodeTypes';
import { useRuntimeContext } from '../../../context/RuntimeContext';
import { useWorkflowContext } from '../../../context/WorkflowContext';

interface ToolCallOperatorConfigProps {
  config: ToolCallConfig;
  setConfig: (config: ToolCallConfig) => void;
}

const ToolCallOperatorConfig: React.FC<ToolCallOperatorConfigProps> = ({
  config,
  setConfig
}) => {
  const { runtimeType } = useRuntimeContext();
  const { nodes } = useWorkflowContext();
  
  // Get agent nodes for binding selection
  const agentNodes = nodes.filter(node => node.type === 'agent');
  
  const handleChange = (field: keyof ToolCallConfig, value: any) => {
    setConfig({
      ...config,
      [field]: value
    });
  };

  return (
    <Box>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Tool Configuration
        </Typography>
        
        <TextField
          fullWidth
          label="Tool Name"
          value={config.tool_name || ''}
          onChange={(e) => handleChange('tool_name', e.target.value)}
          margin="normal"
          variant="outlined"
          placeholder="Enter the tool name"
          required
        />
        
        <TextField
          fullWidth
          label="Function Signature"
          value={typeof config.function_signature === 'string' ? config.function_signature : JSON.stringify(config.function_signature, null, 2)}
          onChange={(e) => {
            try {
              // Try to parse as JSON first
              const jsonValue = JSON.parse(e.target.value);
              handleChange('function_signature', jsonValue);
            } catch {
              // If not valid JSON, store as string
              handleChange('function_signature', e.target.value);
            }
          }}
          margin="normal"
          variant="outlined"
          multiline
          rows={4}
          placeholder="Enter JSON schema or function signature"
        />
        
        <TextField
          fullWidth
          label="Return Schema"
          value={typeof config.return_schema === 'string' ? config.return_schema : JSON.stringify(config.return_schema, null, 2)}
          onChange={(e) => {
            try {
              // Try to parse as JSON first
              const jsonValue = JSON.parse(e.target.value);
              handleChange('return_schema', jsonValue);
            } catch {
              // If not valid JSON, store as string
              handleChange('return_schema', e.target.value);
            }
          }}
          margin="normal"
          variant="outlined"
          multiline
          rows={3}
          placeholder="Enter JSON schema for return value"
        />
        
        {runtimeType === 'autogen' && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="binding-agent-label">Binding Agent</InputLabel>
            <Select
              labelId="binding-agent-label"
              value={config.binding_agent || ''}
              label="Binding Agent"
              onChange={(e) => handleChange('binding_agent', e.target.value)}
              required
            >
              {agentNodes.map(agent => (
                <MenuItem key={agent.id} value={agent.id}>
                  {agent.name || `Agent ${agent.id.slice(0, 8)}`}
                </MenuItem>
              ))}
            </Select>
            <Typography variant="caption" color="text.secondary">
              Required in Autogen: Agent that this tool is bound to
            </Typography>
          </FormControl>
        )}
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Execution Settings
          </Typography>
          
          <TextField
            fullWidth
            label="Timeout (seconds)"
            type="number"
            value={config.timeout_sec || ''}
            onChange={(e) => handleChange('timeout_sec', e.target.value ? parseInt(e.target.value) : undefined)}
            margin="normal"
            variant="outlined"
            inputProps={{ min: 0 }}
          />
          
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
          
          <FormControlLabel
            control={
              <Switch
                checked={config.side_effect === true}
                onChange={(e) => handleChange('side_effect', e.target.checked)}
              />
            }
            label="Has Side Effects"
            sx={{ mt: 2 }}
          />
          <Typography variant="caption" color="text.secondary" display="block" sx={{ ml: 3 }}>
            Tool modifies external state (marks workflow as dirty)
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ToolCallOperatorConfig;
