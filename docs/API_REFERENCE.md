# LangGraph Designer API Reference

## Overview

This document provides technical reference information for the LangGraph Designer API, including context providers, stores, hooks, and utility functions.

## Table of Contents

1. [Context Providers](#context-providers)
2. [State Management](#state-management)
3. [Hooks](#hooks)
4. [Utility Functions](#utility-functions)
5. [Type Definitions](#type-definitions)

## Context Providers

### WorkflowContext

Provides workflow state and operations throughout the application.

**Location:** `/src/context/WorkflowContext.tsx`

**Key Exports:**
- `WorkflowProvider` - Context provider component
- `useWorkflowContext` - Hook for accessing workflow context

**Properties:**
- `nodes` - Array of workflow nodes
- `edges` - Array of workflow edges
- `selectedNode` - Currently selected node
- `selectedEdge` - Currently selected edge

**Methods:**
- `addNode(node)` - Add a new node to the workflow
- `updateNode(id, updates)` - Update an existing node
- `removeNode(id)` - Remove a node from the workflow
- `addEdge(edge)` - Add a new edge to the workflow
- `updateEdge(id, updates)` - Update an existing edge
- `removeEdge(id)` - Remove an edge from the workflow
- `selectNode(id)` - Select a node
- `selectEdge(id)` - Select an edge
- `clearSelection()` - Clear the current selection

### RuntimeContext

Provides runtime state and operations for workflow execution.

**Location:** `/src/context/RuntimeContext.tsx`

**Key Exports:**
- `RuntimeProvider` - Context provider component
- `useRuntimeContext` - Hook for accessing runtime context

**Properties:**
- `isRunning` - Whether the workflow is currently running
- `messages` - Array of conversation messages

**Methods:**
- `startWorkflow()` - Start workflow execution
- `stopWorkflow()` - Stop workflow execution
- `sendMessage(message)` - Send a message to the workflow
- `clearMessages()` - Clear all messages

### ThemeContext

Provides theme state and operations for the application.

**Location:** `/src/context/ThemeContext.tsx`

**Key Exports:**
- `ThemeProvider` - Context provider component
- `useThemeContext` - Hook for accessing theme context

**Properties:**
- `mode` - Current theme mode ('light' or 'dark')

**Methods:**
- `toggleTheme()` - Toggle between light and dark mode
- `setTheme(mode)` - Set the theme mode directly

## State Management

### workflowStore

Zustand store for managing workflow state.

**Location:** `/src/store/workflowStore.ts`

**Key Exports:**
- `useWorkflowStore` - Hook for accessing workflow store

**State:**
- `nodes` - Array of workflow nodes
- `edges` - Array of workflow edges

**Actions:**
- `addNode(node)` - Add a new node
- `updateNode(id, updates)` - Update a node
- `removeNode(id)` - Remove a node
- `addEdge(edge)` - Add a new edge
- `updateEdge(id, updates)` - Update an edge
- `removeEdge(id)` - Remove an edge
- `reset()` - Reset the store to initial state

### nodeStore

Zustand store for managing node state.

**Location:** `/src/store/nodeStore.ts`

**Key Exports:**
- `useNodeStore` - Hook for accessing node store

**State:**
- `nodes` - Array of nodes

**Actions:**
- `addNode(node)` - Add a new node
- `updateNode(id, updates)` - Update a node
- `removeNode(id)` - Remove a node
- `reset()` - Reset the store to initial state

### edgeStore

Zustand store for managing edge state.

**Location:** `/src/store/edgeStore.ts`

**Key Exports:**
- `useEdgeStore` - Hook for accessing edge store

**State:**
- `edges` - Array of edges

**Actions:**
- `addEdge(edge)` - Add a new edge
- `updateEdge(id, updates)` - Update an edge
- `removeEdge(id)` - Remove an edge
- `reset()` - Reset the store to initial state

### selectionStore

Zustand store for managing selection state.

**Location:** `/src/store/selectionStore.ts`

**Key Exports:**
- `useSelectionStore` - Hook for accessing selection store

**State:**
- `selectedNodeId` - ID of the selected node
- `selectedEdgeId` - ID of the selected edge

**Actions:**
- `selectNode(id)` - Select a node
- `selectEdge(id)` - Select an edge
- `clearSelection()` - Clear the current selection

## Hooks

### useAsyncOperation

Hook for handling asynchronous operations with loading and error states.

**Location:** `/src/hooks/useAsyncOperation.ts`

**Usage:**
```typescript
const { execute, loading, error } = useAsyncOperation(async () => {
  // Async operation
});
```

**Returns:**
- `execute()` - Function to execute the operation
- `loading` - Whether the operation is in progress
- `error` - Error from the operation, if any

### useDebounce

Hook for debouncing a value.

**Location:** `/src/hooks/useDebounce.ts`

**Usage:**
```typescript
const debouncedValue = useDebounce(value, delay);
```

**Parameters:**
- `value` - Value to debounce
- `delay` - Delay in milliseconds

**Returns:**
- Debounced value

### useDialogState

Hook for managing dialog state.

**Location:** `/src/hooks/useDialogState.ts`

**Usage:**
```typescript
const { open, handleOpen, handleClose } = useDialogState();
```

**Returns:**
- `open` - Whether the dialog is open
- `handleOpen()` - Function to open the dialog
- `handleClose()` - Function to close the dialog

### useFormState

Hook for managing form state.

**Location:** `/src/hooks/useFormState.ts`

**Usage:**
```typescript
const { values, errors, handleChange, handleSubmit } = useFormState(initialValues, validationSchema, onSubmit);
```

**Parameters:**
- `initialValues` - Initial form values
- `validationSchema` - Validation schema
- `onSubmit` - Submit handler

**Returns:**
- `values` - Current form values
- `errors` - Validation errors
- `handleChange` - Change handler
- `handleSubmit` - Submit handler

### useTheme

Hook for accessing the theme context.

**Location:** `/src/hooks/useTheme.ts`

**Usage:**
```typescript
const { mode, toggleTheme } = useTheme();
```

**Returns:**
- `mode` - Current theme mode
- `toggleTheme()` - Function to toggle theme

### useVersionedId

Hook for generating versioned IDs.

**Location:** `/src/hooks/useVersionedId.ts`

**Usage:**
```typescript
const { generateId, parseId } = useVersionedId();
```

**Returns:**
- `generateId(prefix, version)` - Function to generate a versioned ID
- `parseId(id)` - Function to parse a versioned ID

### useWorkGroups

Hook for managing work groups.

**Location:** `/src/hooks/useWorkGroups.ts`

**Usage:**
```typescript
const { workGroups, loading, error, createWorkGroup, updateWorkGroup, deleteWorkGroup } = useWorkGroups();
```

**Returns:**
- `workGroups` - Array of work groups
- `loading` - Whether data is loading
- `error` - Error, if any
- `createWorkGroup(workGroup)` - Function to create a work group
- `updateWorkGroup(id, updates)` - Function to update a work group
- `deleteWorkGroup(id)` - Function to delete a work group

## Utility Functions

### iconUtils

Utilities for working with icons.

**Location:** `/src/utils/iconUtils.ts`

**Key Exports:**
- `getIconComponent(iconName)` - Get a Material-UI icon component by name
- `getIconOptions()` - Get available icon options

### idGenerator

Utilities for generating unique IDs.

**Location:** `/src/utils/idGenerator.ts`

**Key Exports:**
- `generateId(prefix)` - Generate a unique ID with optional prefix
- `generateULID()` - Generate a ULID (Universally Unique Lexicographically Sortable Identifier)

### modelUtils

Utilities for working with LLM models.

**Location:** `/src/utils/modelUtils.ts`

**Key Exports:**
- `getModelOptions()` - Get available model options
- `getModelDisplayName(modelId)` - Get display name for a model ID

### nodePositioning

Utilities for positioning nodes in the workflow graph.

**Location:** `/src/utils/nodePositioning.ts`

**Key Exports:**
- `calculateNodePosition(parentPosition, nodeType)` - Calculate position for a new node
- `getNodeTypeHandle(nodeType)` - Get handle information for a node type

### workflowValidator

Utilities for validating workflows.

**Location:** `/src/utils/workflowValidator.ts`

**Key Exports:**
- `validateWorkflow(nodes, edges)` - Validate a workflow
- `validateNode(node)` - Validate a node
- `validateEdge(edge)` - Validate an edge

### helpUtils

Utilities for providing help and tooltips.

**Location:** `/src/utils/helpUtils.ts`

**Key Exports:**
- `getHelpContent(category, key)` - Get help content for a component
- `workflowHelp` - Help content for workflow components
- `agentHelp` - Help content for agent components
- `toolHelp` - Help content for tool components
- `memoryHelp` - Help content for memory components
- `operatorHelp` - Help content for operator components
- `workGroupHelp` - Help content for work group components

## Type Definitions

### nodeTypes

Type definitions for workflow nodes.

**Location:** `/src/types/nodeTypes.ts`

**Key Types:**
- `NodeType` - Enum of node types
- `WorkflowNode` - Interface for workflow nodes
- `WorkflowEdge` - Interface for workflow edges
- `NodePosition` - Interface for node positions

### workGroup

Type definitions for work groups.

**Location:** `/src/types/workGroup.ts`

**Key Types:**
- `WorkGroup` - Interface for work groups
- `WorkGroupUser` - Interface for work group users
- `EntityRolePair` - Interface for entity-role pairs
- `AccessRequest` - Interface for access requests
