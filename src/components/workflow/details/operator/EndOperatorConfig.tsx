import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { EndOperatorConfig as EndConfig } from '../../../../types/nodeTypes';
import { FormField } from '../common';

interface EndOperatorConfigProps {
  config: EndConfig;
  onConfigChange: (config: EndConfig) => void;
}

// Extended config interface with UI-specific properties
interface ExtendedEndConfig extends EndConfig {
  // UI-specific properties can be added here
  // All properties from EndConfig are already inherited
}

/**
 * Component for configuring an end operator
 */
const EndOperatorConfig: React.FC<EndOperatorConfigProps> = ({
  config,
  onConfigChange
}) => {
  // Cast config to extended type for UI properties
  const extendedConfig = config as ExtendedEndConfig;
  
  const handleChange = (field: keyof ExtendedEndConfig, value: any) => {
    onConfigChange({
      ...extendedConfig,
      [field]: value
    } as EndConfig);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        End Configuration
      </Typography>
      
      <FormField
        label="Status Code"
        helperText="Optional status code to return (e.g., 'success', 'error', '200')"
      >
        <TextField
          fullWidth
          value={extendedConfig.status_code || ''}
          onChange={(e) => handleChange('status_code', e.target.value)}
          size="small"
          placeholder="success"
        />
      </FormField>
      
      <FormField label="Transcript Options">
        <FormControlLabel
          control={
            <Checkbox
              checked={extendedConfig.emit_transcript || false}
              onChange={(e) => handleChange('emit_transcript', e.target.checked)}
            />
          }
          label="Emit Transcript"
        />
        <Typography variant="caption" color="text.secondary" display="block">
          Include the full conversation transcript in the response
        </Typography>
      </FormField>
      
      <FormField
        label="On Terminate Hook"
        helperText="Optional webhook URL to call when the workflow terminates"
      >
        <TextField
          fullWidth
          value={extendedConfig.on_terminate_hook || ''}
          onChange={(e) => handleChange('on_terminate_hook', e.target.value)}
          size="small"
          placeholder="https://example.com/webhook"
        />
      </FormField>
    </Box>
  );
};

export default EndOperatorConfig;
