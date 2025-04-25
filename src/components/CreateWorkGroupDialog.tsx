import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography
} from '@mui/material';

interface CreateWorkGroupDialogProps {
  open: boolean;
  newWorkGroup: {
    name: string;
    scope: 'Public' | 'Restricted';
    description: string;
  };
  onClose: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onScopeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

const CreateWorkGroupDialog: React.FC<CreateWorkGroupDialogProps> = ({
  open,
  newWorkGroup,
  onClose,
  onInputChange,
  onScopeChange,
  onSave
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Work-group</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Work-group Name"
          type="text"
          fullWidth
          variant="outlined"
          value={newWorkGroup.name}
          onChange={onInputChange}
          sx={{ mt: 1, mb: 3 }}
        />
        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Scope</Typography>
          <RadioGroup 
            row 
            name="scope" 
            value={newWorkGroup.scope} 
            onChange={onScopeChange}
          >
            <FormControlLabel 
              value="Restricted" 
              control={<Radio />} 
              label="Restricted" 
            />
            <FormControlLabel 
              value="Public" 
              control={<Radio />} 
              label="Public" 
            />
          </RadioGroup>
        </FormControl>
        <TextField
          margin="dense"
          name="description"
          label="Work-group Description"
          type="text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={newWorkGroup.description}
          onChange={onInputChange}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
        <Button 
          onClick={onSave} 
          variant="contained"
          disabled={!newWorkGroup.name.trim()}
          sx={{ 
            backgroundColor: '#00388f',
            '&:hover': { backgroundColor: '#002a6b' }
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateWorkGroupDialog;
