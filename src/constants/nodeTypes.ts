/**
 * Node type constants and related mappings for the workflow designer
 */
import { NodeTypes } from 'reactflow';
import MainAgentNode from '../components/MainAgentNode';
import MemoryNode from '../components/nodes/MemoryNode';
import ToolNode from '../components/nodes/ToolNode';

/**
 * ReactFlow node type mapping
 */
export const NODE_TYPES: NodeTypes = {
  agent: MainAgentNode,
  memory: MemoryNode,
  tool: ToolNode,
};

/**
 * Memory types with their display names
 */
export const MEMORY_DISPLAY_NAMES: Record<string, string> = {
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

/**
 * Tool types with their display names
 */
export const TOOL_DISPLAY_NAMES: Record<string, string> = {
  'stagehand-browser': 'Stagehand Browser',
  'vector-store-retriever': 'Vector-Store Retriever',
  'calculator-math': 'Calculator / Math',
  'multi-database-sql': 'Multi-Database SQL',
  'email-imap-smtp': 'Email (IMAP/SMTP)',
  'azure-functions': 'Azure Functions',
};

/**
 * Get the display name for a memory type
 * 
 * @param memoryType - The memory type identifier
 * @returns The display name for the memory type
 */
export const getMemoryDisplayName = (memoryType: string): string => {
  return MEMORY_DISPLAY_NAMES[memoryType] || memoryType;
};

/**
 * Get the display name for a tool type
 * 
 * @param toolType - The tool type identifier
 * @returns The display name for the tool type
 */
export const getToolDisplayName = (toolType: string): string => {
  return TOOL_DISPLAY_NAMES[toolType] || toolType;
};

/**
 * Create a label for a node based on its type and properties
 * 
 * @param type - The node type
 * @param name - The node name
 * @param memoryType - Optional memory type
 * @param toolType - Optional tool type
 * @returns A formatted label for the node
 */
export const createNodeLabel = (
  type: string,
  name: string,
  memoryType?: string,
  toolType?: string
): string => {
  if (type === 'memory' && memoryType) {
    const memoryName = getMemoryDisplayName(memoryType);
    return `Memory: ${memoryName}`;
  } else if (type === 'tool' && toolType) {
    const toolName = getToolDisplayName(toolType);
    return `Tool: ${toolName}`;
  } else if (type === 'agent') {
    return `Agent: ${name}`;
  } else {
    return `${type.charAt(0).toUpperCase() + type.slice(1)}: ${name}`;
  }
};
