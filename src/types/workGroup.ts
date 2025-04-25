// Interface for work-group type
export interface WorkGroup {
  id: number;
  name: string;
  owner: string;
  scope: 'Public' | 'Restricted';
  access: 'Admin' | 'Editor' | 'Viewer';
  description: string;
  pendingRequests?: number; // Number of pending access requests
}

// Interface for entity-role pair
export interface EntityRolePair {
  entity: string;
  role: string;
}

// Interface for access request
export interface AccessRequest {
  id: number;
  workGroupId: number;
  requestorName: string;
  requestorId: string;
  requestedDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  accessType: 'partial' | 'admin';
  entityRolePairs?: EntityRolePair[];
}

// Sample data for work-groups
export const sampleWorkGroups: WorkGroup[] = [
  { id: 1, name: 'Marketing Team', owner: 'John Smith', scope: 'Public', access: 'Admin', description: 'Work-group for marketing team workflows and agents', pendingRequests: 3 },
  { id: 2, name: 'Sales Automation', owner: 'Sarah Johnson', scope: 'Restricted', access: 'Editor', description: 'Sales process automation workflows', pendingRequests: 0 },
  { id: 3, name: 'Customer Support', owner: 'Michael Brown', scope: 'Public', access: 'Viewer', description: 'Customer support automation and agent workflows', pendingRequests: 1 },
  { id: 4, name: 'Research Team', owner: 'Emily Davis', scope: 'Restricted', access: 'Admin', description: 'Research and development workflow group', pendingRequests: 2 },
  { id: 5, name: 'Executive Dashboard', owner: 'Robert Wilson', scope: 'Restricted', access: 'Viewer', description: 'Executive reporting and analytics workflows', pendingRequests: 0 },
];

// Sample data for access requests
export const sampleAccessRequests: AccessRequest[] = [
  {
    id: 1,
    workGroupId: 1,
    requestorName: 'Alice Johnson',
    requestorId: 'alice.johnson@example.com',
    requestedDate: '2025-04-20',
    status: 'Pending',
    accessType: 'partial',
    entityRolePairs: [{ entity: 'Skill', role: 'Read' }]
  },
  {
    id: 2,
    workGroupId: 1,
    requestorName: 'Bob Smith',
    requestorId: 'bob.smith@example.com',
    requestedDate: '2025-04-22',
    status: 'Pending',
    accessType: 'admin'
  },
  {
    id: 3,
    workGroupId: 1,
    requestorName: 'Carol Davis',
    requestorId: 'carol.davis@example.com',
    requestedDate: '2025-04-23',
    status: 'Pending',
    accessType: 'partial',
    entityRolePairs: [{ entity: 'Team', role: 'Write' }, { entity: 'Workflow', role: 'Read' }]
  },
  {
    id: 4,
    workGroupId: 3,
    requestorName: 'David Wilson',
    requestorId: 'david.wilson@example.com',
    requestedDate: '2025-04-24',
    status: 'Pending',
    accessType: 'partial',
    entityRolePairs: [{ entity: 'Agent', role: 'Read' }]
  },
  {
    id: 5,
    workGroupId: 4,
    requestorName: 'Emma Brown',
    requestorId: 'emma.brown@example.com',
    requestedDate: '2025-04-21',
    status: 'Pending',
    accessType: 'admin'
  },
  {
    id: 6,
    workGroupId: 4,
    requestorName: 'Frank Thomas',
    requestorId: 'frank.thomas@example.com',
    requestedDate: '2025-04-25',
    status: 'Pending',
    accessType: 'partial',
    entityRolePairs: [{ entity: 'Skill', role: 'Write' }]
  }
];
