import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';

/**
 * Props for AccessLevelSelector component
 */
export interface AccessLevelSelectorProps {
  /**
   * Currently selected access level
   */
  value: string;
  
  /**
   * Callback when access level changes
   */
  onChange: (value: string) => void;
  
  /**
   * Available access level options
   */
  options?: Array<{ value: string; label: string }>;
  
  /**
   * Label for the form control
   */
  label?: string;
  
  /**
   * Whether to display options in a row
   */
  row?: boolean;
  
  /**
   * Additional styles for the form control
   */
  sx?: Record<string, any>;
}

/**
 * A reusable component for selecting access levels
 */
const AccessLevelSelector: React.FC<AccessLevelSelectorProps> = ({
  value,
  onChange,
  options = [
    { value: 'partial', label: 'Partial Access' },
    { value: 'admin', label: 'Admin Access' },
  ],
  label = 'Access Level',
  row = true,
  sx = { mb: 3, width: '100%' },
}) => {
  /**
   * Handle access level change
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl component="fieldset" sx={sx}>
      <FormLabel component="legend" sx={{ mb: 1 }}>
        {label}
      </FormLabel>
      <RadioGroup row={row} name="accessLevel" value={value} onChange={handleChange}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default AccessLevelSelector;
