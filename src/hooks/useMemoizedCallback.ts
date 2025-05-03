import { useCallback, useRef, useEffect, DependencyList } from 'react';

/**
 * A hook that returns a memoized callback that only changes if one of the dependencies
 * has changed, and also ensures the latest function is always used.
 * 
 * This is useful when you need to pass a callback to a child component that
 * uses React.memo() to prevent unnecessary re-renders, but you also need
 * the callback to have access to the latest props/state.
 * 
 * @param callback The callback function to memoize
 * @param deps The dependencies array that determines when to update the callback
 * @returns A memoized callback function
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList
): T {
  // Store the latest callback in a ref
  const callbackRef = useRef(callback);
  
  // Update the ref whenever the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  // Return a memoized version of the callback that uses the ref
  return useCallback(
    ((...args: Parameters<T>) => {
      return callbackRef.current(...args);
    }) as T,
    deps
  );
}
