import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { SubGraphOperatorConfig as SubGraphConfig } from '../../../../types/nodeTypes';
import { FormField } from '../common';
import { CodeEditor } from '../common';

interface SubGraphOperatorConfigProps {
  config: SubGraphConfig;
  onConfigChange: (config: SubGraphConfig) => void;
}

// Extended config interface with UI-specific properties
interface ExtendedSubGraphConfig extends Omit<SubGraphConfig, 'input_mapping' | 'output_mapping'> {
  // UI-specific properties that aren't in the base interface
  input_mapping?: string;
  output_mapping?: string;
  error_handler?: string;
  parameters?: Record<string, any>;
  workflow_id?: string;
  version?: string;
  isolate_state?: boolean;
}

/**
 * Component for configuring a sub-graph operator
 */
const SubGraphOperatorConfig: React.FC<SubGraphOperatorConfigProps> = ({
  config,
  onConfigChange
}) => {
  const [availableWorkflows] = useState([
    { id: 'workflow1', name: 'Customer Support Workflow' },
    { id: 'workflow2', name: 'Data Processing Pipeline' },
    { id: 'workflow3', name: 'Content Generation Flow' },
    { id: 'workflow4', name: 'Document Analysis Graph' },
  ]);
  
  // Cast config to extended type for UI properties
  const extendedConfig = config as ExtendedSubGraphConfig;
  
  const handleChange = (field: keyof ExtendedSubGraphConfig, value: any) => {
    onConfigChange({
      ...extendedConfig,
      [field]: value
    } as SubGraphConfig);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Sub-Graph Configuration
      </Typography>
      
      <FormField
        label="Workflow Reference"
        required
        helperText="Select an existing workflow to use as a sub-graph"
      >
        <FormControl fullWidth size="small">
          <Select
            value={extendedConfig.workflow_id || ''}
            onChange={(e) => handleChange('workflow_id', e.target.value)}
            displayEmpty
          >
            <MenuItem value=""><em>Select a workflow</em></MenuItem>
            {availableWorkflows.map(workflow => (
              <MenuItem key={workflow.id} value={workflow.id}>
                {workflow.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </FormField>
      
      <FormField
        label="Version"
        helperText="Optional specific version of the workflow to use"
      >
        <TextField
          fullWidth
          value={extendedConfig.version || ''}
          onChange={(e) => handleChange('version', e.target.value)}
          size="small"
          placeholder="latest"
        />
      </FormField>
      
      <FormField label="State Isolation">
        <FormControlLabel
          control={
            <Checkbox
              checked={extendedConfig.isolate_state ?? true}
              onChange={(e) => handleChange('isolate_state', e.target.checked)}
            />
          }
          label="Isolate State"
        />
        <Typography variant="caption" color="text.secondary" display="block">
          Run the sub-graph with its own isolated state
        </Typography>
      </FormField>
      
      <FormField
        label="Input Mapping"
        helperText="JavaScript code to map parent state to sub-graph input"
      >
        <CodeEditor
          code={extendedConfig.input_mapping || 'function mapInput(parentState) {\n  // Example: Pass specific fields to sub-graph\n  return {\n    query: parentState.user_query,\n    context: parentState.context\n  };\n}'}
          onCodeChange={(code) => handleChange('input_mapping', code)}
          language="javascript"
          height="150px"
        />
      </FormField>
      
      <FormField
        label="Output Mapping"
        helperText="JavaScript code to map sub-graph output back to parent state"
      >
        <CodeEditor
          code={extendedConfig.output_mapping || 'function mapOutput(subGraphOutput, parentState) {\n  // Example: Merge sub-graph results into parent state\n  return {\n    ...parentState,\n    sub_graph_result: subGraphOutput.result\n  };\n}'}
          onCodeChange={(code) => handleChange('output_mapping', code)}
          language="javascript"
          height="150px"
        />
      </FormField>
      
      <FormField
        label="Error Handler"
        helperText="JavaScript code to handle errors from the sub-graph"
      >
        <CodeEditor
          code={extendedConfig.error_handler || 'function handleError(error, parentState) {\n  // Example: Log error and continue\n  console.error("Sub-graph error:", error);\n  return {\n    ...parentState,\n    sub_graph_error: error.message\n  };\n}'}
          onCodeChange={(code) => handleChange('error_handler', code)}
          language="javascript"
          height="150px"
        />
      </FormField>
      
      <Paper variant="outlined" sx={{ p: 2, mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Sub-Graph Parameters
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Parameters (JSON)"
              multiline
              rows={4}
              value={extendedConfig.parameters ? JSON.stringify(extendedConfig.parameters, null, 2) : ''}
              onChange={(e) => {
                try {
                  const parsedParams = e.target.value ? JSON.parse(e.target.value) : {};
                  handleChange('parameters', parsedParams);
                } catch (error) {
                  // Don't update if JSON is invalid
                }
              }}
              size="small"
              placeholder='{"max_tokens": 1000, "temperature": 0.7}'
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => window.open(`/workflow/${extendedConfig.workflow_id}`, '_blank')}
          disabled={!extendedConfig.workflow_id}
        >
          Open Workflow
        </Button>
      </Box>
    </Box>
  );
};

export default SubGraphOperatorConfig;
