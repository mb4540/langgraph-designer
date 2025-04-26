/**
 * Node position constants and utility functions for calculating node positions in the workflow graph
 */

/**
 * Fixed position offsets for different node types relative to their parent node
 */
export const NODE_POSITIONS = {
  memory: { x: -50, y: 200 },
  tool: { x: 50, y: 200 },
  agent: { x: 300, y: 0 } // For connected agents
};

/**
 * Color constants for different node types
 */
export const NODE_COLORS = {
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
 * Calculate the position for a new node based on parent node position and node type
 * 
 * @param parentPosition - The position of the parent node
 * @param nodeType - The type of node to position
 * @returns The calculated position for the new node
 */
export const calculateNodePosition = (
  parentPosition: { x: number; y: number },
  nodeType: 'memory' | 'tool' | 'agent'
) => {
  const offset = NODE_POSITIONS[nodeType];
  
  return {
    x: parentPosition.x + offset.x,
    y: parentPosition.y + offset.y
  };
};

/**
 * Get the appropriate handle ID for a node type
 * 
 * @param nodeType - The type of node
 * @returns The handle ID for the node type
 */
export const getNodeTypeHandle = (nodeType: string): string | undefined => {
  const nodeTypeToHandleMap = {
    memory: 'memory-handle',
    tool: 'tool-handle',
  };
  
  return nodeTypeToHandleMap[nodeType as keyof typeof nodeTypeToHandleMap];
};
