import React from 'react';
import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Toolbar from '@mui/material/Toolbar';

export interface Column<T> {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row: T) => React.ReactNode;
}

interface TableProps<T> {
  /** Table title */
  title?: string;
  
  /** Column definitions */
  columns: Column<T>[];
  
  /** Row data */
  rows: T[];
  
  /** Unique identifier for each row */
  getRowId: (row: T) => string;
  
  /** Optional callback when a row is clicked */
  onRowClick?: (row: T) => void;
  
  /** Optional flag to enable search */
  enableSearch?: boolean;
  
  /** Optional search placeholder */
  searchPlaceholder?: string;
  
  /** Optional callback when search query changes */
  onSearchChange?: (query: string) => void;
  
  /** Optional flag to enable pagination */
  enablePagination?: boolean;
  
  /** Optional default rows per page */
  defaultRowsPerPage?: number;
  
  /** Optional rows per page options */
  rowsPerPageOptions?: number[];
  
  /** Optional total count for server-side pagination */
  totalCount?: number;
  
  /** Optional callback for page change */
  onPageChange?: (page: number) => void;
  
  /** Optional callback for rows per page change */
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  
  /** Optional current page for controlled pagination */
  page?: number;
  
  /** Optional loading state */
  loading?: boolean;
  
  /** Optional empty state message */
  emptyMessage?: string;
}

/**
 * A reusable table component with standardized styling and behavior
 */
function Table<T>({ 
  title,
  columns,
  rows,
  getRowId,
  onRowClick,
  enableSearch = false,
  searchPlaceholder = 'Search...',
  onSearchChange,
  enablePagination = false,
  defaultRowsPerPage = 10,
  rowsPerPageOptions = [5, 10, 25, 50],
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  page: controlledPage,
  loading = false,
  emptyMessage = 'No data available'
}: TableProps<T>) {
  // Local state for uncontrolled pagination
  const [localPage, setLocalPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(defaultRowsPerPage);
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Determine if pagination is controlled or uncontrolled
  const isControlled = controlledPage !== undefined;
  const page = isControlled ? controlledPage : localPage;
  
  // Handle page change
  const handleChangePage = (_event: unknown, newPage: number) => {
    if (!isControlled) {
      setLocalPage(newPage);
    }
    if (onPageChange) {
      onPageChange(newPage);
    }
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    if (!isControlled) {
      setRowsPerPage(newRowsPerPage);
      setLocalPage(0);
    }
    if (onRowsPerPageChange) {
      onRowsPerPageChange(newRowsPerPage);
    }
  };
  
  // Handle search query change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (onSearchChange) {
      onSearchChange(query);
    }
  };
  
  // Calculate displayed rows based on pagination
  const displayedRows = enablePagination && !isControlled
    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : rows;
  
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Table toolbar with title and search */}
      {(title || enableSearch) && (
        <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
          {title && (
            <Typography
              sx={{ flex: '1 1 100%' }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              {title}
            </Typography>
          )}
          
          {enableSearch && (
            <TextField
              variant="outlined"
              size="small"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ ml: 2 }}
            />
          )}
        </Toolbar>
      )}
      
      {/* Table container */}
      <TableContainer sx={{ maxHeight: 440 }}>
        <MuiTable stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth || 100 }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedRows.length > 0 ? (
              displayedRows.map((row) => {
                const rowId = getRowId(row);
                return (
                  <TableRow 
                    hover 
                    role="checkbox" 
                    tabIndex={-1} 
                    key={rowId}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                  >
                    {columns.map((column) => {
                      const value = (row as any)[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format ? column.format(value, row) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  {loading ? 'Loading...' : emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>
      
      {/* Pagination */}
      {enablePagination && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={totalCount || rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
}

export default Table;
