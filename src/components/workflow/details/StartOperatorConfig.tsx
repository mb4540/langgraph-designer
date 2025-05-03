import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CodeIcon from '@mui/icons-material/Code';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { TriggerType, EventSourceType, StartOperatorConfig as StartConfig } from '../../../types/nodeTypes';
import { useRuntimeContext } from '../../../context/RuntimeContext';
import { emitStartBoilerplate } from '../../../codegen/startHelpers';

interface StartOperatorConfigProps {
  config: StartConfig;
  setConfig: (config: StartConfig) => void;
}

// Trigger type descriptions
const triggerTypeDescriptions: Record<TriggerType, string> = {
  'human': 'Workflow is initiated by a human user and requires human input to start.',
  'system': 'Workflow is triggered programmatically by the system without human intervention.',
  'event': 'Workflow is triggered by external events like webhooks, scheduled tasks, or other systems.',
  'multi': 'Multiple entry points are allowed in the workflow, enabling different starting paths.'
};

// Runtime-specific notes for each trigger type
const runtimeNotes: Record<TriggerType, Record<string, string>> = {
  'human': {
    'autogen': 'Requires UserProxyAgent as the first node in the workflow.',
    'langgraph': 'Initializes with user message in state.'
  },
  'system': {
    'autogen': 'Cannot be resume-capable in Autogen.',
    'langgraph': 'Invoked via function call with initial arguments.'
  },
  'event': {
    'autogen': 'Autogen lacks a native scheduler; requires external wrapper.',
    'langgraph': 'Can be connected to event sources like HTTP endpoints.'
  },
  'multi': {
    'autogen': 'Not supported in Autogen.',
    'langgraph': 'Edges from implicit START are emitted by graph builder automatically.'
  }
};

