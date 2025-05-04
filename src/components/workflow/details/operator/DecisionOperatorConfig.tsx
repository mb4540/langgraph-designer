import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import { DecisionOperatorConfig as DecisionConfig } from '../../../../types/nodeTypes';
import { useWorkflowContext } from '../../../../context/WorkflowContext';
import { FormField } from '../common';
import { CodeEditor } from '../common';

interface DecisionOperatorConfigProps {
  config: DecisionConfig;
  nodeId: string;
  onConfigChange: (config: DecisionConfig) => void;
}

// Predicate language options
const PREDICATE_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', example: 'state.temperature > 30' },
  { value: 'python', label: 'Python', example: 'state["temperature"] > 30' },
  { value: 'jmespath', label: 'JMESPath', example: 'temperature > `30`' }
];

/**
 * Component for configuring a decision operator
 */
const DecisionOperatorConfig: React.FC<DecisionOperatorConfigProps> = ({
  config,
  nodeId,
  onConfigChange
}) => {
  const { nodes } = useWorkflowContext();
  const [newBranchLabel, setNewBranchLabel] = useState('');
  const [newBranchTarget, setNewBranchTarget] = useState('');
  
  const handleChange = (field: keyof DecisionConfig, value: any) => {
    onConfigChange({
      ...config,
      [field]: value
    });
  };
  
  const handleAddBranch = () => {
    if (!newBranchLabel || !newBranchTarget) return;
    
    const newBranches = [...(config.branches || [])];
    newBranches.push({
      label: newBranchLabel,
      target: newBranchTarget
    });
    
    handleChange('branches', newBranches);
    setNewBranchLabel('');
    setNewBranchTarget('');
  };
  
  const handleRemoveBranch = (index: number) => {
    const newBranches = [...(config.branches || [])];
    newBranches.splice(index, 1);
    handleChange('branches', newBranches);
  };
  
  // Get a list of available nodes for branch targets
  const availableNodes = nodes.filter(node => node.id !== nodeId);
  
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Decision Configuration
      </Typography>
      
      <FormField
        label="Predicate Language"
        required
        helperText="Language used for the decision expression"
      >
        <FormControl fullWidth size="small">
          <Select
            value={config.predicate_language || 'javascript'}
            onChange={(e) => handleChange('predicate_language', e.target.value)}
          >
            {PREDICATE_LANGUAGES.map(lang => (
              <MenuItem key={lang.value} value={lang.value}>
                {lang.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          Example: {PREDICATE_LANGUAGES.find(l => l.value === (config.predicate_language || 'javascript'))?.example}
        </Typography>
      </FormField>
      
      <FormField
        label="Decision Expression"
        required
        helperText="Expression that evaluates to determine which branch to take"
      >
        <CodeEditor
          code={config.expression || ''}
          onCodeChange={(value) => handleChange('expression', value)}
          language={config.predicate_language || 'javascript'}
          height="120px"
        />
      </FormField>
      
      <FormField
        label="Confidence Threshold"
        helperText="Minimum confidence level required (0.0-1.0, leave empty for no threshold)"
      >
        <TextField
          fullWidth
          type="number"
          value={config.confidence_threshold || ''}
          onChange={(e) => handleChange('confidence_threshold', e.target.value ? parseFloat(e.target.value) : undefined)}
          size="small"
          inputProps={{ min: 0, max: 1, step: 0.01 }}
          placeholder="0.7"
        />
      </FormField>
      
      <FormField
        label="Default Branch"
        helperText="Target node ID when no branch condition is met"
      >
        <FormControl fullWidth size="small">
          <Select
            value={config.default_branch || ''}
            onChange={(e) => handleChange('default_branch', e.target.value)}
            displayEmpty
          >
            <MenuItem value=""><em>None (stop execution)</em></MenuItem>
            {availableNodes.map(node => (
              <MenuItem key={node.id} value={node.id}>
                {node.name || node.id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </FormField>
      
      <Box sx={{ mt: 3, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Decision Branches
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
          Define the possible branches based on the decision expression
        </Typography>
        
        {/* Existing branches */}
        {(config.branches || []).length > 0 ? (
          <Box sx={{ mb: 2 }}>
            {(config.branches || []).map((branch, index) => (
              <Paper key={index} variant="outlined" sx={{ p: 2, mb: 1 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={5}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {branch.label}
                    </Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography variant="body2" color="text.secondary">
                      Target: {nodes.find(n => n.id === branch.target)?.name || branch.target}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ textAlign: 'right' }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleRemoveBranch(index)}
                      aria-label="Remove branch"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            No branches defined yet. Add at least one branch below.
          </Typography>
        )}
        
        {/* Add new branch */}
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Add New Branch
          </Typography>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Branch Label"
                value={newBranchLabel}
                onChange={(e) => setNewBranchLabel(e.target.value)}
                size="small"
                placeholder="e.g., High Temperature"
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
                  displayEmpty
                >
                  <MenuItem value=""><em>Select a target node</em></MenuItem>
                  {availableNodes.map(node => (
                    <MenuItem key={node.id} value={node.id}>
                      {node.name || node.id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'right' }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddBranch}
                disabled={!newBranchLabel || !newBranchTarget}
              >
                Add Branch
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default DecisionOperatorConfig;
