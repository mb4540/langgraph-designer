/**
 * Constants for LLM models used in the application
 */

// List of available LLM models
export const LLM_MODELS = [
  { value: 'gpt-4o', label: 'OpenAI GPT-4o' },
  { value: 'claude-3-7-sonnet', label: 'Anthropic Claude 3.7 Sonnet' },
  { value: 'gemini-2-5-pro', label: 'Google DeepMind Gemini 2.5 Pro' },
  { value: 'llama-3-70b', label: 'Meta Llama 3-70B' },
  { value: 'mistral-large', label: 'Mistral Large' },
  { value: 'grok-3', label: 'xAI Grok 3' },
  { value: 'deepseek-coder-v2', label: 'DeepSeek-Coder V2' },
  { value: 'cohere-command-r', label: 'Cohere Command-R' },
  { value: 'phi-3', label: 'Microsoft Phi-3' },
  { value: 'jurassic-2-ultra', label: 'AI21 Labs Jurassic-2 Ultra' },
  { value: 'pangu-2', label: 'Huawei PanGu 2.0' },
  { value: 'ernie-4', label: 'Baidu ERNIE 4.0' },
];

// Simplified list for agent nodes
export const AGENT_MODELS = [
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
  { value: 'gpt-4o', label: 'GPT-4o' },
];

// Map of model IDs to display names
export const MODEL_DISPLAY_NAMES: Record<string, string> = {
  'gpt-4o': 'OpenAI GPT-4o',
  'gpt-4o-mini': 'GPT-4o Mini',
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
