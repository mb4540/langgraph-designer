import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Divider, 
  Breadcrumbs, 
  Link,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

// Sample data for work-groups
const sampleWorkGroups = [
  { id: 1, name: 'Marketing Team', owner: 'John Smith', scope: 'Public', access: 'Admin', description: 'Work-group for marketing team workflows and agents' },
  { id: 2, name: 'Sales Automation', owner: 'Sarah Johnson', scope: 'Restricted', access: 'Editor', description: 'Sales process automation workflows' },
  { id: 3, name: 'Customer Support', owner: 'Michael Brown', scope: 'Public', access: 'Viewer', description: 'Customer support automation and agent workflows' },
  { id: 4, name: 'Research Team', owner: 'Emily Davis', scope: 'Restricted', access: 'Admin', description: 'Research and development workflow group' },
  { id: 5, name: 'Executive Dashboard', owner: 'Robert Wilson', scope: 'Restricted', access: 'Viewer', description: 'Executive reporting and analytics workflows' },
];

const AccountsPage: React.FC = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [workGroups, setWorkGroups] = useState(sampleWorkGroups);
  const [newWorkGroup, setNewWorkGroup] = useState({
    name: '',
    scope: 'Restricted',
    description: ''
  });
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Handle opening and closing the dialog
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewWorkGroup({ name: '', scope: 'Restricted', description: '' });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewWorkGroup(prev => ({ ...prev, [name]: value }));
  };

  // Handle radio button changes
  const handleScopeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewWorkGroup(prev => ({ ...prev, scope: e.target.value }));
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
    
    const newGroup = {
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
      <Paper 
        elevation={0}
        sx={{ 
          py: 1, 
          px: 3, 
          borderRadius: 0, 
          borderBottom: '1px solid', 
          borderColor: 'divider',
          backgroundColor: 'background.paper'
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Link 
            component={RouterLink} 
            to="/" 
            color="inherit" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              '&:hover': { color: '#009FDB' }
            }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Home
          </Link>
          <Typography 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              color: '#009FDB',
              fontWeight: 500
            }}
          >
            <AccountBalanceIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Manage Workflow Accounts
          </Typography>
        </Breadcrumbs>
      </Paper>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
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

        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            borderRadius: 2, 
            border: '1px solid', 
            borderColor: 'divider',
            mb: 4
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <FormControl component="fieldset">
              <RadioGroup 
                row 
                name="filterType" 
                value={filterType} 
                onChange={handleFilterTypeChange}
              >
                <FormControlLabel value="all" control={<Radio />} label="All Work-groups" />
                <FormControlLabel value="my" control={<Radio />} label="My Work-groups" />
              </RadioGroup>
            </FormControl>
            <TextField
              placeholder="Filter work-groups..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 300 }}
            />
          </Box>

          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Owner</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Scope</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>My Access</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredWorkGroups
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((group) => (
                  <TableRow key={group.id} hover>
                    <TableCell>{group.name}</TableCell>
                    <TableCell>{group.owner}</TableCell>
                    <TableCell>
                      {group.scope === 'Public' ? (
                        <Chip 
                          icon={<PublicIcon />} 
                          label="Public" 
                          size="small" 
                          sx={{ backgroundColor: 'rgba(0, 159, 219, 0.1)', color: '#009FDB' }}
                        />
                      ) : (
                        <Chip 
                          icon={<LockIcon />} 
                          label="Restricted" 
                          size="small" 
                          sx={{ backgroundColor: 'rgba(0, 56, 143, 0.1)', color: '#00388f' }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={group.access} 
                        size="small" 
                        sx={{ 
                          backgroundColor: 
                            group.access === 'Admin' ? 'rgba(145, 220, 0, 0.1)' : 
                            group.access === 'Editor' ? 'rgba(0, 159, 219, 0.1)' : 
                            'rgba(0, 56, 143, 0.1)',
                          color: 
                            group.access === 'Admin' ? '#91DC00' : 
                            group.access === 'Editor' ? '#009FDB' : 
                            '#00388f'
                        }}
                      />
                    </TableCell>
                    <TableCell>{group.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredWorkGroups.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Container>

      {/* Create New Work-group Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Work-group</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Work-group Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newWorkGroup.name}
              onChange={handleInputChange}
              sx={{ mb: 3 }}
            />
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Scope</Typography>
              <RadioGroup 
                row 
                name="scope" 
                value={newWorkGroup.scope} 
                onChange={handleScopeChange}
              >
                <FormControlLabel 
                  value="Restricted" 
                  control={<Radio />} 
                  label="Restricted" 
                />
                <FormControlLabel 
                  value="Public" 
                  control={<Radio />} 
                  label="Public" 
                />
              </RadioGroup>
            </FormControl>
            <TextField
              margin="dense"
              name="description"
              label="Work-group Description"
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={newWorkGroup.description}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog} variant="outlined">Cancel</Button>
          <Button 
            onClick={handleSaveWorkGroup} 
            variant="contained"
            disabled={!newWorkGroup.name.trim()}
            sx={{ 
              backgroundColor: '#00388f',
              '&:hover': { backgroundColor: '#002a6b' }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountsPage;
