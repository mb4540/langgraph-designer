import React from 'react';
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography
} from '@mui/material';
import Dialog from './ui/Dialog';
import Button from './ui/Button';
import TextField from './ui/TextField';

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
  const actions = (
    <>
      <Button onClick={onClose} variant="outlined" color="default">
        Cancel
      </Button>
      <Button 
        onClick={onSave} 
        color="primary"
        disabled={!newWorkGroup.name.trim()}
      >
        Save
      </Button>
    </>
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      title="Create New Work-group"
      maxWidth="sm"
      fullWidth
      actions={actions}
    >
      <TextField
        autoFocus
        margin="dense"
        name="name"
        label="Work-group Name"
        type="text"
        fullWidth
        value={newWorkGroup.name}
        onChange={onInputChange}
        sx={{ mt: 1, mb: 3 }}
        highlightOnFocus
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
        value={newWorkGroup.description}
        onChange={onInputChange}
        highlightOnFocus
      />
    </Dialog>
  );
};

export default CreateWorkGroupDialog;
