import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { WorkflowNode, OperatorType } from '../../../types/nodeTypes';
import { useWorkflowContext } from '../../../context/WorkflowContext';
import { useRuntimeContext } from '../../../context/RuntimeContext';

// Import common components
import { BaseNodeForm, FormField } from './common';

// Import operator config components
import {
  StartOperatorConfig,
  EndOperatorConfig,
  AgentCallOperatorConfig,
  ToolCallOperatorConfig,
  MemoryReadOperatorConfig,
  MemoryWriteOperatorConfig,
  DecisionOperatorConfig,
  ParallelForkOperatorConfig,
  ParallelJoinOperatorConfig,
  LoopOperatorConfig,
  ErrorRetryOperatorConfig,
  TimeoutOperatorConfig,
  HumanPauseOperatorConfig,
  SubGraphOperatorConfig,
  SequenceOperatorConfig
} from './operator';

interface OperatorDetailsFormProps {
  node: WorkflowNode;
}

const OperatorDetailsForm: React.FC<OperatorDetailsFormProps> = ({ node }) => {
  const { updateNode } = useWorkflowContext();
  const { runtimeType } = useRuntimeContext();
  
  // Form state
  const [operatorType, setOperatorType] = useState<OperatorType>(node.operatorType || OperatorType.Start);
  const [description, setDescription] = useState(node.content || '');
  
  // Initialize operator config based on the node's existing config or create default
  const [operatorConfig, setOperatorConfig] = useState<any>(node.operatorConfig || getDefaultConfig(node.operatorType || OperatorType.Start));

  // Update form when node changes
  useEffect(() => {
    setOperatorType(node.operatorType || OperatorType.Start);
    setDescription(node.content || '');
    setOperatorConfig(node.operatorConfig || getDefaultConfig(node.operatorType || OperatorType.Start));
  }, [node]);

  // When operator type changes, reset the config to default for that type
  useEffect(() => {
    if (operatorType !== node.operatorType) {
      setOperatorConfig(getDefaultConfig(operatorType));
    }
  }, [operatorType, node.operatorType]);

  // Get default config based on operator type
  function getDefaultConfig(type: OperatorType) {
    switch (type) {
      case OperatorType.Start:
        return { trigger_type: 'human', resume_capable: false };
      case OperatorType.Stop:
        return { status_code: 'success', emit_transcript: true };
      case OperatorType.AgentCall:
        return { call_type: 'internal', agent_id: '', input_mapping: 'function mapInput(state) {\n  return state;\n}' };
      case OperatorType.ToolCall:
        return { call_type: 'internal', tool_name: '', tool_id: '' };
      case OperatorType.MemoryRead:
        return { memory_node_id: '', read_mode: 'exact', memory_key: '' };
      case OperatorType.MemoryWrite:
        return { memory_node_id: '', write_mode: 'set', memory_key: '' };
      case OperatorType.Decision:
        return { predicate_language: 'javascript', expression: '', branches: [] };
      case OperatorType.Sequential:
        return { steps: [], stop_on_error: true };
      case OperatorType.ParallelFork:
        return { branches: {}, wait_for_all: true };
      case OperatorType.ParallelJoin:
        return { join_strategy: 'merge', fork_node_id: '' };
      case OperatorType.Loop:
        return { condition_expression: '', max_iterations: 10, break_on_failure: true };
      case OperatorType.ErrorRetry:
        return { max_retries: 3, retry_strategy: 'exponential', initial_delay_seconds: 1 };
      case OperatorType.Timeout:
        return { timeout_seconds: 60, on_timeout_action: 'abort' };
      case OperatorType.HumanPause:
        return { message: '', notification_channel: 'none', require_approval: true };
      case OperatorType.SubGraph:
        return { workflow_id: '', isolate_state: true };
      default:
        return {};
    }
  }

  // Handle config changes
  const handleConfigChange = (newConfig: any) => {
    setOperatorConfig(newConfig);
  };

  // Check if form has been modified
  const isModified = 
    operatorType !== (node.operatorType || OperatorType.Start) ||
    description !== (node.content || '') ||
    JSON.stringify(operatorConfig) !== JSON.stringify(node.operatorConfig || getDefaultConfig(node.operatorType || OperatorType.Start));

  // Handle save operation
  const handleSave = async () => {
    // Update node with form values
    const updates: Partial<WorkflowNode> = {
      operatorType,
      content: description, // Keep this to maintain the description in the node
      operatorConfig
    };

    updateNode(node.id, updates);
  };

  // Handle cancel operation
  const handleCancel = () => {
    // Reset form to original values
    setOperatorType(node.operatorType || OperatorType.Start);
    setDescription(node.content || '');
    setOperatorConfig(node.operatorConfig || getDefaultConfig(node.operatorType || OperatorType.Start));
  };

  // Render the appropriate config component based on operator type
  const renderOperatorConfig = () => {
    switch (operatorType) {
      case OperatorType.Start:
        return <StartOperatorConfig config={operatorConfig} onConfigChange={handleConfigChange} />;
      case OperatorType.Stop:
        return <EndOperatorConfig config={operatorConfig} onConfigChange={handleConfigChange} />;
      case OperatorType.AgentCall:
        return <AgentCallOperatorConfig config={operatorConfig} onConfigChange={handleConfigChange} />;
      case OperatorType.ToolCall:
        return <ToolCallOperatorConfig config={operatorConfig} onConfigChange={handleConfigChange} />;
      case OperatorType.MemoryRead:
        return <MemoryReadOperatorConfig config={operatorConfig} onConfigChange={handleConfigChange} />;
      case OperatorType.MemoryWrite:
        return <MemoryWriteOperatorConfig config={operatorConfig} onConfigChange={handleConfigChange} />;
      case OperatorType.Decision:
        return <DecisionOperatorConfig config={operatorConfig} onConfigChange={handleConfigChange} nodeId={node.id} />;
      case OperatorType.Sequential:
        return <SequenceOperatorConfig config={operatorConfig} onConfigChange={handleConfigChange} />;
      case OperatorType.ParallelFork:
        return <ParallelForkOperatorConfig config={operatorConfig} onConfigChange={handleConfigChange} />;
      case OperatorType.ParallelJoin:
        return <ParallelJoinOperatorConfig config={operatorConfig} onConfigChange={handleConfigChange} />;
      case OperatorType.Loop:
        return <LoopOperatorConfig config={operatorConfig} onConfigChange={handleConfigChange} />;
      case OperatorType.ErrorRetry:
        return <ErrorRetryOperatorConfig config={operatorConfig} onConfigChange={handleConfigChange} />;
      case OperatorType.Timeout:
        return <TimeoutOperatorConfig config={operatorConfig} onConfigChange={handleConfigChange} />;
      case OperatorType.HumanPause:
        return <HumanPauseOperatorConfig config={operatorConfig} onConfigChange={handleConfigChange} />;
      case OperatorType.SubGraph:
        return <SubGraphOperatorConfig config={operatorConfig} onConfigChange={handleConfigChange} />;
      default:
        return null;
    }
  };

  return (
    <BaseNodeForm 
      title={`${node.name} Configuration`}
      onSave={handleSave}
      onCancel={handleCancel}
      isModified={isModified}
      nodeId={node.id}>
      <FormControl fullWidth>
        <InputLabel id="operator-type-label">Operator Type</InputLabel>
        <Select
          labelId="operator-type-label"
          id="operator-type"
          value={operatorType}
          label="Operator Type"
          onChange={(e) => setOperatorType(e.target.value as OperatorType)}
        >
          {Object.values(OperatorType).map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormField
        id="operator-description"
        label="Description"
        value={description}
        onChange={setDescription}
        multiline
        rows={3}
        placeholder="Enter a description for this operator"
      />

      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle1" gutterBottom>
        {operatorType} Configuration
      </Typography>
      
      {renderOperatorConfig()}
    </BaseNodeForm>
  );
};

export default OperatorDetailsForm;
