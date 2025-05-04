import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { StartOperatorConfig as StartConfig, TriggerType, EventSourceType } from '../../../../types/nodeTypes';
import { FormField } from '../common';

interface StartOperatorConfigProps {
  config: StartConfig;
  onConfigChange: (config: StartConfig) => void;
}

// Extended config interface with UI-specific properties
interface ExtendedStartConfig extends StartConfig {
  // UI-specific properties can be added here
  // All properties from StartConfig are already inherited
}

// Trigger type options
const TRIGGER_TYPES: { value: TriggerType; label: string; description: string }[] = [
  { value: 'human', label: 'Human Triggered', description: 'Workflow is started by a human user' },
  { value: 'system', label: 'System Triggered', description: 'Workflow is started by another system' },
  { value: 'event', label: 'Event Triggered', description: 'Workflow is started by an external event' },
  { value: 'multi', label: 'Multi-Start', description: 'Workflow has multiple possible starting points' }
];

// Event source options
const EVENT_SOURCES: { value: EventSourceType; label: string; description: string }[] = [
  { value: 'webhook', label: 'Webhook', description: 'HTTP webhook endpoint' },
  { value: 'mq', label: 'Message Queue', description: 'Message queue topic or channel' },
  { value: 'cron', label: 'Scheduled (Cron)', description: 'Time-based scheduling using cron syntax' }
];

/**
 * Component for configuring a start operator
 */
const StartOperatorConfig: React.FC<StartOperatorConfigProps> = ({
  config,
  onConfigChange
}) => {
  // Cast config to extended type for UI properties
  const extendedConfig = config as ExtendedStartConfig;
  
  const handleChange = (field: keyof ExtendedStartConfig, value: any) => {
    onConfigChange({
      ...extendedConfig,
      [field]: value
    } as StartConfig);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Start Configuration
      </Typography>
      
      <FormField
        label="Trigger Type"
        required
        helperText="How the workflow will be initiated"
      >
        <FormControl fullWidth size="small">
          <Select
            value={extendedConfig.trigger_type || 'human'}
            onChange={(e) => handleChange('trigger_type', e.target.value)}
          >
            {TRIGGER_TYPES.map(type => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </FormField>
      
      <FormField label="Resume Options">
        <FormControlLabel
          control={
            <Checkbox
              checked={extendedConfig.resume_capable || false}
              onChange={(e) => handleChange('resume_capable', e.target.checked)}
            />
          }
          label="Resume Capable"
        />
        <Typography variant="caption" color="text.secondary" display="block">
          Allow the workflow to be paused and resumed
        </Typography>
      </FormField>
      
      {extendedConfig.trigger_type === 'event' && (
        <>
          <FormField
            label="Event Source"
            required
            helperText="Type of event source that will trigger this workflow"
          >
            <FormControl fullWidth size="small">
              <Select
                value={extendedConfig.event_source || 'webhook'}
                onChange={(e) => handleChange('event_source', e.target.value)}
              >
                {EVENT_SOURCES.map(source => (
                  <MenuItem key={source.value} value={source.value}>
                    {source.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </FormField>
          
          <FormField
            label={extendedConfig.event_source === 'cron' ? 'Cron Expression' : 'Event Topic/Path'}
            required
            helperText={extendedConfig.event_source === 'cron' 
              ? 'Schedule using cron syntax (e.g., "0 0 * * *" for daily at midnight)'
              : 'Topic, path, or identifier for the event source'
            }
          >
            <TextField
              fullWidth
              value={extendedConfig.event_topic || ''}
              onChange={(e) => handleChange('event_topic', e.target.value)}
              size="small"
              placeholder={extendedConfig.event_source === 'cron' 
                ? '0 0 * * *' 
                : extendedConfig.event_source === 'webhook' 
                  ? '/api/webhooks/my-workflow'
                  : 'my-topic'
              }
            />
          </FormField>
        </>
      )}
      
      {extendedConfig.trigger_type === 'multi' && (
        <FormField label="Multi-Start Options">
          <FormControlLabel
            control={
              <Checkbox
                checked={extendedConfig.wait_for_all_start_nodes || false}
                onChange={(e) => handleChange('wait_for_all_start_nodes', e.target.checked)}
              />
            }
            label="Wait for All Start Nodes"
          />
          <Typography variant="caption" color="text.secondary" display="block">
            Wait for all start nodes to be triggered before proceeding
          </Typography>
        </FormField>
      )}
    </Box>
  );
};

export default StartOperatorConfig;
