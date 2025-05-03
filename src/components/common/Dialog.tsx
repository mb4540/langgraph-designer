import React from 'react';
import MuiDialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface DialogProps {
  /** Dialog title */
  title: string;
  
  /** Whether the dialog is open */
  open: boolean;
  
  /** Callback when the dialog is closed */
  onClose: () => void;
  
  /** Dialog content */
  children: React.ReactNode;
  
  /** Optional dialog subtitle */
  subtitle?: string;
  
  /** Optional primary action button text */
  primaryActionText?: string;
  
  /** Optional callback for primary action */
  onPrimaryAction?: () => void;
  
  /** Optional secondary action button text */
  secondaryActionText?: string;
  
  /** Optional callback for secondary action */
  onSecondaryAction?: () => void;
  
  /** Optional flag to disable the primary action button */
  primaryActionDisabled?: boolean;
  
  /** Optional flag to show loading state on the primary action button */
  primaryActionLoading?: boolean;
  
  /** Optional maximum width of the dialog */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  
  /** Optional flag to make the dialog full width */
  fullWidth?: boolean;
  
  /** Optional flag to make the dialog full screen */
  fullScreen?: boolean;
}

/**
 * A reusable dialog component with standardized styling and behavior
 */
const Dialog: React.FC<DialogProps> = ({
  title,
  open,
  onClose,
  children,
  subtitle,
  primaryActionText,
  onPrimaryAction,
  secondaryActionText,
  onSecondaryAction,
  primaryActionDisabled = false,
  primaryActionLoading = false,
  maxWidth = 'md',
  fullWidth = true,
  fullScreen = false
}) => {
  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
      aria-labelledby="dialog-title"
    >
      <DialogTitle id="dialog-title" sx={{ pr: 6 }}>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        {children}
      </DialogContent>
      
      {(primaryActionText || secondaryActionText) && (
        <DialogActions>
          {secondaryActionText && (
            <Button onClick={onSecondaryAction}>
              {secondaryActionText}
            </Button>
          )}
          {primaryActionText && (
            <Button
              variant="contained"
              onClick={onPrimaryAction}
              disabled={primaryActionDisabled || primaryActionLoading}
            >
              {primaryActionLoading ? 'Loading...' : primaryActionText}
            </Button>
          )}
        </DialogActions>
      )}
    </MuiDialog>
  );
};

export default Dialog;
