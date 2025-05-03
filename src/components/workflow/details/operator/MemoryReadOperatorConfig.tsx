import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { MemoryReadOperatorConfig as MemoryReadConfig } from '../../../../types/nodeTypes';
import { useWorkflowContext } from '../../../../context/WorkflowContext';
import { FormField } from '../common';
import { CodeEditor } from '../common';

interface MemoryReadOperatorConfigProps {
  config: MemoryReadConfig;
  onConfigChange: (config: MemoryReadConfig) => void;
}

// Memory read modes
const MEMORY_READ_MODES = [
  { value: 'exact', label: 'Exact Key', description: 'Read a specific key from memory' },
  { value: 'prefix', label: 'Key Prefix', description: 'Read all keys with a specific prefix' },
  { value: 'semantic', label: 'Semantic Search', description: 'Find semantically similar entries in memory' },
  { value: 'filter', label: 'Filter Function', description: 'Use a custom function to filter memory entries' },
  { value: 'latest', label: 'Latest Entries', description: 'Get the most recent entries from memory' }
];

/**
 * Component for configuring a memory read operator
 */
const MemoryReadOperatorConfig: React.FC<MemoryReadOperatorConfigProps> = ({
  config,
  onConfigChange
}) => {
  const { nodes } = useWorkflowContext();
  
  const handleChange = (field: keyof MemoryReadConfig, value: any) => {
    onConfigChange({
      ...config,
      [field]: value
    });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Memory Read Configuration
      </Typography>
      
      <FormField
        label="Memory Node"
        required
        helperText="Memory node to read from"
      >
        <FormControl fullWidth size="small">
          <Select
            value={config.memory_node_id || ''}
            onChange={(e) => handleChange('memory_node_id', e.target.value)}
            displayEmpty
          >
            <MenuItem value=""><em>Select a memory node</em></MenuItem>
            {nodes
              .filter(node => node.type === 'memory')
              .map(node => (
                <MenuItem key={node.id} value={node.id}>
                  {node.name || `Memory ${node.id.slice(0, 8)}`}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </FormField>
      
      <FormField
        label="Read Mode"
        required
        helperText="How to read from memory"
      >
        <FormControl fullWidth size="small">
          <Select
            value={config.read_mode || 'exact'}
            onChange={(e) => handleChange('read_mode', e.target.value)}
          >
            {MEMORY_READ_MODES.map(mode => (
              <MenuItem key={mode.value} value={mode.value}>
                {mode.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          {MEMORY_READ_MODES.find(m => m.value === (config.read_mode || 'exact'))?.description}
        </Typography>
      </FormField>
      
      {config.read_mode === 'exact' && (
        <FormField
          label="Memory Key"
          required
          helperText="Exact key to read from memory"
        >
          <TextField
            fullWidth
            value={config.memory_key || ''}
            onChange={(e) => handleChange('memory_key', e.target.value)}
            size="small"
            placeholder="conversation_history"
          />
        </FormField>
      )}
      
      {config.read_mode === 'prefix' && (
        <FormField
          label="Key Prefix"
          required
          helperText="Prefix to match memory keys against"
        >
          <TextField
            fullWidth
            value={config.key_prefix || ''}
            onChange={(e) => handleChange('key_prefix', e.target.value)}
            size="small"
            placeholder="user_"
          />
        </FormField>
      )}
      
      {config.read_mode === 'semantic' && (
        <>
          <FormField
            label="Query"
            required
            helperText="Semantic search query (can be a template using state values)"
          >
            <TextField
              fullWidth
              value={config.query || ''}
              onChange={(e) => handleChange('query', e.target.value)}
              size="small"
              placeholder="{{state.user_query}}"
            />
          </FormField>
          
          <FormField
            label="Max Results"
            helperText="Maximum number of results to return"
          >
            <TextField
              fullWidth
              type="number"
              value={config.max_results || ''}
              onChange={(e) => handleChange('max_results', e.target.value ? parseInt(e.target.value) : undefined)}
              size="small"
              inputProps={{ min: 1 }}
              placeholder="5"
            />
          </FormField>
          
          <FormField
            label="Similarity Threshold"
            helperText="Minimum similarity score (0-1) for results"
          >
            <TextField
              fullWidth
              type="number"
              value={config.similarity_threshold || ''}
              onChange={(e) => handleChange('similarity_threshold', e.target.value ? parseFloat(e.target.value) : undefined)}
              size="small"
              inputProps={{ min: 0, max: 1, step: 0.01 }}
              placeholder="0.7"
            />
          </TextField>
        </FormField>
        </>
      )}
      
      {config.read_mode === 'filter' && (
        <FormField
          label="Filter Function"
          required
          helperText="JavaScript function to filter memory entries"
        >
          <CodeEditor
            value={config.filter_function || 'function filterMemory(entry, state) {\n  // Example: Filter entries by date range\n  return entry.timestamp > state.start_date && entry.timestamp < state.end_date;\n}'}
            onChange={(value) => handleChange('filter_function', value)}
            language="javascript"
            height="150px"
          />
        </FormField>
      )}
      
      {config.read_mode === 'latest' && (
        <FormField
          label="Entry Count"
          required
          helperText="Number of most recent entries to retrieve"
        >
          <TextField
            fullWidth
            type="number"
            value={config.entry_count || ''}
            onChange={(e) => handleChange('entry_count', e.target.value ? parseInt(e.target.value) : undefined)}
            size="small"
            inputProps={{ min: 1 }}
            placeholder="10"
          />
        </FormField>
      )}
      
      <FormField
        label="Result Key"
        required
        helperText="State key to store the memory read results"
      >
        <TextField
          fullWidth
          value={config.result_key || ''}
          onChange={(e) => handleChange('result_key', e.target.value)}
          size="small"
          placeholder="memory_data"
        />
      </FormField>
      
      <FormField>
        <FormControlLabel
          control={
            <Checkbox
              checked={config.transform_result || false}
              onChange={(e) => handleChange('transform_result', e.target.checked)}
            />
          }
          label="Transform Result"
        />
        <Typography variant="caption" color="text.secondary" display="block">
          Apply a transformation function to the memory data before storing
        </Typography>
      </FormField>
      
      {config.transform_result && (
        <FormField
          label="Transform Function"
          required
          helperText="JavaScript function to transform memory data"
        >
          <CodeEditor
            value={config.transform_function || 'function transformMemory(memoryData, state) {\n  // Example: Format and combine memory entries\n  return {\n    formatted: memoryData.map(entry => `${entry.timestamp}: ${entry.content}`).join("\n"),\n    count: memoryData.length\n  };\n}'}
            onChange={(value) => handleChange('transform_function', value)}
            language="javascript"
            height="150px"
          />
        </FormField>
      )}
      
      <FormField>
        <FormControlLabel
          control={
            <Checkbox
              checked={config.fail_on_missing || false}
              onChange={(e) => handleChange('fail_on_missing', e.target.checked)}
            />
          }
          label="Fail on Missing Data"
        />
        <Typography variant="caption" color="text.secondary" display="block">
          Fail the operation if the requested memory data is not found
        </Typography>
      </FormField>
    </Box>
  );
};

export default MemoryReadOperatorConfig;
