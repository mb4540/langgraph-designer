import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RuntimeType } from '../utils/workflowValidator';

interface RuntimeSettings {
  checkpointStore?: string;
}

interface RuntimeContextType {
  runtimeType: RuntimeType;
  setRuntimeType: (type: RuntimeType) => void;
  runtimeSettings: RuntimeSettings;
  updateRuntimeSettings: (settings: RuntimeSettings) => void;
}

const RuntimeContext = createContext<RuntimeContextType | undefined>(undefined);

export const RuntimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [runtimeType, setRuntimeType] = useState<RuntimeType>('langgraph');
  const [runtimeSettings, setRuntimeSettings] = useState<RuntimeSettings>({});

  const updateRuntimeSettings = (settings: RuntimeSettings) => {
    setRuntimeSettings(settings);
  };

  return (
    <RuntimeContext.Provider value={{ 
      runtimeType, 
      setRuntimeType,
      runtimeSettings,
      updateRuntimeSettings
    }}>
      {children}
    </RuntimeContext.Provider>
  );
};

export const useRuntimeContext = (): RuntimeContextType => {
  const context = useContext(RuntimeContext);
  if (context === undefined) {
    throw new Error('useRuntimeContext must be used within a RuntimeProvider');
  }
  return context;
};
