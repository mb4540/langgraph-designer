import { useState, useEffect, useCallback } from 'react';
import { WorkflowNode } from '../types/nodeTypes';

type FormValues = Record<string, any>;

interface UseFormStateOptions<T extends FormValues> {
  /** Initial values for the form */
  initialValues: T;
  
  /** Node object from which to derive initial values */
  node: WorkflowNode;
  
  /** Function to map node properties to form values */
  mapNodeToValues: (node: WorkflowNode) => T;
  
  /** Function to map form values back to node properties */
  mapValuesToNode: (values: T, node: WorkflowNode) => Partial<WorkflowNode>;
  
  /** Optional validation function */
  validate?: (values: T) => Record<string, string> | null;
}

interface UseFormStateResult<T extends FormValues> {
  /** Current form values */
  values: T;
  
  /** Function to update a single form value */
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  
  /** Function to update multiple form values */
  setValues: (updates: Partial<T>) => void;
  
  /** Function to reset form to initial values */
  resetForm: () => void;
  
  /** Whether the form has been modified */
  isModified: boolean;
  
  /** Validation errors, if any */
  errors: Record<string, string> | null;
  
  /** Function to validate the form */
  validateForm: () => boolean;
  
  /** Function to get node updates based on current form values */
  getNodeUpdates: () => Partial<WorkflowNode>;
}

/**
 * Custom hook for managing form state in node detail forms
 */
export function useFormState<T extends FormValues>({
  initialValues,
  node,
  mapNodeToValues,
  mapValuesToNode,
  validate
}: UseFormStateOptions<T>): UseFormStateResult<T> {
  // Initialize form values from node
  const [values, setValuesState] = useState<T>(mapNodeToValues(node));
  const [originalValues, setOriginalValues] = useState<T>(mapNodeToValues(node));
  const [errors, setErrors] = useState<Record<string, string> | null>(null);
  
  // Update form values when node changes
  useEffect(() => {
    const newValues = mapNodeToValues(node);
    setValuesState(newValues);
    setOriginalValues(newValues);
  }, [node, mapNodeToValues]);
  
  // Set a single form value
  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValuesState(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);
  
  // Set multiple form values
  const setValues = useCallback((updates: Partial<T>) => {
    setValuesState(prev => ({
      ...prev,
      ...updates
    }));
  }, []);
  
  // Reset form to original values
  const resetForm = useCallback(() => {
    setValuesState(originalValues);
    setErrors(null);
  }, [originalValues]);
  
  // Check if form has been modified
  const isModified = useCallback(() => {
    return Object.keys(values).some(key => {
      // Handle arrays and objects
      if (
        typeof values[key] === 'object' && 
        values[key] !== null && 
        typeof originalValues[key] === 'object' && 
        originalValues[key] !== null
      ) {
        return JSON.stringify(values[key]) !== JSON.stringify(originalValues[key]);
      }
      
      // Handle primitive values
      return values[key] !== originalValues[key];
    });
  }, [values, originalValues]);
  
  // Validate form values
  const validateForm = useCallback(() => {
    if (!validate) return true;
    
    const validationErrors = validate(values);
    setErrors(validationErrors);
    
    return validationErrors === null;
  }, [values, validate]);
  
  // Get node updates based on current form values
  const getNodeUpdates = useCallback(() => {
    return mapValuesToNode(values, node);
  }, [values, node, mapValuesToNode]);
  
  return {
    values,
    setValue,
    setValues,
    resetForm,
    isModified: isModified(),
    errors,
    validateForm,
    getNodeUpdates
  };
}
