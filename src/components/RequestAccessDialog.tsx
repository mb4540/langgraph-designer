import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  SelectChangeEvent,
  Box,
  IconButton,
  Typography
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { WorkGroup } from '../types/workGroup';

interface EntityRolePair {
  entity: string;
  role: string;
}

interface RequestAccessDialogProps {
  open: boolean;
  workGroup: WorkGroup | null;
  onClose: () => void;
  onSubmit: (accessType: string, entityRolePairs: EntityRolePair[]) => void;
}

const RequestAccessDialog: React.FC<RequestAccessDialogProps> = ({
  open,
  workGroup,
  onClose,
  onSubmit
}) => {
  const [accessType, setAccessType] = useState('partial');
  const [entityRolePairs, setEntityRolePairs] = useState<EntityRolePair[]>([
    { entity: 'Skill', role: 'Read' }
  ]);

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (open) {
      setAccessType('partial');
      setEntityRolePairs([{ entity: 'Skill', role: 'Read' }]);
    }
  }, [open]);

  const handleAccessTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccessType(event.target.value);
  };

  const handleEntityChange = (index: number, event: SelectChangeEvent) => {
    const updatedPairs = [...entityRolePairs];
    updatedPairs[index].entity = event.target.value as string;
    setEntityRolePairs(updatedPairs);
  };

  const handleRoleChange = (index: number, event: SelectChangeEvent) => {
    const updatedPairs = [...entityRolePairs];
    updatedPairs[index].role = event.target.value as string;
    setEntityRolePairs(updatedPairs);
  };

  // Handle adding a new entity-role pair row
  const handleAddEntityRolePair = () => {
    setEntityRolePairs([...entityRolePairs, { entity: 'Skill', role: 'Read' }]);
  };

  // Handle removing an entity-role pair row
  const handleRemoveEntityRolePair = (index: number) => {
    const updatedPairs = entityRolePairs.filter((_, i) => i !== index);
    setEntityRolePairs(updatedPairs);
  };

  const handleSubmit = () => {
    onSubmit(accessType, accessType === 'partial' ? entityRolePairs : []);
    onClose();
  };

  if (!workGroup) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Request Access to {workGroup.name}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Request access to this work-group. Your request will be sent to the work-group administrator for approval.
        </Typography>
        
        <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
          <FormLabel component="legend" sx={{ mb: 1 }}>Access Level</FormLabel>
          <RadioGroup 
            row 
            name="accessType" 
            value={accessType} 
            onChange={handleAccessTypeChange}
          >
            <FormControlLabel value="partial" control={<Radio />} label="Partial Access" />
            <FormControlLabel value="admin" control={<Radio />} label="Admin Access" />
          </RadioGroup>
        </FormControl>

        {accessType === 'partial' && (
          <>
            {entityRolePairs.map((pair, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  mb: 2,
                  alignItems: 'center'
                }}
              >
                <FormControl sx={{ minWidth: 120, flex: 1 }}>
                  <InputLabel id={`entity-select-label-${index}`}>Entity</InputLabel>
                  <Select
                    labelId={`entity-select-label-${index}`}
                    value={pair.entity}
                    label="Entity"
                    onChange={(e) => handleEntityChange(index, e)}
                  >
                    <MenuItem value="Skill">Skill</MenuItem>
                    <MenuItem value="Team">Team</MenuItem>
                    <MenuItem value="Agent">Agent</MenuItem>
                    <MenuItem value="Workflow">Workflow</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl sx={{ minWidth: 120, flex: 1 }}>
                  <InputLabel id={`role-select-label-${index}`}>Role</InputLabel>
                  <Select
                    labelId={`role-select-label-${index}`}
                    value={pair.role}
                    label="Role"
                    onChange={(e) => handleRoleChange(index, e)}
                  >
                    <MenuItem value="Read">Read</MenuItem>
                    <MenuItem value="Write">Write</MenuItem>
                  </Select>
                </FormControl>

                {index === 0 ? (
                  <IconButton 
                    onClick={handleAddEntityRolePair}
                    sx={{ color: '#00388f' }}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                ) : (
                  <IconButton 
                    onClick={() => handleRemoveEntityRolePair(index)}
                    sx={{ color: '#00388f' }}
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                )}
              </Box>
            ))}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          sx={{ 
            backgroundColor: '#00388f',
            '&:hover': { backgroundColor: '#002a6b' }
          }}
        >
          Submit Request
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RequestAccessDialog;
