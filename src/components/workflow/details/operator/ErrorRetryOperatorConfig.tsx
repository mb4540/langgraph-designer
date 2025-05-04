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
import { FormField, FormFieldWrapper, CodeEditor } from '../common';

interface ErrorRetryOperatorConfigProps {
  config: ErrorRetryConfig;
  onConfigChange: (config: ErrorRetryConfig) => void;
}

// Extended config interface with UI-specific properties
interface ExtendedErrorRetryConfig extends ErrorRetryConfig {
  retry_strategy?: 'fixed' | 'exponential' | 'linear' | 'random' | 'custom';
  max_retries?: number;
  initial_delay_seconds?: number;
  backoff_factor?: number;
  min_delay_seconds?: number;
  max_delay_seconds?: number;
  custom_retry_function?: string;
  retry_all_errors?: boolean;
  retryable_error_types?: string[];
  on_max_retries_exceeded?: string;
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
  // Cast config to extended type for UI properties
  const extendedConfig = config as ExtendedErrorRetryConfig;
  
  const handleChange = (field: keyof ExtendedErrorRetryConfig, value: any) => {
    onConfigChange({
      ...extendedConfig,
      [field]: value
    } as ErrorRetryConfig);
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
          value={extendedConfig.max_retries || ''}
          onChange={(e) => handleChange('max_retries', e.target.value ? parseInt(e.target.value) : undefined)}
          size="small"
          inputProps={{ min: 1 }}
          placeholder="3"
        />
      </FormFieldWrapper>
      
      <FormFieldWrapper
        label="Retry Strategy"
        required
        helperText="Strategy to use for timing retries"
      >
        <FormControl fullWidth size="small">
          <Select
            value={extendedConfig.retry_strategy || 'fixed'}
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
          {RETRY_STRATEGIES.find(s => s.value === (extendedConfig.retry_strategy || 'fixed'))?.description}
        </Typography>
      </FormFieldWrapper>
      
      {extendedConfig.retry_strategy !== 'custom' && (
        <FormFieldWrapper
          label="Initial Delay (seconds)"
          required
          helperText="Time to wait before first retry"
        >
          <TextField
            fullWidth
            type="number"
            value={extendedConfig.initial_delay_seconds || ''}
            onChange={(e) => handleChange('initial_delay_seconds', e.target.value ? parseFloat(e.target.value) : undefined)}
            size="small"
            inputProps={{ min: 0, step: 0.1 }}
            placeholder="1"
          />
        </FormFieldWrapper>
      )}
      
      {(extendedConfig.retry_strategy === 'exponential' || extendedConfig.retry_strategy === 'linear') && (
        <FormFieldWrapper
          label="Backoff Factor"
          required
          helperText={extendedConfig.retry_strategy === 'exponential' 
            ? 'Factor by which to multiply delay after each retry'
            : 'Amount to add to delay after each retry (seconds)'}
        >
          <TextField
            fullWidth
            type="number"
            value={extendedConfig.backoff_factor || ''}
            onChange={(e) => handleChange('backoff_factor', e.target.value ? parseFloat(e.target.value) : undefined)}
            size="small"
            inputProps={{ min: extendedConfig.retry_strategy === 'exponential' ? 1 : 0, step: 0.1 }}
            placeholder={extendedConfig.retry_strategy === 'exponential' ? '2' : '1'}
          />
        </FormFieldWrapper>
      )}
      
      {extendedConfig.retry_strategy === 'random' && (
        <>
          <FormFieldWrapper
            label="Minimum Delay (seconds)"
            required
            helperText="Minimum time to wait between retries"
          >
            <TextField
              fullWidth
              type="number"
              value={extendedConfig.min_delay_seconds || ''}
              onChange={(e) => handleChange('min_delay_seconds', e.target.value ? parseFloat(e.target.value) : undefined)}
              size="small"
              inputProps={{ min: 0, step: 0.1 }}
              placeholder="1"
            />
          </FormFieldWrapper>
          
          <FormFieldWrapper
            label="Maximum Delay (seconds)"
            required
            helperText="Maximum time to wait between retries"
          >
            <TextField
              fullWidth
              type="number"
              value={extendedConfig.max_delay_seconds || ''}
              onChange={(e) => handleChange('max_delay_seconds', e.target.value ? parseFloat(e.target.value) : undefined)}
              size="small"
              inputProps={{ min: 0, step: 0.1 }}
              placeholder="5"
            />
          </FormFieldWrapper>
        </>
      )}
      
      {extendedConfig.retry_strategy === 'custom' && (
        <FormFieldWrapper
          label="Custom Retry Function"
          required
          helperText="JavaScript function that returns delay in seconds based on retry count"
        >
          <CodeEditor
            code={extendedConfig.custom_retry_function || 'function calculateDelay(retryCount) {\n  // Example: exponential backoff with jitter\n  const baseDelay = 1;  // 1 second\n  const maxDelay = 60;  // 60 seconds\n  const exponentialDelay = baseDelay * Math.pow(2, retryCount);\n  const jitter = Math.random() * 0.5 * exponentialDelay;\n  return Math.min(maxDelay, exponentialDelay + jitter);\n}'}
            onCodeChange={(code) => handleChange('custom_retry_function', code)}
            language="javascript"
            height="150px"
          />
        </FormFieldWrapper>
      )}
      
      <FormFieldWrapper
        label="Maximum Delay (seconds)"
        helperText="Maximum time to wait between any retries (0 = no maximum)"
      >
        <TextField
          fullWidth
          type="number"
          value={extendedConfig.max_delay_seconds || ''}
          onChange={(e) => handleChange('max_delay_seconds', e.target.value ? parseFloat(e.target.value) : undefined)}
          size="small"
          inputProps={{ min: 0, step: 0.1 }}
          placeholder="60"
        />
      </FormFieldWrapper>
      
      <FormField label="Retry All Errors">
        <FormControlLabel
          control={
            <Checkbox
              checked={extendedConfig.retry_all_errors || false}
              onChange={(e) => handleChange('retry_all_errors', e.target.checked)}
            />
          }
          label="Retry All Errors"
        />
      </FormField>
      
      {!extendedConfig.retry_all_errors && (
        <FormFieldWrapper
          label="Retryable Error Types"
          helperText="Comma-separated list of error types to retry (e.g., 'NetworkError, TimeoutError')"
        >
          <TextField
            fullWidth
            value={(extendedConfig.retryable_error_types || []).join(', ')}
            onChange={(e) => handleChange('retryable_error_types', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
            size="small"
            placeholder="NetworkError, TimeoutError, RateLimitError"
          />
        </FormFieldWrapper>
      )}
      
      <FormFieldWrapper
        label="On Max Retries Exceeded"
        helperText="JavaScript code to execute when maximum retries are exceeded"
      >
        <CodeEditor
          code={extendedConfig.on_max_retries_exceeded || ''}
          onCodeChange={(code) => handleChange('on_max_retries_exceeded', code)}
          language="javascript"
          height="100px"
          placeholder="// Example: Log error and set status\nstate.error_status = 'max_retries_exceeded';\nstate.last_error = error;\nreturn state;"
        />
      </FormFieldWrapper>
      
      {/* Map UI fields to actual ErrorRetryConfig properties */}
      <Box sx={{ display: 'none' }}>
        {(() => {
          // Update the actual ErrorRetryConfig properties based on UI fields
          handleChange('max_attempts', extendedConfig.max_retries);
          
          if (extendedConfig.retry_strategy) {
            handleChange('backoff_strategy', extendedConfig.retry_strategy === 'custom' ? 'fixed' : extendedConfig.retry_strategy);
          }
          
          if (!extendedConfig.retry_all_errors && extendedConfig.retryable_error_types) {
            handleChange('retryable_errors', extendedConfig.retryable_error_types);
          }
          
          return null;
        })()}
      </Box>
    </Box>
  );
};

export default ErrorRetryOperatorConfig;
