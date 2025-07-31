export type ProjectStatus = 'ongoing' | 'completed' | 'triggered';

export type Project = {
  id?: string;
  name: string;
  status: ProjectStatus;
  description?: string;
  testLead: string;
  testers: string[];
  totalTestCases: number;
  completedTestCases: number;
  createdAt: string;
};
