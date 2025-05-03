import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { MemoryReadOperatorConfig as MemoryReadConfig } from '../../../types/nodeTypes';

interface MemoryReadOperatorConfigProps {
  config: MemoryReadConfig;
  setConfig: (config: MemoryReadConfig) => void;
}

const MemoryReadOperatorConfig: React.FC<MemoryReadOperatorConfigProps> = ({
  config,
  setConfig
}) => {
  const handleChange = (field: keyof MemoryReadConfig, value: any) => {
    setConfig({
      ...config,
      [field]: value
    });
  };

  return (
    <Box>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Memory Read Configuration
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
          label="Query"
          value={config.query || ''}
          onChange={(e) => handleChange('query', e.target.value)}
          margin="normal"
          variant="outlined"
          multiline
          rows={2}
          placeholder="Enter query string or embedding vector"
          required
        />
        
        <TextField
          fullWidth
          label="Top K Results"
          type="number"
          value={config.top_k !== undefined ? config.top_k : 5}
          onChange={(e) => handleChange('top_k', e.target.value ? parseInt(e.target.value) : undefined)}
          margin="normal"
          variant="outlined"
          inputProps={{ min: 1 }}
          helperText="Number of results to return (default: 5)"
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
          label="Write Back Key"
          value={config.write_back_key || ''}
          onChange={(e) => handleChange('write_back_key', e.target.value)}
          margin="normal"
          variant="outlined"
          placeholder="State key to store results (optional)"
          helperText="Where to save results in workflow state"
        />
        
        <TextField
          fullWidth
          label="As Of (ISO Date)"
          value={config.as_of || ''}
          onChange={(e) => handleChange('as_of', e.target.value)}
          margin="normal"
          variant="outlined"
          placeholder="YYYY-MM-DDTHH:MM:SSZ (optional)"
          helperText="Retrieve memory as of this timestamp (ISO format)"
        />
      </Paper>
    </Box>
  );
};

export default MemoryReadOperatorConfig;
