import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { SequenceOperatorConfig as SequenceConfig } from '../../../../types/nodeTypes';
import { useWorkflowContext } from '../../../../context/WorkflowContext';
import { FormField } from '../common';

interface SequenceOperatorConfigProps {
  config: SequenceConfig;
  onConfigChange: (config: SequenceConfig) => void;
}

/**
 * Component for configuring a sequence operator
 */
const SequenceOperatorConfig: React.FC<SequenceOperatorConfigProps> = ({
  config,
  onConfigChange
}) => {
  const { nodes } = useWorkflowContext();
  const [newNodeId, setNewNodeId] = useState('');
  
  const handleChange = (field: keyof SequenceConfig, value: any) => {
    onConfigChange({
      ...config,
      [field]: value
    });
  };
  
  const handleAddStep = () => {
    if (!newNodeId) return;
    
    const newSteps = [...(config.steps || []), newNodeId];
    handleChange('steps', newSteps);
    setNewNodeId('');
  };
  
  const handleRemoveStep = (index: number) => {
    const newSteps = [...(config.steps || [])];
    newSteps.splice(index, 1);
    handleChange('steps', newSteps);
  };
  
  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (!config.steps || config.steps.length < 2) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= config.steps.length) return;
    
    const newSteps = [...config.steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[newIndex];
    newSteps[newIndex] = temp;
    
    handleChange('steps', newSteps);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Sequence Configuration
      </Typography>
      
      <FormField>
        <FormControlLabel
          control={
            <Checkbox
              checked={config.stop_on_error || false}
              onChange={(e) => handleChange('stop_on_error', e.target.checked)}
            />
          }
          label="Stop on Error"
        />
        <Typography variant="caption" color="text.secondary" display="block">
          Stop the sequence if any step encounters an error
        </Typography>
      </FormField>
      
      <FormField
        label="Error Handler Node"
        helperText="Optional node to handle errors in the sequence"
      >
        <FormControl fullWidth size="small">
          <Select
            value={config.error_handler_node || ''}
            onChange={(e) => handleChange('error_handler_node', e.target.value)}
            displayEmpty
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {nodes.map(node => (
              <MenuItem key={node.id} value={node.id}>
                {node.name || `${node.type} ${node.id.slice(0, 8)}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </FormField>
      
      <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
        Sequence Steps
      </Typography>
      
      {/* Existing steps */}
      {(config.steps || []).length > 0 ? (
        <Box sx={{ mb: 2 }}>
          {(config.steps || []).map((nodeId, index) => {
            const node = nodes.find(n => n.id === nodeId);
            return (
              <Paper key={index} variant="outlined" sx={{ p: 2, mb: 1 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={1} sx={{ textAlign: 'center' }}>
                    {index + 1}.
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="body2">
                      {node ? (node.name || `${node.type} ${nodeId.slice(0, 8)}`) : nodeId}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton 
                      size="small" 
                      disabled={index === 0}
                      onClick={() => moveStep(index, 'up')}
                      aria-label="move step up"
                    >
                      ↑
                    </IconButton>
                    <IconButton 
                      size="small" 
                      disabled={index === (config.steps || []).length - 1}
                      onClick={() => moveStep(index, 'down')}
                      aria-label="move step down"
                    >
                      ↓
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => handleRemoveStep(index)}
                      aria-label="remove step"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            );
          })}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          No steps added yet. Add steps below to create a sequence.
        </Typography>
      )}
      
      {/* Add new step */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Add New Step
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={9}>
            <FormControl fullWidth size="small">
              <InputLabel id="new-step-node-label">Select Node</InputLabel>
              <Select
                labelId="new-step-node-label"
                label="Select Node"
                value={newNodeId}
                onChange={(e) => setNewNodeId(e.target.value)}
              >
                {nodes.map(node => (
                  <MenuItem key={node.id} value={node.id}>
                    {node.name || `${node.type} ${node.id.slice(0, 8)}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={3}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddStep}
              disabled={!newNodeId}
              size="small"
              fullWidth
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <FormField
        label="State Key Prefix"
        helperText="Optional prefix for state keys produced by this sequence"
      >
        <TextField
          fullWidth
          value={config.state_key_prefix || ''}
          onChange={(e) => handleChange('state_key_prefix', e.target.value)}
          size="small"
          placeholder="sequence_1_"
        />
      </FormField>
    </Box>
  );
};

export default SequenceOperatorConfig;
