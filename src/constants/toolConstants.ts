/**
 * Constants for tool types used in the application
 */

// Tool types with descriptions, sources, and MCP code templates
export const TOOL_TYPES = [
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

// Map of tool types to display names
export const TOOL_DISPLAY_NAMES: Record<string, string> = {
  'stagehand-browser': 'Stagehand Browser',
  'vector-store-retriever': 'Vector-Store Retriever',
  'calculator-math': 'Calculator / Math',
  'multi-database-sql': 'Multi-Database SQL',
  'email-imap-smtp': 'Email (IMAP/SMTP)',
  'azure-functions': 'Azure Functions',
};
