import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { DecisionOperatorConfig as DecisionConfig } from '../../../types/nodeTypes';
import { useRuntimeContext } from '../../../context/RuntimeContext';
import { useWorkflowContext } from '../../../context/WorkflowContext';

interface DecisionOperatorConfigProps {
  config: DecisionConfig;
  setConfig: (config: DecisionConfig) => void;
}

const DecisionOperatorConfig: React.FC<DecisionOperatorConfigProps> = ({
  config,
  setConfig
}) => {
  const { runtimeType } = useRuntimeContext();
  const { nodes } = useWorkflowContext();
  
  // Local state for new branch
  const [newBranchLabel, setNewBranchLabel] = useState('');
  const [newBranchTarget, setNewBranchTarget] = useState('');
  
  const handleChange = (field: keyof DecisionConfig, value: any) => {
    setConfig({
      ...config,
      [field]: value
    });
  };

  const handleAddBranch = () => {
    if (!newBranchLabel || !newBranchTarget) return;
    
    const updatedBranches = [...(config.branches || [])];
    updatedBranches.push({
      label: newBranchLabel,
      target: newBranchTarget
    });
    
    handleChange('branches', updatedBranches);
    setNewBranchLabel('');
    setNewBranchTarget('');
  };

  const handleRemoveBranch = (index: number) => {
    const updatedBranches = [...(config.branches || [])];
    updatedBranches.splice(index, 1);
    handleChange('branches', updatedBranches);
  };

  const handleAddWatchKey = (key: string) => {
    if (!key) return;
    
    const updatedWatchKeys = [...(config.watch_keys || [])];
    if (!updatedWatchKeys.includes(key)) {
      updatedWatchKeys.push(key);
      handleChange('watch_keys', updatedWatchKeys);
    }
  };

  const handleRemoveWatchKey = (key: string) => {
    const updatedWatchKeys = [...(config.watch_keys || [])];
    const index = updatedWatchKeys.indexOf(key);
    if (index !== -1) {
      updatedWatchKeys.splice(index, 1);
      handleChange('watch_keys', updatedWatchKeys);
    }
  };

  return (
    <Box>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Decision Configuration
        </Typography>
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="predicate-language-label">Predicate Language</InputLabel>
          <Select
            labelId="predicate-language-label"
            value={config.predicate_language || 'javascript'}
            label="Predicate Language"
            onChange={(e) => handleChange('predicate_language', e.target.value)}
            required
          >
            <MenuItem value="javascript">JavaScript</MenuItem>
            <MenuItem value="python">Python</MenuItem>
            <MenuItem value="jmespath">JMESPath</MenuItem>
          </Select>
        </FormControl>
        
        <TextField
          fullWidth
          label="Expression"
          value={config.expression || ''}
          onChange={(e) => handleChange('expression', e.target.value)}
          margin="normal"
          variant="outlined"
          multiline
          rows={3}
          placeholder={`Enter ${config.predicate_language || 'javascript'} expression that evaluates to a branch label or boolean`}
          required
          helperText="Expression must evaluate to a branch label or boolean value"
        />
        
        {runtimeType === 'autogen' && (
          <TextField
            fullWidth
            label="Confidence Threshold"
            type="number"
            value={config.confidence_threshold !== undefined ? config.confidence_threshold : ''}
            onChange={(e) => handleChange('confidence_threshold', e.target.value ? parseFloat(e.target.value) : undefined)}
            margin="normal"
            variant="outlined"
            inputProps={{ min: 0, max: 1, step: 0.01 }}
            helperText="Autogen only: Confidence threshold for auto-routing (0-1)"
          />
        )}
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" gutterBottom>
          Branches
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          {(config.branches || []).map((branch, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TextField
                label="Label"
                value={branch.label}
                onChange={(e) => {
                  const updatedBranches = [...(config.branches || [])];
                  updatedBranches[index].label = e.target.value;
                  handleChange('branches', updatedBranches);
                }}
                sx={{ mr: 1, flex: 1 }}
              />
              <FormControl sx={{ mr: 1, flex: 1 }}>
                <InputLabel id={`target-node-label-${index}`}>Target Node</InputLabel>
                <Select
                  labelId={`target-node-label-${index}`}
                  value={branch.target}
                  label="Target Node"
                  onChange={(e) => {
                    const updatedBranches = [...(config.branches || [])];
                    updatedBranches[index].target = e.target.value as string;
                    handleChange('branches', updatedBranches);
                  }}
                >
                  {nodes.map(node => (
                    <MenuItem key={node.id} value={node.id}>
                      {node.name || `${node.type} ${node.id.slice(0, 8)}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <IconButton onClick={() => handleRemoveBranch(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
          <TextField
            label="New Branch Label"
            value={newBranchLabel}
            onChange={(e) => setNewBranchLabel(e.target.value)}
            sx={{ mr: 1, flex: 1 }}
          />
          <FormControl sx={{ mr: 1, flex: 1 }}>
            <InputLabel id="new-target-node-label">Target Node</InputLabel>
            <Select
              labelId="new-target-node-label"
              value={newBranchTarget}
              label="Target Node"
              onChange={(e) => setNewBranchTarget(e.target.value as string)}
            >
              {nodes.map(node => (
                <MenuItem key={node.id} value={node.id}>
                  {node.name || `${node.type} ${node.id.slice(0, 8)}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleAddBranch}
            disabled={!newBranchLabel || !newBranchTarget}
          >
            Add
          </Button>
        </Box>
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="default-branch-label">Default Branch</InputLabel>
          <Select
            labelId="default-branch-label"
            value={config.default_branch || ''}
            label="Default Branch"
            onChange={(e) => handleChange('default_branch', e.target.value)}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {(config.branches || []).map(branch => (
              <MenuItem key={branch.label} value={branch.label}>
                {branch.label}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="caption" color="text.secondary">
            Branch to take when no condition matches
          </Typography>
        </FormControl>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" gutterBottom>
          Watch Keys
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {(config.watch_keys || []).map(key => (
            <Chip
              key={key}
              label={key}
              onDelete={() => handleRemoveWatchKey(key)}
            />
          ))}
          {(config.watch_keys || []).length === 0 && (
            <Typography variant="caption" color="text.secondary">
              No watch keys defined. Add keys to observe specific state changes.
            </Typography>
          )}
        </Box>
        
        <Box sx={{ display: 'flex' }}>
          <TextField
            label="Add Watch Key"
            placeholder="Enter state key to watch"
            sx={{ flex: 1, mr: 1 }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddWatchKey((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = '';
              }
            }}
          />
          <Button 
            variant="outlined" 
            onClick={(e) => {
              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
              handleAddWatchKey(input.value);
              input.value = '';
            }}
          >
            Add
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default DecisionOperatorConfig;
