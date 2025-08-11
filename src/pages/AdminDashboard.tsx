import { Button } from '../components/button'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/card';
import { FolderOpen, Calendar, BarChart3, LogOut, Plus, User, ListStartIcon, Eye, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react'
import StatsCard from '../components/statsCards';
import toast from 'react-hot-toast';
import { deleteProject, getProjects } from '../utils/projectServices';
import type { Project } from '../utils/projectTypes';

function AdminDashboard() {
  
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);

  /*
  useEffect(()=>{
    api.get('/projects').then(res => setProjects(res.data))
  })*/

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjects();
        setProjects(res.data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
        toast.error("Failed to load projects. Please try again.");
      } 
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const userString = localStorage.getItem("loggedInUser");
    const user = userString ? JSON.parse(userString) : null;
    if (!user || user.role !== "admin") navigate("/");
  }, [navigate]);

    
  const handleLogout = () => {
    ['userRole', 'userEmail', 'authToken', 'isLoggedIn'].forEach(key => localStorage.removeItem(key));
    toast.success("Logout successful!");
    navigate('/');
  };

  const handleDelete = async (projectId: string) => {
    try {
      await deleteProject(projectId)
      
    } catch {
      toast.error("Failed to delete project")
      
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'triggered': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ongoing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCompletionPercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">

      {/* Navbar */}
      <header className="bg-white shadow-sm border-b-gray-600 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold tracking-tight text-gray-800">Admin Dashboard</h1>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard icon={<FolderOpen />} label="Total Projects" value={projects.length} iconColor="text-blue-600" />
          <StatsCard icon={<ListStartIcon />} label="Triggered Projects" value={projects.filter(p => p.status === 'triggered').length} iconColor="text-violet-600" />
          <StatsCard icon={<Calendar />} label="Ongoing Projects" value={projects.filter(p => p.status === 'ongoing').length} iconColor="text-orange-600" />
          <StatsCard icon={<User />} label="Completed Projects" value={projects.filter(p => p.status === 'completed').length} iconColor="text-green-600" />
        </div>

        {/* Projects Section */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">Projects</h2>
          <Button
            onClick={() => navigate('/add-project')}
            className="bg-blue-600 text-amber-50 hover:bg-blue-700 transition duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Project
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer rounded-2xl border border-gray-200 bg-white">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-semibold text-gray-900">{project.name}</CardTitle>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                <CardDescription className="text-left text-sm text-gray-500 mt-1">
                  Created on {new Date(project.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>

              <CardContent className="text-left space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Test Lead</p>
                  <p className="text-sm text-gray-800">{project.testLead}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Testers</p>
                  <p className="text-sm text-gray-800">{project.testers.join(', ')}</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-gray-600">Progress</p>
                    <p className="text-sm text-gray-800">{project.completedTestCases}/{project.totalTestCases}</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getCompletionPercentage(project.completedTestCases, project.totalTestCases)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {getCompletionPercentage(project.completedTestCases, project.totalTestCases)}% Complete
                  </p>
                </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/project/${project.id}`)}
                  className="flex-1 border-gray-300 text-white bg-blue-600 flex items-center gap-2 hover:bg-green-600 transition"
                ><Eye className="h-4 w-4" />
                  Details
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(project.id!)}
                  className="flex bg-red-600 text-white items-center gap-2 hover:bg-red-700 transition"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>


              </div>
              </CardContent>
            </Card>
          ))}

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
