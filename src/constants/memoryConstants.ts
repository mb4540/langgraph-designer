/**
 * Constants for memory types used in the application
 */

// Memory types with descriptions and sources
export const MEMORY_TYPES = [
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
    value: 'episodic',
    label: 'Episodic Memory',
    description: 'Organizes memory into discrete episodes or sessions; helps agents maintain separate contexts for different interaction periods.',
    source: 'arXiv'
  },
  {
    value: 'long-term-profile',
    label: 'Long-Term Profile / Preference Memory',
    description: 'Maintains persistent information about user preferences, traits, and history across sessions; enables personalized interactions.',
    source: 'Microsoft Research'
  },
  {
    value: 'scratch-pad',
    label: 'Scratch-pad / Planning Memory',
    description: 'Provides workspace for intermediate calculations, reasoning steps, or plans; supports complex problem-solving and multi-step tasks.',
    source: 'DeepMind'
  },
  {
    value: 'tool-result-cache',
    label: 'Tool-Result Cache Memory',
    description: 'Caches results from expensive tool calls to avoid redundant operations; improves efficiency for repeated information needs.',
    source: 'GitHub'
  },
  {
    value: 'read-only-shared',
    label: 'Read-Only Shared Knowledge Memory',
    description: 'Provides access to a common knowledge base shared across multiple agents; ensures consistent information across a multi-agent system.',
    source: 'Anthropic'
  },
  {
    value: 'combined-layered',
    label: 'Combined / Layered Memory Controllers',
    description: 'Orchestrates multiple memory types in layers for different purposes; creates sophisticated memory architectures for complex agents.',
    source: 'LangChain Docs'
  },
];

// Map of memory types to display names
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
