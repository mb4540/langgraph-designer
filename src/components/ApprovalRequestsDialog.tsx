import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { WorkGroup, AccessRequest, EntityRolePair } from '../types/workGroup';

interface ApprovalRequestsDialogProps {
  open: boolean;
  workGroup: WorkGroup | null;
  accessRequests: AccessRequest[];
  onClose: () => void;
  onApprove: (requestId: number) => void;
  onReject: (requestId: number) => void;
  onViewDetails: (request: AccessRequest) => void;
}

const ApprovalRequestsDialog: React.FC<ApprovalRequestsDialogProps> = ({
  open,
  workGroup,
  accessRequests,
  onClose,
  onApprove,
  onReject,
  onViewDetails
}) => {
  if (!workGroup) return null;

  const filteredRequests = accessRequests.filter(
    request => request.workGroupId === workGroup.id && request.status === 'Pending'
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Pending Access Requests for {workGroup.name}</Typography>
          <Button variant="outlined" onClick={onClose}>Close</Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        {filteredRequests.length === 0 ? (
          <Typography sx={{ py: 4, textAlign: 'center' }} color="text.secondary">
            No pending access requests for this work-group.
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Requestor ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Requested Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id} hover>
                    <TableCell>{request.requestorName}</TableCell>
                    <TableCell>{request.requestorId}</TableCell>
                    <TableCell>{request.requestedDate}</TableCell>
                    <TableCell>
                      <Chip 
                        label={request.status} 
                        size="small" 
                        sx={{ 
                          backgroundColor: 'rgba(255, 152, 0, 0.1)',
                          color: '#FF9800'
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small" 
                            onClick={() => onViewDetails(request)}
                            sx={{ color: '#009FDB' }}
                          >
                            <InfoOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Approve">
                          <IconButton 
                            size="small" 
                            onClick={() => onApprove(request.id)}
                            sx={{ color: '#91DC00' }}
                          >
                            <CheckCircleOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton 
                            size="small" 
                            onClick={() => onReject(request.id)}
                            sx={{ color: '#f44336' }}
                          >
                            <CancelOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApprovalRequestsDialog;
