import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Editor from '@monaco-editor/react';
import { useWorkflowStore } from '../store/workflowStore';
import { useThemeContext } from '../context/ThemeContext';

const DetailsPanel: React.FC = () => {
  const { selectedNode, updateNode } = useWorkflowStore();
  const { mode } = useThemeContext();
  const [name, setName] = useState('');
  const [llmModel, setLlmModel] = useState('gpt-4o-mini');
  const [content, setContent] = useState('');

  // Update local state when selected node changes
  useEffect(() => {
    if (selectedNode) {
      setName(selectedNode.name);
      setContent(selectedNode.content);
      if (selectedNode.type === 'agent' && selectedNode.llmModel) {
        setLlmModel(selectedNode.llmModel);
      }
    }
  }, [selectedNode]);

  const handleSave = () => {
    if (selectedNode) {
      const updates: any = { name, content };
      if (selectedNode.type === 'agent') {
        updates.llmModel = llmModel;
      }
      updateNode(selectedNode.id, updates);
    }
  };

  if (!selectedNode) {
    return (
      <Paper elevation={3} sx={{ height: '100%', padding: 2, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>
          Details
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
          <Typography variant="body1" color="text.secondary">
            Double-click on an agent or tool in the workflow to view and edit its details here.
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ height: '100%', padding: 2, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        {selectedNode.type === 'agent' ? 'Agent Details' : 'Tool Details'}
      </Typography>
      
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
      
      {selectedNode.type === 'agent' && (
        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>LLM Model</InputLabel>
            <Select
              value={llmModel}
              label="LLM Model"
              onChange={(e) => setLlmModel(e.target.value)}
            >
              <MenuItem value="gpt-4o-mini">GPT-4o Mini</MenuItem>
              <MenuItem value="gpt-4o">GPT-4o</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
        {selectedNode.type === 'agent' ? 'Description' : 'Code'}
      </Typography>
      
      <Box sx={{ flexGrow: 1, mb: 2, border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
        {selectedNode.type === 'agent' ? (
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
        ) : (
          <Editor
            height="300px"
            defaultLanguage="javascript"
            value={content}
            onChange={(value) => setContent(value || '')}
            theme={mode === 'dark' ? 'vs-dark' : 'light'}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
            }}
          />
        )}
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Box>
    </Paper>
  );
};

export default DetailsPanel;
