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
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      ...sx 
    }}>
      <FormControl component="fieldset" fullWidth>
        <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'medium' }}>Memory Type</FormLabel>
        <RadioGroup
          value={memoryType}
          onChange={(e) => onMemoryTypeChange(e.target.value)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {MEMORY_TYPES.map(memory => (
            <Box 
              key={memory.value} 
              sx={{ 
                border: 1, 
                borderColor: memoryType === memory.value ? 'primary.main' : 'divider', 
                borderRadius: 1, 
                p: 2,
                transition: 'all 0.2s',
                backgroundColor: memoryType === memory.value ? 'action.selected' : 'transparent',
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
                  <Box sx={{ ml: 1 }}>
                    <Typography variant="subtitle1" fontWeight={memoryType === memory.value ? 'medium' : 'regular'}>
                      {memory.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {memory.description}
                    </Typography>
                    {memory.source && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        Source: {memory.source}
                      </Typography>
                    )}
                  </Box>
                } 
                sx={{ 
                  margin: 0,
                  width: '100%',
                  alignItems: 'flex-start'
                }}
              />
            </Box>
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default MemoryTypeSelector;
