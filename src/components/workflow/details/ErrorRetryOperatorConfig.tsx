import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { ErrorRetryOperatorConfig as ErrorRetryConfig } from '../../../types/nodeTypes';
import { useWorkflowContext } from '../../../context/WorkflowContext';

interface ErrorRetryOperatorConfigProps {
  config: ErrorRetryConfig;
  setConfig: (config: ErrorRetryConfig) => void;
}

const ErrorRetryOperatorConfig: React.FC<ErrorRetryOperatorConfigProps> = ({
  config,
  setConfig
}) => {
  const { nodes } = useWorkflowContext();
  const [newErrorType, setNewErrorType] = useState('');
  
  const handleChange = (field: keyof ErrorRetryConfig, value: any) => {
    setConfig({
      ...config,
      [field]: value
    });
  };

  const handleAddErrorType = () => {
    if (!newErrorType) return;
    
    const updatedErrors = [...(config.retryable_errors || [])];
    if (!updatedErrors.includes(newErrorType)) {
      updatedErrors.push(newErrorType);
      handleChange('retryable_errors', updatedErrors);
    }
    setNewErrorType('');
  };

  const handleRemoveErrorType = (error: string) => {
    const updatedErrors = [...(config.retryable_errors || [])];
    const index = updatedErrors.indexOf(error);
    if (index !== -1) {
      updatedErrors.splice(index, 1);
      handleChange('retryable_errors', updatedErrors);
    }
  };

  return (
    <Box>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Error Retry Configuration
        </Typography>
        
        <TextField
          fullWidth
          label="Max Attempts"
          type="number"
          value={config.max_attempts || ''}
          onChange={(e) => handleChange('max_attempts', e.target.value ? parseInt(e.target.value) : undefined)}
          margin="normal"
          variant="outlined"
          inputProps={{ min: 1 }}
          required
          helperText="Maximum number of retry attempts"
        />
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="backoff-strategy-label">Backoff Strategy</InputLabel>
          <Select
            labelId="backoff-strategy-label"
            value={config.backoff_strategy || 'fixed'}
            label="Backoff Strategy"
            onChange={(e) => handleChange('backoff_strategy', e.target.value)}
          >
            <MenuItem value="fixed">Fixed</MenuItem>
            <MenuItem value="exponential">Exponential</MenuItem>
            <MenuItem value="jitter">Jitter</MenuItem>
          </Select>
          <Typography variant="caption" color="text.secondary">
            Strategy for increasing delay between retry attempts
          </Typography>
        </FormControl>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" gutterBottom>
          Retryable Error Types
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {(config.retryable_errors || []).map(error => (
            <Chip
              key={error}
              label={error}
              onDelete={() => handleRemoveErrorType(error)}
            />
          ))}
          {(config.retryable_errors || []).length === 0 && (
            <Typography variant="caption" color="text.secondary">
              No error types defined. Add error types to specify which errors should trigger retries.
            </Typography>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', mb: 2 }}>
          <TextField
            label="Error Type"
            value={newErrorType}
            onChange={(e) => setNewErrorType(e.target.value)}
            placeholder="e.g., TimeoutError, ConnectionError"
            sx={{ flex: 1, mr: 1 }}
          />
          <Button 
            variant="outlined" 
            onClick={handleAddErrorType}
            disabled={!newErrorType}
          >
            Add
          </Button>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="failure-node-label">On Failure Node</InputLabel>
          <Select
            labelId="failure-node-label"
            value={config.on_failure_node || ''}
            label="On Failure Node"
            onChange={(e) => handleChange('on_failure_node', e.target.value)}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {nodes.map(node => (
              <MenuItem key={node.id} value={node.id}>
                {node.name || `${node.type} ${node.id.slice(0, 8)}`}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="caption" color="text.secondary">
            Fallback node to execute when all retries are exhausted
          </Typography>
        </FormControl>
      </Paper>
    </Box>
  );
};

export default ErrorRetryOperatorConfig;
