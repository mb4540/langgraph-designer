import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  SelectChangeEvent,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

/**
 * Interface for entity-role pair
 */
export interface EntityRolePair {
  entity: string;
  role: string;
}

/**
 * Props for EntityRoleSelector component
 */
export interface EntityRoleSelectorProps {
  /**
   * Array of entity-role pairs
   */
  entityRolePairs: EntityRolePair[];
  
  /**
   * Callback when entity-role pairs change
   */
  onChange: (entityRolePairs: EntityRolePair[]) => void;
  
  /**
   * Available entity options
   */
  entityOptions?: Array<{ value: string; label: string }>;
  
  /**
   * Available role options
   */
  roleOptions?: Array<{ value: string; label: string }>;
  
  /**
   * Disable adding/removing rows
   */
  disableAddRemove?: boolean;
}

/**
 * A reusable component for selecting entity-role pairs
 */
const EntityRoleSelector: React.FC<EntityRoleSelectorProps> = ({
  entityRolePairs,
  onChange,
  entityOptions = [
    { value: 'Skill', label: 'Skill' },
    { value: 'Team', label: 'Team' },
    { value: 'Agent', label: 'Agent' },
    { value: 'Workflow', label: 'Workflow' },
  ],
  roleOptions = [
    { value: 'Read', label: 'Read' },
    { value: 'Write', label: 'Write' },
  ],
  disableAddRemove = false,
}) => {
  /**
   * Handle entity selection change
   */
  const handleEntityChange = (index: number, event: SelectChangeEvent) => {
    const updatedPairs = [...entityRolePairs];
    updatedPairs[index].entity = event.target.value as string;
    onChange(updatedPairs);
  };

  /**
   * Handle role selection change
   */
  const handleRoleChange = (index: number, event: SelectChangeEvent) => {
    const updatedPairs = [...entityRolePairs];
    updatedPairs[index].role = event.target.value as string;
    onChange(updatedPairs);
  };

  /**
   * Add a new entity-role pair
   */
  const handleAddEntityRolePair = () => {
    onChange([
      ...entityRolePairs,
      { entity: entityOptions[0].value, role: roleOptions[0].value },
    ]);
  };

  /**
   * Remove an entity-role pair
   */
  const handleRemoveEntityRolePair = (index: number) => {
    const updatedPairs = entityRolePairs.filter((_, i) => i !== index);
    onChange(updatedPairs);
  };

  return (
    <>
      {entityRolePairs.map((pair, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            gap: 2,
            mb: 2,
            alignItems: 'center',
          }}
        >
          <FormControl sx={{ minWidth: 120, flex: 1 }}>
            <InputLabel id={`entity-select-label-${index}`}>Entity</InputLabel>
            <Select
              labelId={`entity-select-label-${index}`}
              value={pair.entity}
              label="Entity"
              onChange={(e) => handleEntityChange(index, e)}
            >
              {entityOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120, flex: 1 }}>
            <InputLabel id={`role-select-label-${index}`}>Role</InputLabel>
            <Select
              labelId={`role-select-label-${index}`}
              value={pair.role}
              label="Role"
              onChange={(e) => handleRoleChange(index, e)}
            >
              {roleOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {!disableAddRemove && (
            index === 0 ? (
              <IconButton
                onClick={handleAddEntityRolePair}
                sx={{ color: '#00388f' }}
                aria-label="Add entity-role pair"
              >
                <AddCircleOutlineIcon />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => handleRemoveEntityRolePair(index)}
                sx={{ color: '#00388f' }}
                aria-label="Remove entity-role pair"
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
            )
          )}
        </Box>
      ))}
    </>
  );
};

export default EntityRoleSelector;
