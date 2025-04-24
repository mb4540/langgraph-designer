import React, { useCallback, useState, useEffect, useRef } from 'react';
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
  NodeTypes,
  NodeMouseHandler,
  MarkerType,
  ReactFlowInstance
} from 'reactflow';
import 'reactflow/dist/style.css';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useThemeContext } from '../context/ThemeContext';
import { useWorkflowStore, WorkflowNode as StoreNode, WorkflowEdge as StoreEdge } from '../store/workflowStore';
import AgentNode from './AgentNode';
import ModelNode from './ModelNode';
import MemoryNode from './MemoryNode';
import ToolNode from './ToolNode';
import OutputParserNode from './OutputParserNode';
import ConfirmationDialog from './ConfirmationDialog';

// Define custom node types
const nodeTypes: NodeTypes = {
  agent: AgentNode,
  model: ModelNode,
  memory: MemoryNode,
  tool: ToolNode,
  outputParser: OutputParserNode,
};

// Maps node types to their respective handle IDs
const nodeTypeToHandleMap = {
  model: 'model-handle',
  memory: 'memory-handle',
  tool: 'tool-handle',
  outputParser: 'parser-handle',
};

// Convert store nodes to ReactFlow nodes
const storeNodesToFlowNodes = (nodes: StoreNode[], isDarkMode: boolean, onDeleteFn: (id: string) => void): Node[] => {
  return nodes.map(node => ({
    id: node.id,
    type: node.type,
    data: { 
      label: `${node.type.charAt(0).toUpperCase() + node.type.slice(1)}: ${node.name}`,
      onDelete: onDeleteFn
    },
    position: node.position,
  }));
};

// Convert store edges to ReactFlow edges, preserving handle information
const storeEdgesToFlowEdges = (edges: StoreEdge[], nodes: StoreNode[], isDarkMode: boolean): Edge[] => {
  return edges.map(edge => {
    // Find the target node to determine its type
    const targetNode = nodes.find(node => node.id === edge.target);
    
    // If we have a target node and it's not an agent, use the appropriate handle based on its type
    let sourceHandle = edge.sourceHandle;
    if (targetNode && targetNode.type !== 'agent' && !sourceHandle) {
      // Use the handle that corresponds to the target node's type
      sourceHandle = nodeTypeToHandleMap[targetNode.type as keyof typeof nodeTypeToHandleMap] || undefined;
    }
    
    return {
      ...edge,
      // Use the determined source handle or the existing one
      sourceHandle: sourceHandle,
      targetHandle: edge.targetHandle || 'target-handle', // Default to the main target handle
      style: {
        stroke: isDarkMode ? '#718096' : '#4a5568',
        strokeWidth: 2,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: isDarkMode ? '#718096' : '#4a5568',
      },
    };
  });
};

const WorkflowGraph: React.FC = () => {
  const { nodes: storeNodes, edges: storeEdges, selectNode, removeNode } = useWorkflowStore();
  const { mode } = useThemeContext();
  const isDarkMode = mode === 'dark';
  
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState<string | null>(null);
  
  // Reference to the ReactFlow instance
  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);

  // Handle node deletion
  const handleDeleteNode = useCallback((id: string) => {
    setNodeToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (nodeToDelete) {
      removeNode(nodeToDelete);
      setNodeToDelete(null);
    }
    setDeleteDialogOpen(false);
  }, [nodeToDelete, removeNode]);

  const cancelDelete = useCallback(() => {
    setNodeToDelete(null);
    setDeleteDialogOpen(false);
  }, []);
  
  // Convert store data to ReactFlow format
  const initialNodes = storeNodesToFlowNodes(storeNodes, isDarkMode, handleDeleteNode);
  
  // Apply dark mode styling to edges and preserve handle information
  const initialEdges = storeEdgesToFlowEdges(storeEdges, storeNodes, isDarkMode);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes and edges when store data changes
  useEffect(() => {
    const updatedNodes = storeNodesToFlowNodes(storeNodes, isDarkMode, handleDeleteNode);
    setNodes(updatedNodes);

    const updatedEdges = storeEdgesToFlowEdges(storeEdges, storeNodes, isDarkMode);
    setEdges(updatedEdges);
  }, [storeNodes, storeEdges, isDarkMode, setNodes, setEdges, handleDeleteNode]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      // Find the target node to determine its type
      const targetNode = storeNodes.find(node => node.id === params.target);
      
      // If we have a target node and it's not an agent, use the appropriate handle based on its type
      let sourceHandle = params.sourceHandle;
      if (targetNode && targetNode.type !== 'agent' && !sourceHandle) {
        // Use the handle that corresponds to the target node's type
        sourceHandle = nodeTypeToHandleMap[targetNode.type as keyof typeof nodeTypeToHandleMap] || undefined;
      }
      
      const edge = {
        ...params,
        id: `e${params.source}-${params.target}-${Date.now()}`,
        sourceHandle,
        // Ensure new connections use the target-handle by default
        targetHandle: params.targetHandle || 'target-handle',
        style: {
          stroke: isDarkMode ? '#718096' : '#4a5568',
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isDarkMode ? '#718096' : '#4a5568',
        },
      };
      
      setEdges((eds) => addEdge(edge as Edge, eds));
    },
    [setEdges, isDarkMode, storeNodes]
  );

  // Handle node double-click to select it for the details panel
  const onNodeDoubleClick: NodeMouseHandler = useCallback(
    (_, node) => {
      selectNode(node.id);
    },
    [selectNode]
  );
  
  // Store the ReactFlow instance when it's initialized
  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstanceRef.current = instance;
  }, []);

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
          onConnect={onConnect}
          onNodeDoubleClick={onNodeDoubleClick}
          nodeTypes={nodeTypes}
          onInit={onInit}
          fitViewOptions={{ duration: 0 }} // Disable animations
          fitView={false} // Disable automatic fitting to view
          proOptions={{ hideAttribution: true }}
          className={isDarkMode ? 'react-flow-dark-mode' : ''}
        >
          <MiniMap 
            nodeStrokeColor={isDarkMode ? '#555' : '#ddd'}
            nodeColor={isDarkMode ? '#222' : '#fff'}
            nodeBorderRadius={8}
          />
          <Controls 
            style={{
              background: isDarkMode ? '#333' : '#fff',
              borderColor: isDarkMode ? '#555' : '#ddd',
              color: isDarkMode ? '#fff' : '#333',
            }}
          />
          <Background color={isDarkMode ? '#555' : '#ddd'} gap={16} />
        </ReactFlow>
      </div>
      
      {/* Confirmation Dialog for Node Deletion */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Node"
        message="Are you sure you want to delete this node? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </Paper>
  );
};

export default WorkflowGraph;
