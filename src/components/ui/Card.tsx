import React from 'react';
import {
  Card as MuiCard,
  CardProps as MuiCardProps,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  styled,
  alpha
} from '@mui/material';

/**
 * Extended card props with additional customization options
 */
export interface CardProps extends Omit<MuiCardProps, 'title'> {
  /**
   * Card title
   */
  title?: React.ReactNode;
  
  /**
   * Card subtitle
   */
  subtitle?: React.ReactNode;
  
  /**
   * Actions to be displayed in the card footer
   */
  actions?: React.ReactNode;
  
  /**
   * Header action component (e.g., menu, button)
   */
  headerAction?: React.ReactNode;
  
  /**
   * Whether the card should have a more subtle appearance
   */
  subtle?: boolean;
  
  /**
   * Whether the card content should have padding
   */
  contentPadding?: boolean;
  
  /**
   * Optional accent color for the card
   */
  accentColor?: string;
  
  /**
   * Whether to show a border on the card
   */
  bordered?: boolean;
}

/**
 * Styled card with custom theming
 */
const StyledCard = styled(MuiCard, {
  shouldForwardProp: (prop) => 
    !['subtle', 'accentColor', 'bordered', 'contentPadding'].includes(prop as string),
})<{
  subtle?: boolean;
  accentColor?: string;
  bordered?: boolean;
  contentPadding?: boolean;
}>(({ theme, subtle, accentColor, bordered }) => ({
  backgroundColor: subtle ? alpha(theme.palette.background.paper, 0.7) : theme.palette.background.paper,
  boxShadow: subtle ? 'none' : theme.shadows[1],
  border: bordered ? `1px solid ${theme.palette.divider}` : 'none',
  borderTop: accentColor ? `3px solid ${accentColor}` : undefined,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: subtle ? theme.shadows[1] : theme.shadows[2],
  },
}));

/**
 * Styled card content with customizable padding
 */
const StyledCardContent = styled(CardContent, {
  shouldForwardProp: (prop) => prop !== 'contentPadding',
})<{ contentPadding?: boolean }>(({ theme, contentPadding = true }) => ({
  padding: contentPadding ? theme.spacing(2) : 0,
  '&:last-child': {
    paddingBottom: contentPadding ? theme.spacing(2) : 0,
  },
}));

/**
 * Card component that extends Material UI Card with additional styling options
 */
const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  actions,
  headerAction,
  subtle = false,
  contentPadding = true,
  accentColor,
  bordered = false,
  ...props
}) => {
  return (
    <StyledCard
      subtle={subtle}
      accentColor={accentColor}
      bordered={bordered}
      {...props}
    >
      {title && (
        <CardHeader
          title={
            typeof title === 'string' ? (
              <Typography variant="h6" component="div">
                {title}
              </Typography>
            ) : (
              title
            )
          }
          subheader={subtitle}
          action={headerAction}
        />
      )}
      
      <StyledCardContent contentPadding={contentPadding}>
        {children}
      </StyledCardContent>
      
      {actions && <CardActions>{actions}</CardActions>}
    </StyledCard>
  );
};

export default Card;
