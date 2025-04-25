import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useThemeContext } from '../context/ThemeContext';
import { useWorkflowStore, NodeType } from '../store/workflowStore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// Define fixed positions for each node type relative to the parent agent
const NODE_POSITIONS = {
  model: { x: -150, y: 200 },
  memory: { x: -50, y: 200 },
  tool: { x: 50, y: 200 },
  agent: { x: 300, y: 0 } // For connected agents
};

interface DiamondProps {
  label: string;
  position: number;
  onClick: () => void;
  isDarkMode: boolean;
  color: string;
  lightColor: string;
  handleId: string;
  nodeType: NodeType;
}

const Diamond: React.FC<DiamondProps> = ({ label, position, onClick, isDarkMode, color, lightColor, handleId, nodeType }) => {
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
      
      {/* Custom handle for this diamond - positioned at the bottom point of the diamond */}
      <Handle
        id={handleId}
        type="source"
        position={Position.Bottom}
        style={{
          background: isDarkMode ? color : lightColor,
          transform: 'translateY(12px) rotate(-45deg)', // Position at the bottom point of the diamond
          bottom: '0',
          left: '50%',
          width: '8px',
          height: '8px',
          zIndex: 20,
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
    
    // Use fixed position offsets based on node type
    const newNodePosition = {
      x: agentNode.position.x + NODE_POSITIONS[type].x,
      y: agentNode.position.y + NODE_POSITIONS[type].y
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
      // Add default LLM model for model nodes
      ...(type === 'model' && { llmModel: 'gpt-4o' }),
      // Add default memory type for memory nodes
      ...(type === 'memory' && { memoryType: 'conversation-buffer' }),
      // Add default tool type for tool nodes
      ...(type === 'tool' && { toolType: 'stagehand-browser' })
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

  const handleAddAgent = () => {
    // Generate a unique ID
    const newId = `agent-${Date.now()}`;
    
    // Get the position of the current agent node
    const agentNode = useWorkflowStore.getState().nodes.find(node => node.id === id);
    if (!agentNode) return;
    
    // Use fixed position offset for agent nodes
    const newNodePosition = {
      x: agentNode.position.x + NODE_POSITIONS.agent.x,
      y: agentNode.position.y + NODE_POSITIONS.agent.y
    };

    // Create the new agent node
    const newNode = {
      id: newId,
      type: 'agent' as NodeType, 
      name: 'New Agent',
      content: 'This is a new agent.',
      position: newNodePosition,
    };

    // Add the new agent node
    addNode(newNode);
    
    // Create an edge from the current agent to the new agent
    const newEdge = {
      id: `e${id}-${newId}`,
      source: id,
      target: newId,
      animated: true, // Add animation to show data flow
      sourceHandle: 'agent-handle', // Connect from the agent handle
      targetHandle: 'target-handle', // Connect to the default target handle
    };
    
    // Add the edge
    addEdge(newEdge);
    
    // Select the new agent to open it in the details panel
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
      
      {/* Small circle on the right side with connecting line and plus square */}
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            right: '-12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '24px',
            height: '24px',
            background: isDarkMode ? '#4299e1' : '#63b3ed',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            boxShadow: isDarkMode ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{
            fontSize: '10px',
            fontWeight: 'bold',
            color: isDarkMode ? '#fff' : '#2a4365',
            userSelect: 'none',
          }}>
            A
          </div>
          
          {/* Handle for the circle */}
          <Handle
            id="agent-handle"
            type="source"
            position={Position.Right}
            style={{
              background: isDarkMode ? '#4299e1' : '#63b3ed',
              right: '-4px',
              width: '8px',
              height: '8px',
              zIndex: 20,
            }}
          />
        </div>
        
        {/* Connecting line */}
        <div
          style={{
            position: 'absolute',
            right: '-60px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '40px',
            height: '2px',
            background: isDarkMode ? '#4299e1' : '#63b3ed',
            zIndex: 9,
          }}
        />
        
        {/* Square with plus sign */}
        <div
          onClick={handleAddAgent}
          style={{
            position: 'absolute',
            right: '-80px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            background: isDarkMode ? '#2a4365' : '#ebf8ff',
            border: isDarkMode ? '1px solid #4299e1' : '1px solid #63b3ed',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            boxShadow: isDarkMode ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
          }}
          title="Add connected agent"
        >
          <AddIcon style={{ fontSize: '14px', color: isDarkMode ? '#4299e1' : '#63b3ed' }} />
        </div>
      </div>
      
      {/* Delete icon */}
      <div 
        style={{
          position: 'absolute',
          bottom: '5px',
          left: '5px',
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
        nodeType="model"
      />
      <Diamond
        label="Memory"
        position={37.5}
        onClick={() => handleAddComponent('memory', 'memory-handle')}
        isDarkMode={isDarkMode}
        color="#f39c12"
        lightColor="#f6ad55"
        handleId="memory-handle"
        nodeType="memory"
      />
      <Diamond
        label="Tools"
        position={62.5}
        onClick={() => handleAddComponent('tool', 'tool-handle')}
        isDarkMode={isDarkMode}
        color="#805ad5"
        lightColor="#9ae6b4"
        handleId="tool-handle"
        nodeType="tool"
      />
    </div>
  );
};

export default AgentNode;
