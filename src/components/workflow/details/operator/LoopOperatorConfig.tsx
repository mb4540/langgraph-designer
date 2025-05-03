import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { LoopOperatorConfig as LoopConfig } from '../../../../types/nodeTypes';
import { FormField } from '../common';
import { CodeEditor } from '../common';

interface LoopOperatorConfigProps {
  config: LoopConfig;
  onConfigChange: (config: LoopConfig) => void;
}

/**
 * Component for configuring a loop operator
 */
const LoopOperatorConfig: React.FC<LoopOperatorConfigProps> = ({
  config,
  onConfigChange
}) => {
  const handleChange = (field: keyof LoopConfig, value: any) => {
    onConfigChange({
      ...config,
      [field]: value
    });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Loop Configuration
      </Typography>
      
      <FormField
        label="Loop Condition"
        required
        helperText="JavaScript expression that evaluates to true/false to determine if the loop should continue"
      >
        <CodeEditor
          value={config.condition_expression || ''}
          onChange={(value) => handleChange('condition_expression', value)}
          language="javascript"
          height="120px"
          placeholder="state.counter < 10"
        />
      </FormField>
      
      <FormField
        label="Maximum Iterations"
        helperText="Maximum number of loop iterations (prevents infinite loops)"
      >
        <TextField
          fullWidth
          type="number"
          value={config.max_iterations || ''}
          onChange={(e) => handleChange('max_iterations', e.target.value ? parseInt(e.target.value) : undefined)}
          size="small"
          inputProps={{ min: 1 }}
          placeholder="10"
        />
      </FormField>
      
      <FormField
        label="Loop Delay (seconds)"
        helperText="Optional delay between loop iterations"
      >
        <TextField
          fullWidth
          type="number"
          value={config.loop_delay_sec || ''}
          onChange={(e) => handleChange('loop_delay_sec', e.target.value ? parseInt(e.target.value) : undefined)}
          size="small"
          inputProps={{ min: 0 }}
          placeholder="0"
        />
      </FormField>
      
      <FormField>
        <FormControlLabel
          control={
            <Checkbox
              checked={config.break_on_failure || false}
              onChange={(e) => handleChange('break_on_failure', e.target.checked)}
            />
          }
          label="Break on Failure"
        />
        <Typography variant="caption" color="text.secondary" display="block">
          Exit the loop if an error occurs during iteration
        </Typography>
      </FormField>
    </Box>
  );
};

export default LoopOperatorConfig;
