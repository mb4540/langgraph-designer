import React, { ReactNode } from 'react';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';

interface FormFieldProps {
  id?: string;
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
  type?: string;
  error?: boolean;
  errorText?: string;
  variant?: 'standard' | 'outlined' | 'filled';
  size?: 'small' | 'medium';
  InputProps?: any;
  children?: ReactNode;
}

/**
 * A standardized form field component that can be used across all node detail forms
 */
const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  value,
  onChange,
  multiline = false,
  rows = 4,
  placeholder = '',
  helperText = '',
  required = false,
  disabled = false,
  fullWidth = true,
  sx = {},
  type = 'text',
  error = false,
  errorText = '',
  variant = 'outlined',
  size = 'medium',
  InputProps = {},
  children
}) => {
  return (
    <FormControl fullWidth={fullWidth} sx={{ mb: 2, ...sx }}>
      <FormLabel htmlFor={id} sx={{ mb: 0.5 }}>
        <Typography variant="body2" fontWeight="medium">
          {label}{required && <Box component="span" sx={{ color: 'error.main' }}>*</Box>}
        </Typography>
      </FormLabel>
      {children ? (
        children
      ) : (
        <TextField
          id={id}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          multiline={multiline}
          rows={multiline ? rows : undefined}
          placeholder={placeholder}
          helperText={error ? errorText : helperText}
          required={required}
          disabled={disabled}
          fullWidth={fullWidth}
          type={type}
          error={error}
          variant={variant}
          size={size}
          InputProps={InputProps}
        />
      )}
    </FormControl>
  );
};

export default FormField;
