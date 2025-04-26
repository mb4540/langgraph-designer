import { useState } from 'react';
import { WorkGroup, AccessRequest, EntityRolePair } from '../types/workGroup';

/**
 * Custom hook for managing work groups and access requests
 */
export const useWorkGroups = (initialWorkGroups: WorkGroup[], initialAccessRequests: AccessRequest[]) => {
  const [workGroups, setWorkGroups] = useState<WorkGroup[]>(initialWorkGroups);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>(initialAccessRequests);

  /**
   * Create a new work group
   */
  const createWorkGroup = (workGroup: Omit<WorkGroup, 'id' | 'access' | 'pendingRequests'>) => {
    const newWorkGroup: WorkGroup = {
      id: Math.max(0, ...workGroups.map(g => g.id)) + 1,
      access: 'Admin',
      pendingRequests: 0,
      ...workGroup
    };
    setWorkGroups([...workGroups, newWorkGroup]);
    return newWorkGroup;
  };

  /**
   * Update an existing work group
   */
  const updateWorkGroup = (id: number, updates: Partial<WorkGroup>) => {
    const updatedWorkGroups = workGroups.map(group => 
      group.id === id ? { ...group, ...updates } : group
    );
    setWorkGroups(updatedWorkGroups);
  };

  /**
   * Delete a work group
   */
  const deleteWorkGroup = (id: number) => {
    setWorkGroups(workGroups.filter(group => group.id !== id));
    // Also remove any associated access requests
    setAccessRequests(accessRequests.filter(request => request.workGroupId !== id));
  };

  /**
   * Submit an access request for a work group
   */
  const submitAccessRequest = (workGroupId: number, accessType: 'partial' | 'admin', entityRolePairs?: EntityRolePair[]) => {
    const workGroup = workGroups.find(group => group.id === workGroupId);
    if (!workGroup) return null;

    // Create the new request
    const newRequest: AccessRequest = {
      id: Math.max(0, ...accessRequests.map(r => r.id)) + 1,
      workGroupId,
      requestorName: 'Current User', // In a real app, this would come from authentication
      requestorId: 'current.user@example.com', // In a real app, this would come from authentication
      requestedDate: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
      status: 'Pending',
      accessType,
      entityRolePairs: accessType === 'partial' ? entityRolePairs : undefined
    };

    // Add the request to the list
    setAccessRequests([...accessRequests, newRequest]);

    // Update the pending requests count for the work group
    updateWorkGroup(workGroupId, {
      pendingRequests: (workGroup.pendingRequests || 0) + 1
    });

    return newRequest;
  };

  /**
   * Update the status of an access request
   */
  const updateRequestStatus = (requestId: number, status: 'Approved' | 'Rejected') => {
    // Find the request
    const request = accessRequests.find(r => r.id === requestId);
    if (!request) return;

    // Update the request status
    const updatedRequests = accessRequests.map(r => 
      r.id === requestId ? { ...r, status } : r
    );
    setAccessRequests(updatedRequests);

    // Update the pending requests count for the work group
    const workGroup = workGroups.find(group => group.id === request.workGroupId);
    if (workGroup && workGroup.pendingRequests && workGroup.pendingRequests > 0) {
      updateWorkGroup(request.workGroupId, {
        pendingRequests: workGroup.pendingRequests - 1
      });
    }

    return status;
  };

  /**
   * Approve an access request
   */
  const approveRequest = (requestId: number) => {
    return updateRequestStatus(requestId, 'Approved');
  };

  /**
   * Reject an access request
   */
  const rejectRequest = (requestId: number) => {
    return updateRequestStatus(requestId, 'Rejected');
  };

  /**
   * Get pending requests for a work group
   */
  const getPendingRequests = (workGroupId: number) => {
    return accessRequests.filter(
      request => request.workGroupId === workGroupId && request.status === 'Pending'
    );
  };

  return {
    workGroups,
    accessRequests,
    createWorkGroup,
    updateWorkGroup,
    deleteWorkGroup,
    submitAccessRequest,
    approveRequest,
    rejectRequest,
    getPendingRequests
  };
};
