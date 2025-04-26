import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormHelperText,
} from '@mui/material';

/**
 * Props for IdTypeSelector component
 */
export interface IdTypeSelectorProps {
  /**
   * Currently selected ID type
   */
  value: string;
  
  /**
   * Callback when ID type changes
   */
  onChange: (value: string) => void;
  
  /**
   * Available ID type options
   */
  options?: Array<{ value: string; label: string; description?: string }>;
  
  /**
   * Label for the form control
   */
  label?: string;
  
  /**
   * Helper text to display below the selector
   */
  helperText?: string;
  
  /**
   * Whether the selector is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether the selector is required
   */
  required?: boolean;
  
  /**
   * Error state of the selector
   */
  error?: boolean;
  
  /**
   * Additional styles for the form control
   */
  sx?: Record<string, any>;
}

/**
 * A reusable component for selecting ID types (user, group, etc.)
 */
const IdTypeSelector: React.FC<IdTypeSelectorProps> = ({
  value,
  onChange,
  options = [
    { value: 'user', label: 'User ID', description: 'Individual user identifier' },
    { value: 'group', label: 'Group ID', description: 'Group or team identifier' },
    { value: 'role', label: 'Role ID', description: 'Role-based identifier' },
  ],
  label = 'ID Type',
  helperText,
  disabled = false,
  required = false,
  error = false,
  sx = { minWidth: 200 },
}) => {
  /**
   * Handle ID type change
   */
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  const labelId = `id-type-select-label-${React.useId()}`;

  return (
    <FormControl 
      sx={sx} 
      disabled={disabled} 
      required={required} 
      error={error}
      fullWidth
    >
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        value={value}
        label={label}
        onChange={handleChange}
      >
        {options.map((option) => (
          <MenuItem 
            key={option.value} 
            value={option.value}
            title={option.description}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default IdTypeSelector;
