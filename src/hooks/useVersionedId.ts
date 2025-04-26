/**
 * @fileoverview React hook for generating and managing versioned IDs for agents and tools.
 * 
 * Example usage in a React component:
 * ```jsx
 * import React from 'react';
 * import { useVersionedId } from './hooks/useVersionedId';
 * 
 * function MyComponent() {
 *   const agent = useVersionedId('agent', '1.2.0');
 *   return <div>{agent && `${agent.type} ID: ${agent.id} (v${agent.version})`}</div>;
 * }
 * ```
 */

import { useState, useEffect } from 'react';
import { newAgentVersion, newToolVersion, VersionedEntity } from '../utils/idGenerator';

/**
 * Hook for generating and managing versioned IDs for agents and tools.
 * 
 * @param type - The entity type ('agent' or 'tool')
 * @param version - The semantic version string (MAJOR.MINOR.PATCH)
 * @returns An object containing the entity ID, version, and creation timestamp, or null if invalid type
 */
export function useVersionedId(type: 'agent' | 'tool', version: string): VersionedEntity | null {
  const [entity, setEntity] = useState<VersionedEntity | null>(null);
  
  useEffect(() => {
    if (type === 'agent') setEntity(newAgentVersion(version));
    if (type === 'tool') setEntity(newToolVersion(version));
  }, [type, version]);
  
  return entity;
}
