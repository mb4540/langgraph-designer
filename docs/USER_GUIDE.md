# LangGraph Designer User Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Interface Overview](#interface-overview)
4. [Creating Workflows](#creating-workflows)
5. [Working with Agents](#working-with-agents)
6. [Working with Tools](#working-with-tools)
7. [Working with Memory](#working-with-memory)
8. [Validation System](#validation-system)
9. [Work Group Management](#work-group-management)
10. [Troubleshooting](#troubleshooting)

## Introduction

The LangGraph Designer is a powerful visual tool for creating and managing agent workflows. It allows you to design, test, and deploy complex AI agent systems with a user-friendly interface.

### Key Features

- Visual workflow designer for creating agent-based systems
- Support for multiple agent types and configurations
- Integration with various LLM models including GPT-4o, Claude 3.7, and more
- Built-in tool library for extending agent capabilities
- Memory management for persistent agent state
- Work group management for team collaboration
- User validation system for security compliance

## Getting Started

### System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for API access
- API keys for LLM services (if using custom credentials)

### Accessing the Platform

1. Navigate to the landing page
2. Choose one of the three main sections:
   - **Workflow Designer**: Create and edit agent workflows
   - **Accounts Management**: Manage work groups and user access
   - **Command Center**: Monitor and deploy workflows

## Interface Overview

The platform consists of three main sections:

### Landing Page

The central hub that provides access to all platform features through navigation cards.

### Workflow Designer

The main workspace for creating agent workflows with three panels:

- **Left Panel**: Conversation panel for testing agent interactions
- **Middle Panel**: Visual workflow graph editor
- **Right Panel**: Details panel for configuring selected components

### Accounts Page

The administrative interface for managing work groups and user access:

- Work group listing with filtering and search
- User management with validation tracking
- Access request processing

## Creating Workflows

### Workflow Basics

A workflow consists of connected nodes representing different components of an agent system:

- **Agent Nodes**: The core AI agents that process information and make decisions
- **Tool Nodes**: External capabilities that agents can use
- **Memory Nodes**: Storage systems for maintaining context
- **Operator Nodes**: Control flow elements for complex workflows

### Creating a New Workflow

1. Navigate to the Workflow Designer
2. Click "Create New Workflow" in the header
3. Provide a name and description for your workflow
4. Add your first agent by clicking the "Add Agent" button

### Saving and Versioning

Workflows are automatically versioned using semantic versioning (MAJOR.MINOR.PATCH):

1. Each workflow has a unique Version ID (ULID)
2. Version numbers can be manually updated in the Workflow Details panel
3. Changes are tracked with timestamps

## Working with Agents

### Agent Types

The platform supports multiple agent types, each with specific capabilities:

- **Assistant**: General purpose assistant agent
- **Tool User**: Agent specialized in using tools
- **Reasoning Agent**: Enhanced reasoning capabilities
- **Planner**: Creates and executes plans
- **Researcher**: Specialized in information gathering
- **Domain Specialist**: Expert in a specific knowledge domain

### Configuring Agents

1. Select an agent node in the workflow graph
2. Use the details panel to configure:
   - Agent Name and Description
   - Agent Type
   - Agent Icon
   - LLM Model
   - System Prompt
   - Advanced Settings

### Connecting Agents

Agents can be connected to create multi-agent workflows:

1. Click on the connection handle on the right side of an agent
2. Drag to create a new agent or connect to an existing one
3. Configure the connection type in the details panel

## Working with Tools

### Available Tools

The platform includes several pre-built tools:

- **Stagehand Browser**: Web interaction (navigate, click, scrape)
- **Vector-Store Retriever**: RAG with vector databases
- **Calculator / Math**: Mathematical operations
- **Multi-Database SQL**: Database querying
- **Email (IMAP/SMTP)**: Email automation
- **Azure Functions**: Serverless compute integration

### Adding Tools to Agents

1. Select an agent node
2. Click on the tool diamond at the bottom
3. Choose a tool type from the available options
4. Configure the tool parameters in the details panel

### Customizing Tool Code

Each tool includes editable MCP (Message Calling Protocol) code:

1. Select a tool node
2. Click the edit button in the top-right corner
3. Modify the Python code in the editor
4. Click "Save Changes" to update the tool

## Working with Memory

### Memory Types

The platform supports various memory types:

- **Conversation Buffer**: Short-term working memory
- **Sliding-Window**: Buffer window memory
- **Summary Memory**: Condensed conversation history
- **Entity / Knowledge-Graph**: Structured information storage
- **Vector-Store**: Retrieval-based memory
- **And more specialized types**

### Configuring Memory

1. Select a memory node
2. Choose the memory type from the options
3. Configure memory-specific parameters
4. Connect the memory to an agent

## Validation System

The platform includes a comprehensive validation system for user access:

### Validation Lifecycle

- Users start with 153 days of validation
- Warning system begins at specific intervals:
  - 28 days: First warning
  - 21 days: Second warning
  - 14 days: Third warning with escalation
  - 7 days: Final warning before access removal
  - 0 days: Access expired and will be removed

### Managing Validations

1. Navigate to the Accounts page
2. Select a work group
3. Go to the Users tab
4. View validation status for each user
5. Click the validate button to reset a user's validation period

## Work Group Management

### Creating Work Groups

1. Navigate to the Accounts page
2. Click "Create Work Group"
3. Provide a name, scope (Public/Restricted), and description
4. Click "Save" to create the work group

### Managing Users

1. Click on a work group name to open details
2. Go to the Users tab
3. Click "Add User" to add new users
4. Choose between ATT ID or Client ID
5. Set appropriate access levels and permissions

### Access Requests

1. Click the key icon in the Request Access column
2. Select the desired access level
3. For partial access, specify entity-role pairs
4. Submit the request for approval

## Troubleshooting

### Common Issues

- **Connection errors**: Check your internet connection and API credentials
- **Workflow validation errors**: Ensure all required fields are completed
- **Performance issues**: Try reducing the complexity of your workflow

### Getting Help

For additional assistance:

1. Check the inline help tooltips throughout the interface
2. Refer to this user guide for detailed instructions
3. Contact support through the help button in the header
