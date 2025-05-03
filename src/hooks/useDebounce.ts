import { useState, useEffect, useRef } from 'react';

/**
 * A hook that returns a debounced value that only updates after the specified delay
 * has passed without any new updates.
 * 
 * This is useful for reducing the frequency of expensive operations like API calls
 * or re-renders when a value changes rapidly (e.g., during typing).
 * 
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    // Clean up the timer if the value or delay changes before the timeout
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

/**
 * A hook that returns a debounced callback function that only executes after
 * the specified delay has passed without any new invocations.
 * 
 * This is useful for reducing the frequency of expensive operations like API calls
 * when a function is called rapidly (e.g., during window resizing).
 * 
 * @param callback The callback function to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced callback function
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clean up the timeout when the component unmounts or the callback/delay changes
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [callback, delay]);
  
  return (...args: Parameters<T>) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set up a new timeout
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
