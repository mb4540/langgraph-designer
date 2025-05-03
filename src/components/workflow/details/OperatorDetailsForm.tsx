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

// Import operator config components
import StartOperatorConfig from './StartOperatorConfig';
import EndOperatorConfig from './EndOperatorConfig';
import AgentCallOperatorConfig from './AgentCallOperatorConfig';
import ToolCallOperatorConfig from './ToolCallOperatorConfig';
import MemoryReadOperatorConfig from './MemoryReadOperatorConfig';
import MemoryWriteOperatorConfig from './MemoryWriteOperatorConfig';
import DecisionOperatorConfig from './DecisionOperatorConfig';
import ParallelForkOperatorConfig from './ParallelForkOperatorConfig';
import ParallelJoinOperatorConfig from './ParallelJoinOperatorConfig';
import LoopOperatorConfig from './LoopOperatorConfig';
import ErrorRetryOperatorConfig from './ErrorRetryOperatorConfig';
import TimeoutOperatorConfig from './TimeoutOperatorConfig';
import HumanPauseOperatorConfig from './HumanPauseOperatorConfig';
import SubGraphOperatorConfig from './SubGraphOperatorConfig';

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
        return { agent_type: runtimeType === 'autogen' ? 'AssistantAgent' : 'OpenAI', llm_model: 'gpt-4o', prompt_template: '' };
      case OperatorType.ToolCall:
        return { tool_name: '', function_signature: {}, side_effect: false };
      case OperatorType.MemoryRead:
        return { store: 'zep', query: '', top_k: 5 };
      case OperatorType.MemoryWrite:
        return { store: 'zep', data_path: '', upsert: true };
      case OperatorType.Decision:
        return { predicate_language: 'javascript', expression: '', branches: [] };
      case OperatorType.ParallelFork:
        return { strategy: 'fanout', gather_mode: 'wait_all' };
      case OperatorType.ParallelJoin:
        return { merge_strategy: 'concat', allow_partial: false };
      case OperatorType.Loop:
        return { condition_expression: '', max_iterations: 10, break_on_failure: true };
      case OperatorType.ErrorRetry:
        return { max_attempts: 3, backoff_strategy: 'exponential', retryable_errors: [] };
      case OperatorType.Timeout:
        return { timeout_sec: 60, on_timeout: 'abort' };
      case OperatorType.HumanPause:
        return { message_to_user: '', channel: 'web' };
      case OperatorType.SubGraph:
        return { graph_id: '', mode: 'inline', isolate_memory: false };
      default:
        return {};
    }
  }

  const handleSave = () => {
    // Update node with form values
    const updates: Partial<WorkflowNode> = {
      operatorType,
      content: description, // Keep this to maintain the description in the node
      operatorConfig
    };

    updateNode(node.id, updates);
  };

  const handleCancel = () => {
    // Reset form to original values
    setOperatorType(node.operatorType || OperatorType.Start);
    setDescription(node.content || '');
    setOperatorConfig(node.operatorConfig || getDefaultConfig(node.operatorType || OperatorType.Start));
  };

  // Expose the functions to save and cancel changes
  useEffect(() => {
    // Track if there are unsaved changes
    const isModified = 
      operatorType !== (node.operatorType || OperatorType.Start) ||
      description !== (node.content || '') ||
      JSON.stringify(operatorConfig) !== JSON.stringify(node.operatorConfig || getDefaultConfig(node.operatorType || OperatorType.Start));

    // Expose functions for the DetailsPanel to call
    (window as any).saveNodeChanges = handleSave;
    (window as any).cancelNodeChanges = handleCancel;
    (window as any).isNodeModified = isModified;

    return () => {
      // Clean up
      delete (window as any).saveNodeChanges;
      delete (window as any).cancelNodeChanges;
      delete (window as any).isNodeModified;
    };
  }, [operatorType, description, operatorConfig, node]);

  // Render the appropriate config component based on operator type
  const renderOperatorConfig = () => {
    switch (operatorType) {
      case OperatorType.Start:
        return <StartOperatorConfig config={operatorConfig} setConfig={setOperatorConfig} />;
      case OperatorType.Stop:
        return <EndOperatorConfig config={operatorConfig} setConfig={setOperatorConfig} />;
      case OperatorType.AgentCall:
        return <AgentCallOperatorConfig config={operatorConfig} setConfig={setOperatorConfig} />;
      case OperatorType.ToolCall:
        return <ToolCallOperatorConfig config={operatorConfig} setConfig={setOperatorConfig} />;
      case OperatorType.MemoryRead:
        return <MemoryReadOperatorConfig config={operatorConfig} setConfig={setOperatorConfig} />;
      case OperatorType.MemoryWrite:
        return <MemoryWriteOperatorConfig config={operatorConfig} setConfig={setOperatorConfig} />;
      case OperatorType.Decision:
        return <DecisionOperatorConfig config={operatorConfig} setConfig={setOperatorConfig} />;
      case OperatorType.ParallelFork:
        return <ParallelForkOperatorConfig config={operatorConfig} setConfig={setOperatorConfig} />;
      case OperatorType.ParallelJoin:
        return <ParallelJoinOperatorConfig config={operatorConfig} setConfig={setOperatorConfig} />;
      case OperatorType.Loop:
        return <LoopOperatorConfig config={operatorConfig} setConfig={setOperatorConfig} />;
      case OperatorType.ErrorRetry:
        return <ErrorRetryOperatorConfig config={operatorConfig} setConfig={setOperatorConfig} />;
      case OperatorType.Timeout:
        return <TimeoutOperatorConfig config={operatorConfig} setConfig={setOperatorConfig} />;
      case OperatorType.HumanPause:
        return <HumanPauseOperatorConfig config={operatorConfig} setConfig={setOperatorConfig} />;
      case OperatorType.SubGraph:
        return <SubGraphOperatorConfig config={operatorConfig} setConfig={setOperatorConfig} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <FormControl fullWidth margin="normal">
        <InputLabel id="operator-type-label">Operator Type</InputLabel>
        <Select
          labelId="operator-type-label"
          value={operatorType}
          label="Operator Type"
          onChange={(e) => setOperatorType(e.target.value as OperatorType)}
        >
          {Object.values(OperatorType).map((type) => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </Select>
      </FormControl>
      
      {/* Render operator-specific configuration */}
      <Box sx={{ mt: 3 }}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" gutterBottom>
          {operatorType} Configuration
        </Typography>
        {renderOperatorConfig()}
      </Box>
    </Box>
  );
};

export default OperatorDetailsForm;
