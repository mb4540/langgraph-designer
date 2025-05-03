import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TimeoutOperatorConfig as TimeoutConfig } from '../../../types/nodeTypes';
import { useWorkflowContext } from '../../../context/WorkflowContext';

interface TimeoutOperatorConfigProps {
  config: TimeoutConfig;
  setConfig: (config: TimeoutConfig) => void;
}

const TimeoutOperatorConfig: React.FC<TimeoutOperatorConfigProps> = ({
  config,
  setConfig
}) => {
  const { nodes } = useWorkflowContext();
  
  const handleChange = (field: keyof TimeoutConfig, value: any) => {
    setConfig({
      ...config,
      [field]: value
    });
  };

  return (
    <Box>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Timeout Configuration
        </Typography>
        
        <TextField
          fullWidth
          label="Timeout (seconds)"
          type="number"
          value={config.timeout_sec || ''}
          onChange={(e) => handleChange('timeout_sec', e.target.value ? parseInt(e.target.value) : undefined)}
          margin="normal"
          variant="outlined"
          inputProps={{ min: 1 }}
          required
          helperText="Maximum time allowed before timeout action is triggered"
        />
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="on-timeout-label">On Timeout Action</InputLabel>
          <Select
            labelId="on-timeout-label"
            value={config.on_timeout || 'abort'}
            label="On Timeout Action"
            onChange={(e) => handleChange('on_timeout', e.target.value)}
          >
            <MenuItem value="abort">Abort</MenuItem>
            <MenuItem value="retry">Retry</MenuItem>
            <MenuItem value="fallback_node">Use Fallback Node</MenuItem>
          </Select>
          <Typography variant="caption" color="text.secondary">
            Action to take when timeout occurs
          </Typography>
        </FormControl>
        
        {config.on_timeout === 'fallback_node' && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="fallback-node-label">Fallback Node</InputLabel>
            <Select
              labelId="fallback-node-label"
              value={config.fallback_node || ''}
              label="Fallback Node"
              onChange={(e) => handleChange('fallback_node', e.target.value)}
              required
            >
              {nodes.map(node => (
                <MenuItem key={node.id} value={node.id}>
                  {node.name || `${node.type} ${node.id.slice(0, 8)}`}
                </MenuItem>
              ))}
            </Select>
            <Typography variant="caption" color="text.secondary">
              Node to execute when timeout occurs
            </Typography>
          </FormControl>
        )}
      </Paper>
    </Box>
  );
};

export default TimeoutOperatorConfig;
