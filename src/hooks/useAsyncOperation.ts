import { useState, useCallback } from 'react';

/**
 * Return type for the useAsyncOperation hook
 */
export interface AsyncOperationResult<T> {
  /**
   * The data returned from the async operation
   */
  data: T | null;
  
  /**
   * Whether the async operation is currently loading
   */
  loading: boolean;
  
  /**
   * Any error that occurred during the async operation
   */
  error: Error | null;
  
  /**
   * Function to execute the async operation
   */
  execute: (...args: any[]) => Promise<T | null>;
  
  /**
   * Function to reset the state (clear data, error, and set loading to false)
   */
  reset: () => void;
}

/**
 * Options for the useAsyncOperation hook
 */
export interface AsyncOperationOptions<T> {
  /**
   * Initial data value
   */
  initialData?: T | null;
  
  /**
   * Whether to execute the operation immediately
   */
  immediate?: boolean;
  
  /**
   * Function to call when the operation is successful
   */
  onSuccess?: (data: T) => void;
  
  /**
   * Function to call when the operation fails
   */
  onError?: (error: Error) => void;
  
  /**
   * Function to call when the operation completes (success or failure)
   */
  onComplete?: () => void;
}

/**
 * A hook for managing async operations with loading and error states
 * 
 * @param asyncFunction - The async function to execute
 * @param options - Options for the hook
 * @returns An object with data, loading, error, execute, and reset properties
 */
const useAsyncOperation = <T,>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: AsyncOperationOptions<T> = {}
): AsyncOperationResult<T> => {
  const {
    initialData = null,
    immediate = false,
    onSuccess,
    onError,
    onComplete,
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Reset the state (clear data, error, and set loading to false)
   */
  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
  }, [initialData]);

  /**
   * Execute the async operation
   */
  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);

        const result = await asyncFunction(...args);
        setData(result);
        
        if (onSuccess) {
          onSuccess(result);
        }
        
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        
        if (onError) {
          onError(error);
        }
        
        return null;
      } finally {
        setLoading(false);
        
        if (onComplete) {
          onComplete();
        }
      }
    },
    [asyncFunction, onSuccess, onError, onComplete]
  );

  // Execute immediately if immediate is true
  useState(() => {
    if (immediate) {
      execute();
    }
  });

  return { data, loading, error, execute, reset };
};

export default useAsyncOperation;
