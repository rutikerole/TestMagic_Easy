import { api } from './api'
import type { Project } from './projectTypes';

export const getProjects = () => api.get<Project[]>('/projects');
export const addProject = (project: Project) => api.post('/projects', project);
export const deleteProject = (id: string) => api.delete(`/projects/${id}`);
