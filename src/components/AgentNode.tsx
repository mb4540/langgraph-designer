import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useThemeContext } from '../context/ThemeContext';
import { useWorkflowStore, NodeType } from '../store/workflowStore';
import DeleteIcon from '@mui/icons-material/Delete';

interface DiamondProps {
  label: string;
  position: number;
  onClick: () => void;
  isDarkMode: boolean;
  color: string;
  lightColor: string;
  handleId: string;
}

const Diamond: React.FC<DiamondProps> = ({ label, position, onClick, isDarkMode, color, lightColor, handleId }) => {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        bottom: '-30px',
        left: `${position}%`,
        transform: 'translateX(-50%) rotate(45deg)',
        width: '24px',
        height: '24px',
        background: isDarkMode ? color : lightColor,
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        borderRadius: '2px',
        boxShadow: isDarkMode ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
      title={`Add ${label}`}
    >
      <div style={{
        transform: 'rotate(-45deg)',
        fontSize: '10px',
        fontWeight: 'bold',
        color: isDarkMode ? '#fff' : '#2a4365',
        userSelect: 'none',
      }}>
        {label.charAt(0)}
      </div>
      
      {/* Custom handle for this diamond */}
      <Handle
        id={handleId}
        type="source"
        position={Position.Bottom}
        style={{
          background: isDarkMode ? color : lightColor,
          transform: 'translateY(12px)', // Position at the bottom of the diamond
          visibility: 'hidden', // Hide the handle visually but keep it functional
        }}
      />
    </div>
  );
};

const AgentNode: React.FC<NodeProps> = ({ id, data }) => {
  const { mode } = useThemeContext();
  const isDarkMode = mode === 'dark';
  const { addNode, addEdge, selectNode } = useWorkflowStore();

  const handleAddComponent = (type: NodeType, handleId: string) => {
    // Generate a unique ID
    const newId = `${type}-${Date.now()}`;
    
    // Get the position of the agent node to position the new component relative to it
    const agentNode = useWorkflowStore.getState().nodes.find(node => node.id === id);
    if (!agentNode) return;
    
    // Position the new node below the agent with some randomness
    const newNodePosition = {
      x: agentNode.position.x + (Math.random() * 200 - 100),
      y: agentNode.position.y + 200 + (Math.random() * 50)
    };

    // Create the new node based on type
    const newNode = {
      id: newId,
      type: type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
      content: `This is a ${type} component.`,
      position: newNodePosition,
      parentId: id, // Reference to the parent agent
      sourceHandle: handleId, // Store which diamond created this node
    };

    // Add the new node
    addNode(newNode);
    
    // Create an edge from the agent's specific diamond handle to the new component
    const newEdge = {
      id: `e${id}-${newId}`,
      source: id,
      target: newId,
      animated: true, // Add animation to show data flow
      sourceHandle: handleId, // Connect from the specific diamond handle
      targetHandle: 'target-handle', // Connect to the default target handle
    };
    
    // Add the edge
    addEdge(newEdge);
    
    // Select the new node to open it in the details panel
    selectNode(newId);
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  return (
    <div
      style={{
        background: isDarkMode ? '#2a4365' : '#ebf8ff',
        color: isDarkMode ? '#e2e8f0' : '#1a202c',
        border: isDarkMode ? '1px solid #4299e1' : '1px solid #63b3ed',
        borderRadius: '8px',
        padding: '10px',
        minWidth: '180px',
        position: 'relative',
        paddingBottom: '20px',
        marginBottom: '30px', // Add space for the diamonds
        boxShadow: isDarkMode ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
      onDoubleClick={() => selectNode(id)}
    >
      <Handle type="target" position={Position.Top} style={{ background: isDarkMode ? '#4299e1' : '#63b3ed' }} />
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{data.label}</div>
      
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
      
      {/* Diamond connectors at the bottom with matching colors to their respective nodes */}
      <Diamond
        label="Model"
        position={12.5}
        onClick={() => handleAddComponent('model', 'model-handle')}
        isDarkMode={isDarkMode}
        color="#38b2ac"
        lightColor="#4fd1c5"
        handleId="model-handle"
      />
      <Diamond
        label="Memory"
        position={37.5}
        onClick={() => handleAddComponent('memory', 'memory-handle')}
        isDarkMode={isDarkMode}
        color="#f39c12"
        lightColor="#f6ad55"
        handleId="memory-handle"
      />
      <Diamond
        label="Tools"
        position={62.5}
        onClick={() => handleAddComponent('tool', 'tool-handle')}
        isDarkMode={isDarkMode}
        color="#805ad5"
        lightColor="#9ae6b4"
        handleId="tool-handle"
      />
      <Diamond
        label="Output Parser"
        position={87.5}
        onClick={() => handleAddComponent('outputParser', 'parser-handle')}
        isDarkMode={isDarkMode}
        color="#3182ce"
        lightColor="#4299e1"
        handleId="parser-handle"
      />
      
      {/* We keep the default source handle for backward compatibility */}
      <Handle type="source" position={Position.Bottom} style={{ background: isDarkMode ? '#4299e1' : '#63b3ed', visibility: 'hidden' }} />
    </div>
  );
};

export default AgentNode;
