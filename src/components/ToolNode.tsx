import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useThemeContext } from '../context/ThemeContext';
import { useWorkflowStore } from '../store/workflowStore';
import DeleteIcon from '@mui/icons-material/Delete';

const ToolNode: React.FC<NodeProps> = ({ id, data }) => {
  const { mode } = useThemeContext();
  const isDarkMode = mode === 'dark';
  const { selectNode } = useWorkflowStore();

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  return (
    <div
      style={{
        background: isDarkMode ? '#3c366b' : '#f0fff4',
        color: isDarkMode ? '#e2e8f0' : '#1a202c',
        border: isDarkMode ? '1px solid #805ad5' : '1px solid #9ae6b4',
        transform: 'rotate(45deg)', // Diamond shape
        padding: '10px',
        width: '140px',
        height: '140px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        boxShadow: isDarkMode ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
      onDoubleClick={() => selectNode(id)}
    >
      <Handle 
        id="target-handle"
        type="target" 
        position={Position.Top} 
        style={{ 
          background: isDarkMode ? '#805ad5' : '#9ae6b4',
          transform: 'rotate(-45deg)', // Counter-rotate the handle
        }} 
      />
      <div style={{ 
        fontWeight: 'bold', 
        transform: 'rotate(-45deg)', // Counter-rotate the text
        textAlign: 'center',
      }}>
        {data.label}
      </div>
      
      {/* Delete icon */}
      <div 
        style={{
          position: 'absolute',
          bottom: '20px',
          transform: 'rotate(-45deg)', // Counter-rotate the icon
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
        style={{ 
          background: isDarkMode ? '#805ad5' : '#9ae6b4',
          transform: 'rotate(-45deg)', // Counter-rotate the handle
        }} 
      />
    </div>
  );
};

export default ToolNode;
