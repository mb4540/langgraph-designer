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
  
  it('renders TextField when no children are provided', () => {
    render(
      <FormField 
        label="Test Label" 
        value="Test Value"
        placeholder="Test Placeholder"
      />
    );
    
    const textField = screen.getByPlaceholderText('Test Placeholder');
    expect(textField).toBeInTheDocument();
    expect(textField).toHaveValue('Test Value');
  });
  
  it('applies custom styles when provided', () => {
    render(
      <FormField label="Test Label" sx={{ marginTop: '20px' }}>
        <TextField />
      </FormField>
    );
    
    // Get the form field container
    const formFieldContainer = screen.getByText('Test Label').closest('.MuiFormControl-root');
    expect(formFieldContainer).toHaveStyle('margin-top: 20px');
  });
});
