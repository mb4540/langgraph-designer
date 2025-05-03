import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { WorkflowNode, OperatorType, TriggerType } from '../../../types/nodeTypes';
import { useWorkflowContext } from '../../../context/WorkflowContext';
import { useRuntimeContext } from '../../../context/RuntimeContext';
import ActionButtons from '../../ui/ActionButtons';
import StartOperatorConfig from './StartOperatorConfig';

interface OperatorDetailsFormProps {
  node: WorkflowNode;
}

const OperatorDetailsForm: React.FC<OperatorDetailsFormProps> = ({ node }) => {
  const { updateNode } = useWorkflowContext();
  const { runtimeType, runtimeSettings, updateRuntimeSettings } = useRuntimeContext();
  
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

  // Handle resume capability change
  const handleResumeCapableChange = (capable: boolean) => {
    setResumeCapable(capable);
    
    // If enabling resume capability, ensure checkpoint store is configured
    if (capable && (!runtimeSettings || !runtimeSettings.checkpointStore)) {
      updateRuntimeSettings({
        ...runtimeSettings,
        checkpointStore: 'memory' // Default to memory store
      });
    }
  };

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
      {operatorType === OperatorType.Start && (
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Start Operator Configuration
          </Typography>
          <StartOperatorConfig 
            triggerType={triggerType}
            setTriggerType={(type) => {
              setTriggerType(type);
              // Reset resume capability for system trigger in Autogen
              if (runtimeType === 'autogen' && type === 'system') {
                setResumeCapable(false);
              }
            }}
            resumeCapable={resumeCapable}
            setResumeCapable={handleResumeCapableChange}
          />
        </Box>
      )}
      
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
