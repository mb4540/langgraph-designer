import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Editor, { OnChange } from '@monaco-editor/react';
import LoadingIndicator from '../../../ui/LoadingIndicator';
import ErrorMessage from '../../../ui/ErrorMessage';

export interface CodeEditorProps {
  code?: string;
  onCodeChange?: (code: string) => void;
  value?: string;
  onChange?: (code: string) => void;
  language?: string;
  title?: string;
  height?: string;
  loading?: boolean;
  loadingMessage?: string;
  error?: Error | null;
  onResetError?: () => void;
  theme?: 'light' | 'dark';
  readOnly?: boolean;
  placeholder?: string;
}

/**
 * A standardized code editor component that can be reused across different node types
 */
const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onCodeChange,
  value,
  onChange,
  language = 'python',
  title = 'Code',
  height = '400px',
  loading = false,
  loadingMessage = 'Loading...',
  error = null,
  onResetError,
  theme = 'light',
  readOnly = false,
  placeholder
}) => {
  // Support both code/onCodeChange and value/onChange patterns
  const actualCode = code ?? value ?? '';
  const handleCodeChange: OnChange = (newCode) => {
    if (onCodeChange && newCode) onCodeChange(newCode.toString());
    if (onChange && newCode) onChange(newCode.toString());
  };

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
            onDismiss={onResetError}
          />
        </Box>
      )}
      
      {loading ? (
        <LoadingIndicator message={loadingMessage} />
      ) : (
        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Editor
            height={height}
            language={language}
            value={actualCode}
            onChange={handleCodeChange}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              readOnly,
              wordWrap: 'on',
              automaticLayout: true
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default CodeEditor;
