import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';

interface ToolTag {
  value: string;
  category: string;
}

interface ToolSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onCategoryToggle: (category: string) => void;
  onClearAllTags: () => void;
  toolTags: ToolTag[];
  sortBy: 'name' | 'category';
  onSortChange: (sortBy: 'name' | 'category') => void;
  resultCount: number;
}

const ToolSearch: React.FC<ToolSearchProps> = ({
  searchQuery,
  onSearchChange,
  selectedTags,
  onTagToggle,
  onCategoryToggle,
  onClearAllTags,
  toolTags,
  sortBy,
  onSortChange,
  resultCount
}) => {
  const [filterAnchorEl, setFilterAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleFilterOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  // Get unique categories from toolTags
  const categories = Array.from(new Set(toolTags.map(tag => tag.category)));

  return (
    <>
      {/* Search and filter bar */}
      <Box sx={{ display: 'flex', mb: 3, gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Search tools..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <IconButton 
          onClick={handleFilterOpen} 
          color={selectedTags.length > 0 ? "primary" : "default"}
          title="Filter by tags"
        >
          <FilterListIcon />
        </IconButton>
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterClose}
          PaperProps={{
            style: {
              maxHeight: 400,
              width: 280,
            },
          }}
        >
          {/* Sort options */}
          <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle2" gutterBottom>
              Sort by
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip 
                label="Name" 
                onClick={() => onSortChange('name')} 
                color={sortBy === 'name' ? 'primary' : 'default'}
                size="small"
                variant={sortBy === 'name' ? 'filled' : 'outlined'}
              />
              <Chip 
                label="Source" 
                onClick={() => onSortChange('category')} 
                color={sortBy === 'category' ? 'primary' : 'default'}
                size="small"
                variant={sortBy === 'category' ? 'filled' : 'outlined'}
              />
            </Box>
          </Box>
          
          {/* Filter by category */}
          {categories.map(category => {
            const categoryTags = toolTags.filter(tag => tag.category === category);
            const allSelected = categoryTags.every(tag => selectedTags.includes(tag.value));
            const someSelected = categoryTags.some(tag => selectedTags.includes(tag.value)) && !allSelected;
            
            return (
              <Box key={category} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <MenuItem 
                  dense 
                  onClick={() => onCategoryToggle(category)}
                  sx={{ bgcolor: someSelected ? 'action.selected' : 'inherit' }}
                >
                  <Checkbox 
                    checked={allSelected} 
                    indeterminate={someSelected}
                    sx={{ p: 0.5 }}
                  />
                  <ListItemText 
                    primary={category} 
                    primaryTypographyProps={{ variant: 'subtitle2' }} 
                  />
                </MenuItem>
                {categoryTags.map(tag => (
                  <MenuItem 
                    key={tag.value} 
                    onClick={() => onTagToggle(tag.value)}
                    dense
                    sx={{ pl: 4 }}
                  >
                    <Checkbox 
                      checked={selectedTags.includes(tag.value)} 
                      sx={{ p: 0.5 }}
                    />
                    <ListItemText primary={tag.value} />
                  </MenuItem>
                ))}
              </Box>
            );
          })}
        </Menu>
      </Box>

      {/* Selected tags display and result count */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, flex: 1 }}>
          {selectedTags.length > 0 && (
            <>
              {selectedTags.map(tag => (
                <Chip 
                  key={tag} 
                  label={tag} 
                  onDelete={() => onTagToggle(tag)} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                />
              ))}
              <Chip 
                label="Clear all" 
                onClick={onClearAllTags} 
                size="small" 
                variant="outlined"
              />
            </>
          )}
        </Box>
        {resultCount > 0 && (
          <Typography variant="caption" color="text.secondary">
            {resultCount} {resultCount === 1 ? 'tool' : 'tools'} found
          </Typography>
        )}
      </Box>
    </>
  );
};

export default ToolSearch;
