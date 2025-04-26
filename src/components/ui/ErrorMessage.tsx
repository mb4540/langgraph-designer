import React from 'react';
import { Box, Typography, Paper, Button, SxProps, Theme } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ReplayIcon from '@mui/icons-material/Replay';

/**
 * Props for the ErrorMessage component
 */
export interface ErrorMessageProps {
  /**
   * The error message to display
   */
  message: string;
  
  /**
   * Optional more detailed error information
   */
  details?: string;
  
  /**
   * Optional function to retry the operation
   */
  onRetry?: () => void;
  
  /**
   * Optional function to dismiss the error
   */
  onDismiss?: () => void;
  
  /**
   * Whether to show the error in a compact format
   */
  compact?: boolean;
  
  /**
   * Optional icon to display instead of the default error icon
   */
  icon?: React.ReactNode;
  
  /**
   * Optional additional styles
   */
  sx?: SxProps<Theme>;
}

/**
 * A reusable component for displaying error messages
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  details,
  onRetry,
  onDismiss,
  compact = false,
  icon = <ErrorOutlineIcon color="error" fontSize={compact ? 'medium' : 'large'} />,
  sx,
}) => {
  if (compact) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'error.main',
          ...sx,
        }}
      >
        {icon}
        <Typography variant="body2" color="error">
          {message}
        </Typography>
        {onRetry && (
          <Button
            size="small"
            startIcon={<ReplayIcon />}
            onClick={onRetry}
            sx={{ ml: 1, minWidth: 'auto' }}
          >
            Retry
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: '1px solid',
        borderColor: 'error.light',
        borderRadius: 1,
        bgcolor: 'error.lighter',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        ...sx,
      }}
    >
      <Box sx={{ mb: 2 }}>{icon}</Box>
      <Typography variant="h6" color="error.main" gutterBottom>
        {message}
      </Typography>
      {details && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {details}
        </Typography>
      )}
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        {onRetry && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<ReplayIcon />}
            onClick={onRetry}
          >
            Retry
          </Button>
        )}
        {onDismiss && (
          <Button variant="outlined" color="inherit" onClick={onDismiss}>
            Dismiss
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default ErrorMessage;
