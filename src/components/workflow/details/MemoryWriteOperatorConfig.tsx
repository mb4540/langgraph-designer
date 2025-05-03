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
import { MemoryWriteOperatorConfig as MemoryWriteConfig } from '../../../types/nodeTypes';

interface MemoryWriteOperatorConfigProps {
  config: MemoryWriteConfig;
  setConfig: (config: MemoryWriteConfig) => void;
}

const MemoryWriteOperatorConfig: React.FC<MemoryWriteOperatorConfigProps> = ({
  config,
  setConfig
}) => {
  const handleChange = (field: keyof MemoryWriteConfig, value: any) => {
    setConfig({
      ...config,
      [field]: value
    });
  };

  return (
    <Box>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Memory Write Configuration
        </Typography>
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="memory-store-label">Memory Store</InputLabel>
          <Select
            labelId="memory-store-label"
            value={config.store || 'zep'}
            label="Memory Store"
            onChange={(e) => handleChange('store', e.target.value)}
            required
          >
            <MenuItem value="zep">Zep</MenuItem>
            <MenuItem value="redis">Redis</MenuItem>
            <MenuItem value="vector">Vector Store</MenuItem>
            <MenuItem value="custom">Custom</MenuItem>
          </Select>
        </FormControl>
        
        <TextField
          fullWidth
          label="Data Path"
          value={config.data_path || ''}
          onChange={(e) => handleChange('data_path', e.target.value)}
          margin="normal"
          variant="outlined"
          placeholder="Path in runtime state to persist (e.g., 'messages')"
          required
          helperText="Path to data in workflow state that should be persisted"
        />
        
        <TextField
          fullWidth
          label="Namespace"
          value={config.namespace || ''}
          onChange={(e) => handleChange('namespace', e.target.value)}
          margin="normal"
          variant="outlined"
          placeholder="Memory namespace (optional)"
        />
        
        <TextField
          fullWidth
          label="TTL (seconds)"
          type="number"
          value={config.ttl_sec || ''}
          onChange={(e) => handleChange('ttl_sec', e.target.value ? parseInt(e.target.value) : undefined)}
          margin="normal"
          variant="outlined"
          inputProps={{ min: 0 }}
          helperText="Time-to-live in seconds (0 = never expires)"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={config.upsert !== false} // Default to true
              onChange={(e) => handleChange('upsert', e.target.checked)}
            />
          }
          label="Upsert"
          sx={{ mt: 2 }}
        />
        <Typography variant="caption" color="text.secondary" display="block" sx={{ ml: 3 }}>
          Update existing records if they exist (default: true)
        </Typography>
      </Paper>
    </Box>
  );
};

export default MemoryWriteOperatorConfig;
