import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface AgentType {
  value: string;
  label: string;
  description: string;
}

interface AgentTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  agentTypes?: AgentType[];
}

// Default agent types
const DEFAULT_AGENT_TYPES: AgentType[] = [
  { value: 'assistant', label: 'Assistant', description: 'General purpose assistant agent' },
  { value: 'tool-user', label: 'Tool User', description: 'Agent that specializes in using tools' },
  { value: 'reasoning', label: 'Reasoning Agent', description: 'Agent with enhanced reasoning capabilities' },
  { value: 'planner', label: 'Planner', description: 'Agent that can create and execute plans' },
  { value: 'custom', label: 'Custom', description: 'Custom agent implementation' },
];

/**
 * Component for selecting an agent type
 */
export const AgentTypeSelector: React.FC<AgentTypeSelectorProps> = ({
  value,
  onChange,
  agentTypes = DEFAULT_AGENT_TYPES
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        Agent Type
      </Typography>
      <FormControl fullWidth size="small">
        <InputLabel id="agent-type-label">Select Agent Type</InputLabel>
        <Select
          labelId="agent-type-label"
          value={value}
          onChange={(e: SelectChangeEvent<string>) => onChange(e.target.value as string)}
          label="Select Agent Type"
        >
          {agentTypes.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              <Box>
                <Typography variant="body1">{type.label}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {type.description}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default AgentTypeSelector;
