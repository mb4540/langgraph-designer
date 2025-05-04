import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { ParallelForkOperatorConfig as ParallelForkConfig, OperatorType } from '../../../../types/nodeTypes';
import { useWorkflowContext } from '../../../../context/WorkflowContext';
import { FormField } from '../common';

interface ParallelForkOperatorConfigProps {
  config: ParallelForkConfig;
  onConfigChange: (config: ParallelForkConfig) => void;
}

// Extended config interface with UI-specific properties
interface ExtendedParallelForkConfig extends ParallelForkConfig {
  join_node_id?: string;
  wait_for_all?: boolean;
  timeout_seconds?: number;
  branches?: Record<string, string>;
}

/**
 * Component for configuring a parallel fork operator
 */
const ParallelForkOperatorConfig: React.FC<ParallelForkOperatorConfigProps> = ({
  config,
  onConfigChange
}) => {
  const { nodes } = useWorkflowContext();
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchTarget, setNewBranchTarget] = useState('');
  
  // Cast config to extended type for UI properties
  const extendedConfig = config as ExtendedParallelForkConfig;
  
  const handleChange = (field: keyof ExtendedParallelForkConfig, value: any) => {
    onConfigChange({
      ...extendedConfig,
      [field]: value
    } as ParallelForkConfig);
  };
  
  const handleAddBranch = () => {
    if (!newBranchName || !newBranchTarget) return;
    
    const newBranches = {
      ...(extendedConfig.branches || {}),
      [newBranchName]: newBranchTarget
    };
    
    handleChange('branches', newBranches);
    setNewBranchName('');
    setNewBranchTarget('');
  };
  
  const handleRemoveBranch = (branchName: string) => {
    const newBranches = { ...(extendedConfig.branches || {}) };
    delete newBranches[branchName];
    handleChange('branches', newBranches);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Parallel Fork Configuration
      </Typography>
      
      <FormField
        label="Join Node ID"
        helperText="ID of the parallel join node that will collect results from all branches"
      >
        <FormControl fullWidth size="small">
          <Select
            value={extendedConfig.join_node_id || ''}
            onChange={(e) => handleChange('join_node_id', e.target.value)}
            displayEmpty
          >
            <MenuItem value=""><em>Select a join node</em></MenuItem>
            {nodes
              .filter(node => node.operatorType === OperatorType.ParallelJoin)
              .map(node => (
                <MenuItem key={node.id} value={node.id}>
                  {node.name || `Join ${node.id.slice(0, 8)}`}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </FormField>
      
      <FormField label="Branch Completion">
        <FormControlLabel
          control={
            <Checkbox
              checked={extendedConfig.wait_for_all ?? true}
              onChange={(e) => handleChange('wait_for_all', e.target.checked)}
            />
          }
          label="Wait for All Branches"
        />
        <Typography variant="caption" color="text.secondary" display="block">
          Wait for all parallel branches to complete before continuing
        </Typography>
      </FormField>
      
      <FormField
        label="Timeout (seconds)"
        helperText="Maximum time to wait for all branches to complete (0 = no timeout)"
      >
        <TextField
          fullWidth
          type="number"
          value={extendedConfig.timeout_seconds || ''}
          onChange={(e) => handleChange('timeout_seconds', e.target.value ? parseInt(e.target.value) : undefined)}
          size="small"
          inputProps={{ min: 0 }}
          placeholder="0"
        />
      </FormField>
      
      <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
        Parallel Branches
      </Typography>
      
      {/* Existing branches */}
      {Object.keys(extendedConfig.branches || {}).length > 0 && (
        <Box sx={{ mb: 2 }}>
          {Object.entries(extendedConfig.branches || {}).map(([branchName, targetId]) => (
            <Paper key={branchName} variant="outlined" sx={{ p: 2, mb: 1 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <Typography variant="body2" fontWeight="bold">
                    {branchName}
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body2">
                    Target: {nodes.find(n => n.id === targetId)?.name || targetId}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => handleRemoveBranch(branchName)}
                    aria-label="remove branch"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Box>
      )}
      
      {/* Add new branch */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Add New Branch
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Branch Name"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              size="small"
              placeholder="branch_1"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="new-branch-target-label">Target Node</InputLabel>
              <Select
                labelId="new-branch-target-label"
                label="Target Node"
                value={newBranchTarget}
                onChange={(e) => setNewBranchTarget(e.target.value)}
              >
                {nodes.map(node => (
                  <MenuItem key={node.id} value={node.id}>
                    {node.name || `${node.operatorType} ${node.id.slice(0, 8)}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddBranch}
            disabled={!newBranchName || !newBranchTarget}
            size="small"
          >
            Add Branch
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ParallelForkOperatorConfig;
