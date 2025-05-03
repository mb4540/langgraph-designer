import { useState, useEffect, useCallback } from 'react';
import { WorkflowNode } from '../types/nodeTypes';
import { useWorkflowContext } from '../context/WorkflowContext';
import useAsyncOperation from './useAsyncOperation';

interface UseWorkflowNodeOptions {
  /** Whether to automatically save changes when the component unmounts */
  autoSaveOnUnmount?: boolean;
  
  /** Callback when the node is successfully saved */
  onSaveSuccess?: (node: WorkflowNode) => void;
  
  /** Callback when the node fails to save */
  onSaveError?: (error: Error) => void;
}

interface UseWorkflowNodeResult {
  /** The current node */
  node: WorkflowNode;
  
  /** Whether the node is being saved */
  saving: boolean;
  
  /** Any error that occurred during saving */
  saveError: Error | null;
  
  /** Function to save the node */
  saveNode: (updates: Partial<WorkflowNode>) => Promise<WorkflowNode | null>;
  
  /** Function to update the node in the workflow */
  updateNode: (updates: Partial<WorkflowNode>) => void;
  
  /** Whether the node has been modified */
  isModified: boolean;
  
  /** Function to reset the node to its original state */
  resetNode: () => void;
}

/**
 * Custom hook for managing a workflow node with save/update functionality
 */
export function useWorkflowNode(
  nodeId: string,
  options: UseWorkflowNodeOptions = {}
): UseWorkflowNodeResult {
  const { autoSaveOnUnmount = false, onSaveSuccess, onSaveError } = options;
  const { getNode, updateNode: updateWorkflowNode } = useWorkflowContext();
  
  // Get the initial node
  const initialNode = getNode(nodeId);
  if (!initialNode) {
    throw new Error(`Node with ID ${nodeId} not found`);
  }
  
  // Track the current node and its original state
  const [node, setNode] = useState<WorkflowNode>(initialNode);
  const [originalNode, setOriginalNode] = useState<WorkflowNode>(initialNode);
  
  // Update the node when it changes in the workflow
  useEffect(() => {
    const currentNode = getNode(nodeId);
    if (currentNode) {
      setNode(currentNode);
      setOriginalNode(currentNode);
    }
  }, [nodeId, getNode]);
  
  // Check if the node has been modified
  const isModified = useCallback(() => {
    return JSON.stringify(node) !== JSON.stringify(originalNode);
  }, [node, originalNode]);
  
  // Reset the node to its original state
  const resetNode = useCallback(() => {
    setNode(originalNode);
  }, [originalNode]);
  
  // Update the node locally
  const updateNode = useCallback((updates: Partial<WorkflowNode>) => {
    setNode(prevNode => ({
      ...prevNode,
      ...updates
    }));
  }, []);
  
  // Save the node to the workflow
  const { execute: saveNode, loading: saving, error: saveError } = useAsyncOperation<WorkflowNode>(
    async (updates: Partial<WorkflowNode>) => {
      const updatedNode = {
        ...node,
        ...updates
      };
      
      updateWorkflowNode(updatedNode);
      setOriginalNode(updatedNode);
      
      return updatedNode;
    },
    {
      onSuccess: onSaveSuccess,
      onError: onSaveError
    }
  );
  
  // Auto-save on unmount if enabled and modified
  useEffect(() => {
    return () => {
      if (autoSaveOnUnmount && isModified()) {
        saveNode({});
      }
    };
  }, [autoSaveOnUnmount, isModified, saveNode]);
  
  return {
    node,
    saving,
    saveError,
    saveNode,
    updateNode,
    isModified: isModified(),
    resetNode
  };
}
