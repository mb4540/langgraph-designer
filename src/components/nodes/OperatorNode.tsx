import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';

// Import operator-related icons
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BuildIcon from '@mui/icons-material/Build';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import MemoryIcon from '@mui/icons-material/Memory';
import SaveIcon from '@mui/icons-material/Save';
import HelpIcon from '@mui/icons-material/Help';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import MergeIcon from '@mui/icons-material/Merge';
import LoopIcon from '@mui/icons-material/Loop';
import ReplayIcon from '@mui/icons-material/Replay';
import TimerIcon from '@mui/icons-material/Timer';
import PauseIcon from '@mui/icons-material/Pause';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

import { OperatorType } from '../../types/nodeTypes';

// Styled components for the operator node
const OperatorCard = styled(Card)(({ theme }) => ({
  minWidth: 180,
  maxWidth: 220,
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[2],
  position: 'relative',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const DeleteButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  padding: theme.spacing(0.5),
  zIndex: 10,
}));

const StyledHandle = styled(Handle)(({ theme, position }) => ({
  width: 12,
  height: 12,
  borderRadius: 6,
  background: theme.palette.primary.main,
  border: `2px solid ${theme.palette.background.paper}`,
  top: position === Position.Top ? '-6px' : 'auto',
  bottom: position === Position.Bottom ? '-6px' : 'auto',
  left: position === Position.Left ? '-6px' : 'auto',
  right: position === Position.Right ? '-6px' : 'auto',
}));

// Map operator types to their corresponding icons
const operatorIcons: Record<OperatorType, React.ElementType> = {
  [OperatorType.Start]: PlayArrowIcon,
  [OperatorType.Stop]: StopIcon,
  [OperatorType.Sequential]: ArrowForwardIcon,
  [OperatorType.ToolCall]: BuildIcon,
  [OperatorType.AgentCall]: SmartToyIcon,
  [OperatorType.MemoryRead]: MemoryIcon,
  [OperatorType.MemoryWrite]: SaveIcon,
  [OperatorType.Decision]: HelpIcon,
  [OperatorType.ParallelFork]: CallSplitIcon,
  [OperatorType.ParallelJoin]: MergeIcon,
  [OperatorType.Loop]: LoopIcon,
  [OperatorType.ErrorRetry]: ReplayIcon,
  [OperatorType.Timeout]: TimerIcon,
  [OperatorType.HumanPause]: PauseIcon,
  [OperatorType.SubGraph]: AccountTreeIcon,
};

// Map operator types to colors
const operatorColors: Record<OperatorType, string> = {
  [OperatorType.Start]: '#4caf50', // Green
  [OperatorType.Stop]: '#f44336', // Red
  [OperatorType.Sequential]: '#2196f3', // Blue
  [OperatorType.ToolCall]: '#ff9800', // Orange
  [OperatorType.AgentCall]: '#9c27b0', // Purple
  [OperatorType.MemoryRead]: '#00bcd4', // Cyan
  [OperatorType.MemoryWrite]: '#009688', // Teal
  [OperatorType.Decision]: '#673ab7', // Deep Purple
  [OperatorType.ParallelFork]: '#3f51b5', // Indigo
  [OperatorType.ParallelJoin]: '#3f51b5', // Indigo
  [OperatorType.Loop]: '#795548', // Brown
  [OperatorType.ErrorRetry]: '#ff5722', // Deep Orange
  [OperatorType.Timeout]: '#607d8b', // Blue Grey
  [OperatorType.HumanPause]: '#e91e63', // Pink
  [OperatorType.SubGraph]: '#8bc34a', // Light Green
};

interface OperatorNodeData {
  label: string;
  operatorType: OperatorType;
  onDelete: (id: string) => void;
}

const OperatorNode: React.FC<NodeProps<OperatorNodeData>> = ({ id, data }) => {
  const { label, operatorType, onDelete } = data;
  const IconComponent = operatorIcons[operatorType];
  const color = operatorColors[operatorType];

  return (
    <OperatorCard sx={{ borderLeft: `5px solid ${color}` }}>
      <DeleteButton size="small" onClick={() => onDelete(id)}>
        <DeleteIcon fontSize="small" />
      </DeleteButton>
      
      {/* Connection handles - one on each side for flexibility */}
      <StyledHandle type="target" position={Position.Top} id="target-top" />
      <StyledHandle type="source" position={Position.Bottom} id="source-bottom" />
      <StyledHandle type="target" position={Position.Left} id="target-left" />
      <StyledHandle type="source" position={Position.Right} id="source-right" />
      
      <CardContent sx={{ padding: 2, paddingBottom: '16px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <IconComponent sx={{ mr: 1, color }} />
          <Typography variant="subtitle1" component="div" noWrap>
            {label}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
          {operatorType}
        </Typography>
      </CardContent>
    </OperatorCard>
  );
};

export default memo(OperatorNode);
