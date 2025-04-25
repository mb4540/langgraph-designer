import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useThemeContext } from '../context/ThemeContext';
import { useWorkflowStore, NodeType } from '../store/workflowStore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Diamond from './nodes/Diamond'; // Import Diamond from its new location

// Import all possible agent icons
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AssistantIcon from '@mui/icons-material/Assistant';
import BiotechIcon from '@mui/icons-material/Biotech';
import SchoolIcon from '@mui/icons-material/School';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DataObjectIcon from '@mui/icons-material/DataObject';
import TerminalIcon from '@mui/icons-material/Terminal';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DescriptionIcon from '@mui/icons-material/Description';
import SecurityIcon from '@mui/icons-material/Security';

// Constants

// Map of icon IDs to their components
const iconComponents: Record<string, React.ComponentType<any>> = {
  'smart-toy': SmartToyIcon,
  'psychology': PsychologyIcon,
  'support-agent': SupportAgentIcon,
  'assistant': AssistantIcon,
  'biotech': BiotechIcon,
  'school': SchoolIcon,
  'auto-fix': AutoFixHighIcon,
  'data-object': DataObjectIcon,
  'terminal': TerminalIcon,
  'account-tree': AccountTreeIcon,
  'description': DescriptionIcon,
  'security': SecurityIcon,
};

// Map of model IDs to display names
const modelDisplayNames: Record<string, string> = {
  'gpt-4o': 'OpenAI GPT-4o',
  'claude-3-7-sonnet': 'Anthropic Claude 3.7 Sonnet',
  'gemini-2-5-pro': 'Google DeepMind Gemini 2.5 Pro',
  'llama-3-70b': 'Meta Llama 3-70B',
  'mistral-large': 'Mistral Large',
  'grok-3': 'xAI Grok 3',
  'deepseek-coder-v2': 'DeepSeek-Coder V2',
  'cohere-command-r': 'Cohere Command-R',
  'phi-3': 'Microsoft Phi-3',
  'jurassic-2-ultra': 'AI21 Labs Jurassic-2 Ultra',
  'pangu-2': 'Huawei PanGu 2.0',
  'ernie-4': 'Baidu ERNIE 4.0',
};

// Node position constants
const NODE_POSITIONS = {
  memory: { x: -50, y: 200 },
  tool: { x: 50, y: 200 },
  agent: { x: 300, y: 0 } // For connected agents
};

// Color constants
const COLORS = {
  memory: {
    main: '#f39c12',
    light: '#f6ad55',
  },
  tool: {
    main: '#805ad5',
    light: '#9ae6b4',
  },
  agent: {
    main: '#4299e1',
    light: '#63b3ed',
    dark: '#2a4365',
    background: '#ebf8ff',
  }
};

