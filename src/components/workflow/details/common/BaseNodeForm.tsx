import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import { WorkflowNode } from '../../../../types/nodeTypes';
import ErrorMessage from '../../../ui/ErrorMessage';
import useAsyncOperation from '../../../../hooks/useAsyncOperation';
import { useWorkflowContext } from '../../../../context/WorkflowContext';

export interface BaseNodeFormProps {
  node: WorkflowNode;
  children: React.ReactNode;
  onSave?: () => Promise<void>;
  onCancel?: () => void;
  isModified?: boolean;
}

/**
 * Base component for all node detail forms that provides common functionality:
 * - Error handling
 * - Save/cancel operations
 * - Window-level function exposure for the parent DetailsPanel
 */
const BaseNodeForm: React.FC<BaseNodeFormProps> = ({
  node,
  children,
  onSave,
  onCancel,
  isModified = false
}) => {
  const { updateNode } = useWorkflowContext();

  // Handle saving node details
  const { 
    loading: saveLoading, 
    error: saveError, 
    execute: executeSave,
    reset: resetSaveError
  } = useAsyncOperation<void>(async () => {
    if (onSave) {
      await onSave();
    }
  });

  const handleSave = () => {
    executeSave();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // Expose the functions to save and cancel changes
  useEffect(() => {
    // Expose functions for the DetailsPanel to call
    (window as any).saveNodeChanges = handleSave;
    (window as any).cancelNodeChanges = handleCancel;
    (window as any).isNodeModified = isModified;

    return () => {
      // Clean up
      delete (window as any).saveNodeChanges;
      delete (window as any).cancelNodeChanges;
      delete (window as any).isNodeModified;
    };
  }, [isModified]);

  return (
    <>
      {children}
      
      {saveError && (
        <Box sx={{ mb: 2 }}>
          <ErrorMessage 
            message="Failed to save changes" 
            details={saveError.message}
            onRetry={() => {
              resetSaveError();
              executeSave();
            }}
          />
        </Box>
      )}
    </>
  );
};

export default BaseNodeForm;
