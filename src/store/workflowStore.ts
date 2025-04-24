import { create } from 'zustand';

export type NodeType = 'agent' | 'tool' | 'model' | 'memory' | 'outputParser';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  name: string;
  content: string;
  position: { x: number; y: number };
  llmModel?: string; // Only for agents and models
  memoryType?: string; // Only for memory nodes
  toolType?: string; // Only for tool nodes
  parserType?: string; // Only for outputParser nodes
  parentId?: string; // Reference to the parent node (if created from a diamond connector)
  sourceHandle?: string; // The handle ID from which this node was created
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  sourceHandle?: string; // Handle ID on the source node
  targetHandle?: string; // Handle ID on the target node
}

interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNode: WorkflowNode | null;
  addNode: (node: WorkflowNode) => void;
  updateNode: (id: string, updates: Partial<WorkflowNode>) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: WorkflowEdge) => void;
  removeEdge: (id: string) => void;
  selectNode: (id: string | null) => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: [
    {
      id: '1',
      type: 'agent',
      name: 'Example Agent',
      content: 'This agent is responsible for processing user requests.',
      position: { x: 250, y: 5 },
      llmModel: 'gpt-4o-mini',
    },
    {
      id: '2',
      type: 'tool',
      name: 'Example Tool',
      content: 'function exampleTool(input) {\n  // Tool implementation\n  return `Processed: ${input}`\n}',
      position: { x: 100, y: 100 },
    },
    {
      id: '3',
      type: 'agent',
      name: 'Another Agent',
      content: 'This agent handles the output from the first agent.',
      position: { x: 400, y: 200 },
      llmModel: 'gpt-4o-mini',
    },
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3' },
  ],
  selectedNode: null,
  
  addNode: (node) => set((state) => ({
    nodes: [...state.nodes, node],
  })),
  
  updateNode: (id, updates) => set((state) => ({
    nodes: state.nodes.map((node) => 
      node.id === id ? { ...node, ...updates } : node
    ),
    selectedNode: state.selectedNode?.id === id 
      ? { ...state.selectedNode, ...updates } 
      : state.selectedNode,
  })),
  
  removeNode: (id) => set((state) => {
    // Get the node to be deleted
    const nodeToDelete = state.nodes.find(node => node.id === id);
    
    // If the node is an agent, find all associated nodes (nodes with parentId equal to this agent's id)
    let nodesToDelete = [id];
    if (nodeToDelete && nodeToDelete.type === 'agent') {
      // Find all child nodes of this agent
      const childNodeIds = state.nodes
        .filter(node => node.parentId === id)
        .map(node => node.id);
      
      // Add child node IDs to the list of nodes to delete
      nodesToDelete = [...nodesToDelete, ...childNodeIds];
    }
    
    return {
      // Filter out all nodes that should be deleted
      nodes: state.nodes.filter(node => !nodesToDelete.includes(node.id)),
      // Filter out all edges connected to deleted nodes
      edges: state.edges.filter(
        edge => !nodesToDelete.includes(edge.source) && !nodesToDelete.includes(edge.target)
      ),
      // Update selected node if it was deleted
      selectedNode: state.selectedNode && nodesToDelete.includes(state.selectedNode.id) ? null : state.selectedNode,
    };
  }),
  
  addEdge: (edge) => set((state) => ({
    edges: [...state.edges, edge],
  })),
  
  removeEdge: (id) => set((state) => ({
    edges: state.edges.filter((edge) => edge.id !== id),
  })),
  
  selectNode: (id) => set((state) => ({
    selectedNode: id ? state.nodes.find((node) => node.id === id) || null : null,
  })),
}));
