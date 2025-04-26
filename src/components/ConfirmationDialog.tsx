import React from 'react';
import Dialog from './ui/Dialog';
import Button from './ui/Button';

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title={title}
      description={message}
      actions={
        <>
          <Button onClick={onCancel} variant="outlined" color="default">
            Cancel
          </Button>
          <Button onClick={onConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </>
      }
    />
  );
};

export default ConfirmationDialog;
