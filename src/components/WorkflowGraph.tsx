import React, { useCallback, useState, useRef, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeMouseHandler,
  MarkerType,
  ReactFlowInstance
} from 'reactflow';
import 'reactflow/dist/style.css';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useThemeContext } from '../context/ThemeContext';
import { useNodeStore, useEdgeStore, useSelectionStore } from '../store';
import { WorkflowNode as StoreNode, WorkflowEdge as StoreEdge } from '../types/nodeTypes';
import ConfirmationDialog from './ConfirmationDialog';
import { getNodeTypeHandle } from '../utils/nodePositioning';
import { NODE_TYPES, createNodeLabel } from '../constants/nodeTypes';

/**
 * Converts store nodes to ReactFlow nodes
 */
const createFlowNodes = (nodes: StoreNode[], isDarkMode: boolean, onDeleteFn: (id: string) => void): Node[] => {
  return nodes.map(node => ({
    id: node.id,
    type: node.type,
    data: { 
      label: createNodeLabel(node.type, node.name, node.memoryType, node.toolType),
      llmModel: node.llmModel,
      memoryType: node.memoryType,
      toolType: node.toolType,
      onDelete: onDeleteFn,
      icon: node.icon
    },
    position: node.position,
  }));
};

/**
 * Creates edge styling based on dark mode
 */
const createEdgeStyle = (isDarkMode: boolean) => ({
  style: {
    stroke: isDarkMode ? '#718096' : '#4a5568',
    strokeWidth: 2,
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: isDarkMode ? '#718096' : '#4a5568',
  },
});

/**
 * Converts store edges to ReactFlow edges
 */
const createFlowEdges = (edges: StoreEdge[], nodes: StoreNode[], isDarkMode: boolean): Edge[] => {
  return edges.map(edge => {
    // Find the target node to determine its type
    const targetNode = nodes.find(node => node.id === edge.target);
    
    // Determine the appropriate source handle
    let sourceHandle = edge.sourceHandle;
    if (targetNode && targetNode.type !== 'agent' && !sourceHandle) {
      sourceHandle = getNodeTypeHandle(targetNode.type);
    }
    
    return {
      ...edge,
      sourceHandle,
      targetHandle: edge.targetHandle || 'target-handle',
      ...createEdgeStyle(isDarkMode),
    };
  });
};

/**
 * WorkflowGraph component for displaying and managing the workflow graph
 */
const WorkflowGraph: React.FC = () => {
  // Store hooks
  const { nodes: storeNodes, removeNode } = useNodeStore();
  const { edges: storeEdges } = useEdgeStore();
  const { selectNode } = useSelectionStore();
  const { mode } = useThemeContext();
  const isDarkMode = mode === 'dark';
  
  // ReactFlow instance reference
  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);
  
  // Deletion dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState<string | null>(null);
  const [deleteDialogMessage, setDeleteDialogMessage] = useState('');

  /**
   * Handles node deletion request
   */
  const handleDeleteNode = useCallback((id: string) => {
    const node = storeNodes.find(node => node.id === id);
    
    const message = node?.type === 'agent'
      ? 'Are you sure you want to delete this agent? This will also delete all connected memory and tool nodes associated with this agent.'
      : 'Are you sure you want to delete this node? This action cannot be undone.';
    
    setDeleteDialogMessage(message);
    setNodeToDelete(id);
    setDeleteDialogOpen(true);
  }, [storeNodes]);

  /**
   * Confirms node deletion
   */
  const confirmDelete = useCallback(() => {
    if (nodeToDelete) {
      removeNode(nodeToDelete);
      setNodeToDelete(null);
    }
    setDeleteDialogOpen(false);
  }, [nodeToDelete, removeNode]);

  /**
   * Cancels node deletion
   */
  const cancelDelete = useCallback(() => {
    setNodeToDelete(null);
    setDeleteDialogOpen(false);
  }, []);
  
  // Initialize ReactFlow nodes and edges
  const initialNodes = createFlowNodes(storeNodes, isDarkMode, handleDeleteNode);
  const initialEdges = createFlowEdges(storeEdges, storeNodes, isDarkMode);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  /**
   * Updates nodes and edges when store data changes
   */
  useEffect(() => {
    setNodes(createFlowNodes(storeNodes, isDarkMode, handleDeleteNode));
    setEdges(createFlowEdges(storeEdges, storeNodes, isDarkMode));
  }, [storeNodes, storeEdges, isDarkMode, setNodes, setEdges, handleDeleteNode]);

  /**
   * Handles connecting nodes in the graph
   */
  const handleConnect = useCallback(
    (params: Edge | Connection) => {
      // Find the target node to determine its type
      const targetNode = storeNodes.find(node => node.id === params.target);
      
      // Determine the appropriate source handle
      let sourceHandle = params.sourceHandle;
      if (targetNode && targetNode.type !== 'agent' && !sourceHandle) {
        sourceHandle = getNodeTypeHandle(targetNode.type);
      }
      
      const edge = {
        ...params,
        id: `e${params.source}-${params.target}-${Date.now()}`,
        sourceHandle,
        targetHandle: params.targetHandle || 'target-handle',
        ...createEdgeStyle(isDarkMode),
      };
      
      setEdges((eds) => addEdge(edge as Edge, eds));
    },
    [setEdges, isDarkMode, storeNodes]
  );

  /**
   * Handles node selection on double-click
   */
  const handleNodeDoubleClick: NodeMouseHandler = useCallback(
    (_, node) => selectNode(node.id),
    [selectNode]
  );
  
  /**
   * Stores the ReactFlow instance when initialized
   */
  const handleInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstanceRef.current = instance;
  }, []);

  /**
   * Creates styles for ReactFlow controls based on theme
   */
  const getControlStyles = () => ({
    background: isDarkMode ? '#333' : '#fff',
    borderColor: isDarkMode ? '#555' : '#ddd',
    color: isDarkMode ? '#fff' : '#333',
  });

  return (
    <Paper elevation={3} sx={{ height: '100%', padding: 0, overflow: 'hidden', position: 'relative' }}>
      <Typography variant="h6" gutterBottom sx={{ p: 2 }}>
        Workflow Graph
      </Typography>
      
      <div style={{ height: 'calc(100% - 56px)' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleConnect}
          onNodeDoubleClick={handleNodeDoubleClick}
          nodeTypes={NODE_TYPES}
          onInit={handleInit}
          fitViewOptions={{ duration: 0 }}
          fitView={false}
          proOptions={{ hideAttribution: true }}
          className={isDarkMode ? 'react-flow-dark-mode' : ''}
        >
          <MiniMap 
            nodeStrokeColor={isDarkMode ? '#555' : '#ddd'}
            nodeColor={isDarkMode ? '#222' : '#fff'}
            nodeBorderRadius={8}
          />
          <Controls style={getControlStyles()} />
          <Background color={isDarkMode ? '#555' : '#ddd'} gap={16} />
        </ReactFlow>
      </div>
      
      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Node"
        message={deleteDialogMessage}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </Paper>
  );
};

export default WorkflowGraph;
