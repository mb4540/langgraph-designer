import React, { useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useThemeContext } from '../context/ThemeContext';
import { useNodeStore, useEdgeStore, useSelectionStore } from '../store';
import { NodeType } from '../types/nodeTypes';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Diamond from './nodes/Diamond';

// Import utility functions
import { getIconComponent } from '../utils/iconUtils';
import { getModelDisplayName } from '../utils/modelUtils';

// Node position constants
const NODE_POSITIONS = {
  memory: { x: -50, y: 200 },
  tool: { x: 50, y: 200 },
  agent: { x: 300, y: 0 } // For connected agents
};

// Color constants
const COLORS = {
  memory: {
    main: '#f39c12',
    light: '#f6ad55',
  },
  tool: {
    main: '#805ad5',
    light: '#9ae6b4',
  },
  agent: {
    main: '#4299e1',
    light: '#63b3ed',
    dark: '#2a4365',
    background: '#ebf8ff',
  }
};

/**
 * MainAgentNode component for displaying agent nodes in the workflow graph
 */
const AgentNode: React.FC<NodeProps> = ({ id, data }) => {
  const { mode } = useThemeContext();
  const isDarkMode = mode === 'dark';
  const { addNode } = useNodeStore();
  const { addEdge } = useEdgeStore();
  const { selectNode } = useSelectionStore();

  // Get the icon component for this agent
  const IconComponent = getIconComponent(data.icon || 'smart-toy');

  /**
   * Creates a new child component of the specified type
   */
  const handleAddComponent = useCallback((type: NodeType, handleId: string) => {
    // Generate a unique ID
    const newId = `${type}-${Date.now()}`;
    
    // Get the position of the current agent node
    const agentNode = useNodeStore.getState().nodes.find(node => node.id === id);
    if (!agentNode) return;
    
    // Use fixed position offset based on the component type
    const offset = NODE_POSITIONS[type] || { x: 0, y: 0 };
    const newNodePosition = {
      x: agentNode.position.x + offset.x,
      y: agentNode.position.y + offset.y
    };

    // Create the new node
    const newNode = {
      id: newId,
      type,
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      content: `This is a ${type} component.`,
      position: newNodePosition,
      parentId: id, // Reference to the parent agent
      sourceHandle: handleId, // The handle ID from which this node was created
    };

    // Add the new node
    addNode(newNode);
    
    // Create an edge from the agent to the new node
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
  }, [id, addNode, addEdge, selectNode]);

  /**
   * Creates a new connected agent node
   */
  const handleAddAgent = useCallback(() => {
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
      parentId: id, // Reference to the parent agent
      sourceHandle: 'agent-handle', // The handle ID from which this node was created
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
  }, [id, addNode, addEdge, selectNode]);

  /**
   * Handles deletion of the node
   */
  const handleDelete = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    if (data.onDelete) {
      data.onDelete(id);
    }
  }, [id, data]);

  // Style definitions
  const styles = {
    node: {
      background: isDarkMode ? COLORS.agent.dark : COLORS.agent.background,
      color: isDarkMode ? '#e2e8f0' : '#1a202c',
      border: isDarkMode ? `1px solid ${COLORS.agent.main}` : `1px solid ${COLORS.agent.light}`,
      borderRadius: '8px',
      padding: '10px',
      minWidth: '180px',
      position: 'relative' as const,
      paddingBottom: '20px',
      marginBottom: '30px', // Add space for the diamonds
      boxShadow: isDarkMode ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    handle: {
      background: isDarkMode ? COLORS.agent.main : COLORS.agent.light,
    },
    icon: {
      position: 'absolute' as const,
      top: '10px',
      left: '10px',
      color: isDarkMode ? COLORS.agent.main : COLORS.agent.main,
    },
    content: { 
      marginTop: '5px', 
      marginLeft: '40px', // Add space for the icon
      fontWeight: 'normal' as const, 
      display: 'flex' as const,
      flexDirection: 'column' as const,
      gap: '5px'
    },
    modelInfo: { 
      fontSize: '0.8rem', 
      color: isDarkMode ? '#a0aec0' : '#4a5568',
      marginBottom: '8px'
    },
    nodeLabel: {
      fontWeight: 'bold',
      marginBottom: '8px'
    },
    agentConnector: {
      position: 'relative' as const,
    },
    agentButton: {
      position: 'absolute' as const,
      right: '-20px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '20px',
      height: '20px',
      background: isDarkMode ? COLORS.agent.dark : COLORS.agent.background,
      border: isDarkMode ? `1px solid ${COLORS.agent.main}` : `1px solid ${COLORS.agent.light}`,
      display: 'flex' as const,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      zIndex: 10,
      boxShadow: isDarkMode ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
    },
    addIcon: {
      fontSize: '14px',
      color: isDarkMode ? COLORS.agent.main : COLORS.agent.light
    },
    agentHandle: {
      background: isDarkMode ? COLORS.agent.main : COLORS.agent.light,
      right: '-4px',
      width: '8px',
      height: '8px',
      zIndex: 20,
    },
    deleteButton: {
      position: 'absolute' as const,
      bottom: '5px',
      right: '5px',
      cursor: 'pointer',
      color: isDarkMode ? '#e53e3e' : '#f56565',
    }
  };

  return (
    <div style={styles.node} onDoubleClick={() => selectNode(id)}>
      {/* Target handle at the top */}
      <Handle type="target" position={Position.Top} style={styles.handle} />
      
      {/* Agent Icon */}
      <div style={styles.icon}>
        <IconComponent fontSize="medium" />
      </div>
      
      {/* Node content */}
      <div style={styles.content}>
        <div style={styles.nodeLabel}>{data.label}</div>
      
        {/* Display LLM model if available */}
        {data.llmModel && (
          <div style={styles.modelInfo}>
            Model: {getModelDisplayName(data.llmModel)}
          </div>
        )}
      </div>
      
      {/* Agent connector with plus button */}
      <div style={styles.agentConnector}>
        <div
          onClick={handleAddAgent}
          style={styles.agentButton}
          title="Add connected agent"
        >
          <AddIcon style={styles.addIcon} />
          
          {/* Agent handle */}
          <Handle
            id="agent-handle"
            type="source"
            position={Position.Right}
            style={styles.agentHandle}
          />
        </div>
      </div>
      
      {/* Delete button */}
      <div 
        style={styles.deleteButton}
        onClick={handleDelete}
        title="Delete node"
      >
        <DeleteIcon fontSize="small" />
      </div>
      
      {/* Diamond connectors for memory and tools */}
      <Diamond
        label="Memory"
        position={25}
        onClick={() => handleAddComponent('memory', 'memory-handle')}
        isDarkMode={isDarkMode}
        color={COLORS.memory.main}
        lightColor={COLORS.memory.light}
        handleId="memory-handle"
        nodeType="memory"
      />
      <Diamond
        label="Tools"
        position={75}
        onClick={() => handleAddComponent('tool', 'tool-handle')}
        isDarkMode={isDarkMode}
        color={COLORS.tool.main}
        lightColor={COLORS.tool.light}
        handleId="tool-handle"
        nodeType="tool"
      />
    </div>
  );
};

export default AgentNode;
