/**
 * Workflow Validator
 * 
 * This utility provides validation for workflow graphs according to the connectivity
 * rules required by both Autogen and LangGraph runtimes.
 */

import { OperatorType, WorkflowNode, WorkflowEdge, TriggerType } from '../types/nodeTypes';

// Define the types for the validation rules
export type RuntimeType = 'autogen' | 'langgraph';

export interface ConnectionRule {
  in: string[] | { autogen: string[], langgraph: string[] };
  out: string[];
  minBranches?: number;
}

export interface ValidationPolicy {
  [key: string]: ConnectionRule;
}

// Constants for special rule types
const ANY = 'ANY';
const ANY_NON_TERMINAL = 'ANY_NON_TERMINAL';
const ANY_NON_TERMINAL_OR_END = 'ANY_NON_TERMINAL_OR_END';
const BRANCH = 'BRANCH';
const EARLIER_NODE = 'EARLIER_NODE';
const ORIGIN = 'ORIGIN';

// The validation policy as defined in the rule-book
const validationPolicy: ValidationPolicy = {
  "START": { "in": [], "out": [ANY_NON_TERMINAL] },
  "END": { "in": [ANY], "out": [] },

  "AGENT_CALL": {
    "in": [ANY_NON_TERMINAL, "START"],
    "out": ["TOOL_CALL", "DECISION", "MEMORY_READ", "MEMORY_WRITE",
      "PARALLEL_FORK", "HUMAN_PAUSE", "ERROR_RETRY",
      "TIMEOUT", "AGENT_CALL", "LOOP", "END"]
  },

  "TOOL_CALL": {
    "in": { "autogen": ["AGENT_CALL"],
      "langgraph": [ANY_NON_TERMINAL] },
    "out": ["AGENT_CALL", "MEMORY_WRITE", "DECISION", "PARALLEL_FORK",
      "ERROR_RETRY", "TIMEOUT", "END"]
  },

  "MEMORY_READ": {
    "in": ["AGENT_CALL", "TOOL_CALL", "PARALLEL_JOIN", "SUB_GRAPH"],
    "out": ["AGENT_CALL", "TOOL_CALL", "DECISION", "PARALLEL_FORK", "END"]
  },

  "MEMORY_WRITE": {
    "in": ["AGENT_CALL", "TOOL_CALL"],
    "out": ["AGENT_CALL", "DECISION", "PARALLEL_FORK", "END"]
  },

  "DECISION": {
    "in": [ANY_NON_TERMINAL],
    "out": [ANY_NON_TERMINAL_OR_END],
    "minBranches": 2
  },

  "PARALLEL_FORK": {
    "in": [ANY_NON_TERMINAL],
    "out": [ANY_NON_TERMINAL],
    "minBranches": 2
  },

  "PARALLEL_JOIN": {
    "in": [BRANCH],
    "out": ["AGENT_CALL", "TOOL_CALL", "DECISION", "MEMORY_WRITE", "END"]
  },

  "LOOP": {
    "in": [ANY_NON_TERMINAL],
    "out": [EARLIER_NODE, "DECISION", "END"]
  },

  "ERROR_RETRY": {
    "in": [ANY_NON_TERMINAL],
    "out": [ORIGIN, "DECISION", "END"]
  },

  "TIMEOUT": {
    "in": [ANY_NON_TERMINAL],
    "out": ["ERROR_RETRY", "DECISION", "END"]
  },

  "HUMAN_PAUSE": {
    "in": ["AGENT_CALL", "TOOL_CALL"],
    "out": ["AGENT_CALL", "DECISION"]
  },

  "SUB_GRAPH": {
    "in": [ANY_NON_TERMINAL],
    "out": ["AGENT_CALL", "TOOL_CALL", "DECISION",
      "MEMORY_WRITE", "PARALLEL_FORK", "END"]
  }
};

// Map OperatorType enum values to the policy keys
const operatorTypeToRuleKey: Record<OperatorType, string> = {
  [OperatorType.Start]: 'START',
  [OperatorType.Stop]: 'END',
  [OperatorType.Sequential]: 'SEQUENCE',
  [OperatorType.ToolCall]: 'TOOL_CALL',
  [OperatorType.AgentCall]: 'AGENT_CALL',
  [OperatorType.MemoryRead]: 'MEMORY_READ',
  [OperatorType.MemoryWrite]: 'MEMORY_WRITE',
  [OperatorType.Decision]: 'DECISION',
  [OperatorType.ParallelFork]: 'PARALLEL_FORK',
  [OperatorType.ParallelJoin]: 'PARALLEL_JOIN',
  [OperatorType.Loop]: 'LOOP',
  [OperatorType.ErrorRetry]: 'ERROR_RETRY',
  [OperatorType.Timeout]: 'TIMEOUT',
  [OperatorType.HumanPause]: 'HUMAN_PAUSE',
  [OperatorType.SubGraph]: 'SUB_GRAPH'
};

