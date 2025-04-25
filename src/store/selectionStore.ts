import { create } from 'zustand';
import { WorkflowNode } from '../types/nodeTypes';
import { useNodeStore } from './nodeStore';

interface SelectionState {
  selectedNode: WorkflowNode | null;
  selectNode: (id: string | null) => void;
  updateSelectedNode: (updates: Partial<WorkflowNode>) => void;
  clearSelection: () => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedNode: null,
  
  selectNode: (id) => set(() => {
    if (!id) return { selectedNode: null };
    
    // Get the node from the nodeStore
    const node = useNodeStore.getState().getNode(id);
    return { selectedNode: node || null };
  }),
  
  updateSelectedNode: (updates) => set((state) => {
    if (!state.selectedNode) return { selectedNode: null };
    
    // Update the node in the nodeStore
    useNodeStore.getState().updateNode(state.selectedNode.id, updates);
    
    // Update the selected node in this store
    return {
      selectedNode: { ...state.selectedNode, ...updates },
    };
  }),
  
  clearSelection: () => set({ selectedNode: null }),
}));
