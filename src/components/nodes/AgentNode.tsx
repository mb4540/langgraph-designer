import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useThemeContext } from '../../context/ThemeContext';
import { useNodeStore, useEdgeStore, useSelectionStore } from '../../store';
import { NodeType } from '../../types/nodeTypes';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// Import all possible agent icons
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AssistantIcon from '@mui/icons-material/Assistant';
import BiotechIcon from '@mui/icons-material/Biotech';
import SchoolIcon from '@mui/icons-material/School';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DataObjectIcon from '@mui/icons-material/DataObject';
import TerminalIcon from '@mui/icons-material/Terminal';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DescriptionIcon from '@mui/icons-material/Description';
import SecurityIcon from '@mui/icons-material/Security';

// Map of icon IDs to their components
const iconComponents: Record<string, React.ComponentType<any>> = {
  'smart-toy': SmartToyIcon,
  'psychology': PsychologyIcon,
  'support-agent': SupportAgentIcon,
  'assistant': AssistantIcon,
  'biotech': BiotechIcon,
  'school': SchoolIcon,
  'auto-fix': AutoFixHighIcon,
  'data-object': DataObjectIcon,
  'terminal': TerminalIcon,
  'account-tree': AccountTreeIcon,
  'description': DescriptionIcon,
  'security': SecurityIcon,
};

// Define fixed positions for each node type relative to the parent agent
const NODE_POSITIONS = {
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
  const { addNode } = useNodeStore();
  const { addEdge } = useEdgeStore();
  const { selectNode } = useSelectionStore();

  // Determine which icon to display
  const iconId = data.icon || 'smart-toy';
  const IconComponent = iconComponents[iconId] || SmartToyIcon;

  const handleAddComponent = (type: NodeType, handleId: string) => {
    // Generate a unique ID
    const newId = `${type}-${Date.now()}`;
    
    // Get the position of the agent node to position the new component relative to it
    const agentNode = useNodeStore.getState().nodes.find(node => node.id === id);
    if (!agentNode) return;
    
    // Check if the node type has a defined position, if not use a default position
    const nodePosition = NODE_POSITIONS[type] || { x: 0, y: 200 };
    
    // Use fixed position offsets based on node type
    const newNodePosition = {
      x: agentNode.position.x + nodePosition.x,
      y: agentNode.position.y + nodePosition.y
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
      // Add default memory type for memory nodes
      ...(type === 'memory' && { memoryType: 'conversation-buffer' }),
      // Add default tool type for tool nodes
      ...(type === 'tool' && { toolType: 'stagehand-browser' }),
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
    const agentNode = useNodeStore.getState().nodes.find(node => node.id === id);
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
        height: '100px', // Make the box twice as high
      }}
      onDoubleClick={() => selectNode(id)}
    >
      {/* Delete button */}
      <div
        style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          cursor: 'pointer',
          color: isDarkMode ? '#e2e8f0' : '#4a5568',
          zIndex: 10,
        }}
        onClick={handleDelete}
        title="Delete Agent"
      >
        <DeleteIcon fontSize="small" />
      </div>
      
      {/* Agent Icon */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        color: isDarkMode ? '#4299e1' : '#3182ce',
      }}>
        <IconComponent fontSize="medium" />
      </div>
      
      {/* Node content */}
      <div style={{ 
        marginTop: '5px', 
        marginLeft: '40px', // Add space for the icon
        fontWeight: 'normal', // Not bold
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
      }}>
        <div>{data.label}</div>
      </div>
      
      {/* Input handle */}
      <Handle
        id="target-handle"
        type="target"
        position={Position.Top}
        style={{
          background: isDarkMode ? '#4299e1' : '#63b3ed',
          width: '10px',
          height: '10px',
          top: '-5px',
        }}
      />
      
      {/* Diamonds for adding components - only Memory and Tool, positioned at 33% and 67% */}
      <Diamond
        label="Memory"
        position={33} // Repositioned to be equidistant
        onClick={() => handleAddComponent('memory', 'memory-handle')}
        isDarkMode={isDarkMode}
        color="#38a169"
        lightColor="#c6f6d5"
        handleId="memory-handle"
        nodeType="memory"
      />
      
      <Diamond
        label="Tool"
        position={67} // Repositioned to be equidistant
        onClick={() => handleAddComponent('tool', 'tool-handle')}
        isDarkMode={isDarkMode}
        color="#dd6b20"
        lightColor="#feebc8"
        handleId="tool-handle"
        nodeType="tool"
      />
      
      {/* Agent connection handle and button */}
      <div style={{ position: 'relative' }}>
        {/* Add agent button */}
        <div
          onClick={handleAddAgent}
          style={{
            position: 'absolute',
            right: '-20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            borderRadius: '4px',
            background: isDarkMode ? '#2a4365' : '#ebf8ff',
            border: isDarkMode ? '1px solid #4299e1' : '1px solid #63b3ed',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            zIndex: 10,
            boxShadow: isDarkMode ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          title="Add connected agent"
        >
          <AddIcon style={{ fontSize: '14px', color: isDarkMode ? '#4299e1' : '#63b3ed' }} />
          
          {/* Handle for the agent connection - moved to the right side of the plus button */}
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
      </div>
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default memo(AgentNode);
