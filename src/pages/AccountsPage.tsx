import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AddIcon from '@mui/icons-material/Add';

import Header from '../components/Header';
import BreadcrumbNavigation from '../components/BreadcrumbNavigation';
import WorkGroupTable from '../components/WorkGroupTable';
import CreateWorkGroupDialog from '../components/CreateWorkGroupDialog';
import WorkGroupDetailsDialog from '../components/WorkGroupDetailsDialog';
import RequestAccessDialog from '../components/RequestAccessDialog';
import ApprovalRequestsDialog from '../components/ApprovalRequestsDialog';
import AccessRequestDetailsDialog from '../components/AccessRequestDetailsDialog';
import { WorkGroup, sampleWorkGroups, EntityRolePair, AccessRequest, sampleAccessRequests } from '../types/workGroup';

// Import custom hooks
import { useWorkGroups } from '../hooks/useWorkGroups';
import { useDialogState } from '../hooks/useDialogState';
import { useSnackbar } from '../hooks/useSnackbar';

/**
 * Component for managing work groups and access requests
 */
const AccountsPage: React.FC = () => {
  // Navigation
  const navigate = useNavigate();
  
  // Custom hooks for state management
  const {
    workGroups,
    accessRequests,
    createWorkGroup,
    updateWorkGroup,
    submitAccessRequest,
    approveRequest,
    rejectRequest
  } = useWorkGroups(sampleWorkGroups, sampleAccessRequests);

  // Dialog states using custom hook
  const createDialog = useDialogState();
  const detailsDialog = useDialogState<WorkGroup>();
  const requestAccessDialog = useDialogState<WorkGroup>();
  const approvalsDialog = useDialogState<WorkGroup>();
  const requestDetailsDialog = useDialogState<AccessRequest>();

  // Snackbar state using custom hook
  const { 
    snackbarOpen, 
    snackbarMessage, 
    snackbarSeverity, 
    showSnackbar, 
    closeSnackbar 
  } = useSnackbar();

  // Table and filtering state
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // Form state
  const [newWorkGroup, setNewWorkGroup] = useState({
    name: '',
    scope: 'Restricted' as 'Public' | 'Restricted',
    description: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // ===== Filter and Search Functions =====
  
  /**
   * Filter work-groups based on filter type and search query
   */
  const getFilteredWorkGroups = () => {
    return workGroups.filter(group => {
      // Filter by ownership if 'my' is selected
      if (filterType === 'my' && group.owner !== 'Current User') {
        return false;
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          group.name.toLowerCase().includes(query) ||
          group.description.toLowerCase().includes(query) ||
          group.owner.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  };

  const handleFilterTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterType(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // ===== Pagination Functions =====
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ===== Create Work Group Functions =====
  
  const handleOpenCreateDialog = () => {
    createDialog.open();
  };

  const handleCloseCreateDialog = () => {
    createDialog.close();
    setNewWorkGroup({ name: '', scope: 'Restricted', description: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewWorkGroup(prev => ({ ...prev, [name]: value }));
  };

  const handleScopeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewWorkGroup(prev => ({ ...prev, scope: e.target.value as 'Public' | 'Restricted' }));
  };

  const handleSaveWorkGroup = () => {
    if (newWorkGroup.name.trim() === '') return;
    
    // Create the new work group using the hook
    createWorkGroup({
      name: newWorkGroup.name,
      owner: 'Current User', // In a real app, this would come from authentication
      scope: newWorkGroup.scope,
      description: newWorkGroup.description
    });
    
    showSnackbar('Work group created successfully');
    handleCloseCreateDialog();
  };

  // ===== Details Dialog Functions =====
  
  const handleOpenDetailsDialog = (workGroup: WorkGroup) => {
    setEditMode(workGroup.access === 'Admin');
    setActiveTab(0); // Reset to first tab
    detailsDialog.open(workGroup);
  };

  const handleCloseDetailsDialog = () => {
    detailsDialog.close();
    setEditMode(false);
    setActiveTab(0); // Reset to first tab when closing
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!detailsDialog.data) return;
    
    const { name, value } = e.target;
    detailsDialog.updateData({
      ...detailsDialog.data,
      [name]: value
    });
  };

  const handleEditScopeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!detailsDialog.data) return;
    
    detailsDialog.updateData({
      ...detailsDialog.data,
      scope: e.target.value as 'Public' | 'Restricted'
    });
  };

  const handleSaveEditedWorkGroup = () => {
    if (!detailsDialog.data || detailsDialog.data.name.trim() === '') return;
    
    // Update the work group using the hook
    updateWorkGroup(detailsDialog.data.id, detailsDialog.data);
    
    showSnackbar('Work group updated successfully');
    handleCloseDetailsDialog();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // ===== Access Request Functions =====
  
  const handleOpenRequestAccessDialog = (workGroup: WorkGroup) => {
    requestAccessDialog.open(workGroup);
  };

  const handleCloseRequestAccessDialog = () => {
    requestAccessDialog.close();
  };

  const handleSubmitAccessRequest = (accessType: string, entityRolePairs: EntityRolePair[]) => {
    if (!requestAccessDialog.data) return;

    // Submit the access request using the hook
    submitAccessRequest(
      requestAccessDialog.data.id, 
      accessType as 'partial' | 'admin', 
      entityRolePairs
    );

    // Show success message
    showSnackbar('Access request submitted successfully');
    handleCloseRequestAccessDialog();
  };

  // ===== Approval Functions =====
  
  const handleOpenApprovalsDialog = (workGroup: WorkGroup) => {
    approvalsDialog.open(workGroup);
  };

  const handleCloseApprovalsDialog = () => {
    approvalsDialog.close();
  };

  const handleApproveRequest = (requestId: number) => {
    // Approve the request using the hook
    approveRequest(requestId);
    
    // Show success message
    showSnackbar('Access request approved');
  };

  const handleRejectRequest = (requestId: number) => {
    // Reject the request using the hook
    rejectRequest(requestId);
    
    // Show success message
    showSnackbar('Access request rejected');
  };

  // ===== Request Details Functions =====
  
  const handleOpenRequestDetailsDialog = (request: AccessRequest) => {
    requestDetailsDialog.open(request);
  };

  const handleCloseRequestDetailsDialog = () => {
    requestDetailsDialog.close();
  };

  // Get filtered work groups for the table
  const filteredWorkGroups = getFilteredWorkGroups();

  // ===== Render UI =====
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        {/* Page Header */}
        <PageHeader onCreateNew={handleOpenCreateDialog} />
        
        {/* Work Group Table */}
        <WorkGroupTable 
          workGroups={filteredWorkGroups}
          filterType={filterType}
          searchQuery={searchQuery}
          page={page}
          rowsPerPage={rowsPerPage}
          onFilterTypeChange={handleFilterTypeChange}
          onSearchChange={handleSearchChange}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          onOpenDetails={handleOpenDetailsDialog}
          onRequestAccess={handleOpenRequestAccessDialog}
          onViewApprovals={handleOpenApprovalsDialog}
        />
        
        {/* Dialogs */}
        <CreateWorkGroupDialog 
          open={createDialog.isOpen}
          newWorkGroup={newWorkGroup}
          onClose={handleCloseCreateDialog}
          onInputChange={handleInputChange}
          onScopeChange={handleScopeChange}
          onSave={handleSaveWorkGroup}
        />
        
        {detailsDialog.data && (
          <WorkGroupDetailsDialog 
            open={detailsDialog.isOpen}
            workGroup={detailsDialog.data}
            editMode={editMode}
            activeTab={activeTab}
            onClose={handleCloseDetailsDialog}
            onSave={handleSaveEditedWorkGroup}
            onTabChange={handleTabChange}
            onInputChange={handleEditInputChange}
            onScopeChange={handleEditScopeChange}
          />
        )}

        <RequestAccessDialog
          open={requestAccessDialog.isOpen}
          workGroup={requestAccessDialog.data}
          onClose={handleCloseRequestAccessDialog}
          onSubmit={handleSubmitAccessRequest}
        />

        <ApprovalRequestsDialog
          open={approvalsDialog.isOpen}
          workGroup={approvalsDialog.data}
          accessRequests={accessRequests}
          onClose={handleCloseApprovalsDialog}
          onApprove={handleApproveRequest}
          onReject={handleRejectRequest}
          onViewDetails={handleOpenRequestDetailsDialog}
        />

        <AccessRequestDetailsDialog
          open={requestDetailsDialog.isOpen}
          request={requestDetailsDialog.data}
          onClose={handleCloseRequestDetailsDialog}
        />

        {/* Snackbar Notifications */}
        <Snackbar 
          open={snackbarOpen} 
          autoHideDuration={6000} 
          onClose={closeSnackbar}
        >
          <Alert 
            severity={snackbarSeverity} 
            variant="filled" 
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

/**
 * Page header component with title and create button
 */
const PageHeader: React.FC<{ onCreateNew: () => void }> = ({ onCreateNew }) => {
  return (
    <>
      {/* Breadcrumb Navigation */}
      <BreadcrumbNavigation 
        currentPage="Manage Workflow Accounts" 
        icon={<AccountBalanceIcon sx={{ mr: 0.5 }} fontSize="inherit" />} 
      />
      
      {/* Header with create button */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
            Work-groups
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={onCreateNew}
            sx={{ 
              backgroundColor: '#00388f',
              '&:hover': { backgroundColor: '#002a6b' }
            }}
          >
            Create New
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Manage your workflow work-groups and their access settings
        </Typography>
      </Paper>
    </>
  );
};

export default AccountsPage;
