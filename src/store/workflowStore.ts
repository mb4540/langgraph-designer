import { create } from 'zustand';

export type NodeType = 'agent' | 'tool';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  name: string;
  content: string;
  position: { x: number; y: number };
  llmModel?: string; // Only for agents
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
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
  
  removeNode: (id) => set((state) => ({
    nodes: state.nodes.filter((node) => node.id !== id),
    edges: state.edges.filter(
      (edge) => edge.source !== id && edge.target !== id
    ),
    selectedNode: state.selectedNode?.id === id ? null : state.selectedNode,
  })),
  
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
