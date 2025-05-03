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
  MarkerType, // Import MarkerType for edge styling
  ReactFlowInstance
} from 'reactflow';
import 'reactflow/dist/style.css';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

// Import operator-related icons
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BuildIcon from '@mui/icons-material/Build';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import MemoryIcon from '@mui/icons-material/Memory';
import SaveIcon from '@mui/icons-material/Save';
import HelpIcon from '@mui/icons-material/Help';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import MergeIcon from '@mui/icons-material/Merge';
import LoopIcon from '@mui/icons-material/Loop';
import ReplayIcon from '@mui/icons-material/Replay';
import TimerIcon from '@mui/icons-material/Timer';
import PauseIcon from '@mui/icons-material/Pause';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import VerifiedIcon from '@mui/icons-material/Verified';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import GridOnIcon from '@mui/icons-material/GridOn';

import { useThemeContext } from '../../context/ThemeContext';
import { useRuntimeContext } from '../../context/RuntimeContext';
import { useWorkflowContext } from '../../context/WorkflowContext';
import { NodeType, OperatorType, WorkflowEdge, WorkflowNode as StoreNode } from '../../types/nodeTypes';
import AgentNode from '../nodes/AgentNode';
import MemoryNode from '../nodes/MemoryNode';
import ToolNode from '../nodes/ToolNode';
import OperatorNode from '../nodes/OperatorNode';
import ConfirmationDialog from '../ConfirmationDialog';
import { canConnect, validateWorkflow, RuntimeType } from '../../utils/workflowValidator';

// Define custom node types
const nodeTypes: NodeTypes = {
  agent: AgentNode,
  memory: MemoryNode,
  tool: ToolNode,
  operator: OperatorNode,
};

// Map operator types to their corresponding icons
const operatorIcons: Record<OperatorType, React.ElementType> = {
  [OperatorType.Start]: PlayArrowIcon,
  [OperatorType.Stop]: StopIcon,
  [OperatorType.Sequential]: ArrowForwardIcon,
  [OperatorType.ToolCall]: BuildIcon,
  [OperatorType.AgentCall]: SmartToyIcon,
  [OperatorType.MemoryRead]: MemoryIcon,
  [OperatorType.MemoryWrite]: SaveIcon,
  [OperatorType.Decision]: HelpIcon,
  [OperatorType.ParallelFork]: CallSplitIcon,
  [OperatorType.ParallelJoin]: MergeIcon,
  [OperatorType.Loop]: LoopIcon,
  [OperatorType.ErrorRetry]: ReplayIcon,
  [OperatorType.Timeout]: TimerIcon,
  [OperatorType.HumanPause]: PauseIcon,
  [OperatorType.SubGraph]: AccountTreeIcon,
};

// Map operator types to colors
const operatorColors: Record<OperatorType, string> = {
  [OperatorType.Start]: '#4caf50', // Green
  [OperatorType.Stop]: '#f44336', // Red
  [OperatorType.Sequential]: '#2196f3', // Blue
  [OperatorType.ToolCall]: '#ff9800', // Orange
  [OperatorType.AgentCall]: '#9c27b0', // Purple
  [OperatorType.MemoryRead]: '#00bcd4', // Cyan
  [OperatorType.MemoryWrite]: '#009688', // Teal
  [OperatorType.Decision]: '#673ab7', // Deep Purple
  [OperatorType.ParallelFork]: '#3f51b5', // Indigo
  [OperatorType.ParallelJoin]: '#3f51b5', // Indigo
  [OperatorType.Loop]: '#795548', // Brown
  [OperatorType.ErrorRetry]: '#ff5722', // Deep Orange
  [OperatorType.Timeout]: '#607d8b', // Blue Grey
  [OperatorType.HumanPause]: '#e91e63', // Pink
  [OperatorType.SubGraph]: '#8bc34a', // Light Green
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
      // For memory nodes, show just the memory type without prefix
      const memoryName = memoryDisplayNames[node.memoryType] || node.memoryType;
      label = memoryName;
    } else if (node.type === 'tool' && node.toolType) {
      // For tool nodes, show just the tool type without prefix
      const toolName = toolDisplayNames[node.toolType] || node.toolType;
      label = toolName;
    } else if (node.type === 'agent') {
      // For agent nodes, just use the name without any prefix
      label = node.name;
    } else if (node.type === 'operator' && node.operatorType) {
      // For operator nodes, use the operator type as the label
      label = node.operatorType.toString().replace(/_/g, ' ').toLowerCase();
    } else {
      // For other node types, use the default format
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
        operatorType: node.operatorType, // Pass the operator type to the node component
        onDelete: onDeleteFn
      },
      position: node.position,
    };
  });
};

