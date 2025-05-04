import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

interface AgentVersionControlProps {
  version: string;
  onVersionChange: (version: string) => void;
  availableVersions?: string[];
  onPublishVersion?: () => void;
}

/**
 * Component for managing agent versions
 */
export const AgentVersionControl: React.FC<AgentVersionControlProps> = ({
  version,
  onVersionChange,
  availableVersions = [],
  onPublishVersion
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={8}>
          <FormControl fullWidth size="small">
            <InputLabel id="agent-version-label">Version</InputLabel>
            <Select
              labelId="agent-version-label"
              value={version}
              onChange={(e) => onVersionChange(e.target.value as string)}
              label="Version"
            >
              {availableVersions.length > 0 ? (
                availableVersions.map((v) => (
                  <MenuItem key={v} value={v}>
                    {v}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value={version}>{version}</MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={4}>
          {onPublishVersion && (
            <Button 
              variant="outlined" 
              size="small" 
              onClick={onPublishVersion}
              fullWidth
            >
              Publish New Version
            </Button>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AgentVersionControl;
