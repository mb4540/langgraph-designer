import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { WorkflowNode } from '../../../store/workflowStore';
import { useWorkflowContext } from '../../../context/WorkflowContext';

// Output parser types
const OUTPUT_PARSER_TYPES = [
  {
    value: 'json-output-parser',
    label: 'JSONOutputParser',
    description: 'Converts raw model text into a validated Python dict that must be well-formed JSON, raising an error if the structure is malformed.',
    source: 'LangChain'
  },
  {
    value: 'pydantic-output-parser',
    label: 'PydanticOutputParser',
    description: 'Forces the LLM\'s response to match a Pydantic model, guaranteeing each key and data type before downstream use.',
    source: 'LangChain'
  },
  {
    value: 'comma-separated-list-parser',
    label: 'CommaSeparatedListOutputParser',
    description: 'Takes a comma-separated string (e.g., "alpha, beta, gamma") and returns it as a clean Python list.',
    source: 'LangChain'
  },
  {
    value: 'datetime-output-parser',
    label: 'DatetimeOutputParser',
    description: 'Reads date/time strings from the LLM and returns native datetime objects in the desired format.',
    source: 'LangChain'
  },
  {
    value: 'react-output-parser',
    label: 'ReActOutputParser',
    description: 'Designed for ReAct-style agents; splits output into an AgentAction (tool call) or an AgentFinish (final answer).',
    source: 'LangChain'
  },
  {
    value: 'structured-output-parser',
    label: 'StructuredOutputParser',
    description: 'Maps text into a dictionary that follows a custom response schema—useful when you need multiple named fields or arrays.',
    source: 'LangChain'
  },
];

interface OutputParserDetailsFormProps {
  node: WorkflowNode;
}

const OutputParserDetailsForm: React.FC<OutputParserDetailsFormProps> = ({ node }) => {
  const { updateNode } = useWorkflowContext();
  const [parserType, setParserType] = useState(node.parserType || 'json-output-parser');
  
  // Update form when node changes
  useEffect(() => {
    setParserType(node.parserType || 'json-output-parser');
  }, [node]);

  const handleSave = () => {
    updateNode(node.id, {
      parserType
    });
  };

  return (
    <>
      <Box sx={{ mb: 2, mt: 2 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Output Parser Type</FormLabel>
          <RadioGroup
            value={parserType}
            onChange={(e) => setParserType(e.target.value)}
          >
            {OUTPUT_PARSER_TYPES.map(parser => (
              <Box key={parser.value} sx={{ mb: 2, border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                <FormControlLabel 
                  value={parser.value} 
                  control={<Radio />} 
                  label={
                    <Box>
                      <Typography variant="subtitle1">{parser.label}</Typography>
                      <Typography variant="body2" color="text.secondary">{parser.description}</Typography>
                      {parser.source && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                          Source: {parser.source}
                        </Typography>
                      )}
                    </Box>
                  } 
                />
              </Box>
            ))}
          </RadioGroup>
        </FormControl>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </Box>
    </>
  );
};

export default OutputParserDetailsForm;
