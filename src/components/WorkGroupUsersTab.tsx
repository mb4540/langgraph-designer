import React from 'react';
import { Box, Typography, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { WorkGroup } from '../types/workGroup';

interface WorkGroupUsersTabProps {
  workGroup: WorkGroup;
}

const WorkGroupUsersTab: React.FC<WorkGroupUsersTabProps> = ({ workGroup }) => {
  // Sample user data - in a real app, this would come from an API or props
  const sampleUsers = [
    { id: 'user1@example.com', access: 'Admin' },
    { id: 'user2@example.com', access: 'Editor' },
  ];

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
    </Box>
  );
};

export default WorkGroupUsersTab;
