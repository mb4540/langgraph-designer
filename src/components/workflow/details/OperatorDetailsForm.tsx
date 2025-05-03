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
import { WorkflowNode, OperatorType } from '../../../types/nodeTypes';
import { useWorkflowContext } from '../../../context/WorkflowContext';

interface OperatorDetailsFormProps {
  node: WorkflowNode;
}

const OperatorDetailsForm: React.FC<OperatorDetailsFormProps> = ({ node }) => {
  const { updateNode } = useWorkflowContext();
  
  // Form state
  const [name, setName] = useState(node.name || '');
  const [operatorType, setOperatorType] = useState<OperatorType>(node.operatorType || OperatorType.Sequential);
  const [description, setDescription] = useState(node.content || '');

  // Update form when node changes
  useEffect(() => {
    setName(node.name || '');
    setOperatorType(node.operatorType || OperatorType.Sequential);
    setDescription(node.content || '');
  }, [node]);

  const handleSave = () => {
    // Update node with form values
    updateNode(node.id, {
      name,
      operatorType,
      content: description,
    });
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
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default OperatorDetailsForm;
