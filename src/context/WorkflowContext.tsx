import React, { createContext, useContext, ReactNode, useCallback, useMemo } from 'react';
import { useWorkflowStore, WorkflowNode, WorkflowEdge } from '../store/workflowStore';

interface WorkflowContextType {
  selectedNode: WorkflowNode | null;
  selectNode: (id: string | null) => void;
  addNode: (node: WorkflowNode) => void;
  updateNode: (id: string, updates: Partial<WorkflowNode>) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: WorkflowEdge) => void;
  removeEdge: (id: string) => void;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

const WorkflowContext = createContext<WorkflowContextType | null>(null);

export const useWorkflowContext = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflowContext must be used within a WorkflowProvider');
  }
  return context;
};

interface WorkflowProviderProps {
  children: ReactNode;
}

export const WorkflowProvider: React.FC<WorkflowProviderProps> = ({ children }) => {
  // Use the Zustand store for state management
  const {
    nodes,
    edges,
    selectedNode,
    selectNode: storeSelectNode,
    addNode: storeAddNode,
    updateNode: storeUpdateNode,
    removeNode: storeRemoveNode,
    addEdge: storeAddEdge,
    removeEdge: storeRemoveEdge,
  } = useWorkflowStore();

  // Wrap the store functions with useCallback to prevent unnecessary re-renders
  const selectNodeCallback = useCallback((id: string | null) => {
    storeSelectNode(id);
  }, [storeSelectNode]);

  const addNodeCallback = useCallback((node: WorkflowNode) => {
    storeAddNode(node);
  }, [storeAddNode]);

  const updateNodeCallback = useCallback((id: string, updates: Partial<WorkflowNode>) => {
    storeUpdateNode(id, updates);
  }, [storeUpdateNode]);

  const removeNodeCallback = useCallback((id: string) => {
    storeRemoveNode(id);
  }, [storeRemoveNode]);

  const addEdgeCallback = useCallback((edge: WorkflowEdge) => {
    storeAddEdge(edge);
  }, [storeAddEdge]);

  const removeEdgeCallback = useCallback((id: string) => {
    storeRemoveEdge(id);
  }, [storeRemoveEdge]);

  // Create a memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    selectedNode,
    selectNode: selectNodeCallback,
    addNode: addNodeCallback,
    updateNode: updateNodeCallback,
    removeNode: removeNodeCallback,
    addEdge: addEdgeCallback,
    removeEdge: removeEdgeCallback,
    nodes,
    edges,
  }), [
    selectedNode,
    selectNodeCallback,
    addNodeCallback,
    updateNodeCallback,
    removeNodeCallback,
    addEdgeCallback,
    removeEdgeCallback,
    nodes,
    edges,
  ]);

  return (
    <WorkflowContext.Provider value={contextValue}>
      {children}
    </WorkflowContext.Provider>
  );
};