// Helper function to get all non-terminal operator types
const getNonTerminalOperatorTypes = (): string[] => {
  return Object.values(operatorTypeToRuleKey).filter(
    type => type !== 'START' && type !== 'END'
  );
};

// Helper function to get all operator types including END
const getNonTerminalOrEndOperatorTypes = (): string[] => {
  return Object.values(operatorTypeToRuleKey).filter(
    type => type !== 'START'
  );
};

// Helper function to expand special rule types
const expandRuleType = (ruleType: string, context: {
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  sourceNodeId?: string,
  targetNodeId?: string
}): string[] => {
  switch (ruleType) {
    case ANY:
      return Object.values(operatorTypeToRuleKey);
    case ANY_NON_TERMINAL:
      return getNonTerminalOperatorTypes();
    case ANY_NON_TERMINAL_OR_END:
      return getNonTerminalOrEndOperatorTypes();
    case BRANCH:
      // This would need to identify nodes that are part of parallel branches
      // For simplicity, we'll allow any non-terminal node here
      return getNonTerminalOperatorTypes();
    case EARLIER_NODE:
      // This would need to identify nodes that appear earlier in the graph
      // For simplicity, we'll allow any non-terminal node here
      return getNonTerminalOperatorTypes();
    case ORIGIN:
      // This would need to identify the originating node of an error
      // For simplicity, we'll allow any non-terminal node here
      return getNonTerminalOperatorTypes();
    default:
      return [ruleType];
  }
};

// Helper function to get the rule for a specific operator type
const getRuleForOperatorType = (operatorType: OperatorType, runtimeType: RuntimeType): ConnectionRule | null => {
  const ruleKey = operatorTypeToRuleKey[operatorType];
  if (!ruleKey || !validationPolicy[ruleKey]) {
    return null;
  }
  
  const rule = validationPolicy[ruleKey];
  
  // Handle the special case for TOOL_CALL which has different rules for autogen vs langgraph
  if (ruleKey === 'TOOL_CALL' && !Array.isArray(rule.in)) {
    const inRule = rule.in as { autogen: string[], langgraph: string[] };
    return {
      ...rule,
      in: inRule[runtimeType]
    };
  }
  
  return rule;
};

/**
 * Validates a Start operator node
 */
