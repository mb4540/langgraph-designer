import React, { useState, useRef, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useTheme } from '@mui/material/styles';

import { useWorkflowContext } from '../../context/WorkflowContext';
import LoadingIndicator from '../ui/LoadingIndicator';
import ErrorMessage from '../ui/ErrorMessage';
import useAsyncOperation from '../../hooks/useAsyncOperation';
import TextField from '../ui/TextField';
import Button from '../ui/Button';
import Dialog from '../ui/Dialog';
import { Message } from '../../api/openai';

// Sample initial interview questions
const initialInterview = [
  "Welcome to the Workflow Designer! I'm here to help you build your workflow. What type of workflow would you like to create today?",
  "Great! Can you tell me more about the specific tasks or processes this workflow should handle?",
  "Would you like to build this visually using our workflow designer, or would you prefer I help you code it?"
];

// Local storage key for the API key
const API_KEY_STORAGE_KEY = 'openai_api_key';

const ConversationPanel: React.FC = () => {
  const theme = useTheme();
  const { addNode } = useWorkflowContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // State for conversation
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [input, setInput] = useState<string>('');
  const [step, setStep] = useState<number>(-1);
  const [activeTab, setActiveTab] = useState<'chat' | 'test'>('chat');
  const [testMessages, setTestMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  
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
  } = useAsyncOperation<Message>(async (newMessages: { role: 'user' | 'assistant', content: string }[]) => {
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
            content: 'I understand you prefer guidance. Let me help you build your workflow step by step. ' +
                    'What would be the first step or component you want to add to your workflow?'
          };
        }
      } else {
        // For subsequent messages, we'll use a simple echo for now
        // In a real implementation, this would call an LLM API
        try {
          const { openAIChat } = await import('../../api/openai');
          return await openAIChat(newMessages, undefined, apiKey);
        } catch (error) {
          // Error is already handled by useAsyncOperation
          throw error;
        }
      }
    }
  });

  // Handle sending a message
  const handleSend = async () => {
    if (!input.trim() || sendLoading) return;
    
    const userMessage = { role: 'user' as const, content: input };
    const newMessages = [...messages, userMessage];
    
    if (activeTab === 'chat') {
      setMessages(newMessages);
    } else {
      setTestMessages(newMessages);
    }
    
    setInput('');
    
    try {
      const response = await executeSend(newMessages);
      if (response) {
        if (activeTab === 'chat') {
          setMessages([...newMessages, response]);
          setStep(prev => prev + 1);
        } else {
          setTestMessages([...newMessages, response]);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Handle tab change
  const handleTabChange = (_: React.SyntheticEvent, newValue: 'chat' | 'test') => {
    setActiveTab(newValue);
  };

  // Start the conversation when the component mounts
  useEffect(() => {
    if (messages.length === 0 && activeTab === 'chat') {
      setMessages([{ role: 'assistant', content: initialInterview[0] }]);
      setStep(0);
    }
  }, [messages.length, activeTab]);

  // Create a new node from the conversation
  const handleCreateNode = (type: 'agent' | 'tool' | 'memory') => {
    // Simple implementation - in a real app, we'd extract details from the conversation
    const position = { x: 250, y: 100 };
    const id = `${type}-${Date.now()}`;
    const name = `New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    
    addNode({
      id,
      name,
      type,
      content: '',
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
        onChange={handleTabChange}
        sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab value="chat" label="Chat" />
        <Tab value="test" label="Test" />
      </Tabs>
      
      <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
        {activeTab === 'chat' ? (
          messages.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
              Start a conversation to build your workflow
            </Typography>
          ) : (
            messages.map((message, index) => (
              <Box 
                key={index} 
                sx={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                <Paper 
                  elevation={1} 
                  sx={{
                    padding: 2,
                    maxWidth: '80%',
                    backgroundColor: message.role === 'user' 
                      ? theme.palette.primary.main 
                      : theme.palette.background.paper,
                    color: message.role === 'user' 
                      ? theme.palette.primary.contrastText 
                      : theme.palette.text.primary,
                    borderRadius: 2
                  }}
                >
                  <Typography variant="body1">
                    {message.content}
                  </Typography>
                </Paper>
              </Box>
            ))
          )
        ) : (
          testMessages.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
              Test your workflow with sample inputs
            </Typography>
          ) : (
            testMessages.map((message, index) => (
              <Box 
                key={index} 
                sx={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                <Paper 
                  elevation={1} 
                  sx={{
                    padding: 2,
                    maxWidth: '80%',
                    backgroundColor: message.role === 'user' 
                      ? theme.palette.primary.main 
                      : theme.palette.background.paper,
                    color: message.role === 'user' 
                      ? theme.palette.primary.contrastText 
                      : theme.palette.text.primary,
                    borderRadius: 2
                  }}
                >
                  <Typography variant="body1">
                    {message.content}
                  </Typography>
                </Paper>
              </Box>
            ))
          )
        )}
        <div ref={messagesEndRef} />
      </Box>
      
      {sendError && (
        <Box sx={{ mb: 2 }}>
          <ErrorMessage 
            message="OpenAI API Key is invalid or missing" 
            details="Please set your API key to use the conversation feature."
            onRetry={() => {
              resetSendError();
              handleShowApiKeyDialog();
            }}
          />
        </Box>
      )}
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          disabled={sendLoading || apiKeyValidationState === 'loading' || apiKeyValidationState === 'invalid' || !apiKey}
        />
        <Button 
          variant="contained" 
          color="primary" 
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
                color="primary"
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
        <Typography variant="body2" color="text.secondary" paragraph>
          Enter your OpenAI API key to enable the conversation feature. Your key will be stored locally in your browser and is not sent to our servers.
        </Typography>
        
        <TextField
          fullWidth
          type="password"
          value={apiKey}
          onChange={handleApiKeyChange}
          label="OpenAI API Key"
          placeholder="sk-..."
          autoFocus
          highlightOnFocus
        />
        
        {apiKeyValidationState === 'loading' && (
          <Box sx={{ mt: 2 }}>
            <LoadingIndicator 
              type="dots" 
              size="small" 
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
