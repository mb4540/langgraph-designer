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
import CodeIcon from '@mui/icons-material/Code';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { TriggerType } from '../../../types/nodeTypes';
import { useRuntimeContext } from '../../../context/RuntimeContext';
import { emitStartBoilerplate } from '../../../codegen/startHelpers';

interface StartOperatorConfigProps {
  triggerType: TriggerType;
  setTriggerType: (type: TriggerType) => void;
  resumeCapable: boolean;
  setResumeCapable: (capable: boolean) => void;
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
  triggerType,
  setTriggerType,
  resumeCapable,
  setResumeCapable
}) => {
  const { runtimeType } = useRuntimeContext();
  const [showCodeSnippet, setShowCodeSnippet] = useState<boolean>(false);
  
  return (
    <Box>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <FormLabel component="legend">Trigger Type</FormLabel>
          <RadioGroup
            value={triggerType}
            onChange={(e) => setTriggerType(e.target.value as TriggerType)}
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
          {runtimeNotes[triggerType][runtimeType]}
        </Typography>
        
        {showCodeSnippet && (
          <Card variant="outlined" sx={{ mt: 2, bgcolor: 'background.default' }}>
            <CardContent sx={{ p: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Code snippet for {triggerType} trigger in {runtimeType}:
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
                <code>{emitStartBoilerplate(triggerType, runtimeType, resumeCapable)}</code>
              </Box>
            </CardContent>
          </Card>
        )}
      </Paper>
      
      <Paper variant="outlined" sx={{ p: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={resumeCapable}
              onChange={(e) => setResumeCapable(e.target.checked)}
              disabled={runtimeType === 'autogen' && triggerType === 'system'}
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