export const validateStartOperator = (
  node: WorkflowNode,
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  runtimeType: RuntimeType = 'langgraph',
  runtimeSettings?: { checkpointStore?: string }
): { isValid: boolean, message?: string, warnings?: string[] } => {
  // Check if the node is a Start operator
  if (node.type !== 'operator' || node.operatorType !== OperatorType.Start) {
    return { isValid: true };
  }

  const warnings: string[] = [];

  // Check if the trigger type is set
  if (!node.triggerType) {
    return { isValid: false, message: 'Start operator must have a trigger type' };
  }

  // Check for incoming edges (Start nodes should never have incoming edges)
  const incomingEdges = edges.filter(edge => edge.target === node.id);
  if (incomingEdges.length > 0) {
    return { isValid: false, message: 'Start nodes cannot have incoming edges' };
  }

  // Get outgoing edges for this Start node
  const outgoingEdges = edges.filter(edge => edge.source === node.id);
  
  // Trigger-specific edge rules
  switch (node.triggerType) {
    case 'human':
      // Must have outgoing edges
      if (outgoingEdges.length === 0) {
        return { isValid: false, message: 'Human-triggered Start node must have at least one outgoing edge' };
      }
      
      // First outgoing edge should point to AGENT_CALL
      if (outgoingEdges.length > 0) {
        const firstTargetId = outgoingEdges[0].target;
        const firstTarget = nodes.find(n => n.id === firstTargetId);
        
        if (!firstTarget || firstTarget.type !== 'operator' || firstTarget.operatorType !== OperatorType.AgentCall) {
          return { 
            isValid: false, 
            message: 'Human-triggered Start node\'s first outgoing edge must point to an AGENT_CALL node' 
          };
        }
        
        // Runtime-specific checks
        if (runtimeType === 'autogen') {
          // Should check if the AGENT_CALL wraps a UserProxyAgent
          // This would require additional metadata about agent types
          warnings.push('Ensure the target AGENT_CALL wraps a UserProxyAgent for Autogen runtime');
        } else if (runtimeType === 'langgraph') {
          // Should check if it points to an interrupt() node
          warnings.push('Ensure the target AGENT_CALL includes an interrupt() node for LangGraph runtime');
        }
      }
      break;
      
    case 'system':
      // Must have outgoing edges
      if (outgoingEdges.length === 0) {
        return { isValid: false, message: 'System-triggered Start node must have at least one outgoing edge' };
      }
      break;
      
    case 'event':
      // Should not have outgoing edges (external orchestration picks first node)
      if (outgoingEdges.length > 0) {
        return { 
          isValid: false, 
          message: 'Event-triggered Start node should not have outgoing edges (external orchestration will pick first node)' 
        };
      }
      
      // Runtime-specific warnings
      if (runtimeType === 'autogen') {
        warnings.push('Autogen lacks a native scheduler; generate an external wrapper');
      }
      break;
      
    case 'multi':
      // Must have at least two outgoing edges (fan-out)
      if (outgoingEdges.length < 2) {
        return { 
          isValid: false, 
          message: 'Multi-triggered Start node must have at least two outgoing edges (fan-out)' 
        };
      }
      break;
  }

  // Check if resume_capable requires a checkpoint store
  if (node.resumeCapable && (!runtimeSettings || !runtimeSettings.checkpointStore)) {
    return { 
      isValid: false, 
      message: 'Resume-capable workflows require a checkpoint store to be configured in runtime settings' 
    };
  }

  // Runtime-specific validations
  if (runtimeType === 'autogen') {
    // For 'system' trigger type in Autogen, resume_capable must be false
    if (node.triggerType === 'system' && node.resumeCapable) {
      return { 
        isValid: false, 
        message: "System-triggered workflows in Autogen cannot be resume-capable" 
      };
    }
    
    // Autogen only supports 'human' and 'system' trigger types
    if (node.triggerType !== 'human' && node.triggerType !== 'system') {
      return { 
        isValid: false, 
        message: `Autogen runtime only supports 'human' and 'system' trigger types, not '${node.triggerType}'` 
      };
    }
  }

  return { isValid: true, warnings: warnings.length > 0 ? warnings : undefined };
};

/**
 * Validates if a connection between two nodes is allowed according to the rules
 */
export const validateConnection = (
  sourceNode: WorkflowNode,
  targetNode: WorkflowNode,
  runtimeType: RuntimeType = 'langgraph',
  context: { nodes: WorkflowNode[], edges: WorkflowEdge[] }
): { isValid: boolean, message?: string } => {
  // If either node is not an operator, allow the connection (for now)
  if (sourceNode.type !== 'operator' || targetNode.type !== 'operator') {
    return { isValid: true };
  }

  // Get the rules for the source and target operator types
  const sourceRule = getRuleForOperatorType(sourceNode.operatorType!, runtimeType);
  const targetRule = getRuleForOperatorType(targetNode.operatorType!, runtimeType);

  if (!sourceRule || !targetRule) {
    return { isValid: false, message: 'Invalid operator type' };
  }

  // Check if the target node type is allowed as an output of the source node
  const allowedOutputs = sourceRule.out;
  const targetRuleKey = operatorTypeToRuleKey[targetNode.operatorType!];

  // Expand any special rule types
  const expandedOutputs = allowedOutputs.flatMap(ruleType => 
    expandRuleType(ruleType, { ...context, sourceNodeId: sourceNode.id, targetNodeId: targetNode.id })
  );

  if (!expandedOutputs.includes(targetRuleKey)) {
    return { 
      isValid: false, 
      message: `${sourceNode.operatorType} cannot connect to ${targetNode.operatorType}` 
    };
  }

  // Check if the source node type is allowed as an input to the target node
  const allowedInputs = Array.isArray(targetRule.in) 
    ? targetRule.in 
    : targetRule.in[runtimeType];

  const sourceRuleKey = operatorTypeToRuleKey[sourceNode.operatorType!];

  // Expand any special rule types
  const expandedInputs = allowedInputs.flatMap(ruleType => 
    expandRuleType(ruleType, { ...context, sourceNodeId: sourceNode.id, targetNodeId: targetNode.id })
  );

  if (!expandedInputs.includes(sourceRuleKey)) {
    return { 
      isValid: false, 
      message: `${targetNode.operatorType} cannot accept input from ${sourceNode.operatorType}` 
    };
  }

  return { isValid: true };
};

/**
 * Validates the entire workflow graph against all rules
 */
