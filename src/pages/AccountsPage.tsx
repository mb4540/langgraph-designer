import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AddIcon from '@mui/icons-material/Add';

import Header from '../components/Header';
import BreadcrumbNavigation from '../components/BreadcrumbNavigation';
import WorkGroupTable from '../components/WorkGroupTable';
import CreateWorkGroupDialog from '../components/CreateWorkGroupDialog';
import WorkGroupDetailsDialog from '../components/WorkGroupDetailsDialog';
import { WorkGroup, sampleWorkGroups } from '../types/workGroup';

const AccountsPage: React.FC = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [workGroups, setWorkGroups] = useState<WorkGroup[]>(sampleWorkGroups);
  const [newWorkGroup, setNewWorkGroup] = useState({
    name: '',
    scope: 'Restricted' as 'Public' | 'Restricted',
    description: ''
  });
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedWorkGroup, setSelectedWorkGroup] = useState<WorkGroup | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Handle opening and closing the dialog
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewWorkGroup({ name: '', scope: 'Restricted', description: '' });
  };

  // Handle opening work-group details dialog
  const handleOpenDetailsDialog = (workGroup: WorkGroup) => {
    setSelectedWorkGroup(workGroup);
    setEditMode(workGroup.access === 'Admin');
    setDetailsDialogOpen(true);
  };

  // Handle closing work-group details dialog
  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
    setSelectedWorkGroup(null);
    setEditMode(false);
    setActiveTab(0); // Reset to first tab when closing
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewWorkGroup(prev => ({ ...prev, [name]: value }));
  };

  // Handle edit form input changes
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedWorkGroup) return;
    
    const { name, value } = e.target;
    setSelectedWorkGroup(prev => prev ? { ...prev, [name]: value } : null);
  };

  // Handle radio button changes
  const handleScopeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewWorkGroup(prev => ({ ...prev, scope: e.target.value as 'Public' | 'Restricted' }));
  };

  // Handle edit radio button changes
  const handleEditScopeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedWorkGroup) return;
    
    setSelectedWorkGroup(prev => 
      prev ? { ...prev, scope: e.target.value as 'Public' | 'Restricted' } : null
    );
  };

  // Handle filter type change
  const handleFilterTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterType(e.target.value);
  };

  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle save new work-group
  const handleSaveWorkGroup = () => {
    if (newWorkGroup.name.trim() === '') return;
    
    const newGroup: WorkGroup = {
      id: workGroups.length + 1,
      name: newWorkGroup.name,
      owner: 'Current User', // In a real app, this would come from authentication
      scope: newWorkGroup.scope,
      access: 'Admin', // Default access for created groups
      description: newWorkGroup.description
    };
    
    setWorkGroups([...workGroups, newGroup]);
    handleCloseDialog();
  };

  // Handle save edited work-group
  const handleSaveEditedWorkGroup = () => {
    if (!selectedWorkGroup || selectedWorkGroup.name.trim() === '') return;
    
    const updatedWorkGroups = workGroups.map(group => 
      group.id === selectedWorkGroup.id ? selectedWorkGroup : group
    );
    
    setWorkGroups(updatedWorkGroups);
    handleCloseDetailsDialog();
  };

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Filter work-groups based on filter type and search query
  const filteredWorkGroups = workGroups.filter(group => {
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

  // Handle pagination changes
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        {/* Breadcrumb Navigation */}
        <BreadcrumbNavigation 
          currentPage="Manage Workflow Accounts" 
          icon={<AccountBalanceIcon sx={{ mr: 0.5 }} fontSize="inherit" />} 
        />
        
        {/* Page Header */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
              Work-groups
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={handleOpenDialog}
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
        
        {/* Work-group Table */}
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
        />
        
        {/* Create Work-group Dialog */}
        <CreateWorkGroupDialog 
          open={openDialog}
          newWorkGroup={newWorkGroup}
          onClose={handleCloseDialog}
          onInputChange={handleInputChange}
          onScopeChange={handleScopeChange}
          onSave={handleSaveWorkGroup}
        />
        
        {/* Work-group Details/Edit Dialog */}
        {selectedWorkGroup && (
          <WorkGroupDetailsDialog 
            open={detailsDialogOpen}
            workGroup={selectedWorkGroup}
            editMode={editMode}
            activeTab={activeTab}
            onClose={handleCloseDetailsDialog}
            onSave={handleSaveEditedWorkGroup}
            onTabChange={handleTabChange}
            onInputChange={handleEditInputChange}
            onScopeChange={handleEditScopeChange}
          />
        )}
      </Container>
    </Box>
  );
};

export default AccountsPage;
