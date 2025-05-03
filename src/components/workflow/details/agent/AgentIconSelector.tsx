import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

// Import icons for agent icon selection
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

// Define agent icon options
export const AGENT_ICONS = [
  { id: 'smart-toy', label: 'AI Assistant', icon: SmartToyIcon },
  { id: 'psychology', label: 'Cognitive Agent', icon: PsychologyIcon },
  { id: 'support-agent', label: 'Support Agent', icon: SupportAgentIcon },
  { id: 'assistant', label: 'Personal Assistant', icon: AssistantIcon },
  { id: 'biotech', label: 'Research Agent', icon: BiotechIcon },
  { id: 'school', label: 'Education Agent', icon: SchoolIcon },
  { id: 'auto-fix', label: 'Creative Agent', icon: AutoFixHighIcon },
  { id: 'data-object', label: 'Data Agent', icon: DataObjectIcon },
  { id: 'terminal', label: 'Code Agent', icon: TerminalIcon },
  { id: 'account-tree', label: 'Workflow Agent', icon: AccountTreeIcon },
  { id: 'description', label: 'Document Agent', icon: DescriptionIcon },
  { id: 'security', label: 'Security Agent', icon: SecurityIcon },
];

// Helper function to get icon component by ID
export const getIconById = (iconId: string) => {
  const iconOption = AGENT_ICONS.find(option => option.id === iconId);
  return iconOption ? iconOption.icon : SmartToyIcon; // Default to SmartToyIcon if not found
};

interface AgentIconSelectorProps {
  selectedIcon: string;
  onSelectIcon: (iconId: string) => void;
  sx?: SxProps<Theme>;
}

/**
 * A component for selecting an agent icon from a grid of options
 */
const AgentIconSelector: React.FC<AgentIconSelectorProps> = ({
  selectedIcon,
  onSelectIcon,
  sx = {}
}) => {
  return (
    <Grid container spacing={2} sx={sx}>
      {AGENT_ICONS.map((iconOption) => {
        const IconComponent = iconOption.icon;
        const isSelected = selectedIcon === iconOption.id;
        
        return (
          <Grid item xs={4} sm={3} md={2} key={iconOption.id}>
            <Card 
              onClick={() => onSelectIcon(iconOption.id)}
              sx={{
                cursor: 'pointer',
                border: isSelected ? 2 : 1,
                borderColor: isSelected ? 'primary.main' : 'divider',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 1,
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-2px)',
                  boxShadow: 1
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 1 }}>
                <IconComponent 
                  color={isSelected ? 'primary' : 'action'} 
                  sx={{ fontSize: 36, mb: 1 }} 
                />
                <Typography variant="caption" display="block">
                  {iconOption.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default AgentIconSelector;
