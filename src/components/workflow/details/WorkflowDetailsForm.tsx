import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useWorkflowContext } from '../../../context/WorkflowContext';

interface WorkflowDetails {
  name: string;
  description: string;
}

const WorkflowDetailsForm: React.FC = () => {
  const [formData, setFormData] = useState<WorkflowDetails>({
    name: 'My Workflow',
    description: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  // In a real implementation, we would get and update workflow details from a store
  // For now, we'll just use local state as a placeholder

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Here we would update the workflow details in the store
    // For now, we'll just toggle editing mode
    setIsEditing(false);
    
    // In a real implementation, we would save the workflow details to the store
    // Example: updateWorkflowDetails(formData);
  };

  const handleCancel = () => {
    // Reset form and exit editing mode
    setIsEditing(false);
    // In a real implementation, we would reset to the stored values
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Workflow Details
      </Typography>
      
      <TextField
        label="Workflow Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        variant="outlined"
        disabled={!isEditing}
      />
      
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        fullWidth
        margin="normal"
        variant="outlined"
        multiline
        rows={4}
        disabled={!isEditing}
        placeholder="Enter a description for your workflow"
      />
      
      {isEditing ? (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} color="primary">
            Save Changes
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" onClick={() => setIsEditing(true)} color="primary">
            Edit Details
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default WorkflowDetailsForm;
