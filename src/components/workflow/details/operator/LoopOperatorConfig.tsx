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

// Extended config interface with UI-specific properties
interface ExtendedLoopConfig extends LoopConfig {
  // UI-specific properties can be added here
  // All properties from LoopConfig are already inherited
}

/**
 * Component for configuring a loop operator
 */
const LoopOperatorConfig: React.FC<LoopOperatorConfigProps> = ({
  config,
  onConfigChange
}) => {
  // Cast config to extended type for UI properties
  const extendedConfig = config as ExtendedLoopConfig;
  
  const handleChange = (field: keyof ExtendedLoopConfig, value: any) => {
    onConfigChange({
      ...extendedConfig,
      [field]: value
    } as LoopConfig);
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
          code={extendedConfig.condition_expression || ''}
          onCodeChange={(code) => handleChange('condition_expression', code)}
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
          value={extendedConfig.max_iterations || ''}
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
          value={extendedConfig.loop_delay_sec || ''}
          onChange={(e) => handleChange('loop_delay_sec', e.target.value ? parseInt(e.target.value) : undefined)}
          size="small"
          inputProps={{ min: 0 }}
          placeholder="0"
        />
      </FormField>
      
      <FormField label="Loop Behavior">
        <FormControlLabel
          control={
            <Checkbox
              checked={extendedConfig.break_on_failure || false}
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
