// Interface for work-group type
export interface WorkGroup {
  id: number;
  name: string;
  owner: string;
  scope: 'Public' | 'Restricted';
  access: 'Admin' | 'Editor' | 'Viewer';
  description: string;
}

// Sample data for work-groups
export const sampleWorkGroups: WorkGroup[] = [
  { id: 1, name: 'Marketing Team', owner: 'John Smith', scope: 'Public', access: 'Admin', description: 'Work-group for marketing team workflows and agents' },
  { id: 2, name: 'Sales Automation', owner: 'Sarah Johnson', scope: 'Restricted', access: 'Editor', description: 'Sales process automation workflows' },
  { id: 3, name: 'Customer Support', owner: 'Michael Brown', scope: 'Public', access: 'Viewer', description: 'Customer support automation and agent workflows' },
  { id: 4, name: 'Research Team', owner: 'Emily Davis', scope: 'Restricted', access: 'Admin', description: 'Research and development workflow group' },
  { id: 5, name: 'Executive Dashboard', owner: 'Robert Wilson', scope: 'Restricted', access: 'Viewer', description: 'Executive reporting and analytics workflows' },
];
