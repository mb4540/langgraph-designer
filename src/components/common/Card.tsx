import React from 'react';
import MuiCard from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { SxProps, Theme } from '@mui/material/styles';

export interface CardAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface CardProps {
  /** Card title */
  title: string;
  
  /** Card content */
  children: React.ReactNode;
  
  /** Optional card subtitle */
  subtitle?: string;
  
  /** Optional card actions to display in the bottom action area */
  actions?: React.ReactNode;
  
  /** Optional menu actions to display in a dropdown menu */
  menuActions?: CardAction[];
  
  /** Optional icon to display in the header */
  icon?: React.ReactNode;
  
  /** Optional callback when the card is clicked */
  onClick?: () => void;
  
  /** Optional flag to make the card elevated */
  elevated?: boolean;
  
  /** Optional flag to make the card outlined */
  outlined?: boolean;
  
  /** Optional custom styles */
  sx?: SxProps<Theme>;
}

/**
 * A reusable card component with standardized styling and behavior
 */
const Card: React.FC<CardProps> = ({
  title,
  children,
  subtitle,
  actions,
  menuActions,
  icon,
  onClick,
  elevated = false,
  outlined = false,
  sx = {}
}) => {
  // Menu state
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleMenuItemClick = (action: CardAction) => {
    handleMenuClose();
    action.onClick();
  };
  
  return (
    <MuiCard 
      variant={elevated ? 'elevation' : outlined ? 'outlined' : 'elevation'}
      elevation={elevated ? 3 : 1}
      onClick={onClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: 4
        } : {},
        ...sx
      }}
    >
      <CardHeader
        title={
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        }
        subheader={
          subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )
        }
        avatar={icon}
        action={
          menuActions && menuActions.length > 0 ? (
            <>
              <IconButton
                aria-label="more"
                aria-controls="card-menu"
                aria-haspopup="true"
                onClick={handleMenuClick}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="card-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleMenuClose}
              >
                {menuActions.map((action, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => handleMenuItemClick(action)}
                    disabled={action.disabled}
                  >
                    {action.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : null
        }
      />
      
      <CardContent sx={{ flexGrow: 1 }}>
        {children}
      </CardContent>
      
      {actions && (
        <CardActions>
          {actions}
        </CardActions>
      )}
    </MuiCard>
  );
};

export default Card;
