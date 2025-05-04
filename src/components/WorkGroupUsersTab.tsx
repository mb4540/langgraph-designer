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
  SelectChangeEvent,
  Tooltip,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import { WorkGroup, WorkGroupUser, sampleWorkGroupUsers } from '../types/workGroup';
import AccessLevelSelector from './forms/AccessLevelSelector';
import EntityRoleSelector, { EntityRolePair } from './forms/EntityRoleSelector';
import IdTypeSelector from './forms/IdTypeSelector';

interface WorkGroupUsersTabProps {
  workGroup: WorkGroup;
}

const WorkGroupUsersTab: React.FC<WorkGroupUsersTabProps> = ({ workGroup }) => {
  // Get users for this work group from sample data
  const users = sampleWorkGroupUsers[workGroup.id] || [];

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

  // Function to determine validation status and get appropriate UI elements
  const getValidationStatus = (daysRemaining: number) => {
    // Validation status based on days remaining
    if (daysRemaining > 28) {
      return {
        icon: <CheckCircleIcon fontSize="small" sx={{ color: '#91DC00' }} />,
        color: '#91DC00',
        backgroundColor: 'rgba(145, 220, 0, 0.1)',
        label: `${daysRemaining} days`,
        tooltip: 'User validation is current'
      };
    } else if (daysRemaining > 21) {
      return {
        icon: <WarningIcon fontSize="small" sx={{ color: '#FFC107' }} />,
        color: '#FFC107',
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        label: `${daysRemaining} days`,
        tooltip: '1st warning: User validation will expire in 28 days'
      };
    } else if (daysRemaining > 14) {
      return {
        icon: <WarningIcon fontSize="small" sx={{ color: '#FF9800' }} />,
        color: '#FF9800',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        label: `${daysRemaining} days`,
        tooltip: '2nd warning: User validation will expire in 21 days'
      };
    } else if (daysRemaining > 7) {
      return {
        icon: <WarningIcon fontSize="small" sx={{ color: '#F44336' }} />,
        color: '#F44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        label: `${daysRemaining} days`,
        tooltip: '3rd warning: User validation will expire in 14 days - escalation required'
      };
    } else if (daysRemaining > 0) {
      return {
        icon: <ErrorIcon fontSize="small" sx={{ color: '#D32F2F' }} />,
        color: '#D32F2F',
        backgroundColor: 'rgba(211, 47, 47, 0.1)',
        label: `${daysRemaining} days`,
        tooltip: 'Final warning: User access will be removed in 7 days if not validated'
      };
    } else {
      return {
        icon: <ErrorIcon fontSize="small" sx={{ color: '#B71C1C' }} />,
        color: '#B71C1C',
        backgroundColor: 'rgba(183, 28, 28, 0.1)',
        label: 'Expired',
        tooltip: 'User validation has expired - access will be removed'
      };
    }
  };

  // Function to handle user validation
  const handleValidateUser = (userId: string) => {
    console.log(`Validating user: ${userId}`);
    // In a real app, this would call an API to reset the validation counter to 153 days
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
              <TableCell sx={{ fontWeight: 600 }}>Validation Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Last Validated</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              const validationStatus = getValidationStatus(user.validationDaysRemaining);
              return (
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
                  <TableCell>
                    <Tooltip title={validationStatus.tooltip}>
                      <Chip
                        icon={validationStatus.icon}
                        label={validationStatus.label}
                        size="small"
                        sx={{
                          backgroundColor: validationStatus.backgroundColor,
                          color: validationStatus.color
                        }}
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {user.lastValidated ? new Date(user.lastValidated).toLocaleDateString() : 'Never'}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Validate User Access">
                      <IconButton 
                        size="small" 
                        onClick={() => handleValidateUser(user.id)}
                        sx={{ color: '#00388f' }}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
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
