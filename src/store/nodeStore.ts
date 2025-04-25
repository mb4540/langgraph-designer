import { create } from 'zustand';
import { WorkflowNode, NodeType } from '../types/nodeTypes';

interface NodeState {
  nodes: WorkflowNode[];
  addNode: (node: WorkflowNode) => void;
  updateNode: (id: string, updates: Partial<WorkflowNode>) => void;
  removeNode: (id: string) => void;
  getNode: (id: string) => WorkflowNode | undefined;
}

export const useNodeStore = create<NodeState>((set, get) => ({
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
  
  addNode: (node) => set((state) => ({
    nodes: [...state.nodes, node],
  })),
  
  updateNode: (id, updates) => set((state) => ({
    nodes: state.nodes.map((node) => 
      node.id === id ? { ...node, ...updates } : node
    ),
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
    };
  }),
  
  getNode: (id) => get().nodes.find((node) => node.id === id),
}));
