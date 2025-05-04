# LangGraph Designer Component Documentation

## Table of Contents

1. [Core Components](#core-components)
2. [Workflow Components](#workflow-components)
3. [Agent Components](#agent-components)
4. [Tool Components](#tool-components)
5. [Memory Components](#memory-components)
6. [Operator Components](#operator-components)
7. [Work Group Components](#work-group-components)

## Core Components

### WorkflowDesignerLayout

The main layout component that organizes the workflow designer interface into three resizable panels.

**Key Features:**
- Resizable panels using react-resizable-panels
- Persistent panel sizing through state management
- Context providers for workflow and runtime data

**File Location:** `/src/components/workflow/WorkflowDesignerLayout.tsx`

### WorkflowGraph

The central component for visualizing and interacting with the workflow graph.

**Key Features:**
- Interactive node-based graph using ReactFlow
- Support for multiple node types (agents, tools, memory, operators)
- Connection handling between nodes
- Node selection and deletion
- Background grid and controls

**File Location:** `/src/components/WorkflowGraph.tsx`

### DetailsPanel

Dynamic panel that displays configuration options for the selected node or workflow.

**Key Features:**
- Context-aware display based on selected node type
- Form-based configuration for all node types
- Workflow-level configuration when no node is selected
- Save and cancel functionality for changes

**File Location:** `/src/components/workflow/DetailsPanel.tsx`

### ConversationPanel

Interface for testing agent interactions and viewing conversation history.

**Key Features:**
- Message history display
- Input field for user messages
- Support for markdown and code formatting
- Clear conversation functionality

**File Location:** `/src/components/workflow/ConversationPanel.tsx`

## Workflow Components

### WorkflowDetailsForm

Form for configuring workflow-level properties.

**Key Features:**
- Workflow name and description fields
- Version control with semantic versioning
- Unique ID display
- JSON representation of the workflow graph

**File Location:** `/src/components/workflow/details/WorkflowDetailsForm.tsx`

## Agent Components

### MainAgentNode

Visual representation of an agent in the workflow graph.

**Key Features:**
- Customizable icon display
- Connection handles for linking to other nodes
- Diamonds for creating child components (tools, memory, etc.)
- Delete functionality
- Visual indication of selection state

**File Location:** `/src/components/MainAgentNode.tsx`

### AgentDetailsForm

Configuration form for agent properties.

**Key Features:**
- Agent name, type, and description fields
- Icon selection
- LLM model configuration
- System prompt editor with markdown support
- Advanced settings
- Version control

**File Location:** `/src/components/workflow/details/AgentDetailsForm.tsx`

### AgentTypeSelector

Component for selecting the agent type.

**Key Features:**
- Radio button selection of agent types
- Descriptive labels for each type
- Support for custom agent types

**File Location:** `/src/components/workflow/details/agent/AgentTypeSelector.tsx`

### AgentIconSelector

Component for selecting the agent's visual icon.

**Key Features:**
- Grid of available icons
- Search functionality
- Preview of selected icon

**File Location:** `/src/components/workflow/details/agent/AgentIconSelector.tsx`

## Tool Components

### MainToolNode

Visual representation of a tool in the workflow graph.

**Key Features:**
- Tool-specific icon display
- Connection handle to parent agent
- Delete functionality
- Visual indication of selection state

**File Location:** `/src/components/MainToolNode.tsx`

### ToolDetailsForm

Configuration form for tool properties.

**Key Features:**
- Tool type selection
- Tool-specific parameter configuration
- MCP code editor for customization
- Input and output schema definition

**File Location:** `/src/components/workflow/details/ToolDetailsForm.tsx`

## Memory Components

### MainMemoryNode

Visual representation of a memory component in the workflow graph.

**Key Features:**
- Memory-specific icon display
- Connection handle to parent agent
- Delete functionality
- Visual indication of selection state

**File Location:** `/src/components/MainMemoryNode.tsx`

### MemoryDetailsForm

Configuration form for memory properties.

**Key Features:**
- Memory type selection with descriptions
- Memory-specific parameter configuration
- Connection to agent configuration

**File Location:** `/src/components/workflow/details/MemoryDetailsForm.tsx`

## Operator Components

### OperatorNode

Visual representation of an operator in the workflow graph.

**Key Features:**
- Operator-specific icon and styling
- Multiple connection handles for complex flows
- Delete functionality
- Visual indication of selection state

**File Location:** `/src/components/nodes/OperatorNode.tsx`

### OperatorDetailsForm

Configuration form for operator properties.

**Key Features:**
- Operator type-specific configuration
- Connection management
- Flow control settings

**File Location:** `/src/components/workflow/details/OperatorDetailsForm.tsx`

## Work Group Components

### WorkGroupTable

Table displaying work groups with filtering and search functionality.

**Key Features:**
- Filterable by "All Work-groups" or "My Work-groups"
- Searchable by name, owner, or description
- Pagination controls
- Clickable work group names for details
- Request access functionality
- Pending approvals indicator

**File Location:** `/src/components/WorkGroupTable.tsx`

### WorkGroupDetailsDialog

Dialog for viewing and editing work group details.

**Key Features:**
- Tabbed interface with Overview and Users tabs
- Edit functionality for admins
- View-only mode for non-admins
- Work group metadata display

**File Location:** `/src/components/WorkGroupDetailsDialog.tsx`

### WorkGroupUsersTab

Tab for managing users within a work group.

**Key Features:**
- User listing with access levels
- Validation status tracking with visual indicators
- Add user functionality with ID type selection
- Entity-role pair management for partial access
- User validation button

**File Location:** `/src/components/WorkGroupUsersTab.tsx`

### CreateWorkGroupDialog

Dialog for creating new work groups.

**Key Features:**
- Work group name field
- Scope selection (Public/Restricted)
- Description field
- Validation and error handling

**File Location:** `/src/components/CreateWorkGroupDialog.tsx`

### RequestAccessDialog

Dialog for requesting access to a work group.

**Key Features:**
- Access level selection
- Entity-role pair configuration for partial access
- Submission handling

**File Location:** `/src/components/RequestAccessDialog.tsx`