// Convert store edges to ReactFlow edges, preserving handle information
const storeEdgesToFlowEdges = (edges: WorkflowEdge[], nodes: StoreNode[], isDarkMode: boolean): Edge[] => {
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
      animated: true,
    };
  });
};

const WorkflowGraph: React.FC = () => {
  const { nodes: storeNodes, edges: storeEdges, selectNode, removeNode, addNode, addEdge: addStoreEdge } = useWorkflowContext();
  const { mode } = useThemeContext();
  const { runtimeType } = useRuntimeContext();
  const isDarkMode = mode === 'dark';
  
  // State for workflow name (in a real app, this would come from a store)
  const [workflowName, setWorkflowName] = useState('My Workflow');
  
  // State for runtime type (autogen or langgraph)
  const [runtime, setRuntime] = useState<RuntimeType>(runtimeType);
  
  // State for validation errors
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // State for connection validation message
  const [connectionMessage, setConnectionMessage] = useState<{ message: string, isError: boolean } | null>(null);
  
  // State for deletion confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState<string | null>(null);
  const [deleteDialogMessage, setDeleteDialogMessage] = useState('');

  // State for operator menu
  const [operatorMenuAnchorEl, setOperatorMenuAnchorEl] = useState<null | HTMLElement>(null);
  const operatorMenuOpen = Boolean(operatorMenuAnchorEl);

  // State for grid snap feature
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [snapGrid, setSnapGrid] = useState<[number, number]>([15, 15]); // Grid size in pixels

  // Reference to the ReactFlow instance
  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);

  // Handle showing workflow details
  const handleEditWorkflowDetails = useCallback(() => {
    // Use the global function we exposed in DetailsPanel
    if (typeof (window as any).showWorkflowDetails === 'function') {
      (window as any).showWorkflowDetails();
    }
  }, []);

  // Handle opening operator menu
  const handleOpenOperatorMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOperatorMenuAnchorEl(event.currentTarget);
  };

  // Handle closing operator menu
  const handleCloseOperatorMenu = () => {
    setOperatorMenuAnchorEl(null);
  };

  // Handle adding a new operator node
  const handleAddOperator = (operatorType: OperatorType) => {
    if (!reactFlowInstanceRef.current) return;

    // Close the menu
    handleCloseOperatorMenu();

    // Get the center position of the viewport
    const { x, y, zoom } = reactFlowInstanceRef.current.getViewport();
    const centerX = window.innerWidth / 2 / zoom - x / zoom;
    const centerY = window.innerHeight / 2 / zoom - y / zoom;

    // Create a new operator node
    const newId = `operator-${Date.now()}`;
    const newNode: StoreNode = {
      id: newId,
      type: 'operator',
      name: operatorType.toString().replace(/_/g, ' ').toLowerCase(),
      content: `This is a ${operatorType} operator.`,
      position: { x: centerX, y: centerY },
      operatorType,
    };

    // Add the new node
    addNode(newNode);
  };

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
      // Find the source and target nodes
      const sourceNode = storeNodes.find(node => node.id === params.source);
      const targetNode = storeNodes.find(node => node.id === params.target);
      
      if (!sourceNode || !targetNode) {
        setConnectionMessage({
          message: 'Cannot connect: Source or target node not found',
          isError: true
        });
        return;
      }
      
      // Validate the connection
      const validationResult = canConnect(
        sourceNode,
        targetNode,
        storeNodes,
        storeEdges,
        runtime
      );
      
      if (!validationResult.canConnect) {
        setConnectionMessage({
          message: validationResult.message || 'Invalid connection',
          isError: true
        });
        return;
      }
      
      // Create a new edge with the connection parameters
      const edgeId = `edge-${Date.now()}`;
      const newEdge = {
        id: edgeId,
        source: params.source || '',
        target: params.target || '',
        sourceHandle: params.sourceHandle || undefined,
        targetHandle: params.targetHandle || undefined,
        animated: true,
      };
      
      // Add the edge to the store
      addStoreEdge(newEdge);
      
      // Show success message
      setConnectionMessage({
        message: 'Connection created successfully',
        isError: false
      });
      
      // Clear message after a delay
      setTimeout(() => setConnectionMessage(null), 3000);
      
      // Validate the entire workflow
      const workflowValidation = validateWorkflow(storeNodes, [...storeEdges, newEdge], runtime);
      setValidationErrors(workflowValidation.errors);
    },
    [addStoreEdge, storeNodes, storeEdges, runtime]
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

  // Custom default edge
  const defaultEdgeOptions = {
    style: {
      strokeWidth: 2,
      stroke: isDarkMode ? '#64748b' : '#94a3b8', // Slate colors
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 15,
      height: 15,
      color: isDarkMode ? '#64748b' : '#94a3b8',
    },
    animated: true,
  };

  // Add a component to display validation errors and connection messages
  const ValidationMessages = () => {
    if (connectionMessage) {
      return (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            padding: 2,
            backgroundColor: connectionMessage.isError ? 
              (isDarkMode ? '#3B0D0D' : '#FEE2E2') : 
              (isDarkMode ? '#0D312B' : '#ECFDF5'),
            borderLeft: connectionMessage.isError ? 
              '4px solid #EF4444' : 
              '4px solid #10B981',
            maxWidth: '80%',
          }}
        >
          <Typography 
            color={connectionMessage.isError ? 
              (isDarkMode ? '#F87171' : 'error') : 
              (isDarkMode ? '#34D399' : 'success')
            }
          >
            {connectionMessage.message}
          </Typography>
        </Paper>
      );
    }

    if (validationErrors.length > 0) {
      return (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: 70,
            right: 16,
            zIndex: 1000,
            padding: 2,
            backgroundColor: isDarkMode ? '#3B0D0D' : '#FEE2E2',
            borderLeft: '4px solid #EF4444',
            maxWidth: '30%',
            maxHeight: '50%',
            overflow: 'auto',
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" color={isDarkMode ? '#F87171' : 'error'} gutterBottom>
            Workflow Validation Errors
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 1 }}>
            {validationErrors.map((error, index) => (
              <Typography component="li" key={index} color={isDarkMode ? '#F87171' : 'error'} fontSize="0.875rem">
                {error}
              </Typography>
            ))}
          </Box>
        </Paper>
      );
    }

    return null;
  };

  // Handle validating the workflow
  const handleValidateWorkflow = useCallback(() => {
    // Validate the workflow
    const workflowValidation = validateWorkflow(storeNodes, storeEdges, runtime);
    setValidationErrors(workflowValidation.errors);
    
    // Show a message about the validation result
    if (workflowValidation.isValid) {
      setConnectionMessage({
        message: 'Workflow is valid for ' + runtime + ' runtime',
        isError: false
      });
    } else {
      setConnectionMessage({
        message: `Workflow has ${workflowValidation.errors.length} validation errors`,
        isError: true
      });
    }
    
    // Clear message after a delay
    setTimeout(() => setConnectionMessage(null), 3000);
  }, [storeNodes, storeEdges, runtime]);

  // Handle smart layout
  const handleSmartLayout = useCallback(() => {
    if (!reactFlowInstanceRef.current) return;
    
    // Create a copy of the current nodes
    const currentNodes = [...storeNodes];
    
    // Sort nodes by type to ensure proper layering
    // START nodes come first, then agent/tool/memory nodes, then END nodes
    const startNodes = currentNodes.filter(node => 
      node.type === 'operator' && node.operatorType === OperatorType.Start
    );
    const endNodes = currentNodes.filter(node => 
      node.type === 'operator' && node.operatorType === OperatorType.Stop
    );
    const otherNodes = currentNodes.filter(node => 
      !(node.type === 'operator' && 
        (node.operatorType === OperatorType.Start || node.operatorType === OperatorType.Stop))
    );
    
    // Create a map of node connections
    const nodeConnections: Record<string, { incoming: string[], outgoing: string[] }> = {};
    
    // Initialize the connection map
    currentNodes.forEach(node => {
      nodeConnections[node.id] = { incoming: [], outgoing: [] };
    });
    
    // Populate the connection map
    storeEdges.forEach(edge => {
      if (nodeConnections[edge.source]) {
        nodeConnections[edge.source].outgoing.push(edge.target);
      }
      if (nodeConnections[edge.target]) {
        nodeConnections[edge.target].incoming.push(edge.source);
      }
    });
    
    // Assign layers to nodes based on their connections
    const nodeLayers: Record<string, number> = {};
    
    // Start nodes are in layer 0
    startNodes.forEach(node => {
      nodeLayers[node.id] = 0;
    });
    
    // Assign layers to other nodes using a breadth-first approach
    const assignLayers = () => {
      let changed = false;
      
      otherNodes.forEach(node => {
        // If the node already has a layer, skip it
        if (nodeLayers[node.id] !== undefined) return;
        
        // Check if all incoming nodes have layers assigned
        const incomingLayers = nodeConnections[node.id].incoming
          .map(id => nodeLayers[id])
          .filter(layer => layer !== undefined);
        
        // If all incoming nodes have layers, assign this node to the next layer
        if (incomingLayers.length > 0 && 
            incomingLayers.length === nodeConnections[node.id].incoming.length) {
          const maxIncomingLayer = Math.max(...incomingLayers);
          nodeLayers[node.id] = maxIncomingLayer + 1;
          changed = true;
        }
      });
      
      return changed;
    };
    
    // Keep assigning layers until no more changes can be made
    while (assignLayers()) {}
    
    // Handle nodes that couldn't be assigned a layer (no incoming connections)
    otherNodes.forEach(node => {
      if (nodeLayers[node.id] === undefined) {
        // If no incoming connections, place in layer 1
        if (nodeConnections[node.id].incoming.length === 0) {
          nodeLayers[node.id] = 1;
        } else {
          // Otherwise, find the maximum layer and add 1
          const maxLayer = Math.max(
            ...Object.values(nodeLayers).filter(layer => layer !== undefined)
          );
          nodeLayers[node.id] = maxLayer + 1;
        }
      }
    });
    
    // End nodes go in the final layer
    const maxLayer = Math.max(
      ...Object.values(nodeLayers).filter(layer => layer !== undefined),
      0
    );
    endNodes.forEach(node => {
      nodeLayers[node.id] = maxLayer + 1;
    });
    
    // Count nodes in each layer
    const layerCounts: Record<number, number> = {};
    Object.values(nodeLayers).forEach(layer => {
      layerCounts[layer] = (layerCounts[layer] || 0) + 1;
    });
    
    // Calculate positions based on layers
    const verticalSpacing = 150; // Vertical spacing between layers
    const horizontalSpacing = 200; // Horizontal spacing between nodes in the same layer
    
    // Track node positions within each layer
    const layerPositions: Record<number, number> = {};
    
    // Update node positions
    const updatedNodes = currentNodes.map(node => {
      const layer = nodeLayers[node.id] || 0;
      
      // Initialize layer position counter if not exists
      if (layerPositions[layer] === undefined) {
        layerPositions[layer] = 0;
      }
      
      // Calculate horizontal position within the layer
      const nodesInLayer = layerCounts[layer] || 1;
      const totalWidth = (nodesInLayer - 1) * horizontalSpacing;
      const startX = -totalWidth / 2;
      const x = startX + (layerPositions[layer] * horizontalSpacing);
      
      // Calculate vertical position based on layer
      const y = layer * verticalSpacing;
      
      // Increment the position counter for this layer
      layerPositions[layer]++;
      
      // Return the updated node with new position
      return {
        ...node,
        position: { x, y }
      };
    });
    
    // Update nodes in the store
    updatedNodes.forEach(node => {
      const { id, position } = node;
      // Find the node in the store
      const storeNode = storeNodes.find(n => n.id === id);
      if (storeNode) {
        // Update the node position
        const updatedNode = { ...storeNode, position };
        // Replace the node in the store
        removeNode(id);
        addNode(updatedNode);
      }
    });
    
    // Show success message
    setConnectionMessage({
      message: 'Smart layout applied successfully',
      isError: false
    });
    
    // Clear message after a delay
    setTimeout(() => setConnectionMessage(null), 3000);
    
    // Fit view to show all nodes
    setTimeout(() => {
      if (reactFlowInstanceRef.current) {
        reactFlowInstanceRef.current.fitView({ padding: 0.2 });
      }
    }, 100);
  }, [storeNodes, storeEdges, addNode, removeNode]);

  // Toggle grid snap
  const handleToggleGridSnap = useCallback(() => {
    setSnapToGrid(prev => !prev);
    
    // Show message about grid snap status
    setConnectionMessage({
      message: snapToGrid ? 'Grid snap disabled' : 'Grid snap enabled',
      isError: false
    });
    
    // Clear message after a delay
    setTimeout(() => setConnectionMessage(null), 3000);
  }, [snapToGrid]);

  return (
    <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Workflow Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider' 
      }}>
        <Typography variant="h6" component="div">
          {workflowName}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEditWorkflowDetails}
            size="small"
          >
            Edit Workflow Details
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleOpenOperatorMenu}
            size="small"
            aria-controls={operatorMenuOpen ? 'operator-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={operatorMenuOpen ? 'true' : undefined}
          >
            Add Operator
          </Button>
          <Button
            variant="outlined"
            startIcon={<VerifiedIcon />}
            onClick={handleValidateWorkflow}
            size="small"
          >
            Validate Workflow
          </Button>
          <Button
            variant="outlined"
            startIcon={<AutoFixHighIcon />}
            onClick={handleSmartLayout}
            size="small"
          >
            Smart Layout
          </Button>
          <Button
            variant="outlined"
            startIcon={<GridOnIcon />}
            onClick={handleToggleGridSnap}
            size="small"
          >
            Toggle Grid Snap
          </Button>
        </Box>
      </Box>
      
      {/* Operator Menu */}
      <Menu
        anchorEl={operatorMenuAnchorEl}
        open={operatorMenuOpen}
        onClose={handleCloseOperatorMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleAddOperator(OperatorType.Start)}>
          <ListItemIcon><PlayArrowIcon /></ListItemIcon>
          <ListItemText>Start</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAddOperator(OperatorType.Stop)}>
          <ListItemIcon><StopIcon /></ListItemIcon>
          <ListItemText>Stop</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleAddOperator(OperatorType.Sequential)}>
          <ListItemIcon><ArrowForwardIcon /></ListItemIcon>
          <ListItemText>Sequential</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAddOperator(OperatorType.ToolCall)}>
          <ListItemIcon><BuildIcon /></ListItemIcon>
          <ListItemText>Tool Call</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAddOperator(OperatorType.AgentCall)}>
          <ListItemIcon><SmartToyIcon /></ListItemIcon>
          <ListItemText>Agent Call</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleAddOperator(OperatorType.MemoryRead)}>
          <ListItemIcon><MemoryIcon /></ListItemIcon>
          <ListItemText>Memory Read</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAddOperator(OperatorType.MemoryWrite)}>
          <ListItemIcon><SaveIcon /></ListItemIcon>
          <ListItemText>Memory Write</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleAddOperator(OperatorType.Decision)}>
          <ListItemIcon><HelpIcon /></ListItemIcon>
          <ListItemText>Decision</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAddOperator(OperatorType.ParallelFork)}>
          <ListItemIcon><CallSplitIcon /></ListItemIcon>
          <ListItemText>Parallel Fork</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAddOperator(OperatorType.ParallelJoin)}>
          <ListItemIcon><MergeIcon /></ListItemIcon>
          <ListItemText>Parallel Join</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleAddOperator(OperatorType.Loop)}>
          <ListItemIcon><LoopIcon /></ListItemIcon>
          <ListItemText>Loop</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAddOperator(OperatorType.ErrorRetry)}>
          <ListItemIcon><ReplayIcon /></ListItemIcon>
          <ListItemText>Error Retry</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAddOperator(OperatorType.Timeout)}>
          <ListItemIcon><TimerIcon /></ListItemIcon>
          <ListItemText>Timeout</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleAddOperator(OperatorType.HumanPause)}>
          <ListItemIcon><PauseIcon /></ListItemIcon>
          <ListItemText>Human Pause</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAddOperator(OperatorType.SubGraph)}>
          <ListItemIcon><AccountTreeIcon /></ListItemIcon>
          <ListItemText>Sub Graph</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* ReactFlow Container */}
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <ValidationMessages />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={onInit}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions} // Add custom edge styles
          fitView={false}
          fitViewOptions={{ duration: 0 }}
          minZoom={0.1}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          snapToGrid={snapToGrid}
          snapGrid={snapGrid}
        >
          <MiniMap
            nodeStrokeWidth={3}
            nodeColor={n => {
              if (n.type === 'agent') return isDarkMode ? '#90cdf4' : '#3182ce';
              if (n.type === 'memory') return isDarkMode ? '#9ae6b4' : '#38a169';
              if (n.type === 'tool') return isDarkMode ? '#fbd38d' : '#dd6b20';
              if (n.type === 'operator') {
                // Get the operator type from the node data
                const operatorType = (n.data as any)?.operatorType;
                if (operatorType && Object.values(OperatorType).includes(operatorType)) {
                  // Use the color from the operatorColors map
                  return operatorColors[operatorType as OperatorType] || '#a0aec0';
                }
              }
              return isDarkMode ? '#a0aec0' : '#4a5568';
            }}
          />
          <Controls />
          <Background color={isDarkMode ? '#4a5568' : '#a0aec0'} gap={16} />
        </ReactFlow>
      </Box>
      
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Confirm Deletion"
        message={deleteDialogMessage}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </Paper>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default memo(WorkflowGraph);
