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
import { DecisionOperatorConfig as DecisionConfig } from '../../../../types/nodeTypes';
import { useWorkflowContext } from '../../../../context/WorkflowContext';
import { FormField } from '../common';
import { CodeEditor } from '../common';

interface DecisionOperatorConfigProps {
  config: DecisionConfig;
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
    
    const newBranches = [
      ...(config.branches || []),
      { label: newBranchLabel, target: newBranchTarget }
    ];
    
    handleChange('branches', newBranches);
    setNewBranchLabel('');
    setNewBranchTarget('');
  };
  
  const handleRemoveBranch = (index: number) => {
    const newBranches = [...(config.branches || [])];
    newBranches.splice(index, 1);
    handleChange('branches', newBranches);
  };
  
  const getLanguageExample = () => {
    const language = config.predicate_language || 'javascript';
    return PREDICATE_LANGUAGES.find(lang => lang.value === language)?.example || '';
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Decision Configuration
      </Typography>
      
      <FormField
        label="Predicate Language"
        required
        helperText="Language used to evaluate the decision expression"
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
      </FormField>
      
      <FormField
        label="Decision Expression"
        required
        helperText={`Expression to evaluate (e.g., ${getLanguageExample()})`}
      >
        <CodeEditor
          value={config.expression || ''}
          onChange={(value) => handleChange('expression', value)}
          language={config.predicate_language || 'javascript'}
          height="120px"
        />
      </FormField>
      
      <FormField
        label="Confidence Threshold"
        helperText="Minimum confidence level required (0-1)"
      >
        <TextField
          fullWidth
          type="number"
          value={config.confidence_threshold || ''}
          onChange={(e) => handleChange('confidence_threshold', e.target.value ? parseFloat(e.target.value) : undefined)}
          size="small"
          inputProps={{ min: 0, max: 1, step: 0.1 }}
        />
      </FormField>
      
      <FormField
        label="Default Branch"
        helperText="Node to use when no branch conditions are met"
      >
        <FormControl fullWidth size="small">
          <Select
            value={config.default_branch || ''}
            onChange={(e) => handleChange('default_branch', e.target.value)}
            displayEmpty
          >
            <MenuItem value=""><em>None (Fail if no match)</em></MenuItem>
            {nodes.map(node => (
              <MenuItem key={node.id} value={node.id}>
                {node.name || `${node.type} ${node.id.slice(0, 8)}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </FormField>
      
      <FormField
        label="Watch Keys"
        helperText="Comma-separated list of state keys to watch for changes"
      >
        <TextField
          fullWidth
          value={(config.watch_keys || []).join(', ')}
          onChange={(e) => handleChange('watch_keys', e.target.value.split(',').map(k => k.trim()).filter(Boolean))}
          size="small"
          placeholder="key1, key2, key3"
        />
      </FormField>
      
      <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
        Decision Branches
      </Typography>
      
      {/* Existing branches */}
      {(config.branches || []).length > 0 && (
        <Box sx={{ mb: 2 }}>
          {(config.branches || []).map((branch, index) => (
            <Paper key={index} variant="outlined" sx={{ p: 2, mb: 1 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <Typography variant="body2" fontWeight="bold">
                    {branch.label}
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body2">
                    Target: {nodes.find(n => n.id === branch.target)?.name || branch.target}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => handleRemoveBranch(index)}
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
              label="Branch Label"
              value={newBranchLabel}
              onChange={(e) => setNewBranchLabel(e.target.value)}
              size="small"
              placeholder="success"
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
                    {node.name || `${node.type} ${node.id.slice(0, 8)}`}
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
            disabled={!newBranchLabel || !newBranchTarget}
            size="small"
          >
            Add Branch
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default DecisionOperatorConfig;
