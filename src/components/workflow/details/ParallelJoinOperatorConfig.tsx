import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { ParallelJoinOperatorConfig as ParallelJoinConfig } from '../../../types/nodeTypes';

interface ParallelJoinOperatorConfigProps {
  config: ParallelJoinConfig;
  setConfig: (config: ParallelJoinConfig) => void;
}

const ParallelJoinOperatorConfig: React.FC<ParallelJoinOperatorConfigProps> = ({
  config,
  setConfig
}) => {
  const handleChange = (field: keyof ParallelJoinConfig, value: any) => {
    setConfig({
      ...config,
      [field]: value
    });
  };

  return (
    <Box>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Parallel Join Configuration
        </Typography>
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="merge-strategy-label">Merge Strategy</InputLabel>
          <Select
            labelId="merge-strategy-label"
            value={config.merge_strategy || 'concat'}
            label="Merge Strategy"
            onChange={(e) => handleChange('merge_strategy', e.target.value)}
          >
            <MenuItem value="concat">Concat</MenuItem>
            <MenuItem value="merge">Merge</MenuItem>
            <MenuItem value="reduce">Reduce</MenuItem>
          </Select>
          <Typography variant="caption" color="text.secondary">
            How to combine results from parallel branches
          </Typography>
        </FormControl>
        
        {config.merge_strategy === 'reduce' && (
          <TextField
            fullWidth
            label="Reduce Function"
            value={config.reduce_func || ''}
            onChange={(e) => handleChange('reduce_func', e.target.value)}
            margin="normal"
            variant="outlined"
            placeholder="Function reference (e.g., 'module.reduce_function')"
            helperText="Function to reduce multiple results into a single value"
          />
        )}
        
        <TextField
          fullWidth
          label="Timeout (seconds)"
          type="number"
          value={config.timeout_sec || ''}
          onChange={(e) => handleChange('timeout_sec', e.target.value ? parseInt(e.target.value) : undefined)}
          margin="normal"
          variant="outlined"
          inputProps={{ min: 0 }}
          helperText="Maximum time to wait for all branches to complete"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={config.allow_partial === true}
              onChange={(e) => handleChange('allow_partial', e.target.checked)}
            />
          }
          label="Allow Partial Results"
          sx={{ mt: 2 }}
        />
        <Typography variant="caption" color="text.secondary" display="block" sx={{ ml: 3 }}>
          Emit results even if some branches fail (default: false)
        </Typography>
      </Paper>
    </Box>
  );
};

export default ParallelJoinOperatorConfig;
