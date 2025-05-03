import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Editor from '@monaco-editor/react';
import LoadingIndicator from '../../../ui/LoadingIndicator';
import ErrorMessage from '../../../ui/ErrorMessage';

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  language?: string;
  title?: string;
  height?: string;
  loading?: boolean;
  loadingMessage?: string;
  error?: Error | null;
  onResetError?: () => void;
  theme: 'light' | 'dark';
  readOnly?: boolean;
}

/**
 * A standardized code editor component that can be reused across different node types
 */
const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onCodeChange,
  language = 'python',
  title = 'Code',
  height = '400px',
  loading = false,
  loadingMessage = 'Loading...',
  error = null,
  onResetError,
  theme,
  readOnly = false
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      {title && (
        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
          {title}
        </Typography>
      )}
      
      {error && onResetError && (
        <Box sx={{ mb: 2 }}>
          <ErrorMessage 
            message="Code validation error" 
            details={error.message}
            compact
            onRetry={onResetError}
          />
        </Box>
      )}
      
      <Box sx={{ flexGrow: 1, mb: 2, border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ p: 2 }}>
            <LoadingIndicator 
              type="dots" 
              size="small" 
              centered={false} 
              message={loadingMessage}
            />
          </Box>
        ) : (
          <Editor
            height={height}
            defaultLanguage={language}
            value={code}
            onChange={(value) => onCodeChange(value || '')}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              readOnly: readOnly
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default CodeEditor;
