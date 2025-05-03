import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { SxProps, Theme } from '@mui/material/styles';

import { FormField } from '../common';

// Available LLM models
export const LLM_MODELS = [
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  { value: 'claude-3-opus', label: 'Claude 3 Opus' },
  { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
  { value: 'claude-3-haiku', label: 'Claude 3 Haiku' },
  { value: 'gemini-pro', label: 'Gemini Pro' },
  { value: 'gemini-ultra', label: 'Gemini Ultra' },
  { value: 'llama-3-70b', label: 'Llama 3 70B' },
  { value: 'llama-3-8b', label: 'Llama 3 8B' },
  { value: 'mistral-large', label: 'Mistral Large' },
  { value: 'mistral-medium', label: 'Mistral Medium' },
  { value: 'mistral-small', label: 'Mistral Small' },
  { value: 'custom', label: 'Custom Model' }
];

// Available credential sources
export const CREDENTIAL_SOURCES = [
  { value: 'workgroup', label: 'Workgroup' },
  { value: 'environment', label: 'Environment Variables' },
  { value: 'custom', label: 'Custom' }
];

interface AgentModelSettingsProps {
  llmModel: string;
  onLlmModelChange: (model: string) => void;
  credentialsSource: string;
  onCredentialsSourceChange: (source: string) => void;
  maxConsecutiveReplies: number;
  onMaxConsecutiveRepliesChange: (value: number) => void;
  sx?: SxProps<Theme>;
}

/**
 * A component for configuring agent model settings
 */
const AgentModelSettings: React.FC<AgentModelSettingsProps> = ({
  llmModel,
  onLlmModelChange,
  credentialsSource,
  onCredentialsSourceChange,
  maxConsecutiveReplies,
  onMaxConsecutiveRepliesChange,
  sx = {}
}) => {
  return (
    <Box sx={{ ...sx }}>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Model Settings
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormField label="LLM Model">
            <FormControl fullWidth size="small">
              <Select
                value={llmModel}
                onChange={(e) => onLlmModelChange(e.target.value)}
              >
                {LLM_MODELS.map((model) => (
                  <MenuItem key={model.value} value={model.value}>
                    {model.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </FormField>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormField label="Credentials Source">
            <FormControl fullWidth size="small">
              <Select
                value={credentialsSource}
                onChange={(e) => onCredentialsSourceChange(e.target.value)}
              >
                {CREDENTIAL_SOURCES.map((source) => (
                  <MenuItem key={source.value} value={source.value}>
                    {source.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </FormField>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormField label="Max Consecutive Replies" helperText="Maximum number of consecutive replies the agent can make without user input">
            <TextField
              type="number"
              fullWidth
              size="small"
              value={maxConsecutiveReplies}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= 0) {
                  onMaxConsecutiveRepliesChange(value);
                }
              }}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </FormField>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AgentModelSettings;
