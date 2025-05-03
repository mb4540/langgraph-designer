import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { LoopOperatorConfig as LoopConfig } from '../../../types/nodeTypes';

interface LoopOperatorConfigProps {
  config: LoopConfig;
  setConfig: (config: LoopConfig) => void;
}

const LoopOperatorConfig: React.FC<LoopOperatorConfigProps> = ({
  config,
  setConfig
}) => {
  const handleChange = (field: keyof LoopConfig, value: any) => {
    setConfig({
      ...config,
      [field]: value
    });
  };

  return (
    <Box>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Loop Configuration
        </Typography>
        
        <TextField
          fullWidth
          label="Condition Expression"
          value={config.condition_expression || ''}
          onChange={(e) => handleChange('condition_expression', e.target.value)}
          margin="normal"
          variant="outlined"
          multiline
          rows={3}
          placeholder="Enter expression that evaluates to true/false"
          required
          helperText="Expression evaluated each turn to determine if loop should continue"
        />
        
        <TextField
          fullWidth
          label="Max Iterations"
          type="number"
          value={config.max_iterations !== undefined ? config.max_iterations : 10}
          onChange={(e) => handleChange('max_iterations', e.target.value ? parseInt(e.target.value) : undefined)}
          margin="normal"
          variant="outlined"
          inputProps={{ min: 1 }}
          helperText="Maximum number of iterations (default: 10)"
        />
        
        <TextField
          fullWidth
          label="Loop Delay (seconds)"
          type="number"
          value={config.loop_delay_sec || ''}
          onChange={(e) => handleChange('loop_delay_sec', e.target.value ? parseInt(e.target.value) : undefined)}
          margin="normal"
          variant="outlined"
          inputProps={{ min: 0 }}
          helperText="Delay between iterations in seconds"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={config.break_on_failure !== false} // Default to true
              onChange={(e) => handleChange('break_on_failure', e.target.checked)}
            />
          }
          label="Break On Failure"
          sx={{ mt: 2 }}
        />
        <Typography variant="caption" color="text.secondary" display="block" sx={{ ml: 3 }}>
          Exit loop if an iteration fails (default: true)
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoopOperatorConfig;
