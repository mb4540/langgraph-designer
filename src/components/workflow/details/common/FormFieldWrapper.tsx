import React, { ReactNode } from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';

interface FormFieldWrapperProps {
  children: ReactNode;
  label?: string;
  helperText?: string;
  required?: boolean;
  error?: boolean;
  errorText?: string;
  sx?: SxProps<Theme>;
}

/**
 * A wrapper component for form fields that provides consistent styling and layout
 */
const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({
  children,
  label,
  helperText,
  required = false,
  error = false,
  errorText = '',
  sx = {}
}) => {
  return (
    <FormControl fullWidth margin="normal" sx={sx}>
      {label && (
        <FormLabel required={required} error={error}>
          {label}
        </FormLabel>
      )}
      <Box sx={{ mt: 1, mb: 0.5 }}>
        {children}
      </Box>
      {(helperText || error) && (
        <Typography 
          variant="caption" 
          color={error ? 'error' : 'text.secondary'}
          sx={{ mt: 0.5 }}
        >
          {error ? errorText || helperText : helperText}
        </Typography>
      )}
    </FormControl>
  );
};

export default FormFieldWrapper;
