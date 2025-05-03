import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { ParallelForkOperatorConfig as ParallelForkConfig } from '../../../types/nodeTypes';

interface ParallelForkOperatorConfigProps {
  config: ParallelForkConfig;
  setConfig: (config: ParallelForkConfig) => void;
}

const ParallelForkOperatorConfig: React.FC<ParallelForkOperatorConfigProps> = ({
  config,
  setConfig
}) => {
  // Local state for new fork input
  const [newInputKey, setNewInputKey] = useState('');
  const [newInputValue, setNewInputValue] = useState('');
  
  const handleChange = (field: keyof ParallelForkConfig, value: any) => {
    setConfig({
      ...config,
      [field]: value
    });
  };

  const handleAddForkInput = () => {
    if (!newInputKey || !newInputValue) return;
    
    let updatedForkInputs: any;
    
    // If strategy is 'map', fork_inputs should be a string array
    if (config.strategy === 'map') {
      updatedForkInputs = [...(Array.isArray(config.fork_inputs) ? config.fork_inputs : [])];
      updatedForkInputs.push(newInputValue);
    } 
    // Otherwise, it's a key-value mapping
    else {
      updatedForkInputs = { ...(typeof config.fork_inputs === 'object' && !Array.isArray(config.fork_inputs) ? config.fork_inputs : {}) };
      updatedForkInputs[newInputKey] = newInputValue;
    }
    
    handleChange('fork_inputs', updatedForkInputs);
    setNewInputKey('');
    setNewInputValue('');
  };

  const handleRemoveForkInput = (key: string | number) => {
    let updatedForkInputs: any;
    
    // If strategy is 'map', fork_inputs is a string array
    if (config.strategy === 'map' && Array.isArray(config.fork_inputs)) {
      updatedForkInputs = [...config.fork_inputs];
      updatedForkInputs.splice(key as number, 1);
    } 
    // Otherwise, it's a key-value mapping
    else if (typeof config.fork_inputs === 'object' && !Array.isArray(config.fork_inputs)) {
      updatedForkInputs = { ...config.fork_inputs };
      delete updatedForkInputs[key as string];
    } else {
      return; // Invalid state
    }
    
    handleChange('fork_inputs', updatedForkInputs);
  };

  // When strategy changes, reset fork_inputs to appropriate type
  const handleStrategyChange = (strategy: string) => {
    let newForkInputs: any;
    
    if (strategy === 'map') {
      newForkInputs = [];
    } else {
      newForkInputs = {};
    }
    
    setConfig({
      ...config,
      strategy: strategy as "fanout" | "map" | "scatter-gather",
      fork_inputs: newForkInputs
    });
  };

  return (
    <Box>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Parallel Fork Configuration
        </Typography>
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="fork-strategy-label">Strategy</InputLabel>
          <Select
            labelId="fork-strategy-label"
            value={config.strategy || 'fanout'}
            label="Strategy"
            onChange={(e) => handleStrategyChange(e.target.value)}
          >
            <MenuItem value="fanout">Fanout</MenuItem>
            <MenuItem value="map">Map</MenuItem>
            <MenuItem value="scatter-gather">Scatter-Gather</MenuItem>
          </Select>
          <Typography variant="caption" color="text.secondary">
            How to distribute work across parallel branches
          </Typography>
        </FormControl>
        
        <TextField
          fullWidth
          label="Max Concurrency"
          type="number"
          value={config.max_concurrency || ''}
          onChange={(e) => handleChange('max_concurrency', e.target.value ? parseInt(e.target.value) : undefined)}
          margin="normal"
          variant="outlined"
          inputProps={{ min: 1 }}
          helperText="Maximum number of concurrent branches (node-level throttle)"
        />
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" gutterBottom>
          Fork Inputs
        </Typography>
        
        {/* Display current fork inputs based on strategy */}
        <Box sx={{ mb: 2 }}>
          {config.strategy === 'map' && Array.isArray(config.fork_inputs) && (
            <Box>
              {config.fork_inputs.map((input, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    label={`Item ${index + 1}`}
                    value={input}
                    onChange={(e) => {
                      const updatedInputs = [...config.fork_inputs as string[]];
                      updatedInputs[index] = e.target.value;
                      handleChange('fork_inputs', updatedInputs);
                    }}
                    sx={{ flex: 1, mr: 1 }}
                  />
                  <IconButton onClick={() => handleRemoveForkInput(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
          
          {config.strategy !== 'map' && typeof config.fork_inputs === 'object' && !Array.isArray(config.fork_inputs) && (
            <Box>
              {Object.entries(config.fork_inputs || {}).map(([key, value], index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    label="Key"
                    value={key}
                    onChange={(e) => {
                      const updatedInputs = { ...config.fork_inputs as Record<string, string> };
                      const oldValue = updatedInputs[key];
                      delete updatedInputs[key];
                      updatedInputs[e.target.value] = oldValue;
                      handleChange('fork_inputs', updatedInputs);
                    }}
                    sx={{ flex: 1, mr: 1 }}
                  />
                  <TextField
                    label="Value"
                    value={value}
                    onChange={(e) => {
                      const updatedInputs = { ...config.fork_inputs as Record<string, string> };
                      updatedInputs[key] = e.target.value;
                      handleChange('fork_inputs', updatedInputs);
                    }}
                    sx={{ flex: 1, mr: 1 }}
                  />
                  <IconButton onClick={() => handleRemoveForkInput(key)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
          
          {/* Input form for adding new fork inputs */}
          {config.strategy === 'map' ? (
            <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
              <TextField
                label="New Item"
                value={newInputValue}
                onChange={(e) => setNewInputValue(e.target.value)}
                sx={{ flex: 1, mr: 1 }}
              />
              <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={handleAddForkInput}
                disabled={!newInputValue}
              >
                Add
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
              <TextField
                label="Key"
                value={newInputKey}
                onChange={(e) => setNewInputKey(e.target.value)}
                sx={{ flex: 1, mr: 1 }}
              />
              <TextField
                label="Value"
                value={newInputValue}
                onChange={(e) => setNewInputValue(e.target.value)}
                sx={{ flex: 1, mr: 1 }}
              />
              <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={handleAddForkInput}
                disabled={!newInputKey || !newInputValue}
              >
                Add
              </Button>
            </Box>
          )}
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="gather-mode-label">Gather Mode</InputLabel>
          <Select
            labelId="gather-mode-label"
            value={config.gather_mode || 'wait_all'}
            label="Gather Mode"
            onChange={(e) => handleChange('gather_mode', e.target.value)}
          >
            <MenuItem value="wait_all">Wait All</MenuItem>
            <MenuItem value="first_success">First Success</MenuItem>
            <MenuItem value="time_box">Time Box</MenuItem>
          </Select>
          <Typography variant="caption" color="text.secondary">
            How to handle results from parallel branches
          </Typography>
        </FormControl>
        
        <TextField
          fullWidth
          label="Per-Branch Timeout (seconds)"
          type="number"
          value={config.per_branch_timeout_sec || ''}
          onChange={(e) => handleChange('per_branch_timeout_sec', e.target.value ? parseInt(e.target.value) : undefined)}
          margin="normal"
          variant="outlined"
          inputProps={{ min: 0 }}
          helperText="Maximum time allowed for each branch execution"
        />
      </Paper>
    </Box>
  );
};

export default ParallelForkOperatorConfig;
