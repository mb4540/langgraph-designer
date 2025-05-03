import React, { useState } from 'react';
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
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { SubGraphOperatorConfig as SubGraphConfig } from '../../../types/nodeTypes';

interface SubGraphOperatorConfigProps {
  config: SubGraphConfig;
  setConfig: (config: SubGraphConfig) => void;
}

const SubGraphOperatorConfig: React.FC<SubGraphOperatorConfigProps> = ({
  config,
  setConfig
}) => {
  // Local state for new mappings
  const [newInputKey, setNewInputKey] = useState('');
  const [newInputValue, setNewInputValue] = useState('');
  const [newOutputKey, setNewOutputKey] = useState('');
  const [newOutputValue, setNewOutputValue] = useState('');
  
  const handleChange = (field: keyof SubGraphConfig, value: any) => {
    setConfig({
      ...config,
      [field]: value
    });
  };

  const handleAddInputMapping = () => {
    if (!newInputKey || !newInputValue) return;
    
    const updatedMapping = { ...(config.input_mapping || {}) };
    updatedMapping[newInputKey] = newInputValue;
    
    handleChange('input_mapping', updatedMapping);
    setNewInputKey('');
    setNewInputValue('');
  };

  const handleRemoveInputMapping = (key: string) => {
    const updatedMapping = { ...(config.input_mapping || {}) };
    delete updatedMapping[key];
    handleChange('input_mapping', updatedMapping);
  };

  const handleAddOutputMapping = () => {
    if (!newOutputKey || !newOutputValue) return;
    
    const updatedMapping = { ...(config.output_mapping || {}) };
    updatedMapping[newOutputKey] = newOutputValue;
    
    handleChange('output_mapping', updatedMapping);
    setNewOutputKey('');
    setNewOutputValue('');
  };

  const handleRemoveOutputMapping = (key: string) => {
    const updatedMapping = { ...(config.output_mapping || {}) };
    delete updatedMapping[key];
    handleChange('output_mapping', updatedMapping);
  };

  return (
    <Box>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Sub-Graph Configuration
        </Typography>
        
        <TextField
          fullWidth
          label="Graph ID"
          value={config.graph_id || ''}
          onChange={(e) => handleChange('graph_id', e.target.value)}
          margin="normal"
          variant="outlined"
          placeholder="Enter the ID of the saved graph"
          required
          helperText="Reference to a saved workflow graph"
        />
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="mode-label">Execution Mode</InputLabel>
          <Select
            labelId="mode-label"
            value={config.mode || 'inline'}
            label="Execution Mode"
            onChange={(e) => handleChange('mode', e.target.value)}
          >
            <MenuItem value="inline">Inline</MenuItem>
            <MenuItem value="async">Async</MenuItem>
          </Select>
          <Typography variant="caption" color="text.secondary">
            How the sub-graph should be executed
          </Typography>
        </FormControl>
        
        <FormControlLabel
          control={
            <Switch
              checked={config.isolate_memory === true}
              onChange={(e) => handleChange('isolate_memory', e.target.checked)}
            />
          }
          label="Isolate Memory"
          sx={{ mt: 2 }}
        />
        <Typography variant="caption" color="text.secondary" display="block" sx={{ ml: 3 }}>
          Create a local state sandbox for the sub-graph (default: false)
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" gutterBottom>
          Input Mapping (Parent → Sub-Graph)
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          {Object.entries(config.input_mapping || {}).map(([key, value], index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TextField
                label="Parent State Key"
                value={key}
                onChange={(e) => {
                  const updatedMapping = { ...(config.input_mapping || {}) };
                  const oldValue = updatedMapping[key];
                  delete updatedMapping[key];
                  updatedMapping[e.target.value] = oldValue;
                  handleChange('input_mapping', updatedMapping);
                }}
                sx={{ flex: 1, mr: 1 }}
              />
              <TextField
                label="Sub-Graph Input Key"
                value={value}
                onChange={(e) => {
                  const updatedMapping = { ...(config.input_mapping || {}) };
                  updatedMapping[key] = e.target.value;
                  handleChange('input_mapping', updatedMapping);
                }}
                sx={{ flex: 1, mr: 1 }}
              />
              <IconButton onClick={() => handleRemoveInputMapping(key)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          
          <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
            <TextField
              label="Parent State Key"
              value={newInputKey}
              onChange={(e) => setNewInputKey(e.target.value)}
              placeholder="e.g., messages"
              sx={{ flex: 1, mr: 1 }}
            />
            <TextField
              label="Sub-Graph Input Key"
              value={newInputValue}
              onChange={(e) => setNewInputValue(e.target.value)}
              placeholder="e.g., input_messages"
              sx={{ flex: 1, mr: 1 }}
            />
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={handleAddInputMapping}
              disabled={!newInputKey || !newInputValue}
            >
              Add
            </Button>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" gutterBottom>
          Output Mapping (Sub-Graph → Parent)
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          {Object.entries(config.output_mapping || {}).map(([key, value], index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TextField
                label="Sub-Graph Output Key"
                value={key}
                onChange={(e) => {
                  const updatedMapping = { ...(config.output_mapping || {}) };
                  const oldValue = updatedMapping[key];
                  delete updatedMapping[key];
                  updatedMapping[e.target.value] = oldValue;
                  handleChange('output_mapping', updatedMapping);
                }}
                sx={{ flex: 1, mr: 1 }}
              />
              <TextField
                label="Parent State Key"
                value={value}
                onChange={(e) => {
                  const updatedMapping = { ...(config.output_mapping || {}) };
                  updatedMapping[key] = e.target.value;
                  handleChange('output_mapping', updatedMapping);
                }}
                sx={{ flex: 1, mr: 1 }}
              />
              <IconButton onClick={() => handleRemoveOutputMapping(key)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          
          <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
            <TextField
              label="Sub-Graph Output Key"
              value={newOutputKey}
              onChange={(e) => setNewOutputKey(e.target.value)}
              placeholder="e.g., result"
              sx={{ flex: 1, mr: 1 }}
            />
            <TextField
              label="Parent State Key"
              value={newOutputValue}
              onChange={(e) => setNewOutputValue(e.target.value)}
              placeholder="e.g., sub_graph_result"
              sx={{ flex: 1, mr: 1 }}
            />
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={handleAddOutputMapping}
              disabled={!newOutputKey || !newOutputValue}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default SubGraphOperatorConfig;
