import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import { WorkflowNode } from '../../types/nodeTypes';
import { MEMORY_TYPES } from '../../constants/memoryConstants';

interface MemoryDetailsPanelProps {
  node: WorkflowNode;
  onSave: (updates: Partial<WorkflowNode>) => void;
}

const MemoryDetailsPanel: React.FC<MemoryDetailsPanelProps> = ({ node, onSave }) => {
  const [memoryType, setMemoryType] = useState(node.memoryType || 'conversation-buffer');

  // Update state when node changes
  useEffect(() => {
    if (node.memoryType) {
      setMemoryType(node.memoryType);
    } else {
      // Default to conversation buffer if no memory type is set
      setMemoryType('conversation-buffer');
    }
  }, [node]);

  const handleSave = () => {
    onSave({
      memoryType
    });
  };

  return (
    <>
      <Box sx={{ mb: 2, mt: 2 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Memory Type</FormLabel>
          <RadioGroup
            value={memoryType}
            onChange={(e) => setMemoryType(e.target.value)}
          >
            {MEMORY_TYPES.map(memory => (
              <Box key={memory.value} sx={{ mb: 2, border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                <FormControlLabel 
                  value={memory.value} 
                  control={<Radio />} 
                  label={
                    <Box>
                      <Typography variant="subtitle1">{memory.label}</Typography>
                      <Typography variant="body2" color="text.secondary">{memory.description}</Typography>
                      {memory.source && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                          Source: {memory.source}
                        </Typography>
                      )}
                    </Box>
                  } 
                />
              </Box>
            ))}
          </RadioGroup>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Box>
    </>
  );
};

export default MemoryDetailsPanel;
