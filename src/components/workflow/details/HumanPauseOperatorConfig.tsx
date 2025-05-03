import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { HumanPauseOperatorConfig as HumanPauseConfig } from '../../../types/nodeTypes';
import { useWorkflowContext } from '../../../context/WorkflowContext';

interface HumanPauseOperatorConfigProps {
  config: HumanPauseConfig;
  setConfig: (config: HumanPauseConfig) => void;
}

const HumanPauseOperatorConfig: React.FC<HumanPauseOperatorConfigProps> = ({
  config,
  setConfig
}) => {
  const { nodes } = useWorkflowContext();
  
  const handleChange = (field: keyof HumanPauseConfig, value: any) => {
    setConfig({
      ...config,
      [field]: value
    });
  };

  return (
    <Box>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Human Pause Configuration
        </Typography>
        
        <TextField
          fullWidth
          label="Message to User"
          value={config.message_to_user || ''}
          onChange={(e) => handleChange('message_to_user', e.target.value)}
          margin="normal"
          variant="outlined"
          multiline
          rows={3}
          placeholder="Enter message to display to the user"
          required
          helperText="Message explaining what input is needed from the user"
        />
        
        <TextField
          fullWidth
          label="Expected Response Schema"
          value={typeof config.expected_response_schema === 'string' ? config.expected_response_schema : JSON.stringify(config.expected_response_schema, null, 2)}
          onChange={(e) => {
            try {
              // Try to parse as JSON first
              const jsonValue = JSON.parse(e.target.value);
              handleChange('expected_response_schema', jsonValue);
            } catch {
              // If not valid JSON, store as string
              handleChange('expected_response_schema', e.target.value);
            }
          }}
          margin="normal"
          variant="outlined"
          multiline
          rows={3}
          placeholder="Enter JSON schema for expected response"
          helperText="JSON schema defining the structure of the expected user response"
        />
        
        <TextField
          fullWidth
          label="Timeout (seconds)"
          type="number"
          value={config.timeout_sec || ''}
          onChange={(e) => handleChange('timeout_sec', e.target.value ? parseInt(e.target.value) : undefined)}
          margin="normal"
          variant="outlined"
          inputProps={{ min: 0 }}
          helperText="Time to wait for user response before auto-escalation (0 = wait indefinitely)"
        />
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="escalate-node-label">Escalate Node</InputLabel>
          <Select
            labelId="escalate-node-label"
            value={config.escalate_node || ''}
            label="Escalate Node"
            onChange={(e) => handleChange('escalate_node', e.target.value)}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {nodes.map(node => (
              <MenuItem key={node.id} value={node.id}>
                {node.name || `${node.type} ${node.id.slice(0, 8)}`}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="caption" color="text.secondary">
            Node to execute if timeout occurs
          </Typography>
        </FormControl>
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="next-node-label">Next Node on Response</InputLabel>
          <Select
            labelId="next-node-label"
            value={config.next_node_on_response || ''}
            label="Next Node on Response"
            onChange={(e) => handleChange('next_node_on_response', e.target.value)}
          >
            <MenuItem value=""><em>Default (follow edge)</em></MenuItem>
            {nodes.map(node => (
              <MenuItem key={node.id} value={node.id}>
                {node.name || `${node.type} ${node.id.slice(0, 8)}`}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="caption" color="text.secondary">
            Default resume target when user responds
          </Typography>
        </FormControl>
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="channel-label">Communication Channel</InputLabel>
          <Select
            labelId="channel-label"
            value={config.channel || 'web'}
            label="Communication Channel"
            onChange={(e) => handleChange('channel', e.target.value)}
          >
            <MenuItem value="web">Web</MenuItem>
            <MenuItem value="slack">Slack</MenuItem>
            <MenuItem value="email">Email</MenuItem>
          </Select>
          <Typography variant="caption" color="text.secondary">
            Channel to use for human communication
          </Typography>
        </FormControl>
      </Paper>
    </Box>
  );
};

export default HumanPauseOperatorConfig;
