import React from 'react';
import { render, screen } from '../../utils/test-utils';
import { FormField } from '../../../components/workflow/details/common';
import TextField from '@mui/material/TextField';

describe('FormField', () => {
  it('renders with label', () => {
    render(
      <FormField label="Test Label">
        <TextField />
      </FormField>
    );
    
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });
  
  it('renders children correctly', () => {
    render(
      <FormField label="Test Label">
        <TextField placeholder="Test Input" />
      </FormField>
    );
    
    expect(screen.getByPlaceholderText('Test Input')).toBeInTheDocument();
  });
  
  it('shows required indicator when required prop is true', () => {
    render(
      <FormField label="Test Label" required>
        <TextField />
      </FormField>
    );
    
    // The required indicator is typically an asterisk
    expect(screen.getByText('*')).toBeInTheDocument();
  });
  
  it('shows helper text when provided', () => {
    const helperText = 'This is helper text';
    render(
      <FormField label="Test Label" helperText={helperText}>
        <TextField />
      </FormField>
    );
    
    expect(screen.getByText(helperText)).toBeInTheDocument();
  });
  
  it('shows error state when error prop is true', () => {
    const errorText = 'This field has an error';
    render(
      <FormField label="Test Label" error helperText={errorText}>
        <TextField />
      </FormField>
    );
    
    const helperTextElement = screen.getByText(errorText);
    expect(helperTextElement).toBeInTheDocument();
    expect(helperTextElement).toHaveClass('Mui-error');
  });
  
  it('applies custom styles when provided', () => {
    render(
      <FormField label="Test Label" sx={{ marginTop: '20px' }}>
        <TextField />
      </FormField>
    );
    
    // Get the form field container
    const formFieldContainer = screen.getByText('Test Label').closest('div');
    expect(formFieldContainer).toHaveStyle('margin-top: 20px');
  });
});
