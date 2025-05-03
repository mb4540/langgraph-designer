import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import Editor from '@monaco-editor/react';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import { WorkflowNode } from '../../../types/nodeTypes';
import { useWorkflowContext } from '../../../context/WorkflowContext';
import { useThemeContext } from '../../../context/ThemeContext';
import LoadingIndicator from '../../ui/LoadingIndicator';
import ErrorMessage from '../../ui/ErrorMessage';
import ActionButtons from '../../ui/ActionButtons';
import useAsyncOperation from '../../../hooks/useAsyncOperation';
import { useVersionedId } from '../../../hooks/useVersionedId';
import { VersionedEntity, newToolVersion } from '../../../utils/idGenerator';
import { ulid } from 'ulid';

// Helper function to generate unique tool IDs
const generateToolId = (version: string) => {
  return {
    id: ulid(),
    version,
    createdAt: new Date().toISOString()
  };
};

// Tool tags for filtering
const TOOL_TAGS = [
  // Categories
  { value: 'Database', category: 'Technology' },
  { value: 'API', category: 'Technology' },
  { value: 'Vector', category: 'Technology' },
  { value: 'Storage', category: 'Technology' },
  { value: 'Cloud', category: 'Technology' },
  { value: 'Kubernetes', category: 'Technology' },
  
  // Types
  { value: 'Official', category: 'Source' },
  { value: 'Community', category: 'Source' },
  
  // Functionality
  { value: 'Data', category: 'Functionality' },
  { value: 'Agent', category: 'Functionality' },
  { value: 'AI', category: 'Functionality' },
  { value: 'Image', category: 'Functionality' },
  { value: 'Time', category: 'Functionality' },
  { value: 'Automation', category: 'Functionality' },
  { value: 'Scraping', category: 'Functionality' },
  { value: 'Search', category: 'Functionality' },
  { value: 'Location', category: 'Functionality' },
  { value: 'Google', category: 'Functionality' },
  { value: 'HTTP', category: 'Functionality' },
  { value: 'Monitoring', category: 'Functionality' }
];

