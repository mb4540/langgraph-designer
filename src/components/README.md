# LangGraph Designer Component Structure

This document outlines the component structure and organization patterns used in the LangGraph Designer application.

## Component Organization

The application follows a modular component structure with clear separation of concerns:

### Directory Structure

```
src/components/
├── common/                 # Shared components used across the application
│   ├── Card.tsx           # Reusable card component
│   ├── Dialog.tsx         # Reusable dialog component
│   ├── Table.tsx          # Reusable table component
│   └── index.ts           # Export file for common components
│
├── ui/                    # Basic UI components
│   ├── ActionButtons.tsx  # Save/cancel button group
│   ├── ErrorMessage.tsx   # Error display component
│   └── LoadingIndicator.tsx # Loading spinner/indicator
│
├── workflow/              # Workflow-specific components
│   ├── canvas/            # Canvas and node rendering components
│   ├── details/           # Node detail forms and editors
│   │   ├── common/        # Common components for node details
│   │   │   ├── BaseNodeForm.tsx  # Base form for all node types
│   │   │   ├── CodeEditor.tsx    # Code editor component
│   │   │   ├── FormField.tsx     # Standardized form field
│   │   │   ├── VersionInfo.tsx   # Version information display
│   │   │   └── index.ts          # Export file for common components
│   │   │
│   │   ├── agent/         # Agent-specific components
│   │   │   ├── AgentIconSelector.tsx    # Agent icon selection
│   │   │   ├── AgentModelSettings.tsx   # Agent model configuration
│   │   │   ├── AgentPromptEditor.tsx    # Agent prompt editing
│   │   │   ├── AgentSettings.tsx        # Agent settings management
│   │   │   └── index.ts                 # Export file for agent components
│   │   │
│   │   ├── memory/        # Memory-specific components
│   │   │   ├── MemoryTypeSelector.tsx   # Memory type selection
│   │   │   ├── memoryData.ts            # Memory type definitions
│   │   │   └── index.ts                 # Export file for memory components
│   │   │
│   │   ├── tools/         # Tool-specific components
│   │   │   ├── ToolCard.tsx             # Tool card display
│   │   │   ├── ToolCodeEditor.tsx       # Tool code editing
│   │   │   ├── ToolSearch.tsx           # Tool search and filtering
│   │   │   ├── toolData.ts              # Tool definitions
│   │   │   ├── useToolValidation.ts     # Tool validation hook
│   │   │   └── index.ts                 # Export file for tool components
│   │   │
│   │   ├── AgentDetailsForm.tsx   # Agent configuration form
│   │   ├── MemoryDetailsForm.tsx  # Memory configuration form
│   │   ├── OperatorDetailsForm.tsx # Operator configuration form
│   │   └── ToolDetailsForm.tsx    # Tool configuration form
```

## Component Patterns

### Base Components

All node detail forms extend from a common `BaseNodeForm` component that provides:

- Standardized save/cancel functionality
- Error handling and display
- Loading state management
- Window-level function exposure for parent components

### Form Fields

All form fields use the common `FormField` component that provides:

- Consistent labeling
- Error handling
- Required field indication
- Helper text display

### Code Editing

Code editing is handled by the common `CodeEditor` component that provides:

- Syntax highlighting
- Line numbers
- Error highlighting
- Consistent styling

## Naming Conventions

### Component Props

Props follow consistent naming patterns:

- Event handlers use the `onEventName` pattern (e.g., `onClick`, `onSave`, `onCancel`)
- Boolean flags use the `isState` pattern (e.g., `isLoading`, `isRequired`)
- Callback props include the word "on" (e.g., `onSave`, `onChange`)

### Component Files

Files follow these naming conventions:

- Component files use PascalCase (e.g., `BaseNodeForm.tsx`)
- Utility/hook files use camelCase (e.g., `useToolValidation.ts`)
- Data files use camelCase (e.g., `toolData.ts`)
- Index files are named `index.ts`

## Best Practices

1. **Component Composition**: Break down complex components into smaller, focused components
2. **Separation of Concerns**: Keep UI, logic, and data separate
3. **Reusable Components**: Create components that can be reused across the application
4. **Consistent Styling**: Use the Material-UI theme for consistent styling
5. **Type Safety**: Use TypeScript interfaces for props and state
6. **Documentation**: Add JSDoc comments to components and functions

## Refactoring Strategy

The application is being refactored following these principles:

1. **Modularize Large Component Files**: Break down large components into smaller, focused components
2. **Standardize Component Structure**: Use common patterns for all components
3. **Consolidate Duplicate Code**: Extract common functionality into shared components
4. **Improve State Management**: Use hooks for state management
5. **Optimize Performance**: Reduce unnecessary re-renders
6. **Enhance Code Quality**: Improve readability and maintainability
7. **Improve UI/UX**: Standardize UI patterns for better user experience
