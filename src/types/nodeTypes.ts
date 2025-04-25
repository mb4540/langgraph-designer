/**
 * Type definitions for nodes in the workflow graph
 */

/**
 * Enum for node types in the workflow
 */
export type NodeType = 'agent' | 'tool' | 'memory';

/**
 * Interface for workflow nodes
 */
export interface WorkflowNode {
  id: string;
  type: NodeType;
  name: string;
  content: string;
  position: { x: number; y: number };
  llmModel?: string; // Only for agents
  memoryType?: string; // Only for memory nodes
  toolType?: string; // Only for tool nodes
  parentId?: string; // Reference to the parent node (if created from a diamond connector)
  sourceHandle?: string; // The handle ID from which this node was created
  
  // Additional fields for agent details
  workgroup?: string; // Work-group the agent belongs to
  icon?: string; // Icon identifier for the agent
  agentType?: string; // Type of agent (e.g., 'assistant')
  description?: string; // Description of the agent
  enableMarkdown?: boolean; // Whether to enable markdown response format
  credentialsSource?: string; // Source of LLM credentials
  maxConsecutiveReplies?: number; // Maximum number of consecutive auto replies
}

/**
 * Interface for workflow edges
 */
export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  sourceHandle?: string; // Handle ID on the source node
  targetHandle?: string; // Handle ID on the target node
}

/**
 * Interface for model option
 */
export interface ModelOption {
  value: string;
  label: string;
}

/**
 * Interface for memory type
 */
export interface MemoryType {
  value: string;
  label: string;
  description: string;
  source: string;
}

/**
 * Interface for tool type
 */
export interface ToolType {
  value: string;
  label: string;
  description: string;
  source: string;
  code: string;
}
