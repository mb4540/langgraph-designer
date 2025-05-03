import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LoadingIndicator from './LoadingIndicator';

interface ActionButtonsProps {
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isSaveDisabled?: boolean;
  loadingMessage?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSave,
  onCancel,
  isLoading = false,
  isSaveDisabled = false,
  loadingMessage = 'Saving...'
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
      {isLoading ? (
        <LoadingIndicator 
          type="spinner" 
          size="small" 
          message={loadingMessage}
        />
      ) : (
        <>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={onSave}
            disabled={isSaveDisabled}
          >
            Save Changes
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </>
      )}
    </Box>
  );
};

export default ActionButtons;
