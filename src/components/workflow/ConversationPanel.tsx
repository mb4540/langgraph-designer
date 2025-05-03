import React, { useState, useRef, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Message } from '../../api/openai';
import { NodeType } from '../../types/nodeTypes';
import { useWorkflowContext } from '../../context/WorkflowContext';
import LoadingIndicator from '../ui/LoadingIndicator';
import ErrorMessage from '../ui/ErrorMessage';
import TextField from '../ui/TextField';
import Button from '../ui/Button';
import Dialog from '../ui/Dialog';

const initialInterview = [
  'Welcome to Workflow Designer! What workflow are you trying to build?',
  'What agents do you envision in this workflow? (e.g., Data Collector, Summarizer, Notifier)',
  'What tools or actions should each agent have?',
  'How do you want the agents to interact or pass information?',
  'Would you like to start building this workflow visually now?'
];

// Local storage key for the API key
const API_KEY_STORAGE_KEY = 'openai_api_key';

const ConversationPanel: React.FC = () => {
  const { addNode, addEdge } = useWorkflowContext();
  const [activeTab, setActiveTab] = useState<'build' | 'test'>('build');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: initialInterview[0] }
  ]);
  const [testMessages, setTestMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Welcome to the Test Workflow mode. Here you can test your workflow and see the interactions between agents and tools.' }
  ]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // API key state
  const [apiKey, setApiKey] = useState<string>(() => {
    // Initialize from localStorage if available
    return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
  });
  const [showApiKeyDialog, setShowApiKeyDialog] = useState<boolean>(!apiKey);
  const [showApiKeyStatus, setShowApiKeyStatus] = useState<boolean>(false);
  const [apiKeyValidationState, setApiKeyValidationState] = useState<'idle' | 'loading' | 'valid' | 'invalid'>('idle');
  
  // Save API key to localStorage when it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    }
  }, [apiKey]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, testMessages, activeTab]);

  // Manual API key validation function
  const validateApiKey = async () => {
    if (!apiKey) {
      setApiKeyValidationState('invalid');
      return false;
    }
    
    try {
      setApiKeyValidationState('loading');
      const { openAIChat } = await import('../../api/openai');
      // Override the environment API key with our stored one
      await openAIChat([{ role: 'user', content: 'Test message' }], undefined, apiKey);
      setApiKeyValidationState('valid');
      
      // Hide the status after 2 seconds on success
      setTimeout(() => {
        setShowApiKeyStatus(false);
        setApiKeyValidationState('idle');
      }, 2000);
      
      return true;
    } catch (error) {
      setApiKeyValidationState('invalid');
      return false;
    }
  };

  // Handle sending messages
  const { 
    loading: sendLoading, 
    error: sendError, 
    execute: executeSend,
    reset: resetSendError
  } = useAsyncOperation<Message>(async (newMessages: Message[]) => {
    if (step < initialInterview.length - 1) {
      return { role: 'assistant', content: initialInterview[step + 1] };
    } else {
      // Process the conversation to extract workflow information
      if (step === initialInterview.length - 1) {
        // This is the response to the last interview question
        // If user wants to build visually, we can suggest they use the middle panel
        if (input.toLowerCase().includes('yes') || input.toLowerCase().includes('sure')) {
          return { 
            role: 'assistant', 
            content: 'Great! You can now use the middle panel to visualize and edit your workflow. ' +
                    'Double-click on any agent or tool to edit its details in the right panel. ' +
                    'You can also continue our conversation here if you need help or want to make changes.'
          };
        } else {
          return { 
            role: 'assistant', 
            content: 'No problem. Let\'s continue discussing your workflow here. ' +
                    'What specific aspects would you like to focus on?'
          };
        }
      } else {
        // For all other conversations, use OpenAI
        const { openAIChat } = await import('../../api/openai');
        const reply = await openAIChat(newMessages, undefined, apiKey);

        // Check for agent or tool creation commands
        processCommandsInMessage(reply.content);
        return reply;
      }
    }
  });

  const handleSend = async () => {
    if (!input.trim() || sendLoading) return;
    
    if (activeTab === 'build') {
      const newMessages: Message[] = [...messages, { role: 'user', content: input }];
      setMessages(newMessages);
      setInput('');
      
      try {
        const reply = await executeSend(newMessages);
        if (reply) {
          setMessages([...newMessages, reply]);
          setStep(step + 1);
        }
      } catch (error) {
        // Error is already handled by useAsyncOperation
        // Just log for debugging purposes
        console.error('Error in handleSend:', error);
      }
    } else {
      // Test workflow mode
      const newMessages: Message[] = [...testMessages, { role: 'user', content: input }];
      setTestMessages(newMessages);
      setInput('');
      
      try {
        // In a real implementation, this would execute the workflow and show agent interactions
        // For now, we'll simulate a response
        setTimeout(() => {
          const agentResponse: Message = { role: 'assistant', content: `Agent response to: ${input}` };
          setTestMessages([...newMessages, agentResponse]);
        }, 1000);
      } catch (error) {
        console.error('Error in test workflow:', error);
      }
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
  
  // Handle API key changes
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };
  
  // Save API key and close dialog
  const handleSaveApiKey = async () => {
    if (apiKey.trim()) {
      setShowApiKeyStatus(true);
      await validateApiKey();
      setShowApiKeyDialog(false);
    }
  };
  
  // Show API key dialog
  const handleShowApiKeyDialog = () => {
    setShowApiKeyDialog(true);
  };

  return (
    <Paper elevation={3} sx={{ height: '100%', padding: 2, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Conversation
        </Typography>
        {showApiKeyStatus ? (
          apiKeyValidationState === 'loading' ? (
            <Chip 
              label="Checking API Key" 
              color="primary" 
              size="small" 
            />
          ) : apiKeyValidationState === 'invalid' ? (
            <Chip 
              label="API Key Invalid" 
              color="error" 
              size="small" 
              onClick={handleShowApiKeyDialog}
              sx={{ cursor: 'pointer' }}
            />
          ) : apiKeyValidationState === 'valid' ? (
            <Chip 
              label="API Key Valid" 
              color="success" 
              size="small" 
              onClick={handleShowApiKeyDialog}
              sx={{ cursor: 'pointer' }}
            />
          ) : null
        ) : (
          <Chip 
            label="Set API Key" 
            color="primary" 
            size="small" 
            onClick={handleShowApiKeyDialog}
            sx={{ cursor: 'pointer' }}
          />
        )}
      </Box>
      
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        textColor="primary"
        indicatorColor="primary"
        variant="fullWidth"
        sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab value="build" label="Build Workflow" />
        <Tab value="test" label="Test Workflow" />
      </Tabs>
      
      <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
        {activeTab === 'build' ? messages.map((msg, idx) => (
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
        )) : testMessages.map((msg, idx) => (
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
        
        {sendLoading && (
          <Box sx={{ my: 2 }}>
            <LoadingIndicator 
              type="dots" 
              size="small" 
              centered={false} 
              message="AI is thinking..."
            />
          </Box>
        )}
        
        {sendError && (
          <Box sx={{ my: 2 }}>
            <ErrorMessage 
              message="Failed to get a response" 
              details={sendError.message}
              compact
              onRetry={() => {
                resetSendError();
                const lastUserMessage = messages.filter(m => m.role === 'user').pop();
                if (lastUserMessage) {
                  const newMessages = [...messages.filter(m => m !== lastUserMessage), lastUserMessage];
                  executeSend(newMessages);
                }
              }}
            />
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>
      
      {apiKeyError && (
        <Box sx={{ mb: 2 }}>
          <ErrorMessage 
            message="OpenAI API Key is invalid or missing" 
            details="Please set your API key to use the conversation feature."
            onRetry={handleShowApiKeyDialog}
            onDismiss={() => {}}
          />
        </Box>
      )}
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder={activeTab === 'build' ? "Ask about building your workflow..." : "Test your workflow..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          disabled={sendLoading || apiKeyValidationState === 'loading' || apiKeyValidationState === 'invalid' || !apiKey}
        />
        <Button 
          variant="contained" 
          onClick={handleSend}
          disabled={sendLoading || !input.trim() || apiKeyValidationState === 'loading' || apiKeyValidationState === 'invalid' || !apiKey}
        >
          Send
        </Button>
      </Box>
      
      {/* API Key Dialog */}
      <Dialog
        open={showApiKeyDialog}
        onClose={() => apiKeyValidationState === 'valid' && setShowApiKeyDialog(false)}
        title="OpenAI API Key"
        maxWidth="sm"
        fullWidth
        actions={
          <>
            {apiKeyValidationState === 'valid' && (
              <Button 
                onClick={() => setShowApiKeyDialog(false)} 
                variant="outlined" 
                color="default"
              >
                Close
              </Button>
            )}
            <Button 
              onClick={handleSaveApiKey} 
              color="primary"
              disabled={!apiKey.trim() || apiKeyValidationState === 'loading'}
            >
              Save API Key
            </Button>
          </>
        }
      >
        <Typography variant="body2" sx={{ mb: 2 }}>
          Enter your OpenAI API key to enable the conversation feature. Your key will be stored locally in your browser and is not sent to our servers.
        </Typography>
        
        <TextField
          fullWidth
          label="OpenAI API Key"
          value={apiKey}
          onChange={handleApiKeyChange}
          placeholder="sk-..."
          type="password"
          autoFocus
          highlightOnFocus
        />
        
        {apiKeyValidationState === 'loading' && (
          <Box sx={{ mt: 2 }}>
            <LoadingIndicator 
              type="dots" 
              size="small" 
              centered={false} 
              message="Validating API key..."
            />
          </Box>
        )}
        
        {apiKeyValidationState === 'invalid' && (
          <Box sx={{ mt: 2 }}>
            <ErrorMessage 
              message="Invalid API Key" 
              details="Please try again."
              compact
            />
          </Box>
        )}
        
        {apiKeyValidationState === 'valid' && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="success.main">
              API key is valid! You can now use the conversation feature.
            </Typography>
          </Box>
        )}
      </Dialog>
    </Paper>
  );
};

export default ConversationPanel;
