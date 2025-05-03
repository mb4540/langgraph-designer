import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { SxProps, Theme } from '@mui/material/styles';

import { CodeEditor } from '../common';

interface AgentPromptEditorProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  enableMarkdown: boolean;
  onEnableMarkdownChange: (enableMarkdown: boolean) => void;
  sx?: SxProps<Theme>;
}

/**
 * A component for editing agent prompts with markdown support option
 */
const AgentPromptEditor: React.FC<AgentPromptEditorProps> = ({
  prompt,
  onPromptChange,
  enableMarkdown,
  onEnableMarkdownChange,
  sx = {}
}) => {
  return (
    <Box sx={{ ...sx }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle1">Agent Prompt</Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={enableMarkdown}
              onChange={(e) => onEnableMarkdownChange(e.target.checked)}
              size="small"
            />
          }
          label={<Typography variant="body2">Enable Markdown</Typography>}
        />
      </Box>
      
      <CodeEditor
        value={prompt}
        onChange={onPromptChange}
        language={enableMarkdown ? 'markdown' : 'plaintext'}
        height="300px"
        placeholder="Enter the agent's prompt or system message here..."
      />
      
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        {enableMarkdown 
          ? 'Markdown formatting is enabled. You can use **bold**, *italic*, and other markdown syntax.'
          : 'Markdown formatting is disabled. Text will be treated as plain text.'}
      </Typography>
    </Box>
  );
};

export default AgentPromptEditor;
