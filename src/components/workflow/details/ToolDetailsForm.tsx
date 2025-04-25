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
import EditIcon from '@mui/icons-material/Edit';
import Editor from '@monaco-editor/react';
import { WorkflowNode } from '../../../types/nodeTypes';
import { useWorkflowContext } from '../../../context/WorkflowContext';
import { useThemeContext } from '../../../context/ThemeContext';

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
    description: 'Execute SQL queries across multiple database types (PostgreSQL, MySQL, SQLite) with automatic connection management and query validation.',
    source: 'LangChain',
    code: `from langgraph.mcp import MCP
from sqlalchemy import create_engine, text
import re

class DatabaseConnector:
    def __init__(self):
        self.connections = {}
        
    def execute_query(self, db_type, connection_string, query):
        """Execute a SQL query on the specified database"""
        try:
            # Simple SQL injection prevention
            if self._is_dangerous_query(query):
                return {"error": "Potentially harmful query detected"}
                
            # Get or create connection
            conn_key = f"{db_type}:{connection_string}"
            if conn_key not in self.connections:
                engine = create_engine(connection_string)
                self.connections[conn_key] = engine
            
            # Execute query
            with self.connections[conn_key].connect() as connection:
                result = connection.execute(text(query))
                if result.returns_rows:
                    columns = result.keys()
                    rows = [dict(zip(columns, row)) for row in result.fetchall()]
                    return {"results": rows, "rowCount": len(rows)}
                else:
                    return {"rowCount": result.rowcount, "message": "Query executed successfully"}
        except Exception as e:
            return {"error": str(e)}
    
    def _is_dangerous_query(self, query):
        """Check if query contains potentially harmful operations"""
        dangerous_patterns = [
            r'\bDROP\b',
            r'\bDELETE\b',
            r'\bTRUNCATE\b',
            r'\bALTER\b'
        ]
        return any(re.search(pattern, query, re.IGNORECASE) for pattern in dangerous_patterns)

# Initialize the database connector
db_connector = DatabaseConnector()

# Define the SQL tool MCP
sql_tool = MCP(
    name="sql",
    description="Execute SQL queries on databases",
    input_schema={
        "db_type": str,  # "postgresql", "mysql", "sqlite"
        "connection_string": str,
        "query": str
    },
    output_schema={
        "results": list,
        "rowCount": int,
        "message": str,
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
    description: 'Send and receive emails through IMAP/SMTP with support for attachments, HTML content, and folder management.',
    source: 'LangChain',
    code: `from langgraph.mcp import MCP
import imaplib
import smtplib
import email
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import base64
import os

class EmailClient:
    def __init__(self, imap_server, smtp_server, username, password):
        self.imap_server = imap_server
        self.smtp_server = smtp_server
        self.username = username
        self.password = password
        self.imap = None
        self.smtp = None
    
    def connect(self):
        """Connect to both IMAP and SMTP servers"""
        try:
            # Connect to IMAP
            self.imap = imaplib.IMAP4_SSL(self.imap_server)
            self.imap.login(self.username, self.password)
            
            # Connect to SMTP
            self.smtp = smtplib.SMTP(self.smtp_server, 587)
            self.smtp.starttls()
            self.smtp.login(self.username, self.password)
            
            return True
        except Exception as e:
            return str(e)
    
    def disconnect(self):
        """Disconnect from both servers"""
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
    
    def send_email(self, to_email, subject, body, html=None, attachments=None):
        """Send an email with optional HTML content and attachments"""
        try:
            if not self.smtp:
                result = self.connect()
                if result is not True:
                    return {"error": f"Connection failed: {result}"}
            
            msg = MIMEMultipart('alternative')
            msg['From'] = self.username
            msg['To'] = to_email
            msg['Subject'] = subject
            
            # Attach text body
            msg.attach(MIMEText(body, 'plain'))
            
            # Attach HTML body if provided
            if html:
                msg.attach(MIMEText(html, 'html'))
            
            # Add attachments if provided
            if attachments:
                for attachment in attachments:
                    filename = attachment.get('filename')
                    content = attachment.get('content')
                    
                    if filename and content:
                        # Decode base64 content
                        try:
                            file_content = base64.b64decode(content)
                        except:
                            return {"error": f"Invalid base64 content for {filename}"}
                        
                        part = MIMEBase('application', 'octet-stream')
                        part.set_payload(file_content)
                        encoders.encode_base64(part)
                        part.add_header('Content-Disposition', f'attachment; filename="{filename}"')
                        msg.attach(part)
            
            # Send the email
            self.smtp.sendmail(self.username, to_email, msg.as_string())
            return {"success": True, "message": "Email sent successfully"}
        except Exception as e:
            return {"error": str(e)}
        finally:
            self.disconnect()
    
    def read_emails(self, folder="INBOX", limit=10, unread_only=False):
        """Read emails from the specified folder"""
        try:
            if not self.imap:
                result = self.connect()
                if result is not True:
                    return {"error": f"Connection failed: {result}"}
            
            # Select the folder
            self.imap.select(folder)
            
            # Search for emails
            search_criteria = '(UNSEEN)' if unread_only else 'ALL'
            status, data = self.imap.search(None, search_criteria)
            
            if status != 'OK':
                return {"error": "Failed to search emails"}
            
            email_ids = data[0].split()
            emails = []
            
            # Get the most recent emails up to the limit
            for email_id in reversed(email_ids[:limit]):
                status, data = self.imap.fetch(email_id, '(RFC822)')
                
                if status != 'OK':
                    continue
                
                raw_email = data[0][1]
                msg = email.message_from_bytes(raw_email)
                
                # Extract email details
                email_data = {
                    "id": email_id.decode(),
                    "from": msg.get("From", ""),
                    "to": msg.get("To", ""),
                    "subject": msg.get("Subject", ""),
                    "date": msg.get("Date", ""),
                    "body": ""
                }
                
                # Get email body
                if msg.is_multipart():
                    for part in msg.walk():
                        content_type = part.get_content_type()
                        content_disposition = str(part.get("Content-Disposition"))
                        
                        if content_type == "text/plain" and "attachment" not in content_disposition:
                            email_data["body"] = part.get_payload(decode=True).decode()
                            break
                else:
                    email_data["body"] = msg.get_payload(decode=True).decode()
                
                emails.append(email_data)
            
            return {"emails": emails, "count": len(emails)}
        except Exception as e:
            return {"error": str(e)}
        finally:
            self.disconnect()

