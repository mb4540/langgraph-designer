import React, { useCallback, useState, useEffect } from 'react';
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
  MarkerType
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

// Convert store nodes to ReactFlow nodes
const storeNodesToFlowNodes = (nodes: StoreNode[], isDarkMode: boolean): Node[] => {
  return nodes.map(node => ({
    id: node.id,
    type: node.type,
    data: { 
      label: `${node.type.charAt(0).toUpperCase() + node.type.slice(1)}: ${node.name}`,
      onDelete: (id: string) => {}
    },
    position: node.position,
  }));
};

// Convert store edges to ReactFlow edges, preserving handle information
const storeEdgesToFlowEdges = (edges: StoreEdge[], isDarkMode: boolean): Edge[] => {
  return edges.map(edge => ({
    ...edge,
    // Preserve source and target handles if they exist
    sourceHandle: edge.sourceHandle || null,
    targetHandle: edge.targetHandle || 'target-handle', // Default to the main target handle
    style: {
      stroke: isDarkMode ? '#718096' : '#4a5568',
      strokeWidth: 2,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: isDarkMode ? '#718096' : '#4a5568',
    },
  }));
};

const WorkflowGraph: React.FC = () => {
  const { nodes: storeNodes, edges: storeEdges, selectNode, removeNode } = useWorkflowStore();
  const { mode } = useThemeContext();
  const isDarkMode = mode === 'dark';
  
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState<string | null>(null);

  // Handle node deletion
  const handleDeleteNode = (id: string) => {
    setNodeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (nodeToDelete) {
      removeNode(nodeToDelete);
      setNodeToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const cancelDelete = () => {
    setNodeToDelete(null);
    setDeleteDialogOpen(false);
  };
  
  // Convert store data to ReactFlow format
  const initialNodes = storeNodesToFlowNodes(storeNodes, isDarkMode).map(node => ({
    ...node,
    data: {
      ...node.data,
      onDelete: handleDeleteNode
    }
  }));
  
  // Apply dark mode styling to edges and preserve handle information
  const initialEdges = storeEdgesToFlowEdges(storeEdges, isDarkMode);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes and edges when store data changes
  useEffect(() => {
    const updatedNodes = storeNodesToFlowNodes(storeNodes, isDarkMode).map(node => ({
      ...node,
      data: {
        ...node.data,
        onDelete: handleDeleteNode
      }
    }));
    setNodes(updatedNodes);

    const updatedEdges = storeEdgesToFlowEdges(storeEdges, isDarkMode);
    setEdges(updatedEdges);
  }, [storeNodes, storeEdges, isDarkMode, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge({
      ...params,
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
    }, eds)),
    [setEdges, isDarkMode]
  );

  // Handle node double-click to select it for the details panel
  const onNodeDoubleClick: NodeMouseHandler = useCallback(
    (_, node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

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
          fitView
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
          <Background variant={'dots' as any} gap={12} size={1} color={isDarkMode ? '#555' : '#ddd'} />
        </ReactFlow>
      </div>

      {/* Confirmation Dialog */}
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