// Main AgentNode component
const AgentNode: React.FC<NodeProps> = ({ id, data }) => {
  const { mode } = useThemeContext();
  const isDarkMode = mode === 'dark';
  const { addNode, addEdge, selectNode } = useWorkflowStore();

  // Determine which icon to display
  const iconId = data.icon || 'smart-toy';
  const IconComponent = iconComponents[iconId] || SmartToyIcon;

  // Event handlers
  const handleAddComponent = (type: NodeType, handleId: string) => {
    // Generate a unique ID
    const newId = `${type}-${Date.now()}`;
    
    // Get the position of the agent node to position the new component relative to it
    const agentNode = useWorkflowStore.getState().nodes.find(node => node.id === id);
    if (!agentNode) return;
    
    // Use fixed position offsets based on node type
    const newNodePosition = {
      x: agentNode.position.x + NODE_POSITIONS[type].x,
      y: agentNode.position.y + NODE_POSITIONS[type].y
    };

    // Create the new node based on type
    const newNode = {
      id: newId,
      type: type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
      content: `This is a ${type} component.`,
      position: newNodePosition,
      parentId: id, // Reference to the parent agent
      sourceHandle: handleId, // Store which diamond created this node
      // Add default memory type for memory nodes
      ...(type === 'memory' && { memoryType: 'conversation-buffer' }),
      // Add default tool type for tool nodes
      ...(type === 'tool' && { toolType: 'stagehand-browser' })
    };

    // Add the new node
    addNode(newNode);
    
    // Create an edge from the agent's specific diamond handle to the new component
    const newEdge = {
      id: `e${id}-${newId}`,
      source: id,
      target: newId,
      animated: true, // Add animation to show data flow
      sourceHandle: handleId, // Connect from the specific diamond handle
      targetHandle: 'target-handle', // Connect to the default target handle
    };
    
    // Add the edge
    addEdge(newEdge);
    
    // Select the new node to open it in the details panel
    selectNode(newId);
  };

  const handleAddAgent = () => {
    // Generate a unique ID
    const newId = `agent-${Date.now()}`;
    
    // Get the position of the current agent node
    const agentNode = useWorkflowStore.getState().nodes.find(node => node.id === id);
    if (!agentNode) return;
    
    // Use fixed position offset for agent nodes
    const newNodePosition = {
      x: agentNode.position.x + NODE_POSITIONS.agent.x,
      y: agentNode.position.y + NODE_POSITIONS.agent.y
    };

    // Create the new agent node
    const newNode = {
      id: newId,
      type: 'agent' as NodeType, 
      name: 'New Agent',
      content: 'This is a new agent.',
      position: newNodePosition,
    };

    // Add the new agent node
    addNode(newNode);
    
    // Create an edge from the current agent to the new agent
    const newEdge = {
      id: `e${id}-${newId}`,
      source: id,
      target: newId,
      animated: true, // Add animation to show data flow
      sourceHandle: 'agent-handle', // Connect from the agent handle
      targetHandle: 'target-handle', // Connect to the default target handle
    };
    
    // Add the edge
    addEdge(newEdge);
    
    // Select the new agent to open it in the details panel
    selectNode(newId);
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  // Styles
  const nodeStyles = {
    background: isDarkMode ? COLORS.agent.dark : COLORS.agent.background,
    color: isDarkMode ? '#e2e8f0' : '#1a202c',
    border: isDarkMode ? `1px solid ${COLORS.agent.main}` : `1px solid ${COLORS.agent.light}`,
    borderRadius: '8px',
    padding: '10px',
    minWidth: '180px',
    position: 'relative' as const,
    paddingBottom: '20px',
    marginBottom: '30px', // Add space for the diamonds
    boxShadow: isDarkMode ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const handleStyles = {
    background: isDarkMode ? COLORS.agent.main : COLORS.agent.light,
  };

  const iconStyles = {
    position: 'absolute' as const,
    top: '10px',
    left: '10px',
    color: isDarkMode ? COLORS.agent.main : COLORS.agent.main,
  };

  const contentStyles = { 
    marginTop: '5px', 
    marginLeft: '40px', // Add space for the icon
    fontWeight: 'normal' as const, 
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '5px'
  };

  const modelInfoStyles = { 
    fontSize: '0.8rem', 
    color: isDarkMode ? '#a0aec0' : '#4a5568',
    marginBottom: '8px'
  };

  // Render
  return (
    <div
      style={nodeStyles}
      onDoubleClick={() => selectNode(id)}
    >
      <Handle type="target" position={Position.Top} style={handleStyles} />
      
      {/* Agent Icon */}
      <div style={iconStyles}>
        <IconComponent fontSize="medium" />
      </div>
      
      {/* Node content */}
      <div style={contentStyles}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{data.label}</div>
      
        {/* Display LLM model if available */}
        {data.llmModel && (
          <div style={modelInfoStyles}>
            Model: {modelDisplayNames[data.llmModel] || data.llmModel}
          </div>
        )}
      </div>
      
      {/* Small square on the right side with plus sign */}
      <div style={{ position: 'relative' }}>
        {/* Square with plus sign */}
        <div
          onClick={handleAddAgent}
          style={{
            position: 'absolute',
            right: '-20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            background: isDarkMode ? COLORS.agent.dark : COLORS.agent.background,
            border: isDarkMode ? `1px solid ${COLORS.agent.main}` : `1px solid ${COLORS.agent.light}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            boxShadow: isDarkMode ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
          }}
          title="Add connected agent"
        >
          <AddIcon style={{ fontSize: '14px', color: isDarkMode ? COLORS.agent.main : COLORS.agent.light }} />
          
          {/* Agent handle - moved to be on the right side of the plus button */}
          <Handle
            id="agent-handle"
            type="source"
            position={Position.Right}
            style={{
              background: isDarkMode ? COLORS.agent.main : COLORS.agent.light,
              right: '-4px',
              width: '8px',
              height: '8px',
              zIndex: 20,
            }}
          />
        </div>
      </div>
      
      {/* Delete icon */}
      <div 
        style={{
          position: 'absolute',
          bottom: '5px',
          right: '5px',
          cursor: 'pointer',
          color: isDarkMode ? '#e53e3e' : '#f56565',
        }}
        onClick={handleDelete}
        title="Delete node"
      >
        <DeleteIcon fontSize="small" />
      </div>
      
      {/* Diamond connectors at the bottom with matching colors to their respective nodes */}
      <Diamond
        label="Memory"
        position={25}
        onClick={() => handleAddComponent('memory', 'memory-handle')}
        isDarkMode={isDarkMode}
        color={COLORS.memory.main}
        lightColor={COLORS.memory.light}
        handleId="memory-handle"
        nodeType="memory"
      />
      <Diamond
        label="Tools"
        position={75}
        onClick={() => handleAddComponent('tool', 'tool-handle')}
        isDarkMode={isDarkMode}
        color={COLORS.tool.main}
        lightColor={COLORS.tool.light}
        handleId="tool-handle"
        nodeType="tool"
      />
    </div>
  );
};

export default AgentNode;
