import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab
} from '@mui/material';
import WorkGroupOverviewTab from './WorkGroupOverviewTab';
import WorkGroupUsersTab from './WorkGroupUsersTab';
import { WorkGroup } from '../types/workGroup';

interface WorkGroupDetailsDialogProps {
  open: boolean;
  workGroup: WorkGroup;
  editMode: boolean;
  activeTab: number;
  onClose: () => void;
  onSave: () => void;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onScopeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const WorkGroupDetailsDialog: React.FC<WorkGroupDetailsDialogProps> = ({
  open,
  workGroup,
  editMode,
  activeTab,
  onClose,
  onSave,
  onTabChange,
  onInputChange,
  onScopeChange
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editMode ? 'Edit Work-group' : 'Work-group Details'}
      </DialogTitle>
      <Tabs
        value={activeTab}
        onChange={onTabChange}
        sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}
      >
        <Tab label="Overview" />
        <Tab label="Users" />
      </Tabs>
      <DialogContent>
        {/* Overview Tab */}
        {activeTab === 0 && (
          <WorkGroupOverviewTab 
            workGroup={workGroup}
            editMode={editMode}
            onInputChange={onInputChange}
            onScopeChange={onScopeChange}
          />
        )}
        
        {/* Users Tab */}
        {activeTab === 1 && (
          <WorkGroupUsersTab workGroup={workGroup} />
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined">
          {editMode ? 'Cancel' : 'Close'}
        </Button>
        {editMode && activeTab === 0 && (
          <Button 
            onClick={onSave} 
            variant="contained"
            disabled={!workGroup.name.trim()}
            sx={{ 
              backgroundColor: '#00388f',
              '&:hover': { backgroundColor: '#002a6b' }
            }}
          >
            Save Changes
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default WorkGroupDetailsDialog;
