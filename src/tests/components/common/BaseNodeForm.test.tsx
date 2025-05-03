import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../utils/test-utils';
import { BaseNodeForm } from '../../../components/workflow/details/common';

describe('BaseNodeForm', () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();
  const mockError = new Error('Test error');
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders with title and children', () => {
    render(
      <BaseNodeForm 
        title="Test Form" 
        onSave={mockOnSave} 
        onCancel={mockOnCancel}
        nodeId="test-node-1"
      >
        <div data-testid="form-content">Form Content</div>
      </BaseNodeForm>
    );
    
    expect(screen.getByText('Test Form')).toBeInTheDocument();
    expect(screen.getByTestId('form-content')).toBeInTheDocument();
    expect(screen.getByText('Form Content')).toBeInTheDocument();
  });
  
  it('calls onSave when save button is clicked', async () => {
    render(
      <BaseNodeForm 
        title="Test Form" 
        onSave={mockOnSave} 
        onCancel={mockOnCancel}
        nodeId="test-node-1"
      >
        <div>Form Content</div>
      </BaseNodeForm>
    );
    
    fireEvent.click(screen.getByText('Save'));
    
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });
  });
  
  it('calls onCancel when cancel button is clicked', () => {
    render(
      <BaseNodeForm 
        title="Test Form" 
        onSave={mockOnSave} 
        onCancel={mockOnCancel}
        nodeId="test-node-1"
      >
        <div>Form Content</div>
      </BaseNodeForm>
    );
    
    fireEvent.click(screen.getByText('Cancel'));
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
  
  it('displays loading state when loading prop is true', () => {
    render(
      <BaseNodeForm 
        title="Test Form" 
        onSave={mockOnSave} 
        onCancel={mockOnCancel}
        loading={true}
        nodeId="test-node-1"
      >
        <div>Form Content</div>
      </BaseNodeForm>
    );
    
    expect(screen.getByText('Saving...')).toBeInTheDocument();
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });
  
  it('displays error message when error prop is provided', () => {
    render(
      <BaseNodeForm 
        title="Test Form" 
        onSave={mockOnSave} 
        onCancel={mockOnCancel}
        error={mockError}
        nodeId="test-node-1"
      >
        <div>Form Content</div>
      </BaseNodeForm>
    );
    
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });
  
  it('exposes window functions for external access', () => {
    render(
      <BaseNodeForm 
        title="Test Form" 
        onSave={mockOnSave} 
        onCancel={mockOnCancel}
        nodeId="test-node-1"
      >
        <div>Form Content</div>
      </BaseNodeForm>
    );
    
    expect(window.saveNodeChanges).toBeDefined();
    expect(window.cancelNodeChanges).toBeDefined();
    expect(window.isNodeModified).toBeDefined();
    
    // Test calling the exposed functions
    window.saveNodeChanges();
    expect(mockOnSave).toHaveBeenCalledTimes(1);
    
    window.cancelNodeChanges();
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    
    expect(window.isNodeModified).toBe(false);
  });
  
  it('cleans up window functions on unmount', () => {
    const { unmount } = render(
      <BaseNodeForm 
        title="Test Form" 
        onSave={mockOnSave} 
        onCancel={mockOnCancel}
        nodeId="test-node-1"
      >
        <div>Form Content</div>
      </BaseNodeForm>
    );
    
    expect(window.saveNodeChanges).toBeDefined();
    expect(window.cancelNodeChanges).toBeDefined();
    expect(window.isNodeModified).toBeDefined();
    
    unmount();
    
    expect(window.saveNodeChanges).toBeUndefined();
    expect(window.cancelNodeChanges).toBeUndefined();
    expect(window.isNodeModified).toBeUndefined();
  });
});
