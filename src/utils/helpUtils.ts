/**
 * Help Utilities
 * 
 * This module provides utilities for adding inline help and tooltips throughout the application.
 * It includes predefined help text for various components and a mechanism for displaying tooltips.
 */

// Interface for help content
export interface HelpContent {
  title: string;
  description: string;
  learnMoreLink?: string;
}

// Interface for component help mapping
export interface ComponentHelp {
  [key: string]: HelpContent;
}

/**
 * Help content for workflow components
 */
export const workflowHelp: ComponentHelp = {
  workflowGraph: {
    title: 'Workflow Graph',
    description: 'The workflow graph is the visual representation of your agent system. Add agents, tools, memory components, and operators to build your workflow.',
    learnMoreLink: '/docs/USER_GUIDE.md#creating-workflows'
  },
  workflowDetails: {
    title: 'Workflow Details',
    description: 'Configure the name, description, and version of your workflow. The JSON representation shows the underlying data structure.',
    learnMoreLink: '/docs/USER_GUIDE.md#saving-and-versioning'
  },
  conversationPanel: {
    title: 'Conversation Panel',
    description: 'Test your agent workflow by sending messages and viewing the conversation history. Use this panel to debug and refine your agents.',
    learnMoreLink: '/docs/USER_GUIDE.md#interface-overview'
  }
};

/**
 * Help content for agent components
 */
export const agentHelp: ComponentHelp = {
  agentNode: {
    title: 'Agent Node',
    description: 'An agent node represents an AI agent in your workflow. Connect it to tools, memory, and other agents to build complex systems.',
    learnMoreLink: '/docs/USER_GUIDE.md#working-with-agents'
  },
  agentName: {
    title: 'Agent Name',
    description: 'A unique identifier for your agent. Choose a descriptive name that reflects the agent\'s purpose.',
  },
  agentType: {
    title: 'Agent Type',
    description: 'The type of agent determines its capabilities and behavior. Different agent types are optimized for different tasks.',
    learnMoreLink: '/docs/USER_GUIDE.md#agent-types'
  },
  agentDescription: {
    title: 'Agent Description',
    description: 'A brief description of the agent\'s purpose and capabilities. This helps document your workflow.',
  },
  agentId: {
    title: 'Agent ID',
    description: 'A unique identifier for this agent. This ID is used internally and in the generated code.',
  },
  agentVersion: {
    title: 'Agent Version',
    description: 'The semantic version (MAJOR.MINOR.PATCH) of this agent. Update this when making changes to track versions.',
  },
  agentIcon: {
    title: 'Agent Icon',
    description: 'Select an icon that visually represents your agent\'s purpose or capabilities.',
  },
  agentPrompt: {
    title: 'Agent Prompt',
    description: 'The system prompt that defines the agent\'s behavior, knowledge, and constraints. This is the core instruction set for the agent.',
    learnMoreLink: '/docs/USER_GUIDE.md#configuring-agents'
  },
  llmModel: {
    title: 'LLM Model',
    description: 'The large language model that powers this agent. Different models have different capabilities and pricing.',
  },
  credentialsSource: {
    title: 'Credentials Source',
    description: 'Choose whether to use the workgroup\'s default credentials or custom credentials for this agent.',
  },
  maxConsecutiveReplies: {
    title: 'Max Consecutive Replies',
    description: 'The maximum number of times the agent can respond without user input. Limits potential runaway processes.',
  },
};

/**
 * Help content for tool components
 */
export const toolHelp: ComponentHelp = {
  toolNode: {
    title: 'Tool Node',
    description: 'A tool node represents an external capability that an agent can use, such as web browsing, calculation, or database access.',
    learnMoreLink: '/docs/USER_GUIDE.md#working-with-tools'
  },
  toolType: {
    title: 'Tool Type',
    description: 'The type of tool determines its capabilities. Select from pre-built tools or create custom tools.',
    learnMoreLink: '/docs/USER_GUIDE.md#available-tools'
  },
  toolCode: {
    title: 'Tool Code',
    description: 'The MCP (Message Calling Protocol) code that implements this tool. You can customize this code to modify the tool\'s behavior.',
    learnMoreLink: '/docs/USER_GUIDE.md#customizing-tool-code'
  },
  browserTool: {
    title: 'Stagehand Browser Tool',
    description: 'Enables agents to navigate websites, click elements, fill forms, and extract information from web pages.',
  },
  retrieverTool: {
    title: 'Vector-Store Retriever Tool',
    description: 'Allows agents to search and retrieve information from vector databases, enabling RAG (Retrieval Augmented Generation).',
  },
  calculatorTool: {
    title: 'Calculator / Math Tool',
    description: 'Provides mathematical computation capabilities, including arithmetic, algebra, and symbolic math using SymPy.',
  },
  sqlTool: {
    title: 'Multi-Database SQL Tool',
    description: 'Enables agents to query and manipulate data in various database systems using SQL.',
  },
  emailTool: {
    title: 'Email (IMAP/SMTP) Tool',
    description: 'Allows agents to read, send, and process emails using IMAP and SMTP protocols.',
  },
  azureTool: {
    title: 'Azure Functions Tool',
    description: 'Integrates with Azure Functions to execute serverless code and access Azure services.',
  },
};

/**
 * Help content for memory components
 */
