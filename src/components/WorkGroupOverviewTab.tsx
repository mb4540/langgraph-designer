import React from 'react';
import { Box, TextField, FormControl, Typography, RadioGroup, FormControlLabel, Radio, Chip } from '@mui/material';
import { WorkGroup } from '../types/workGroup';

interface WorkGroupOverviewTabProps {
  workGroup: WorkGroup;
  editMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onScopeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const WorkGroupOverviewTab: React.FC<WorkGroupOverviewTabProps> = ({ 
  workGroup, 
  editMode, 
  onInputChange, 
  onScopeChange 
}) => {
  return (
    <Box sx={{ pt: 1 }}>
      <TextField
        margin="dense"
        name="name"
        label="Work-group Name"
        type="text"
        fullWidth
        variant="outlined"
        value={workGroup.name}
        onChange={onInputChange}
        disabled={!editMode}
        sx={{ mb: 3 }}
      />
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Scope</Typography>
        <RadioGroup 
          row 
          name="scope" 
          value={workGroup.scope} 
          onChange={onScopeChange}
        >
          <FormControlLabel 
            value="Restricted" 
            control={<Radio />} 
            label="Restricted" 
            disabled={!editMode}
          />
          <FormControlLabel 
            value="Public" 
            control={<Radio />} 
            label="Public" 
            disabled={!editMode}
          />
        </RadioGroup>
      </FormControl>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Owner</Typography>
        <Typography variant="body1">{workGroup.owner}</Typography>
      </Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>My Access</Typography>
        <Chip 
          label={workGroup.access} 
          size="small" 
          sx={{ 
            backgroundColor: 
              workGroup.access === 'Admin' ? 'rgba(145, 220, 0, 0.1)' : 
              workGroup.access === 'Editor' ? 'rgba(0, 159, 219, 0.1)' : 
              'rgba(0, 56, 143, 0.1)',
            color: 
              workGroup.access === 'Admin' ? '#91DC00' : 
              workGroup.access === 'Editor' ? '#009FDB' : 
              '#00388f'
          }}
        />
      </Box>
      <TextField
        margin="dense"
        name="description"
        label="Work-group Description"
        type="text"
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        value={workGroup.description}
        onChange={onInputChange}
        disabled={!editMode}
      />
    </Box>
  );
};

export default WorkGroupOverviewTab;
