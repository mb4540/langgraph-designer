import { create } from 'zustand';
import { WorkflowEdge } from '../types/nodeTypes';
import { useNodeStore } from './nodeStore';

interface EdgeState {
  edges: WorkflowEdge[];
  addEdge: (edge: WorkflowEdge) => void;
  removeEdge: (id: string) => void;
  removeEdgesConnectedToNodes: (nodeIds: string[]) => void;
}

export const useEdgeStore = create<EdgeState>((set) => ({
  edges: [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3' },
  ],
  
  addEdge: (edge) => set((state) => ({
    edges: [...state.edges, edge],
  })),
  
  removeEdge: (id) => set((state) => ({
    edges: state.edges.filter((edge) => edge.id !== id),
  })),
  
  removeEdgesConnectedToNodes: (nodeIds) => set((state) => ({
    edges: state.edges.filter(
      edge => !nodeIds.includes(edge.source) && !nodeIds.includes(edge.target)
    ),
  })),
}));
