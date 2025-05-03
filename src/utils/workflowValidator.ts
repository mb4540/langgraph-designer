/**
 * Workflow Validator
 * 
 * This utility provides validation for workflow graphs according to the connectivity
 * rules required by both Autogen and LangGraph runtimes.
 */

import { OperatorType, WorkflowNode, WorkflowEdge } from '../types/nodeTypes';

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
  
  // Get the operator types
  const sourceOperatorType = sourceNode.operatorType;
  const targetOperatorType = targetNode.operatorType;
  
  if (!sourceOperatorType || !targetOperatorType) {
    return { isValid: false, message: 'Missing operator type' };
  }
  
  // Get the rules for the source and target operators
  const sourceRule = getRuleForOperatorType(sourceOperatorType, runtimeType);
  const targetRule = getRuleForOperatorType(targetOperatorType, runtimeType);
  
  if (!sourceRule) {
    return { isValid: false, message: `No rules defined for source operator type: ${sourceOperatorType}` };
  }
  
  if (!targetRule) {
    return { isValid: false, message: `No rules defined for target operator type: ${targetOperatorType}` };
  }
  
  // Get the rule keys for source and target
  const sourceRuleKey = operatorTypeToRuleKey[sourceOperatorType];
  const targetRuleKey = operatorTypeToRuleKey[targetOperatorType];
  
  // Check if the target type is allowed as an outgoing connection from the source
  const allowedOutgoing = sourceRule.out.flatMap(type => 
    expandRuleType(type, { ...context, sourceNodeId: sourceNode.id, targetNodeId: targetNode.id })
  );
  
  if (!allowedOutgoing.includes(targetRuleKey)) {
    return { 
      isValid: false, 
      message: `Connection from ${sourceOperatorType} to ${targetOperatorType} is not allowed. Allowed targets are: ${allowedOutgoing.join(', ')}` 
    };
  }
  
  // Check if the source type is allowed as an incoming connection to the target
  const allowedIncoming = Array.isArray(targetRule.in) 
    ? targetRule.in.flatMap(type => 
        expandRuleType(type, { ...context, sourceNodeId: sourceNode.id, targetNodeId: targetNode.id })
      )
    : [];
    
  // If the target rule has a complex 'in' rule (for TOOL_CALL), handle it specially
  if (!Array.isArray(targetRule.in) && typeof targetRule.in === 'object') {
    const inRule = targetRule.in as { autogen: string[], langgraph: string[] };
    const ruleForRuntime = inRule[runtimeType];
    const expandedIncoming = ruleForRuntime.flatMap(type => 
      expandRuleType(type, { ...context, sourceNodeId: sourceNode.id, targetNodeId: targetNode.id })
    );
    
    if (!expandedIncoming.includes(operatorTypeToRuleKey[sourceOperatorType])) {
      return { 
        isValid: false, 
        message: `Connection to ${targetOperatorType} from ${sourceOperatorType} is not allowed in ${runtimeType} mode. Allowed sources are: ${expandedIncoming.join(', ')}` 
      };
    }
  } else if (!allowedIncoming.includes(operatorTypeToRuleKey[sourceOperatorType])) {
    return { 
      isValid: false, 
      message: `Connection to ${targetOperatorType} from ${sourceOperatorType} is not allowed. Allowed sources are: ${allowedIncoming.join(', ')}` 
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
  runtimeType: RuntimeType = 'langgraph'
): { isValid: boolean, errors: string[] } => {
  const errors: string[] = [];
  const context = { nodes, edges };
  
  // 1. Check global invariants
  
  // 1.1 Exactly one START node
  const startNodes = nodes.filter(node => 
    node.type === 'operator' && node.operatorType === OperatorType.Start
  );
  
  if (startNodes.length === 0) {
    errors.push('Workflow must have exactly one START node');
  } else if (startNodes.length > 1) {
    errors.push(`Workflow has ${startNodes.length} START nodes, but must have exactly one`);
  }
  
  // 1.2 At least one END node
  const endNodes = nodes.filter(node => 
    node.type === 'operator' && node.operatorType === OperatorType.Stop
  );
  
  if (endNodes.length === 0) {
    errors.push('Workflow must have at least one END node');
  }
  
  // 1.3 START has no incoming edges
  if (startNodes.length > 0) {
    const startNodeIds = startNodes.map(node => node.id);
    const startNodeIncomingEdges = edges.filter(edge => 
      startNodeIds.includes(edge.target)
    );
    
    if (startNodeIncomingEdges.length > 0) {
      errors.push('START node cannot have incoming edges');
    }
  }
  
  // 1.4 END has no outgoing edges
  if (endNodes.length > 0) {
    const endNodeIds = endNodes.map(node => node.id);
    const endNodeOutgoingEdges = edges.filter(edge => 
      endNodeIds.includes(edge.source)
    );
    
    if (endNodeOutgoingEdges.length > 0) {
      errors.push('END node cannot have outgoing edges');
    }
  }
  
  // 1.5 Check DECISION nodes have at least two outgoing edges
  const decisionNodes = nodes.filter(node => 
    node.type === 'operator' && node.operatorType === OperatorType.Decision
  );
  
  decisionNodes.forEach(decisionNode => {
    const outgoingEdges = edges.filter(edge => edge.source === decisionNode.id);
    if (outgoingEdges.length < 2) {
      errors.push(`DECISION node '${decisionNode.name}' must have at least two outgoing edges`);
    }
  });
  
  // 1.6 Check PARALLEL_FORK nodes have matching PARALLEL_JOIN nodes
  const forkNodes = nodes.filter(node => 
    node.type === 'operator' && node.operatorType === OperatorType.ParallelFork
  );
  
  const joinNodes = nodes.filter(node => 
    node.type === 'operator' && node.operatorType === OperatorType.ParallelJoin
  );
  
  // This is a simplified check - a more thorough check would trace paths
  if (forkNodes.length > joinNodes.length) {
    errors.push(`Workflow has ${forkNodes.length} PARALLEL_FORK nodes but only ${joinNodes.length} PARALLEL_JOIN nodes`);
  }
  
  // 1.7 Check Autogen-specific rule: TOOL_CALL must only be reached from AGENT_CALL
  if (runtimeType === 'autogen') {
    const toolCallNodes = nodes.filter(node => 
      node.type === 'operator' && node.operatorType === OperatorType.ToolCall
    );
    
    toolCallNodes.forEach(toolCallNode => {
      const incomingEdges = edges.filter(edge => edge.target === toolCallNode.id);
      
      incomingEdges.forEach(edge => {
        const sourceNode = nodes.find(node => node.id === edge.source);
        if (sourceNode && 
            (sourceNode.type !== 'operator' || 
             sourceNode.operatorType !== OperatorType.AgentCall)) {
          errors.push(`In Autogen mode, TOOL_CALL node '${toolCallNode.name}' can only be reached from AGENT_CALL nodes`);
        }
      });
    });
  }
  
  // 2. Check individual connections
  edges.forEach(edge => {
    const sourceNode = nodes.find(node => node.id === edge.source);
    const targetNode = nodes.find(node => node.id === edge.target);
    
    if (sourceNode && targetNode) {
      const validationResult = validateConnection(sourceNode, targetNode, runtimeType, context);
      
      if (!validationResult.isValid && validationResult.message) {
        errors.push(validationResult.message);
      }
    }
  });
  
  // 3. Check for cycles (except through DECISION or LOOP nodes)
  // This would require a more complex graph traversal algorithm
  // For now, we'll skip this check
  
  return {
    isValid: errors.length === 0,
    errors
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
  // Don't allow self-connections
  if (sourceNode.id === targetNode.id) {
    return { canConnect: false, message: 'Cannot connect a node to itself' };
  }
  
  // Don't allow duplicate connections
  const existingEdge = edges.find(edge => 
    edge.source === sourceNode.id && edge.target === targetNode.id
  );
  
  if (existingEdge) {
    return { canConnect: false, message: 'Connection already exists' };
  }
  
  // Check if the connection is valid according to the rules
  const validationResult = validateConnection(sourceNode, targetNode, runtimeType, { nodes, edges });
  
  return {
    canConnect: validationResult.isValid,
    message: validationResult.message
  };
};
