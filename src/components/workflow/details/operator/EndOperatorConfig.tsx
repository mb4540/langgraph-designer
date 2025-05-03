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

/**
 * Component for configuring an end operator
 */
const EndOperatorConfig: React.FC<EndOperatorConfigProps> = ({
  config,
  onConfigChange
}) => {
  const handleChange = (field: keyof EndConfig, value: any) => {
    onConfigChange({
      ...config,
      [field]: value
    });
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
          value={config.status_code || ''}
          onChange={(e) => handleChange('status_code', e.target.value)}
          size="small"
          placeholder="success"
        />
      </FormField>
      
      <FormField>
        <FormControlLabel
          control={
            <Checkbox
              checked={config.emit_transcript || false}
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
          value={config.on_terminate_hook || ''}
          onChange={(e) => handleChange('on_terminate_hook', e.target.value)}
          size="small"
          placeholder="https://example.com/webhook"
        />
      </FormField>
    </Box>
  );
};

export default EndOperatorConfig;
