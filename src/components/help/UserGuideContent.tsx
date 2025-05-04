import React from 'react';
import {
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  useTheme,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const UserGuideContent: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box>
      <Typography variant="h4" gutterBottom color="primary" id="user-guide-title">
        LangGraph Designer User Guide
      </Typography>
      
      {/* Table of Contents */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          mb: 4,
          bgcolor: isDarkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(248, 249, 250, 0.9)',
          borderRadius: 1
        }}
      >
        <Typography variant="h6" gutterBottom>Table of Contents</Typography>
        <List dense>
          <ListItem component="a" href="#introduction" sx={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItemText primary="1. Introduction" />
          </ListItem>
          <ListItem component="a" href="#getting-started" sx={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItemText primary="2. Getting Started" />
          </ListItem>
          <ListItem component="a" href="#interface-overview" sx={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItemText primary="3. Interface Overview" />
          </ListItem>
          <ListItem component="a" href="#creating-workflows" sx={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItemText primary="4. Creating Workflows" />
          </ListItem>
          <ListItem component="a" href="#working-with-agents" sx={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItemText primary="5. Working with Agents" />
          </ListItem>
          <ListItem component="a" href="#working-with-tools" sx={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItemText primary="6. Working with Tools" />
          </ListItem>
          <ListItem component="a" href="#working-with-memory" sx={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItemText primary="7. Working with Memory" />
          </ListItem>
          <ListItem component="a" href="#validation-system" sx={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItemText primary="8. Validation System" />
          </ListItem>
          <ListItem component="a" href="#work-group-management" sx={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItemText primary="9. Work Group Management" />
          </ListItem>
          <ListItem component="a" href="#troubleshooting" sx={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItemText primary="10. Troubleshooting" />
          </ListItem>
        </List>
      </Paper>

      {/* Introduction */}
      <Box id="introduction" sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom color="primary">
          1. Introduction
        </Typography>
        <Typography paragraph>
          The LangGraph Designer is a powerful visual tool for creating and managing agent workflows. It allows you to design, test, and deploy complex AI agent systems with a user-friendly interface.
        </Typography>
        
        <Typography variant="h6" gutterBottom>Key Features</Typography>
        <List>
          <ListItem>
            <ListItemText primary="Visual workflow designer for creating agent-based systems" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Support for multiple agent types and configurations" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Integration with various LLM models including GPT-4o, Claude 3.7, and more" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Built-in tool library for extending agent capabilities" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Memory management for persistent agent state" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Work group management for team collaboration" />
          </ListItem>
          <ListItem>
            <ListItemText primary="User validation system for security compliance" />
          </ListItem>
        </List>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      {/* Getting Started */}
      <Box id="getting-started" sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom color="primary">
          2. Getting Started
        </Typography>
        
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">System Requirements</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem>
                <ListItemText primary="Modern web browser (Chrome, Firefox, Safari, Edge)" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Internet connection for API access" />
              </ListItem>
              <ListItem>
                <ListItemText primary="API keys for LLM services (if using custom credentials)" />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
        
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Accessing the Platform</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>
              1. Navigate to the landing page<br />
              2. Choose one of the three main sections:
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Workflow Designer" 
                  secondary="Create and edit agent workflows" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Accounts Management" 
                  secondary="Manage work groups and user access" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Command Center" 
                  secondary="Monitor and deploy workflows" 
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      {/* Interface Overview */}
      <Box id="interface-overview" sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom color="primary">
          3. Interface Overview
        </Typography>
        
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Workflow Designer</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>
              The main workspace for creating agent workflows with three panels:
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Left Panel" 
                  secondary="Conversation panel for testing agent interactions" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Middle Panel" 
                  secondary="Visual workflow graph editor" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Right Panel" 
                  secondary="Details panel for configuring selected components" 
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
        
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Accounts Page</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>
              The administrative interface for managing work groups and user access:
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Work group listing with filtering and search" />
              </ListItem>
              <ListItem>
                <ListItemText primary="User management with validation tracking" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Access request processing" />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      {/* Creating Workflows */}
      <Box id="creating-workflows" sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom color="primary">
          4. Creating Workflows
        </Typography>
        
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Workflow Basics</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>
              A workflow consists of connected nodes representing different components of an agent system:
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Agent Nodes" 
                  secondary="The core AI agents that process information and make decisions" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Tool Nodes" 
                  secondary="External capabilities that agents can use" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Memory Nodes" 
                  secondary="Storage systems for maintaining context" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Operator Nodes" 
                  secondary="Control flow elements for complex workflows" 
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
        
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Creating a New Workflow</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>
              1. Navigate to the Workflow Designer<br />
              2. Click "Create New Workflow" in the header<br />
              3. Provide a name and description for your workflow<br />
              4. Add your first agent by clicking the "Add Agent" button
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      {/* Working with Agents */}
      <Box id="working-with-agents" sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom color="primary">
          5. Working with Agents
        </Typography>
        
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Agent Types</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>
              The platform supports multiple agent types, each with specific capabilities:
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Assistant" 
                  secondary="General purpose assistant agent" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Tool User" 
                  secondary="Agent specialized in using tools" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Reasoning Agent" 
                  secondary="Enhanced reasoning capabilities" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Planner" 
                  secondary="Creates and executes plans" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Researcher" 
                  secondary="Specialized in information gathering" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Domain Specialist" 
                  secondary="Expert in a specific knowledge domain" 
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
        
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Configuring Agents</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>
              1. Select an agent node in the workflow graph<br />
              2. Use the details panel to configure:
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Agent Name and Description" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Agent Type" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Agent Icon" />
              </ListItem>
              <ListItem>
                <ListItemText primary="LLM Model" />
              </ListItem>
              <ListItem>
                <ListItemText primary="System Prompt" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Advanced Settings" />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      {/* Working with Tools */}
      <Box id="working-with-tools" sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom color="primary">
          6. Working with Tools
        </Typography>
        
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Available Tools</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>
              The platform includes several pre-built tools:
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Stagehand Browser" 
                  secondary="Web interaction (navigate, click, scrape)" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Vector-Store Retriever" 
                  secondary="RAG with vector databases" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Calculator / Math" 
                  secondary="Mathematical operations" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Multi-Database SQL" 
                  secondary="Database querying" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Email (IMAP/SMTP)" 
                  secondary="Email automation" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Azure Functions" 
                  secondary="Serverless compute integration" 
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
        
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Adding Tools to Agents</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>
              1. Select an agent node<br />
              2. Click on the tool diamond at the bottom<br />
              3. Choose a tool type from the available options<br />
              4. Configure the tool parameters in the details panel
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      {/* Working with Memory */}
      <Box id="working-with-memory" sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom color="primary">
          7. Working with Memory
        </Typography>
        
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Memory Types</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>
              The platform supports various memory types:
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Conversation Buffer" 
                  secondary="Short-term working memory" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Sliding-Window" 
                  secondary="Buffer window memory" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Summary Memory" 
                  secondary="Condensed conversation history" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Entity / Knowledge-Graph" 
                  secondary="Structured information storage" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Vector-Store" 
                  secondary="Retrieval-based memory" 
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      {/* Validation System */}
      <Box id="validation-system" sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom color="primary">
          8. Validation System
        </Typography>
        
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body1" fontWeight="bold">
            Important: Regular validation is required to maintain access. Users will receive warnings as their validation period approaches expiration.
          </Typography>
        </Alert>
        
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Validation Lifecycle</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>
              Users start with 153 days of validation. Warning system begins at specific intervals:
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="28 days" 
                  secondary="First warning" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="21 days" 
                  secondary="Second warning" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="14 days" 
                  secondary="Third warning with escalation" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="7 days" 
                  secondary="Final warning before access removal" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="0 days" 
                  secondary="Access expired and will be removed" 
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
        
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Managing Validations</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>
              1. Navigate to the Accounts page<br />
              2. Select a work group<br />
              3. Go to the Users tab<br />
              4. View validation status for each user<br />
              5. Click the validate button to reset a user's validation period
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      {/* Work Group Management */}
      <Box id="work-group-management" sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom color="primary">
          9. Work Group Management
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body1">
            Tip: Work group owners can view pending approval requests by clicking on the number in the Pending Approvals column.
          </Typography>
        </Alert>
        
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Creating Work Groups</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>
              1. Navigate to the Accounts page<br />
              2. Click "Create Work Group"<br />
              3. Provide a name, scope (Public/Restricted), and description<br />
              4. Click "Save" to create the work group
            </Typography>
          </AccordionDetails>
        </Accordion>
        
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Managing Users</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>
              1. Click on a work group name to open details<br />
              2. Go to the Users tab<br />
              3. Click "Add User" to add new users<br />
              4. Choose between ATT ID or Client ID<br />
              5. Set appropriate access levels and permissions
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      {/* Troubleshooting */}
      <Box id="troubleshooting" sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom color="primary">
          10. Troubleshooting
        </Typography>
        
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Common Issues</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Connection errors" 
                  secondary="Check your internet connection and API credentials" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Workflow validation errors" 
                  secondary="Ensure all required fields are completed" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Performance issues" 
                  secondary="Try reducing the complexity of your workflow" 
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
        
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Getting Help</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>
              For additional assistance:
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Check the inline help tooltips throughout the interface" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Refer to this user guide for detailed instructions" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Contact support through the help button in the header" />
              </ListItem>
            </List>
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Tip: Hover over the help icons (?) next to form fields for contextual help and explanations.
              </Typography>
            </Alert>
          </AccordionDetails>
        </Accordion>
      </Box>
      
      <Box sx={{ mt: 6, mb: 2, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="body2">
          LangGraph Designer Documentation © 2025
        </Typography>
      </Box>
    </Box>
  );
};

export default UserGuideContent;
