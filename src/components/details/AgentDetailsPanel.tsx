import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { WorkflowNode } from '../../types/nodeTypes';
import { useThemeContext } from '../../context/ThemeContext';

interface AgentDetailsPanelProps {
  node: WorkflowNode;
  onSave: (updates: Partial<WorkflowNode>) => void;
}

const AgentDetailsPanel: React.FC<AgentDetailsPanelProps> = ({ node, onSave }) => {
  const { mode } = useThemeContext();
  const [name, setName] = useState(node.name || '');
  const [content, setContent] = useState(node.content || '');

  // Update state when node changes
  useEffect(() => {
    setName(node.name || '');
    setContent(node.content || '');
  }, [node]);

  const handleSave = () => {
    onSave({
      name,
      content
    });
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          variant="outlined"
        />
      </Box>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
        Prompt
      </Typography>
      
      <Box sx={{ flexGrow: 1, mb: 2, border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
        <TextField
          multiline
          fullWidth
          minRows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          variant="outlined"
          sx={{ height: '100%' }}
          inputProps={{ style: { verticalAlign: 'top' } }}
          InputProps={{
            sx: {
              height: '100%',
              '& .MuiInputBase-inputMultiline': {
                height: '100%',
                alignItems: 'flex-start',
                verticalAlign: 'top',
                paddingTop: '14px',
                textAlign: 'left',
              }
            }
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Box>
    </>
  );
};

export default AgentDetailsPanel;
