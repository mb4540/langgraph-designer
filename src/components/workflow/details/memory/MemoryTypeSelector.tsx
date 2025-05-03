import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { SxProps, Theme } from '@mui/material/styles';

import { MEMORY_TYPES } from './memoryData';

interface MemoryTypeSelectorProps {
  memoryType: string;
  onMemoryTypeChange: (memoryType: string) => void;
  sx?: SxProps<Theme>;
}

/**
 * A component for selecting a memory type from a list of options
 */
const MemoryTypeSelector: React.FC<MemoryTypeSelectorProps> = ({
  memoryType,
  onMemoryTypeChange,
  sx = {}
}) => {
  return (
    <Box sx={{ ...sx }}>
      <FormControl component="fieldset" fullWidth>
        <FormLabel component="legend">Memory Type</FormLabel>
        <RadioGroup
          value={memoryType}
          onChange={(e) => onMemoryTypeChange(e.target.value)}
        >
          {MEMORY_TYPES.map(memory => (
            <Box 
              key={memory.value} 
              sx={{ 
                mb: 2, 
                border: 1, 
                borderColor: 'divider', 
                borderRadius: 1, 
                p: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: 1
                }
              }}
            >
              <FormControlLabel 
                value={memory.value} 
                control={<Radio />} 
                label={
                  <Box>
                    <Typography variant="subtitle1">{memory.label}</Typography>
                    <Typography variant="body2" color="text.secondary">{memory.description}</Typography>
                    {memory.source && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        Source: {memory.source}
                      </Typography>
                    )}
                  </Box>
                } 
              />
            </Box>
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default MemoryTypeSelector;
