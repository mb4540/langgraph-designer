import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TimeoutOperatorConfig as TimeoutConfig } from '../../../../types/nodeTypes';
import { useWorkflowContext } from '../../../../context/WorkflowContext';
import { FormField } from '../common';

interface TimeoutOperatorConfigProps {
  config: TimeoutConfig;
  onConfigChange: (config: TimeoutConfig) => void;
}

/**
 * Component for configuring a timeout operator
 */
const TimeoutOperatorConfig: React.FC<TimeoutOperatorConfigProps> = ({
  config,
  onConfigChange
}) => {
  const { nodes } = useWorkflowContext();
  
  const handleChange = (field: keyof TimeoutConfig, value: any) => {
    onConfigChange({
      ...config,
      [field]: value
    });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Timeout Configuration
      </Typography>
      
      <FormField 
        label="Timeout (seconds)" 
        required
        helperText="Maximum time allowed before timeout action is triggered"
      >
        <TextField
          fullWidth
          type="number"
          value={config.timeout_sec || ''}
          onChange={(e) => handleChange('timeout_sec', e.target.value ? parseInt(e.target.value) : undefined)}
          size="small"
          inputProps={{ min: 1 }}
        />
      </FormField>
      
      <FormField
        label="On Timeout Action"
        helperText="Action to take when timeout occurs"
      >
        <FormControl fullWidth size="small">
          <Select
            value={config.on_timeout || 'abort'}
            onChange={(e) => handleChange('on_timeout', e.target.value)}
          >
            <MenuItem value="abort">Abort</MenuItem>
            <MenuItem value="retry">Retry</MenuItem>
            <MenuItem value="fallback_node">Use Fallback Node</MenuItem>
          </Select>
        </FormControl>
      </FormField>
      
      {config.on_timeout === 'fallback_node' && (
        <FormField
          label="Fallback Node"
          required
          helperText="Node to execute when timeout occurs"
        >
          <FormControl fullWidth size="small">
            <Select
              value={config.fallback_node || ''}
              onChange={(e) => handleChange('fallback_node', e.target.value)}
            >
              {nodes.map(node => (
                <MenuItem key={node.id} value={node.id}>
                  {node.name || `${node.type} ${node.id.slice(0, 8)}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormField>
      )}
    </Box>
  );
};

export default TimeoutOperatorConfig;
