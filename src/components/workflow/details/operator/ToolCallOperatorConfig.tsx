import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { ToolCallOperatorConfig as ToolCallConfig } from '../../../../types/nodeTypes';
import { FormField } from '../common';
import { CodeEditor } from '../common';

interface ToolCallOperatorConfigProps {
  config: ToolCallConfig;
  onConfigChange: (config: ToolCallConfig) => void;
}

// Extended config interface with UI-specific properties
interface ExtendedToolCallConfig extends ToolCallConfig {
  call_type?: 'internal' | 'external' | 'api' | 'function';
  tool_id?: string;
  tool_url?: string;
  auth_header?: string;
  api_endpoint?: string;
  api_key?: string;
  request_method?: 'GET' | 'POST' | 'PUT';
  function_definition?: string;
  input_mapping?: string;
  output_mapping?: string;
  cache_results?: boolean;
  timeout_seconds?: number;
}

// Tool call types
const TOOL_CALL_TYPES = [
  { value: 'internal', label: 'Internal Tool', description: 'Call a tool defined within this workflow' },
  { value: 'external', label: 'External Tool', description: 'Call a tool hosted on an external service' },
  { value: 'api', label: 'API Tool', description: 'Call a tool through a REST API' },
  { value: 'function', label: 'Function Tool', description: 'Execute a custom JavaScript function' },
];

/**
 * Component for configuring a tool call operator
 */
const ToolCallOperatorConfig: React.FC<ToolCallOperatorConfigProps> = ({
  config,
  onConfigChange
}) => {
  // Cast config to extended type for UI properties
  const extendedConfig = config as ExtendedToolCallConfig;
  
  const handleChange = (field: keyof ExtendedToolCallConfig, value: any) => {
    onConfigChange({
      ...extendedConfig,
      [field]: value
    } as ToolCallConfig);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Tool Call Configuration
      </Typography>
      
      <FormField
        label="Tool Call Type"
        required
        helperText="Type of tool call to make"
      >
        <FormControl fullWidth size="small">
          <Select
            value={extendedConfig.call_type || 'internal'}
            onChange={(e) => handleChange('call_type', e.target.value)}
          >
            {TOOL_CALL_TYPES.map(type => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          {TOOL_CALL_TYPES.find(t => t.value === (extendedConfig.call_type || 'internal'))?.description}
        </Typography>
      </FormField>
      
      {extendedConfig.call_type === 'internal' && (
        <FormField
          label="Tool ID"
          required
          helperText="ID of the tool node in this workflow"
        >
          <TextField
            fullWidth
            value={extendedConfig.tool_id || ''}
            onChange={(e) => handleChange('tool_id', e.target.value)}
            size="small"
            placeholder="tool_123"
          />
        </FormField>
      )}
      
      {extendedConfig.call_type === 'external' && (
        <>
          <FormField
            label="Tool URL"
            required
            helperText="URL of the external tool service"
          >
            <TextField
              fullWidth
              value={extendedConfig.tool_url || ''}
              onChange={(e) => handleChange('tool_url', e.target.value)}
              size="small"
              placeholder="https://example.com/tools/calculator"
            />
          </FormField>
          
          <FormField
            label="Authentication Header"
            helperText="Optional authentication header for the tool service"
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
      
      {extendedConfig.call_type === 'api' && (
        <>
          <FormField
            label="API Endpoint"
            required
            helperText="REST API endpoint for the tool"
          >
            <TextField
              fullWidth
              value={extendedConfig.api_endpoint || ''}
              onChange={(e) => handleChange('api_endpoint', e.target.value)}
              size="small"
              placeholder="https://api.example.com/v1/tools/execute"
            />
          </FormField>
          
          <FormField
            label="API Key"
            helperText="API key for authentication (will be stored securely)"
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
            required
            helperText="HTTP method for the API request"
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
      
      {extendedConfig.call_type === 'function' && (
        <FormField
          label="Function Definition"
          required
          helperText="JavaScript function to execute when this tool is called"
        >
          <CodeEditor
            code={extendedConfig.function_definition || 'function execute(params, state) {\n  // Example: Perform a calculation\n  const result = params.a + params.b;\n  return {\n    result: result\n  };\n}'}
            onCodeChange={(code) => handleChange('function_definition', code)}
            language="javascript"
            height="150px"
          />
        </FormField>
      )}
      
      <FormField
        label="Input Mapping"
        helperText="JavaScript code to map workflow state to tool input parameters"
      >
        <CodeEditor
          code={extendedConfig.input_mapping || 'function mapInput(state) {\n  // Example: Extract relevant fields for the tool\n  return {\n    a: state.value_a || 0,\n    b: state.value_b || 0\n  };\n}'}
          onCodeChange={(code) => handleChange('input_mapping', code)}
          language="javascript"
          height="150px"
        />
      </FormField>
      
      <FormField
        label="Output Mapping"
        helperText="JavaScript code to map tool output back to workflow state"
      >
        <CodeEditor
          code={extendedConfig.output_mapping || 'function mapOutput(toolOutput, state) {\n  // Example: Merge tool result into state\n  return {\n    ...state,\n    tool_result: toolOutput.result\n  };\n}'}
          onCodeChange={(code) => handleChange('output_mapping', code)}
          language="javascript"
          height="150px"
        />
      </FormField>
      
      <FormField label="Caching Options">
        <FormControlLabel
          control={
            <Checkbox
              checked={extendedConfig.cache_results || false}
              onChange={(e) => handleChange('cache_results', e.target.checked)}
            />
          }
          label="Cache Results"
        />
        <Typography variant="caption" color="text.secondary" display="block">
          Cache tool results to avoid redundant calls with the same parameters
        </Typography>
      </FormField>
      
      <FormField
        label="Timeout (seconds)"
        helperText="Maximum time to wait for the tool response"
      >
        <TextField
          fullWidth
          type="number"
          value={extendedConfig.timeout_seconds || ''}
          onChange={(e) => handleChange('timeout_seconds', e.target.value ? parseInt(e.target.value) : undefined)}
          size="small"
          inputProps={{ min: 0 }}
          placeholder="10"
        />
      </FormField>
    </Box>
  );
};

export default ToolCallOperatorConfig;
