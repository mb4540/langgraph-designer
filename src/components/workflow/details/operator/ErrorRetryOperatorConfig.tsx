import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { ErrorRetryOperatorConfig as ErrorRetryConfig } from '../../../../types/nodeTypes';
import { FormFieldWrapper, CodeEditor } from '../common';

interface ErrorRetryOperatorConfigProps {
  config: ErrorRetryConfig;
  onConfigChange: (config: ErrorRetryConfig) => void;
}

// Retry strategy options
const RETRY_STRATEGIES = [
  { value: 'fixed', label: 'Fixed Delay', description: 'Wait a fixed amount of time between retries' },
  { value: 'exponential', label: 'Exponential Backoff', description: 'Increase the delay exponentially between retries' },
  { value: 'linear', label: 'Linear Backoff', description: 'Increase the delay linearly between retries' },
  { value: 'random', label: 'Random Jitter', description: 'Use a random delay between min and max values' },
  { value: 'custom', label: 'Custom Function', description: 'Use a custom function to determine retry timing' }
];

/**
 * Component for configuring an error retry operator
 */
const ErrorRetryOperatorConfig: React.FC<ErrorRetryOperatorConfigProps> = ({
  config,
  onConfigChange
}) => {
  const handleChange = (field: keyof ErrorRetryConfig, value: any) => {
    onConfigChange({
      ...config,
      [field]: value
    });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Error Retry Configuration
      </Typography>
      
      <FormFieldWrapper
        label="Maximum Retries"
        required
        helperText="Maximum number of retry attempts"
      >
        <TextField
          fullWidth
          type="number"
          value={config.max_retries || ''}
          onChange={(e) => handleChange('max_retries', e.target.value ? parseInt(e.target.value) : undefined)}
          size="small"
          inputProps={{ min: 1 }}
          placeholder="3"
        />
      </FormFieldWrapper>
      
      <FormFieldWrapper
        label="Retry Strategy"
        required
        helperText="Strategy for timing between retry attempts"
      >
        <FormControl fullWidth size="small">
          <Select
            value={config.retry_strategy || 'fixed'}
            onChange={(e) => handleChange('retry_strategy', e.target.value)}
          >
            {RETRY_STRATEGIES.map(strategy => (
              <MenuItem key={strategy.value} value={strategy.value}>
                {strategy.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          {RETRY_STRATEGIES.find(s => s.value === (config.retry_strategy || 'fixed'))?.description}
        </Typography>
      </FormFieldWrapper>
      
      {config.retry_strategy !== 'custom' && (
        <FormFieldWrapper
          label="Initial Delay (seconds)"
          required
          helperText="Time to wait before the first retry"
        >
          <TextField
            fullWidth
            type="number"
            value={config.initial_delay_seconds || ''}
            onChange={(e) => handleChange('initial_delay_seconds', e.target.value ? parseFloat(e.target.value) : undefined)}
            size="small"
            inputProps={{ min: 0, step: 0.1 }}
            placeholder="1"
          />
        </FormFieldWrapper>
      )}
      
      {(config.retry_strategy === 'exponential' || config.retry_strategy === 'linear') && (
        <FormFieldWrapper
          label="Backoff Factor"
          required
          helperText={config.retry_strategy === 'exponential' 
            ? 'Factor by which to multiply delay after each retry'
            : 'Amount to add to delay after each retry (seconds)'}
        >
          <TextField
            fullWidth
            type="number"
            value={config.backoff_factor || ''}
            onChange={(e) => handleChange('backoff_factor', e.target.value ? parseFloat(e.target.value) : undefined)}
            size="small"
            inputProps={{ min: config.retry_strategy === 'exponential' ? 1 : 0, step: 0.1 }}
            placeholder={config.retry_strategy === 'exponential' ? '2' : '1'}
          />
        </FormFieldWrapper>
      )}
      
      {config.retry_strategy === 'random' && (
        <>
          <FormFieldWrapper
            label="Minimum Delay (seconds)"
            required
            helperText="Minimum random delay between retries"
          >
            <TextField
              fullWidth
              type="number"
              value={config.min_delay_seconds || ''}
              onChange={(e) => handleChange('min_delay_seconds', e.target.value ? parseFloat(e.target.value) : undefined)}
              size="small"
              inputProps={{ min: 0, step: 0.1 }}
              placeholder="1"
            />
          </FormFieldWrapper>
          
          <FormFieldWrapper
            label="Maximum Delay (seconds)"
            required
            helperText="Maximum random delay between retries"
          >
            <TextField
              fullWidth
              type="number"
              value={config.max_delay_seconds || ''}
              onChange={(e) => handleChange('max_delay_seconds', e.target.value ? parseFloat(e.target.value) : undefined)}
              size="small"
              inputProps={{ min: 0, step: 0.1 }}
              placeholder="5"
            />
          </FormFieldWrapper>
        </>
      )}
      
      {config.retry_strategy === 'custom' && (
        <FormFieldWrapper
          label="Custom Retry Function"
          required
          helperText="JavaScript function that takes retry count and returns delay in seconds"
        >
          <CodeEditor
            value={config.custom_retry_function || 'function calculateDelay(retryCount) {\n  // Example: exponential backoff with jitter\n  const baseDelay = 1;  // 1 second\n  const maxDelay = 60;  // 60 seconds\n  const exponentialDelay = baseDelay * Math.pow(2, retryCount);\n  const jitter = Math.random() * 0.5 * exponentialDelay;\n  return Math.min(maxDelay, exponentialDelay + jitter);\n}'}
            onChange={(value) => handleChange('custom_retry_function', value)}
            language="javascript"
            height="150px"
          />
        </FormFieldWrapper>
      )}
      
      <FormFieldWrapper
        label="Maximum Delay (seconds)"
        helperText="Maximum delay between retries (caps exponential growth)"
      >
        <TextField
          fullWidth
          type="number"
          value={config.max_delay_seconds || ''}
          onChange={(e) => handleChange('max_delay_seconds', e.target.value ? parseFloat(e.target.value) : undefined)}
          size="small"
          inputProps={{ min: 0, step: 0.1 }}
          placeholder="60"
        />
      </FormFieldWrapper>
      
      <FormFieldWrapper>
        <FormControlLabel
          control={
            <Checkbox
              checked={config.retry_all_errors || false}
              onChange={(e) => handleChange('retry_all_errors', e.target.checked)}
            />
          }
          label="Retry All Errors"
        />
        <Typography variant="caption" color="text.secondary" display="block">
          Retry on any error (if unchecked, only retry on specified error types)
        </Typography>
      </FormFieldWrapper>
      
      {!config.retry_all_errors && (
        <FormFieldWrapper
          label="Retryable Error Types"
          helperText="Comma-separated list of error types to retry (e.g., 'NetworkError, TimeoutError')"
        >
          <TextField
            fullWidth
            value={(config.retryable_error_types || []).join(', ')}
            onChange={(e) => handleChange('retryable_error_types', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
            size="small"
            placeholder="NetworkError, TimeoutError, RateLimitError"
          />
        </FormFieldWrapper>
      )}
      
      <FormFieldWrapper
        label="On Max Retries Exceeded"
        helperText="JavaScript expression to execute when max retries are exceeded"
      >
        <CodeEditor
          value={config.on_max_retries_exceeded || ''}
          onChange={(value) => handleChange('on_max_retries_exceeded', value)}
          language="javascript"
          height="100px"
          placeholder="// Example: Log error and set status\nstate.error_status = 'max_retries_exceeded';\nstate.last_error = error;\nreturn state;"
        />
      </FormFieldWrapper>
    </Box>
  );
};

export default ErrorRetryOperatorConfig;
