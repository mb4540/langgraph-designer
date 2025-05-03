import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { MemoryWriteOperatorConfig as MemoryWriteConfig } from '../../../../types/nodeTypes';
import { useWorkflowContext } from '../../../../context/WorkflowContext';
import { FormField } from '../common';
import { CodeEditor } from '../common';

interface MemoryWriteOperatorConfigProps {
  config: MemoryWriteConfig;
  onConfigChange: (config: MemoryWriteConfig) => void;
}

// Memory write modes
const MEMORY_WRITE_MODES = [
  { value: 'set', label: 'Set Value', description: 'Set a specific key in memory' },
  { value: 'append', label: 'Append to List', description: 'Append to an existing list in memory' },
  { value: 'update', label: 'Update Object', description: 'Update fields in an existing object in memory' },
  { value: 'custom', label: 'Custom Function', description: 'Use a custom function to write to memory' },
  { value: 'batch', label: 'Batch Write', description: 'Write multiple values to memory at once' }
];

/**
 * Component for configuring a memory write operator
 */
const MemoryWriteOperatorConfig: React.FC<MemoryWriteOperatorConfigProps> = ({
  config,
  onConfigChange
}) => {
  const { nodes } = useWorkflowContext();
  
  const handleChange = (field: keyof MemoryWriteConfig, value: any) => {
    onConfigChange({
      ...config,
      [field]: value
    });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Memory Write Configuration
      </Typography>
      
      <FormField
        label="Memory Node"
        required
        helperText="Memory node to write to"
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
        label="Write Mode"
        required
        helperText="How to write to memory"
      >
        <FormControl fullWidth size="small">
          <Select
            value={config.write_mode || 'set'}
            onChange={(e) => handleChange('write_mode', e.target.value)}
          >
            {MEMORY_WRITE_MODES.map(mode => (
              <MenuItem key={mode.value} value={mode.value}>
                {mode.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          {MEMORY_WRITE_MODES.find(m => m.value === (config.write_mode || 'set'))?.description}
        </Typography>
      </FormField>
      
      {(config.write_mode === 'set' || config.write_mode === 'append' || config.write_mode === 'update') && (
        <FormField
          label="Memory Key"
          required
          helperText="Key to write to in memory"
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
      
      {config.write_mode === 'set' && (
        <FormField
          label="Value Mapping"
          required
          helperText="JavaScript expression to determine the value to store"
        >
          <CodeEditor
            value={config.value_mapping || 'function getValue(state) {\n  // Example: Store a specific value from state\n  return state.current_message;\n}'}
            onChange={(value) => handleChange('value_mapping', value)}
            language="javascript"
            height="120px"
          />
        </FormField>
      )}
      
      {config.write_mode === 'append' && (
        <>
          <FormField
            label="Value to Append"
            required
            helperText="JavaScript expression for the value to append"
          >
            <CodeEditor
              value={config.value_to_append || 'function getValueToAppend(state) {\n  // Example: Format a message to append\n  return {\n    role: "user",\n    content: state.user_message,\n    timestamp: new Date().toISOString()\n  };\n}'}
              onChange={(value) => handleChange('value_to_append', value)}
              language="javascript"
              height="150px"
            />
          </FormField>
          
          <FormField>
            <FormControlLabel
              control={
                <Checkbox
                  checked={config.create_if_missing || true}
                  onChange={(e) => handleChange('create_if_missing', e.target.checked)}
                />
              }
              label="Create List if Missing"
            />
            <Typography variant="caption" color="text.secondary" display="block">
              Create a new list if the key doesn't exist yet
            </Typography>
          </FormField>
          
          <FormField
            label="Max List Size"
            helperText="Maximum number of items to keep in the list (0 = unlimited)"
          >
            <TextField
              fullWidth
              type="number"
              value={config.max_list_size || ''}
              onChange={(e) => handleChange('max_list_size', e.target.value ? parseInt(e.target.value) : undefined)}
              size="small"
              inputProps={{ min: 0 }}
              placeholder="100"
            />
          </FormField>
        </>
      )}
      
      {config.write_mode === 'update' && (
        <>
          <FormField
            label="Update Fields"
            required
            helperText="JavaScript expression for the fields to update"
          >
            <CodeEditor
              value={config.update_fields || 'function getUpdateFields(state) {\n  // Example: Update specific fields in an object\n  return {\n    last_modified: new Date().toISOString(),\n    status: state.current_status,\n    count: (state.memory_data?.count || 0) + 1\n  };\n}'}
              onChange={(value) => handleChange('update_fields', value)}
              language="javascript"
              height="150px"
            />
          </FormField>
          
          <FormField>
            <FormControlLabel
              control={
                <Checkbox
                  checked={config.create_if_missing || false}
                  onChange={(e) => handleChange('create_if_missing', e.target.checked)}
                />
              }
              label="Create Object if Missing"
            />
            <Typography variant="caption" color="text.secondary" display="block">
              Create a new object if the key doesn't exist yet
            </Typography>
          </FormField>
        </>
      )}
      
      {config.write_mode === 'custom' && (
        <FormField
          label="Custom Write Function"
          required
          helperText="JavaScript function to handle the memory write operation"
        >
          <CodeEditor
            value={config.custom_write_function || 'function writeToMemory(memory, state) {\n  // Example: Custom memory write logic\n  const timestamp = new Date().toISOString();\n  \n  // Update conversation history\n  if (!memory.conversation_history) {\n    memory.conversation_history = [];\n  }\n  \n  memory.conversation_history.push({\n    role: "user",\n    content: state.user_message,\n    timestamp\n  });\n  \n  // Limit history size\n  if (memory.conversation_history.length > 50) {\n    memory.conversation_history = memory.conversation_history.slice(-50);\n  }\n  \n  // Update metadata\n  memory.metadata = {\n    ...memory.metadata || {},\n    last_updated: timestamp,\n    message_count: (memory.metadata?.message_count || 0) + 1\n  };\n  \n  return memory;\n}'}
            onChange={(value) => handleChange('custom_write_function', value)}
            language="javascript"
            height="300px"
          />
        </FormField>
      )}
      
      {config.write_mode === 'batch' && (
        <FormField
          label="Batch Entries"
          required
          helperText="JavaScript function returning an object with keys and values to write"
        >
          <CodeEditor
            value={config.batch_entries || 'function getBatchEntries(state) {\n  // Example: Write multiple entries at once\n  return {\n    "user_profile": state.user_data,\n    "session_info": {\n      start_time: state.session_start,\n      last_active: new Date().toISOString()\n    },\n    "interaction_count": (state.memory_data?.interaction_count || 0) + 1\n  };\n}'}
            onChange={(value) => handleChange('batch_entries', value)}
            language="javascript"
            height="200px"
          />
        </FormField>
      )}
      
      <FormField>
        <FormControlLabel
          control={
            <Checkbox
              checked={config.persist || true}
              onChange={(e) => handleChange('persist', e.target.checked)}
            />
          }
          label="Persist to Storage"
        />
        <Typography variant="caption" color="text.secondary" display="block">
          Ensure memory is persisted to long-term storage
        </Typography>
      </FormField>
      
      <FormField>
        <FormControlLabel
          control={
            <Checkbox
              checked={config.return_updated_value || false}
              onChange={(e) => handleChange('return_updated_value', e.target.checked)}
            />
          }
          label="Return Updated Value"
        />
        <Typography variant="caption" color="text.secondary" display="block">
          Include the updated memory value in the workflow state
        </Typography>
      </FormField>
      
      {config.return_updated_value && (
        <FormField
          label="Result Key"
          required
          helperText="State key to store the updated memory value"
        >
          <TextField
            fullWidth
            value={config.result_key || ''}
            onChange={(e) => handleChange('result_key', e.target.value)}
            size="small"
            placeholder="updated_memory"
          />
        </FormField>
      )}
    </Box>
  );
};

export default MemoryWriteOperatorConfig;
