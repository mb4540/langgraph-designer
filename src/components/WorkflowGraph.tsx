import React, { useCallback } from 'react';
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
import { useWorkflowStore, WorkflowNode as StoreNode } from '../store/workflowStore';

// Convert store nodes to ReactFlow nodes
const storeNodesToFlowNodes = (nodes: StoreNode[], isDarkMode: boolean): Node[] => {
  return nodes.map(node => ({
    id: node.id,
    type: node.type === 'agent' ? 'input' : 'default',
    data: { label: `${node.type === 'agent' ? 'Agent' : 'Tool'}: ${node.name}` },
    position: node.position,
    style: {
      background: isDarkMode
        ? node.type === 'agent' ? '#2a4365' : '#3c366b'
        : node.type === 'agent' ? '#ebf8ff' : '#f0fff4',
      color: isDarkMode ? '#e2e8f0' : '#1a202c',
      border: isDarkMode
        ? node.type === 'agent' ? '1px solid #4299e1' : '1px solid #805ad5'
        : node.type === 'agent' ? '1px solid #63b3ed' : '1px solid #9ae6b4',
      borderRadius: '8px',
      padding: '10px',
      boxShadow: isDarkMode
        ? '0 4px 6px rgba(0, 0, 0, 0.3)'
        : '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
  }));
};

const WorkflowGraph: React.FC = () => {
  const { nodes: storeNodes, edges: storeEdges, selectNode } = useWorkflowStore();
  const { mode } = useThemeContext();
  const isDarkMode = mode === 'dark';
  
  // Convert store data to ReactFlow format
  const initialNodes = storeNodesToFlowNodes(storeNodes, isDarkMode);
  
  // Apply dark mode styling to edges
  const initialEdges = storeEdges.map(edge => ({
    ...edge,
    style: {
      stroke: isDarkMode ? '#718096' : '#4a5568',
      strokeWidth: 2,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: isDarkMode ? '#718096' : '#4a5568',
    },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
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
    </Paper>
  );
};

export default WorkflowGraph;
