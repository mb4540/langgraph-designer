import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useThemeContext } from '../../context/ThemeContext';
import { useSelectionStore } from '../../store';
import DeleteIcon from '@mui/icons-material/Delete';

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

  // Colors that match the memory diamond in AgentNode.tsx
  const color = isDarkMode ? '#f39c12' : '#f39c12';
  const darkColor = isDarkMode ? '#d68910' : '#d68910'; // Darker shade for outline
  const lightColor = isDarkMode ? 'rgba(243, 156, 18, 0.2)' : 'rgba(243, 156, 18, 0.2)'; // Lighter shade for fill

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
      <div style={{ fontWeight: 'bold', color: darkColor }}>{data.label}</div>
      
      {/* Delete icon */}
      <div 
        style={{
          position: 'absolute',
          bottom: '5px',
          right: '5px',
          cursor: 'pointer',
          color: isDarkMode ? '#e53e3e' : '#f56565',
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
