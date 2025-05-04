import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { WorkflowNode } from '../../../types/nodeTypes';
import { useWorkflowContext } from '../../../context/WorkflowContext';
import useAsyncOperation from '../../../hooks/useAsyncOperation';

// Import common components
import { BaseNodeForm } from './common';

// Import memory-specific components
import { MemoryTypeSelector } from './memory';

interface MemoryDetailsFormProps {
  node: WorkflowNode;
}

const MemoryDetailsForm: React.FC<MemoryDetailsFormProps> = ({ node }) => {
  const { updateNode } = useWorkflowContext();
  const [memoryType, setMemoryType] = useState(node.memoryType || 'conversation-buffer');
  
  // Update form when node changes
  useEffect(() => {
    setMemoryType(node.memoryType || 'conversation-buffer');
  }, [node]);

  // Handle save operation with proper typing
  const { execute: handleSaveExecute, loading, error } = useAsyncOperation<void>(async () => {
    // Update the node with form values
    updateNode(node.id, {
      memoryType
    });
  });

  // Wrap the execute function to ensure it returns Promise<void>
  const handleSave = async (): Promise<void> => {
    await handleSaveExecute();
  };

  // Handle cancel operation
  const handleCancel = () => {
    // Reset form to node values
    setMemoryType(node.memoryType || 'conversation-buffer');
  };

  return (
    <BaseNodeForm
      title="Memory Configuration"
      onSave={handleSave}
      onCancel={handleCancel}
      loading={loading}
      error={error}
      nodeId={node.id}
    >
      <Box sx={{ mb: 3 }}>
        <MemoryTypeSelector
          memoryType={memoryType}
          onMemoryTypeChange={setMemoryType}
        />
      </Box>
    </BaseNodeForm>
  );
};

export default MemoryDetailsForm;
