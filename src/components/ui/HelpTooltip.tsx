import React from 'react';
import { Tooltip, IconButton, Typography, Box, Link } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { getHelpContent, HelpContent } from '../../utils/helpUtils';

interface HelpTooltipProps {
  category: string;
  itemKey: string;
  placement?: 'top' | 'right' | 'bottom' | 'left' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'right-start' | 'right-end' | 'left-start' | 'left-end';
  size?: 'small' | 'medium' | 'large';
  iconColor?: string;
  customContent?: HelpContent;
}

/**
 * HelpTooltip component
 * 
 * A reusable component that displays a help icon with a tooltip containing
 * help information for a specific component or feature.
 */
const HelpTooltip: React.FC<HelpTooltipProps> = ({
  category,
  itemKey,
  placement = 'top',
  size = 'small',
  iconColor = 'action',
  customContent
}) => {
  // Get help content from utils or use custom content if provided
  const content = customContent || getHelpContent(category, itemKey);
  
  if (!content) {
    return null;
  }
  
  return (
    <Tooltip
      title={
        <Box sx={{ p: 0.5 }}>
          <Typography variant="subtitle2" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {content.title}
          </Typography>
          <Typography variant="body2" component="div" sx={{ mb: content.learnMoreLink ? 1 : 0 }}>
            {content.description}
          </Typography>
          {content.learnMoreLink && (
            <Link 
              href={content.learnMoreLink} 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ fontSize: '0.75rem', display: 'block', textAlign: 'right' }}
            >
              Learn more
            </Link>
          )}
        </Box>
      }
      placement={placement}
      arrow
    >
      <IconButton size={size} sx={{ p: size === 'small' ? 0.5 : 1, color: iconColor }}>
        <HelpOutlineIcon fontSize={size} />
      </IconButton>
    </Tooltip>
  );
};

export default HelpTooltip;
