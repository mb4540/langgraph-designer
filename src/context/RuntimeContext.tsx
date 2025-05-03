import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RuntimeType } from '../utils/workflowValidator';

interface RuntimeContextType {
  runtimeType: RuntimeType;
  setRuntimeType: (type: RuntimeType) => void;
}

const RuntimeContext = createContext<RuntimeContextType | undefined>(undefined);

export const RuntimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [runtimeType, setRuntimeType] = useState<RuntimeType>('langgraph');

  return (
    <RuntimeContext.Provider value={{ runtimeType, setRuntimeType }}>
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
