import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Editor from '@monaco-editor/react';
import { WorkflowNode } from '../../types/nodeTypes';
import { TOOL_TYPES } from '../../constants/toolConstants';
import { useThemeContext } from '../../context/ThemeContext';

interface ToolDetailsPanelProps {
  node: WorkflowNode;
  onSave: (updates: Partial<WorkflowNode>) => void;
}

const ToolDetailsPanel: React.FC<ToolDetailsPanelProps> = ({ node, onSave }) => {
  const { mode } = useThemeContext();
  const [toolType, setToolType] = useState(node.toolType || '');
  const [isEditingTool, setIsEditingTool] = useState(false);
  const [toolCode, setToolCode] = useState('');

  // Update state when node changes
  useEffect(() => {
    if (node.toolType) {
      setToolType(node.toolType);
      // Find the tool and set its code
      const selectedTool = TOOL_TYPES.find(tool => tool.value === node.toolType);
      if (selectedTool) {
        // If the node has custom code, use it, otherwise use the template
        setToolCode(node.content && node.content !== `This is a tool component.` ? 
          node.content : selectedTool.code);
      }
    } else {
      // Default to no selection if no tool type is set
      setToolType('');
      setToolCode('');
    }
    setIsEditingTool(false); // Reset editing mode when node changes
  }, [node]);

  const handleSave = () => {
    const updates: Partial<WorkflowNode> = {
      toolType
    };
    
    // For tools in edit mode, save the tool code as content
    if (isEditingTool) {
      updates.content = toolCode;
    }
    
    onSave(updates);
    
    // Exit editing mode after saving
    if (isEditingTool) {
      setIsEditingTool(false);
    }
  };

  if (isEditingTool) {
    // Show only the selected tool card and code editor
    const selectedToolInfo = TOOL_TYPES.find(tool => tool.value === toolType);
    
    return (
      <>
        <Box sx={{ mb: 2, mt: 2 }}>
          {/* Display only the selected tool card */}
          {selectedToolInfo && (
            <Card 
              sx={{ 
                mb: 2, 
                border: 2,
                borderColor: 'primary.main',
                borderRadius: 1,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {selectedToolInfo.label}
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => setIsEditingTool(false)}
                    title="Back to tool selection"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {selectedToolInfo.description}
                </Typography>
                {selectedToolInfo.source && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Source: {selectedToolInfo.source}
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}
          
          {/* Code editor for the selected tool */}
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
            MCP Code
          </Typography>
          <Box sx={{ flexGrow: 1, mb: 2, border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
            <Editor
              height="400px"
              defaultLanguage="python"
              value={toolCode}
              onChange={(value) => setToolCode(value || '')}
              theme={mode === 'dark' ? 'vs-dark' : 'light'}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
      </>
    );
  } else {
    // Show the list of tool cards with edit buttons
    return (
      <>
        <Box sx={{ mb: 2, mt: 2 }}>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">Tool Type</FormLabel>
            <Box sx={{ mt: 2 }}>
              {TOOL_TYPES.map(tool => (
                <Card 
                  key={tool.value} 
                  sx={{ 
                    mb: 2, 
                    border: toolType === tool.value ? 2 : 1,
                    borderColor: toolType === tool.value ? 'primary.main' : 'divider',
                    borderRadius: 1,
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography 
                        variant="subtitle1" 
                        fontWeight={toolType === tool.value ? 'bold' : 'normal'}
                      >
                        {tool.label}
                      </Typography>
                      {toolType === tool.value && (
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card selection
                            setIsEditingTool(true);
                            // Set the tool code if not already set
                            if (!toolCode) {
                              setToolCode(tool.code);
                            }
                          }}
                          title="Edit MCP code"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                    <CardActionArea 
                      onClick={() => setToolType(tool.value)}
                      sx={{ mt: 1 }} // Add margin to separate from the header
                    >
                      <Typography variant="body2" color="text.secondary">
                        {tool.description}
                      </Typography>
                      {tool.source && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                          Source: {tool.source}
                        </Typography>
                      )}
                    </CardActionArea>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
      </>
    );
  }
};

export default ToolDetailsPanel;
