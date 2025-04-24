import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useThemeContext } from '../context/ThemeContext';
import { useWorkflowStore } from '../store/workflowStore';
import DeleteIcon from '@mui/icons-material/Delete';

const MemoryNode: React.FC<NodeProps> = ({ id, data }) => {
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
        background: isDarkMode ? '#2c3e50' : '#fffaf0',
        color: isDarkMode ? '#e2e8f0' : '#1a202c',
        border: isDarkMode ? '1px solid #f39c12' : '1px solid #f6ad55',
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', // Hexagon shape
        padding: '10px',
        width: '160px',
        height: '140px',
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
        style={{ background: isDarkMode ? '#f39c12' : '#f6ad55' }} 
      />
      <div style={{ fontWeight: 'bold' }}>{data.label}</div>
      
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
        style={{ background: isDarkMode ? '#f39c12' : '#f6ad55' }} 
      />
    </div>
  );
};

export default MemoryNode;
