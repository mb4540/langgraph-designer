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

// Extended config interface with UI-specific properties
interface ExtendedHumanPauseConfig extends HumanPauseConfig {
  message?: string;
  notification_channel?: 'email' | 'slack' | 'teams' | 'webhook' | 'sms' | 'none';
  notification_recipients?: string;
  timeout_minutes?: number;
  require_approval?: boolean;
  allow_modifications?: boolean;
  editable_fields?: string[];
  on_timeout_action?: string;
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
  // Cast config to extended type for UI properties
  const extendedConfig = config as ExtendedHumanPauseConfig;
  
  const handleChange = (field: keyof ExtendedHumanPauseConfig, value: any) => {
    onConfigChange({
      ...extendedConfig,
      [field]: value
    } as HumanPauseConfig);
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
          value={extendedConfig.message || ''}
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
            value={extendedConfig.notification_channel || 'none'}
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
      
      {extendedConfig.notification_channel && extendedConfig.notification_channel !== 'none' && (
        <FormField
          label="Notification Recipients"
          required
          helperText={`Recipients for ${extendedConfig.notification_channel} notifications (comma-separated)`}
        >
          <TextField
            fullWidth
            value={extendedConfig.notification_recipients || ''}
            onChange={(e) => handleChange('notification_recipients', e.target.value)}
            size="small"
            placeholder={extendedConfig.notification_channel === 'email' 
              ? 'user@example.com, another@example.com'
              : extendedConfig.notification_channel === 'slack' || extendedConfig.notification_channel === 'teams'
                ? '#channel-name, @username'
                : extendedConfig.notification_channel === 'webhook'
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
          value={extendedConfig.timeout_minutes || ''}
          onChange={(e) => handleChange('timeout_minutes', e.target.value ? parseInt(e.target.value) : undefined)}
          size="small"
          inputProps={{ min: 0 }}
          placeholder="60"
        />
      </FormField>
      
      <FormField label="Approval Settings">
        <FormControlLabel
          control={
            <Checkbox
              checked={extendedConfig.require_approval ?? true}
              onChange={(e) => handleChange('require_approval', e.target.checked)}
            />
          }
          label="Require Explicit Approval"
        />
        <Typography variant="caption" color="text.secondary" display="block">
          Require the user to explicitly approve before continuing
        </Typography>
      </FormField>
      
      <FormField label="Modification Settings">
        <FormControlLabel
          control={
            <Checkbox
              checked={extendedConfig.allow_modifications || false}
              onChange={(e) => handleChange('allow_modifications', e.target.checked)}
            />
          }
          label="Allow Data Modifications"
        />
        <Typography variant="caption" color="text.secondary" display="block">
          Allow the user to modify workflow data before continuing
        </Typography>
      </FormField>
      
      {extendedConfig.allow_modifications && (
        <FormField
          label="Editable Fields"
          helperText="Comma-separated list of state fields that can be modified by the user"
        >
          <TextField
            fullWidth
            value={(extendedConfig.editable_fields || []).join(', ')}
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
          code={extendedConfig.on_timeout_action || ''}
          onCodeChange={(code) => handleChange('on_timeout_action', code)}
          language="javascript"
          height="100px"
          placeholder="// Example: Set a default value and continue\nstate.approval_status = 'timed_out';\nreturn state;"
        />
      </FormField>
    </Box>
  );
};

export default HumanPauseOperatorConfig;
