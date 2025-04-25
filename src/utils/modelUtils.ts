import { MODEL_DISPLAY_NAMES } from '../constants/modelConstants';

/**
 * Get the display name for a model ID
 * @param modelId The ID of the model
 * @returns The display name for the model, or the model ID if not found
 */
export const getModelDisplayName = (modelId: string | undefined): string => {
  if (!modelId) {
    return 'Unknown Model';
  }
  
  return MODEL_DISPLAY_NAMES[modelId] || modelId;
};

/**
 * Check if a model ID is valid
 * @param modelId The ID of the model to check
 * @returns True if the model ID is valid, false otherwise
 */
export const isValidModel = (modelId: string | undefined): boolean => {
  if (!modelId) {
    return false;
  }
  
  return Object.keys(MODEL_DISPLAY_NAMES).includes(modelId);
};

/**
 * Get a list of available model IDs
 * @returns Array of model IDs
 */
export const getAvailableModelIds = (): string[] => {
  return Object.keys(MODEL_DISPLAY_NAMES);
};
