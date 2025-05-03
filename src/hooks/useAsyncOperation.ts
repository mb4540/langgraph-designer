import { useState, useCallback, useRef, useEffect } from 'react';

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
  
  /**
   * Function to retry the last execution with the same arguments
   */
  retry: () => Promise<T | null>;
  
  /**
   * Whether the async operation has been executed at least once
   */
  hasExecuted: boolean;
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
   * Function to call before the operation starts
   */
  onBefore?: () => void;
  
  /**
   * Function to call after the operation completes (success or failure)
   */
  onAfter?: () => void;
  
  /**
   * Whether to automatically retry on error
   */
  autoRetry?: boolean;
  
  /**
   * Maximum number of retry attempts
   */
  maxRetries?: number;
  
  /**
   * Delay between retry attempts in milliseconds
   */
  retryDelay?: number;
}

/**
 * A hook for managing async operations with loading and error states
 * 
 * @param asyncFunction - The async function to execute
 * @param options - Options for the hook
 * @returns An object with data, loading, error, execute, and reset properties
 */
function useAsyncOperation<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: AsyncOperationOptions<T> = {}
): AsyncOperationResult<T> {
  const {
    initialData = null,
    immediate = false,
    onSuccess,
    onError,
    onBefore,
    onAfter,
    autoRetry = false,
    maxRetries = 3,
    retryDelay = 1000
  } = options;
  
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasExecuted, setHasExecuted] = useState<boolean>(false);
  
  // Store the last args for retry functionality
  const lastArgsRef = useRef<any[]>([]);
  const retryCountRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(true);
  
  // Ensure we don't update state after unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      if (!isMountedRef.current) return null;
      
      // Store args for retry
      lastArgsRef.current = args;
      retryCountRef.current = 0;
      
      // Reset state before executing
      setLoading(true);
      setError(null);
      setHasExecuted(true);
      
      // Call onBefore if provided
      if (onBefore) onBefore();
      
      try {
        const result = await asyncFunction(...args);
        if (isMountedRef.current) {
          setData(result);
          setLoading(false);
          
          // Call onSuccess if provided
          if (onSuccess) onSuccess(result);
          
          // Call onAfter if provided
          if (onAfter) onAfter();
        }
        return result;
      } catch (err) {
        if (isMountedRef.current) {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          setLoading(false);
          
          // Call onError if provided
          if (onError) onError(error);
          
          // Call onAfter if provided
          if (onAfter) onAfter();
          
          // Auto retry if enabled
          if (autoRetry && retryCountRef.current < maxRetries) {
            retryCountRef.current += 1;
            setTimeout(() => {
              if (isMountedRef.current) {
                execute(...lastArgsRef.current);
              }
            }, retryDelay);
          }
        }
        return null;
      }
    },
    [asyncFunction, onSuccess, onError, onBefore, onAfter, autoRetry, maxRetries, retryDelay]
  );
  
  const retry = useCallback(async (): Promise<T | null> => {
    if (lastArgsRef.current.length === 0) return null;
    return execute(...lastArgsRef.current);
  }, [execute]);
  
  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
    setHasExecuted(false);
    retryCountRef.current = 0;
  }, [initialData]);
  
  // Execute immediately if specified
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);
  
  return {
    data,
    loading,
    error,
    execute,
    reset,
    retry,
    hasExecuted
  };
}

export default useAsyncOperation;
