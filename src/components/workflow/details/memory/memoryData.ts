/**
 * Memory types data for the Memory node
 */

export interface MemoryTypeOption {
  value: string;
  label: string;
  description: string;
  source?: string;
}

export const MEMORY_TYPES: MemoryTypeOption[] = [
  {
    value: 'conversation-buffer',
    label: 'Conversation Buffer / Short-Term Working Memory',
    description: 'Stores the raw dialogue or tool calls of the current session verbatim; useful for chat agents that need full context but can tolerate token growth.',
    source: 'Medium'
  },
  {
    value: 'sliding-window',
    label: 'Sliding-Window (Buffer Window) Memory',
    description: 'Maintains a fixed-size window of the most recent interactions, discarding older messages when the window is full; good for long-running agents with limited context.',
    source: 'LangChain Docs'
  },
  {
    value: 'summary',
    label: 'Summary Memory',
    description: 'Periodically condenses chat history into a summary to preserve key information while reducing token usage; ideal for extended conversations.',
    source: 'LangChain Docs'
  },
  {
    value: 'summary-buffer-hybrid',
    label: 'Summary-Buffer Hybrid',
    description: 'Combines a running summary with recent messages for both efficiency and detailed context; balances token usage with conversational coherence.',
    source: 'LangChain Docs'
  },
  {
    value: 'entity-knowledge-graph',
    label: 'Entity / Knowledge-Graph Memory',
    description: 'Extracts and organizes entities and relationships from conversations into a structured graph; useful for complex domains with many interrelated concepts.',
    source: 'GitHub'
  },
  {
    value: 'vector-store',
    label: 'Vector-Store (Retriever) Memory',
    description: 'Embeds and stores conversation chunks for semantic retrieval; enables agents to recall information based on relevance rather than recency.',
    source: 'LlamaIndex'
  },
  {
    value: 'key-value',
    label: 'Key-Value Store Memory',
    description: 'Simple key-value storage for explicit facts or variables; good for tracking specific pieces of information across a conversation.',
    source: 'LangChain Docs'
  },
  {
    value: 'custom',
    label: 'Custom Memory',
    description: 'Build your own memory implementation with custom storage, retrieval, and processing logic; for specialized use cases not covered by standard memory types.',
    source: 'Custom'
  }
];
