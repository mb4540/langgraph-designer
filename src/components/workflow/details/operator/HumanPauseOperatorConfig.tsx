import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { HumanPauseOperatorConfig as HumanPauseConfig } from '../../../../types/nodeTypes';
import { FormField } from '../common';
import { CodeEditor } from '../common';

interface HumanPauseOperatorConfigProps {
  config: HumanPauseConfig;
  onConfigChange: (config: HumanPauseConfig) => void;
}

// Notification channel options
const NOTIFICATION_CHANNELS = [
  { value: 'email', label: 'Email' },
  { value: 'slack', label: 'Slack' },
  { value: 'teams', label: 'Microsoft Teams' },
  { value: 'webhook', label: 'Webhook' },
  { value: 'sms', label: 'SMS' },
  { value: 'none', label: 'None' }
];

/**
 * Component for configuring a human pause operator
 */
const HumanPauseOperatorConfig: React.FC<HumanPauseOperatorConfigProps> = ({
  config,
  onConfigChange
}) => {
  const handleChange = (field: keyof HumanPauseConfig, value: any) => {
    onConfigChange({
      ...config,
      [field]: value
    });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Human Pause Configuration
      </Typography>
      
      <FormField
        label="Pause Message"
        required
        helperText="Message to display to the human user"
      >
        <TextField
          fullWidth
          multiline
          rows={3}
          value={config.message || ''}
          onChange={(e) => handleChange('message', e.target.value)}
          size="small"
          placeholder="Please review the following information and approve to continue..."
        />
      </FormField>
      
      <FormField
        label="Notification Channel"
        helperText="How to notify users that their input is required"
      >
        <FormControl fullWidth size="small">
          <Select
            value={config.notification_channel || 'none'}
            onChange={(e) => handleChange('notification_channel', e.target.value)}
          >
            {NOTIFICATION_CHANNELS.map(channel => (
              <MenuItem key={channel.value} value={channel.value}>
                {channel.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </FormField>
      
      {config.notification_channel && config.notification_channel !== 'none' && (
        <FormField
          label="Notification Recipients"
          required
          helperText={`Recipients for ${config.notification_channel} notifications (comma-separated)`}
        >
          <TextField
            fullWidth
            value={config.notification_recipients || ''}
            onChange={(e) => handleChange('notification_recipients', e.target.value)}
            size="small"
            placeholder={config.notification_channel === 'email' 
              ? 'user@example.com, another@example.com'
              : config.notification_channel === 'slack' || config.notification_channel === 'teams'
                ? '#channel-name, @username'
                : config.notification_channel === 'webhook'
                  ? 'https://example.com/webhook'
                  : '+1234567890, +9876543210'
            }
          />
        </FormField>
      )}
      
      <FormField
        label="Timeout (minutes)"
        helperText="Maximum time to wait for human input (0 = no timeout)"
      >
        <TextField
          fullWidth
          type="number"
          value={config.timeout_minutes || ''}
          onChange={(e) => handleChange('timeout_minutes', e.target.value ? parseInt(e.target.value) : undefined)}
          size="small"
          inputProps={{ min: 0 }}
          placeholder="60"
        />
      </FormField>
      
      <FormField>
        <FormControlLabel
          control={
            <Checkbox
              checked={config.require_approval || true}
              onChange={(e) => handleChange('require_approval', e.target.checked)}
            />
          }
          label="Require Explicit Approval"
        />
        <Typography variant="caption" color="text.secondary" display="block">
          Require the user to explicitly approve before continuing
        </Typography>
      </FormField>
      
      <FormField>
        <FormControlLabel
          control={
            <Checkbox
              checked={config.allow_modifications || false}
              onChange={(e) => handleChange('allow_modifications', e.target.checked)}
            />
          }
          label="Allow Data Modifications"
        />
        <Typography variant="caption" color="text.secondary" display="block">
          Allow the user to modify workflow data before continuing
        </Typography>
      </FormField>
      
      {config.allow_modifications && (
        <FormField
          label="Editable Fields"
          helperText="Comma-separated list of state fields that can be modified by the user"
        >
          <TextField
            fullWidth
            value={(config.editable_fields || []).join(', ')}
            onChange={(e) => handleChange('editable_fields', e.target.value.split(',').map(f => f.trim()).filter(Boolean))}
            size="small"
            placeholder="field1, field2, field3"
          />
        </FormField>
      )}
      
      <FormField
        label="On Timeout Action"
        helperText="JavaScript expression to execute if timeout occurs"
      >
        <CodeEditor
          value={config.on_timeout_action || ''}
          onChange={(value) => handleChange('on_timeout_action', value)}
          language="javascript"
          height="100px"
          placeholder="// Example: Set a default value and continue\nstate.approval_status = 'timed_out';\nreturn state;"
        />
      </FormField>
    </Box>
  );
};

export default HumanPauseOperatorConfig;
