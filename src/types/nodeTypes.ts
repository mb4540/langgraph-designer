/**
 * Type definitions for nodes in the workflow graph
 */

/**
 * Enum for node types in the workflow
 */
export type NodeType = 'agent' | 'tool' | 'memory' | 'operator';

/**
 * Enum for operator types
 */
export enum OperatorType {
  Start = "START",
  Stop = "STOP",
  Sequential = "SEQUENCE",
  ToolCall = "TOOL_CALL",
  AgentCall = "AGENT_CALL",
  MemoryRead = "MEMORY_READ",
  MemoryWrite = "MEMORY_WRITE",
  Decision = "DECISION",
  ParallelFork = "PARALLEL_FORK",
  ParallelJoin = "PARALLEL_JOIN",
  Loop = "LOOP",
  ErrorRetry = "ERROR_RETRY",
  Timeout = "TIMEOUT",
  HumanPause = "HUMAN_PAUSE",
  SubGraph = "SUB_GRAPH"
}

/**
 * Enum for Start operator trigger types
 */
export type TriggerType = 'human' | 'system' | 'event' | 'multi';

/**
 * Enum for event source types
 */
export type EventSourceType = 'webhook' | 'mq' | 'cron';

/**
 * Interface for START operator configuration
 */
export interface StartOperatorConfig {
  trigger_type: TriggerType;
  resume_capable?: boolean; // default false
  event_source?: EventSourceType; // valid when trigger_type == "event"
  event_topic?: string; // path, topic or cron spec
  initial_messages?: ChatMessage[]; // [A] seed Autogen chat
  wait_for_all_start_nodes?: boolean; // [L] only in multi-start mode
}

/**
 * Interface for END operator configuration
 */
export interface EndOperatorConfig {
  status_code?: string; // "success" | "error" | string
  emit_transcript?: boolean; // default true
  on_terminate_hook?: string; // [L] post-run callback
}

/**
 * Interface for AGENT_CALL operator configuration
 */
export interface AgentCallOperatorConfig {
  agent_type: string; // "AssistantAgent" | "UserProxyAgent" | "Custom" [A] | "OpenAI" | "Anthropic" | "Callable" [L]
  llm_model: string;
  prompt_template: string;
  temperature?: number; // default 0.7
  max_tokens?: number;
  tools_allowed?: string[]; // [A]
  streaming?: boolean;
  memory_scope?: "graph" | "agent" | "none";
  stop_sequences?: string[];
  retry_policy?: { max_attempts: number; backoff_sec?: number };
  concurrency?: "sequential" | "parallel"; // [L] compile-time
  cost_budget?: number; // USD
}

/**
 * Interface for TOOL_CALL operator configuration
 */
export interface ToolCallOperatorConfig {
  tool_name: string;
  function_signature: any; // JSONSchema | string
  return_schema?: any; // JSONSchema
  binding_agent?: string; // required in Autogen
  timeout_sec?: number;
  retry_policy?: { max_attempts: number; backoff_sec?: number };
  side_effect?: boolean; // true ⇢ marks workflow dirty
}

/**
 * Interface for MEMORY_READ operator configuration
 */
export interface MemoryReadOperatorConfig {
  store: "zep" | "redis" | "vector" | "custom";
  query: string;
  top_k?: number; // default 5
  namespace?: string;
  write_back_key?: string; // where to save results in state
  as_of?: string; // ISODateString
}

/**
 * Interface for MEMORY_WRITE operator configuration
 */
export interface MemoryWriteOperatorConfig {
  store: "zep" | "redis" | "vector" | "custom";
  data_path: string; // path in runtime state to persist
  namespace?: string;
  ttl_sec?: number;
  upsert?: boolean; // default true
}

/**
 * Interface for DECISION operator configuration
 */
export interface DecisionOperatorConfig {
  predicate_language: "javascript" | "python" | "jmespath";
  expression: string; // must eval to truthy / label
  confidence_threshold?: number; // [A] auto-route cut-off
  branches: { label: string; target: string }[];
  default_branch?: string;
  watch_keys?: string[]; // state keys to observe
}

/**
 * Interface for PARALLEL_FORK operator configuration
 */
