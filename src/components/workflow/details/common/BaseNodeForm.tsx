import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import ErrorMessage from '../../../ui/ErrorMessage';

export interface BaseNodeFormProps {
  title: string;
  children: React.ReactNode;
  onSave: () => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  error?: Error | null;
  nodeId?: string;
  isModified?: boolean;
}

/**
 * Base component for all node detail forms that provides common functionality:
 * - Error handling
 * - Save/cancel operations
 * - Window-level function exposure for the parent DetailsPanel
 */
const BaseNodeForm: React.FC<BaseNodeFormProps> = ({
  title,
  children,
  onSave,
  onCancel,
  loading = false,
  error = null,
  nodeId,
  isModified = false
}) => {
  // Expose the functions to save and cancel changes
  useEffect(() => {
    // Expose functions for the DetailsPanel to call
    (window as any).saveNodeChanges = onSave;
    (window as any).cancelNodeChanges = onCancel;
    (window as any).isNodeModified = isModified;

    return () => {
      // Clean up
      delete (window as any).saveNodeChanges;
      delete (window as any).cancelNodeChanges;
      delete (window as any).isNodeModified;
    };
  }, [isModified, onSave, onCancel]);

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <h2>{title}</h2>
      </Box>
      
      {children}
      
      {error && (
        <Box sx={{ mb: 2 }}>
          <ErrorMessage 
            message="Failed to save changes" 
            details={error.message}
            onRetry={onSave}
          />
        </Box>
      )}
    </Box>
  );
};

export default BaseNodeForm;
