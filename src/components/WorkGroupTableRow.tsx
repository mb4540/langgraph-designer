import React from 'react';
import { TableRow, TableCell, Chip, Link, Tooltip, Box } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { WorkGroup } from '../types/workGroup';

interface WorkGroupTableRowProps {
  group: WorkGroup;
  onOpenDetails: (group: WorkGroup) => void;
}

const WorkGroupTableRow: React.FC<WorkGroupTableRowProps> = ({ group, onOpenDetails }) => {
  return (
    <TableRow hover>
      <TableCell>
        <Link
          component="button"
          variant="body2"
          onClick={() => onOpenDetails(group)}
          sx={{ 
            textAlign: 'left',
            fontWeight: 500,
            color: '#00388f',
            textDecoration: 'none',
            '&:hover': { 
              textDecoration: 'underline',
              color: '#009FDB'
            },
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {group.name}
          <Tooltip title={group.access === 'Admin' ? 'Edit work-group' : 'View details'}>
            <Box component="span" sx={{ display: 'inline-flex', ml: 1, color: 'text.secondary' }}>
              {group.access === 'Admin' ? 
                <EditIcon fontSize="small" sx={{ fontSize: 16 }} /> : 
                <VisibilityIcon fontSize="small" sx={{ fontSize: 16 }} />}
            </Box>
          </Tooltip>
        </Link>
      </TableCell>
      <TableCell>{group.owner}</TableCell>
      <TableCell>
        {group.scope === 'Public' ? (
          <Chip 
            icon={<PublicIcon fontSize="small" />} 
            label="Public" 
            size="small" 
            sx={{ backgroundColor: 'rgba(0, 159, 219, 0.1)', color: '#009FDB' }}
          />
        ) : (
          <Chip 
            icon={<LockIcon fontSize="small" />} 
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
  );
};

export default WorkGroupTableRow;
