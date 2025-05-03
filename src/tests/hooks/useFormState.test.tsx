import { renderHook, act } from '@testing-library/react';
import { useFormState } from '../../hooks/useFormState';
import { WorkflowNode } from '../../types/nodeTypes';

describe('useFormState', () => {
  // Mock node for testing
  const mockNode: WorkflowNode = {
    id: 'test-node-1',
    type: 'tool',
    position: { x: 0, y: 0 },
    data: {},
    name: 'Test Tool',
    toolType: 'test-tool',
    content: 'test content',
    version: '1.0.0'
  };
  
  // Mock functions for mapping between node and form values
  const mapNodeToValues = (node: WorkflowNode) => ({
    name: node.name || '',
    content: node.content || '',
    version: node.version || '1.0.0'
  });
  
  const mapValuesToNode = (values: any, node: WorkflowNode) => ({
    name: values.name,
    content: values.content,
    version: values.version
  });
  
  // Mock validation function
  const validate = (values: any) => {
    const errors: Record<string, string> = {};
    
    if (!values.name) {
      errors.name = 'Name is required';
    }
    
    if (!values.content) {
      errors.content = 'Content is required';
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  };
  
  it('initializes with values from node', () => {
    const { result } = renderHook(() => useFormState({
      initialValues: { name: '', content: '', version: '1.0.0' },
      node: mockNode,
      mapNodeToValues,
      mapValuesToNode
    }));
    
    expect(result.current.values).toEqual({
      name: 'Test Tool',
      content: 'test content',
      version: '1.0.0'
    });
    
    expect(result.current.isModified).toBe(false);
  });
  
  it('updates a single value correctly', () => {
    const { result } = renderHook(() => useFormState({
      initialValues: { name: '', content: '', version: '1.0.0' },
      node: mockNode,
      mapNodeToValues,
      mapValuesToNode
    }));
    
    act(() => {
      result.current.setValue('name', 'Updated Name');
    });
    
    expect(result.current.values.name).toBe('Updated Name');
    expect(result.current.isModified).toBe(true);
  });
  
  it('updates multiple values correctly', () => {
    const { result } = renderHook(() => useFormState({
      initialValues: { name: '', content: '', version: '1.0.0' },
      node: mockNode,
      mapNodeToValues,
      mapValuesToNode
    }));
    
    act(() => {
      result.current.setValues({
        name: 'Updated Name',
        content: 'Updated Content'
      });
    });
    
    expect(result.current.values).toEqual({
      name: 'Updated Name',
      content: 'Updated Content',
      version: '1.0.0'
    });
    
    expect(result.current.isModified).toBe(true);
  });
  
  it('resets form to original values', () => {
    const { result } = renderHook(() => useFormState({
      initialValues: { name: '', content: '', version: '1.0.0' },
      node: mockNode,
      mapNodeToValues,
      mapValuesToNode
    }));
    
    act(() => {
      result.current.setValue('name', 'Updated Name');
      result.current.setValue('content', 'Updated Content');
    });
    
    expect(result.current.isModified).toBe(true);
    
    act(() => {
      result.current.resetForm();
    });
    
    expect(result.current.values).toEqual({
      name: 'Test Tool',
      content: 'test content',
      version: '1.0.0'
    });
    
    expect(result.current.isModified).toBe(false);
  });
  
  it('validates form values correctly', () => {
    const { result } = renderHook(() => useFormState({
      initialValues: { name: '', content: '', version: '1.0.0' },
      node: mockNode,
      mapNodeToValues,
      mapValuesToNode,
      validate
    }));
    
    act(() => {
      result.current.setValue('name', '');
      result.current.setValue('content', '');
    });
    
    act(() => {
      const isValid = result.current.validateForm();
      expect(isValid).toBe(false);
    });
    
    expect(result.current.errors).toEqual({
      name: 'Name is required',
      content: 'Content is required'
    });
    
    act(() => {
      result.current.setValue('name', 'Valid Name');
      result.current.setValue('content', 'Valid Content');
    });
    
    act(() => {
      const isValid = result.current.validateForm();
      expect(isValid).toBe(true);
    });
    
    expect(result.current.errors).toBeNull();
  });
  
  it('gets node updates correctly', () => {
    const { result } = renderHook(() => useFormState({
      initialValues: { name: '', content: '', version: '1.0.0' },
      node: mockNode,
      mapNodeToValues,
      mapValuesToNode
    }));
    
    act(() => {
      result.current.setValue('name', 'Updated Name');
      result.current.setValue('content', 'Updated Content');
    });
    
    const updates = result.current.getNodeUpdates();
    
    expect(updates).toEqual({
      name: 'Updated Name',
      content: 'Updated Content',
      version: '1.0.0'
    });
  });
  
  it('updates when node changes', () => {
    const { result, rerender } = renderHook(
      ({ node }) => useFormState({
        initialValues: { name: '', content: '', version: '1.0.0' },
        node,
        mapNodeToValues,
        mapValuesToNode
      }),
      { initialProps: { node: mockNode } }
    );
    
    const updatedNode = {
      ...mockNode,
      name: 'New Node Name',
      content: 'New node content'
    };
    
    rerender({ node: updatedNode });
    
    expect(result.current.values).toEqual({
      name: 'New Node Name',
      content: 'New node content',
      version: '1.0.0'
    });
    
    expect(result.current.isModified).toBe(false);
  });
});
