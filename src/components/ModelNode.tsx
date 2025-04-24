import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useThemeContext } from '../context/ThemeContext';
import { useWorkflowStore } from '../store/workflowStore';
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

  return (
    <div
      style={{
        background: isDarkMode ? '#2d3748' : '#e6fffa',
        color: isDarkMode ? '#e2e8f0' : '#1a202c',
        border: isDarkMode ? '1px solid #38b2ac' : '1px solid #4fd1c5',
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
        style={{ background: isDarkMode ? '#38b2ac' : '#4fd1c5' }} 
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
        style={{ background: isDarkMode ? '#38b2ac' : '#4fd1c5' }} 
      />
    </div>
  );
};

export default ModelNode;
