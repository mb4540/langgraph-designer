import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useThemeContext } from '../../context/ThemeContext';
import { useSelectionStore } from '../../store';
import DeleteIcon from '@mui/icons-material/Delete';
import MemoryIcon from '@mui/icons-material/Memory';

const MemoryNode: React.FC<NodeProps> = ({ id, data }) => {
  const { mode } = useThemeContext();
  const isDarkMode = mode === 'dark';
  const { selectNode } = useSelectionStore();

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  // Colors for memory node - pastel green
  const darkColor = isDarkMode ? '#2e7d32' : '#4caf50'; // Darker green for border
  const lightColor = isDarkMode ? 'rgba(46, 125, 50, 0.2)' : 'rgba(200, 230, 201, 1)'; // Pastel green for background

  return (
    <div
      style={{
        background: lightColor,
        color: isDarkMode ? '#e2e8f0' : '#1a202c',
        border: `2px solid ${darkColor}`,
        borderRadius: '8px', // Rectangle with rounded corners
        padding: '10px',
        width: '180px',
        minHeight: '100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        boxShadow: isDarkMode ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
      onDoubleClick={() => selectNode(id)}
    >
      <Handle 
        id="target-handle"
        type="target" 
        position={Position.Top} 
        style={{ background: darkColor }} 
      />
      
      {/* Memory Icon */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        color: isDarkMode ? '#4caf50' : '#2e7d32', // Green color for the icon
      }}>
        <MemoryIcon fontSize="medium" />
      </div>
      
      <div style={{ 
        fontWeight: 'bold', 
        color: '#000000', 
        marginLeft: '40px', 
        width: '100%',
        textAlign: 'left'
      }}>{data.label}</div>
      
      {/* Delete icon */}
      <div 
        style={{
          position: 'absolute',
          bottom: '5px',
          left: '5px',
          cursor: 'pointer',
          color: isDarkMode ? '#e2e8f0' : '#4a5568',
        }}
        onClick={handleDelete}
        title="Delete node"
      >
        <DeleteIcon fontSize="small" />
      </div>
      
      <Handle 
        id="source-handle"
        type="source" 
        position={Position.Bottom} 
        style={{ background: darkColor }} 
      />
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(MemoryNode);