export const validateWorkflow = (
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  runtimeType: RuntimeType = 'langgraph',
  runtimeSettings?: { checkpointStore?: string }
): { isValid: boolean, errors: string[], warnings?: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Uniqueness check for Start nodes
  const startNodes = nodes.filter(node => 
    node.type === 'operator' && node.operatorType === OperatorType.Start
  );

  if (startNodes.length === 0) {
    errors.push('Graph must contain exactly one Start node.');
  } else if (startNodes.length > 1 && startNodes.some(s => s.triggerType !== 'multi')) {
    errors.push('Multiple Start nodes require `trigger_type: "multi"` on each.');
  }

  // For Autogen, only one START node is allowed regardless of trigger type
  if (runtimeType === 'autogen' && startNodes.length > 1) {
    errors.push('Autogen runtime only supports one START node');
  }

  // Validate each START node
  startNodes.forEach(node => {
    const validation = validateStartOperator(node, nodes, edges, runtimeType, runtimeSettings);
    if (!validation.isValid && validation.message) {
      errors.push(validation.message);
    }
    if (validation.warnings && validation.warnings.length > 0) {
      warnings.push(...validation.warnings);
    }
  });

  // Check that we have at least one END node
  const endNodes = nodes.filter(node => 
    node.type === 'operator' && node.operatorType === OperatorType.Stop
  );

  if (endNodes.length === 0) {
    errors.push('Workflow must have at least one END node');
  }

  // Check that all nodes have the required connections
  nodes.forEach(node => {
    // Skip non-operator nodes for now
    if (node.type !== 'operator') return;

    const rule = getRuleForOperatorType(node.operatorType!, runtimeType);
    if (!rule) return;

    // Skip connection checks for START nodes (handled in validateStartOperator)
    if (node.operatorType === OperatorType.Start) return;

    // Check incoming connections
    const incomingEdges = edges.filter(edge => edge.target === node.id);
    const incomingNodes = incomingEdges.map(edge => 
      nodes.find(n => n.id === edge.source)
    ).filter(Boolean) as WorkflowNode[];

    if (incomingEdges.length === 0) {
      errors.push(`${node.operatorType} node '${node.name}' has no incoming connections`);
    } else {
      // Check if the incoming connections are valid
      incomingNodes.forEach(sourceNode => {
        if (sourceNode.type === 'operator') {
          const validation = validateConnection(sourceNode, node, runtimeType, { nodes, edges });
          if (!validation.isValid && validation.message) {
            errors.push(validation.message);
          }
        }
      });
    }

    // Check outgoing connections (except for END nodes)
    if (node.operatorType !== OperatorType.Stop) {
      const outgoingEdges = edges.filter(edge => edge.source === node.id);
      const outgoingNodes = outgoingEdges.map(edge => 
        nodes.find(n => n.id === edge.target)
      ).filter(Boolean) as WorkflowNode[];

      if (outgoingEdges.length === 0) {
        errors.push(`${node.operatorType} node '${node.name}' has no outgoing connections`);
      } else {
        // Check if the outgoing connections are valid
        outgoingNodes.forEach(targetNode => {
          if (targetNode.type === 'operator') {
            const validation = validateConnection(node, targetNode, runtimeType, { nodes, edges });
            if (!validation.isValid && validation.message) {
              errors.push(validation.message);
            }
          }
        });
      }

      // Check minimum branches for nodes that require them
      if (rule.minBranches && outgoingEdges.length < rule.minBranches) {
        errors.push(`${node.operatorType} node '${node.name}' requires at least ${rule.minBranches} outgoing connections`);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined
  };
};

/**
 * Checks if a new connection would be valid according to the rules
 */
export const canConnect = (
  sourceNode: WorkflowNode,
  targetNode: WorkflowNode,
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  runtimeType: RuntimeType = 'langgraph'
): { canConnect: boolean, message?: string } => {
  // First, check if the connection would be valid according to the rules
  const validation = validateConnection(sourceNode, targetNode, runtimeType, { nodes, edges });
  if (!validation.isValid) {
    return { canConnect: false, message: validation.message };
  }

  // Check if the connection would create a cycle (except for LOOP nodes)
  if (sourceNode.operatorType !== OperatorType.Loop) {
    // Simple cycle detection: check if there's already a path from target to source
    const visited = new Set<string>();
    const queue = [targetNode.id];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (currentId === sourceNode.id) {
        return { canConnect: false, message: 'Connection would create a cycle' };
      }

      if (!visited.has(currentId)) {
        visited.add(currentId);
        const outgoingEdges = edges.filter(edge => edge.source === currentId);
        outgoingEdges.forEach(edge => queue.push(edge.target));
      }
    }
  }

  return { canConnect: true };
};
