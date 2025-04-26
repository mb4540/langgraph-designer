import React from 'react';
import { 
  Box, 
  FormControl, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  InputAdornment,
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  TablePagination 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WorkGroupTableRow from './WorkGroupTableRow';
import { WorkGroup } from '../types/workGroup';
import Card from './ui/Card';
import TextField from './ui/TextField';

interface WorkGroupTableProps {
  workGroups: WorkGroup[];
  filterType: string;
  searchQuery: string;
  page: number;
  rowsPerPage: number;
  onFilterTypeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangePage: (event: unknown, newPage: number) => void;
  onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenDetails: (group: WorkGroup) => void;
  onRequestAccess: (group: WorkGroup) => void;
  onViewApprovals: (group: WorkGroup) => void;
}

const WorkGroupTable: React.FC<WorkGroupTableProps> = ({
  workGroups,
  filterType,
  searchQuery,
  page,
  rowsPerPage,
  onFilterTypeChange,
  onSearchChange,
  onChangePage,
  onChangeRowsPerPage,
  onOpenDetails,
  onRequestAccess,
  onViewApprovals
}) => {
  return (
    <Card sx={{ p: 3, mt: 3 }} subtle={false} bordered>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <FormControl component="fieldset">
          <RadioGroup 
            row 
            name="filterType" 
            value={filterType} 
            onChange={onFilterTypeChange}
          >
            <FormControlLabel value="all" control={<Radio />} label="All Work-groups" />
            <FormControlLabel value="my" control={<Radio />} label="My Work-groups" />
          </RadioGroup>
        </FormControl>
        <TextField
          placeholder="Search work-groups..."
          size="small"
          value={searchQuery}
          onChange={onSearchChange}
          startIcon={<SearchIcon />}
          highlightOnFocus
        />
      </Box>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Owner</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Scope</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>My Access</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Pending Approvals</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Request Access</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workGroups
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((group) => (
                <WorkGroupTableRow 
                  key={group.id} 
                  group={group} 
                  onOpenDetails={onOpenDetails}
                  onRequestAccess={onRequestAccess}
                  onViewApprovals={onViewApprovals}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={workGroups.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
    </Card>
  );
};

export default WorkGroupTable;
