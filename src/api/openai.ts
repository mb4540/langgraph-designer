// Utility for calling OpenAI API using fetch and .env API key
export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export async function openAIChat(
  messages: Message[], 
  signal?: AbortSignal, 
  customApiKey?: string
): Promise<Message> {
  // Check for API key in different environment variable formats or use the provided custom key
  const apiKey = customApiKey || 
                process.env.OPENAI_API_KEY || 
                process.env.REACT_APP_OPENAI_API_KEY || 
                (typeof import.meta !== 'undefined' && (import.meta as any).env && 
                ((import.meta as any).env.VITE_OPENAI_API_KEY || (import.meta as any).env.OPENAI_API_KEY));
                
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
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
  }
  
  const data = await response.json();
  return { role: 'assistant', content: data.choices[0]?.message?.content || '' };
}
