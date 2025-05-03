import React, { createContext, useContext, ReactNode, useCallback, useMemo, useState } from 'react';
import { useNodeStore, useEdgeStore, useSelectionStore } from '../store';
import { WorkflowNode, WorkflowEdge } from '../types/nodeTypes';

interface WorkflowDetails {
  name: string;
  workgroup: string;
  description?: string;
  version?: string;
}

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
  workflowDetails: WorkflowDetails;
  updateWorkflowDetails: (details: Partial<WorkflowDetails>) => void;
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
  // Use the modular stores for state management
  const { nodes, addNode: storeAddNode, updateNode: storeUpdateNode, removeNode: storeRemoveNode } = useNodeStore();
  const { edges, addEdge: storeAddEdge, removeEdge: storeRemoveEdge } = useEdgeStore();
  const { selectedNode, selectNode: storeSelectNode } = useSelectionStore();

  // Add workflow details state
  const [workflowDetails, setWorkflowDetails] = useState<WorkflowDetails>({
    name: 'My Workflow',
    workgroup: 'General Workgroup',
    description: '',
    version: '1.0.0'
  });

  // Update workflow details
  const updateWorkflowDetails = useCallback((details: Partial<WorkflowDetails>) => {
    setWorkflowDetails(prevDetails => ({
      ...prevDetails,
      ...details
    }));
  }, []);

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
    // Get the node to be deleted
    const nodeToDelete = nodes.find(node => node.id === id);
    
    // If the node is an agent, find all associated nodes
    let nodesToDelete = [id];
    if (nodeToDelete && nodeToDelete.type === 'agent') {
      // Find all child nodes of this agent
      const childNodeIds = nodes
        .filter(node => node.parentId === id)
        .map(node => node.id);
      
      // Add child node IDs to the list of nodes to delete
      nodesToDelete = [...nodesToDelete, ...childNodeIds];
    }
    
    // Remove all edges connected to these nodes
    nodesToDelete.forEach(nodeId => {
      edges
        .filter(edge => edge.source === nodeId || edge.target === nodeId)
        .forEach(edge => storeRemoveEdge(edge.id));
    });
    
    // Remove all nodes
    nodesToDelete.forEach(nodeId => {
      storeRemoveNode(nodeId);
    });
  }, [nodes, edges, storeRemoveNode, storeRemoveEdge]);

  const addEdgeCallback = useCallback((edge: WorkflowEdge) => {
    storeAddEdge(edge);
  }, [storeAddEdge]);

  const removeEdgeCallback = useCallback((id: string) => {
    storeRemoveEdge(id);
  }, [storeRemoveEdge]);

  // Create the context value with memoization to prevent unnecessary re-renders
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
    workflowDetails,
    updateWorkflowDetails
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
    workflowDetails,
    updateWorkflowDetails
  ]);

  return (
    <WorkflowContext.Provider value={contextValue}>
      {children}
    </WorkflowContext.Provider>
  );
};