export interface ParallelForkOperatorConfig {
  strategy?: "fanout" | "map" | "scatter-gather"; // default fanout
  max_concurrency?: number; // node-level throttle
  fork_inputs?: string[] | Record<string, string>; // per-branch payload
  gather_mode?: "wait_all" | "first_success" | "time_box";
  per_branch_timeout_sec?: number;
}

/**
 * Interface for PARALLEL_JOIN operator configuration
 */
export interface ParallelJoinOperatorConfig {
  merge_strategy?: "concat" | "merge" | "reduce";
  reduce_func?: string; // when strategy == reduce
  timeout_sec?: number;
  allow_partial?: boolean; // default false, emit even if some branches fail
}

/**
 * Interface for LOOP operator configuration
 */
export interface LoopOperatorConfig {
  condition_expression: string; // evaluated each turn
  max_iterations?: number; // default 10
  loop_delay_sec?: number;
  break_on_failure?: boolean; // default true
}

/**
 * Interface for ERROR_RETRY operator configuration
 */
export interface ErrorRetryOperatorConfig {
  max_attempts: number;
  backoff_strategy?: "fixed" | "exponential" | "jitter";
  retryable_errors?: string[];
  on_failure_node?: string; // fallback / dead-letter
}

/**
 * Interface for TIMEOUT operator configuration
 */
export interface TimeoutOperatorConfig {
  timeout_sec: number;
  on_timeout?: "retry" | "abort" | "fallback_node";
  fallback_node?: string;
}

/**
 * Interface for HUMAN_PAUSE operator configuration
 */
export interface HumanPauseOperatorConfig {
  message_to_user: string;
  expected_response_schema?: any; // JSONSchema
  timeout_sec?: number; // auto-escalate after
  escalate_node?: string; // where to go on timeout
  next_node_on_response?: string; // default resume target
  channel?: "web" | "slack" | "email";
}

/**
 * Interface for SUB_GRAPH operator configuration
 */
export interface SubGraphOperatorConfig {
  graph_id: string; // reference to saved graph
  input_mapping?: Record<string, string>; // parent_state → sub_input
  output_mapping?: Record<string, string>; // sub_output → parent_state
  mode?: "inline" | "async"; // default inline
  isolate_memory?: boolean; // default false, local state sandbox
}

/**
 * Interface for chat message
 */
export interface ChatMessage {
  role: string;
  content: string;
}

/**
 * Interface for agent setting
 */
export interface AgentSetting {
  key: string;
  dataType: string;
  defaultValue: string;
  description: string;
  allowedValues: string[];
  isRequired: boolean;
  isSecret: boolean;
  isRuntimeConfig: boolean;
}

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
  operatorType?: OperatorType; // Only for operator nodes
  triggerType?: TriggerType; // Only for START operator nodes
  resumeCapable?: boolean; // Only for START operator nodes
  parentId?: string; // Reference to the parent node (if created from a diamond connector)
  sourceHandle?: string; // The handle ID from which this node was created
  
  // Operator configuration
  operatorConfig?: StartOperatorConfig | EndOperatorConfig | AgentCallOperatorConfig | 
    ToolCallOperatorConfig | MemoryReadOperatorConfig | MemoryWriteOperatorConfig |
    DecisionOperatorConfig | ParallelForkOperatorConfig | ParallelJoinOperatorConfig |
    LoopOperatorConfig | ErrorRetryOperatorConfig | TimeoutOperatorConfig |
    HumanPauseOperatorConfig | SubGraphOperatorConfig;
  
  // Version control fields
  version?: string; // Semantic version (MAJOR.MINOR.PATCH)
  versionedId?: string; // Generated ULID for this version
  createdAt?: string; // ISO timestamp when this version was created
  
  // Additional fields for agent details
  workgroup?: string; // Work-group the agent belongs to
  icon?: string; // Icon identifier for the agent
  agentType?: string; // Type of agent (e.g., 'assistant')
  description?: string; // Description of the agent
  enableMarkdown?: boolean; // Whether to enable markdown response format
  credentialsSource?: string; // Source of LLM credentials
  maxConsecutiveReplies?: number; // Maximum number of consecutive auto replies
  settings?: AgentSetting[]; // Agent configuration settings
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
