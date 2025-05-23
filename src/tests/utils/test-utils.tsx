import React, { ReactElement } from 'react';
import { render as rtlRender, RenderOptions, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { WorkflowProvider } from '../../context/WorkflowContext';
import { ThemeContext } from '../../context/ThemeContext';
import { createTheme } from '@mui/material/styles';

// Create light and dark themes for testing
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

// Mock workflow context initial state
const mockWorkflowState = {
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  isReadOnly: false,
};

interface AllProvidersProps {
  children: React.ReactNode;
  theme?: 'light' | 'dark';
  workflowState?: typeof mockWorkflowState;
}

/**
 * Wrapper component that provides all necessary context providers for testing
 */
const AllProviders = ({ 
  children, 
  theme = 'light',
  workflowState = mockWorkflowState 
}: AllProvidersProps) => {
  const toggleTheme = () => {};
  const setMode = () => {};

  return (
    <ThemeContext.Provider value={{ mode: theme as 'light' | 'dark', toggleTheme, setMode }}>
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <WorkflowProvider>
          {children}
        </WorkflowProvider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

/**
 * Custom render function that wraps the component with all necessary providers
 */
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    theme?: 'light' | 'dark';
    workflowState?: typeof mockWorkflowState;
  }
) => {
  const { theme, workflowState, ...renderOptions } = options || {};
  
  return rtlRender(ui, {
    wrapper: (props: { children: React.ReactNode }) => (
      <AllProviders theme={theme} workflowState={workflowState} {...props} />
    ),
    ...renderOptions,
  });
};

// Re-export everything from testing-library
export { screen, fireEvent, waitFor, customRender as render };
