import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ToolType } from '../../../../types/nodeTypes';
import ToolCard from './ToolCard';
import ToolSearch from './ToolSearch';

interface ToolSelectorProps {
  toolTypes: ToolType[];
  selectedToolType: string;
  onToolTypeSelect: (value: string) => void;
  onEditTool: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onCategoryToggle: (category: string) => void;
  onClearAllTags: () => void;
  toolTags: { value: string; category: string }[];
  sortBy: 'name' | 'category';
  onSortChange: (sortBy: 'name' | 'category') => void;
  filteredTools: ToolType[];
}

const ToolSelector: React.FC<ToolSelectorProps> = ({
  toolTypes,
  selectedToolType,
  onToolTypeSelect,
  onEditTool,
  searchQuery,
  onSearchChange,
  selectedTags,
  onTagToggle,
  onCategoryToggle,
  onClearAllTags,
  toolTags,
  sortBy,
  onSortChange,
  filteredTools
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      gap: 2
    }}>
      <ToolSearch
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        selectedTags={selectedTags}
        onTagToggle={onTagToggle}
        onCategoryToggle={onCategoryToggle}
        onClearAllTags={onClearAllTags}
        toolTags={toolTags}
        sortBy={sortBy}
        onSortChange={onSortChange}
        resultCount={filteredTools.length}
      />

      {/* Tool cards */}
      {filteredTools.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No tools match your search criteria
        </Typography>
      ) : (
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          {filteredTools.map(tool => (
            <ToolCard
              key={tool.value}
              tool={tool}
              selected={selectedToolType === tool.value}
              onSelect={onToolTypeSelect}
              onEdit={onEditTool}
              onTagClick={(tag) => {
                if (!selectedTags.includes(tag)) {
                  onTagToggle(tag);
                }
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ToolSelector;
