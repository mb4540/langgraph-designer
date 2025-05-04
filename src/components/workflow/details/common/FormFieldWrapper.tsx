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
    <FormControl 
      fullWidth 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        mb: 2,
        ...sx
      }}
    >
      {label && (
        <FormLabel 
          required={required} 
          error={error}
          sx={{ 
            mb: 1,
            '& .MuiFormLabel-asterisk': {
              color: 'error.main'
            }
          }}
        >
          <Typography variant="body2" fontWeight="medium">
            {label}
          </Typography>
        </FormLabel>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
