import { useState, useCallback } from 'react';

interface ValidationState {
  loading: boolean;
  error: Error | null;
  validateCode: (code: string) => Promise<boolean>;
  resetError: () => void;
}

/**
 * Hook for validating MCP tool code
 */
export const useToolValidation = (): ValidationState => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const validateCode = useCallback(async (code: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simple validation - check for required imports and MCP definition
      if (!code.includes('from langgraph.mcp import MCP')) {
        throw new Error('Code must import MCP from langgraph.mcp');
      }
      
      if (!code.includes('MCP(')) {
        throw new Error('Code must define an MCP instance');
      }
      
      setLoading(false);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
      throw err;
    }
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    validateCode,
    resetError
  };
};
