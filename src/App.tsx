import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import Header from './components/Header';
import ConversationPanel from './components/ConversationPanel';
import WorkflowGraph from './components/WorkflowGraph';
import DetailsPanel from './components/DetailsPanel';
import { ThemeProvider } from './context/ThemeContext';
import './styles/global.css';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <div className="app-container">
        <Header />
        <PanelGroup direction="horizontal" className="main-layout">
          <Panel defaultSize={20} minSize={15}>
            <div className="panel-content">
              <ConversationPanel />
            </div>
          </Panel>
          
          <PanelResizeHandle className="resize-handle" />
          
          <Panel defaultSize={50} minSize={30}>
            <div className="panel-content">
              <WorkflowGraph />
            </div>
          </Panel>
          
          <PanelResizeHandle className="resize-handle" />
          
          <Panel defaultSize={30} minSize={15}>
            <div className="panel-content">
              <DetailsPanel />
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </ThemeProvider>
  );
};

export default App;
