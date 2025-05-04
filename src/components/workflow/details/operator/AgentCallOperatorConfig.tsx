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

// Extended AgentCallConfig with UI-specific properties
interface ExtendedAgentCallConfig extends AgentCallConfig {
  call_type?: 'external' | 'internal' | 'api';
  agent_url?: string;
  auth_header?: string;
  agent_id?: string;
  api_endpoint?: string;
  api_key?: string;
  request_method?: 'GET' | 'POST' | 'PUT';
  input_mapping?: string;
  output_mapping?: string;
  stream_response?: boolean;
  timeout_seconds?: number;
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
  // Cast config to extended type for UI properties
  const extendedConfig = config as ExtendedAgentCallConfig;
  
  const handleChange = (field: keyof ExtendedAgentCallConfig, value: any) => {
    onConfigChange({
      ...extendedConfig,
      [field]: value
    } as AgentCallConfig);
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
            value={extendedConfig.call_type || 'external'}
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
          {AGENT_CALL_TYPES.find(t => t.value === (extendedConfig.call_type || 'external'))?.description}
        </Typography>
      </FormField>
      
      {extendedConfig.call_type === 'external' && (
        <>
          <FormField
            label="Agent URL"
            required
            helperText="URL of the external agent service"
          >
            <TextField
              fullWidth
              value={extendedConfig.agent_url || ''}
              onChange={(e) => handleChange('agent_url', e.target.value)}
              size="small"
              placeholder="https://example.com/agent"
            />
          </FormField>
          
          <FormField
            label="Authentication Header"
            helperText="Optional authorization header for the agent service"
          >
            <TextField
              fullWidth
              value={extendedConfig.auth_header || ''}
              onChange={(e) => handleChange('auth_header', e.target.value)}
              size="small"
              placeholder="Bearer token123"
            />
          </FormField>
        </>
      )}
      
      {extendedConfig.call_type === 'internal' && (
        <FormField
          label="Agent ID"
          required
          helperText="ID of the agent within this workflow"
        >
          <TextField
            fullWidth
            value={extendedConfig.agent_id || ''}
            onChange={(e) => handleChange('agent_id', e.target.value)}
            size="small"
            placeholder="agent_123"
          />
        </FormField>
      )}
      
      {extendedConfig.call_type === 'api' && (
        <>
          <FormField
            label="API Endpoint"
            required
            helperText="URL of the agent API endpoint"
          >
            <TextField
              fullWidth
              value={extendedConfig.api_endpoint || ''}
              onChange={(e) => handleChange('api_endpoint', e.target.value)}
              size="small"
              placeholder="https://api.example.com/v1/agents/chat"
            />
          </FormField>
          
          <FormField
            label="API Key"
            helperText="Authentication key for the API"
          >
            <TextField
              fullWidth
              type="password"
              value={extendedConfig.api_key || ''}
              onChange={(e) => handleChange('api_key', e.target.value)}
              size="small"
              placeholder="sk-..."
            />
          </FormField>
          
          <FormField
            label="Request Method"
            helperText="HTTP method for the API call"
          >
            <FormControl fullWidth size="small">
              <Select
                value={extendedConfig.request_method || 'POST'}
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
        required
        helperText="Function to map workflow state to agent input"
      >
        <CodeEditor
          code={extendedConfig.input_mapping || 'function mapInput(state) {\n  // Example: Extract relevant fields for the agent\n  return {\n    messages: state.conversation_history || [],\n    context: state.context || {}\n  };\n}'}
          onCodeChange={(code) => handleChange('input_mapping', code)}
          language="javascript"
          height="150px"
        />
      </FormField>
      
      <FormField
        label="Output Mapping"
        required
        helperText="Function to map agent output back to workflow state"
      >
        <CodeEditor
          code={extendedConfig.output_mapping || 'function mapOutput(agentOutput, state) {\n  // Example: Merge agent response into state\n  return {\n    ...state,\n    agent_response: agentOutput.response,\n    conversation_history: [...(state.conversation_history || []), {\n      role: "assistant",\n      content: agentOutput.response\n    }]\n  };\n}'}
          onCodeChange={(code) => handleChange('output_mapping', code)}
          language="javascript"
          height="150px"
        />
      </FormField>
      
      <FormField label="Stream Response">
        <FormControlLabel
          control={
            <Checkbox
              checked={extendedConfig.stream_response || false}
              onChange={(e) => handleChange('stream_response', e.target.checked)}
            />
          }
          label="Stream Response"
        />
      </FormField>
      
      <FormField
        label="Timeout (seconds)"
        helperText="Maximum time to wait for agent response (0 = no timeout)"
      >
        <TextField
          fullWidth
          type="number"
          value={extendedConfig.timeout_seconds || ''}
          onChange={(e) => handleChange('timeout_seconds', e.target.value ? parseInt(e.target.value) : undefined)}
          size="small"
          inputProps={{ min: 0 }}
          placeholder="30"
        />
      </FormField>
      
      {/* Map UI fields to actual AgentCallConfig properties */}
      <Box sx={{ display: 'none' }}>
        {/* This updates the actual properties expected by the interface */}
        {(() => {
          // Update the actual AgentCallConfig properties based on UI fields
          const agentType = extendedConfig.call_type === 'internal' ? 'Internal' :
                          extendedConfig.call_type === 'api' ? 'OpenAI' : 'Custom';
          
          handleChange('agent_type', agentType);
          
          // Set other required fields with defaults if not set
          if (!extendedConfig.llm_model) {
            handleChange('llm_model', 'gpt-4o');
          }
          
          if (!extendedConfig.prompt_template) {
            handleChange('prompt_template', 'You are a helpful assistant.');
          }
          
          return null;
        })()}
      </Box>
    </Box>
  );
};

export default AgentCallOperatorConfig;