const StartOperatorConfig: React.FC<StartOperatorConfigProps> = ({
  config,
  setConfig
}) => {
  const { runtimeType } = useRuntimeContext();
  const [showCodeSnippet, setShowCodeSnippet] = useState<boolean>(false);
  
  const handleChange = (field: keyof StartConfig, value: any) => {
    setConfig({
      ...config,
      [field]: value
    });
    
    // Special handling for trigger_type changes
    if (field === 'trigger_type') {
      // Reset resume capability for system trigger in Autogen
      if (runtimeType === 'autogen' && value === 'system') {
        setConfig({
          ...config,
          trigger_type: value,
          resume_capable: false
        });
      }
      // Reset event-specific fields when changing from event
      else if (config.trigger_type === 'event' && value !== 'event') {
        setConfig({
          ...config,
          trigger_type: value,
          event_source: undefined,
          event_topic: undefined
        });
      }
      // Set default event source when changing to event
      else if (value === 'event') {
        setConfig({
          ...config,
          trigger_type: value,
          event_source: 'webhook'
        });
      }
      else {
        setConfig({
          ...config,
          trigger_type: value
        });
      }
    }
  };
  
  return (
    <Box>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <FormLabel component="legend">Trigger Type</FormLabel>
          <RadioGroup
            value={config.trigger_type || 'human'}
            onChange={(e) => handleChange('trigger_type', e.target.value as TriggerType)}
          >
            {Object.entries(triggerTypeDescriptions).map(([type, description]) => {
              const isDisabled = runtimeType === 'autogen' && (type === 'multi' || type === 'event');
              
              return (
                <FormControlLabel 
                  key={type} 
                  value={type} 
                  control={<Radio />} 
                  label={
                    <Box>
                      <Typography variant="body1">
                        {type.charAt(0).toUpperCase() + type.slice(1)} Trigger
                        {isDisabled && " (Not supported in Autogen)"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {description}
                      </Typography>
                    </Box>
                  } 
                  disabled={isDisabled}
                />
              );
            })}
          </RadioGroup>
        </FormControl>
      </Paper>
      
      {/* Event-specific configuration */}
      {config.trigger_type === 'event' && (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Event Configuration
          </Typography>
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="event-source-label">Event Source</InputLabel>
            <Select
              labelId="event-source-label"
              value={config.event_source || 'webhook'}
              label="Event Source"
              onChange={(e) => handleChange('event_source', e.target.value)}
            >
              <MenuItem value="webhook">Webhook</MenuItem>
              <MenuItem value="mq">Message Queue</MenuItem>
              <MenuItem value="cron">Scheduled (Cron)</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label={config.event_source === 'cron' ? 'Cron Expression' : 'Event Topic/Path'}
            value={config.event_topic || ''}
            onChange={(e) => handleChange('event_topic', e.target.value)}
            margin="normal"
            variant="outlined"
            placeholder={config.event_source === 'cron' ? '0 * * * *' : config.event_source === 'mq' ? 'topic.name' : '/webhook/path'}
            helperText={config.event_source === 'cron' ? 'Cron schedule expression' : 'Topic name or endpoint path'}
          />
        </Paper>
      )}
      
      {/* Multi-start configuration */}
      {config.trigger_type === 'multi' && runtimeType === 'langgraph' && (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={config.wait_for_all_start_nodes === true}
                onChange={(e) => handleChange('wait_for_all_start_nodes', e.target.checked)}
              />
            }
            label="Wait for All Start Nodes"
          />
          <Typography variant="caption" color="text.secondary" display="block" sx={{ ml: 3 }}>
            LangGraph only: Wait for all start nodes to be triggered before proceeding
          </Typography>
        </Paper>
      )}
      
      {/* Autogen-specific configuration */}
      {runtimeType === 'autogen' && (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Initial Messages
          </Typography>
          <Typography variant="caption" color="text.secondary" paragraph>
            Autogen only: Seed messages for the chat
          </Typography>
          
          <TextField
            fullWidth
            label="Initial System Message"
            value={config.initial_messages?.find(msg => msg.role === 'system')?.content || ''}
            onChange={(e) => {
              const messages = [...(config.initial_messages || [])];
              const systemIndex = messages.findIndex(msg => msg.role === 'system');
              
              if (systemIndex >= 0) {
                messages[systemIndex] = { ...messages[systemIndex], content: e.target.value };
              } else {
                messages.push({ role: 'system', content: e.target.value });
              }
              
              handleChange('initial_messages', messages);
            }}
            margin="normal"
            variant="outlined"
            multiline
            rows={2}
            placeholder="Enter system instructions"
          />
          
          <TextField
            fullWidth
            label="Initial User Message"
            value={config.initial_messages?.find(msg => msg.role === 'user')?.content || ''}
            onChange={(e) => {
              const messages = [...(config.initial_messages || [])];
              const userIndex = messages.findIndex(msg => msg.role === 'user');
              
              if (userIndex >= 0) {
                messages[userIndex] = { ...messages[userIndex], content: e.target.value };
              } else {
                messages.push({ role: 'user', content: e.target.value });
              }
              
              handleChange('initial_messages', messages);
            }}
            margin="normal"
            variant="outlined"
            multiline
            rows={2}
            placeholder="Enter initial user message"
          />
        </Paper>
      )}
      
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2">Runtime Notes</Typography>
          <Button
            startIcon={<CodeIcon />}
            size="small"
            onClick={() => setShowCodeSnippet(!showCodeSnippet)}
          >
            {showCodeSnippet ? 'Hide Code' : 'Show Code'}
          </Button>
        </Box>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {runtimeNotes[config.trigger_type || 'human'][runtimeType]}
        </Typography>
        
        {showCodeSnippet && (
          <Card variant="outlined" sx={{ mt: 2, bgcolor: 'background.default' }}>
            <CardContent sx={{ p: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Code snippet for {config.trigger_type || 'human'} trigger in {runtimeType}:
              </Typography>
              <Box 
                component="pre"
                sx={{
                  p: 1,
                  bgcolor: '#f5f5f5',
                  borderRadius: 1,
                  overflow: 'auto',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  m: 0
                }}
              >
                <code>{emitStartBoilerplate(config.trigger_type || 'human', runtimeType, config.resume_capable || false)}</code>
              </Box>
            </CardContent>
          </Card>
        )}
      </Paper>
      
      <Paper variant="outlined" sx={{ p: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={config.resume_capable === true}
              onChange={(e) => handleChange('resume_capable', e.target.checked)}
              disabled={runtimeType === 'autogen' && config.trigger_type === 'system'}
            />
          }
          label="Resume Capable"
        />
        <Typography variant="caption" color="text.secondary" display="block" sx={{ ml: 3 }}>
          Enable workflow to be resumed after interruption
        </Typography>
      </Paper>
    </Box>
  );
};

export default StartOperatorConfig;
