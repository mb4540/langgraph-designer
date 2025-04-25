import React from 'react';

// Import all possible agent icons
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AssistantIcon from '@mui/icons-material/Assistant';
import BiotechIcon from '@mui/icons-material/Biotech';
import SchoolIcon from '@mui/icons-material/School';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DataObjectIcon from '@mui/icons-material/DataObject';
import TerminalIcon from '@mui/icons-material/Terminal';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DescriptionIcon from '@mui/icons-material/Description';
import SecurityIcon from '@mui/icons-material/Security';

/**
 * Map of icon IDs to their components
 */
export const iconComponents: Record<string, React.ComponentType<any>> = {
  'smart-toy': SmartToyIcon,
  'psychology': PsychologyIcon,
  'support-agent': SupportAgentIcon,
  'assistant': AssistantIcon,
  'biotech': BiotechIcon,
  'school': SchoolIcon,
  'auto-fix': AutoFixHighIcon,
  'data-object': DataObjectIcon,
  'terminal': TerminalIcon,
  'account-tree': AccountTreeIcon,
  'description': DescriptionIcon,
  'security': SecurityIcon,
};

/**
 * Get the icon component for a given icon ID
 * @param iconId The ID of the icon to get
 * @param defaultIcon The default icon to use if the icon ID is not found
 * @returns The icon component
 */
export const getIconComponent = (iconId: string | undefined, defaultIcon: React.ComponentType<any> = SmartToyIcon): React.ComponentType<any> => {
  if (!iconId || !iconComponents[iconId]) {
    return defaultIcon;
  }
  return iconComponents[iconId];
};

/**
 * Get a list of available icon IDs
 * @returns Array of icon IDs
 */
export const getAvailableIconIds = (): string[] => {
  return Object.keys(iconComponents);
};

/**
 * Get a human-readable name for an icon ID
 * @param iconId The ID of the icon
 * @returns A formatted name for the icon
 */
export const getIconDisplayName = (iconId: string): string => {
  // Convert kebab-case to Title Case
  return iconId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
