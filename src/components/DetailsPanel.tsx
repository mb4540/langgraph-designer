import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Editor from '@monaco-editor/react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { useWorkflowStore } from '../store/workflowStore';
import { useThemeContext } from '../context/ThemeContext';

// List of available LLM models
const LLM_MODELS = [
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
const AGENT_MODELS = [
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
  { value: 'gpt-4o', label: 'GPT-4o' },
];

// Memory types
const MEMORY_TYPES = [
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

// Output parser types
const OUTPUT_PARSER_TYPES = [
  {
    value: 'json-output-parser',
    label: 'JSONOutputParser',
    description: 'Converts raw model text into a validated Python dict that must be well-formed JSON, raising an error if the structure is malformed.',
    source: 'LangChain'
  },
  {
    value: 'pydantic-output-parser',
    label: 'PydanticOutputParser',
    description: 'Forces the LLM\'s response to match a Pydantic model, guaranteeing each key and data type before downstream use.',
    source: 'LangChain'
  },
  {
    value: 'comma-separated-list-parser',
    label: 'CommaSeparatedListOutputParser',
    description: 'Takes a comma-separated string (e.g., "alpha, beta, gamma") and returns it as a clean Python list.',
    source: 'LangChain'
  },
  {
    value: 'datetime-output-parser',
    label: 'DatetimeOutputParser',
    description: 'Reads date/time strings from the LLM and returns native datetime objects in the desired format.',
    source: 'LangChain'
  },
  {
    value: 'react-output-parser',
    label: 'ReActOutputParser',
    description: 'Designed for ReAct-style agents; splits output into an AgentAction (tool call) or an AgentFinish (final answer).',
    source: 'LangChain'
  },
  {
    value: 'structured-output-parser',
    label: 'StructuredOutputParser',
    description: 'Maps text into a dictionary that follows a custom response schema—useful when you need multiple named fields or arrays.',
    source: 'LangChain'
  },
];

// Tool types with MCP code templates
const TOOL_TYPES = [
  {
    value: 'stagehand-browser',
    label: 'Stagehand Browser Tool',
    description: 'Gives an agent full, headless-browser super-powers (navigate, click, scrape, screenshot) through Browserbase; ideal for web search, form-filling, and UI testing workflows.',
    source: 'Stagehand',
    code: `from langgraph.mcp import MCP
from stagehand.browserbase import BrowserBase

# Initialize the browser tool
browser = BrowserBase()

# Define the browser tool MCP
browser_tool = MCP(
    name="browser",
    description="Navigate and interact with web pages",
    input_schema={"url": str, "action": str, "selector": str},
    output_schema={"result": str, "screenshot": str},
    fn=browser.execute
)`
  },
  {
    value: 'vector-store-retriever',
    label: 'Vector-Store Retriever Tool',
    description: 'Lets the agent embed a query, hit a vector DB (e.g., Qdrant, Pinecone) and pull back the top-k chunks for Retrieval-Augmented Generation (RAG).',
    source: 'Data Science Daily',
    code: `from langgraph.mcp import MCP
from langchain_community.vectorstores import Qdrant
from langchain_openai import OpenAIEmbeddings

# Initialize the vector store
vector_store = Qdrant(
    collection_name="documents",
    embeddings=OpenAIEmbeddings(),
    url="http://localhost:6333"
)

# Define the retriever tool MCP
retriever_tool = MCP(
    name="retriever",
    description="Search for relevant documents using semantic similarity",
    input_schema={"query": str, "k": int},
    output_schema={"documents": list},
    fn=lambda params: {"documents": vector_store.similarity_search(params["query"], k=params["k"])}
)`
  },
  {
    value: 'calculator-math',
    label: 'Calculator / Math Tool',
    description: 'Exposes precise numeric, symbolic-math, statistics, and matrix operations so the LLM can off-load complex calculations instead of approximating.',
    source: 'GitHub',
    code: `from langgraph.mcp import MCP
import sympy
import numpy as np
from typing import Dict, Any

def calculate(params: Dict[str, Any]) -> Dict[str, Any]:
    """Execute mathematical operations using sympy"""
    expression = params["expression"]
    try:
        # Parse and evaluate the expression
        result = sympy.sympify(expression)
        return {"result": str(result), "error": None}
    except Exception as e:
        return {"result": None, "error": str(e)}

# Define the calculator tool MCP
calculator_tool = MCP(
    name="calculator",
    description="Perform precise mathematical calculations",
    input_schema={"expression": str},
    output_schema={"result": str, "error": str},
    fn=calculate
)`
  },
  {
    value: 'multi-database-sql',
    label: 'Multi-Database SQL Tool',
    description: 'Connects to one or many SQL engines; the agent can inspect schemas and run safe, read-only queries to fetch structured data on demand.',
    source: 'GitHub',
    code: `from langgraph.mcp import MCP
import sqlalchemy
import pandas as pd
from typing import Dict, Any

# Initialize database connections
databases = {
    "customers": sqlalchemy.create_engine("sqlite:///customers.db"),
    "products": sqlalchemy.create_engine("sqlite:///products.db"),
    "orders": sqlalchemy.create_engine("sqlite:///orders.db")
}

def execute_query(params: Dict[str, Any]) -> Dict[str, Any]:
    """Execute a read-only SQL query against the specified database"""
    db_name = params["database"]
    query = params["query"]
    
    # Safety check - only allow SELECT statements
    if not query.strip().lower().startswith("select"):
        return {"error": "Only SELECT queries are allowed", "results": None}
    
    try:
        # Get the database engine
        if db_name not in databases:
            return {"error": f"Database '{db_name}' not found", "results": None}
            
        engine = databases[db_name]
        
        # Execute the query and return results as a list of dictionaries
        df = pd.read_sql(query, engine)
        return {"results": df.to_dict(orient="records"), "error": None}
    except Exception as e:
        return {"results": None, "error": str(e)}

# Define the SQL tool MCP
sql_tool = MCP(
    name="sql",
    description="Execute read-only SQL queries against multiple databases",
    input_schema={"database": str, "query": str},
    output_schema={"results": list, "error": str},
    fn=execute_query
)`
  },
  {
    value: 'email-imap-smtp',
    label: 'Email (IMAP/SMTP) Tool',
    description: 'Enables send/receive, search, and mailbox management so agents can automate notifications or parse inbound messages directly from an inbox.',
    source: 'GitHub',
    code: `from langgraph.mcp import MCP
import imaplib
import smtplib
import email
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any, List

class EmailClient:
    def __init__(self, imap_server, smtp_server, username, password):
        self.imap_server = imap_server
        self.smtp_server = smtp_server
        self.username = username
        self.password = password
    
    def send_email(self, to_address, subject, body):
        """Send an email via SMTP"""
        try:
            # Create message
            msg = MIMEMultipart()
            msg['From'] = self.username
            msg['To'] = to_address
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain'))
            
            # Connect to SMTP server and send
            server = smtplib.SMTP(self.smtp_server, 587)
            server.starttls()
            server.login(self.username, self.password)
            server.send_message(msg)
            server.quit()
            return {"success": True, "error": None}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def search_emails(self, folder="INBOX", criteria="ALL", limit=10):
        """Search for emails in the specified folder"""
        try:
            # Connect to IMAP server
            mail = imaplib.IMAP4_SSL(self.imap_server)
            mail.login(self.username, self.password)
            mail.select(folder)
            
            # Search for emails
            status, data = mail.search(None, criteria)
            if status != 'OK':
                return {"messages": [], "error": "Search failed"}
                
            # Get message IDs and fetch the most recent ones
            message_ids = data[0].split()
            messages = []
            
            # Process the most recent messages up to the limit
            for msg_id in reversed(message_ids[-limit:]):
                status, msg_data = mail.fetch(msg_id, '(RFC822)')
                if status != 'OK':
                    continue
                    
                # Parse the email
                msg = email.message_from_bytes(msg_data[0][1])
                messages.append({
                    "id": msg_id.decode(),
                    "from": msg.get("From", ""),
                    "to": msg.get("To", ""),
                    "subject": msg.get("Subject", ""),
                    "date": msg.get("Date", "")
                })
            
            mail.logout()
            return {"messages": messages, "error": None}
        except Exception as e:
            return {"messages": [], "error": str(e)}

# Initialize the email client
email_client = EmailClient(
    imap_server="imap.example.com",
    smtp_server="smtp.example.com",
    username="agent@example.com",
    password="your_password_here"  // Use environment variables in production
)

# Define the email tool MCP
email_tool = MCP(
    name="email",
    description="Send and search emails",
    input_schema={
        "action": str,  // "send" or "search"
        "to": str,     // For send action
        "subject": str, // For send action
        "body": str,    // For send action
        "folder": str,  // For search action
        "criteria": str, // For search action
        "limit": int    // For search action
    },
    output_schema={
        "success": bool,
        "messages": list,
        "error": str
    },
    fn=lambda params: (
        email_client.send_email(params["to"], params["subject"], params["body"])
        if params["action"] == "send"
        else email_client.search_emails(params.get("folder", "INBOX"), params.get("criteria", "ALL"), params.get("limit", 10))
    )
)`
  },
  {
    value: 'azure-functions',
    label: 'Azure Functions (Remote-Compute) Tool',
    description: 'Example MCP trigger that turns any serverless function—such as "saveSnippet"/"getSnippet" for code snippets—into a callable tool, giving agents elastic compute and custom business logic.',
    source: 'techcommunity.microsoft.com',
    code: `from langgraph.mcp import MCP
import requests
import json
from typing import Dict, Any

class AzureFunctionClient:
    def __init__(self, base_url, function_key):
        self.base_url = base_url
        self.headers = {
            "Content-Type": "application/json",
            "x-functions-key": function_key
        }
    
    def call_function(self, function_name, payload):
        """Call an Azure Function with the given payload"""
        try:
            url = f"{self.base_url}/api/{function_name}"
            response = requests.post(url, headers=self.headers, json=payload)
            response.raise_for_status()
            return {"result": response.json(), "error": None}
        except Exception as e:
            return {"result": None, "error": str(e)}

# Initialize the Azure Function client
azure_client = AzureFunctionClient(
    base_url="https://your-function-app.azurewebsites.net",
    function_key="your_function_key_here"  // Use environment variables in production
)

# Define the Azure Functions tool MCP
azure_functions_tool = MCP(
    name="azure_functions",
    description="Call Azure Functions for remote computation",
    input_schema={
        "function_name": str,  // Name of the function to call
        "payload": dict      // JSON payload to send to the function
    },
    output_schema={
        "result": dict,
        "error": str
    },
    fn=lambda params: azure_client.call_function(params["function_name"], params["payload"])
)`
  },
];

const DetailsPanel: React.FC = () => {
  const { selectedNode, updateNode } = useWorkflowStore();
  const { mode } = useThemeContext();
  const [name, setName] = useState('');
  const [llmModel, setLlmModel] = useState('gpt-4o-mini');
  const [content, setContent] = useState('');
  const [memoryType, setMemoryType] = useState('conversation-buffer');
  const [toolType, setToolType] = useState('');
  const [isEditingTool, setIsEditingTool] = useState(false);
  const [toolCode, setToolCode] = useState('');
  const [parserType, setParserType] = useState('');

  useEffect(() => {
    if (selectedNode) {
      setName(selectedNode.name);
      setContent(selectedNode.content);
      setIsEditingTool(false); // Reset editing mode when node changes
      
      // Set LLM model for model nodes only (not for agent nodes anymore)
      if (selectedNode.type === 'model' && selectedNode.llmModel) {
        setLlmModel(selectedNode.llmModel);
      } else if (selectedNode.type === 'model') {
        // Default to GPT-4o if no model is set
        setLlmModel('gpt-4o');
      }
      
      // Set memory type for memory nodes
      if (selectedNode.type === 'memory' && selectedNode.memoryType) {
        setMemoryType(selectedNode.memoryType);
      } else if (selectedNode.type === 'memory') {
        // Default to conversation buffer if no memory type is set
        setMemoryType('conversation-buffer');
      }
      
      // Set tool type for tool nodes
      if (selectedNode.type === 'tool' && selectedNode.toolType) {
        setToolType(selectedNode.toolType);
        // Find the tool and set its code
        const selectedTool = TOOL_TYPES.find(tool => tool.value === selectedNode.toolType);
        if (selectedTool) {
          // If the node has custom code, use it, otherwise use the template
          setToolCode(selectedNode.content && selectedNode.content !== `This is a tool component.` ? 
            selectedNode.content : selectedTool.code);
        }
      } else if (selectedNode.type === 'tool') {
        // Default to no selection if no tool type is set
        setToolType('');
        setToolCode('');
      }
      
      // Set parser type for outputParser nodes
      if (selectedNode.type === 'outputParser' && selectedNode.parserType) {
        setParserType(selectedNode.parserType);
      } else if (selectedNode.type === 'outputParser') {
        // Default to json output parser if no parser type is set
        setParserType('json-output-parser');
      }
    }
  }, [selectedNode]);

  const handleSave = () => {
    if (selectedNode) {
      const updates: any = {};
      
      // Only include name and content for non-model, non-memory, and non-outputParser nodes
      if (selectedNode.type !== 'model' && selectedNode.type !== 'memory' && selectedNode.type !== 'outputParser') {
        updates.name = name;
        // For tools in edit mode, save the tool code as content
        if (selectedNode.type === 'tool' && isEditingTool) {
          updates.content = toolCode;
        } else {
          updates.content = content;
        }
      }
      
      // Include llmModel for both agent and model nodes
      if (selectedNode.type === 'model') {
        updates.llmModel = llmModel;
      }
      
      // Include memoryType for memory nodes
      if (selectedNode.type === 'memory') {
        updates.memoryType = memoryType;
      }
      
      // Include toolType for tool nodes
      if (selectedNode.type === 'tool') {
        updates.toolType = toolType;
      }
      
      // Include parserType for outputParser nodes
      if (selectedNode.type === 'outputParser') {
        updates.parserType = parserType;
      }
      
      updateNode(selectedNode.id, updates);
      
      // Exit editing mode after saving
      if (isEditingTool) {
        setIsEditingTool(false);
      }
    }
  };

  if (!selectedNode) {
    return (
      <Paper elevation={3} sx={{ height: '100%', padding: 2, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>
          Details
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
          <Typography variant="body1" color="text.secondary">
            Double-click on an agent or tool in the workflow to view and edit its details here.
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Determine the title based on node type
  const getNodeTitle = () => {
    switch (selectedNode.type) {
      case 'agent': return 'Agent Details';
      case 'model': return 'Model Details';
      case 'memory': return 'Memory Details';
      case 'tool': return 'Tool Details';
      case 'outputParser': return 'Output Parser Details';
      default: return 'Node Details';
    }
  };

  // Render different content based on node type
  const renderDetailsContent = () => {
    if (selectedNode.type === 'model') {
      // For model nodes, only show the model selection
      return (
        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>LLM Model</InputLabel>
            <Select
              value={llmModel}
              label="LLM Model"
              onChange={(e) => setLlmModel(e.target.value)}
            >
              {LLM_MODELS.map(model => (
                <MenuItem key={model.value} value={model.value}>{model.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      );
    } else if (selectedNode.type === 'memory') {
      // For memory nodes, show the memory type selection
      return (
        <Box sx={{ mb: 2, mt: 2 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Memory Type</FormLabel>
            <RadioGroup
              value={memoryType}
              onChange={(e) => setMemoryType(e.target.value)}
            >
              {MEMORY_TYPES.map(memory => (
                <Box key={memory.value} sx={{ mb: 2, border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                  <FormControlLabel 
                    value={memory.value} 
                    control={<Radio />} 
                    label={
                      <Box>
                        <Typography variant="subtitle1">{memory.label}</Typography>
                        <Typography variant="body2" color="text.secondary">{memory.description}</Typography>
                        {memory.source && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            Source: {memory.source}
                          </Typography>
                        )}
                      </Box>
                    } 
                  />
                </Box>
              ))}
            </RadioGroup>
          </FormControl>
        </Box>
      );
    } else if (selectedNode.type === 'tool') {
      // For tool nodes, show the tool cards or the code editor
      if (isEditingTool) {
        // Show only the selected tool card and code editor
        const selectedToolInfo = TOOL_TYPES.find(tool => tool.value === toolType);
        
        return (
          <Box sx={{ mb: 2, mt: 2 }}>
            {/* Display only the selected tool card */}
            {selectedToolInfo && (
              <Card 
                sx={{ 
                  mb: 2, 
                  border: 2,
                  borderColor: 'primary.main',
                  borderRadius: 1,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {selectedToolInfo.label}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => setIsEditingTool(false)}
                      title="Back to tool selection"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {selectedToolInfo.description}
                  </Typography>
                  {selectedToolInfo.source && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      Source: {selectedToolInfo.source}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Code editor for the selected tool */}
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
              MCP Code
            </Typography>
            <Box sx={{ flexGrow: 1, mb: 2, border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
              <Editor
                height="400px"
                defaultLanguage="python"
                value={toolCode}
                onChange={(value) => setToolCode(value || '')}
                theme={mode === 'dark' ? 'vs-dark' : 'light'}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                }}
              />
            </Box>
          </Box>
        );
      } else {
        // Show the list of tool cards with edit buttons
        return (
          <Box sx={{ mb: 2, mt: 2 }}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">Tool Type</FormLabel>
              <Box sx={{ mt: 2 }}>
                {TOOL_TYPES.map(tool => (
                  <Card 
                    key={tool.value} 
                    sx={{ 
                      mb: 2, 
                      border: toolType === tool.value ? 2 : 1,
                      borderColor: toolType === tool.value ? 'primary.main' : 'divider',
                      borderRadius: 1,
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography 
                          variant="subtitle1" 
                          fontWeight={toolType === tool.value ? 'bold' : 'normal'}
                        >
                          {tool.label}
                        </Typography>
                        {toolType === tool.value && (
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card selection
                              setIsEditingTool(true);
                              // Set the tool code if not already set
                              if (!toolCode) {
                                setToolCode(tool.code);
                              }
                            }}
                            title="Edit MCP code"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                      <CardActionArea 
                        onClick={() => setToolType(tool.value)}
                        sx={{ mt: 1 }} // Add margin to separate from the header
                      >
                        <Typography variant="body2" color="text.secondary">
                          {tool.description}
                        </Typography>
                        {tool.source && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            Source: {tool.source}
                          </Typography>
                        )}
                      </CardActionArea>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </FormControl>
          </Box>
        );
      }
    } else if (selectedNode.type === 'outputParser') {
      // For output parser nodes, show the parser type selection
      return (
        <Box sx={{ mb: 2, mt: 2 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Output Parser Type</FormLabel>
            <RadioGroup
              value={parserType}
              onChange={(e) => setParserType(e.target.value)}
            >
              {OUTPUT_PARSER_TYPES.map(parser => (
                <Box key={parser.value} sx={{ mb: 2, border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                  <FormControlLabel 
                    value={parser.value} 
                    control={<Radio />} 
                    label={
                      <Box>
                        <Typography variant="subtitle1">{parser.label}</Typography>
                        <Typography variant="body2" color="text.secondary">{parser.description}</Typography>
                        {parser.source && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            Source: {parser.source}
                          </Typography>
                        )}
                      </Box>
                    } 
                  />
                </Box>
              ))}
            </RadioGroup>
          </FormControl>
        </Box>
      );
    }
    
    // For all other node types
    return (
      <>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            variant="outlined"
          />
        </Box>
        
        {selectedNode.type === 'agent' ? (
          <>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Prompt
            </Typography>
            
            <Box sx={{ flexGrow: 1, mb: 2, border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
              <TextField
                multiline
                fullWidth
                minRows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                variant="outlined"
                sx={{ height: '100%' }}
                inputProps={{ style: { verticalAlign: 'top' } }}
                InputProps={{
                  sx: {
                    height: '100%',
                    '& .MuiInputBase-inputMultiline': {
                      height: '100%',
                      alignItems: 'flex-start',
                      verticalAlign: 'top',
                      paddingTop: '14px',
                      textAlign: 'left',
                    }
                  }
                }}
              />
            </Box>
          </>
        ) : (
          <>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Code
            </Typography>
            
            <Box sx={{ flexGrow: 1, mb: 2, border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
              <Editor
                height="300px"
                defaultLanguage="javascript"
                value={content}
                onChange={(value) => setContent(value || '')}
                theme={mode === 'dark' ? 'vs-dark' : 'light'}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                }}
              />
            </Box>
          </>
        )}
      </>
    );
  };

  return (
    <Paper elevation={3} sx={{ height: '100%', padding: 2, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        {getNodeTitle()}
      </Typography>
      
      {renderDetailsContent()}
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Box>
    </Paper>
  );
};

export default DetailsPanel;
