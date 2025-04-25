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
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  SelectChangeEvent,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { WorkGroup } from '../types/workGroup';

interface WorkGroupUsersTabProps {
  workGroup: WorkGroup;
}

// Interface for entity-role pair
interface EntityRolePair {
  entity: string;
  role: string;
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
  const handleIdTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIdType(event.target.value);
  };

  const handleUserIdsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserIds(event.target.value);
  };

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

  const handleClientEntityChange = (event: SelectChangeEvent) => {
    setClientEntity(event.target.value as string);
  };

  const handleClientRoleChange = (event: SelectChangeEvent) => {
    setClientRole(event.target.value as string);
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
          <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
            <FormLabel component="legend" sx={{ mb: 1 }}>ID Type</FormLabel>
            <RadioGroup 
              row 
              name="idType" 
              value={idType} 
              onChange={handleIdTypeChange}
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
            <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
              <FormLabel component="legend" sx={{ mb: 1 }}>Access Level</FormLabel>
              <RadioGroup 
                row 
                name="accessType" 
                value={accessType} 
                onChange={handleAccessTypeChange}
              >
                <FormControlLabel value="partial" control={<Radio />} label="Partial Access" />
                <FormControlLabel value="admin" control={<Radio />} label="Admin" />
              </RadioGroup>
            </FormControl>
          )}

          {idType === 'attId' && accessType === 'partial' && (
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

          {idType === 'clientId' && (
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <FormControl sx={{ minWidth: 120, flex: 1 }}>
                <InputLabel id="client-entity-select-label">Entity</InputLabel>
                <Select
                  labelId="client-entity-select-label"
                  value={clientEntity}
                  label="Entity"
                  onChange={handleClientEntityChange}
                >
                  <MenuItem value="Project">Project</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl sx={{ minWidth: 120, flex: 1 }}>
                <InputLabel id="client-role-select-label">Role</InputLabel>
                <Select
                  labelId="client-role-select-label"
                  value={clientRole}
                  label="Role"
                  onChange={handleClientRoleChange}
                >
                  <MenuItem value="Execute">Execute</MenuItem>
                </Select>
              </FormControl>
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
