import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Chip from '@mui/material/Chip';
import { ToolType } from '../../../../types/nodeTypes';

interface ToolCardProps {
  tool: ToolType;
  selected: boolean;
  onSelect: (value: string) => void;
  onEdit: () => void;
  onTagClick: (tag: string) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ 
  tool, 
  selected, 
  onSelect, 
  onEdit,
  onTagClick 
}) => {
  return (
    <Card 
      sx={{ 
        mb: 2, 
        border: selected ? 2 : 1,
        borderColor: selected ? 'primary.main' : 'divider',
        borderRadius: 1,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography 
            variant="subtitle1" 
            fontWeight={selected ? 'bold' : 'normal'}
          >
            {tool.label}
          </Typography>
          {selected && (
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation(); // Prevent card selection
                onEdit();
              }}
              title="Edit MCP code"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
        <CardActionArea 
          onClick={() => onSelect(tool.value)}
          sx={{ mt: 1 }} // Add margin to separate from the header
        >
          <Typography variant="body2" color="text.secondary">
            {tool.description}
          </Typography>
          {tool.source && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Source: {tool.source}
            </Typography>
          )}
          
          {/* Display tags */}
          {tool.tags && tool.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
              {tool.tags.map((tag: string) => (
                <Chip 
                  key={tag} 
                  label={tag} 
                  size="small" 
                  variant="outlined"
                  sx={{ height: 20, '& .MuiChip-label': { px: 1, py: 0 } }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card selection
                    onTagClick(tag);
                  }}
                />
              ))}
            </Box>
          )}
          
          {/* Display version information in each tool card */}
          <Box sx={{ display: 'flex', mt: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1 }}>
              ID: {tool.versionedId}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Version: {tool.version}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            Created: {new Date(tool.createdAt || '').toLocaleString()}
          </Typography>
        </CardActionArea>
      </CardContent>
    </Card>
  );
};

export default ToolCard;
