/**
 * Utility functions for generating versioned IDs for agents and tools.
 * 
 * Example usage in a React component:
 * ```jsx
 * import React from 'react';
 * import { useVersionedId } from '../hooks/useVersionedId';
 * 
 * function MyComponent() {
 *   const agent = useVersionedId('agent', '1.2.0');
 *   return <div>{agent && `${agent.type} ID: ${agent.id} (v${agent.version})`}</div>;
 * }
 * ```
 */

import { ulid } from 'ulid';

/**
 * Interface for versioned entity objects
 */
export interface VersionedEntity {
  /**
   * The type of entity (agent or tool)
   */
  type: 'agent' | 'tool';
  /**
   * The unique ID of the entity
   */
  id: string;
  /**
   * The semantic version string (MAJOR.MINOR.PATCH)
   */
  version: string;
  /**
   * The creation timestamp of the entity
   */
  createdAt: string;
}

/**
 * Generates a new versioned ID for an agent.
 * 
 * @param version The semantic version string (MAJOR.MINOR.PATCH)
 * @returns An object containing the agent ID, version, and creation timestamp
 */
export function newAgentVersion(version: string): VersionedEntity {
  return {
    type: 'agent',
    id: ulid(),
    version,
    createdAt: new Date().toISOString()
  };
}

/**
 * Generates a new versioned ID for a tool.
 * 
 * @param version The semantic version string (MAJOR.MINOR.PATCH)
 * @returns An object containing the tool ID, version, and creation timestamp
 */
export function newToolVersion(version: string): VersionedEntity {
  return {
    type: 'tool',
    id: ulid(),
    version,
    createdAt: new Date().toISOString()
  };
}
