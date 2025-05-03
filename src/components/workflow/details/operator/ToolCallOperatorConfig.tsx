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
  const handleChange = (field: keyof ToolCallConfig, value: any) => {
    onConfigChange({
      ...config,
      [field]: value
    });
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
            value={config.call_type || 'internal'}
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
          {TOOL_CALL_TYPES.find(t => t.value === (config.call_type || 'internal'))?.description}
        </Typography>
      </FormField>
      
      {config.call_type === 'internal' && (
        <FormField
          label="Tool ID"
          required
          helperText="ID of the tool node in this workflow"
        >
          <TextField
            fullWidth
            value={config.tool_id || ''}
            onChange={(e) => handleChange('tool_id', e.target.value)}
            size="small"
            placeholder="tool_123"
          />
        </FormField>
      )}
      
      {config.call_type === 'external' && (
        <>
          <FormField
            label="Tool URL"
            required
            helperText="URL of the external tool service"
          >
            <TextField
              fullWidth
              value={config.tool_url || ''}
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
              value={config.auth_header || ''}
              onChange={(e) => handleChange('auth_header', e.target.value)}
              size="small"
              placeholder="Bearer token123"
            />
          </FormField>
        </>
      )}
      
      {config.call_type === 'api' && (
        <>
          <FormField
            label="API Endpoint"
            required
            helperText="REST API endpoint for the tool"
          >
            <TextField
              fullWidth
              value={config.api_endpoint || ''}
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
      
      {config.call_type === 'function' && (
        <FormField
          label="Function Definition"
          required
          helperText="JavaScript function to execute when this tool is called"
        >
          <CodeEditor
            value={config.function_definition || 'function execute(params, state) {\n  // Example: Perform a calculation\n  const result = params.a + params.b;\n  return {\n    result: result\n  };\n}'}
            onChange={(value) => handleChange('function_definition', value)}
            language="javascript"
            height="150px"
          />
        </FormField>
      )}
      
      <FormField
        label="Tool Name"
        required
        helperText="Name of the tool to call"
      >
        <TextField
          fullWidth
          value={config.tool_name || ''}
          onChange={(e) => handleChange('tool_name', e.target.value)}
          size="small"
          placeholder="calculator"
        />
      </FormField>
      
      <FormField
        label="Input Mapping"
        helperText="JavaScript code to map workflow state to tool input parameters"
      >
        <CodeEditor
          value={config.input_mapping || 'function mapInput(state) {\n  // Example: Extract relevant fields for the tool\n  return {\n    a: state.value_a || 0,\n    b: state.value_b || 0\n  };\n}'}
          onChange={(value) => handleChange('input_mapping', value)}
          language="javascript"
          height="150px"
        />
      </FormField>
      
      <FormField
        label="Output Mapping"
        helperText="JavaScript code to map tool output back to workflow state"
      >
        <CodeEditor
          value={config.output_mapping || 'function mapOutput(toolOutput, state) {\n  // Example: Merge tool result into state\n  return {\n    ...state,\n    tool_result: toolOutput.result\n  };\n}'}
          onChange={(value) => handleChange('output_mapping', value)}
          language="javascript"
          height="150px"
        />
      </FormField>
      
      <FormField>
        <FormControlLabel
          control={
            <Checkbox
              checked={config.cache_results || false}
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
          value={config.timeout_seconds || ''}
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
