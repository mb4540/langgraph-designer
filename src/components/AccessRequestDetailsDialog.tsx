import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { AccessRequest } from '../types/workGroup';

interface AccessRequestDetailsDialogProps {
  open: boolean;
  request: AccessRequest | null;
  onClose: () => void;
}

const AccessRequestDetailsDialog: React.FC<AccessRequestDetailsDialogProps> = ({
  open,
  request,
  onClose
}) => {
  if (!request) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Access Request Details</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">Requestor</Typography>
          <Typography variant="body1">{request.requestorName}</Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">Requestor ID</Typography>
          <Typography variant="body1">{request.requestorId}</Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">Requested Date</Typography>
          <Typography variant="body1">{request.requestedDate}</Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">Status</Typography>
          <Chip 
            label={request.status} 
            size="small" 
            sx={{ 
              backgroundColor: 
                request.status === 'Pending' ? 'rgba(255, 152, 0, 0.1)' :
                request.status === 'Approved' ? 'rgba(145, 220, 0, 0.1)' :
                'rgba(244, 67, 54, 0.1)',
              color: 
                request.status === 'Pending' ? '#FF9800' :
                request.status === 'Approved' ? '#91DC00' :
                '#f44336'
            }}
          />
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">Access Type</Typography>
          <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
            {request.accessType === 'admin' ? 'Admin Access' : 'Partial Access'}
          </Typography>
        </Box>
        
        {request.accessType === 'partial' && request.entityRolePairs && request.entityRolePairs.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Requested Permissions
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <List dense disablePadding>
              {request.entityRolePairs.map((pair, index) => (
                <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">{pair.entity}</Typography>
                        <Chip 
                          label={pair.role} 
                          size="small" 
                          sx={{ 
                            backgroundColor: 
                              pair.role === 'Read' ? 'rgba(0, 159, 219, 0.1)' : 'rgba(145, 220, 0, 0.1)',
                            color: 
                              pair.role === 'Read' ? '#009FDB' : '#91DC00'
                          }}
                        />
                      </Box>
                    } 
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccessRequestDetailsDialog;
