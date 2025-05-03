import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

interface VersionInfoProps {
  version: string;
  versionedId?: string;
  createdAt?: string;
  onVersionChange?: (version: string) => void;
  readOnly?: boolean;
}

/**
 * A standardized component for displaying and editing version information
 * that can be reused across different node types
 */
const VersionInfo: React.FC<VersionInfoProps> = ({
  version,
  versionedId,
  createdAt,
  onVersionChange,
  readOnly = false
}) => {
  const formattedDate = createdAt 
    ? new Date(createdAt).toLocaleString() 
    : 'Not yet created';

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" fontWeight="medium" sx={{ mb: 0.5 }}>
            Version
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={version}
            onChange={(e) => onVersionChange && onVersionChange(e.target.value)}
            disabled={readOnly}
            helperText="Semantic versioning (MAJOR.MINOR.PATCH)"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" fontWeight="medium" sx={{ mb: 0.5 }}>
            Version ID
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={versionedId || 'Not generated yet'}
            disabled={true}
            helperText={createdAt ? `Created: ${formattedDate}` : 'Will be generated on save'}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default VersionInfo;
