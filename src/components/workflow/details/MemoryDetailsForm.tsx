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

  // Handle save operation
  const { execute: handleSave, loading, error } = useAsyncOperation(async () => {
    // Update the node with form values
    const updatedNode = {
      ...node,
      memoryType
    };
    
    updateNode(updatedNode);
  });

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
      <MemoryTypeSelector
        memoryType={memoryType}
        onMemoryTypeChange={setMemoryType}
        sx={{ mt: 2 }}
      />
    </BaseNodeForm>
  );
};

export default MemoryDetailsForm;
