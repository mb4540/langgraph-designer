/**
 * @deprecated This file is being replaced by the modular store approach.
 * Please import from 'src/store' instead.
 */

import { useNodeStore, useEdgeStore, useSelectionStore } from './index';
import { WorkflowNode, WorkflowEdge } from '../types/nodeTypes';

/**
 * Combined workflow store that provides the same API as the original workflowStore
 * for backward compatibility during the transition period.
 */
export const useWorkflowStore = {
  // Getter for nodes
  get nodes() {
    return useNodeStore.getState().nodes;
  },
  
  // Getter for edges
  get edges() {
    return useEdgeStore.getState().edges;
  },
  
  // Getter for selectedNode
  get selectedNode() {
    return useSelectionStore.getState().selectedNode;
  },
  
  // Node operations
  addNode: (node: WorkflowNode) => useNodeStore.getState().addNode(node),
  updateNode: (id: string, updates: Partial<WorkflowNode>) => {
    useNodeStore.getState().updateNode(id, updates);
    // If this is the selected node, also update it in the selection store
    if (useSelectionStore.getState().selectedNode?.id === id) {
      useSelectionStore.getState().updateSelectedNode(updates);
    }
  },
  removeNode: (id: string) => {
    // Get the node to be deleted
    const nodeToDelete = useNodeStore.getState().getNode(id);
    
    // If the node is an agent, find all associated nodes
    let nodesToDelete = [id];
    if (nodeToDelete && nodeToDelete.type === 'agent') {
      // Find all child nodes of this agent
      const childNodeIds = useNodeStore.getState().nodes
        .filter(node => node.parentId === id)
        .map(node => node.id);
      
      // Add child node IDs to the list of nodes to delete
      nodesToDelete = [...nodesToDelete, ...childNodeIds];
    }
    
    // Remove all edges connected to these nodes
    useEdgeStore.getState().removeEdgesConnectedToNodes(nodesToDelete);
    
    // Remove all nodes
    nodesToDelete.forEach(nodeId => {
      useNodeStore.getState().removeNode(nodeId);
    });
    
    // Clear selection if the selected node was deleted
    if (useSelectionStore.getState().selectedNode?.id === id) {
      useSelectionStore.getState().clearSelection();
    }
  },
  
  // Edge operations
  addEdge: (edge: WorkflowEdge) => useEdgeStore.getState().addEdge(edge),
  removeEdge: (id: string) => useEdgeStore.getState().removeEdge(id),
  
  // Selection operations
  selectNode: (id: string | null) => useSelectionStore.getState().selectNode(id),
  
  // For accessing the state directly
  getState: () => ({
    nodes: useNodeStore.getState().nodes,
    edges: useEdgeStore.getState().edges,
    selectedNode: useSelectionStore.getState().selectedNode,
  }),
};

// Re-export NodeType for backward compatibility
export type { NodeType } from '../types/nodeTypes';
