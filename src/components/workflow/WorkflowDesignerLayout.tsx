import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { WorkflowProvider } from '../../context/WorkflowContext';
import ConversationPanel from './ConversationPanel';
import WorkflowGraph from './WorkflowGraph';
import DetailsPanel from './DetailsPanel';

const WorkflowDesignerLayout: React.FC = () => {
  // Store panel sizes in state to persist during re-renders
  const [leftPanelSize, setLeftPanelSize] = useState(20);
  const [middlePanelSize, setMiddlePanelSize] = useState(50);
  const [rightPanelSize, setRightPanelSize] = useState(30);

  // Handle panel resize events
  const handleLeftPanelResize = (size: number) => {
    setLeftPanelSize(size);
  };

  const handleMiddlePanelResize = (size: number) => {
    setMiddlePanelSize(size);
  };

  const handleRightPanelResize = (size: number) => {
    setRightPanelSize(size);
  };

  return (
    <WorkflowProvider>
      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        <PanelGroup direction="horizontal" className="main-layout">
          <Panel 
            defaultSize={leftPanelSize} 
            minSize={15}
            onResize={handleLeftPanelResize}
          >
            <div className="panel-content">
              <ConversationPanel />
            </div>
          </Panel>
          
          <PanelResizeHandle className="resize-handle" />
          
          <Panel 
            defaultSize={middlePanelSize} 
            minSize={30}
            onResize={handleMiddlePanelResize}
          >
            <div className="panel-content">
              <WorkflowGraph />
            </div>
          </Panel>
          
          <PanelResizeHandle className="resize-handle" />
          
          <Panel 
            defaultSize={rightPanelSize} 
            minSize={15}
            onResize={handleRightPanelResize}
          >
            <div className="panel-content">
              <DetailsPanel />
            </div>
          </Panel>
        </PanelGroup>
      </Box>
    </WorkflowProvider>
  );
};

export default WorkflowDesignerLayout;
