import React, { createContext, useContext, useState } from 'react';
import { RuntimeType } from '../utils/workflowValidator';

interface RuntimeSettings {
  checkpointStore?: string;
  // Add other runtime settings as needed
}

interface RuntimeContextType {
  runtimeType: RuntimeType;
  runtimeSettings: RuntimeSettings;
  updateRuntimeType: (type: RuntimeType) => void;
  updateRuntimeSettings: (settings: RuntimeSettings) => void;
}

const defaultRuntimeSettings: RuntimeSettings = {
  checkpointStore: 'memory'
};

const RuntimeContext = createContext<RuntimeContextType>({
  runtimeType: 'langgraph',
  runtimeSettings: defaultRuntimeSettings,
  updateRuntimeType: () => {},
  updateRuntimeSettings: () => {}
});

export const RuntimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [runtimeType, setRuntimeType] = useState<RuntimeType>('langgraph');
  const [runtimeSettings, setRuntimeSettings] = useState<RuntimeSettings>(defaultRuntimeSettings);

  const updateRuntimeType = (type: RuntimeType) => {
    setRuntimeType(type);
  };

  const updateRuntimeSettings = (settings: RuntimeSettings) => {
    setRuntimeSettings(settings);
  };

  return (
    <RuntimeContext.Provider value={{ runtimeType, runtimeSettings, updateRuntimeType, updateRuntimeSettings }}>
      {children}
    </RuntimeContext.Provider>
  );
};

export const useRuntimeContext = () => useContext(RuntimeContext);