export const memoryHelp: ComponentHelp = {
  memoryNode: {
    title: 'Memory Node',
    description: 'A memory node represents a storage system that helps agents maintain context and recall information across interactions.',
    learnMoreLink: '/docs/USER_GUIDE.md#working-with-memory'
  },
  memoryType: {
    title: 'Memory Type',
    description: 'The type of memory determines how information is stored, retrieved, and processed. Different types are suited for different use cases.',
    learnMoreLink: '/docs/USER_GUIDE.md#memory-types'
  },
  conversationBuffer: {
    title: 'Conversation Buffer Memory',
    description: 'Stores the full conversation history as a simple buffer. Good for short-term context in conversations.',
  },
  slidingWindow: {
    title: 'Sliding-Window Memory',
    description: 'Maintains a fixed-size window of recent messages, discarding older ones to prevent context overflow.',
  },
  summaryMemory: {
    title: 'Summary Memory',
    description: 'Creates and maintains a summary of the conversation, allowing for longer-term context without token limitations.',
  },
  entityMemory: {
    title: 'Entity / Knowledge-Graph Memory',
    description: 'Extracts and stores information about entities in a structured format, building a knowledge graph over time.',
  },
  vectorStoreMemory: {
    title: 'Vector-Store Memory',
    description: 'Stores embeddings of messages for semantic retrieval, allowing agents to find relevant past information.',
  },
};

/**
 * Help content for operator components
 */
export const operatorHelp: ComponentHelp = {
  operatorNode: {
    title: 'Operator Node',
    description: 'An operator node represents a control flow element in your workflow, such as conditionals, loops, or parallel execution.',
  },
  startOperator: {
    title: 'START Operator',
    description: 'Defines the entry point of a workflow or subgraph.',
  },
  stopOperator: {
    title: 'STOP Operator',
    description: 'Defines an exit point of a workflow or subgraph.',
  },
  sequenceOperator: {
    title: 'SEQUENCE Operator',
    description: 'Executes a series of steps in order.',
  },
  decisionOperator: {
    title: 'DECISION Operator',
    description: 'Creates a branch in the workflow based on a condition.',
  },
  parallelForkOperator: {
    title: 'PARALLEL_FORK Operator',
    description: 'Splits the workflow into multiple parallel branches.',
  },
  parallelJoinOperator: {
    title: 'PARALLEL_JOIN Operator',
    description: 'Merges multiple parallel branches back into a single flow.',
  },
  loopOperator: {
    title: 'LOOP Operator',
    description: 'Repeats a section of the workflow until a condition is met.',
  },
  errorRetryOperator: {
    title: 'ERROR_RETRY Operator',
    description: 'Attempts to retry a failed operation with backoff.',
  },
  timeoutOperator: {
    title: 'TIMEOUT Operator',
    description: 'Sets a time limit for a section of the workflow.',
  },
  humanPauseOperator: {
    title: 'HUMAN_PAUSE Operator',
    description: 'Pauses the workflow for human review or input.',
  },
};

/**
 * Help content for work group management
 */
export const workGroupHelp: ComponentHelp = {
  workGroupTable: {
    title: 'Work Group Table',
    description: 'Lists all available work groups with filtering and search capabilities.',
    learnMoreLink: '/docs/USER_GUIDE.md#work-group-management'
  },
  createWorkGroup: {
    title: 'Create Work Group',
    description: 'Create a new work group with a name, scope, and description.',
    learnMoreLink: '/docs/USER_GUIDE.md#creating-work-groups'
  },
  workGroupDetails: {
    title: 'Work Group Details',
    description: 'View and edit work group information, including name, scope, owner, and description.',
  },
  workGroupUsers: {
    title: 'Work Group Users',
    description: 'Manage users within a work group, including adding users and tracking validation status.',
    learnMoreLink: '/docs/USER_GUIDE.md#managing-users'
  },
  addUser: {
    title: 'Add User',
    description: 'Add a user to the work group with specific access levels and permissions.',
  },
  idType: {
    title: 'ID Type',
    description: 'Choose between ATT ID for internal users or Client ID for external users.',
  },
  accessLevel: {
    title: 'Access Level',
    description: 'Set the user\'s access level: Admin for full control, or Partial Access for limited permissions.',
  },
  entityRole: {
    title: 'Entity-Role Pairs',
    description: 'Define which entities (Skills, Teams, Agents, Workflows) the user can access and what role (Read, Write) they have.',
  },
  validationStatus: {
    title: 'Validation Status',
    description: 'Shows the remaining days until user validation expires. Users must be revalidated periodically for security compliance.',
    learnMoreLink: '/docs/USER_GUIDE.md#validation-system'
  },
  requestAccess: {
    title: 'Request Access',
    description: 'Request access to a work group you don\'t currently have access to.',
    learnMoreLink: '/docs/USER_GUIDE.md#access-requests'
  },
};

/**
 * Get help content for a specific component
 * @param category The category of the component
 * @param key The key of the component within the category
 * @returns The help content for the component, or undefined if not found
 */
export const getHelpContent = (category: string, key: string): HelpContent | undefined => {
  switch (category) {
    case 'workflow':
      return workflowHelp[key];
    case 'agent':
      return agentHelp[key];
    case 'tool':
      return toolHelp[key];
    case 'memory':
      return memoryHelp[key];
    case 'operator':
      return operatorHelp[key];
    case 'workGroup':
      return workGroupHelp[key];
    default:
      return undefined;
  }
};
