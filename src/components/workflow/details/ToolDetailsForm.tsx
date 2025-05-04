import React, { useState, useEffect } from 'react';
import { WorkflowNode } from '../../../types/nodeTypes';
import { useWorkflowContext } from '../../../context/WorkflowContext';
import { useThemeContext } from '../../../context/ThemeContext';

// Import modular components
import { TOOL_TYPES, TOOL_TAGS } from './tools/toolData';
import ToolSelector from './tools/ToolSelector';
import ToolCodeEditor from './tools/ToolCodeEditor';
import { useToolValidation } from './tools/useToolValidation';

// Import common components
import BaseNodeForm from './common/BaseNodeForm';

interface ToolDetailsFormProps {
  node: WorkflowNode;
}

const ToolDetailsForm: React.FC<ToolDetailsFormProps> = ({ node }) => {
  const { updateNode } = useWorkflowContext();
  const { mode } = useThemeContext();
  const [toolType, setToolType] = useState(node.toolType || '');
  const [isEditingTool, setIsEditingTool] = useState(false);
  const [toolCode, setToolCode] = useState('');
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'category'>('name');

  // Tool validation hook
  const { 
    loading: validationLoading, 
    error: validationError, 
    validateCode,
    resetError: resetValidationError
  } = useToolValidation();

  // Filter tools based on search query and selected tags
  const filteredTools = TOOL_TYPES.filter(tool => {
    // Filter by search query
    const matchesSearch = 
      searchQuery === '' || 
      tool.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    // Filter by selected tags
    const matchesTags = 
      selectedTags.length === 0 || 
      selectedTags.some(tag => tool.tags?.includes(tag));
    
    return matchesSearch && matchesTags;
  }).sort((a, b) => {
    if (sortBy === 'name') {
      return a.label.localeCompare(b.label);
    } else {
      return a.source.localeCompare(b.source);
    }
  });

  // Update form when node changes
  useEffect(() => {
    setToolType(node.toolType || '');
    setIsEditingTool(false);
    
    // Set tool code based on selected tool type
    if (node.toolType) {
      const selectedTool = TOOL_TYPES.find(tool => tool.value === node.toolType);
      if (selectedTool) {
        // If the node has custom code, use it, otherwise use the template
        setToolCode(node.content && node.content !== `This is a tool component.` ? 
          node.content : selectedTool.code);
      }
    }
  }, [node]);

  // Check if form has been modified
  const isModified = 
    toolType !== (node.toolType || '') || 
    (isEditingTool && toolCode !== (node.content || ''));

  // Handle save operation
  const handleSave = async () => {
    if (isEditingTool) {
      // Validate code before saving
      await validateCode(toolCode);
    }
    
    const updates: Partial<WorkflowNode> = {};
    
    // Include toolType for tool nodes
    updates.toolType = toolType;
    
    // For tools in edit mode, save the tool code as content
    if (isEditingTool) {
      updates.content = toolCode;
    }
    
    // Add version information from the selected tool
    if (toolType) {
      const selectedTool = TOOL_TYPES.find(tool => tool.value === toolType);
      if (selectedTool) {
        updates.version = selectedTool.version;
        updates.versionedId = selectedTool.versionedId;
        updates.createdAt = selectedTool.createdAt;
      }
    }
    
    updateNode(node.id, updates);
    
    // Exit editing mode after saving
    if (isEditingTool) {
      setIsEditingTool(false);
    }
  };

  // Handle cancel operation
  const handleCancel = () => {
    // Reset form to original values
    setToolType(node.toolType || '');
    setIsEditingTool(false);
    
    // Set tool code based on selected tool type
    if (node.toolType) {
      const selectedTool = TOOL_TYPES.find(tool => tool.value === node.toolType);
      if (selectedTool) {
        // If the node has custom code, use it, otherwise use the template
        setToolCode(node.content && node.content !== `This is a tool component.` ? 
          node.content : selectedTool.code);
      }
    }
  };

  // Validate code when it changes
  useEffect(() => {
    if (isEditingTool && toolCode) {
      const timeoutId = setTimeout(() => {
        validateCode(toolCode).catch(() => {
          // Validation failed, but we don't need to do anything here
          // as the error state is already set by the hook
        });
      }, 1000); // Debounce validation
      
      return () => clearTimeout(timeoutId);
    }
  }, [toolCode, isEditingTool, validateCode]);

  // Tag filter handlers
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  const handleCategoryToggle = (category: string) => {
    const categoryTags = TOOL_TAGS
      .filter(tag => tag.category === category)
      .map(tag => tag.value);
    
    const allSelected = categoryTags.every(tag => selectedTags.includes(tag));
    
    if (allSelected) {
      // Remove all tags in this category
      setSelectedTags(prev => prev.filter(tag => !categoryTags.includes(tag)));
    } else {
      // Add all tags in this category that aren't already selected
      const tagsToAdd = categoryTags.filter(tag => !selectedTags.includes(tag));
      setSelectedTags(prev => [...prev, ...tagsToAdd]);
    }
  };

  // Get the selected tool for the code editor
  const selectedToolInfo = TOOL_TYPES.find(tool => tool.value === toolType);

  return (
    <BaseNodeForm 
      title={`${node.name} Configuration`}
      onSave={handleSave}
      onCancel={handleCancel}
      isModified={isModified}
      nodeId={node.id}
    >
      {isEditingTool && selectedToolInfo ? (
        <ToolCodeEditor
          selectedTool={selectedToolInfo}
          toolCode={toolCode}
          onToolCodeChange={setToolCode}
          onExitEditMode={() => setIsEditingTool(false)}
          validationLoading={validationLoading}
          validationError={validationError}
          onResetValidationError={resetValidationError}
          theme={mode}
        />
      ) : (
        <ToolSelector
          toolTypes={TOOL_TYPES}
          selectedToolType={toolType}
          onToolTypeSelect={setToolType}
          onEditTool={() => {
            setIsEditingTool(true);
            // Set the tool code if not already set
            if (!toolCode && selectedToolInfo) {
              setToolCode(selectedToolInfo.code);
            }
            // Reset any validation errors
            resetValidationError();
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          onCategoryToggle={handleCategoryToggle}
          onClearAllTags={() => setSelectedTags([])}
          toolTags={TOOL_TAGS}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filteredTools={filteredTools}
        />
      )}
    </BaseNodeForm>
  );
};

export default ToolDetailsForm;
