import { ulid } from 'ulid';
import { ToolType } from '../../../../types/nodeTypes';

// Helper function to generate unique tool IDs
export const generateToolId = (version: string) => {
  return {
    id: ulid(),
    version,
    createdAt: new Date().toISOString()
  };
};

// Tool tags for filtering
export const TOOL_TAGS = [
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

// Tool code templates
export const TOOL_CODE_TEMPLATES = {
  'stagehand-browser': `from langgraph.mcp import MCP
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
)`,
  'vector-store-retriever': `from langgraph.mcp import MCP
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
)`,
  'calculator-math': `from langgraph.mcp import MCP
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
)`,
  'multi-database-sql': `from langgraph.mcp import MCP
import sqlalchemy

class DatabaseConnector:
    def __init__(self):
        self.connections = {}
        
    def execute_query(self, db_type, connection_string, query):
        """Execute a SQL query on the specified database"""
        try:
            # Get or create connection
            if connection_string not in self.connections:
                engine = sqlalchemy.create_engine(connection_string)
                self.connections[connection_string] = engine
            else:
                engine = self.connections[connection_string]
                
            # Execute query
            with engine.connect() as connection:
                result = connection.execute(sqlalchemy.text(query))
                if result.returns_rows:
                    # Convert to list of dicts for JSON serialization
                    columns = result.keys()
                    rows = [dict(zip(columns, row)) for row in result.fetchall()]
                    return {"rows": rows, "rowCount": len(rows)}
                else:
                    return {"rowCount": result.rowcount, "message": "Query executed successfully"}
                    
        except Exception as e:
            return {"error": str(e)}

# Initialize the database connector
db_connector = DatabaseConnector()

# Define the database tool MCP
database_tool = MCP(
    name="database",
    description="Execute SQL queries on various databases",
    input_schema={
        "db_type": str,  # "postgresql", "mysql", "sqlite", etc.
        "connection_string": str,
        "query": str
    },
    output_schema={
        "rows": list,
        "rowCount": int,
        "message": str,
        "error": str
    },
    fn=lambda params: db_connector.execute_query(
        params["db_type"],
        params["connection_string"],
        params["query"]
    )
)`,
  'email-imap-smtp': `from langgraph.mcp import MCP
import imaplib
import smtplib
import email
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class EmailClient:
    def __init__(self, imap_server, smtp_server, username, password):
        self.imap_server = imap_server
        self.smtp_server = smtp_server
        self.username = username
        self.password = password
        
    def read_emails(self, folder="INBOX", limit=10, unread_only=True):
        """Read emails from the specified folder"""
        try:
            # Connect to IMAP server
            mail = imaplib.IMAP4_SSL(self.imap_server)
            mail.login(self.username, self.password)
            mail.select(folder)
            
            # Search for emails
            search_criteria = "UNSEEN" if unread_only else "ALL"
            status, data = mail.search(None, search_criteria)
            email_ids = data[0].split()
            
            # Get the latest emails up to the limit
            latest_emails = email_ids[-limit:] if limit < len(email_ids) else email_ids
            
            emails = []
            for email_id in latest_emails:
                status, data = mail.fetch(email_id, "(RFC822)")
                raw_email = data[0][1]
                msg = email.message_from_bytes(raw_email)
                
                # Extract email details
                subject = msg["Subject"]
                sender = msg["From"]
                date = msg["Date"]
                
                # Get email body
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
                    "id": email_id.decode(),
                    "subject": subject,
                    "sender": sender,
                    "date": date,
                    "body": body
                })
            
            mail.close()
            mail.logout()
            
            return {"emails": emails, "count": len(emails)}
            
        except Exception as e:
            return {"error": str(e)}
    
    def send_email(self, to, subject, body, cc=None, bcc=None):
        """Send an email"""
        try:
            # Create message
            msg = MIMEMultipart()
            msg["From"] = self.username
            msg["To"] = to
            msg["Subject"] = subject
            
            if cc:
                msg["Cc"] = cc
            if bcc:
                msg["Bcc"] = bcc
                
            msg.attach(MIMEText(body, "plain"))
            
            # Connect to SMTP server
            server = smtplib.SMTP_SSL(self.smtp_server)
            server.login(self.username, self.password)
            
            # Send email
            recipients = [to]
            if cc:
                recipients.extend(cc.split(","))
            if bcc:
                recipients.extend(bcc.split(","))
                
            server.sendmail(self.username, recipients, msg.as_string())
            server.quit()
            
            return {"status": "success", "message": "Email sent successfully"}
            
        except Exception as e:
            return {"error": str(e)}

# Initialize the email client with placeholder credentials
# These should be securely stored and retrieved in a real application
email_client = EmailClient(
    imap_server="imap.example.com",
    smtp_server="smtp.example.com",
    username="agent@example.com",
    password="your_secure_password"
)

# Define the email tool MCP
email_tool = MCP(
    name="email",
    description="Send and read emails",
    input_schema={
        "action": str,  # "read" or "send"
        "to": str,
        "subject": str,
        "body": str,
        "cc": str,
        "bcc": str,
        "folder": str,
        "limit": int,
        "unread_only": bool
    },
    output_schema={
        "emails": list,
        "count": int,
        "status": str,
        "message": str,
        "error": str
    },
    fn=lambda params: (
        email_client.read_emails(
            folder=params.get("folder", "INBOX"),
            limit=params.get("limit", 10),
            unread_only=params.get("unread_only", True)
        ) if params["action"] == "read" else
        email_client.send_email(
            to=params["to"],
            subject=params["subject"],
            body=params["body"],
            cc=params.get("cc"),
            bcc=params.get("bcc")
        )
    )
)`,
  'azure-functions': `from langgraph.mcp import MCP
import requests
import json
import os

class AzureFunctionsClient:
    def __init__(self, function_app_url, api_key=None):
        self.function_app_url = function_app_url
        self.api_key = api_key
        
    def invoke_function(self, function_name, payload, method="POST"):
        """Invoke an Azure Function"""
        try:
            # Build the function URL
            url = f"{self.function_app_url}/api/{function_name}"
            
            # Add API key if provided
            headers = {}
            if self.api_key:
                headers["x-functions-key"] = self.api_key
            
            # Set content type for JSON payload
            headers["Content-Type"] = "application/json"
            
            # Make the request
            response = requests.request(
                method=method,
                url=url,
                headers=headers,
                data=json.dumps(payload) if payload else None
            )
            
            # Parse the response
            try:
                result = response.json()
            except:
                result = {"text": response.text}
                
            return {
                "status_code": response.status_code,
                "result": result,
                "headers": dict(response.headers)
            }
            
        except Exception as e:
            return {"error": str(e)}

# Initialize the Azure Functions client
# API key should be securely stored in environment variables
azure_client = AzureFunctionsClient(
    function_app_url=os.environ.get("AZURE_FUNCTION_APP_URL", "https://your-function-app.azurewebsites.net"),
    api_key=os.environ.get("AZURE_FUNCTION_API_KEY")
)

# Define the Azure Functions tool MCP
azure_functions_tool = MCP(
    name="azure_functions",
    description="Invoke Azure Functions",
    input_schema={
        "function_name": str,
        "payload": dict,
        "method": str
    },
    output_schema={
        "status_code": int,
        "result": dict,
        "headers": dict,
        "error": str
    },
    fn=lambda params: azure_client.invoke_function(
        function_name=params["function_name"],
        payload=params.get("payload", {}),
        method=params.get("method", "POST")
    )
)`
};

// Tool types with MCP code templates
export const TOOL_TYPES: ToolType[] = [
  {
    value: 'stagehand-browser',
    label: 'Stagehand Browser Tool',
    description: 'Gives an agent full, headless-browser super-powers (navigate, click, scrape, screenshot) through Browserbase; ideal for web search, form-filling, and UI testing workflows.',
    source: 'Stagehand',
    version: '1.0.0',
    versionedId: generateToolId('1.0.0').id,
    createdAt: new Date().toISOString(),
    tags: ['Automation', 'Scraping', 'Community'],
    code: TOOL_CODE_TEMPLATES['stagehand-browser']
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
    code: TOOL_CODE_TEMPLATES['vector-store-retriever']
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
    code: TOOL_CODE_TEMPLATES['calculator-math']
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
    code: TOOL_CODE_TEMPLATES['multi-database-sql']
  },
  {
    value: 'email-imap-smtp',
    label: 'Email (IMAP/SMTP) Tool',
    description: 'Enables agents to read and send emails using IMAP and SMTP protocols, with support for attachments, HTML content, and folder management.',
    source: 'Communication Tools',
    version: '1.0.0',
    versionedId: generateToolId('1.0.0').id,
    createdAt: new Date().toISOString(),
    tags: ['Communication', 'Automation', 'Community'],
    code: TOOL_CODE_TEMPLATES['email-imap-smtp']
  },
  {
    value: 'azure-functions',
    label: 'Azure Functions Tool',
    description: 'Invokes serverless Azure Functions to extend agent capabilities with custom code, external APIs, and enterprise system integrations.',
    source: 'Microsoft Azure',
    version: '1.0.0',
    versionedId: generateToolId('1.0.0').id,
    createdAt: new Date().toISOString(),
    tags: ['Cloud', 'API', 'Official'],
    code: TOOL_CODE_TEMPLATES['azure-functions']
  }
];
