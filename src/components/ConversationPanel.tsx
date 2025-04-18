import React, { useState, useRef, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { Message } from '../api/openai';
import { useWorkflowStore, NodeType } from '../store/workflowStore';

const initialInterview = [
  'Welcome to LangGraph Designer! What workflow are you trying to build?',
  'What agents do you envision in this workflow? (e.g., Data Collector, Summarizer, Notifier)',
  'What tools or actions should each agent have?',
  'How do you want the agents to interact or pass information?',
  'Would you like to start building this workflow visually now?'
];

const ConversationPanel: React.FC = () => {
  const { addNode, addEdge } = useWorkflowStore();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: initialInterview[0] }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [apiKeyValid, setApiKeyValid] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check if API key is valid
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const { openAIChat } = await import('../api/openai');
        await openAIChat([{ role: 'user', content: 'Test message' }]);
        setApiKeyValid(true);
      } catch (err) {
        console.error('API key validation error:', err);
        setApiKeyValid(false);
      }
    };
    checkApiKey();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      let reply: Message;
      if (step < initialInterview.length - 1) {
        reply = { role: 'assistant', content: initialInterview[step + 1] };
      } else {
        // Process the conversation to extract workflow information
        if (step === initialInterview.length - 1) {
          // This is the response to the last interview question
          // If user wants to build visually, we can suggest they use the middle panel
          if (input.toLowerCase().includes('yes') || input.toLowerCase().includes('sure')) {
            reply = { 
              role: 'assistant', 
              content: 'Great! You can now use the middle panel to visualize and edit your workflow. ' +
                      'Double-click on any agent or tool to edit its details in the right panel. ' +
                      'You can also continue our conversation here if you need help or want to make changes.'
            };
          } else {
            reply = { 
              role: 'assistant', 
              content: 'No problem. Let\'s continue discussing your workflow here. ' +
                      'What specific aspects would you like to focus on?'
            };
          }
        } else {
          // For all other conversations, use OpenAI
          const { openAIChat } = await import('../api/openai');
          reply = await openAIChat(newMessages);

          // Check for agent or tool creation commands
          processCommandsInMessage(reply.content);
        }
      }
      setMessages([...newMessages, reply]);
      setStep(step + 1);
    } catch (err: any) {
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: 'Error contacting OpenAI. Please check your API key and network connection.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Process commands like "create agent" or "add tool" in the AI's response
  const processCommandsInMessage = (content: string) => {
    // Check for agent creation
    const agentRegex = /create\s+agent\s+["']?([\w\s]+)["']?/i;
    const agentMatch = content.match(agentRegex);
    if (agentMatch && agentMatch[1]) {
      const agentName = agentMatch[1].trim();
      createNewNode('agent', agentName);
    }

    // Check for tool creation
    const toolRegex = /create\s+tool\s+["']?([\w\s]+)["']?/i;
    const toolMatch = content.match(toolRegex);
    if (toolMatch && toolMatch[1]) {
      const toolName = toolMatch[1].trim();
      createNewNode('tool', toolName);
    }

    // Check for connection creation
    const connectRegex = /connect\s+["']?([\w\s]+)["']?\s+to\s+["']?([\w\s]+)["']?/i;
    const connectMatch = content.match(connectRegex);
    if (connectMatch && connectMatch[1] && connectMatch[2]) {
      // This is simplified; in a real app, you'd need to find the actual node IDs
      // based on names and ensure they exist
      console.log(`Connect ${connectMatch[1]} to ${connectMatch[2]}`);
    }
  };

  // Create a new node in the workflow
  const createNewNode = (type: NodeType, name: string) => {
    const id = `node-${Date.now()}`;
    const position = { 
      x: 200 + Math.random() * 200, 
      y: 100 + Math.random() * 200 
    };
    
    const content = type === 'agent' 
      ? `This ${name} agent is responsible for processing data.`
      : `function ${name.replace(/\s+/g, '')}(input) {\n  // Tool implementation\n  return input;\n}`;
    
    addNode({
      id,
      type,
      name,
      content,
      position,
      ...(type === 'agent' ? { llmModel: 'gpt-4o-mini' } : {})
    });
  };

  return (
    <Paper elevation={3} sx={{ height: '100%', padding: 2, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Conversation
        </Typography>
        {apiKeyValid !== null && (
          <Chip 
            label={apiKeyValid ? "API Key Valid" : "API Key Invalid"} 
            color={apiKeyValid ? "success" : "error"} 
            size="small" 
          />
        )}
      </Box>
      
      <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
        {messages.map((msg, idx) => (
          <Box 
            key={idx} 
            sx={{ 
              mb: 1, 
              p: 1.5,
              borderRadius: 2,
              maxWidth: '85%',
              backgroundColor: msg.role === 'user' ? 'primary.light' : 'background.paper',
              color: msg.role === 'user' ? 'white' : 'text.primary',
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              boxShadow: 1,
              ml: msg.role === 'user' ? 'auto' : 0,
            }}
          >
            <Typography variant="body2">
              {msg.content}
            </Typography>
          </Box>
        ))}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={20} />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          disabled={loading}
        />
        <Button 
          variant="contained" 
          onClick={handleSend} 
          disabled={loading || !input.trim()}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default ConversationPanel;
