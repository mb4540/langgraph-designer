import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import Divider from '@mui/material/Divider';
import { WorkflowNode, OperatorType, TriggerType } from '../../../types/nodeTypes';
import { useWorkflowContext } from '../../../context/WorkflowContext';
import ActionButtons from '../../ui/ActionButtons';

interface OperatorDetailsFormProps {
  node: WorkflowNode;
}

const OperatorDetailsForm: React.FC<OperatorDetailsFormProps> = ({ node }) => {
  const { updateNode } = useWorkflowContext();
  
  // Form state
  const [name, setName] = useState(node.name || '');
  const [operatorType, setOperatorType] = useState<OperatorType>(node.operatorType || OperatorType.Sequential);
  const [description, setDescription] = useState(node.content || '');
  const [triggerType, setTriggerType] = useState<TriggerType>(node.triggerType || 'human');
  const [resumeCapable, setResumeCapable] = useState<boolean>(node.resumeCapable || false);

  // Update form when node changes
  useEffect(() => {
    setName(node.name || '');
    setOperatorType(node.operatorType || OperatorType.Sequential);
    setDescription(node.content || '');
    setTriggerType(node.triggerType || 'human');
    setResumeCapable(node.resumeCapable || false);
  }, [node]);

  const handleSave = () => {
    // Update node with form values
    const updates: Partial<WorkflowNode> = {
      name,
      operatorType,
      content: description,
    };

    // Only add START-specific properties if the operator type is START
    if (operatorType === OperatorType.Start) {
      updates.triggerType = triggerType;
      updates.resumeCapable = resumeCapable;
    }

    updateNode(node.id, updates);
  };

  const handleCancel = () => {
    // Reset form to original values
    setName(node.name || '');
    setOperatorType(node.operatorType || OperatorType.Sequential);
    setDescription(node.content || '');
    setTriggerType(node.triggerType || 'human');
    setResumeCapable(node.resumeCapable || false);
  };

  // Expose the functions to save and cancel changes
  useEffect(() => {
    // Track if there are unsaved changes
    const isModified = 
      name !== (node.name || '') ||
      operatorType !== (node.operatorType || OperatorType.Sequential) ||
      description !== (node.content || '') ||
      (operatorType === OperatorType.Start && triggerType !== (node.triggerType || 'human')) ||
      (operatorType === OperatorType.Start && resumeCapable !== (node.resumeCapable || false));

    // Expose functions for the DetailsPanel to call
    (window as any).saveNodeChanges = handleSave;
    (window as any).cancelNodeChanges = handleCancel;
    (window as any).isNodeModified = isModified;

    return () => {
      // Clean up
      delete (window as any).saveNodeChanges;
      delete (window as any).cancelNodeChanges;
      delete (window as any).isNodeModified;
    };
  }, [name, operatorType, description, triggerType, resumeCapable, node]);

  // Render START operator specific fields
  const renderStartOperatorFields = () => {
    if (operatorType !== OperatorType.Start) return null;

    return (
      <Box sx={{ mt: 3 }}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" gutterBottom>
          Start Operator Configuration
        </Typography>
        
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <FormLabel component="legend">Trigger Type</FormLabel>
          <RadioGroup
            value={triggerType}
            onChange={(e) => setTriggerType(e.target.value as TriggerType)}
          >
            <FormControlLabel value="human" control={<Radio />} label="Human Trigger" />
            <FormControlLabel value="system" control={<Radio />} label="System Trigger" />
            <FormControlLabel value="event" control={<Radio />} label="Event Trigger" />
            <FormControlLabel value="multi" control={<Radio />} label="Multi Trigger" />
          </RadioGroup>
        </FormControl>
        
        <FormControlLabel
          control={
            <Switch
              checked={resumeCapable}
              onChange={(e) => setResumeCapable(e.target.checked)}
            />
          }
          label="Resume Capable"
        />
        <Typography variant="caption" color="text.secondary" display="block" sx={{ ml: 3 }}>
          Enable workflow to be resumed after interruption
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle1" gutterBottom>
        Basic Information
      </Typography>
      
      <TextField
        fullWidth
        label="Operator Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
        variant="outlined"
      />
      
      <FormControl fullWidth margin="normal">
        <InputLabel id="operator-type-label">Operator Type</InputLabel>
        <Select
          labelId="operator-type-label"
          value={operatorType}
          label="Operator Type"
          onChange={(e) => setOperatorType(e.target.value as OperatorType)}
        >
          {Object.values(OperatorType).map((type) => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </Select>
      </FormControl>
      
      {/* Render START operator specific fields */}
      {renderStartOperatorFields()}
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
        Description
      </Typography>
      
      <TextField
        fullWidth
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        variant="outlined"
        placeholder="Enter a description for this operator"
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <ActionButtons
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </Box>
    </Box>
  );
};

export default OperatorDetailsForm;
