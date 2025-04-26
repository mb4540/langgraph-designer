import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import { WorkGroup } from '../types/workGroup';
import AccessLevelSelector from './forms/AccessLevelSelector';
import EntityRoleSelector, { EntityRolePair } from './forms/EntityRoleSelector';

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
  useEffect(() => {
    if (open) {
      setAccessType('partial');
      setEntityRolePairs([{ entity: 'Skill', role: 'Read' }]);
    }
  }, [open]);

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
        
        <AccessLevelSelector
          value={accessType}
          onChange={setAccessType}
          options={[
            { value: 'partial', label: 'Partial Access' },
            { value: 'admin', label: 'Admin Access' }
          ]}
          sx={{ mb: 3, width: '100%' }}
        />

        {accessType === 'partial' && (
          <EntityRoleSelector
            entityRolePairs={entityRolePairs}
            onChange={setEntityRolePairs}
            entityOptions={[
              { value: 'Skill', label: 'Skill' },
              { value: 'Team', label: 'Team' },
              { value: 'Agent', label: 'Agent' },
              { value: 'Workflow', label: 'Workflow' }
            ]}
            roleOptions={[
              { value: 'Read', label: 'Read' },
              { value: 'Write', label: 'Write' }
            ]}
          />
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
