import React from 'react';
import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
  InputAdornment,
  styled,
  alpha
} from '@mui/material';

/**
 * Extended text field props with additional customization options
 */
export interface TextFieldProps extends Omit<MuiTextFieldProps, 'variant'> {
  /**
   * Input variant
   */
  variant?: 'outlined' | 'filled' | 'standard';
  
  /**
   * Whether the field should have a more subtle appearance
   */
  subtle?: boolean;
  
  /**
   * Icon to display at the start of the input
   */
  startIcon?: React.ReactNode;
  
  /**
   * Icon to display at the end of the input
   */
  endIcon?: React.ReactNode;
  
  /**
   * Whether the field should be compact
   */
  compact?: boolean;
  
  /**
   * Whether to show a background color on focus
   */
  highlightOnFocus?: boolean;
}

/**
 * Styled text field with custom theming
 */
const StyledTextField = styled(MuiTextField, {
  shouldForwardProp: (prop) => 
    !['subtle', 'compact', 'highlightOnFocus', 'startIcon', 'endIcon'].includes(prop as string),
})<TextFieldProps>(({ theme, subtle, compact, highlightOnFocus }) => ({
  '& .MuiOutlinedInput-root': {
    ...(subtle && {
      '& fieldset': {
        borderColor: alpha(theme.palette.text.primary, 0.1),
      },
      '&:hover fieldset': {
        borderColor: alpha(theme.palette.text.primary, 0.2),
      },
    }),
    ...(compact && {
      '& input': {
        padding: theme.spacing(1, 1.5),
      },
    }),
    ...(highlightOnFocus && {
      '&.Mui-focused': {
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
        '& fieldset': {
          borderColor: theme.palette.primary.main,
          borderWidth: '1px',
        },
      },
    }),
  },
  '& .MuiFilledInput-root': {
    ...(subtle && {
      backgroundColor: alpha(theme.palette.text.primary, 0.05),
      '&:hover': {
        backgroundColor: alpha(theme.palette.text.primary, 0.08),
      },
      '&.Mui-focused': {
        backgroundColor: alpha(theme.palette.text.primary, 0.08),
      },
    }),
    ...(compact && {
      '& input': {
        padding: theme.spacing(0.75, 1.5, 0.75, 1.5),
      },
    }),
  },
  '& .MuiInputLabel-root': {
    ...(compact && {
      transform: 'translate(14px, 12px) scale(1)',
      '&.MuiInputLabel-shrink': {
        transform: 'translate(14px, -6px) scale(0.75)',
      },
    }),
  },
}));

/**
 * TextField component that extends Material UI TextField with additional styling options
 */
const TextField: React.FC<TextFieldProps> = ({
  startIcon,
  endIcon,
  subtle = false,
  compact = false,
  highlightOnFocus = false,
  variant = 'outlined',
  ...props
}) => {
  // Create input props with adornments if icons are provided
  const inputProps = {
    ...(startIcon && {
      startAdornment: (
        <InputAdornment position="start">{startIcon}</InputAdornment>
      ),
    }),
    ...(endIcon && {
      endAdornment: (
        <InputAdornment position="end">{endIcon}</InputAdornment>
      ),
    }),
    ...props.InputProps,
  };

  return (
    <StyledTextField
      variant={variant}
      subtle={subtle}
      compact={compact}
      highlightOnFocus={highlightOnFocus}
      InputProps={inputProps}
      {...props}
    />
  );
};

export default TextField;
