// Utility for calling OpenAI API using fetch and .env API key
export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export async function openAIChat(messages: Message[], signal?: AbortSignal): Promise<Message> {
  // Vite: import.meta.env.VITE_OPENAI_API_KEY, CRA: process.env.REACT_APP_OPENAI_API_KEY
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY || (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_OPENAI_API_KEY);
  if (!apiKey) throw new Error('Missing OpenAI API Key');
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages,
      max_tokens: 512,
      temperature: 0.7,
    }),
    signal,
  });
  if (!response.ok) throw new Error(`OpenAI API Error: ${response.status}`);
  const data = await response.json();
  return { role: 'assistant', content: data.choices[0]?.message?.content || '' };
}
