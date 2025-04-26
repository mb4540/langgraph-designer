import React from 'react';
import { Box, CircularProgress, Typography, SxProps, Theme, Skeleton } from '@mui/material';

/**
 * Props for the LoadingIndicator component
 */
export interface LoadingIndicatorProps {
  /**
   * Optional message to display while loading
   */
  message?: string;
  
  /**
   * Optional size of the loading indicator
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Optional type of loading indicator
   */
  type?: 'spinner' | 'skeleton' | 'dots';
  
  /**
   * Optional height for skeleton type (only used when type is 'skeleton')
   */
  skeletonHeight?: number;
  
  /**
   * Optional width for skeleton type (only used when type is 'skeleton')
   */
  skeletonWidth?: number | string;
  
  /**
   * Whether to center the loading indicator
   */
  centered?: boolean;
  
  /**
   * Optional additional styles
   */
  sx?: SxProps<Theme>;
}

/**
 * A reusable component for displaying loading states
 */
const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message,
  size = 'medium',
  type = 'spinner',
  skeletonHeight = 100,
  skeletonWidth = '100%',
  centered = true,
  sx,
}) => {
  // Map size to pixel values for CircularProgress
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 56,
  };

  // Dots animation component
  const LoadingDots = () => {
    return (
      <Typography
        component="span"
        sx={{
          display: 'inline-block',
          '&::after': {
            content: '"..."',
            animation: 'dots 1.5s infinite',
            '@keyframes dots': {
              '0%': { content: '""' },
              '25%': { content: '"."' },
              '50%': { content: '".."' },
              '75%': { content: '"..."' },
              '100%': { content: '""' },
            },
          },
        }}
      />
    );
  };

  // Determine which loading indicator to show
  const renderLoadingIndicator = () => {
    switch (type) {
      case 'skeleton':
        return <Skeleton variant="rectangular" width={skeletonWidth} height={skeletonHeight} />;
      case 'dots':
        return (
          <Typography variant="body1" color="text.secondary">
            Loading<LoadingDots />
          </Typography>
        );
      case 'spinner':
      default:
        return <CircularProgress size={sizeMap[size]} />;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: centered ? 'center' : 'flex-start',
        justifyContent: centered ? 'center' : 'flex-start',
        gap: 2,
        ...(centered && { minHeight: '100px' }),
        ...sx,
      }}
    >
      {renderLoadingIndicator()}
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingIndicator;
