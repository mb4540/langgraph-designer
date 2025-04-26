import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, styled } from '@mui/material';
import { alpha } from '@mui/material/styles';

/**
 * Extended button props with additional customization options
 */
export interface ButtonProps extends Omit<MuiButtonProps, 'color'> {
  /**
   * Color variant for the button
   */
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | 'default';
  
  /**
   * Whether the button should have a more subtle appearance
   */
  subtle?: boolean;
  
  /**
   * Whether the button should be small
   */
  small?: boolean;
  
  /**
   * Whether the button should be large
   */
  large?: boolean;
}

/**
 * Styled MUI Button with custom theming
 */
const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== 'subtle' && prop !== 'small' && prop !== 'large',
})<ButtonProps>(({ theme, color = 'primary', variant, subtle, small, large }) => {
  // Define color mapping to theme palette
  const colorMap: Record<string, string> = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    success: theme.palette.success.main,
    error: theme.palette.error.main,
    info: theme.palette.info.main,
    warning: theme.palette.warning.main,
    default: theme.palette.grey[300],
  };

  // Get the base color from the map
  const baseColor = colorMap[color] || theme.palette.primary.main;
  
  // Determine size based on props
  const sizeStyles = {
    ...(small && {
      padding: '4px 10px',
      fontSize: '0.8125rem',
    }),
    ...(large && {
      padding: '10px 22px',
      fontSize: '1rem',
    }),
  };

  // Create styles based on variant and subtle prop
  if (variant === 'contained') {
    return {
      backgroundColor: subtle ? alpha(baseColor, 0.1) : baseColor,
      color: subtle ? baseColor : '#fff',
      '&:hover': {
        backgroundColor: subtle ? alpha(baseColor, 0.2) : alpha(baseColor, 0.8),
      },
      ...sizeStyles,
    };
  }
  
  if (variant === 'outlined') {
    return {
      borderColor: subtle ? alpha(baseColor, 0.5) : baseColor,
      color: baseColor,
      '&:hover': {
        backgroundColor: alpha(baseColor, 0.05),
        borderColor: baseColor,
      },
      ...sizeStyles,
    };
  }
  
  // Text variant
  return {
    color: baseColor,
    '&:hover': {
      backgroundColor: alpha(baseColor, 0.05),
    },
    ...sizeStyles,
  };
});

/**
 * Button component that extends Material UI Button with additional styling options
 */
const Button: React.FC<ButtonProps> = ({ 
  children, 
  color = 'primary',
  variant = 'contained',
  subtle = false,
  small = false,
  large = false,
  ...props 
}) => {
  // Convert our custom color to MUI's expected color
  // MUI expects 'inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning'
  // We need to handle our custom 'default' color
  const muiColor = color === 'default' ? undefined : color;
  
  return (
    <StyledButton
      color={muiColor}
      variant={variant}
      subtle={subtle}
      small={small}
      large={large}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
