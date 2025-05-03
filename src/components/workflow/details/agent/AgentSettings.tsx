import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { AgentSetting } from '../../../../types/nodeTypes';
import { FormField } from '../common';

// Data type options
const DATA_TYPES = [
  'String',
  'Number',
  'Boolean',
  'JSON',
  'Array',
  'Date'
];

interface AgentSettingsProps {
  settings: AgentSetting[];
  onSettingsChange: (settings: AgentSetting[]) => void;
}

/**
 * A component for managing agent settings including adding, editing, and removing settings
 */
const AgentSettings: React.FC<AgentSettingsProps> = ({
  settings,
  onSettingsChange
}) => {
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [newSetting, setNewSetting] = useState<AgentSetting>({
    key: '',
    dataType: '',
    defaultValue: '',
    description: '',
    allowedValues: [],
    isRequired: false,
    isSecret: false,
    isRuntimeConfig: false
  });
  const [newAllowedValue, setNewAllowedValue] = useState('');
  const [keyError, setKeyError] = useState('');
  const [dataTypeError, setDataTypeError] = useState('');

  // Handle adding a new setting
  const handleAddSetting = () => {
    // Validate required fields
    let hasError = false;
    
    if (!newSetting.key) {
      setKeyError('Key is required');
      hasError = true;
    } else {
      setKeyError('');
    }
    
    if (!newSetting.dataType) {
      setDataTypeError('Data type is required');
      hasError = true;
    } else {
      setDataTypeError('');
    }
    
    if (hasError) return;
    
    // Add the new setting
    const updatedSettings = [...settings, { ...newSetting }];
    onSettingsChange(updatedSettings);
    
    // Reset the form
    setNewSetting({
      key: '',
      dataType: '',
      defaultValue: '',
      description: '',
      allowedValues: [],
      isRequired: false,
      isSecret: false,
      isRuntimeConfig: false
    });
    setNewAllowedValue('');
  };

  // Handle removing a setting
  const handleRemoveSetting = (index: number) => {
    const updatedSettings = [...settings];
    updatedSettings.splice(index, 1);
    onSettingsChange(updatedSettings);
  };

  // Handle adding an allowed value
  const handleAddAllowedValue = () => {
    if (!newAllowedValue) return;
    
    setNewSetting({
      ...newSetting,
      allowedValues: [...newSetting.allowedValues, newAllowedValue]
    });
    
    setNewAllowedValue('');
  };

  // Handle removing an allowed value
  const handleRemoveAllowedValue = (index: number) => {
    const updatedAllowedValues = [...newSetting.allowedValues];
    updatedAllowedValues.splice(index, 1);
    
    setNewSetting({
      ...newSetting,
      allowedValues: updatedAllowedValues
    });
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer',
          mb: 2
        }}
        onClick={() => setSettingsExpanded(!settingsExpanded)}
      >
        <Typography variant="h6" component="h3">
          Agent Settings
        </Typography>
        <IconButton size="small" sx={{ ml: 1 }}>
          {settingsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {settingsExpanded && (
        <Box>
          {/* Existing settings list */}
          {settings.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Current Settings
              </Typography>
              
              <Grid container spacing={2}>
                {settings.map((setting, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography variant="subtitle2">
                              {setting.key}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Type: {setting.dataType}
                            </Typography>
                            {setting.description && (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                {setting.description}
                              </Typography>
                            )}
                            {setting.defaultValue && (
                              <Typography variant="body2">
                                Default: {setting.defaultValue}
                              </Typography>
                            )}
                            {setting.allowedValues && setting.allowedValues.length > 0 && (
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2">Allowed values:</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                  {setting.allowedValues.map((value, i) => (
                                    <Chip key={i} label={value} size="small" />
                                  ))}
                                </Box>
                              </Box>
                            )}
                            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {setting.isRequired && <Chip label="Required" size="small" color="primary" />}
                              {setting.isSecret && <Chip label="Secret" size="small" color="secondary" />}
                              {setting.isRuntimeConfig && <Chip label="Runtime" size="small" color="info" />}
                            </Box>
                          </Box>
                          <IconButton 
                            onClick={() => handleRemoveSetting(index)}
                            color="error"
                            size="small"
                          >
                            <RemoveCircleIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Add new setting form */}
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Add New Setting
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormField
                  label="Setting Key"
                  required
                  error={!!keyError}
                  helperText={keyError}
                >
                  <TextField
                    fullWidth
                    value={newSetting.key}
                    onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
                    placeholder="E.g., api_key, max_tokens"
                    size="small"
                  />
                </FormField>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormField
                  label="Data Type"
                  required
                  error={!!dataTypeError}
                  helperText={dataTypeError}
                >
                  <FormControl fullWidth size="small">
                    <Select
                      value={newSetting.dataType}
                      onChange={(e) => setNewSetting({ ...newSetting, dataType: e.target.value })}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>Select a data type</MenuItem>
                      {DATA_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </FormField>
              </Grid>
              
              <Grid item xs={12}>
                <FormField label="Description">
                  <TextField
                    fullWidth
                    value={newSetting.description}
                    onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
                    placeholder="Describe what this setting is used for"
                    size="small"
                    multiline
                    rows={2}
                  />
                </FormField>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormField label="Default Value">
                  <TextField
                    fullWidth
                    value={newSetting.defaultValue}
                    onChange={(e) => setNewSetting({ ...newSetting, defaultValue: e.target.value })}
                    placeholder="Default value (optional)"
                    size="small"
                  />
                </FormField>
              </Grid>
              
              <Grid item xs={12}>
                <FormField label="Allowed Values">
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <TextField
                      value={newAllowedValue}
                      onChange={(e) => setNewAllowedValue(e.target.value)}
                      placeholder="Add allowed value"
                      size="small"
                      sx={{ flexGrow: 1 }}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleAddAllowedValue}
                      disabled={!newAllowedValue}
                      size="small"
                    >
                      Add
                    </Button>
                  </Box>
                  
                  {newSetting.allowedValues.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                      {newSetting.allowedValues.map((value, index) => (
                        <Chip
                          key={index}
                          label={value}
                          onDelete={() => handleRemoveAllowedValue(index)}
                          size="small"
                        />
                      ))}
                    </Box>
                  )}
                </FormField>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newSetting.isRequired}
                        onChange={(e) => setNewSetting({ ...newSetting, isRequired: e.target.checked })}
                      />
                    }
                    label="Required"
                  />
                  
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newSetting.isSecret}
                        onChange={(e) => setNewSetting({ ...newSetting, isSecret: e.target.checked })}
                      />
                    }
                    label="Secret Value"
                  />
                  
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newSetting.isRuntimeConfig}
                        onChange={(e) => setNewSetting({ ...newSetting, isRuntimeConfig: e.target.checked })}
                      />
                    }
                    label="Runtime Configuration"
                  />
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddSetting}
                disabled={!newSetting.key || !newSetting.dataType}
              >
                Add Setting
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default AgentSettings;
