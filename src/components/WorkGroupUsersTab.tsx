import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  Radio,
  FormControlLabel,
  TextField,
  FormControl,
  SelectChangeEvent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { WorkGroup } from '../types/workGroup';
import AccessLevelSelector from './forms/AccessLevelSelector';
import EntityRoleSelector, { EntityRolePair } from './forms/EntityRoleSelector';
import IdTypeSelector from './forms/IdTypeSelector';

interface WorkGroupUsersTabProps {
  workGroup: WorkGroup;
}

const WorkGroupUsersTab: React.FC<WorkGroupUsersTabProps> = ({ workGroup }) => {
  // Sample user data - in a real app, this would come from an API or props
  const sampleUsers = [
    { id: 'user1@example.com', access: 'Admin' },
    { id: 'user2@example.com', access: 'Editor' },
  ];

  // State for the Add User dialog
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [idType, setIdType] = useState('attId');
  const [userIds, setUserIds] = useState('');
  const [accessType, setAccessType] = useState('admin');
  const [entityRolePairs, setEntityRolePairs] = useState<EntityRolePair[]>([
    { entity: 'Skill', role: 'Read' }
  ]);
  const [clientEntity, setClientEntity] = useState('Project');
  const [clientRole, setClientRole] = useState('Execute');

  // Handle opening and closing the Add User dialog
  const handleOpenAddUserDialog = () => setAddUserDialogOpen(true);
  const handleCloseAddUserDialog = () => {
    setAddUserDialogOpen(false);
    // Reset form state
    setIdType('attId');
    setUserIds('');
    setAccessType('admin');
    setEntityRolePairs([{ entity: 'Skill', role: 'Read' }]);
  };

  // Handle form input changes
  const handleIdTypeChange = (value: string) => {
    setIdType(value);
  };

  const handleUserIdsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserIds(event.target.value);
  };

  const handleAccessTypeChange = (value: string) => {
    setAccessType(value);
  };

  const handleClientEntityChange = (event: SelectChangeEvent) => {
    setClientEntity(event.target.value as string);
  };

  const handleClientRoleChange = (event: SelectChangeEvent) => {
    setClientRole(event.target.value as string);
  };

  // Handle adding users
  const handleAddUsers = () => {
    // In a real app, this would call an API to add users
    console.log('Adding users:', {
      idType,
      userIds,
      accessType: idType === 'attId' ? accessType : null,
      entityRolePairs: idType === 'attId' && accessType === 'partial' ? entityRolePairs : null,
      clientEntity: idType === 'clientId' ? clientEntity : null,
      clientRole: idType === 'clientId' ? clientRole : null
    });
    handleCloseAddUserDialog();
  };

  return (
    <Box sx={{ pt: 1 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3 
      }}>
        <Typography variant="h6">{workGroup.name}</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleOpenAddUserDialog}
          sx={{ 
            backgroundColor: '#00388f',
            '&:hover': { backgroundColor: '#002a6b' },
            color: 'white'
          }}
        >
          Add User
        </Button>
      </Box>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Access</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.access} 
                    size="small" 
                    sx={{ 
                      backgroundColor: 
                        user.access === 'Admin' ? 'rgba(145, 220, 0, 0.1)' : 
                        user.access === 'Editor' ? 'rgba(0, 159, 219, 0.1)' : 
                        'rgba(0, 56, 143, 0.1)',
                      color: 
                        user.access === 'Admin' ? '#91DC00' : 
                        user.access === 'Editor' ? '#009FDB' : 
                        '#00388f'
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add User Dialog */}
      <Dialog open={addUserDialogOpen} onClose={handleCloseAddUserDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add User to {workGroup.name}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {/* ID Type Selector */}
          <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
            <RadioGroup 
              row 
              name="idType" 
              value={idType} 
              onChange={(e) => handleIdTypeChange(e.target.value)}
            >
              <FormControlLabel value="attId" control={<Radio />} label="ATT ID" />
              <FormControlLabel value="clientId" control={<Radio />} label="Client ID" />
            </RadioGroup>
          </FormControl>

          <TextField
            margin="dense"
            fullWidth
            label={idType === 'attId' ? "Enter ATT UID(s) separated by comma" : "Enter Client ID"}
            value={userIds}
            onChange={handleUserIdsChange}
            sx={{ mb: 3 }}
          />

          {idType === 'attId' && (
            <AccessLevelSelector
              value={accessType}
              onChange={handleAccessTypeChange}
              options={[
                { value: 'partial', label: 'Partial Access' },
                { value: 'admin', label: 'Admin' }
              ]}
              sx={{ mb: 3, width: '100%' }}
            />
          )}

          {idType === 'attId' && accessType === 'partial' && (
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

          {idType === 'clientId' && (
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <IdTypeSelector
                value={clientEntity}
                onChange={(value) => setClientEntity(value)}
                options={[
                  { value: 'Project', label: 'Project', description: 'Project entity type' }
                ]}
                label="Entity"
                sx={{ flex: 1 }}
              />
              
              <IdTypeSelector
                value={clientRole}
                onChange={(value) => setClientRole(value)}
                options={[
                  { value: 'Execute', label: 'Execute', description: 'Execute permission' }
                ]}
                label="Role"
                sx={{ flex: 1 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseAddUserDialog} variant="outlined">Cancel</Button>
          <Button 
            onClick={handleAddUsers} 
            variant="contained"
            disabled={!userIds.trim()}
            sx={{ 
              backgroundColor: '#00388f',
              '&:hover': { backgroundColor: '#002a6b' }
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkGroupUsersTab;