// Tool types with MCP code templates
const TOOL_TYPES = [
  {
    value: 'stagehand-browser',
    label: 'Stagehand Browser Tool',
    description: 'Gives an agent full, headless-browser super-powers (navigate, click, scrape, screenshot) through Browserbase; ideal for web search, form-filling, and UI testing workflows.',
    source: 'Stagehand',
    version: '1.0.0',
    versionedId: generateToolId('1.0.0').id,
    createdAt: new Date().toISOString(),
    tags: ['Automation', 'Scraping', 'Community'],
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
    version: '1.0.0',
    versionedId: generateToolId('1.0.0').id,
    createdAt: new Date().toISOString(),
    tags: ['Database', 'Vector', 'Community'],
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
    description="Retrieve relevant documents from a vector store",
    input_schema={"query": str, "k": int},
    output_schema={"documents": list},
    fn=lambda params: {"documents": vector_store.similarity_search(params["query"], k=params["k"])}
)`
  },
  {
    value: 'calculator-math',
    label: 'Calculator / Math Tool',
    description: 'Provides precise mathematical operations, equation solving, and symbolic computation capabilities through the SymPy library.',
    source: 'LangChain',
    version: '1.0.0',
    versionedId: generateToolId('1.0.0').id,
    createdAt: new Date().toISOString(),
    tags: ['Data', 'Community'],
    code: `from langgraph.mcp import MCP
import sympy
import re

def calculate(expression):
    """Evaluate a mathematical expression using sympy"""
    try:
        # Clean the expression
        cleaned_expr = re.sub(r'[^\d+\-*/()^\s.]+', '', expression)
        # Replace ^ with ** for exponentiation
        cleaned_expr = cleaned_expr.replace('^', '**')
        # Evaluate using sympy for safety and precision
        result = sympy.sympify(cleaned_expr)
        return {"result": str(result)}
    except Exception as e:
        return {"error": str(e)}

# Define the calculator tool MCP
calculator_tool = MCP(
    name="calculator",
    description="Perform mathematical calculations",
    input_schema={"expression": str},
    output_schema={"result": str, "error": str},
    fn=lambda params: calculate(params["expression"])
)`
  },
  {
    value: 'multi-database-sql',
    label: 'Multi-Database SQL Tool',
    description: 'Executes SQL queries across different database engines (PostgreSQL, MySQL, SQLite, etc.) with connection pooling and error handling.',
    source: 'Database Toolkit',
    version: '1.0.0',
    versionedId: generateToolId('1.0.0').id,
    createdAt: new Date().toISOString(),
    tags: ['Database', 'Storage', 'Community'],
    code: `from langgraph.mcp import MCP
import sqlalchemy
import pandas as pd

class DatabaseConnector:
    def __init__(self):
        self.connections = {}
        
    def execute_query(self, db_type, connection_string, query):
        """Execute SQL query on specified database"""
        try:
            # Get or create connection
            if connection_string not in self.connections:
                engine = sqlalchemy.create_engine(connection_string)
                self.connections[connection_string] = engine
            else:
                engine = self.connections[connection_string]
            
            # Execute query
            with engine.connect() as conn:
                result = pd.read_sql(query, conn)
                return {
                    "success": True,
                    "rows": result.to_dict(orient="records"),
                    "columns": result.columns.tolist(),
                    "row_count": len(result)
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

# Initialize the database connector
db_connector = DatabaseConnector()

# Define the SQL tool MCP
sql_tool = MCP(
    name="sql",
    description="Execute SQL queries on various databases",
    input_schema={
        "db_type": str,  # "postgresql", "mysql", "sqlite", etc.
        "connection_string": str,
        "query": str
    },
    output_schema={
        "success": bool,
        "rows": list,
        "columns": list,
        "row_count": int,
        "error": str
    },
    fn=lambda params: db_connector.execute_query(
        params["db_type"],
        params["connection_string"],
        params["query"]
    )
)`
  },
  {
    value: 'email-imap-smtp',
    label: 'Email (IMAP/SMTP) Tool',
    description: 'Enables reading from IMAP mailboxes and sending emails via SMTP with attachment handling and HTML content support.',
    source: 'Email Automation Suite',
    version: '1.0.0',
    versionedId: generateToolId('1.0.0').id,
    createdAt: new Date().toISOString(),
    tags: ['Automation', 'Community'],
    code: `from langgraph.mcp import MCP
import imaplib
import smtplib
import email
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import base64

class EmailClient:
    def __init__(self, imap_server, smtp_server, username, password):
        self.imap_server = imap_server
        self.smtp_server = smtp_server
        self.username = username
        self.password = password
        self.imap = None
        self.smtp = None
    
    def connect(self):
        """Connect to IMAP and SMTP servers"""
        try:
            # Connect to IMAP
            self.imap = imaplib.IMAP4_SSL(self.imap_server)
            self.imap.login(self.username, self.password)
            
            # Connect to SMTP
            self.smtp = smtplib.SMTP(self.smtp_server, 587)
            self.smtp.starttls()
            self.smtp.login(self.username, self.password)
            
            return {"success": True, "message": "Connected to email servers"}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def disconnect(self):
        """Disconnect from servers"""
        if self.imap:
            try:
                self.imap.logout()
            except:
                pass
        if self.smtp:
            try:
                self.smtp.quit()
            except:
                pass
        self.imap = None
        self.smtp = None
    
    def read_emails(self, folder="INBOX", limit=10, unread_only=False):
        """Read emails from the specified folder"""
        try:
            if not self.imap:
                result = self.connect()
                if not result["success"]:
                    return result
            
            self.imap.select(folder)
            search_criterion = "UNSEEN" if unread_only else "ALL"
            _, data = self.imap.search(None, search_criterion)
            email_ids = data[0].split()
            
            # Get the most recent emails up to the limit
            emails = []
            for num in reversed(email_ids[-limit:]):
                _, data = self.imap.fetch(num, "(RFC822)")
                msg = email.message_from_bytes(data[0][1])
                
                # Extract email details
                subject = msg["subject"]
                sender = msg["from"]
                date = msg["date"]
                
                # Get body
                body = ""
                if msg.is_multipart():
                    for part in msg.walk():
                        content_type = part.get_content_type()
                        if content_type == "text/plain":
                            body = part.get_payload(decode=True).decode()
                            break
                else:
                    body = msg.get_payload(decode=True).decode()
                
                emails.append({
                    "id": num.decode(),
                    "subject": subject,
                    "sender": sender,
                    "date": date,
                    "body": body
                })
            
            return {"success": True, "emails": emails}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def send_email(self, to, subject, body, html=False, attachments=None):
        """Send an email"""
        try:
            if not self.smtp:
                result = self.connect()
                if not result["success"]:
                    return result
            
            msg = MIMEMultipart()
            msg["From"] = self.username
            msg["To"] = to
            msg["Subject"] = subject
            
            # Add body
            content_type = "html" if html else "plain"
            msg.attach(MIMEText(body, content_type))
            
            # Add attachments if any
            if attachments:
                for attachment in attachments:
                    filename = attachment["filename"]
                    content = base64.b64decode(attachment["content"])
                    
                    part = MIMEBase("application", "octet-stream")
                    part.set_payload(content)
                    encoders.encode_base64(part)
                    part.add_header("Content-Disposition", f"attachment; filename={filename}")
                    msg.attach(part)
            
            # Send email
            self.smtp.send_message(msg)
            
            return {"success": True, "message": "Email sent successfully"}
        except Exception as e:
            return {"success": False, "error": str(e)}

# Define the email tool MCP
email_tool = MCP(
    name="email",
    description="Send and read emails",
    input_schema={
        "action": str,  # "read" or "send"
        "imap_server": str,
        "smtp_server": str,
        "username": str,
        "password": str,
        # For reading emails
        "folder": str,
        "limit": int,
        "unread_only": bool,
        # For sending emails
        "to": str,
        "subject": str,
        "body": str,
        "html": bool,
        "attachments": list
    },
    output_schema={
        "success": bool,
        "emails": list,
        "message": str,
        "error": str
    },
    fn=lambda params: {
        client := EmailClient(
            params["imap_server"],
            params["smtp_server"],
            params["username"],
            params["password"]
        ),
        result := (client.read_emails(
            params.get("folder", "INBOX"),
            params.get("limit", 10),
            params.get("unread_only", False)
        ) if params["action"] == "read" else client.send_email(
            params["to"],
            params["subject"],
            params["body"],
            params.get("html", False),
            params.get("attachments", None)
        )),
        client.disconnect(),
        return result
    }["return"]
)`
  },
  {
    value: 'azure-functions',
    label: 'Azure Functions Tool',
    description: 'Invokes Azure Functions serverless compute with authentication, payload transformation, and response handling.',
    source: 'Microsoft',
    version: '1.0.0',
    versionedId: generateToolId('1.0.0').id,
    createdAt: new Date().toISOString(),
    tags: ['Cloud', 'Community'],
    code: `from langgraph.mcp import MCP
import requests
import json

class AzureFunctionsClient:
    def __init__(self, function_app_url, api_key=None):
        self.function_app_url = function_app_url.rstrip('/')
        self.api_key = api_key
    
    def call_function(self, function_name, payload, http_method="POST"):
        """Call an Azure Function"""
        try:
            url = f"{self.function_app_url}/api/{function_name}"
            
            # Set up headers
            headers = {
                "Content-Type": "application/json"
            }
            
            # Add API key if provided
            if self.api_key:
                headers["x-functions-key"] = self.api_key
            
            # Make the request
            if http_method.upper() == "GET":
                response = requests.get(url, params=payload, headers=headers)
            else:
                response = requests.post(url, json=payload, headers=headers)
            
            # Process response
            response.raise_for_status()
            
            try:
                return response.json()
            except json.JSONDecodeError:
                return {"text": response.text}
                
        except requests.exceptions.RequestException as e:
            return {
                "error": str(e),
                "status_code": getattr(e.response, 'status_code', None),
                "response": getattr(e.response, 'text', None)
            }

# Define the Azure Functions tool MCP
azure_functions_tool = MCP(
    name="azure_functions",
    description="Call Azure Functions serverless compute",
    input_schema={
        "function_app_url": str,
        "function_name": str,
        "payload": dict,
        "api_key": str,
        "http_method": str
    },
    output_schema=dict,
    fn=lambda params: AzureFunctionsClient(
        params["function_app_url"],
        params.get("api_key")
    ).call_function(
        params["function_name"],
        params["payload"],
        params.get("http_method", "POST")
    )
)`
  },
];

interface ToolDetailsFormProps {
  node: WorkflowNode;
}

const ToolDetailsForm: React.FC<ToolDetailsFormProps> = ({ node }) => {
  const { updateNode } = useWorkflowContext();
  const { mode } = useThemeContext();
  const [toolType, setToolType] = useState(node.toolType || '');
  const [isEditingTool, setIsEditingTool] = useState(false);
  const [toolCode, setToolCode] = useState('');
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [sortBy, setSortBy] = useState<'name' | 'category'>('name');
  
  // Filter menu handlers
  const handleFilterOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  const handleCategoryToggle = (category: string) => {
    const categoryTags = TOOL_TAGS
      .filter(tag => tag.category === category)
      .map(tag => tag.value);
    
    const allSelected = categoryTags.every(tag => selectedTags.includes(tag));
    
    if (allSelected) {
      // Remove all tags in this category
      setSelectedTags(prev => prev.filter(tag => !categoryTags.includes(tag)));
    } else {
      // Add all tags in this category that aren't already selected
      const tagsToAdd = categoryTags.filter(tag => !selectedTags.includes(tag));
      setSelectedTags(prev => [...prev, ...tagsToAdd]);
    }
  };

  // Filter tools based on search query and selected tags
  const filteredTools = TOOL_TYPES.filter(tool => {
    // Filter by search query
    const matchesSearch = 
      searchQuery === '' || 
      tool.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    // Filter by selected tags
    const matchesTags = 
      selectedTags.length === 0 || 
      selectedTags.some(tag => tool.tags?.includes(tag));
    
    return matchesSearch && matchesTags;
  }).sort((a, b) => {
    if (sortBy === 'name') {
      return a.label.localeCompare(b.label);
    } else {
      return a.source.localeCompare(b.source);
    }
  });

  // Update form when node changes
  useEffect(() => {
    setToolType(node.toolType || '');
    setIsEditingTool(false);
    
    // Set tool code based on selected tool type
    if (node.toolType) {
      const selectedTool = TOOL_TYPES.find(tool => tool.value === node.toolType);
      if (selectedTool) {
        // If the node has custom code, use it, otherwise use the template
        setToolCode(node.content && node.content !== `This is a tool component.` ? 
          node.content : selectedTool.code);
      }
    }
  }, [node]);

  // Handle saving tool details
  const { 
    loading: saveLoading, 
    error: saveError, 
    execute: executeSave,
    reset: resetSaveError
  } = useAsyncOperation<void>(async () => {
    const updates: Partial<WorkflowNode> = {};
    
    // Include toolType for tool nodes
    updates.toolType = toolType;
    
    // For tools in edit mode, save the tool code as content
    if (isEditingTool) {
      updates.content = toolCode;
    }
    
    // Add version information from the selected tool
    if (toolType) {
      const selectedTool = TOOL_TYPES.find(tool => tool.value === toolType);
      if (selectedTool) {
        updates.version = selectedTool.version;
        updates.versionedId = selectedTool.versionedId;
        updates.createdAt = selectedTool.createdAt;
      }
    }
    
    updateNode(node.id, updates);
    
    // Exit editing mode after saving
    if (isEditingTool) {
      setIsEditingTool(false);
    }
  });

  const handleSave = () => {
    if (isEditingTool) {
      validateCode().then(() => {
        executeSave();
      }).catch(() => {
        // Validation failed, don't save
      });
    } else {
      executeSave();
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    setToolType(node.toolType || '');
    setIsEditingTool(false);
    
    // Set tool code based on selected tool type
    if (node.toolType) {
      const selectedTool = TOOL_TYPES.find(tool => tool.value === node.toolType);
      if (selectedTool) {
        // If the node has custom code, use it, otherwise use the template
        setToolCode(node.content && node.content !== `This is a tool component.` ? 
          node.content : selectedTool.code);
      }
    }
  };

  // Expose the functions to save and cancel changes
  useEffect(() => {
    // Track if there are unsaved changes
    let isModified = false;
    
    if (toolType !== (node.toolType || '')) {
      isModified = true;
    }
    
    if (isEditingTool && toolCode !== (node.content || '')) {
      isModified = true;
    }

    // Expose functions for the DetailsPanel to call
    (window as any).saveNodeChanges = handleSave;
    (window as any).cancelNodeChanges = handleCancel;
    (window as any).isNodeModified = isModified;

    return () => {
      // Clean up
      delete (window as any).saveNodeChanges;
      delete (window as any).cancelNodeChanges;
      delete (window as any).isNodeModified;
    };
  }, [toolType, toolCode, isEditingTool, node]);

  // Handle code validation
  const { 
    loading: validationLoading, 
    error: validationError, 
    execute: validateCode,
    reset: resetValidationError
  } = useAsyncOperation<boolean>(async (code: string) => {
    // Simple validation - check for required imports and MCP definition
    if (!code.includes('from langgraph.mcp import MCP')) {
      throw new Error('Code must import MCP from langgraph.mcp');
    }
    
    if (!code.includes('MCP(')) {
      throw new Error('Code must define an MCP instance');
    }
    
    return true;
  });

  // Validate code when it changes
  useEffect(() => {
    if (isEditingTool && toolCode) {
      const timeoutId = setTimeout(() => {
        validateCode(toolCode);
      }, 1000); // Debounce validation
      
      return () => clearTimeout(timeoutId);
    }
  }, [toolCode, isEditingTool, validateCode]);

  // Render different content based on editing mode
  const renderContent = () => {
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
                {/* Display version information in the selected tool card */}
                <Box sx={{ display: 'flex', mt: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1 }}>
                    ID: {selectedToolInfo.versionedId}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Version: {selectedToolInfo.version}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  Created: {new Date(selectedToolInfo.createdAt).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          )}
          
          {/* Code editor for the selected tool */}
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
            MCP Code
          </Typography>
          
          {validationError && (
            <Box sx={{ mb: 2 }}>
              <ErrorMessage 
                message="Code validation error" 
                details={validationError.message}
                compact
                onRetry={() => resetValidationError()}
              />
            </Box>
          )}
          
          <Box sx={{ flexGrow: 1, mb: 2, border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
            {validationLoading ? (
              <Box sx={{ p: 2 }}>
                <LoadingIndicator 
                  type="dots" 
                  size="small" 
                  centered={false} 
                  message="Validating code..."
                />
              </Box>
            ) : (
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
            )}
          </Box>
        </Box>
      );
    } else {
      // Show the list of tool cards with edit buttons
      return (
        <Box sx={{ mb: 2, mt: 2 }}>
          {/* Search and filter bar */}
          <Box sx={{ display: 'flex', mb: 3, gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <IconButton 
              onClick={handleFilterOpen} 
              color={selectedTags.length > 0 ? "primary" : "default"}
              title="Filter by tags"
            >
              <FilterListIcon />
            </IconButton>
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
              PaperProps={{
                style: {
                  maxHeight: 400,
                  width: 280,
                },
              }}
            >
              {/* Sort options */}
              <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Sort by
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip 
                    label="Name" 
                    onClick={() => setSortBy('name')} 
                    color={sortBy === 'name' ? 'primary' : 'default'}
                    size="small"
                    variant={sortBy === 'name' ? 'filled' : 'outlined'}
                  />
                  <Chip 
                    label="Source" 
                    onClick={() => setSortBy('category')} 
                    color={sortBy === 'category' ? 'primary' : 'default'}
                    size="small"
                    variant={sortBy === 'category' ? 'filled' : 'outlined'}
                  />
                </Box>
              </Box>
              
              {/* Filter by category */}
              {['Source', 'Technology', 'Functionality'].map(category => {
                const categoryTags = TOOL_TAGS.filter(tag => tag.category === category);
                const allSelected = categoryTags.every(tag => selectedTags.includes(tag.value));
                const someSelected = categoryTags.some(tag => selectedTags.includes(tag.value)) && !allSelected;
                
                return (
                  <Box key={category} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <MenuItem 
                      dense 
                      onClick={() => handleCategoryToggle(category)}
                      sx={{ bgcolor: someSelected ? 'action.selected' : 'inherit' }}
                    >
                      <Checkbox 
                        checked={allSelected} 
                        indeterminate={someSelected}
                        sx={{ p: 0.5 }}
                      />
                      <ListItemText 
                        primary={category} 
                        primaryTypographyProps={{ variant: 'subtitle2' }} 
                      />
                    </MenuItem>
                    {categoryTags.map(tag => (
                      <MenuItem 
                        key={tag.value} 
                        onClick={() => handleTagToggle(tag.value)}
                        dense
                        sx={{ pl: 4 }}
                      >
                        <Checkbox 
                          checked={selectedTags.includes(tag.value)} 
                          sx={{ p: 0.5 }}
                        />
                        <ListItemText primary={tag.value} />
                      </MenuItem>
                    ))}
                  </Box>
                );
              })}
            </Menu>
          </Box>

          {/* Selected tags display and result count */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, flex: 1 }}>
              {selectedTags.length > 0 && (
                <>
                  {selectedTags.map(tag => (
                    <Chip 
                      key={tag} 
                      label={tag} 
                      onDelete={() => handleTagToggle(tag)} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  ))}
                  <Chip 
                    label="Clear all" 
                    onClick={() => setSelectedTags([])} 
                    size="small" 
                    variant="outlined"
                  />
                </>
              )}
            </Box>
            {filteredTools.length > 0 && (
              <Typography variant="caption" color="text.secondary">
                {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'} found
              </Typography>
            )}
          </Box>

          {/* Tool cards */}
          <Box sx={{ mt: 2 }}>
            {filteredTools.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No tools match your search criteria
              </Typography>
            ) : (
              filteredTools.map(tool => (
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
                            // Reset any validation errors
                            resetValidationError();
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
                      
                      {/* Display tags */}
                      {tool.tags && tool.tags.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                          {tool.tags.map(tag => (
                            <Chip 
                              key={tag} 
                              label={tag} 
                              size="small" 
                              variant="outlined"
                              sx={{ height: 20, '& .MuiChip-label': { px: 1, py: 0 } }}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent card selection
                                if (!selectedTags.includes(tag)) {
                                  setSelectedTags(prev => [...prev, tag]);
                                }
                              }}
                            />
                          ))}
                        </Box>
                      )}
                      
                      {/* Display version information in each tool card */}
                      <Box sx={{ display: 'flex', mt: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1 }}>
                          ID: {tool.versionedId}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Version: {tool.version}
                        </Typography>
                      </Box>
                    </CardActionArea>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        </Box>
      );
    }
  };

  return (
    <>
      {renderContent()}
      
      {saveError && (
        <Box sx={{ mb: 2 }}>
          <ErrorMessage 
            message="Failed to save changes" 
            details={saveError.message}
            onRetry={() => {
              resetSaveError();
              executeSave();
            }}
          />
        </Box>
      )}
    </>
  );
};

export default ToolDetailsForm;
