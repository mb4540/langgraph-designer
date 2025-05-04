import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { ParallelJoinOperatorConfig as ParallelJoinConfig, OperatorType } from '../../../../types/nodeTypes';
import { useWorkflowContext } from '../../../../context/WorkflowContext';
import { FormField } from '../common';
import { CodeEditor } from '../common';

interface ParallelJoinOperatorConfigProps {
  config: ParallelJoinConfig;
  onConfigChange: (config: ParallelJoinConfig) => void;
}

// Extended config interface with UI-specific properties
interface ExtendedParallelJoinConfig extends ParallelJoinConfig {
  fork_node_id?: string;
  join_strategy?: 'merge' | 'array' | 'custom' | 'last_only';
  custom_join_function?: string;
  result_key?: string;
  continue_on_error?: boolean;
  min_success_count?: number;
}

// Join strategy options
const JOIN_STRATEGIES = [
  { value: 'merge', label: 'Merge Results', description: 'Combine all branch results into a single object' },
  { value: 'array', label: 'Array of Results', description: 'Collect all branch results into an array' },
  { value: 'custom', label: 'Custom Join Function', description: 'Use a custom function to join results' },
  { value: 'last_only', label: 'Last Result Only', description: 'Use only the result from the last completed branch' }
];

/**
 * Component for configuring a parallel join operator
 */
const ParallelJoinOperatorConfig: React.FC<ParallelJoinOperatorConfigProps> = ({
  config,
  onConfigChange
}) => {
  const { nodes } = useWorkflowContext();
  
  // Cast config to extended type for UI properties
  const extendedConfig = config as ExtendedParallelJoinConfig;
  
  const handleChange = (field: keyof ExtendedParallelJoinConfig, value: any) => {
    onConfigChange({
      ...extendedConfig,
      [field]: value
    } as ParallelJoinConfig);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Parallel Join Configuration
      </Typography>
      
      <FormField
        label="Fork Node ID"
        helperText="ID of the parallel fork node that initiated the branches"
      >
        <FormControl fullWidth size="small">
          <Select
            value={extendedConfig.fork_node_id || ''}
            onChange={(e) => handleChange('fork_node_id', e.target.value)}
            displayEmpty
          >
            <MenuItem value=""><em>Select a fork node</em></MenuItem>
            {nodes
              .filter(node => node.operatorType === OperatorType.ParallelFork)
              .map(node => (
                <MenuItem key={node.id} value={node.id}>
                  {node.name || `Fork ${node.id.slice(0, 8)}`}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </FormField>
      
      <FormField
        label="Join Strategy"
        required
        helperText="How to combine results from parallel branches"
      >
        <FormControl fullWidth size="small">
          <Select
            value={extendedConfig.join_strategy || 'merge'}
            onChange={(e) => handleChange('join_strategy', e.target.value)}
          >
            {JOIN_STRATEGIES.map(strategy => (
              <MenuItem key={strategy.value} value={strategy.value}>
                {strategy.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          {JOIN_STRATEGIES.find(s => s.value === (extendedConfig.join_strategy || 'merge'))?.description}
        </Typography>
      </FormField>
      
      {extendedConfig.join_strategy === 'custom' && (
        <FormField
          label="Custom Join Function"
          required
          helperText="JavaScript function that takes an array of branch results and returns a combined result"
        >
          <CodeEditor
            code={extendedConfig.custom_join_function || 'function joinResults(branchResults) {\n  // Example: merge all results\n  return Object.assign({}, ...branchResults);\n}'}
            onCodeChange={(code) => handleChange('custom_join_function', code)}
            language="javascript"
            height="150px"
          />
        </FormField>
      )}
      
      <FormField
        label="Result Key"
        helperText="Optional key to store the joined results in the state object"
      >
        <TextField
          fullWidth
          value={extendedConfig.result_key || ''}
          onChange={(e) => handleChange('result_key', e.target.value)}
          size="small"
          placeholder="parallel_results"
        />
      </FormField>
      
      <FormField label="Error Handling">
        <FormControlLabel
          control={
            <Checkbox
              checked={extendedConfig.continue_on_error || false}
              onChange={(e) => handleChange('continue_on_error', e.target.checked)}
            />
          }
          label="Continue on Error"
        />
        <Typography variant="caption" color="text.secondary" display="block">
          Continue execution even if some branches fail
        </Typography>
      </FormField>
      
      <FormField
        label="Minimum Success Count"
        helperText="Minimum number of branches that must complete successfully (0 = no minimum)"
      >
        <TextField
          fullWidth
          type="number"
          value={extendedConfig.min_success_count || ''}
          onChange={(e) => handleChange('min_success_count', e.target.value ? parseInt(e.target.value) : undefined)}
          size="small"
          inputProps={{ min: 0 }}
          placeholder="0"
        />
      </FormField>
    </Box>
  );
};

export default ParallelJoinOperatorConfig;
