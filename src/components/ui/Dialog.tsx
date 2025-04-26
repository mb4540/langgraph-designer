import React from 'react';
import {
  Dialog as MuiDialog,
  DialogProps as MuiDialogProps,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Typography,
  Box,
  styled
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Extended dialog props with additional customization options
 */
export interface DialogProps extends Omit<MuiDialogProps, 'title'> {
  /**
   * Dialog title
   */
  title?: React.ReactNode;
  
  /**
   * Dialog subtitle or description
   */
  description?: React.ReactNode;
  
  /**
   * Whether to show a close button in the title
   */
  showCloseButton?: boolean;
  
  /**
   * Actions to be displayed in the dialog footer
   */
  actions?: React.ReactNode;
  
  /**
   * Callback when the close button is clicked
   */
  onClose?: () => void;
  
  /**
   * Whether the dialog content should have padding
   */
  contentPadding?: boolean;
}

/**
 * Styled dialog title with close button option
 */
const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 3),
}));

/**
 * Styled dialog content with customizable padding
 */
const StyledDialogContent = styled(DialogContent, {
  shouldForwardProp: (prop) => prop !== 'contentPadding',
})<{ contentPadding?: boolean }>(({ theme, contentPadding = true }) => ({
  padding: contentPadding ? theme.spacing(2, 3) : 0,
}));

/**
 * Styled dialog actions with consistent padding
 */
const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 3, 3),
}));

/**
 * Dialog component that extends Material UI Dialog with additional styling options
 */
const Dialog: React.FC<DialogProps> = ({
  children,
  title,
  description,
  showCloseButton = true,
  actions,
  onClose,
  contentPadding = true,
  ...props
}) => {
  return (
    <MuiDialog
      onClose={onClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      {...props}
    >
      {title && (
        <StyledDialogTitle id="dialog-title">
          {typeof title === 'string' ? (
            <Typography variant="h6" component="div">
              {title}
            </Typography>
          ) : (
            title
          )}
          {showCloseButton && onClose && (
            <IconButton
              aria-label="close"
              onClick={onClose}
              size="small"
              edge="end"
            >
              <CloseIcon />
            </IconButton>
          )}
        </StyledDialogTitle>
      )}
      
      <StyledDialogContent contentPadding={contentPadding}>
        {description && (
          <DialogContentText id="dialog-description" sx={{ mb: 2 }}>
            {description}
          </DialogContentText>
        )}
        {children}
      </StyledDialogContent>
      
      {actions && <StyledDialogActions>{actions}</StyledDialogActions>}
    </MuiDialog>
  );
};

export default Dialog;
