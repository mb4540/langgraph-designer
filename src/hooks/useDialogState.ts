import { useState } from 'react';

/**
 * Custom hook for managing dialog open/close states
 * 
 * @param initialState - Initial open state of the dialog (default: false)
 * @returns Dialog state and handlers
 */
export const useDialogState = <T = undefined>(initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [data, setData] = useState<T | null>(null);

  /**
   * Open the dialog, optionally with data
   */
  const open = (dialogData?: T) => {
    if (dialogData !== undefined) {
      setData(dialogData);
    }
    setIsOpen(true);
  };

  /**
   * Close the dialog and clear its data
   */
  const close = () => {
    setIsOpen(false);
    setData(null);
  };

  /**
   * Update the dialog data without changing open state
   */
  const updateData = (newData: T | null) => {
    setData(newData);
  };

  return {
    isOpen,
    data,
    open,
    close,
    updateData
  };
};
