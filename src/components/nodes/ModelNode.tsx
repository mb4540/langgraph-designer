import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useThemeContext } from '../../context/ThemeContext';
import { useWorkflowStore } from '../../store/workflowStore';
import DeleteIcon from '@mui/icons-material/Delete';

const ModelNode: React.FC<NodeProps> = ({ id, data }) => {
  const { mode } = useThemeContext();
  const isDarkMode = mode === 'dark';
  const { selectNode } = useWorkflowStore();

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  // Colors that match the model diamond
  const color = isDarkMode ? '#38b2ac' : '#4fd1c5';
  const darkColor = isDarkMode ? '#2c9a9a' : '#38a89d'; // Darker shade for outline
  const lightColor = isDarkMode ? 'rgba(56, 178, 172, 0.2)' : 'rgba(79, 209, 197, 0.2)'; // Lighter shade for fill

  return (
    <div
      style={{
        background: lightColor,
        color: isDarkMode ? '#e2e8f0' : '#1a202c',
        border: `2px solid ${darkColor}`,
        borderRadius: '50%', // Circle shape
        padding: '10px',
        width: '150px',
        height: '150px',
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
          bottom: '30px',
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
export default memo(ModelNode);
