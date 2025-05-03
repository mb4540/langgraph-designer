import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { AgentCallOperatorConfig as AgentCallConfig } from '../../../../types/nodeTypes';
import { FormField } from '../common';
import { CodeEditor } from '../common';

interface AgentCallOperatorConfigProps {
  config: AgentCallConfig;
  onConfigChange: (config: AgentCallConfig) => void;
}

// Agent call types
const AGENT_CALL_TYPES = [
  { value: 'external', label: 'External Agent', description: 'Call an agent hosted on an external service' },
  { value: 'internal', label: 'Internal Agent', description: 'Call another agent defined within this workflow' },
  { value: 'api', label: 'API-based Agent', description: 'Call an agent through a REST API' },
];

/**
 * Component for configuring an agent call operator
 */
const AgentCallOperatorConfig: React.FC<AgentCallOperatorConfigProps> = ({
  config,
  onConfigChange
}) => {
  const handleChange = (field: keyof AgentCallConfig, value: any) => {
    onConfigChange({
      ...config,
      [field]: value
    });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Agent Call Configuration
      </Typography>
      
      <FormField
        label="Agent Call Type"
        required
        helperText="Type of agent call to make"
      >
        <FormControl fullWidth size="small">
          <Select
            value={config.call_type || 'external'}
            onChange={(e) => handleChange('call_type', e.target.value)}
          >
            {AGENT_CALL_TYPES.map(type => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          {AGENT_CALL_TYPES.find(t => t.value === (config.call_type || 'external'))?.description}
        </Typography>
      </FormField>
      
      {config.call_type === 'external' && (
        <>
          <FormField
            label="Agent URL"
            required
            helperText="URL of the external agent service"
          >
            <TextField
              fullWidth
              value={config.agent_url || ''}
              onChange={(e) => handleChange('agent_url', e.target.value)}
              size="small"
              placeholder="https://example.com/agent"
            />
          </FormField>
          
          <FormField
            label="Authentication Header"
            helperText="Optional authentication header for the agent service"
          >
            <TextField
              fullWidth
              value={config.auth_header || ''}
              onChange={(e) => handleChange('auth_header', e.target.value)}
              size="small"
              placeholder="Bearer token123"
            />
          </FormField>
        </>
      )}
      
      {config.call_type === 'internal' && (
        <FormField
          label="Agent ID"
          required
          helperText="ID of the agent node in this workflow"
        >
          <TextField
            fullWidth
            value={config.agent_id || ''}
            onChange={(e) => handleChange('agent_id', e.target.value)}
            size="small"
            placeholder="agent_123"
          />
        </FormField>
      )}
      
      {config.call_type === 'api' && (
        <>
          <FormField
            label="API Endpoint"
            required
            helperText="REST API endpoint for the agent"
          >
            <TextField
              fullWidth
              value={config.api_endpoint || ''}
              onChange={(e) => handleChange('api_endpoint', e.target.value)}
              size="small"
              placeholder="https://api.example.com/v1/agents/chat"
            />
          </FormField>
          
          <FormField
            label="API Key"
            helperText="API key for authentication (will be stored securely)"
          >
            <TextField
              fullWidth
              type="password"
              value={config.api_key || ''}
              onChange={(e) => handleChange('api_key', e.target.value)}
              size="small"
              placeholder="sk-..."
            />
          </FormField>
          
          <FormField
            label="Request Method"
            required
            helperText="HTTP method for the API request"
          >
            <FormControl fullWidth size="small">
              <Select
                value={config.request_method || 'POST'}
                onChange={(e) => handleChange('request_method', e.target.value)}
              >
                <MenuItem value="GET">GET</MenuItem>
                <MenuItem value="POST">POST</MenuItem>
                <MenuItem value="PUT">PUT</MenuItem>
              </Select>
            </FormControl>
          </FormField>
        </>
      )}
      
      <FormField
        label="Input Mapping"
        helperText="JavaScript code to map workflow state to agent input"
      >
        <CodeEditor
          value={config.input_mapping || 'function mapInput(state) {\n  // Example: Extract relevant fields for the agent\n  return {\n    messages: state.conversation_history || [],\n    context: state.context || {}\n  };\n}'}
          onChange={(value) => handleChange('input_mapping', value)}
          language="javascript"
          height="150px"
        />
      </FormField>
      
      <FormField
        label="Output Mapping"
        helperText="JavaScript code to map agent output back to workflow state"
      >
        <CodeEditor
          value={config.output_mapping || 'function mapOutput(agentOutput, state) {\n  // Example: Merge agent response into state\n  return {\n    ...state,\n    agent_response: agentOutput.response,\n    conversation_history: [...(state.conversation_history || []), {\n      role: "assistant",\n      content: agentOutput.response\n    }]\n  };\n}'}
          onChange={(value) => handleChange('output_mapping', value)}
          language="javascript"
          height="150px"
        />
      </FormField>
      
      <FormField>
        <FormControlLabel
          control={
            <Checkbox
              checked={config.stream_response || false}
              onChange={(e) => handleChange('stream_response', e.target.checked)}
            />
          }
          label="Stream Response"
        />
        <Typography variant="caption" color="text.secondary" display="block">
          Stream the agent's response as it's generated
        </Typography>
      </FormField>
      
      <FormField
        label="Timeout (seconds)"
        helperText="Maximum time to wait for the agent response"
      >
        <TextField
          fullWidth
          type="number"
          value={config.timeout_seconds || ''}
          onChange={(e) => handleChange('timeout_seconds', e.target.value ? parseInt(e.target.value) : undefined)}
          size="small"
          inputProps={{ min: 0 }}
          placeholder="30"
        />
      </FormField>
    </Box>
  );
};

export default AgentCallOperatorConfig;
