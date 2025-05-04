import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Editor from '@monaco-editor/react';
import { ToolType } from '../../../../types/nodeTypes';
import LoadingIndicator from '../../../ui/LoadingIndicator';
import ErrorMessage from '../../../ui/ErrorMessage';

interface ToolCodeEditorProps {
  selectedTool: ToolType;
  toolCode: string;
  onToolCodeChange: (code: string) => void;
  onExitEditMode: () => void;
  validationLoading: boolean;
  validationError: Error | null;
  onResetValidationError: () => void;
  theme: 'light' | 'dark';
}

const ToolCodeEditor: React.FC<ToolCodeEditorProps> = ({
  selectedTool,
  toolCode,
  onToolCodeChange,
  onExitEditMode,
  validationLoading,
  validationError,
  onResetValidationError,
  theme
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      gap: 3,
      height: '100%'
    }}>
      {/* Display only the selected tool card */}
      {selectedTool && (
        <Card 
          sx={{ 
            border: 2,
            borderColor: 'primary.main',
            borderRadius: 1,
            flexShrink: 0
          }}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {selectedTool.label}
              </Typography>
              <IconButton 
                size="small" 
                onClick={onExitEditMode}
                title="Back to tool selection"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {selectedTool.description}
            </Typography>
            {selectedTool.source && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Source: {selectedTool.source}
              </Typography>
            )}
            {/* Display version information in the selected tool card */}
            <Box sx={{ 
              display: 'flex', 
              mt: 2,
              pt: 1,
              borderTop: '1px solid',
              borderColor: 'divider'
            }}>
              <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1 }}>
                ID: {selectedTool.versionedId || 'Not assigned'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Version: {selectedTool.version || '1.0.0'}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              Created: {new Date(selectedTool.createdAt || '').toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      )}
      
      {/* Code editor section */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: 2,
        flexGrow: 1
      }}>
        <Typography variant="subtitle1" fontWeight="medium">
          MCP Code
        </Typography>
        
        {validationError && (
          <ErrorMessage 
            message="Code validation error" 
            details={validationError.message}
            compact
            onRetry={onResetValidationError}
          />
        )}
        
        <Box sx={{ 
          flexGrow: 1, 
          border: 1, 
          borderColor: 'divider', 
          borderRadius: 1, 
          overflow: 'hidden',
          minHeight: '400px',
          display: 'flex'
        }}>
          {validationLoading ? (
            <Box sx={{ 
              p: 2, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '100%'
            }}>
              <LoadingIndicator 
                type="dots" 
                size="small" 
                centered={false} 
                message="Validating code..."
              />
            </Box>
          ) : (
            <Editor
              height="100%"
              defaultLanguage="python"
              value={toolCode}
              onChange={(value) => onToolCodeChange(value || '')}
              theme={theme === 'dark' ? 'vs-dark' : 'light'}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ToolCodeEditor;
