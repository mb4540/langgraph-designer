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
import { EndOperatorConfig as EndConfig } from '../../../types/nodeTypes';
import { useRuntimeContext } from '../../../context/RuntimeContext';

interface EndOperatorConfigProps {
  config: EndConfig;
  setConfig: (config: EndConfig) => void;
}

const EndOperatorConfig: React.FC<EndOperatorConfigProps> = ({
  config,
  setConfig
}) => {
  const { runtimeType } = useRuntimeContext();
  
  const handleChange = (field: keyof EndConfig, value: any) => {
    setConfig({
      ...config,
      [field]: value
    });
  };

  return (
    <Box>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Status Code
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel id="status-code-label">Status Code</InputLabel>
          <Select
            labelId="status-code-label"
            value={config.status_code || 'success'}
            label="Status Code"
            onChange={(e) => handleChange('status_code', e.target.value)}
          >
            <MenuItem value="success">Success</MenuItem>
            <MenuItem value="error">Error</MenuItem>
            <MenuItem value="custom">Custom</MenuItem>
          </Select>
        </FormControl>
        
        {config.status_code === 'custom' && (
          <TextField
            fullWidth
            label="Custom Status Code"
            value={config.status_code || ''}
            onChange={(e) => handleChange('status_code', e.target.value)}
            margin="normal"
            variant="outlined"
            placeholder="Enter a custom status code"
          />
        )}
        
        <FormControlLabel
          control={
            <Switch
              checked={config.emit_transcript !== false} // Default to true
              onChange={(e) => handleChange('emit_transcript', e.target.checked)}
            />
          }
          label="Emit Transcript"
          sx={{ mt: 2 }}
        />
        <Typography variant="caption" color="text.secondary" display="block" sx={{ ml: 3 }}>
          Include conversation transcript in the workflow output
        </Typography>
        
        {runtimeType === 'langgraph' && (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="On Terminate Hook"
              value={config.on_terminate_hook || ''}
              onChange={(e) => handleChange('on_terminate_hook', e.target.value)}
              margin="normal"
              variant="outlined"
              placeholder="Function reference (e.g., 'module.function')"
              helperText="LangGraph only: Function to call when workflow terminates"
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default EndOperatorConfig;
