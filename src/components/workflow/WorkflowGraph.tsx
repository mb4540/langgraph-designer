import React, { useCallback, useState, useRef, memo, useEffect } from 'react';
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
import { useThemeContext } from '../../context/ThemeContext';
import { WorkflowNode as StoreNode, WorkflowEdge as StoreEdge } from '../../store/workflowStore';
import { useWorkflowContext } from '../../context/WorkflowContext';
import AgentNode from '../nodes/AgentNode';
import MemoryNode from '../nodes/MemoryNode';
import ToolNode from '../nodes/ToolNode';
import ConfirmationDialog from '../ConfirmationDialog';

// Define custom node types
const nodeTypes: NodeTypes = {
  agent: AgentNode,
  memory: MemoryNode,
  tool: ToolNode,
};

// Maps node types to their respective handle IDs
const nodeTypeToHandleMap = {
  memory: 'memory-handle',
  tool: 'tool-handle',
};

// Map of memory types to display names
const memoryDisplayNames: Record<string, string> = {
  'conversation-buffer': 'Conversation Buffer',
  'sliding-window': 'Sliding-Window',
  'summary': 'Summary',
  'summary-buffer-hybrid': 'Summary-Buffer Hybrid',
  'entity-knowledge-graph': 'Entity/Knowledge-Graph',
  'vector-store': 'Vector-Store',
  'episodic': 'Episodic',
  'long-term-profile': 'Long-Term Profile',
  'scratch-pad': 'Scratch-pad',
  'tool-result-cache': 'Tool-Result Cache',
  'read-only-shared': 'Read-Only Shared Knowledge',
  'combined-layered': 'Combined/Layered',
};

// Map of tool types to display names
const toolDisplayNames: Record<string, string> = {
  'stagehand-browser': 'Stagehand Browser',
  'vector-store-retriever': 'Vector-Store Retriever',
  'calculator-math': 'Calculator / Math',
  'multi-database-sql': 'Multi-Database SQL',
  'email-imap-smtp': 'Email (IMAP/SMTP)',
  'azure-functions': 'Azure Functions',
};

// Convert store nodes to ReactFlow nodes
const storeNodesToFlowNodes = (nodes: StoreNode[], isDarkMode: boolean, onDeleteFn: (id: string) => void): Node[] => {
  return nodes.map(node => {
    // Create label based on node type
    let label = '';
    if (node.type === 'memory' && node.memoryType) {
      // For memory nodes, show the memory type
      const memoryName = memoryDisplayNames[node.memoryType] || node.memoryType;
      label = `Memory: ${memoryName}`;
    } else if (node.type === 'tool' && node.toolType) {
      // For tool nodes, show the tool type
      const toolName = toolDisplayNames[node.toolType] || node.toolType;
      label = `Tool: ${toolName}`;
    } else {
      // For other nodes, use the default format
      label = `${node.type.charAt(0).toUpperCase() + node.type.slice(1)}: ${node.name}`;
    }

    return {
      id: node.id,
      type: node.type,
      data: { 
        label: label,
        llmModel: node.llmModel, // Pass the LLM model to the node component
        memoryType: node.memoryType, // Pass the memory type to the node component
        toolType: node.toolType, // Pass the tool type to the node component
        icon: node.icon, // Pass the icon to the node component
        onDelete: onDeleteFn
      },
      position: node.position,
    };
  });
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
  const { nodes: storeNodes, edges: storeEdges, selectNode, removeNode, addEdge: addStoreEdge } = useWorkflowContext();
  const { mode } = useThemeContext();
  const isDarkMode = mode === 'dark';
  
  // State for deletion confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState<string | null>(null);
  const [deleteDialogMessage, setDeleteDialogMessage] = useState('');

  // Reference to the ReactFlow instance
  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);

  // Handle node deletion
  const handleDeleteNode = useCallback((id: string) => {
    // Find the node to be deleted
    const node = storeNodes.find(node => node.id === id);
    
    // Set different message based on node type
    if (node && node.type === 'agent') {
      setDeleteDialogMessage('Are you sure you want to delete this agent? This will also delete all connected model, memory, and tool nodes associated with this agent.');
    } else {
      setDeleteDialogMessage('Are you sure you want to delete this node? This action cannot be undone.');
    }
    
    setNodeToDelete(id);
    setDeleteDialogOpen(true);
  }, [storeNodes]);

  const confirmDelete = useCallback(() => {
    if (nodeToDelete) {
      removeNode(nodeToDelete);
      setNodeToDelete(null);
      setDeleteDialogOpen(false);
    }
  }, [nodeToDelete, removeNode]);

  const cancelDelete = useCallback(() => {
    setNodeToDelete(null);
    setDeleteDialogOpen(false);
  }, []);

  // Convert store nodes and edges to ReactFlow format
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Update nodes and edges when store changes
  useEffect(() => {
    const flowNodes = storeNodesToFlowNodes(storeNodes, isDarkMode, handleDeleteNode);
    const flowEdges = storeEdgesToFlowEdges(storeEdges, storeNodes, isDarkMode);
    
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [storeNodes, storeEdges, isDarkMode, handleDeleteNode, setNodes, setEdges]);

  // Handle connecting nodes
  const onConnect = useCallback(
    (params: Connection) => {
      // Add the edge to the store
      const edgeId = `edge-${Date.now()}`;
      const newEdge = {
        id: edgeId,
        source: params.source || '',
        target: params.target || '',
        sourceHandle: params.sourceHandle || undefined,
        targetHandle: params.targetHandle || undefined,
      };
      
      // Add the edge to the store
      addStoreEdge(newEdge);
    },
    [addStoreEdge]
  );

  // Handle node selection
  const onNodeClick: NodeMouseHandler = useCallback(
    (event, node) => {
      // Select the node in the store
      selectNode(node.id);
    },
    [selectNode]
  );

  // Save the ReactFlow instance
  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstanceRef.current = instance;
  }, []);

  return (
    <Paper elevation={3} sx={{ height: '100%', overflow: 'hidden' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView={false}
        fitViewOptions={{ duration: 0 }}
        onInit={onInit}
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Controls />
        <MiniMap 
          nodeStrokeWidth={3}
          nodeColor={(node) => {
            switch (node.type) {
              case 'agent': return '#3182ce';
              case 'memory': return '#38a169';
              case 'tool': return '#dd6b20';
              default: return '#718096';
            }
          }}
        />
        <Background color={isDarkMode ? '#2d3748' : '#f7fafc'} gap={16} />
      </ReactFlow>
      
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

// Use React.memo to prevent unnecessary re-renders
export default memo(WorkflowGraph);