# Define the email tool MCP
email_tool = MCP(
    name="email",
    description="Send and read emails",
    input_schema={
        "action": str,  # "send" or "read"
        "imap_server": str,
        "smtp_server": str,
        "username": str,
        "password": str,
        # For send action
        "to_email": str,
        "subject": str,
        "body": str,
        "html": str,
        # For read action
        "folder": str,
        "limit": int,
        "unread_only": bool
    },
    output_schema={
        "success": bool,
        "message": str,
        "emails": list,
        "count": int,
        "error": str
    },
    fn=lambda params: {
        # Create email client
        client = EmailClient(
            params["imap_server"],
            params["smtp_server"],
            params["username"],
            params["password"]
        ),
        # Call appropriate method based on action
        return client.send_email(
            params["to_email"],
            params["subject"],
            params["body"],
            params.get("html"),
            params.get("attachments")
        ) if params["action"] == "send" else client.read_emails(
            params.get("folder", "INBOX"),
            params.get("limit", 10),
            params.get("unread_only", False)
        )
    }
)`
  },
  {
    value: 'azure-functions',
    label: 'Azure Functions Tool',
    description: 'Call Azure Functions for serverless computation, data processing, or integration with other Azure services.',
    source: 'Microsoft',
    code: `from langgraph.mcp import MCP
import requests
import json

class AzureFunctionsClient:
    def __init__(self, function_app_url, api_key=None):
        self.function_app_url = function_app_url
        self.api_key = api_key
        
    def call_function(self, function_name, payload, http_method="POST"):
        """Call an Azure Function with the provided payload"""
        try:
            # Construct the function URL
            function_url = f"{self.function_app_url}/api/{function_name}"
            
            # Set up headers
            headers = {
                "Content-Type": "application/json"
            }
            
            # Add API key if provided
            if self.api_key:
                headers["x-functions-key"] = self.api_key
            
            # Make the request
            if http_method.upper() == "GET":
                response = requests.get(function_url, params=payload, headers=headers)
            else:  # Default to POST
                response = requests.post(function_url, json=payload, headers=headers)
            
            # Check if the request was successful
            response.raise_for_status()
            
            # Try to parse JSON response
            try:
                result = response.json()
            except json.JSONDecodeError:
                # Return text response if not JSON
                result = {"text_response": response.text}
            
            return {"status_code": response.status_code, "result": result}
        except requests.exceptions.RequestException as e:
            return {"error": str(e)}

# Define the Azure Functions tool MCP
azure_functions_tool = MCP(
    name="azure_functions",
    description="Call Azure Functions for remote computation",
    input_schema={
        "function_app_url": str,
        "function_name": str,
        "payload": dict,
        "api_key": str,
        "http_method": str
    },
    output_schema={
        "status_code": int,
        "result": dict,
        "error": str
    },
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

  const handleSave = () => {
    const updates: any = {};
    
    // Include toolType for tool nodes
    updates.toolType = toolType;
    
    // For tools in edit mode, save the tool code as content
    if (isEditingTool) {
      updates.content = toolCode;
    }
    
    updateNode(node.id, updates);
    
    // Exit editing mode after saving
    if (isEditingTool) {
      setIsEditingTool(false);
    }
  };

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
  };

  return (
    <>
      {renderContent()}
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </Box>
    </>
  );
};

export default ToolDetailsForm;
